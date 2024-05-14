import { subheaderFormatter } from "@/utils/stringFormatter";

export interface EmployersCardProps {
    title: string;
    text: string;
    icon: string;
}

const EmployersCard: React.FC<EmployersCardProps> = ({
    title,
    text,
    icon
}) => {
    return (
        <div className="employers-card" style={{backgroundImage: `url(/icons/${icon}.svg)`}}>
             {subheaderFormatter(title)}
            <p>{text}</p>
        </div>
    )
}

export default EmployersCard;