import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import sendForm from "../../utils/sendForm";

interface ContactFormHeroProps {
	service?: string;
	selections?: string[];
	onRemoveSelection?: (index: number) => void;
}

interface FormData {
	name: string;
	phone: string;
	city: string;
}

const ContactFormHero: React.FC<ContactFormHeroProps> = ({ }) => {
	const [canSend, setCanSend] = useState(true);
	const [status, setStatus] = useState<boolean | null>(null);

	const [formData, setFormData] = useState<FormData>({
		name: '',
		phone: '',
		city: ''
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (canSend) {
			setCanSend(false);

			const dataToSend = {
				name: formData.name,
				phone: formData.phone,
				city: formData.city,
			};

			try {
				await sendForm(dataToSend);
				setStatus(true);
				setFormData({
					name: '',
					phone: '',
					city: ''
				});
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
							<p>{status ? "Скоро мы свяжемся в вами и предоставим ответы на интересующие вопросы" : "Мы уже решаем эту проблему, попробуйте отправить запрос позднее"}</p>
						</header>
						<p className={`self-center ${status ? "text-green-600" : "text-red-600"}`}>
							{status ? "Ваше сообщение было успешно отправлено" : "Ошибка отправки сообщения"}
						</p>
					</div>
				) : (
					<div className="contact-form-wrapper">
						<header className="contact-form-header">
							<h3>Отправка запроса</h3>
							<p>После отправки формы мы свяжемся с вами по указанным данным для дальнейшего продолжения сотрудничества</p>
						</header>
						<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
							<label className="input-container flex-1">
								<input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required aria-label="Name" />
								<span>Ваше имя</span>
							</label>
							<label className="input-container mb-3">
								<input type="tel" name="phone" pattern="[0-9]*" value={formData.phone} onChange={handleChange} placeholder="Phone" required aria-label="Phone" />
								<span style={{ fontFamily: 'sans-serif' }}>Мобильный (WhatsApp)</span>
							</label>

							<button type="submit" className="form-button secondary-btn">Отправить</button>
						</form>
					</div>
				)
			) : (
				<div className="flex flex-col gap-20 py-4 text-center justify-around items-center">
					<h3>Отправка информации</h3>
					<div className="loader"></div>
				</div>
			)}
		</div>
	);
};

export default ContactFormHero;
