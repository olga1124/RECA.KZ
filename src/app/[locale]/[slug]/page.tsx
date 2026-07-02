import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo/metadata";
import PageView from "@/components/PageView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
	const { locale, slug } = await params;
	return getPageMetadata(locale, `/${slug}`);
}

export default async function SubPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
	const { locale, slug } = await params;
	return <PageView locale={locale} permalink={`/${slug}`} />;
}
