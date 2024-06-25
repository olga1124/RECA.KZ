import Instagram from "@/assets/icons/instagram.svg";
import Whatsapp from "@/assets/icons/whatsapp.svg";
import Phone from "@/assets/icons/phone.svg";
import Image from "next/image";

interface SocialLinksProps {
    color: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ color }) => {
    return (
        <div className="social-links">
            <a href="https://www.instagram.com/reca.kz?igsh=ZHAxZHdxMjJ4dTl3" target="_blank">
                <Image
                    src={Instagram}
                    width={30}
                    height={30}
                    alt="Instagram"
                    style={{ filter: `invert(${color !== 'white' ? 100 : 0}%)` }}
                />
            </a>
            <a href="https://wa.me/77758887203" target="_blank">
                <Image
                    src={Whatsapp}
                    width={30}
                    height={30}
                    alt="Whatsapp"
                    style={{ filter: `invert(${color !== 'white' ? 100 : 0}%)` }}
                />
            </a>
            <a href="tel:+77758887203" target="_blank">
                <Image
                    src={Phone}
                    width={30}
                    height={30}
                    alt="Phone"
                    style={{ filter: `invert(${color !== 'white' ? 100 : 0}%)` }}
                />
            </a>
        </div>
    )
}

export default SocialLinks;
