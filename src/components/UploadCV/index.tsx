import React, { useState } from 'react';
import styles from "./UploadCV.module.css";
import emailjs from 'emailjs-com';

const UploadCV = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 50 * 1024) {
                setError("Файл слишком большой. Максимальный размер файла: 50 КБ");
                setFile(null);
            } else {
                setError("");
                setFile(selectedFile);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            setError("Пожалуйста, выберите файл для загрузки");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const serviceID = process.env.NEXT_PUBLIC_SERVICE_ID;
            const templateID = process.env.NEXT_PUBLIC_TEMPLATE_UPLOAD_CV;
            const userID = process.env.NEXT_PUBLIC_USER_ID;

            if (!serviceID || !templateID || !userID) {
                console.error('One or more environment variables are missing');
                return;
            }

            const emailParams = {
                to_name: "Получатель",
                from_name: "Отправитель",
                message: "Вам отправили новое резюме.",
                my_file: reader.result,
                my_file_name: file.name
            };

            emailjs.send(serviceID, templateID, emailParams, userID)
                .then((result) => {
                    console.log('SUCCESS!', result.status, result.text);
                    setFile(null);
                    setError("");
                    if (e.currentTarget instanceof HTMLFormElement) {
                        e.currentTarget.reset();
                    }
                }, (error) => {
                    console.error('FAILED...', error);
                });
        };

        reader.onerror = (error) => {
            console.error('Ошибка при чтении файла: ', error);
            setError("Ошибка при чтении файла");
        };
    };

    return (
        <div className={styles.container}>
            <div className={styles.headline}>
                <h3>Загрузите своё резюме</h3>
                <p>Загрузите своё резюме и мы найдем для вас подходящую вакансию.</p>
                <p>Мы свяжемся с вами по указанным данным в резюме, проверьте чтобы они были актуальны.</p>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="file" name="my_file" onChange={handleFileChange} />
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit">Отправить резюме</button>
            </form>
        </div>
    );
};

export default UploadCV;
