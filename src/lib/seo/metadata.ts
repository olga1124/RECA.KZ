import "server-only";
import type { Metadata } from "next";
import { getPageAlternates } from "@/lib/directus/queries";
import { assetUrl } from "@/lib/directus/assets";
import type { PageData } from "@/lib/directus/types";
import type { Locale } from "@/lib/i18n/config";

import { getPage } from "@/lib/directus/queries";
import { isLocale } from "@/lib/i18n/config";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://reca.kz").replace(/\/$/, "");

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
	const canonical = `${SITE_URL}/${locale}${permalink === "/" ? "" : permalink}`;
	const ogImage = page.seo?.ogImageId ? `${SITE_URL}${assetUrl(page.seo.ogImageId, { width: 1200 })}` : undefined;

	return {
		title: page.seo?.title ?? page.title,
		description: page.seo?.meta_description,
		alternates: { canonical, languages },
		robots: page.seo?.no_index ? { index: false, follow: false } : undefined,
		openGraph: {
			title: page.seo?.title ?? page.title,
			description: page.seo?.meta_description,
			url: canonical,
			locale,
			images: ogImage ? [{ url: ogImage, width: 1200 }] : undefined,
		},
	};
}
