import { NextRequest, NextResponse } from "next/server";
import { DIRECTUS_URL, TOKEN } from "@/lib/directus/client";
import { isLocale } from "@/lib/i18n/config";

/**
 * Accepts a dynamic-form submission, validates it against the form definition
 * (server-side — never trusts the client about allowed fields or target), uploads
 * any file, and creates a leads/applicants record with the service token.
 * A Directus Flow on items.create sends the email notification.
 */

async function directus(path: string, init: RequestInit) {
	return fetch(`${DIRECTUS_URL}${path}`, {
		...init,
		headers: { Authorization: `Bearer ${TOKEN}`, ...(init.headers ?? {}) },
	});
}

async function loadForm(id: string) {
	const q = `query($id: ID!) { forms_by_id(id: $id) { target_collection fields { name type } } }`;
	const res = await directus("/graphql", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query: q, variables: { id } }),
	});
	const json = await res.json();
	return json?.data?.forms_by_id as { target_collection: "leads" | "applicants"; fields: { name: string; type: string }[] } | null;
}

export async function POST(req: NextRequest) {
	try {
		const fd = await req.formData();
		const formId = String(fd.get("formId") ?? "");
		const payload = JSON.parse(String(fd.get("payload") ?? "{}")) as Record<string, unknown>;
		if (!formId) return NextResponse.json({ error: "missing formId" }, { status: 400 });

		const form = await loadForm(formId);
		if (!form || !["leads", "applicants"].includes(form.target_collection)) {
			return NextResponse.json({ error: "invalid form" }, { status: 400 });
		}

		const allowed = new Map(form.fields.map((f) => [f.name, f.type]));
		const record: Record<string, unknown> = {};

		// Scalar / array fields (only those declared on the form)
		for (const [k, v] of Object.entries(payload)) {
			if (allowed.has(k) && allowed.get(k) !== "file") record[k] = v;
		}

		// File fields → upload, store the file id
		for (const [name, type] of allowed) {
			if (type !== "file") continue;
			const file = fd.get(`file_${name}`);
			if (file instanceof File && file.size > 0) {
				const up = new FormData();
				up.append("file", file, file.name);
				const res = await directus("/files", { method: "POST", body: up });
				if (!res.ok) return NextResponse.json({ error: "upload failed" }, { status: 502 });
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
		if (!res.ok) return NextResponse.json({ error: "create failed", detail: await res.text() }, { status: 502 });

		return NextResponse.json({ ok: true });
	} catch (err) {
		return NextResponse.json({ error: String(err) }, { status: 500 });
	}
}
