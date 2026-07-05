import { NextRequest, NextResponse } from "next/server";
import { directusUrl, directusToken } from "@/lib/directus/client";
import { isLocale } from "@/lib/i18n/config";

/**
 * Accepts a dynamic-form submission, validates it against the form definition
 * (server-side — never trusts the client about allowed fields or target), uploads
 * any file, and creates a leads/applicants record with the service token.
 * A Directus Flow on items.create sends the email notification.
 */

// Real columns per target collection (kept in sync with scripts/directus/schema.mjs).
// Form fields outside these sets are stored in the `details` JSON column.
const COLUMNS: Record<"leads" | "applicants", Set<string>> = {
	leads: new Set(["name", "email", "phone", "subject", "company", "position", "selections"]),
	applicants: new Set(["name", "last_name", "email", "phone", "position", "file"]),
};

// Upload constraints for applicant files (CVs). Size can't be spoofed; the
// extension/MIME allowlist keeps out executables and oversized junk. Files land
// in a private folder and are never served through the public asset proxy.
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_UPLOAD_EXT = new Set(["pdf", "doc", "docx", "rtf", "jpg", "jpeg", "png"]);
const ALLOWED_UPLOAD_TYPES = new Set([
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/rtf",
	"image/jpeg",
	"image/png",
]);

// Uploaded CVs are filed into this directus_files folder (created by schema.mjs)
// instead of the library root. Resolved by name once per server instance.
const UPLOAD_FOLDER = "CV";
let uploadFolderId: string | null | undefined;

async function getUploadFolder(): Promise<string | null> {
	if (uploadFolderId !== undefined) return uploadFolderId;
	try {
		const res = await directus(`/folders?filter[name][_eq]=${encodeURIComponent(UPLOAD_FOLDER)}&limit=1`, { method: "GET" });
		const json = res.ok ? await res.json() : null;
		uploadFolderId = json?.data?.[0]?.id ?? null;
	} catch {
		uploadFolderId = null;
	}
	return uploadFolderId ?? null;
}

async function directus(path: string, init: RequestInit) {
	return fetch(`${directusUrl()}${path}`, {
		...init,
		headers: { Authorization: `Bearer ${directusToken()}`, ...(init.headers ?? {}) },
	});
}

async function loadForm(id: string) {
	const q = `query($id: ID!) { forms_by_id(id: $id) { target_collection fields { name type choices_collection } } }`;
	const res = await directus("/graphql", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query: q, variables: { id } }),
	});
	const json = await res.json();
	return json?.data?.forms_by_id as {
		target_collection: "leads" | "applicants";
		fields: { name: string; type: string; choices_collection?: string | null }[];
	} | null;
}

export async function POST(req: NextRequest) {
	try {
		// Same-origin guard: block cross-site POSTs. Browsers send Origin on
		// fetch POST; when present it must match the request host.
		const origin = req.headers.get("origin");
		if (origin && new URL(origin).host !== req.headers.get("host")) {
			return NextResponse.json({ error: "forbidden" }, { status: 403 });
		}

		const fd = await req.formData();

		// Honeypot: a hidden field no human fills. If set, a bot did — pretend
		// success (200) so it can't distinguish, but create nothing.
		if (String(fd.get("_hp") ?? "").trim() !== "") {
			return NextResponse.json({ ok: true });
		}

		const formId = String(fd.get("formId") ?? "");
		const payload = JSON.parse(String(fd.get("payload") ?? "{}")) as Record<string, unknown>;
		if (!formId) return NextResponse.json({ error: "missing formId" }, { status: 400 });

		const form = await loadForm(formId);
		if (!form || !["leads", "applicants"].includes(form.target_collection)) {
			return NextResponse.json({ error: "invalid form" }, { status: 400 });
		}

		const allowed = new Map(form.fields.map((f) => [f.name, f]));
		const record: Record<string, unknown> = {};
		const details: Record<string, unknown> = {};

		// Scalar / array fields (only those declared on the form). Fields that
		// match a real column are stored directly; the rest go into `details`,
		// so editors can add arbitrary fields to a form without schema changes.
		// Dictionary-backed selects (choices_collection) carry an item id — the
		// M2O column expects a number, and "" (nothing chosen) must become null.
		for (const [k, v] of Object.entries(payload)) {
			const f = allowed.get(k);
			if (!f || f.type === "file") continue;
			const value = f.choices_collection ? Number(v) || null : v;
			if (COLUMNS[form.target_collection].has(k)) record[k] = value;
			else details[k] = value;
		}
		if (Object.keys(details).length > 0) record.details = details;

		// File fields → upload, store the file id
		for (const [name, { type }] of allowed) {
			if (type !== "file") continue;
			const file = fd.get(`file_${name}`);
			if (file instanceof File && file.size > 0) {
				if (file.size > MAX_UPLOAD_BYTES) {
					return NextResponse.json({ error: "file too large" }, { status: 413 });
				}
				const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
				const typeOk = file.type ? ALLOWED_UPLOAD_TYPES.has(file.type) : true;
				if (!ALLOWED_UPLOAD_EXT.has(ext) || !typeOk) {
					return NextResponse.json({ error: "unsupported file type" }, { status: 415 });
				}
				const up = new FormData();
				const folder = await getUploadFolder();
				if (folder) up.append("folder", folder); // non-file fields must precede the file part
				up.append("file", file, file.name);
				const res = await directus("/files", { method: "POST", body: up });
				if (!res.ok) {
					console.error("Directus file upload failed:", res.status, await res.text());
					return NextResponse.json({ error: "upload failed" }, { status: 502 });
				}
				const { data } = await res.json();
				record[name] = data.id;
			}
		}

		// Derive source language from the referring URL (/ru/…, /en/…, /kz/…)
		const referer = req.headers.get("referer") ?? "";
		const seg = new URL(referer, "http://x").pathname.split("/")[1];
		if (isLocale(seg)) record.source_language = seg;

		const res = await directus(`/items/${form.target_collection}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(record),
		});
		if (!res.ok) {
			console.error("Directus item create failed:", res.status, await res.text());
			return NextResponse.json({ error: "create failed" }, { status: 502 });
		}

		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error("Form submit error:", err);
		return NextResponse.json({ error: "server error" }, { status: 500 });
	}
}
