interface Navlinks {
    title: string;
    path: string;
}

export const navbarLinks: Navlinks[] = [
    {
        title: "Домой",
        path: "/"
    },
    {
        title: "Работодателю",
        path: "/employers"
    },
    {
        title: "Соискателю",
        path: "/job"
    },
    {
        title: "Контакты",
        path: "/#contact"
    }
]