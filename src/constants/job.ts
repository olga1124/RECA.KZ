/** @format */

import { HeroProps } from "@/components/Hero";
import {
    ServiceCardProps,
    CardType,
    PopupType,
} from "@/components/ServiceCard/ServiceCardTypes";

export const jobHero: HeroProps = {
    title: "Ищу работу",
    subtitle: "Выбери работу достойную тебя",
    text: "В последнее время все больше людей мечтают о трудоустройстве за рубежом. Работа за границей открывает перед человеком новые возможности для саморазвития и карьерного роста. Она позволяет расширить горизонты, познакомиться с другой культурой и приобрести ценный опыт. Если и вы мечтаете о такой возможности, не стоит откладывать свои желания на потом. Обратитесь к нам сегодня, и мы поможем вам осуществить вашу мечту.",
    btnText: "Узнать стоимость услуг",
};

export const categories: ServiceCardProps[] = [
    {
        title: "Работа в Казахстане",
        text: "Отправьте нам  свое резюме  и уже совсем скоро мы с вами свяжемся, чтобы предложить подходящие для вас вакансии",
        btnTitle: "Отправить резюме",
        path: "/",
        type: CardType.button,
        popupType: PopupType.sendCV,
    },
    {
        title: "Работа в  Европе",
        text: "Оставьте заявку на трудоустройство в Европейских странах. У нас  более 34 партнеров компаний ",
        btnTitle: "Оставить заявку",
        path: "/",
        type: CardType.button,
        popupType: PopupType.form,
    },
];
