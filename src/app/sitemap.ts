import type { MetadataRoute } from "next";
import { directusQuery } from "@/lib/directus/client";
import { locales } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

interface SitemapPage {
	seo_url: string;
	seo?: { priority?: number | null; change_frequency?: ChangeFrequency | null } | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const { pages } = await directusQuery<{ pages: SitemapPage[] }>(
		`query { pages(filter: { status: { _eq: "published" } }) { seo_url seo { priority change_frequency } } }`,
	);
	const url = (locale: string, seo: string) => `${SITE_URL}/${locale}${seo === "/" ? "" : seo}`;

	return (pages ?? []).flatMap((p) =>
		locales.map((locale) => ({
			url: url(locale, p.seo_url),
			changeFrequency: p.seo?.change_frequency ?? undefined,
			priority: p.seo?.priority ?? undefined,
			alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l, p.seo_url)])) },
		})),
	);
}
