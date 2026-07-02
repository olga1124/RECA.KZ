import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo/metadata";
import PageView from "@/components/PageView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return getPageMetadata(locale, "/");
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	return <PageView locale={locale} permalink="/" />;
}
