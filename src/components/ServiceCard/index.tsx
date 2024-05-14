import Link from "next/link";
import { headlineFormatter } from "@/utils/stringFormatter";

export interface ServiceCardProps {
    title: string;
    text: string;
    btnTitle: string;
    path: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    title,
    text,
    btnTitle,
    path
}) => {
    return(
        <div className="service-card">
            {headlineFormatter(title)}
            <p>{text}</p>
            <Link href={path}>{btnTitle}</Link>
        </div>
    )
}
export default ServiceCard;