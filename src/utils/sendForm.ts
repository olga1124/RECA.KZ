/** @format */

import emailjs from "emailjs-com";

interface SendFormProps {
    selections?: string;
    name: string;
    email?: string;
    phone: string;
    subject?: string;
    city?: string;
}

const sendForm = async (params: SendFormProps) => {
    const serviceID = process.env.NEXT_PUBLIC_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_TEMPLATE_NEW_LEAD;
    const userID = process.env.NEXT_PUBLIC_USER_ID;

    if (!serviceID) {
        throw new Error("Environment variable SERVICE_ID is missing");
    }
    if (!templateID) {
        throw new Error("Environment variable TEMPLATE_ID is missing");
    }
    if (!userID) {
        throw new Error("Environment variable USER_KEY is missing");
    }

    const templateParams = {
        selections: params.selections || "No selections",
        name: params.name,
        email: params.email || "",
        phone: params.phone,
        subject: params.subject || "",
    };

    try {
        const result = await emailjs.send(
            serviceID,
            templateID,
            templateParams,
            userID
        );
        console.log(result.text);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

export default sendForm;
