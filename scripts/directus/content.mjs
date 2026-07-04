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
		en: { site_name: "REC-A", footer_text: "<p>REC-A is a full-cycle recruitment agency.</p>" },
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
	"common.next": { ru: "Далее", kz: "Келесі", en: "Next" },
	"common.back": { ru: "Назад", kz: "Артқа", en: "Back" },
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
	"contact.subtitle": {
		ru: "Оставьте заявку или напишите нам напрямую — ответим в течение рабочего дня.",
		kz: "Өтінім қалдырыңыз немесе бізге тікелей жазыңыз, жұмыс күні ішінде жауап береміз.",
		en: "Leave a request or write to us directly and we will reply within one business day.",
	},
	"contact.phone": { ru: "Телефон", kz: "Телефон", en: "Phone" },
	"contact.email": { ru: "Email", kz: "Email", en: "Email" },
	"contact.address": { ru: "Адрес", kz: "Мекенжай", en: "Address" },
	"contact.socials": { ru: "Мы в соцсетях:", kz: "Біз әлеуметтік желілерде:", en: "Follow us:" },
	"contact.map_note": {
		ru: "Работаем с компаниями по всему Казахстану и за его пределами.",
		kz: "Бүкіл Қазақстан бойынша және одан тыс жерлердегі компаниялармен жұмыс істейміз.",
		en: "We work with companies across Kazakhstan and beyond.",
	},
	"contact.regions": { ru: "Казахстан · Россия · Европа · ОАЭ", kz: "Қазақстан · Ресей · Еуропа · БАӘ", en: "Kazakhstan · Russia · Europe · UAE" },
	"nav.home": { ru: "Главная", kz: "Басты бет", en: "Home" },
	"nav.employers": { ru: "Классический рекрутинг", kz: "Классикалық рекрутинг", en: "Classic recruiting" },
	"nav.job": { ru: "HR-подписка", kz: "HR-жазылым", en: "HR subscription" },
	"nav.contact": { ru: "Контакты", kz: "Байланыс", en: "Contacts" },
	"nav.menu": { ru: "Меню", kz: "Мәзір", en: "Menu" },
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

// ── Navbar ────────────────────────────────────────────────────────────────

export const navbar = [
	{ link_type: "page", permalink: "/", sort: 1, title: { ru: "Главная", kz: "Басты бет", en: "Home" } },
	{ link_type: "page", permalink: "/employers", sort: 2, title: { ru: "Классический рекрутинг", kz: "Классикалық рекрутинг", en: "Classic recruiting" } },
	{ link_type: "page", permalink: "/job", sort: 3, title: { ru: "HR-подписка", kz: "HR-жазылым", en: "HR subscription" } },
	{ link_type: "page", permalink: "/contact", sort: 4, title: { ru: "Контакты", kz: "Байланыс", en: "Contacts" } },
];

// ── Footer (columns: a heading + a list of links) ───────────────────────────

export const footer = [
	{
		sort: 1,
		title: { ru: "Меню", kz: "Мәзір", en: "Menu" },
		links: [
			{ link_type: "page", permalink: "/", sort: 1, label: { ru: "Главная", kz: "Басты бет", en: "Home" } },
			{ link_type: "page", permalink: "/employers", sort: 2, label: { ru: "Классический рекрутинг", kz: "Классикалық рекрутинг", en: "Classic recruiting" } },
			{ link_type: "page", permalink: "/job", sort: 3, label: { ru: "HR-подписка", kz: "HR-жазылым", en: "HR subscription" } },
		],
	},
	{
		sort: 2,
		title: { ru: "Контакты", kz: "Байланыс", en: "Contacts" },
		links: [
			{ link_type: "page", permalink: "/contact", sort: 1, label: { ru: "Оставить заявку", kz: "Өтінім қалдыру", en: "Leave a request" } },
		],
	},
];

// ── Forms ────────────────────────────────────────────────────────────────
// key → { target_collection, tr, fields[] }. Field `name` maps to a column
// in the target collection; names without a column land in the `details`
// JSON of the submission. `divider` splits the form into wizard steps.
//
// One form per context: contact (universal), hire (employer request),
// subscription (Recruit Flow), cv (job seeker), callback (quick call).

export const forms = {
	contact: {
		target_collection: "leads",
		tr: {
			ru: { title: "Оставьте заявку", submit_label: "Отправить", success_message: "Спасибо! Мы свяжемся с вами в ближайшее время." },
			kz: { title: "Өтінім қалдырыңыз", submit_label: "Жіберу", success_message: "Рахмет! Жақын арада сізбен байланысамыз." },
			en: { title: "Leave a request", submit_label: "Submit", success_message: "Thank you! We will contact you shortly." },
		},
		fields: [
			{
				name: "selections", type: "checkbox_group", required: false, width: "full", sort: 1,
				choices: [
					{ ru: "Классический рекрутинг (Classic Recruit)", kz: "Классикалық рекрутинг (Classic Recruit)", en: "Classic recruiting (Classic Recruit)" },
					{ ru: "HR-подписка (Recruit Flow)", kz: "HR-жазылым (Recruit Flow)", en: "HR subscription (Recruit Flow)" },
					{ ru: "Хочу отправить резюме", kz: "Түйіндеме жібергім келеді", en: "I want to send a CV" },
					{ ru: "Другой вопрос", kz: "Басқа сұрақ", en: "Other question" },
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
			{ name: "subject", type: "textarea", required: false, width: "full", sort: 6, tr: {
				ru: { label: "Сообщение", placeholder: "Ваш вопрос" }, kz: { label: "Хабарлама", placeholder: "Сұрағыңыз" }, en: { label: "Message", placeholder: "Your question" } } },
		],
	},

	// Employer request: step 1 describes the task, step 2 — contacts.
	hire: {
		target_collection: "leads",
		tr: {
			ru: { title: "Заявка на подбор персонала", submit_label: "Отправить заявку", success_message: "Спасибо! Мы изучим задачу и свяжемся с вами в течение рабочего дня." },
			kz: { title: "Персонал іріктеуге өтінім", submit_label: "Өтінім жіберу", success_message: "Рахмет! Міндетті қарап шығып, жұмыс күні ішінде сізбен байланысамыз." },
			en: { title: "Staff search request", submit_label: "Send request", success_message: "Thank you! We will review your request and contact you within one business day." },
		},
		fields: [
			{
				name: "service", type: "radio", required: true, width: "full", sort: 1,
				choices: [
					{ ru: "Classic Recruit — разовый подбор", kz: "Classic Recruit — бір реттік іріктеу", en: "Classic Recruit — one-time search" },
					{ ru: "Recruit Flow — HR-подписка", kz: "Recruit Flow — HR-жазылым", en: "Recruit Flow — HR subscription" },
					{ ru: "Затрудняюсь ответить", kz: "Жауап беруге қиналамын", en: "Not sure yet" },
				],
				tr: {
					ru: { label: "Какой формат сотрудничества вас интересует?" },
					kz: { label: "Ынтымақтастықтың қай форматы қызықтырады?" },
					en: { label: "Which format of cooperation are you interested in?" },
				},
			},
			{ name: "position", type: "text", required: true, width: "full", sort: 2, tr: {
				ru: { label: "Кого нужно подобрать?", placeholder: "Например: руководитель отдела продаж" },
				kz: { label: "Кімді іріктеу қажет?", placeholder: "Мысалы: сату бөлімінің басшысы" },
				en: { label: "Who do you need to hire?", placeholder: "e.g. Head of Sales" } } },
			{
				name: "positions_count", type: "select", required: false, width: "half", sort: 3,
				choices: [
					{ ru: "1 специалист", kz: "1 маман", en: "1 specialist" },
					{ ru: "2–3 специалиста", kz: "2–3 маман", en: "2-3 specialists" },
					{ ru: "4 и более", kz: "4 және одан көп", en: "4 or more" },
					{ ru: "Постоянный поток", kz: "Тұрақты ағын", en: "Ongoing flow" },
				],
				tr: {
					ru: { label: "Сколько специалистов нужно?", placeholder: "Выберите" },
					kz: { label: "Қанша маман қажет?", placeholder: "Таңдаңыз" },
					en: { label: "How many specialists?", placeholder: "Select" },
				},
			},
			{ name: "city", type: "text", required: false, width: "half", sort: 4, tr: {
				ru: { label: "Город", placeholder: "Алматы" }, kz: { label: "Қала", placeholder: "Алматы" }, en: { label: "City", placeholder: "Almaty" } } },
			{ name: "_divider1", type: "divider", required: false, width: "full", sort: 5, tr: { ru: {}, kz: {}, en: {} } },
			{ name: "company", type: "text", required: true, width: "full", sort: 6, tr: {
				ru: { label: "Компания", placeholder: "Название компании" }, kz: { label: "Компания", placeholder: "Компания атауы" }, en: { label: "Company", placeholder: "Company name" } } },
			{ name: "name", type: "text", required: true, width: "half", sort: 7, tr: {
				ru: { label: "Ваше имя", placeholder: "Имя" }, kz: { label: "Атыңыз", placeholder: "Аты" }, en: { label: "Your name", placeholder: "Name" } } },
			{ name: "phone", type: "tel", required: true, width: "half", sort: 8, tr: {
				ru: { label: "Телефон", placeholder: "+7" }, kz: { label: "Телефон", placeholder: "+7" }, en: { label: "Phone", placeholder: "+7" } } },
			{ name: "email", type: "email", required: false, width: "full", sort: 9, tr: {
				ru: { label: "Email", placeholder: "Email" }, kz: { label: "Email", placeholder: "Email" }, en: { label: "Email", placeholder: "Email" } } },
			{ name: "subject", type: "textarea", required: false, width: "full", sort: 10, tr: {
				ru: { label: "Комментарий", placeholder: "Кратко о задаче или вакансии" },
				kz: { label: "Түсініктеме", placeholder: "Міндет немесе вакансия туралы қысқаша" },
				en: { label: "Comment", placeholder: "Briefly about the role or task" } } },
		],
	},

	// Recruit Flow (HR subscription): qualifies volume and profile of hiring.
	subscription: {
		target_collection: "leads",
		tr: {
			ru: { title: "Заявка на HR-подписку Recruit Flow", submit_label: "Узнать условия", success_message: "Спасибо! Мы подберём тариф под ваши задачи и свяжемся с вами." },
			kz: { title: "Recruit Flow HR-жазылымына өтінім", submit_label: "Шарттарын білу", success_message: "Рахмет! Міндеттеріңізге сай тарифті таңдап, сізбен байланысамыз." },
			en: { title: "Recruit Flow subscription request", submit_label: "Get the details", success_message: "Thank you! We will tailor a plan to your needs and get in touch." },
		},
		fields: [
			{
				name: "vacancies_monthly", type: "select", required: true, width: "full", sort: 1,
				choices: [
					{ ru: "1–2 вакансии", kz: "1–2 вакансия", en: "1-2 vacancies" },
					{ ru: "3–5 вакансий", kz: "3–5 вакансия", en: "3-5 vacancies" },
					{ ru: "6–10 вакансий", kz: "6–10 вакансия", en: "6-10 vacancies" },
					{ ru: "Более 10", kz: "10-нан көп", en: "10+" },
				],
				tr: {
					ru: { label: "Сколько вакансий в месяц вы обычно закрываете?", placeholder: "Выберите" },
					kz: { label: "Айына әдетте қанша вакансия жабасыз?", placeholder: "Таңдаңыз" },
					en: { label: "How many vacancies do you usually fill per month?", placeholder: "Select" },
				},
			},
			{
				name: "selections", type: "checkbox_group", required: false, width: "full", sort: 2,
				choices: [
					{ ru: "Продажи B2B", kz: "B2B сату", en: "B2B Sales" },
					{ ru: "Финансы", kz: "Қаржы", en: "Finance" },
					{ ru: "IT", kz: "IT", en: "IT" },
					{ ru: "Логистика", kz: "Логистика", en: "Logistics" },
					{ ru: "Производство", kz: "Өндіріс", en: "Manufacturing" },
					{ ru: "Маркетинг", kz: "Маркетинг", en: "Marketing" },
					{ ru: "FMCG", kz: "FMCG", en: "FMCG" },
					{ ru: "Энергетика", kz: "Энергетика", en: "Energy" },
				],
				tr: {
					ru: { label: "Какие специалисты нужны чаще всего?" },
					kz: { label: "Көбіне қандай мамандар қажет?" },
					en: { label: "Which specialists do you need most often?" },
				},
			},
			{ name: "_divider1", type: "divider", required: false, width: "full", sort: 3, tr: { ru: {}, kz: {}, en: {} } },
			{ name: "company", type: "text", required: true, width: "full", sort: 4, tr: {
				ru: { label: "Компания", placeholder: "Название компании" }, kz: { label: "Компания", placeholder: "Компания атауы" }, en: { label: "Company", placeholder: "Company name" } } },
			{ name: "name", type: "text", required: true, width: "half", sort: 5, tr: {
				ru: { label: "Ваше имя", placeholder: "Имя" }, kz: { label: "Атыңыз", placeholder: "Аты" }, en: { label: "Your name", placeholder: "Name" } } },
			{ name: "phone", type: "tel", required: true, width: "half", sort: 6, tr: {
				ru: { label: "Телефон", placeholder: "+7" }, kz: { label: "Телефон", placeholder: "+7" }, en: { label: "Phone", placeholder: "+7" } } },
			{ name: "email", type: "email", required: false, width: "full", sort: 7, tr: {
				ru: { label: "Email", placeholder: "Email" }, kz: { label: "Email", placeholder: "Email" }, en: { label: "Email", placeholder: "Email" } } },
			{ name: "subject", type: "textarea", required: false, width: "full", sort: 8, tr: {
				ru: { label: "Комментарий", placeholder: "Кратко о кадровых задачах" },
				kz: { label: "Түсініктеме", placeholder: "Кадрлық міндеттер туралы қысқаша" },
				en: { label: "Comment", placeholder: "Briefly about your hiring needs" } } },
		],
	},

	// Job seeker: CV upload with desired position and cover letter.
	cv: {
		target_collection: "applicants",
		tr: {
			ru: { title: "Отправить резюме", submit_label: "Отправить резюме", success_message: "Резюме получено! Если появится подходящая вакансия, мы свяжемся с вами." },
			kz: { title: "Түйіндеме жіберу", submit_label: "Түйіндеме жіберу", success_message: "Түйіндеме қабылданды! Қолайлы вакансия пайда болса, сізбен байланысамыз." },
			en: { title: "Send your CV", submit_label: "Send CV", success_message: "CV received! We will contact you when a suitable vacancy comes up." },
		},
		fields: [
			{ name: "name", type: "text", required: true, width: "half", sort: 1, tr: {
				ru: { label: "Ваше имя", placeholder: "Имя" }, kz: { label: "Атыңыз", placeholder: "Аты" }, en: { label: "Your name", placeholder: "Name" } } },
			{ name: "phone", type: "tel", required: true, width: "half", sort: 2, tr: {
				ru: { label: "Телефон", placeholder: "+7" }, kz: { label: "Телефон", placeholder: "+7" }, en: { label: "Phone", placeholder: "+7" } } },
			{ name: "email", type: "email", required: false, width: "half", sort: 3, tr: {
				ru: { label: "Email", placeholder: "Email" }, kz: { label: "Email", placeholder: "Email" }, en: { label: "Email", placeholder: "Email" } } },
			{ name: "position", type: "text", required: false, width: "half", sort: 4, tr: {
				ru: { label: "Желаемая должность", placeholder: "Например: финансовый аналитик" },
				kz: { label: "Қалаған лауазым", placeholder: "Мысалы: қаржы талдаушысы" },
				en: { label: "Desired position", placeholder: "e.g. Financial analyst" } } },
			{ name: "file", type: "file", required: true, width: "full", sort: 5, tr: {
				ru: { label: "Резюме", help_text: "PDF, DOC, DOCX" }, kz: { label: "Түйіндеме", help_text: "PDF, DOC, DOCX" }, en: { label: "CV", help_text: "PDF, DOC, DOCX" } } },
			{ name: "cover_letter", type: "textarea", required: false, width: "full", sort: 6, tr: {
				ru: { label: "Сопроводительное письмо", placeholder: "Пара слов о себе и вашем опыте" },
				kz: { label: "Ілеспе хат", placeholder: "Өзіңіз және тәжірибеңіз туралы бірер сөз" },
				en: { label: "Cover letter", placeholder: "A few words about you and your experience" } } },
		],
	},

	// Quick callback: minimal friction, two fields and a time slot.
	callback: {
		target_collection: "leads",
		tr: {
			ru: { title: "Заказать обратный звонок", submit_label: "Жду звонка", success_message: "Спасибо! Мы перезвоним вам в выбранное время." },
			kz: { title: "Кері қоңырауға тапсырыс", submit_label: "Қоңырауды күтемін", success_message: "Рахмет! Таңдалған уақытта сізге қайта қоңырау шаламыз." },
			en: { title: "Request a callback", submit_label: "Call me back", success_message: "Thank you! We will call you back at the chosen time." },
		},
		fields: [
			{ name: "name", type: "text", required: true, width: "half", sort: 1, tr: {
				ru: { label: "Ваше имя", placeholder: "Имя" }, kz: { label: "Атыңыз", placeholder: "Аты" }, en: { label: "Your name", placeholder: "Name" } } },
			{ name: "phone", type: "tel", required: true, width: "half", sort: 2, tr: {
				ru: { label: "Телефон", placeholder: "+7" }, kz: { label: "Телефон", placeholder: "+7" }, en: { label: "Phone", placeholder: "+7" } } },
			{
				name: "call_time", type: "select", required: false, width: "full", sort: 3,
				choices: [
					{ ru: "Утром (9:00–12:00)", kz: "Таңертең (9:00–12:00)", en: "Morning (9:00-12:00)" },
					{ ru: "Днём (12:00–17:00)", kz: "Күндіз (12:00–17:00)", en: "Afternoon (12:00-17:00)" },
					{ ru: "Вечером (17:00–20:00)", kz: "Кешке (17:00–20:00)", en: "Evening (17:00-20:00)" },
				],
				tr: {
					ru: { label: "Удобное время для звонка", placeholder: "В любое время" },
					kz: { label: "Қоңырау шалуға ыңғайлы уақыт", placeholder: "Кез келген уақытта" },
					en: { label: "Convenient time to call", placeholder: "Any time" },
				},
			},
		],
	},
};
