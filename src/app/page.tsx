import Hero from "@/components/Hero";
import Contact from "@/sections/Contact";
import ServicesCategory from "@/sections/ServicesCategory";
import Skills from "@/sections/Skills";
import { homeHero } from "@/constants/home";
import { categories } from "@/constants/home";
import AboutUs from '@/sections/AboutUs';
import Reviews from "@/sections/Reviews";

export default function Home() {
	return (
		<>
			<Hero {...homeHero} />
			<AboutUs />
			<ServicesCategory items={categories} />
			<Skills />
			<Reviews />
			<Contact />
		</>
	);
}
