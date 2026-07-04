/**
 * Shared helpers for Directus provisioning scripts (schema + seed).
 *
 * All helpers are idempotent: re-running a script must not error on
 * already-existing collections/fields/relations/items. This makes the
 * schema definition itself the source of truth and safe to iterate on.
 *
 * Run with:  node --env-file=.env.local scripts/directus/<script>.mjs
 */

const BASE = (process.env.DIRECTUS_URL || "").replace(/\/$/, "");
const TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

if (!BASE || !TOKEN) {
	console.error("Missing DIRECTUS_URL or DIRECTUS_ADMIN_TOKEN (load .env.local).");
	process.exit(1);
}

/** Low-level request. Throws on non-2xx (unless allowStatus matches). */
export async function api(method, path, body, { allowStatus = [] } = {}) {
	const res = await fetch(`${BASE}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			...(body ? { "Content-Type": "application/json" } : {}),
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	if (!res.ok && !allowStatus.includes(res.status)) {
		const text = await res.text();
		throw new Error(`${method} ${path} → ${res.status}\n${text}`);
	}
	if (res.status === 204) return null;
	const json = await res.json().catch(() => null);
	return json?.data ?? json;
}

/** True if a collection already exists. */
export async function collectionExists(name) {
	const res = await fetch(`${BASE}/collections/${name}`, {
		headers: { Authorization: `Bearer ${TOKEN}` },
	});
	return res.ok;
}

/**
 * Create a collection if it doesn't exist.
 * `meta`/`schema` follow the Directus /collections payload shape.
 */
export async function ensureCollection(name, { meta = {}, schema = {}, fields } = {}) {
	if (await collectionExists(name)) {
		console.log(`  = collection ${name} (exists)`);
		return;
	}
	const payload = { collection: name, meta, schema };
	if (fields) payload.fields = fields;
	await api("POST", "/collections", payload);
	console.log(`  + collection ${name}`);
}

/** True if a field exists on a collection. */
export async function fieldExists(collection, field) {
	const res = await fetch(`${BASE}/fields/${collection}/${field}`, {
		headers: { Authorization: `Bearer ${TOKEN}` },
	});
	return res.ok;
}

/**
 * Create a field if it doesn't exist.
 * `def` = { type, meta, schema } per Directus /fields payload.
 */
export async function ensureField(collection, field, def = {}) {
	if (await fieldExists(collection, field)) {
		console.log(`  = field ${collection}.${field} (exists)`);
		return;
	}
	await api("POST", `/fields/${collection}`, { field, ...def });
	console.log(`  + field ${collection}.${field}`);
}

/**
 * Create a relation if an equivalent one doesn't already exist
 * (matched by collection + field). For M2A relations, syncs
 * `one_allowed_collections` so newly declared block types get linked.
 */
export async function ensureRelation(relation) {
	const existing = await api("GET", "/relations", null, { allowStatus: [403, 404] });
	const found = Array.isArray(existing)
		? existing.find(
				(r) => r.collection === relation.collection && r.field === relation.field
			)
		: null;
	if (found) {
		const want = relation.meta?.one_allowed_collections;
		const have = found.meta?.one_allowed_collections;
		if (want && JSON.stringify([...want].sort()) !== JSON.stringify([...(have ?? [])].sort())) {
			await api("PATCH", `/relations/${relation.collection}/${relation.field}`, {
				meta: { one_allowed_collections: want },
			});
			console.log(`  ~ relation ${relation.collection}.${relation.field} (allowed collections updated)`);
			return;
		}
		console.log(`  = relation ${relation.collection}.${relation.field} (exists)`);
		return;
	}
	await api("POST", "/relations", relation);
	console.log(`  + relation ${relation.collection}.${relation.field}`);
}

export { BASE, TOKEN };
