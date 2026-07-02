/**
 * Directus i18n pattern helper.
 *
 * For a parent collection `X`, sets up the standard translations companion:
 *   - `X_translations` collection (auto-increment id PK, hidden)
 *   - `X_translations.X_id`          M2O → X            (cascade on delete)
 *   - `X_translations.languages_code` M2O → languages   (cascade on delete)
 *   - the translated fields on `X_translations`
 *   - `X.translations`               O2M alias (translations interface)
 *
 * Assumes the parent uses an integer auto-increment `id` PK and the
 * `languages` collection has a string `code` PK.
 */
import { ensureCollection, ensureField, ensureRelation } from "./lib.mjs";

export async function ensureTranslations(parent, translatedFields) {
	const child = `${parent}_translations`;
	const fkField = `${parent}_id`;

	await ensureCollection(child, {
		meta: { icon: "translate", hidden: true, note: `Translations for ${parent}` },
		schema: {},
	});

	// FK to the parent record
	await ensureField(child, fkField, {
		type: "integer",
		meta: { hidden: true },
		schema: {},
	});

	// FK to languages
	await ensureField(child, "languages_code", {
		type: "string",
		meta: { hidden: true, width: "half" },
		schema: {},
	});

	// The actual translated content fields
	for (const f of translatedFields) {
		const { field, ...def } = f;
		await ensureField(child, field, def);
	}

	// Parent-side alias field that the translations interface binds to
	await ensureField(parent, "translations", {
		type: "alias",
		meta: {
			interface: "translations",
			special: ["translations"],
			options: { languageField: "code" },
		},
	});

	// Relations (created after fields exist)
	await ensureRelation({
		collection: child,
		field: fkField,
		related_collection: parent,
		meta: { one_field: "translations", sort_field: null, one_deselect_action: "delete" },
		schema: { on_delete: "CASCADE" },
	});

	await ensureRelation({
		collection: child,
		field: "languages_code",
		related_collection: "languages",
		meta: { one_field: null },
		schema: { on_delete: "CASCADE" },
	});
}
