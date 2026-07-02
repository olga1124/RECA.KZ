import { getForm } from "@/lib/directus/queries";
import { getFormUi } from "@/components/forms/ui";
import FormButton from "@/components/forms/FormButton";
import type { HeroBlock } from "@/lib/directus/types";
import type { Locale } from "@/lib/i18n/config";
import styles from "./Hero.module.css";

export default async function Hero({ data, locale }: { data: HeroBlock; locale: Locale }) {
	const form = data.formId ? await getForm(data.formId, locale) : null;
	const ui = await getFormUi(locale);

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.title}>
						<h1>{data.title}</h1>
						{data.suptitle && <p className={styles.suptitle}>{data.suptitle}</p>}
						{data.descr && <p className={styles.descr}>{data.descr}</p>}
						{data.button_label && <FormButton form={form} label={data.button_label} className={styles.cta} ui={ui} />}
					</div>
					{data.secondary_text && (
						<div className={styles.description}>
							<p>{data.secondary_text}</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
