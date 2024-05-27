"use client";
import { useState } from "react";
import Link from "next/link";
import { headlineFormatter } from "@/utils/stringFormatter";
import Popup from "../Popup";
import { CardType, PopupType, ServiceCardProps } from "./ServiceCardTypes";
import ContactForm from "../ContactForm";
import UploadCV from "../UploadCV";

const ServiceCard: React.FC<ServiceCardProps> = ({
    title,
    text,
    btnTitle,
    path,
    type,
    popupType
}) => {
    const [isPopupVisible, setPopupVisible] = useState(false);

    const someFunction = () => {
        setPopupVisible(true);
    };

    const renderPopupContent = () => {
        switch (popupType) {
            case PopupType.form:
                return <ContactForm selections={["Работа в Европе"]} />;
            case PopupType.sendCV:
                return <UploadCV />;
            default:
                return <div>Default Content</div>;
        }
    };

    return (
        <>
            <div className="service-card">
                {headlineFormatter(title)}
                <p>{text}</p>
                {type === CardType.link ? (
                    <Link href={path}>{btnTitle}</Link>
                ) : (
                    <button onClick={someFunction}>{btnTitle}</button>
                )}
            </div>
            <Popup trigger={isPopupVisible} setTrigger={setPopupVisible}>
                {renderPopupContent()}
            </Popup>
        </>
    )
}
export default ServiceCard;