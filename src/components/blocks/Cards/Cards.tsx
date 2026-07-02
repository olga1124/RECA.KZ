import Link from "next/link";
import { getForm } from "@/lib/directus/queries";
import { getFormUi } from "@/components/forms/ui";
import FormButton from "@/components/forms/FormButton";
import { localeHref } from "@/lib/i18n/href";
import type { CardsBlock, Card } from "@/lib/directus/types";
import type { Locale } from "@/lib/i18n/config";
import styles from "./Cards.module.css";

async function CardView({ card, locale }: { card: Card; locale: Locale }) {
	const body = (
		<>
			<h3>{card.title}</h3>
			{card.text && <p>{card.text}</p>}
			{card.text_under && <span className={styles.textUnder}>{card.text_under}</span>}
		</>
	);

	if (card.linkPermalink) {
		return (
			<div className={styles.card}>
				{body}
				{card.button_label && (
					<Link href={localeHref(locale, card.linkPermalink)} className={styles.btn}>
						{card.button_label}
					</Link>
				)}
			</div>
		);
	}

	const form = card.formId ? await getForm(card.formId, locale) : null;
	const ui = await getFormUi(locale);
	return (
		<div className={styles.card}>
			{body}
			{card.button_label && <FormButton form={form} label={card.button_label} className={styles.btn} ui={ui} />}
		</div>
	);
}

export default async function Cards({ data, locale }: { data: CardsBlock; locale: Locale }) {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				{data.heading && <h2>{data.heading}</h2>}
				<div className={styles.content}>
					{data.cards.map((card, i) => (
						<CardView key={i} card={card} locale={locale} />
					))}
				</div>
			</div>
		</section>
	);
}
