/**
 * Provisions the full Directus schema for reca.kz. Idempotent — safe to re-run.
 *
 *   node --env-file=.env.local scripts/directus/schema.mjs
 *
 * Model overview (see plan): a page-builder driven, fully translated CMS.
 *   pages ──(M2A page_blocks)──> block_* collections ──> child rows (cards, …)
 *   every content collection has an <name>_translations companion
 *   forms + form_fields drive dynamic forms; leads / applicants capture input
 */
import { api, ensureCollection, ensureField } from "./lib.mjs";
import { ensureTranslations } from "./translations.mjs";
import {
	str, text, richtext, bool, int, json, dropdown, dateCreated,
	fileField, m2oField, o2m, m2a,
} from "./fields.mjs";

const STATUS_FIELD = {
	type: "string",
	meta: {
		interface: "select-dropdown", display: "labels", width: "half",
		options: {
			choices: [
				{ text: "$t:published", value: "published", color: "#2ECDA7" },
				{ text: "$t:draft", value: "draft", color: "#A2B5CD" },
				{ text: "$t:archived", value: "archived", color: "#D3DAE4" },
			],
		},
	},
	schema: { default_value: "draft" },
};
const SORT_FIELD = { type: "integer", meta: { interface: "input", hidden: true }, schema: {} };

const BLOCK_COLLECTIONS = [
	"block_hero", "block_cards", "block_stages", "block_reviews",
	"block_richtext", "block_founder_profile", "block_feature_list", "block_contact", "block_cta",
	"block_form",
];

// ── Base collections ──────────────────────────────────────────────────────

async function languages() {
	log("languages");
	await ensureCollection("languages", {
		meta: { icon: "translate", note: "Site languages (source of truth for locales)" },
		schema: {},
		fields: [
			{ field: "code", type: "string", meta: { interface: "input", width: "half" }, schema: { is_primary_key: true, length: 8 } },
			{ field: "name", type: "string", meta: { interface: "input", width: "half" }, schema: {} },
			{ field: "direction", ...dropdown(["ltr", "rtl"], { schema: { default_value: "ltr" } }) },
			{ field: "sort", ...SORT_FIELD },
		],
	});
}

async function seo() {
	log("seo");
	await ensureCollection("seo", { meta: { icon: "search", note: "Per-page SEO" }, schema: {} });
	await fileField("seo", "og_image");
	await ensureField("seo", "no_index", bool({ meta: { note: "Exclude from search engines" } }));
	// Sitemap hints (language-agnostic, so not translated).
	await ensureField("seo", "priority", {
		type: "float",
		meta: { interface: "slider", note: "Sitemap priority (0.0–1.0), relative importance of this page", width: "half", options: { minValue: 0, maxValue: 1, stepInterval: 0.1 } },
		schema: { default_value: 0.5 },
	});
	await ensureField("seo", "change_frequency", dropdown(
		["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"],
		{ meta: { note: "Sitemap change-frequency hint", width: "half" }, schema: { default_value: "weekly" } },
	));
	await ensureTranslations("seo", [
		{ field: "title", ...str({ meta: { note: "<title> tag (og:title falls back to this)" } }) },
		{ field: "meta_description", ...text({ meta: { note: "meta description (og:description falls back to this)" } }) },
		{ field: "og_title", ...str({ meta: { note: "Social share title (Open Graph / Twitter). Optional — falls back to title." } }) },
		{ field: "og_description", ...text({ meta: { note: "Social share description (Open Graph / Twitter). Optional — falls back to meta description." } }) },
	]);
}

async function forms() {
	log("forms");
	await ensureCollection("forms", { meta: { icon: "dynamic_form", note: "Dynamic forms" }, schema: {} });
	await ensureField("forms", "target_collection", dropdown(
		[{ text: "Leads", value: "leads" }, { text: "Applicants", value: "applicants" }],
		{ meta: { note: "Where submissions are stored" } },
	));
	await ensureTranslations("forms", [
		{ field: "title", ...str({ meta: { note: "Form heading — shown to visitors above the fields" } }) },
		{ field: "submit_label", ...str() },
		{ field: "success_message", ...text() },
	]);

	log("form_fields");
	await ensureCollection("form_fields", { meta: { icon: "input", note: "Fields of a form", sort_field: "sort" }, schema: {} });
	await m2oField("form_fields", "form", "forms", { oneField: "fields", onDelete: "CASCADE" });
	await ensureField("form_fields", "name", str({ meta: { note: "Maps to a column in the target collection" } }));
	await ensureField("form_fields", "type", dropdown(
		["text", "email", "tel", "textarea", "select", "checkbox", "checkbox_group", "radio", "file", "hidden", "divider"],
	));
	await ensureField("form_fields", "required", bool());
	await ensureField("form_fields", "width", dropdown(["full", "half"], { schema: { default_value: "full" } }));
	await ensureField("form_fields", "choices_collection", str({
		meta: { note: "Select options come from this collection (e.g. positions) instead of the choices JSON", width: "half" },
	}));
	await ensureField("form_fields", "sort", SORT_FIELD);
	await o2m("forms", "fields", "form_fields", "form"); // alias on forms, FK already made by m2oField
	await ensureTranslations("form_fields", [
		{ field: "label", ...str() },
		{ field: "placeholder", ...str() },
		{ field: "help_text", ...str() },
		{ field: "choices", ...json({ meta: { note: "[{label, value}] for select/radio/checkbox_group" } }) },
	]);
}

async function reviews() {
	log("reviews");
	await ensureCollection("reviews", { meta: { icon: "reviews", note: "Client testimonials", sort_field: "sort" }, schema: {} });
	await ensureField("reviews", "status", STATUS_FIELD);
	await ensureField("reviews", "company", str());
	await ensureField("reviews", "director", str());
	await ensureField("reviews", "full_text", text());
	await ensureField("reviews", "rating", int({ schema: { default_value: 5 }, meta: { width: "half" } }));
	await ensureField("reviews", "sort", SORT_FIELD);
}

// ── Blocks ────────────────────────────────────────────────────────────────

async function blocks() {
	log("block_hero");
	await ensureCollection("block_hero", { meta: { icon: "call_to_action", note: "Hero block" }, schema: {} });
	await m2oField("block_hero", "form", "forms", { meta: { note: "Form opened by the CTA button" } });
	await ensureTranslations("block_hero", [
		{ field: "title", ...str() }, { field: "suptitle", ...str() },
		{ field: "descr", ...text() }, { field: "secondary_text", ...text() },
		{ field: "button_label", ...str() },
	]);

	log("block_cards + cards");
	await ensureCollection("block_cards", { meta: { icon: "grid_view", note: "Cards block" }, schema: {} });
	await ensureCollection("cards", { meta: { icon: "crop_square", note: "Card", sort_field: "sort", hidden: true }, schema: {} });
	await m2oField("cards", "block_cards", "block_cards", { oneField: "cards", onDelete: "CASCADE" });
	await ensureField("cards", "icon", str({ meta: { note: "Static SVG key from /public/icons" } }));
	await m2oField("cards", "link_page", "pages", { meta: { note: "If set, button links to this page" } });
	await m2oField("cards", "form", "forms", { meta: { note: "If set (and no link_page), button opens this form" } });
	await ensureField("cards", "sort", SORT_FIELD);
	await o2m("block_cards", "cards", "cards", "block_cards");
	await ensureTranslations("block_cards", [{ field: "heading", ...str() }]);
	await ensureTranslations("cards", [
		{ field: "title", ...str() }, { field: "text", ...text() },
		{ field: "text_under", ...str() }, { field: "button_label", ...str() },
	]);

	log("block_stages + stage_items");
	await ensureCollection("block_stages", { meta: { icon: "timeline", note: "Stages block" }, schema: {} });
	await ensureCollection("stage_items", { meta: { icon: "check_circle", note: "Stage", sort_field: "sort", hidden: true }, schema: {} });
	await m2oField("stage_items", "block_stages", "block_stages", { oneField: "stage_items", onDelete: "CASCADE" });
	await ensureField("stage_items", "icon", str({ meta: { note: "Static SVG key" } }));
	await ensureField("stage_items", "sort", SORT_FIELD);
	await o2m("block_stages", "stage_items", "stage_items", "block_stages");
	await ensureTranslations("block_stages", [{ field: "heading", ...str() }]);
	await ensureTranslations("stage_items", [{ field: "title", ...str() }, { field: "text", ...text() }]);

	log("block_reviews");
	await ensureCollection("block_reviews", { meta: { icon: "reviews", note: "Reviews carousel block" }, schema: {} });
	await ensureField("block_reviews", "limit", int({ schema: { default_value: 12 }, meta: { width: "half" } }));
	await ensureTranslations("block_reviews", [{ field: "heading", ...str() }]);

	log("block_richtext");
	await ensureCollection("block_richtext", { meta: { icon: "article", note: "Rich text block" }, schema: {} });
	await ensureTranslations("block_richtext", [
		{ field: "heading", ...str() }, { field: "content", ...richtext() },
	]);

	log("block_founder_profile + founder_principles");
	await ensureCollection("block_founder_profile", { meta: { icon: "person", note: "Founder profile block" }, schema: {} });
	await fileField("block_founder_profile", "photo");
	await ensureCollection("founder_principles", { meta: { icon: "star", note: "Principle", sort_field: "sort", hidden: true }, schema: {} });
	await m2oField("founder_principles", "block_founder_profile", "block_founder_profile", { oneField: "principles", onDelete: "CASCADE" });
	await ensureField("founder_principles", "sort", SORT_FIELD);
	await o2m("block_founder_profile", "principles", "founder_principles", "block_founder_profile");
	await ensureTranslations("block_founder_profile", [
		{ field: "eyebrow_title", ...str() }, { field: "name", ...str() },
		{ field: "intro_content", ...richtext() }, { field: "principles_heading", ...str() },
	]);
	await ensureTranslations("founder_principles", [
		{ field: "title", ...str() }, { field: "points", ...richtext() },
	]);

	log("block_feature_list + feature_items");
	await ensureCollection("block_feature_list", { meta: { icon: "list", note: "Feature list block" }, schema: {} });
	await ensureCollection("feature_items", { meta: { icon: "label", note: "Feature", sort_field: "sort", hidden: true }, schema: {} });
	await m2oField("feature_items", "block_feature_list", "block_feature_list", { oneField: "items", onDelete: "CASCADE" });
	await ensureField("feature_items", "icon", str({ meta: { note: "react-icons key" } }));
	await ensureField("feature_items", "sort", SORT_FIELD);
	await o2m("block_feature_list", "items", "feature_items", "block_feature_list");
	await ensureTranslations("block_feature_list", [{ field: "heading", ...str() }]);
	await ensureTranslations("feature_items", [{ field: "title", ...str() }, { field: "text", ...text() }]);

	log("block_contact");
	await ensureCollection("block_contact", { meta: { icon: "contact_mail", note: "Contact block" }, schema: {} });
	await m2oField("block_contact", "form", "forms");
	await ensureField("block_contact", "show_map", bool({ default: true }));
	await ensureTranslations("block_contact", [{ field: "heading", ...str() }]);

	log("block_cta");
	await ensureCollection("block_cta", { meta: { icon: "ads_click", note: "CTA banner block (button opens a form modal)" }, schema: {} });
	await m2oField("block_cta", "form", "forms", { meta: { note: "Form opened by the CTA button" } });
	await ensureTranslations("block_cta", [
		{ field: "eyebrow", ...str() }, { field: "heading", ...str() },
		{ field: "subheading", ...text() }, { field: "button_label", ...str() },
	]);

	log("block_form");
	await ensureCollection("block_form", { meta: { icon: "assignment_ind", note: "Inline form block (heading + form on page)" }, schema: {} });
	await m2oField("block_form", "form", "forms", { meta: { note: "Form rendered on the page" } });
	await ensureTranslations("block_form", [{ field: "heading", ...str() }, { field: "subheading", ...text() }]);
}

// ── Pages (base + relations) ───────────────────────────────────────────────

async function pagesBase() {
	log("pages (base)");
	// Pages are a language-agnostic structure: slug + which blocks + which SEO.
	// Text lives in the (translated) blocks and SEO — the page itself is not
	// translated (single slug, the locale prefix separates languages).
	await ensureCollection("pages", { meta: { icon: "web", note: "Site pages (page builder)", sort_field: "sort" }, schema: {} });
	await ensureField("pages", "status", STATUS_FIELD);
	await ensureField("pages", "sort", SORT_FIELD);
	await ensureField("pages", "seo_url", str({ meta: { note: "URL path (same across languages), e.g. /employers", width: "half" }, schema: { is_unique: true } }));
	await ensureField("pages", "title", str({ meta: { note: "Internal admin title (not rendered)", width: "half" } }));
}

async function pagesRelations() {
	log("pages (relations)");
	await m2oField("pages", "seo", "seo", { meta: { note: "SEO for this page" } });
	await ensureCollection("page_blocks", { meta: { icon: "widgets", note: "Page builder junction", hidden: true }, schema: {} });
	await m2a("pages", "blocks", "page_blocks", "pages_id", BLOCK_COLLECTIONS);
}

// ── Submissions ────────────────────────────────────────────────────────────

async function leads() {
	log("leads");
	await ensureCollection("leads", { meta: { icon: "inbox", note: "Contact / order submissions" }, schema: {} });
	await ensureField("leads", "status", dropdown(
		[{ text: "New", value: "new" }, { text: "Contacted", value: "contacted" }, { text: "Closed", value: "closed" }],
		{ schema: { default_value: "new" }, meta: { width: "half" } },
	));
	await ensureField("leads", "name", str());
	await ensureField("leads", "email", str());
	await ensureField("leads", "phone", str());
	await ensureField("leads", "subject", str());
	await ensureField("leads", "company", str());
	await ensureField("leads", "position", str({ meta: { note: "Role the client wants to fill" } }));
	await ensureField("leads", "selections", json({ meta: { note: "Selected services" } }));
	await ensureField("leads", "details", json({ meta: { note: "Answers to form fields without a dedicated column" } }));
	await m2oField("leads", "source_page", "pages");
	await m2oField("leads", "source_language", "languages", { type: "string" });
	await ensureField("leads", "date_created", dateCreated());
}

/**
 * Job positions dictionary: feeds the CV form dropdown (via
 * form_fields.choices_collection) and is referenced by applicants.position,
 * so resumes can be filtered/sorted by a stable value in the admin.
 */
async function positions() {
	log("positions");
	await ensureCollection("positions", {
		meta: { icon: "badge", note: "Job positions (CV form dropdown / applicants filter)", sort_field: "sort", display_template: "{{name}}" },
		schema: {},
	});
	await ensureField("positions", "name", str({ meta: { note: "Canonical (RU) title — shown in admin" } }));
	await ensureField("positions", "sort", SORT_FIELD);
	await ensureTranslations("positions", [{ field: "name", ...str() }]);
}

/** Ensure a directus_files folder exists (uploads are routed into it by name). */
async function ensureFolder(name) {
	const found = await api("GET", `/folders?filter[name][_eq]=${encodeURIComponent(name)}&limit=1`);
	if (Array.isArray(found) && found.length) {
		console.log(`  = folder ${name} (exists)`);
		return;
	}
	await api("POST", "/folders", { name });
	console.log(`  + folder ${name}`);
}

async function applicants() {
	log("applicants");
	await ensureFolder("CV"); // uploaded resumes land here (see /api/forms/submit)
	await ensureCollection("applicants", { meta: { icon: "person_add", note: "CV applications" }, schema: {} });
	await ensureField("applicants", "status", dropdown(
		[{ text: "New", value: "new" }, { text: "Reviewed", value: "reviewed" }, { text: "Contacted", value: "contacted" }],
		{ schema: { default_value: "new" }, meta: { width: "half" } },
	));
	await ensureField("applicants", "name", str());
	await ensureField("applicants", "last_name", str());
	await ensureField("applicants", "email", str());
	await ensureField("applicants", "phone", str());
	await m2oField("applicants", "position", "positions", { meta: { note: "Desired position" } });
	await fileField("applicants", "file");
	await ensureField("applicants", "details", json({ meta: { note: "Answers to form fields without a dedicated column" } }));
	await m2oField("applicants", "source_page", "pages");
	await m2oField("applicants", "source_language", "languages", { type: "string" });
	await ensureField("applicants", "date_created", dateCreated());
}

// ── Global settings, navigation, UI strings ────────────────────────────────

async function siteSettings() {
	log("site_settings");
	await ensureCollection("site_settings", { meta: { icon: "settings", singleton: true, note: "Global site settings" }, schema: {} });
	await fileField("site_settings", "logo");
	await fileField("site_settings", "logo_dark");
	await ensureField("site_settings", "email", str());
	await ensureField("site_settings", "phone", str());
	await ensureField("site_settings", "address", str());
	await ensureField("site_settings", "social_links", json({
		meta: {
			note: "[{platform, url}]",
			options: { fields: [
				{ field: "platform", type: "string", meta: { interface: "input", width: "half" } },
				{ field: "url", type: "string", meta: { interface: "input", width: "half" } },
			] },
		},
	}));
	await ensureTranslations("site_settings", [
		{ field: "site_name", ...str() }, { field: "footer_text", ...richtext() },
	]);
}

const LINK_TYPE = dropdown(
	[{ text: "Page", value: "page" }, { text: "Anchor", value: "anchor" }, { text: "External", value: "external" }],
	{ schema: { default_value: "page" } },
);

/** Add the standard destination fields (page/anchor/external) to a link collection. */
async function linkFields(collection) {
	await ensureField(collection, "link_type", LINK_TYPE);
	await m2oField(collection, "page", "pages");
	await ensureField(collection, "anchor", str({ meta: { note: "e.g. #contact" } }));
	await ensureField(collection, "external_url", str());
	await ensureField(collection, "open_in_new_tab", bool());
	await ensureField(collection, "sort", SORT_FIELD);
}

async function navbar() {
	log("navbar_links");
	await ensureCollection("navbar_links", { meta: { icon: "menu", note: "Header navigation links", sort_field: "sort" }, schema: {} });
	await linkFields("navbar_links");
	await ensureTranslations("navbar_links", [{ field: "title", ...str() }]);
}

async function footer() {
	log("footer_sections + footer_links");
	// A footer is columns ("sections"), each with a heading and a list of links.
	await ensureCollection("footer_sections", { meta: { icon: "view_column", note: "Footer columns (heading + links)", sort_field: "sort" }, schema: {} });
	await ensureField("footer_sections", "sort", SORT_FIELD);
	await ensureCollection("footer_links", { meta: { icon: "link", note: "Link in a footer column", sort_field: "sort", hidden: true }, schema: {} });
	await m2oField("footer_links", "footer_section", "footer_sections", { oneField: "links", onDelete: "CASCADE" });
	await linkFields("footer_links");
	await o2m("footer_sections", "links", "footer_links", "footer_section");
	await ensureTranslations("footer_sections", [{ field: "title", ...str() }]);
	await ensureTranslations("footer_links", [{ field: "label", ...str() }]);
}

async function uiStrings() {
	log("ui_strings");
	await ensureCollection("ui_strings", { meta: { icon: "abc", note: "Interface strings (all UI text, no hardcode)" }, schema: {} });
	await ensureField("ui_strings", "key", str({ meta: { note: "Namespaced, e.g. common.submit" }, schema: { is_unique: true } }));
	await ensureField("ui_strings", "notes", str({ meta: { note: "Context for editors" } }));
	await ensureTranslations("ui_strings", [{ field: "value", ...text() }]);
}

// ── Runner ──────────────────────────────────────────────────────────────────

function log(s) { console.log(s); }

async function main() {
	const me = await api("GET", "/users/me?fields[]=id");
	console.log(`Connected as ${me.id}\n`);

	await languages();
	await seo();
	await forms();
	await reviews();
	await pagesBase();
	await blocks();
	await pagesRelations();
	await leads();
	await positions();
	await applicants();
	await siteSettings();
	await navbar();
	await footer();
	await uiStrings();

	console.log("\n✓ Schema provisioned.");
	console.log("Now re-run role.mjs — the Website Service role only sees collections that existed when it was last provisioned.");
}

main().catch((err) => {
	console.error("\nFAILED:", err.message);
	process.exit(1);
});
