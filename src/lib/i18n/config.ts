/**
 * Routing locales. RU is the default (primary audience is Russian-speaking in KZ)
 * and the fallback when a translation is missing. Every language is prefixed:
 * /ru, /kz, /en — `/` redirects to /ru.
 *
 * These codes must match the `languages.code` values in Directus. Directus holds
 * the display names / metadata (source of truth for content); this small typed
 * list exists so middleware can route without a network round-trip per request.
 */
export const locales = ["ru", "kz", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export function isLocale(value: string | undefined): value is Locale {
	return !!value && (locales as readonly string[]).includes(value);
}
