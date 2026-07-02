import type { Locale } from "./config";

/** Build a locale-prefixed href from a Directus permalink (e.g. "/employers"). */
export function localeHref(locale: Locale, permalink: string | null | undefined): string {
	const p = permalink ?? "/";
	return `/${locale}${p === "/" ? "" : p}`;
}
