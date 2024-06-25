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
            text: "Каждый клиент обладает индивидуальными потребностями и требованиями. Нашей командой разрабатываются уникальные стратегии, которые помогают находить решения, учитывающие все тонкости и соответствующие ценностям наших клиентов.",
            icon: FaRegClock
        },
        {
            title: "Качество",
            text: "Мы придерживаемся высоких стандартов качества и сервиса на каждом этапе нашей работы, обеспечивая первоклассный подход от определения требований до достижения конечного результата.",
            icon: FaRegHandRock
        },
        {
            title: "Конфидециальность",
            text: "При заключении сотрудничества с нами, каждый наш  клиент может быть уверен в соблюдении высоких стандартов конфиденциальности при обращении с любой информацией.",
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