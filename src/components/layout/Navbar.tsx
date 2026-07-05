"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { House, Menu, X } from "lucide-react";
import { assetUrl } from "@/lib/directus/assets";
import { localeHref, navItemHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";
import type { NavItem, SocialLink } from "@/lib/directus/types";
import LanguageSwitcher from "./LanguageSwitcher";
import SocialLinks from "@/components/SocialLinks";
import styles from "./Navbar.module.css";

export interface NavbarLabels {
	home: string;
	menu: string;
	close: string;
	contact: string;
}

export default function Navbar({
	locale,
	nav,
	logoId,
	labels,
	phone,
	socialLinks,
}: {
	locale: Locale;
	nav: NavItem[];
	logoId?: string | null;
	labels: NavbarLabels;
	phone?: string;
	socialLinks?: SocialLink[];
}) {
	const [open, setOpen] = useState(false);

	// Lock body scroll while the drawer is open (with scrollbar compensation,
	// same pattern as ModalProvider); close on Escape.
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
		const scrollbar = window.innerWidth - document.documentElement.clientWidth;
		document.documentElement.style.setProperty("--scrollbar-comp", `${scrollbar}px`);
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		return () => {
			document.documentElement.style.removeProperty("--scrollbar-comp");
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKey);
		};
	}, [open]);

	// The drawer/scrim must live OUTSIDE <header>: its backdrop-filter makes it
	// the containing block for fixed descendants, trapping them in the bar.
	return (
		<>
			<header className={styles.header}>
				<div className={styles.inner}>
					<Link href={localeHref(locale, "/")} className={styles.logo} aria-label="REC-A">
						{logoId ? (
							/* eslint-disable-next-line @next/next/no-img-element */
							<img src={assetUrl(logoId)} alt="REC-A" />
						) : (
							<span className={styles.logoText}>REC-A</span>
						)}
					</Link>

					<div className={styles.right}>
						<Link href={localeHref(locale, "/")} className={styles.iconBtn} aria-label={labels.home} title={labels.home}>
							<House size={21} />
						</Link>
						<LanguageSwitcher current={locale} />
						<button
							type="button"
							className={styles.iconBtn}
							aria-label={labels.menu}
							aria-expanded={open}
							onClick={() => setOpen(true)}
						>
							<Menu size={22} />
						</button>
					</div>
				</div>
			</header>

			{open && (
				<>
					<div className={styles.scrim} onClick={() => setOpen(false)} />
					<nav className={styles.drawer} aria-label={labels.menu}>
						<div className={styles.drawerHead}>
							<span className={styles.drawerTitle}>{labels.menu}</span>
							<button type="button" className={styles.iconBtn} aria-label={labels.close} onClick={() => setOpen(false)}>
								<X size={22} />
							</button>
						</div>
						<ul className={styles.drawerNav}>
							{nav.map((item, i) => (
								<li key={item.title}>
									<Link href={navItemHref(locale, item)} onClick={() => setOpen(false)}>
										<span className={styles.drawerIndex}>{String(i + 1).padStart(2, "0")}</span>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
						<div className={styles.drawerFoot}>
							<span className={styles.drawerTitle}>{labels.contact}</span>
							{phone && (
								<a className={styles.drawerPhone} href={`tel:${phone.replace(/\s/g, "")}`}>
									{phone}
								</a>
							)}
							<SocialLinks color="dark" links={socialLinks} />
						</div>
					</nav>
				</>
			)}
		</>
	);
}
