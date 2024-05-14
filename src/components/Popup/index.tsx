import React, { ReactNode } from "react";
import CloseButton from "../Buttons/CloseButton";

interface PopupProps {
    trigger: boolean;
    setTrigger: (value: boolean) => void;
    children: ReactNode;
}

const Popup: React.FC<PopupProps> = ({ trigger, setTrigger, children }) => {
    return trigger ? (
        <div className="popup">
            <div className="popup-container">
                {children}
                <CloseButton onClick={() => setTrigger(false)}/>
            </div>
        </div>
    ) : null;
};

export default Popup;