"use client";
import "swiper/css";
import "swiper/css/pagination";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Star } from "lucide-react";
import type { Review } from "@/lib/directus/types";
import styles from "./ReviewsCarousel.module.css";

function Stars({ n }: { n: number }) {
	return (
		<div className={styles.stars}>
			{Array.from({ length: n }).map((_, i) => (
				<Star key={i} size={18} className={styles.star} />
			))}
		</div>
	);
}

export default function ReviewsCarousel({
	items,
	labels,
}: {
	items: Review[];
	labels: { directorLabel: string; readMore: string };
}) {
	const [active, setActive] = useState<Review | null>(null);

	return (
		<>
			<Swiper
				modules={[Pagination, Autoplay]}
				spaceBetween={30}
				slidesPerView={3}
				pagination={{ clickable: true }}
				breakpoints={{
					0: { slidesPerView: 1, autoplay: { delay: 3000, disableOnInteraction: false } },
					768: { slidesPerView: 2 },
					1024: { slidesPerView: 3 },
				}}
				className={styles.swiper}
			>
				{items.map((item, i) => (
					<SwiperSlide key={i}>
						<div className={styles.item}>
							<Stars n={item.rating} />
							<h3 className={styles.company}>{item.company}</h3>
							<p className={styles.director}>
								{labels.directorLabel}: <span>{item.director}</span>
							</p>
							<p className={styles.text}>{item.full_text}</p>
							<button className={styles.readMore} onClick={() => setActive(item)}>
								{labels.readMore}
							</button>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			{active && (
				<div className={styles.modal} onClick={() => setActive(null)}>
					<div className={styles.popup} onClick={(e) => e.stopPropagation()}>
						<div className={styles.close} onClick={() => setActive(null)}>✕</div>
						<Stars n={active.rating} />
						<h3 className={styles.company}>{active.company}</h3>
						<p className={styles.director}>
							{labels.directorLabel}: <span>{active.director}</span>
						</p>
						<p className={styles.full}>{active.full_text}</p>
					</div>
				</div>
			)}
		</>
	);
}
