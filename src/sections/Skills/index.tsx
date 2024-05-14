import { FaRegAddressBook } from 'react-icons/fa';
import { FaRegClock } from 'react-icons/fa';
import { FaRegHandRock } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { headlineFormatter } from "@/utils/stringFormatter";

interface SkillsItem {
    title: string;
    text: string;
    icon: IconType;
}

const Skills = () => {

    const title = "Выбирают нас по следующим причинам";

    const Items: SkillsItem[] = [
        {
            title: "Индивидуальный подход",
            text: "Каждый имеет свои уникальные потребности и требования. Поэтому нами разрабатываются индивидуальные стратегии и подходы к каждому клиенту, чтобы найти наиболее подходящие решения, соответствующих вашей корпоративной культуре и ценностям.",
            icon: FaRegClock
        },
        {
            title: "Качество",
            text: "Придерживаемся высоких стандартов конфиденциальности и этических принципов. Соблюдение полной конфиденциальности в отношении информации о вакансиях, кандидатах и компаниях-клиентах.",
            icon: FaRegHandRock
        },
        {
            title: "Конфидециальность",
            text: "Стремление к высокому качеству в каждом аспекте нашей работы. Тщательный подход к каждому этапу сотрудничества - от определения требований, анализа и конечного результата.",
            icon: FaRegAddressBook
        }
    ]

    const renderedItems = Items.map((item, index) => {
        return(
        <div key={index} className="item">
            <label htmlFor="input" className="icon-label">
                <item.icon size={30} />
                <h2 className="text">{item.title}</h2>
            </label>
            <p>{item.text}</p>
        </div>
        )
    })

    return (
        <div className="skills-container">
            <div className="skills-content">
                {headlineFormatter(title)}
                <div className="skills-items">
                    {renderedItems}
                </div>
            </div>
        </div>
    )
}

export default Skills;