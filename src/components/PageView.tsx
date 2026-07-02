import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPage } from "@/lib/directus/queries";
import { WebPageJsonLd } from "@/lib/seo/jsonld";
import BlockRenderer from "@/components/blocks/BlockRenderer";

/**
 * Shared page renderer used by both the locale home (`[locale]/page.tsx`) and
 * sub-pages (`[locale]/[slug]/page.tsx`) — one place fetches and renders, so the
 * two thin route files don't duplicate logic.
 */
export default async function PageView({ locale, permalink }: { locale: string; permalink: string }) {
	if (!isLocale(locale)) notFound();
	const page = await getPage(permalink, locale as Locale);
	if (!page) notFound();

	return (
		<>
			<WebPageJsonLd title={page.seo?.title ?? page.title} description={page.seo?.meta_description} />
			<BlockRenderer blocks={page.blocks} locale={locale as Locale} />
		</>
	);
}
