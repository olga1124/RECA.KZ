import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getSiteSettings, getNavbar, getFooter, getUiStrings } from "@/lib/directus/queries";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallbackBtn from "@/components/Buttons/CallbackBtn";
import ModalProvider from "@/components/modal/ModalProvider";
import { OrganizationJsonLd } from "@/lib/seo/jsonld";

const pnt = localFont({
	src: [
		{ path: "../../assets/fonts/pnt/Panton-Bold.woff2", weight: "700", style: "normal" },
		{ path: "../../assets/fonts/pnt/Panton-SemiBold.woff2", weight: "600", style: "normal" },
		{ path: "../../assets/fonts/pnt/Panton-Regular.woff2", weight: "400", style: "normal" },
		{ path: "../../assets/fonts/pnt/Panton-Light.woff2", weight: "300", style: "normal" },
	],
	variable: "--font-pnt",
});

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();

	const [settings, nav, footerSections, t] = await Promise.all([
		getSiteSettings(locale as Locale),
		getNavbar(locale as Locale),
		getFooter(locale as Locale),
		getUiStrings(locale as Locale),
	]);

	return (
		<html lang={locale}>
			<body className={pnt.variable}>
				<OrganizationJsonLd settings={settings} />
				<ModalProvider>
					<Navbar locale={locale as Locale} nav={nav} logoId={settings.logoId} />
					<main id="main" className="container">
						{children}
					</main>
					<Footer locale={locale as Locale} sections={footerSections} settings={settings} t={t} />
					<CallbackBtn phone={settings.phone} />
				</ModalProvider>
			</body>
		</html>
	);
}
