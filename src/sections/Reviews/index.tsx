"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { FaStar } from "react-icons/fa";

interface ReviewItem {
    company: string;
    director: string;
    fullText: string;
}

const Reviews = () => {
    const [activeReview, setActiveReview] = useState<ReviewItem | null>(null);

    const items: ReviewItem[] = [
        {
            company: "Melcor",
            director: "Вячеслав М.",
            fullText: `От лица компании ТОО “Melcor” благодарю Вас за качественно выполненный подбор персонала. Все требования к кандидату были учтены, а процесс подбора выстроен с пониманием специфики нашей деятельности.
Отдельно отмечаю Ваш деликатный и профессиональный подход к взаимодействию с нашей командой.
Благодарю за внимательность к деталям и высокий уровень исполнения!
Наша компания обязательно обратится к Вам снова, как только возникнет потребность в подборе персонала.
С уважением, Вячеслав.
`
        },
        {
            company: "Big Smoke",
            director: "Рустэм М.",
            fullText: `Благодарю вас за проделанную работу. Было приятно иметь дело с профессионалом. Кандидат произошел все ожидания. Мы в восторге, а главное вся работа была проделана за короткие сроки.
Больше всего в работе с вами поразил уровень погружения в детали и предоставления «summary» на каждого кандидата, составленный вами. Это очень удобно!
Будем рады сотрудничать с вами.
`
        },
        {
            company: "Хорошее молоко",
            director: "Антон С.",
            fullText: `Спасибо вам за подобранного специалиста!
Хороший, коммуникабельный, уже есть результаты!
А вам спасибо за чёткий и слаженный поиск кандидата.
`
        }
    ];

    const renderedStars = (
        <div className="stars">
            {[1, 2, 3, 4, 5].map((i) => (
                <FaStar key={i} size={20} color="#FFD700" />
            ))}
        </div>
    );

    return (
        <div className="reviews-container">
            <div className="reviews-content">
                <h2 className="reviews-title">Отзывы и рекомендации</h2>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={3}
                    pagination={{ clickable: true }}
                    navigation={{ enabled: false }} 
                    breakpoints={{
                        0: {          // мобильные устройства
                            slidesPerView: 1,
                            autoplay: {
                                delay: 3000,
                                disableOnInteraction: false
                            },
                            navigation: {
                                enabled: false
                            }
                        },
                        768: {        // планшеты
                            slidesPerView: 2,
                            autoplay: false,
                            navigation: {
                                enabled: false
                            }
                        },
                        1024: {       // desktop
                            slidesPerView: 3,
                            autoplay: false,
                            navigation: {
                                enabled: true
                            }
                        }
                    }}
                    className="reviews-swiper"
                >
                    {items.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="review-item">
                                {renderedStars}

                                <h3 className="review-company">{item.company}</h3>
                                <p className="review-director">Директор: <span>{item.director}</span></p>

                                <p className="review-text">{item.fullText}</p>

                                <button
                                    className="read-more-btn"
                                    onClick={() => setActiveReview(item)}
                                >
                                    Читать полностью
                                </button>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {activeReview && (
                    <div className="review-modal" onClick={() => setActiveReview(null)}>
                        <div className="review-popup" onClick={(e) => e.stopPropagation()}>
                            <div
                                className="close-btn"
                                onClick={() => setActiveReview(null)}
                            >
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
                            </div>
                            {renderedStars}
                            <h3 className="review-company">{activeReview.company}</h3>
                            <p className="review-director">
                                Директор: <span>{activeReview.director}</span>
                            </p>

                            <p className="review-full">{activeReview.fullText}</p>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;
