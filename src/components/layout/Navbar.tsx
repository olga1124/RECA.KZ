"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { assetUrl } from "@/lib/directus/assets";
import { localeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";
import type { NavItem } from "@/lib/directus/types";
import SocialLinks from "@/components/SocialLinks";
import LanguageSwitcher from "./LanguageSwitcher";

/** Resolve a nav item to an href for the current locale. */
function hrefFor(locale: Locale, item: NavItem): string {
	if (item.link_type === "external") return item.external_url ?? "#";
	if (item.link_type === "anchor") return `${localeHref(locale, "/")}${item.anchor ?? ""}`;
	return localeHref(locale, item.permalink);
}

export default function Navbar({
	locale,
	nav,
	logoId,
}: {
	locale: Locale;
	nav: NavItem[];
	logoId?: string | null;
}) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const onResize = () => window.innerWidth >= 768 && setOpen(false);
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	return (
		<div className="z-[100] w-full max-h-16 bg-white border-b border-[#F3F3F3]-500 flex items-center justify-between px-6 py-2 h-24 fixed top-0 left-0 right-0 nav">
			<div className="container flex justify-between items-center">
				<div className="block">
					<Link href={localeHref(locale, "/")} rel="noreferrer">
						{logoId ? (
							/* eslint-disable-next-line @next/next/no-img-element */
							<img src={assetUrl(logoId, { height: 70 })} alt="REC-A" width={130} height={70} />
						) : (
							<span className="font-bold text-xl">REC-A</span>
						)}
					</Link>
				</div>
				<div className="flex flex-row items-center gap-10">
					<ul className="nav-links-container hidden md:flex">
						{nav.map((item) => (
							<li
								key={item.title}
								className="nav-links px-4 cursor-pointer text-center capitalize font-medium text-gray-500 hover:scale-105 hover:text-gray duration-200 link-underline"
							>
								<Link href={hrefFor(locale, item)}>{item.title}</Link>
							</li>
						))}
					</ul>
					<div className="hidden md:flex items-center gap-6">
						<LanguageSwitcher current={locale} />
						<SocialLinks color="black" />
					</div>
				</div>
				<div onClick={() => setOpen(!open)} className="cursor-pointer z-10 text-gray-500 md:hidden">
					{open ? <FaTimes size={30} /> : <FaBars size={30} />}
				</div>
			</div>
			{open && (
				<ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-white text-gray-500">
					{nav.map((item) => (
						<li key={item.title} className="px-4 cursor-pointer text-center capitalize py-6 text-4xl">
							<Link onClick={() => setOpen(false)} href={hrefFor(locale, item)}>
								{item.title}
							</Link>
						</li>
					))}
					<li className="py-6">
						<LanguageSwitcher current={locale} />
					</li>
				</ul>
			)}
		</div>
	);
}
