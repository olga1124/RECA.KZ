import type { MetadataRoute } from "next";
import { directusQuery } from "@/lib/directus/client";
import { locales } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const { pages } = await directusQuery<{ pages: { seo_url: string }[] }>(
		`query { pages(filter: { status: { _eq: "published" } }) { seo_url } }`,
	);
	const url = (locale: string, seo: string) => `${SITE_URL}/${locale}${seo === "/" ? "" : seo}`;

	return (pages ?? []).flatMap((p) =>
		locales.map((locale) => ({
			url: url(locale, p.seo_url),
			alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l, p.seo_url)])) },
		})),
	);
}
