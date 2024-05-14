import Hero from "@/components/Hero"
import { jobHero } from "@/constants/job";
import ServicesCategory from "@/sections/ServicesCategory";
import { categories } from "@/constants/job";
import Contact from "@/sections/Contact";
import Stages from "@/sections/Stages";
import { jobStages } from "@/constants/stage"


const JobPage = () => {
    return(
        <>
        <Hero {...jobHero}/>
        <ServicesCategory items={categories}/>
        <Stages {...jobStages}/>
        <Contact/>
        </>
    )
}
export default JobPage;