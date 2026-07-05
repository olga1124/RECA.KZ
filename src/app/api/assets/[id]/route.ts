import { NextRequest } from "next/server";
import { directusUrl, directusToken } from "@/lib/directus/client";

/**
 * Streams a Directus file through the server using the service token, so the
 * browser needs no direct Directus access. Forwards image transform params.
 *
 * The service token can read EVERY file, so this public proxy must never expose
 * private uploads: submitted CVs are filed into the "CV" folder (see the form
 * submit route). We resolve the file's folder first and refuse to serve
 * anything located in a private folder — regardless of its content type, so a
 * CV uploaded as an image stays private too.
 */
const ALLOWED = new Set(["width", "height", "quality", "fit", "format"]);
// Folders whose files must never be served through the public proxy.
// Keep in sync with UPLOAD_FOLDER in app/api/forms/submit/route.ts.
const PRIVATE_FOLDERS = new Set(["CV"]);

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
	const { id } = await ctx.params;
	const auth = { Authorization: `Bearer ${directusToken()}` };
	const safeId = encodeURIComponent(id);

	// Gate: reject files in a private folder before streaming any bytes.
	const metaRes = await fetch(`${directusUrl()}/files/${safeId}?fields=folder.name`, { headers: auth });
	if (!metaRes.ok) return new Response("Not found", { status: 404 });
	const folderName: string | undefined = (await metaRes.json())?.data?.folder?.name;
	if (folderName && PRIVATE_FOLDERS.has(folderName)) {
		return new Response("Not found", { status: 404 });
	}

	const incoming = new URL(req.url).searchParams;
	const qs = new URLSearchParams();
	for (const [k, v] of incoming) if (ALLOWED.has(k)) qs.set(k, v);

	const upstream = await fetch(`${directusUrl()}/assets/${safeId}${qs.toString() ? `?${qs}` : ""}`, {
		headers: auth,
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
