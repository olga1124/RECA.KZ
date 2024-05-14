import EmployersCard, { EmployersCardProps } from "@/components/EmployersCard";

interface Props {
    items: EmployersCardProps[];
}

const Employers: React.FC<Props> = ({items}) => {
    return (
        <div className="employers-container">
            <div className="employers-content">
                <h1>Наши  Услуги</h1>
                <div className="employers-cards">
                    {items.map((item, index) => (<EmployersCard key={index} {...item} />))}
                </div>
            </div>
        </div>
    )
}

export default Employers;