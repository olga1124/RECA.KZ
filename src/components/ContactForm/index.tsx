import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

interface ContactFormProps {
    service?: string;
    selections?: string[];
    onRemoveSelection?: (index: number) => void;
}

interface FormData {
    selections: string[];
    name: string;
    email: string;
    phone: string;
    subject: string;
}

interface DataToSend {
    selections?: string[];
    name: string;
    email: string;
    phone: string;
    subject: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
    service,
    selections,
    onRemoveSelection
}) => {

    const [canSend, setCanSend] = useState(true);
    const [status, setStatus] = useState<boolean | null>(null);

    const [formData, setFormData] = useState<FormData>({
        selections: [],
        name: '',
        email: '',
        phone: '',
        subject: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            const updatedFormData = { ...prevState, [name]: value };
            return updatedFormData;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (canSend) {
            setCanSend(false);

            const dataToSend: DataToSend = {
                selections,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
            };

            try {
                const response = await fetch('https://nelcosoft-backend-docker-image-izihmdm54q-ew.a.run.app/api/leads/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setStatus(true);
                setFormData({
                    selections: [],
                    name: '',
                    email: '',
                    phone: '',
                    subject: ''
                });
                if (selections && selections.length > 0) {
                    selections.forEach((_, index) => onRemoveSelection?.(index));
                }
            } catch (error) {
                console.error('Error during data submission:', error);
                setStatus(false);
            } finally {
                setCanSend(true);
            }
        }
    };


    return (
        <div className="contact-form">
            {canSend ? (
                status !== null ? (
                    <div className="flex flex-col gap-20">
                        <header className="contact-form-header">
                            <h2>{status ? "Спасибо за ваше обращение" : "Ошибка отправки"}</h2>
                            <p>{status ? "Скоро мы свяжемся в вами и предостаавим ответы на интересующие вопросы" : "Мы уже решаем эту проблему, попробуйте отправить запрос позднее"}</p>

                        </header>
                        <p className={`self-center ${status ? "text-green-600" : "text-red-600"}`}>
                            {status ? "Ваше сообщение было успешно  отправлено" : "Ошибка отправки сообщения"}
                        </p>
                    </div>
                ) : (
                    <div className="contact-form-wrapper">
                        <header className="contact-form-header">
                            <h3>Отправка запроса</h3>
                            <p>Мы подготовим для вас лучше предложения на трудовом рынке, и проделаем всю самую сложную работу за вас. 
                                После отправки формы мы свяжемся с вами по указанным данным для дальнейшего продолжения сотрудничества</p>
                        </header>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <label className="input-container flex-1">
                                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required aria-label="Name" />
                                <span>Ваше имя</span>
                            </label>
                            <label className="input-container flex-1">
                                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required aria-label="Email" />
                                <span>Email</span>
                            </label>
                            <label className="input-container">
                                <input type="tel" name="phone" pattern="[0-9]*" value={formData.phone} onChange={handleChange} placeholder="Phone" required aria-label="Phone" />
                                <span>Мобильный</span>
                            </label>
                            <label className="input-container">
                                <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required aria-label="Subject" />
                                <span>Сообщение</span>
                            </label>
                            {selections && selections.length > 0 && (
                                <>
                                    <h4>Выбранные услуги:</h4>
                                    <div className="flex gap-3 flex-wrap items-center pb-4">
                                        {selections.map((item, index) => (
                                            <div key={"service-" + index} className="flex items-center justify-center bg-gray-200 rounded-md px-4 py-1 text-sm">
                                                <span className="mr-2">{item.toUpperCase()}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveSelection?.(index)}
                                                    className="text-gray-500 hover:text-gray-800 focus:outline-none text-1xl"
                                                    aria-label={`Remove ${item}`}>
                                                    <FaXmark width="15px" height="15px"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            <button type="submit" className="form-button secondary-btn">Отправить</button>
                        </form>
                    </div>
                )
            ) : (
                <div className="flex flex-col gap-20 py-4 text-center justify-around items-center">
                    <h3>Отправка информации</h3>
                    < div className="loader"></div>
                </div>
            )}
        </div >
    );
};

export default ContactForm;