import Hero from "@/components/Hero"
import { jobHero } from "@/constants/job";
import Contact from "@/sections/Contact";
import Stages from "@/sections/Stages";
import { jobStages } from "@/constants/stage"
import JobAbout from '@/sections/JobAbout';


const JobPage = () => {
	return (
		<>
			<Hero {...jobHero} />
			<JobAbout />
			{/* <ServicesCategory items={categories} /> */}
			{/* <Employers items={employersServices} /> */}
			<Stages {...jobStages} />
			<Contact />
		</>
	)
}
export default JobPage;