import "server-only";
import type { Metadata } from "next";
import { getPageAlternates } from "@/lib/directus/queries";
import { assetUrl } from "@/lib/directus/assets";
import type { PageData } from "@/lib/directus/types";
import type { Locale } from "@/lib/i18n/config";

import { getPage } from "@/lib/directus/queries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://reca.kz").replace(/\/$/, "");

// schema.org / OpenGraph want a full locale tag (language_TERRITORY), not the
// bare routing code used in URLs.
const OG_LOCALE: Record<Locale, string> = { ru: "ru_RU", kz: "kk_KZ", en: "en_US" };

/** Fetch a page and build its metadata; shared by the home and [slug] routes. */
export async function getPageMetadata(locale: string, permalink: string): Promise<Metadata> {
	if (!isLocale(locale)) return {};
	const page = await getPage(permalink, locale);
	if (!page) return {};
	return buildMetadata(page, locale, permalink);
}

/** Build page <head> metadata incl. hreflang alternates across locales. */
export async function buildMetadata(page: PageData, locale: Locale, permalink: string): Promise<Metadata> {
	const alternates = await getPageAlternates(permalink);
	const languages: Record<string, string> = {};
	for (const [code, path] of Object.entries(alternates)) {
		languages[code] = `${SITE_URL}/${code}${path === "/" ? "" : path}`;
	}
	// x-default points at the default-locale variant (Google's recommendation
	// for the fallback served to unmatched languages).
	if (languages[defaultLocale]) languages["x-default"] = languages[defaultLocale];

	const canonical = `${SITE_URL}/${locale}${permalink === "/" ? "" : permalink}`;
	const title = page.seo?.title ?? page.title;
	const description = page.seo?.meta_description;
	// Social share title/description can be authored separately; fall back to meta.
	const ogTitle = page.seo?.og_title || title;
	const ogDescription = page.seo?.og_description || description;
	const ogImage = page.seo?.ogImageId ? `${SITE_URL}${assetUrl(page.seo.ogImageId, { width: 1200 })}` : undefined;

	return {
		title,
		description,
		alternates: { canonical, languages },
		robots: page.seo?.no_index ? { index: false, follow: false } : undefined,
		openGraph: {
			type: "website",
			title: ogTitle,
			description: ogDescription,
			url: canonical,
			locale: OG_LOCALE[locale],
			images: ogImage ? [{ url: ogImage, width: 1200 }] : undefined,
		},
		twitter: {
			card: ogImage ? "summary_large_image" : "summary",
			title: ogTitle,
			description: ogDescription,
			images: ogImage ? [ogImage] : undefined,
		},
	};
}
