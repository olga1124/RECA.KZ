export interface HeroProps {
    title: string;
    subtitle: string;
    text?: string;
}


const Hero: React.FC<HeroProps> = ({
    title, 
    subtitle,
    text
}) => {
    return(
        <div className="hero-container top">
            <div className="hero-content">
                <div className="title">
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>
                <div className="discription" style={{display: text && text.length !== 0 ? "block" : "none"}}>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    )
}

export default Hero;