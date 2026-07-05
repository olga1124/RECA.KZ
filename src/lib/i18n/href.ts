import type { Locale } from "./config";
import type { NavItem } from "@/lib/directus/types";

/** Build a locale-prefixed href from a Directus permalink (e.g. "/employers"). */
export function localeHref(locale: Locale, permalink: string | null | undefined): string {
	const p = permalink ?? "/";
	return `/${locale}${p === "/" ? "" : p}`;
}

/** Resolve a nav/footer link (page | anchor | external) to an href. */
export function navItemHref(locale: Locale, item: NavItem): string {
	if (item.link_type === "external") return item.external_url ?? "#";
	if (item.link_type === "anchor") return `${localeHref(locale, "/")}${item.anchor ?? ""}`;
	return localeHref(locale, item.permalink);
}
