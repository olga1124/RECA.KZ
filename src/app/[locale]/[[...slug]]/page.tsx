import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPage } from "@/lib/directus/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd } from "@/lib/seo/jsonld";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export const dynamic = "force-dynamic";

type Params = { locale: string; slug?: string[] };

function permalinkOf(slug?: string[]) {
	return "/" + (slug?.join("/") ?? "");
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
	const { locale, slug } = await params;
	if (!isLocale(locale)) return {};
	const permalink = permalinkOf(slug);
	const page = await getPage(permalink, locale as Locale);
	if (!page) return {};
	return buildMetadata(page, locale as Locale, permalink);
}

export default async function Page({ params }: { params: Promise<Params> }) {
	const { locale, slug } = await params;
	if (!isLocale(locale)) notFound();
	const permalink = permalinkOf(slug);
	const page = await getPage(permalink, locale as Locale);
	if (!page) notFound();

	return (
		<>
			<WebPageJsonLd title={page.seo?.title ?? page.title} description={page.seo?.meta_description} />
			<BlockRenderer blocks={page.blocks} locale={locale as Locale} />
		</>
	);
}
