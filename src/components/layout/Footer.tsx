import Link from "next/link";
import { assetUrl } from "@/lib/directus/assets";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";
import type { NavItem, FooterSection, SiteSettings } from "@/lib/directus/types";
import SocialLinks from "@/components/SocialLinks";

function hrefFor(locale: Locale, item: NavItem): string {
	if (item.link_type === "external") return item.external_url ?? "#";
	if (item.link_type === "anchor") return `${localeHref(locale, "/")}${item.anchor ?? ""}`;
	return localeHref(locale, item.permalink);
}

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
		<div className="footer-container">
			<div className="footer-content">
				<div id="logo" className="footer-row logo">
					{logo ? (
						/* eslint-disable-next-line @next/next/no-img-element */
						<img src={assetUrl(logo, { height: 80 })} width={250} height={80} alt={settings.site_name ?? "REC-A"} />
					) : (
						<span className="text-white font-bold text-2xl">{settings.site_name ?? "REC-A"}</span>
					)}
				</div>
				<div id="social" className="footer-row social">
					<div className="social">
						<p>{t("nav.contact", "Контакты")}</p>
						<SocialLinks color="white" links={settings.social_links} phone={settings.phone} />
					</div>
				</div>
				<div id="links" className="footer-row links">
					{sections.map((section, i) => (
						<div key={i} className="footer-nav-col">
							{section.title && <p className="footer-col-title">{section.title}</p>}
							<ul>
								{section.links.map((link, j) => (
									<li key={j}>
										<Link href={hrefFor(locale, link)}>{link.title}</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div id="copyright">
					<div className="footer-copyright">
						<span>Copyright © {new Date().getFullYear()}, {settings.site_name ?? "REC-A"}. All rights reserved.</span>
					</div>
					<div className="footer-developed">
						<span>
							Developed by <a href="https://nelcosoft.com">Nelcosoft</a>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
