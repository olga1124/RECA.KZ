"use client"
import { useState } from "react";
import Popup from "../Popup";
import ContactForm from "../ContactForm";

export interface OrderFormProps {
    title?: string;
    questions: [string, string][];
    service?: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ title, questions }) => {

    const [isPopupVisible, setPopupVisible] = useState(false);

    const [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean }>(
        questions.reduce((acc, [id]) => ({ ...acc, [id]: false }), {})
    );

    const [selections, setSelections] = useState<string[]>([]);

    const handleCheckboxChange = (id: string) => {
        setCheckedStates(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const selectedServices = Object.entries(checkedStates)
            .filter(([, value]) => value)
            .map(([key]) => key);
        setSelections(selectedServices);
        setPopupVisible(true);
    };

    const handleRemoveSelection = (index: number) => {
        setSelections(current => current.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className="order-form">
                <h2>Выберите что вас интересует</h2>
                <form onSubmit={handleSubmit}>
                    <div className="checkbox-grid">
                        {questions.map(([id, label]) => (
                            <div key={id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={id}
                                    name={label}
                                    checked={checkedStates[label]}
                                    onChange={() => handleCheckboxChange(label)}
                                />
                                <label htmlFor={id}>{label}</label>
                            </div>
                        ))}
                    </div>
                    <button type="submit">Связаться</button>
                </form>
            </div>
            <Popup trigger={isPopupVisible} setTrigger={setPopupVisible}>
                <ContactForm selections={selections} onRemoveSelection={handleRemoveSelection} />
            </Popup>
        </>
    )
}

export default OrderForm;