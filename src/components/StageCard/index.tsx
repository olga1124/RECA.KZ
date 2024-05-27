import Image from "next/image";

export interface StageProps {
    title: string;
    text: string;
    image: string;
}

const StageCard: React.FC<StageProps> = ({
    title,
    text,
    image
}) => {

    return (
        <div className="stage-card">
            <div className="icon">
                <Image src={image} layout="responsive" width={17} height={9} alt="" />
            </div>
            <div className="stage-text">
                <h3>{title}</h3>
                <p>{text}</p>
            </div>
        </div>
    )
}
export default StageCard;