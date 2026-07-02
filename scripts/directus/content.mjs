/**
 * Seed content, defined once per locale (ru = source, kz/en = translations).
 * RU text is taken verbatim from the current live site; KZ/EN are translations
 * that editors can refine in Directus (single source of truth going forward).
 *
 * Shape: helpers below return `{ ru, kz, en }` maps consumed by seed.mjs.
 */

// ── Global ────────────────────────────────────────────────────────────────

export const siteSettings = {
	base: {
		email: "info@reca.kz",
		phone: "+7 775 888 72 03",
		address: "Казахстан",
		social_links: [
			{ platform: "whatsapp", url: "https://wa.me/77758887203" },
			{ platform: "instagram", url: "https://instagram.com/reca.kz" },
		],
	},
	tr: {
		ru: { site_name: "REC-A", footer_text: "<p>REC-A — рекрутинговое агентство полного цикла.</p>" },
		kz: { site_name: "REC-A", footer_text: "<p>REC-A — толық циклді рекрутинг агенттігі.</p>" },
		en: { site_name: "REC-A", footer_text: "<p>REC-A — a full-cycle recruitment agency.</p>" },
	},
};

// UI strings: key → { ru, kz, en }
export const uiStrings = {
	"common.learn_cost": { ru: "Узнать стоимость услуг", kz: "Қызмет құнын білу", en: "Find out the cost" },
	"common.submit": { ru: "Отправить", kz: "Жіберу", en: "Submit" },
	"common.read_more": { ru: "Подробнее", kz: "Толығырақ", en: "Read more" },
	"common.read_full": { ru: "Читать полностью", kz: "Толық оқу", en: "Read full" },
	"common.close": { ru: "Закрыть", kz: "Жабу", en: "Close" },
	"common.director": { ru: "Директор", kz: "Директор", en: "Director" },
	"form.name": { ru: "Ваше имя", kz: "Атыңыз", en: "Your name" },
	"form.email": { ru: "Email", kz: "Email", en: "Email" },
	"form.phone": { ru: "Мобильный", kz: "Ұялы телефон", en: "Phone" },
	"form.message": { ru: "Сообщение", kz: "Хабарлама", en: "Message" },
	"form.sending": { ru: "Отправка информации", kz: "Ақпарат жіберілуде", en: "Sending" },
	"form.success_title": { ru: "Спасибо за ваше обращение", kz: "Өтінішіңізге рахмет", en: "Thank you for your request" },
	"form.success_text": {
		ru: "Скоро мы свяжемся с вами и предоставим ответы на интересующие вопросы",
		kz: "Жақын арада сізбен байланысып, сұрақтарыңызға жауап береміз",
		en: "We will contact you shortly with answers to your questions",
	},
	"form.error_title": { ru: "Ошибка отправки", kz: "Жіберу қатесі", en: "Submission error" },
	"form.error_text": {
		ru: "Мы уже решаем эту проблему, попробуйте отправить запрос позднее",
		kz: "Біз бұл мәселені шешудеміз, кейінірек қайталап көріңіз",
		en: "We are working on it, please try again later",
	},
	"reviews.heading": { ru: "Отзывы и рекомендации", kz: "Пікірлер мен ұсыныстар", en: "Reviews & recommendations" },
	"contact.heading": { ru: "Свяжитесь с нами", kz: "Бізбен байланысыңыз", en: "Get in touch" },
	"nav.home": { ru: "Главная", kz: "Басты бет", en: "Home" },
	"nav.employers": { ru: "Классический рекрутинг", kz: "Классикалық рекрутинг", en: "Classic recruiting" },
	"nav.job": { ru: "HR-подписка", kz: "HR-жазылым", en: "HR subscription" },
	"nav.contact": { ru: "Контакты", kz: "Байланыс", en: "Contacts" },
};

// ── Reviews (NOT translated — testimonials shown as-is on every language) ────

export const reviews = [
	{
		company: "Melcor", director: "Вячеслав М.", rating: 5,
		full_text: `От лица компании ТОО “Melcor” благодарю Вас за качественно выполненный подбор персонала. Все требования к кандидату были учтены, а процесс подбора выстроен с пониманием специфики нашей деятельности.
Отдельно отмечаю Ваш деликатный и профессиональный подход к взаимодействию с нашей командой.
Благодарю за внимательность к деталям и высокий уровень исполнения!
Наша компания обязательно обратится к Вам снова, как только возникнет потребность в подборе персонала.
С уважением, Вячеслав.`,
	},
	{
		company: "Big Smoke", director: "Рустэм М.", rating: 5,
		full_text: `Благодарю вас за проделанную работу. Было приятно иметь дело с профессионалом. Кандидат превзошел все ожидания. Мы в восторге, а главное вся работа была проделана за короткие сроки.
Больше всего в работе с вами поразил уровень погружения в детали и предоставления «summary» на каждого кандидата, составленный вами. Это очень удобно!
Будем рады сотрудничать с вами.`,
	},
	{
		company: "Хорошее молоко", director: "Антон С.", rating: 5,
		full_text: `Спасибо вам за подобранного специалиста!
Хороший, коммуникабельный, уже есть результаты!
А вам спасибо за чёткий и слаженный поиск кандидата.`,
	},
];

// ── Navigation ──────────────────────────────────────────────────────────────

export const navigation = [
	{ link_type: "page", permalink: "/", sort: 1, title: { ru: "Главная", kz: "Басты бет", en: "Home" } },
	{ link_type: "page", permalink: "/employers", sort: 2, title: { ru: "Классический рекрутинг", kz: "Классикалық рекрутинг", en: "Classic recruiting" } },
	{ link_type: "page", permalink: "/job", sort: 3, title: { ru: "HR-подписка", kz: "HR-жазылым", en: "HR subscription" } },
	{ link_type: "anchor", anchor: "#contact", sort: 4, title: { ru: "Контакты", kz: "Байланыс", en: "Contacts" } },
];

// ── Forms ────────────────────────────────────────────────────────────────
// key → { target_collection, tr, fields[] }. Field `name` maps to a column
// in the target collection. `divider` splits the form into wizard steps.

export const forms = {
	contact: {
		target_collection: "leads",
		tr: {
			ru: { title: "Контакты / заказ услуги", submit_label: "Отправить", success_message: "Спасибо! Мы свяжемся с вами в ближайшее время." },
			kz: { title: "Байланыс / қызметке тапсырыс", submit_label: "Жіберу", success_message: "Рахмет! Жақын арада сізбен байланысамыз." },
			en: { title: "Contact / service request", submit_label: "Submit", success_message: "Thank you! We will contact you shortly." },
		},
		fields: [
			{
				name: "selections", type: "checkbox_group", required: false, width: "full", sort: 1,
				choices: [
					{ ru: "Подбор сотрудников", kz: "Қызметкерлерді таңдау", en: "Staff recruitment" },
					{ ru: "Классический рекрутинг", kz: "Классикалық рекрутинг", en: "Classic recruiting" },
					{ ru: "HR подписка", kz: "HR жазылым", en: "HR subscription" },
					{ ru: "Отправить резюме", kz: "Түйіндеме жіберу", en: "Send a CV" },
				],
				tr: {
					ru: { label: "Выберите, что вас интересует" },
					kz: { label: "Сізді не қызықтыратынын таңдаңыз" },
					en: { label: "Choose what interests you" },
				},
			},
			{ name: "_divider1", type: "divider", required: false, width: "full", sort: 2, tr: { ru: {}, kz: {}, en: {} } },
			{ name: "name", type: "text", required: true, width: "full", sort: 3, tr: {
				ru: { label: "Ваше имя", placeholder: "Имя" }, kz: { label: "Атыңыз", placeholder: "Аты" }, en: { label: "Your name", placeholder: "Name" } } },
			{ name: "email", type: "email", required: true, width: "half", sort: 4, tr: {
				ru: { label: "Email", placeholder: "Email" }, kz: { label: "Email", placeholder: "Email" }, en: { label: "Email", placeholder: "Email" } } },
			{ name: "phone", type: "tel", required: true, width: "half", sort: 5, tr: {
				ru: { label: "Мобильный", placeholder: "Телефон" }, kz: { label: "Ұялы телефон", placeholder: "Телефон" }, en: { label: "Phone", placeholder: "Phone" } } },
			{ name: "subject", type: "text", required: false, width: "full", sort: 6, tr: {
				ru: { label: "Сообщение", placeholder: "Ваш вопрос" }, kz: { label: "Хабарлама", placeholder: "Сұрағыңыз" }, en: { label: "Message", placeholder: "Your question" } } },
		],
	},
	cv: {
		target_collection: "applicants",
		tr: {
			ru: { title: "Загрузка резюме", submit_label: "Отправить резюме", success_message: "Резюме получено! Мы свяжемся с вами." },
			kz: { title: "Түйіндемені жүктеу", submit_label: "Түйіндеме жіберу", success_message: "Түйіндеме қабылданды! Сізбен байланысамыз." },
			en: { title: "Upload CV", submit_label: "Send CV", success_message: "CV received! We will contact you." },
		},
		fields: [
			{ name: "name", type: "text", required: false, width: "half", sort: 1, tr: {
				ru: { label: "Ваше имя" }, kz: { label: "Атыңыз" }, en: { label: "Your name" } } },
			{ name: "phone", type: "tel", required: false, width: "half", sort: 2, tr: {
				ru: { label: "Телефон" }, kz: { label: "Телефон" }, en: { label: "Phone" } } },
			{ name: "file", type: "file", required: true, width: "full", sort: 3, tr: {
				ru: { label: "Резюме", help_text: "PDF, DOCX" }, kz: { label: "Түйіндеме", help_text: "PDF, DOCX" }, en: { label: "CV", help_text: "PDF, DOCX" } } },
		],
	},
};
