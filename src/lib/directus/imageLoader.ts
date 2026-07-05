import type { ImageLoaderProps } from "next/image";

/**
 * next/image loader that resizes through our Directus /api/assets proxy instead
 * of the built-in /_next/image optimizer — so the standalone server needs no
 * `sharp` and images take a single proxy hop (Directus does the transform).
 *
 * Non-proxy sources (e.g. statically imported SVG icons) pass through untouched.
 */
export default function directusImageLoader({ src, width, quality }: ImageLoaderProps): string {
	if (!src.startsWith("/api/assets/")) return src;
	const path = src.split("?")[0];
	const params = new URLSearchParams({ width: String(width) });
	if (quality) params.set("quality", String(quality));
	return `${path}?${params.toString()}`;
}
