import Link from "next/link";
import { assetUrl } from "@/lib/directus/assets";
import { localeHref, navItemHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";
import type { FooterSection, SiteSettings } from "@/lib/directus/types";
import SocialLinks from "@/components/SocialLinks";
import styles from "./Footer.module.css";

export default function Footer({
	locale,
	sections,
	settings,
	t,
}: {
	locale: Locale;
	sections: FooterSection[];
	settings: SiteSettings;
	t: (key: string, fallback?: string) => string;
}) {
	const logo = settings.logoDarkId ?? settings.logoId;
	return (
		<footer className={styles.footer}>
			<div className={styles.inner}>
				<div className={styles.top}>
					<div className={styles.brand}>
						<Link href={localeHref(locale, "/")}>
							{logo ? (
								/* eslint-disable-next-line @next/next/no-img-element */
								<img src={assetUrl(logo, { height: 112 })} alt={settings.site_name ?? "REC-A"} />
							) : (
								<span className={styles.brandName}>{settings.site_name ?? "REC-A"}</span>
							)}
						</Link>
						<span className={styles.contactLabel}>{t("nav.contact", "Контакты")}</span>
						<SocialLinks color="white" links={settings.social_links} phone={settings.phone} />
					</div>

					{sections.map((section, i) => (
						<div key={i} className={styles.col}>
							{section.title && <p className={styles.colTitle}>{section.title}</p>}
							<ul>
								{section.links.map((link, j) => (
									<li key={j}>
										<Link href={navItemHref(locale, link)}>{link.title}</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className={styles.bottom}>
					<span>
						© {new Date().getFullYear()} {settings.site_name ?? "REC-A"}. All rights reserved.
					</span>
					<span>
						Developed by <a href="https://nelcosoft.com">Nelcosoft</a>
					</span>
				</div>
			</div>
		</footer>
	);
}
