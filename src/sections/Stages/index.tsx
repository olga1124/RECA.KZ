import StageCard, { StageProps } from "@/components/StageCard"
import { headlineFormatter } from "@/utils/stringFormatter";

interface Props {
    title: string;
    items: StageProps[];
}

const Stages: React.FC<Props> = ({ title, items }) => {
    return (
        <div className="stages-container">
            <div className="stages-content">
            {headlineFormatter(title)}
                <div className="items-stages">
                    {items.map((item, index) => (<StageCard key={index} {...item} />))}
                </div>
            </div>
        </div>
    )
}

export default Stages;