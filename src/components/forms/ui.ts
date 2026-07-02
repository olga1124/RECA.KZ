import "server-only";
import { getUiStrings } from "@/lib/directus/queries";
import type { Locale } from "@/lib/i18n/config";
import type { FormUiStrings } from "./DynamicForm";

/** Assemble the form's UI strings for a locale from ui_strings. */
export async function getFormUi(locale: Locale): Promise<FormUiStrings> {
	const t = await getUiStrings(locale);
	return {
		sending: t("form.sending", "…"),
		successTitle: t("form.success_title", "Спасибо"),
		errorTitle: t("form.error_title", "Ошибка"),
		errorText: t("form.error_text", "Попробуйте позже"),
		next: t("common.next", "Далее"),
		back: t("common.back", "Назад"),
	};
}
