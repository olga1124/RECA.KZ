import { notFound } from "next/navigation";
import { Manrope } from "next/font/google";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getSiteSettings, getNavbar, getFooter, getUiStrings } from "@/lib/directus/queries";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallbackBtn from "@/components/Buttons/CallbackBtn";
import ModalProvider from "@/components/modal/ModalProvider";
import { OrganizationJsonLd } from "@/lib/seo/jsonld";
import styles from "./layout.module.css";

const sans = Manrope({
	subsets: ["latin", "cyrillic"],
	weight: ["400", "500", "600", "700", "800"],
	variable: "--font-sans",
	display: "swap",
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
			<body className={sans.variable}>
				<OrganizationJsonLd settings={settings} />
				<ModalProvider>
					<div className={styles.shell}>
						<Navbar
							locale={locale as Locale}
							nav={nav}
							logoId={settings.logoId}
							phone={settings.phone}
							socialLinks={settings.social_links}
							labels={{
								home: t("nav.home", "Главная"),
								menu: t("nav.menu", "Меню"),
								close: t("common.close", "Закрыть"),
								contact: t("nav.contact", "Контакты"),
							}}
						/>
						<main id="main" className={styles.main}>
							{children}
						</main>
						<Footer locale={locale as Locale} sections={footerSections} settings={settings} t={t} />
					</div>
					<CallbackBtn phone={settings.phone} />
				</ModalProvider>
			</body>
		</html>
	);
}
