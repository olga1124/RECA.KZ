import { navbarLinks } from "@/constants/navbar";
import Image from "next/image";
import Link from "next/link";
import SocialLinks from "../SocialLinks";

const Footer = () => {

    return (
        <div className="footer-container">
            <div className="footer-content">
                <div id="logo" className="footer-row logo">
                    <Image src="/logo-light.svg" width={250} height={80} alt="" />
                </div>
                <div id="social" className="footer-row social">
                    <div className="social">
                        <p>Контакты</p>
                        <SocialLinks color="white" />
                    </div>
                </div>
                <div id="links" className="footer-row links">
                    <ul>
                        {navbarLinks.map(({ title, path }) => (
                            <li key={`nav-` + title}>
                                <Link href={path}>{title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div id="copyright">
                    <div className="footer-copyright">
                        <span>Copyright © 2024, REC-A. All rights reserved.</span>
                    </div>
                    <div className="footer-developed">
                        <span>Developed by <a href="https://nelcosoft.com">Nelcosoft</a></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;