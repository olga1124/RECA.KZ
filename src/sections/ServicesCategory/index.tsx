import ServiceCard, { ServiceCardProps } from "@/components/ServiceCard"

interface Props {
    items: ServiceCardProps[];
}

const ServicesCategory: React.FC<Props> = ({ items }) => {

    return(
        <div className="services-cat-container">
            <div className="services-cat-content">
                {items.map((item, index) => (<ServiceCard key={index} {...item}/>))} 
            </div>
        </div>
    )
}

export default ServicesCategory;