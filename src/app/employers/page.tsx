import Hero from "@/components/Hero"
import { employersHero } from "@/constants/employers";
import Contact from "@/sections/Contact";
import Stages from "@/sections/Stages";
import { stagesEmployers } from "@/constants/stage-employee"
import EmployersAbout from '@/sections/EmployersAbout';

export default function Home() {
	return (
		<>
			<Hero {...employersHero} />
			<EmployersAbout />
			{/* <Employers items={employersServices} /> */}
			<Stages {...stagesEmployers} />
			<Contact />
		</>
	);
}