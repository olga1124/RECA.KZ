/**
 * Field/relation builders on top of lib.mjs. Keep schema.mjs declarative.
 */
import { ensureField, ensureRelation } from "./lib.mjs";

// ── Scalar field factories (return a { type, meta, schema } def) ──────────

export const str = (opts = {}) => ({
	type: "string",
	meta: { interface: "input", width: "full", ...opts.meta },
	schema: { ...opts.schema },
});

export const text = (opts = {}) => ({
	type: "text",
	meta: { interface: "input-multiline", ...opts.meta },
	schema: { ...opts.schema },
});

export const richtext = (opts = {}) => ({
	type: "text",
	meta: { interface: "input-rich-text-html", ...opts.meta },
	schema: { ...opts.schema },
});

export const bool = (opts = {}) => ({
	type: "boolean",
	meta: { interface: "boolean", ...opts.meta },
	schema: { default_value: opts.default ?? false, ...opts.schema },
});

export const int = (opts = {}) => ({
	type: "integer",
	meta: { interface: "input", ...opts.meta },
	schema: { ...opts.schema },
});

export const json = (opts = {}) => ({
	type: "json",
	meta: { interface: "list", ...opts.meta },
	schema: { ...opts.schema },
});

export const dropdown = (choices, opts = {}) => ({
	type: "string",
	meta: {
		interface: "select-dropdown",
		options: { choices: choices.map((c) => (typeof c === "string" ? { text: c, value: c } : c)) },
		...opts.meta,
	},
	schema: { ...opts.schema },
});

export const dateCreated = () => ({
	type: "timestamp",
	meta: {
		interface: "datetime",
		readonly: true,
		hidden: true,
		special: ["date-created"],
		width: "half",
	},
	schema: {},
});

// ── Relation builders ─────────────────────────────────────────────────────

/** File (M2O → directus_files) field. */
export async function fileField(collection, field, opts = {}) {
	await ensureField(collection, field, {
		type: "uuid",
		meta: { interface: "file", special: ["file"], ...opts.meta },
		schema: {},
	});
	await ensureRelation({
		collection,
		field,
		related_collection: "directus_files",
		meta: {},
		schema: { on_delete: "SET NULL" },
	});
}

/**
 * Many-to-one relation. `type` must match the related PK type
 * (integer for our auto-id collections, string for languages).
 */
export async function m2oField(collection, field, related, opts = {}) {
	const type = opts.type ?? "integer";
	await ensureField(collection, field, {
		type,
		meta: { interface: "select-dropdown-m2o", width: "half", ...opts.meta },
		schema: {},
	});
	await ensureRelation({
		collection,
		field,
		related_collection: related,
		meta: { one_field: opts.oneField ?? null },
		schema: { on_delete: opts.onDelete ?? "SET NULL" },
	});
}

/**
 * One-to-many: parent gets an alias field, child gets the FK + relation.
 * Child FK field is created here (integer, hidden).
 */
export async function o2m(parent, aliasField, child, fkField, opts = {}) {
	await ensureField(child, fkField, {
		type: "integer",
		meta: { hidden: true },
		schema: {},
	});
	await ensureField(parent, aliasField, {
		type: "alias",
		meta: {
			interface: "list-o2m",
			special: ["o2m"],
			options: opts.options ?? {},
		},
	});
	await ensureRelation({
		collection: child,
		field: fkField,
		related_collection: parent,
		meta: {
			one_field: aliasField,
			sort_field: opts.sortField ?? "sort",
			one_deselect_action: "delete",
		},
		schema: { on_delete: "CASCADE" },
	});
}

/**
 * Many-to-any (page builder). Creates the junction collection fields and the
 * parent alias field, wiring `collection`+`item` against the allowed set.
 */
export async function m2a(parent, aliasField, junction, fkField, allowedCollections) {
	// Junction scalar fields
	await ensureField(junction, fkField, { type: "integer", meta: { hidden: true }, schema: {} });
	await ensureField(junction, "collection", { type: "string", meta: { hidden: true }, schema: {} });
	await ensureField(junction, "item", { type: "string", meta: { hidden: true }, schema: {} });
	await ensureField(junction, "sort", { type: "integer", meta: { hidden: true }, schema: {} });

	// Parent alias field
	await ensureField(parent, aliasField, {
		type: "alias",
		meta: { interface: "list-m2a", special: ["m2a"], options: {} },
	});

	// Relation: junction → parent
	await ensureRelation({
		collection: junction,
		field: fkField,
		related_collection: parent,
		meta: { one_field: aliasField, sort_field: "sort", junction_field: "item" },
		schema: { on_delete: "CASCADE" },
	});

	// Relation: junction.item → any of allowedCollections
	await ensureRelation({
		collection: junction,
		field: "item",
		related_collection: null,
		meta: {
			one_collection_field: "collection",
			one_allowed_collections: allowedCollections,
			junction_field: fkField,
			sort_field: "sort",
		},
		schema: {},
	});
}
