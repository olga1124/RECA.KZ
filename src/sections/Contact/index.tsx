import OrderForm from "@/components/OrderForm";
import ContactMap from "@/components/ContactMap";

const Contact = () => {

    const questions: [string, string][] = [
        ["employers", "Подбор сотрудников"],
        ["job-eu", "Работа в Европе"],
        ["job-kz", "Работа в Казахстане"],
        ["colaboration", "Сотрудничество"]
    ]

    return (
        <section id="contact">
            <div className="contact-container">
                <div className="contact-content">
                    <div className="order-form-wrapper">
                        <h1>Свяжитесь <span>с нами</span></h1>
                        <OrderForm questions={questions}/>
                    </div>
                    <ContactMap />
                </div>
            </div>
        </section>
    )
}

export default Contact;