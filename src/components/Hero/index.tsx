"use client"
import { useState } from "react";
import Popup from '../Popup';
import ContactFormHero from '../ContactFormHero';

export interface HeroProps {
	title: string;
	subtitle: string;
	text?: string;
	btnText?: string;
	suptitle?: string;
}


const Hero: React.FC<HeroProps> = ({
	title,
	subtitle,
	text,
	btnText,
	suptitle
}) => {

	const [isPopupVisible, setPopupVisible] = useState(false);
	return (
		<>
			<div className="hero-container top">
				<div className="hero-content">
					<div className="title">
						<p className='hero-descr-over'>{subtitle}</p>
						<h1>{title}</h1>
						{suptitle && <p className='hero-descr-under'>{suptitle}</p>}
						{btnText &&
							<button
								onClick={() => setPopupVisible(true)}
								className='hero-cta'
							>
								{btnText}
							</button>
						}
					</div>
					<div className="discription" style={{ display: text && text.length !== 0 ? "block" : "none" }}>
						<p>{text}</p>
					</div>
				</div>
			</div>
			<Popup trigger={isPopupVisible} setTrigger={setPopupVisible}>
				<ContactFormHero />
			</Popup>
		</>
	)
}

export default Hero;