import { getForm } from "@/lib/directus/queries";
import { getFormUi } from "@/components/forms/ui";
import DynamicForm from "@/components/forms/DynamicForm";
import ContactMap from "@/components/ContactMap";
import type { ContactBlock } from "@/lib/directus/types";
import type { Locale } from "@/lib/i18n/config";
import styles from "./Contact.module.css";

export default async function Contact({ data, locale }: { data: ContactBlock; locale: Locale }) {
	const form = data.formId ? await getForm(data.formId, locale) : null;
	const ui = await getFormUi(locale);
	const words = (data.heading ?? "").split(" ");

	return (
		<section id="contact" className={styles.section}>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.formWrap}>
						{data.heading && (
							<h1>
								{words.slice(0, -1).join(" ")} <span>{words.slice(-1)}</span>
							</h1>
						)}
						{form && <DynamicForm form={form} ui={ui} />}
					</div>
					{data.show_map && <ContactMap />}
				</div>
			</div>
		</section>
	);
}
