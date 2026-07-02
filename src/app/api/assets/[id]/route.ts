import { NextRequest } from "next/server";
import { DIRECTUS_URL, TOKEN } from "@/lib/directus/client";

/**
 * Streams a Directus file through the server using the service token, so the
 * browser needs no direct Directus access. Forwards image transform params.
 */
const ALLOWED = new Set(["width", "height", "quality", "fit", "format"]);

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
	const { id } = await ctx.params;
	const incoming = new URL(req.url).searchParams;
	const qs = new URLSearchParams();
	for (const [k, v] of incoming) if (ALLOWED.has(k)) qs.set(k, v);

	const upstream = await fetch(`${DIRECTUS_URL}/assets/${id}${qs.toString() ? `?${qs}` : ""}`, {
		headers: { Authorization: `Bearer ${TOKEN}` },
	});
	if (!upstream.ok || !upstream.body) {
		return new Response("Not found", { status: 404 });
	}
	const headers = new Headers();
	const ct = upstream.headers.get("content-type");
	if (ct) headers.set("content-type", ct);
	headers.set("cache-control", "public, max-age=3600, s-maxage=86400");
	return new Response(upstream.body, { status: 200, headers });
}
