import { getReviews, getUiStrings } from "@/lib/directus/queries";
import ReviewsCarousel from "./ReviewsCarousel";
import type { ReviewsBlock } from "@/lib/directus/types";
import type { Locale } from "@/lib/i18n/config";
import styles from "./Reviews.module.css";

export default async function Reviews({ data, locale }: { data: ReviewsBlock; locale: Locale }) {
	const [items, t] = await Promise.all([getReviews(data.limit), getUiStrings(locale)]);
	if (items.length === 0) return null;

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<h2 className={styles.title}>{data.heading ?? t("reviews.heading", "Отзывы")}</h2>
				<ReviewsCarousel
					items={items}
					labels={{ directorLabel: t("common.director", "Директор"), readMore: t("common.read_full", "Читать полностью") }}
				/>
			</div>
		</section>
	);
}
