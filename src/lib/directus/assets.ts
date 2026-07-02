/**
 * Asset URLs are served through our own /api/assets/<id> proxy so the browser
 * never needs any public access to Directus. Optional transform params
 * (width, height, quality, fit) are forwarded to Directus.
 */
export function assetUrl(
	id: string | null | undefined,
	params?: { width?: number; height?: number; quality?: number; fit?: "cover" | "contain" },
): string {
	if (!id) return "";
	const qs = new URLSearchParams();
	if (params?.width) qs.set("width", String(params.width));
	if (params?.height) qs.set("height", String(params.height));
	if (params?.quality) qs.set("quality", String(params.quality));
	if (params?.fit) qs.set("fit", params.fit);
	const q = qs.toString();
	return `/api/assets/${id}${q ? `?${q}` : ""}`;
}
