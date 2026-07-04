import { getForm } from "@/lib/directus/queries";
import { getFormUi } from "@/components/forms/ui";
import DynamicForm from "@/components/forms/DynamicForm";
import type { FormBlock } from "@/lib/directus/types";
import type { Locale } from "@/lib/i18n/config";
import styles from "./FormSection.module.css";

export default async function FormSection({ data, locale }: { data: FormBlock; locale: Locale }) {
	const [form, ui] = await Promise.all([
		data.formId ? getForm(data.formId, locale) : null,
		getFormUi(locale),
	]);
	if (!form) return null;
	const words = (data.heading ?? "").split(" ");

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<header className={styles.header}>
					{data.heading && (
						<h1>
							{words.slice(0, -1).join(" ")} <span>{words.slice(-1)}</span>
						</h1>
					)}
					{data.subheading && <p className={styles.subtitle}>{data.subheading}</p>}
				</header>

				<div className={styles.formCard}>
					{/* The page h1 already carries the title — don't repeat it inside the card. */}
					<DynamicForm form={{ ...form, title: undefined }} ui={ui} />
				</div>
			</div>
		</section>
	);
}
