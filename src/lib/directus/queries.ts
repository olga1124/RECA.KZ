import "server-only";
import { cache } from "react";
import { directusQuery } from "./client";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import type {
	PageData, BlockData, SiteSettings, NavItem, FooterSection, Review, FormData,
} from "./types";

/** Pick the translation for `locale`, falling back to RU, then the first. */
function pickTr<T extends { languages_code?: { code: string } | string }>(
	translations: T[] | undefined,
	locale: Locale,
): Partial<T> {
	if (!translations?.length) return {};
	const code = (t: T) => (typeof t.languages_code === "string" ? t.languages_code : t.languages_code?.code);
	return (
		translations.find((t) => code(t) === locale) ??
		translations.find((t) => code(t) === defaultLocale) ??
		translations[0]
	);
}

// Fetch translations for the active locale + RU fallback only.
const TR_FILTER = `(filter: { languages_code: { code: { _in: [$lang, "ru"] } } })`;

const PAGE_QUERY = `
query Page($permalink: String!, $lang: String!) {
  pages(filter: { seo_url: { _eq: $permalink } }, limit: 1) {
    id
    seo_url
    title
    seo {
      no_index
      og_image { id }
      translations${TR_FILTER} { languages_code { code } title meta_description }
    }
    blocks(sort: ["sort"]) {
      collection
      item {
        __typename
        ... on block_hero { form { id } translations${TR_FILTER} { languages_code { code } title suptitle descr secondary_text button_label } }
        ... on block_cards {
          translations${TR_FILTER} { languages_code { code } heading }
          cards(sort: ["sort"]) { icon form { id } link_page { seo_url } translations${TR_FILTER} { languages_code { code } title text text_under button_label } }
        }
        ... on block_stages {
          translations${TR_FILTER} { languages_code { code } heading }
          stage_items(sort: ["sort"]) { icon translations${TR_FILTER} { languages_code { code } title text } }
        }
        ... on block_reviews { limit translations${TR_FILTER} { languages_code { code } heading } }
        ... on block_richtext { translations${TR_FILTER} { languages_code { code } heading content } }
        ... on block_founder_profile {
          photo { id }
          translations${TR_FILTER} { languages_code { code } eyebrow_title name intro_content principles_heading }
          principles(sort: ["sort"]) { translations${TR_FILTER} { languages_code { code } title points } }
        }
        ... on block_feature_list {
          translations${TR_FILTER} { languages_code { code } heading }
          items(sort: ["sort"]) { icon translations${TR_FILTER} { languages_code { code } title text } }
        }
        ... on block_contact { show_map form { id } translations${TR_FILTER} { languages_code { code } heading } }
        ... on block_cta { form { id } translations${TR_FILTER} { languages_code { code } eyebrow heading subheading button_label } }
      }
    }
  }
}`;

interface RawPage {
	id: string;
	seo_url: string;
	title: string;
	seo?: {
		no_index?: boolean;
		og_image?: { id: string } | null;
		translations?: { title?: string; meta_description?: string }[];
	} | null;
	blocks: { collection: string; item: any }[];
}

function mapBlocks(raw: RawPage["blocks"], locale: Locale): BlockData[] {
	const out: BlockData[] = [];
	for (const b of raw) {
		const it = b.item;
		if (!it) continue;
		const t = pickTr(it.translations, locale) as any;
		switch (b.collection) {
			case "block_hero":
				out.push({ collection: "block_hero", data: {
					title: t.title, suptitle: t.suptitle, descr: t.descr,
					secondary_text: t.secondary_text, button_label: t.button_label,
					formId: it.form?.id ?? null,
				} });
				break;
			case "block_cards":
				out.push({ collection: "block_cards", data: {
					heading: t.heading,
					cards: (it.cards ?? []).map((c: any) => {
						const ct = pickTr(c.translations, locale) as any;
						return {
							icon: c.icon, formId: c.form?.id ?? null,
							linkPermalink: c.link_page?.seo_url ?? null,
							title: ct.title, text: ct.text, text_under: ct.text_under, button_label: ct.button_label,
						};
					}),
				} });
				break;
			case "block_stages":
				out.push({ collection: "block_stages", data: {
					heading: t.heading,
					items: (it.stage_items ?? []).map((s: any) => {
						const st = pickTr(s.translations, locale) as any;
						return { icon: s.icon, title: st.title, text: st.text };
					}),
				} });
				break;
			case "block_reviews":
				out.push({ collection: "block_reviews", data: { heading: t.heading, limit: it.limit ?? 12 } });
				break;
			case "block_richtext":
				out.push({ collection: "block_richtext", data: { heading: t.heading, content: t.content ?? "" } });
				break;
			case "block_founder_profile":
				out.push({ collection: "block_founder_profile", data: {
					photoId: it.photo?.id ?? null,
					eyebrow_title: t.eyebrow_title, name: t.name,
					intro_content: t.intro_content, principles_heading: t.principles_heading,
					principles: (it.principles ?? []).map((p: any) => {
						const pt = pickTr(p.translations, locale) as any;
						return { title: pt.title, points: pt.points };
					}),
				} });
				break;
			case "block_feature_list":
				out.push({ collection: "block_feature_list", data: {
					heading: t.heading,
					items: (it.items ?? []).map((f: any) => {
						const ft = pickTr(f.translations, locale) as any;
						return { icon: f.icon, title: ft.title, text: ft.text };
					}),
				} });
				break;
			case "block_contact":
				out.push({ collection: "block_contact", data: {
					heading: t.heading, show_map: it.show_map ?? true, formId: it.form?.id ?? null,
				} });
				break;
			case "block_cta":
				out.push({ collection: "block_cta", data: {
					eyebrow: t.eyebrow, heading: t.heading, subheading: t.subheading,
					button_label: t.button_label, formId: it.form?.id ?? null,
				} });
				break;
		}
	}
	return out;
}

export const getPage = cache(async (permalink: string, locale: Locale): Promise<PageData | null> => {
	const { pages } = await directusQuery<{ pages: RawPage[] }>(PAGE_QUERY, { permalink, lang: locale });
	const raw = pages?.[0];
	if (!raw) return null;
	const seoTr = pickTr(raw.seo?.translations as any, locale) as any;
	return {
		id: raw.id,
		permalink: raw.seo_url ?? permalink,
		title: raw.title ?? "",
		seo: raw.seo
			? { title: seoTr?.title, meta_description: seoTr?.meta_description, ogImageId: raw.seo.og_image?.id ?? null, no_index: raw.seo.no_index }
			: undefined,
		blocks: mapBlocks(raw.blocks, locale),
	};
});

/**
 * hreflang alternates. The slug is shared across languages and every page is
 * available in every locale (shared structure, translated blocks), so the page
 * maps to the same permalink under each locale.
 */
export const getPageAlternates = cache(async (permalink: string): Promise<Record<string, string>> => {
	const q = `query($permalink: String!) { pages(filter: { seo_url: { _eq: $permalink } }, limit: 1) { seo_url } }`;
	const { pages } = await directusQuery<{ pages: { seo_url: string }[] }>(q, { permalink });
	if (!pages?.length) return {};
	return Object.fromEntries(locales.map((l) => [l, permalink]));
});

export const getSiteSettings = cache(async (locale: Locale): Promise<SiteSettings> => {
	const q = `query($lang: String!) {
		site_settings {
			email phone address social_links
			logo { id } logo_dark { id }
			translations${TR_FILTER} { languages_code { code } site_name footer_text }
		}
	}`;
	const { site_settings } = await directusQuery<{ site_settings: any }>(q, { lang: locale });
	const s = site_settings ?? {};
	const t = pickTr(s.translations, locale) as any;
	return {
		email: s.email, phone: s.phone, address: s.address,
		social_links: s.social_links ?? [],
		logoId: s.logo?.id ?? null, logoDarkId: s.logo_dark?.id ?? null,
		site_name: t.site_name, footer_text: t.footer_text,
	};
});

function mapLink(n: any, locale: Locale, titleField: string): NavItem {
	return {
		title: (pickTr(n.translations, locale) as any)[titleField] ?? "",
		link_type: n.link_type,
		permalink: n.page?.seo_url ?? null,
		anchor: n.anchor,
		external_url: n.external_url,
		open_in_new_tab: n.open_in_new_tab,
	};
}

export const getNavbar = cache(async (locale: Locale): Promise<NavItem[]> => {
	const q = `query($lang: String!) {
		navbar_links(sort: ["sort"]) {
			link_type anchor external_url open_in_new_tab
			page { seo_url }
			translations${TR_FILTER} { languages_code { code } title }
		}
	}`;
	const { navbar_links } = await directusQuery<{ navbar_links: any[] }>(q, { lang: locale });
	return (navbar_links ?? []).map((n) => mapLink(n, locale, "title"));
});

export const getFooter = cache(async (locale: Locale): Promise<FooterSection[]> => {
	const q = `query($lang: String!) {
		footer_sections(sort: ["sort"]) {
			translations${TR_FILTER} { languages_code { code } title }
			links(sort: ["sort"]) {
				link_type anchor external_url open_in_new_tab
				page { seo_url }
				translations${TR_FILTER} { languages_code { code } label }
			}
		}
	}`;
	const { footer_sections } = await directusQuery<{ footer_sections: any[] }>(q, { lang: locale });
	return (footer_sections ?? []).map((s) => ({
		title: (pickTr(s.translations, locale) as any).title ?? "",
		links: (s.links ?? []).map((l: any) => mapLink(l, locale, "label")),
	}));
});

export const getReviews = cache(async (limit: number): Promise<Review[]> => {
	const q = `query($limit: Int!) {
		reviews(filter: { status: { _eq: "published" } }, sort: ["sort"], limit: $limit) {
			company director full_text rating
		}
	}`;
	const { reviews } = await directusQuery<{ reviews: Review[] }>(q, { limit });
	return reviews ?? [];
});

export const getUiStrings = cache(async (locale: Locale) => {
	const q = `query($lang: String!) {
		ui_strings(limit: -1) { key translations${TR_FILTER} { languages_code { code } value } }
	}`;
	const { ui_strings } = await directusQuery<{ ui_strings: any[] }>(q, { lang: locale });
	const map = new Map<string, string>();
	for (const s of ui_strings ?? []) map.set(s.key, (pickTr(s.translations, locale) as any).value ?? "");
	return (key: string, fallback = "") => map.get(key) || fallback;
});

export const getForm = cache(async (id: string, locale: Locale): Promise<FormData | null> => {
	const q = `query($id: ID!, $lang: String!) {
		forms_by_id(id: $id) {
			id target_collection
			translations${TR_FILTER} { languages_code { code } title submit_label success_message }
			fields(sort: ["sort"]) {
				name type required width
				translations${TR_FILTER} { languages_code { code } label placeholder help_text choices }
			}
		}
	}`;
	const { forms_by_id } = await directusQuery<{ forms_by_id: any }>(q, { id, lang: locale });
	if (!forms_by_id) return null;
	const t = pickTr(forms_by_id.translations, locale) as any;
	return {
		id: forms_by_id.id,
		target_collection: forms_by_id.target_collection,
		title: t.title,
		submit_label: t.submit_label,
		success_message: t.success_message,
		fields: (forms_by_id.fields ?? []).map((f: any) => {
			const ft = pickTr(f.translations, locale) as any;
			return {
				name: f.name, type: f.type, required: f.required, width: f.width,
				label: ft.label, placeholder: ft.placeholder, help_text: ft.help_text,
				choices: ft.choices ?? undefined,
			};
		}),
	};
});
