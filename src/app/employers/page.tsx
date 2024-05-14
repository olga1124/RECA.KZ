import Hero from "@/components/Hero"
import { employersHero } from "@/constants/employers";
import Contact from "@/sections/Contact";
import Stages from "@/sections/Stages";
import { stagesEmployers } from "@/constants/stage-employee"
import AboutUs from "@/sections/AboutUs";
import Employers from "@/sections/Employers";
import { employersServices } from "@/constants/employers";

export default function Home() {
    return (
      <>
      <Hero {...employersHero}/>
      <AboutUs/>
      <Employers items={employersServices}/>
      <Stages {...stagesEmployers}/>
      <Contact/>
      </>
    );
  }