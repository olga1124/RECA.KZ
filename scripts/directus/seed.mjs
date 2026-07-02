/**
 * Seeds site content into Directus. Idempotent via reset-then-create:
 * clears content collections (not schema, not leads/applicants) and recreates
 * from scripts/directus/content*.mjs.
 *
 *   node --env-file=.env.local scripts/directus/seed.mjs
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { api, BASE, TOKEN } from "./lib.mjs";
import { siteSettings, uiStrings, reviews, navbar, footer, forms } from "./content.mjs";
import { pages } from "./content-pages.mjs";

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "public");
const LANGS = ["ru", "kz", "en"];

// Parent collections; their translations/children cascade on delete.
const CONTENT_COLLECTIONS = [
	"pages", "seo", "reviews", "navbar_links", "footer_sections", "ui_strings", "forms",
	"block_hero", "block_cards", "block_stages", "block_reviews", "block_richtext",
	"block_founder_profile", "block_feature_list", "block_contact",
];

// ── helpers ─────────────────────────────────────────────────────────────────

async function deleteAll(collection) {
	const rows = await api("GET", `/items/${collection}?fields=id&limit=-1`);
	const ids = (rows || []).map((r) => r.id);
	if (ids.length) await api("DELETE", `/items/${collection}`, ids);
}

/** Turn a { ru, kz, en } map into a Directus translations array. */
const toTranslations = (tr) => LANGS.filter((l) => tr[l]).map((l) => ({ languages_code: l, ...tr[l] }));

async function uploadFile(filename, title) {
	// Reuse if already uploaded (by title)
	const existing = await api("GET", `/files?filter[title][_eq]=${encodeURIComponent(title)}&fields=id&limit=1`);
	if (Array.isArray(existing) && existing.length) return existing[0].id;

	const buf = await readFile(join(PUBLIC, filename));
	const form = new FormData();
	form.append("title", title);
	form.append("file", new Blob([buf]), filename);
	const res = await fetch(`${BASE}/files`, {
		method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: form,
	});
	if (!res.ok) throw new Error(`upload ${filename} → ${res.status}\n${await res.text()}`);
	const { data } = await res.json();
	console.log(`  + file ${filename} → ${data.id}`);
	return data.id;
}

// ── seed steps ────────────────────────────────────────────────────────────────

async function seedLanguages() {
	console.log("languages");
	for (const l of [
		{ code: "ru", name: "Русский", direction: "ltr", sort: 1 },
		{ code: "kz", name: "Қазақша", direction: "ltr", sort: 2 },
		{ code: "en", name: "English", direction: "ltr", sort: 3 },
	]) {
		const ex = await api("GET", `/items/languages/${l.code}`, null, { allowStatus: [403, 404] });
		if (ex && ex.code) await api("PATCH", `/items/languages/${l.code}`, l);
		else await api("POST", "/items/languages", l);
	}
}

async function seedSiteSettings(files) {
	console.log("site_settings");
	await deleteAll("site_settings_translations");
	await api("PATCH", "/items/site_settings", {
		...siteSettings.base,
		logo: files.logo,
		logo_dark: files.logoDark,
		translations: toTranslations(siteSettings.tr),
	});
}

async function seedUiStrings() {
	console.log(`ui_strings (${Object.keys(uiStrings).length})`);
	for (const [key, tr] of Object.entries(uiStrings)) {
		await api("POST", "/items/ui_strings", {
			key,
			translations: LANGS.map((l) => ({ languages_code: l, value: tr[l] })),
		});
	}
}

async function seedReviews() {
	console.log(`reviews (${reviews.length})`);
	let sort = 1;
	for (const r of reviews) await api("POST", "/items/reviews", { ...r, status: "published", sort: sort++ });
}

async function seedForms() {
	console.log("forms");
	const map = {};
	for (const [key, f] of Object.entries(forms)) {
		const fields = f.fields.map((fld) => {
			const { tr, choices, ...base } = fld;
			const translations = LANGS.map((l) => {
				const row = { languages_code: l, ...(tr[l] || {}) };
				if (choices) row.choices = choices.map((c) => ({ value: c.ru, label: c[l] }));
				return row;
			});
			return { ...base, translations };
		});
		const created = await api("POST", "/items/forms", {
			target_collection: f.target_collection,
			translations: toTranslations(f.tr),
			fields,
		});
		map[key] = created.id;
		console.log(`  + form ${key} → ${created.id}`);
	}
	return map;
}

/** Build a single block item; returns { collection, id }. */
async function createBlock(block, ctx) {
	const { type, tr, cards, items, principles, form, link_page, photo, ...base } = block;
	const payload = { ...base, translations: toTranslations(tr) };
	if (form) payload.form = ctx.forms[form];
	if (photo) payload.photo = ctx.files[photo];

	if (cards) {
		payload.cards = cards.map((c) => {
			const { tr, form, link_page, ...cb } = c;
			const row = { ...cb, translations: toTranslations(tr) };
			if (form) row.form = ctx.forms[form];
			// link_page resolved in a second pass (pages don't exist yet)
			if (link_page) row._linkPermalink = undefined; // placeholder; handled post-hoc
			return row;
		});
	}
	if (items) payload.items = items.map((i) => { const { tr, ...ib } = i; return { ...ib, translations: toTranslations(tr) }; });
	if (principles) payload.principles = principles.map((p) => ({ translations: toTranslations(p.tr) }));

	const created = await api("POST", `/items/${type}`, payload);
	return { collection: type, id: created.id, cardLinks: cards?.map((c) => c.link_page) ?? null };
}

async function seedPages(ctx) {
	console.log("pages");
	const permalinkToId = {};
	const cardPatches = []; // { cardsBlockId, links: [permalink|null] }

	for (const page of pages) {
		const blockRefs = [];
		for (const block of page.blocks) {
			const { collection, id, cardLinks } = await createBlock(block, ctx);
			blockRefs.push({ collection, item: { id } });
			if (collection === "block_cards" && cardLinks) cardPatches.push({ blockId: id, links: cardLinks });
		}
		const created = await api("POST", "/items/pages", {
			status: "published",
			sort: pages.indexOf(page) + 1,
			seo_url: page.permalink.ru, // single slug, same across languages
			title: page.adminTitle.ru,
			seo: { translations: toTranslations(page.seo) },
			blocks: blockRefs,
		});
		permalinkToId[page.permalink.ru] = created.id;
		console.log(`  + page ${page.permalink.ru} → ${created.id}`);
	}

	// Second pass: resolve card link_page permalinks → page ids
	for (const patch of cardPatches) {
		const cards = await api("GET", `/items/cards?filter[block_cards][_eq]=${patch.blockId}&sort=sort&fields=id&limit=-1`);
		for (let i = 0; i < cards.length; i++) {
			const permalink = patch.links[i];
			if (permalink && permalinkToId[permalink]) {
				await api("PATCH", `/items/cards/${cards[i].id}`, { link_page: permalinkToId[permalink] });
			}
		}
	}
	return permalinkToId;
}

async function seedNavbar(permalinkToId) {
	console.log(`navbar_links (${navbar.length})`);
	for (const n of navbar) {
		const { title, permalink, ...base } = n;
		const payload = { ...base, translations: LANGS.map((l) => ({ languages_code: l, title: title[l] })) };
		if (permalink && permalinkToId[permalink]) payload.page = permalinkToId[permalink];
		await api("POST", "/items/navbar_links", payload);
	}
}

async function seedFooter(permalinkToId) {
	console.log(`footer_sections (${footer.length})`);
	for (const section of footer) {
		const links = section.links.map((lnk) => {
			const { label, permalink, ...base } = lnk;
			const row = { ...base, translations: LANGS.map((l) => ({ languages_code: l, label: label[l] })) };
			if (permalink && permalinkToId[permalink]) row.page = permalinkToId[permalink];
			return row;
		});
		await api("POST", "/items/footer_sections", {
			sort: section.sort,
			translations: LANGS.map((l) => ({ languages_code: l, title: section.title[l] })),
			links,
		});
	}
}

// ── run ───────────────────────────────────────────────────────────────────────

async function main() {
	await seedLanguages();

	console.log("reset content…");
	for (const c of CONTENT_COLLECTIONS) await deleteAll(c);

	const files = {
		logo: await uploadFile("logo.svg", "seed:logo"),
		logoDark: await uploadFile("logo-light.svg", "seed:logo-dark"),
		founder: await uploadFile("reca-founder.jpeg", "seed:reca-founder"),
	};
	const ctx = { forms: await seedForms(), files: { "reca-founder.jpeg": files.founder } };

	await seedSiteSettings(files);
	await seedUiStrings();
	await seedReviews();
	const permalinkToId = await seedPages(ctx);
	await seedNavbar(permalinkToId);
	await seedFooter(permalinkToId);

	console.log("\n✓ Content seeded.");
}

main().catch((err) => {
	console.error("\nFAILED:", err.message);
	process.exit(1);
});
