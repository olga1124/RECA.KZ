import { HeroProps } from "@/components/Hero";
import { ServiceCardProps } from "@/components/ServiceCard";

export const homeHero: HeroProps = {
    title: "HR агентство",
    subtitle: "Ваш надежный партнер в карьере  и бизнесе"
}


export const categories: ServiceCardProps[] = [
    {
        title: "Ищу сотрудников",
        text: "Полный цикл рекрутинга: анализ, поиск, отбор и привлечение кандидатов, обладающих всеми навыками, соответствующими текущим и долгосрочным стратегическим планам вашего бизнеса",
        btnTitle: "Подробнее",
        path: "/employers"
    },

    {
        title: "Ищу Работу",
        text: "Официальное трудоустройство на территории Казахстана и странах Европы. На всех этапах трудоустройства осуществляем полный цикл сопровождения.",
        btnTitle: "Подробнее",
        path: "/job"
    }
]