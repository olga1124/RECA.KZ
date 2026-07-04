import { getForm } from "@/lib/directus/queries";
import { getFormUi } from "@/components/forms/ui";
import FormButton from "@/components/forms/FormButton";
import type { CtaBlock } from "@/lib/directus/types";
import type { Locale } from "@/lib/i18n/config";
import styles from "./Cta.module.css";

export default async function Cta({ data, locale }: { data: CtaBlock; locale: Locale }) {
	const form = data.formId ? await getForm(data.formId, locale) : null;
	const ui = await getFormUi(locale);

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<div className={styles.band}>
					<div className={styles.text}>
						{data.eyebrow && <span className={styles.eyebrow}>{data.eyebrow}</span>}
						{data.heading && <h2 className={styles.heading}>{data.heading}</h2>}
						{data.subheading && <p className={styles.subheading}>{data.subheading}</p>}
					</div>
					{data.button_label && (
						<FormButton form={form} label={data.button_label} className={styles.button} ui={ui} />
					)}
				</div>
			</div>
		</section>
	);
}
