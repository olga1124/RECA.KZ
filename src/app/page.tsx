import Hero from "@/components/Hero";
import Contact from "@/sections/Contact";
import ServicesCategory from "@/sections/ServicesCategory";
import Skills from "@/sections/Skills";
import { homeHero } from "@/constants/home";
import { categories } from "@/constants/home";

export default function Home() {
  return (
    <>
    <Hero {...homeHero}/>
    <ServicesCategory items={categories}/>
    <Skills/>
    <Contact/>
    </>
  );
}
