/** @format */

export enum CardType {
    button = "button",
    link = "link",
}

export interface ServiceCardProps {
    title: string;
    text: string;
    textUnder?: string;
    btnTitle: string;
    path: string;
    type: CardType;
    popupType: PopupType;
}

export enum PopupType {
    form = "form",
    sendCV = "sendCV",
}
