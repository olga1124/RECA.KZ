/** @format */

import { HeroProps } from "@/components/Hero";
import {
    ServiceCardProps,
    CardType,
    PopupType,
} from "@/components/ServiceCard/ServiceCardTypes";

export const homeHero: HeroProps = {
    title: "HR-агентство",
    btnText: "Узнать стоимость услуг",
    // suptitle: "Ваш надежный партнер в карьере и бизнесе",
    suptitle: "Профессиональный рекрутинг полного цикла",
    descr: `Поиск и подбор специалистов middle & top уровней`,
};

export const categories: ServiceCardProps[] = [
    {
        title: "Классический рекрутинг",
        text: "Сlassic Recruit",
        textUnder: "Однократный подбор персонала",
        btnTitle: "Подробнее",
        path: "/employers",
        type: CardType.link,
        popupType: PopupType.form,
    },
    {
        title: "HR-подписка",
        text: "Recruit Flow",
        textUnder: "Абонентский подбор персонала",
        btnTitle: "Подробнее",
        path: "/job",
        type: CardType.link,
        popupType: PopupType.form,
    },
];
