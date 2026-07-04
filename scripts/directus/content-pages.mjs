/**
 * Page content — one entry per page, block-by-block, translated ru/kz/en.
 * RU is verbatim from the current site; kz/en are translations (editable in CMS).
 *
 * Block shape: { type, <base fields>, tr: {ru,kz,en}, items?/cards?/principles? }
 * `form` / `link_page` reference other seeded entities by key/permalink.
 * `icon` is a static key resolved by the frontend (no hardcoded text).
 */
const t = (ru, kz, en) => ({ ru, kz, en });

// ── HOME ────────────────────────────────────────────────────────────────────

const home = {
	permalink: t("/", "/", "/"),
	adminTitle: t("Главная", "Басты бет", "Home"),
	seo: {
		ru: { title: "REC-A | HR-агентство полного цикла", meta_description: "Профессиональный рекрутинг: поиск и подбор специалистов middle & top уровней." },
		kz: { title: "REC-A | Толық циклді HR-агенттік", meta_description: "Кәсіби рекрутинг: middle & top деңгейдегі мамандарды іздеу және таңдау." },
		en: { title: "REC-A | Full-cycle HR agency", meta_description: "Professional recruiting: search and selection of middle & top level specialists." },
	},
	blocks: [
		{
			type: "block_hero", form: "hire",
			tr: {
				ru: { title: "HR-агентство", suptitle: "Профессиональный рекрутинг полного цикла", descr: "Поиск и подбор специалистов middle & top уровней", button_label: "Узнать стоимость услуг" },
				kz: { title: "HR-агенттік", suptitle: "Толық циклді кәсіби рекрутинг", descr: "Middle & top деңгейдегі мамандарды іздеу және таңдау", button_label: "Қызмет құнын білу" },
				en: { title: "HR agency", suptitle: "Full-cycle professional recruiting", descr: "Search and selection of middle & top level specialists", button_label: "Find out the cost" },
			},
		},
		{
			type: "block_founder_profile", photo: "reca-founder.jpeg",
			tr: {
				ru: {
					eyebrow_title: "Основатель и Ведущий Эксперт REC-A", name: "Ольга В.",
					intro_content: "<p>С 2021 года Ольга прошла путь от ресечера до руководителя направления, построив систему, обеспечивающую услуги Executive Search (Middle &amp; Top) на самом высоком уровне.</p><p>В рекрутинге успех не бывает случайным, он является прямым следствием системной методологии. В REC-A эта методология была разработана и внедрена Основателем и Ведущим Экспертом.</p><p>Каждый проект проходит через строгие регламенты и стандарты. Контроль методологии и качества оценки обеспечивает лично Ведущий Эксперт. Мы гарантируем объективное интервью по компетенциям и минимизируем риски хаотичного подбора.</p>",
					principles_heading: "Принципы, на которых построена система REC-A",
				},
				kz: {
					eyebrow_title: "REC-A негізін қалаушы және Жетекші сарапшы", name: "Ольга В.",
					intro_content: "<p>2021 жылдан бері Ольга ресечерден бағыт жетекшісіне дейін өсіп, Executive Search (Middle &amp; Top) қызметтерін ең жоғары деңгейде көрсететін жүйе құрды.</p><p>Рекрутингте табыс кездейсоқ келмейді, ол жүйелі әдіснаманың тікелей нәтижесі. REC-A-да бұл әдіснаманы негізін қалаушы әрі Жетекші сарапшы өзі әзірлеп енгізген.</p><p>Әрбір жоба қатаң регламенттер мен стандарттар бойынша жүреді. Әдіснама мен бағалау сапасын Жетекші сарапшы жеке қадағалайды. Біз құзыреттерге негізделген объективті сұхбатқа кепілдік береміз және ретсіз іріктеу тәуекелдерін азайтамыз.</p>",
					principles_heading: "REC-A жүйесі негізделген қағидаттар",
				},
				en: {
					eyebrow_title: "Founder and Lead Expert of REC-A", name: "Olga V.",
					intro_content: "<p>Since 2021, Olga has grown from a researcher into a practice lead and built a system that delivers Executive Search (Middle &amp; Top) at the highest level.</p><p>In recruiting, success is never accidental; it comes directly from a systematic methodology. At REC-A, that methodology was designed and put in place by the Founder and Lead Expert.</p><p>Every project follows strict rules and standards. The Lead Expert personally oversees the methodology and the quality of assessment. We guarantee objective, competency-based interviews and reduce the risks of chaotic hiring.</p>",
					principles_heading: "The principles the REC-A system is built on",
				},
			},
			principles: [
				{ tr: {
					ru: { title: "Стандартизация", points: "<ul><li>Регламенты, шаблоны и единый стиль коммуникации.</li><li>Минимум субъективности, максимум контроля качества.</li></ul>" },
					kz: { title: "Стандарттау", points: "<ul><li>Регламенттер, үлгілер және бірыңғай коммуникация стилі.</li><li>Ең аз субъективтілік, ең жоғары сапа бақылауы.</li></ul>" },
					en: { title: "Standardisation", points: "<ul><li>Regulations, templates and a unified communication style.</li><li>Minimum subjectivity, maximum quality control.</li></ul>" } } },
				{ tr: {
					ru: { title: "Точность оценки", points: "<ul><li>Современные методики, адаптированные под бизнес-цели клиента.</li><li>Конверсия выхода кандидатов: 92%</li></ul>" },
					kz: { title: "Бағалау дәлдігі", points: "<ul><li>Клиенттің бизнес-мақсаттарына бейімделген заманауи әдістемелер.</li><li>Кандидаттардың шығу конверсиясы: 92%</li></ul>" },
					en: { title: "Assessment accuracy", points: "<ul><li>Modern methods adapted to the client's business goals.</li><li>Candidate onboarding conversion: 92%</li></ul>" } } },
				{ tr: {
					ru: { title: "Скорость процесса", points: "<ul><li>Цикл подбора оптимизирован под достижение оптимальных сроков.</li><li>Средний срок закрытия вакансий: 7-18 рабочих дней.</li></ul>" },
					kz: { title: "Процесс жылдамдығы", points: "<ul><li>Таңдау циклі оңтайлы мерзімге бейімделген.</li><li>Вакансияларды жабудың орташа мерзімі: 7-18 жұмыс күні.</li></ul>" },
					en: { title: "Process speed", points: "<ul><li>The hiring cycle is optimised for the best possible timelines.</li><li>Average time to fill a vacancy: 7-18 business days.</li></ul>" } } },
				{ tr: {
					ru: { title: "Лояльность клиентов", points: "<ul><li>Стандартизированная работа и экспертный надзор дают стабильный результат.</li><li>80% клиентов возвращаются с новыми проектами.</li></ul>" },
					kz: { title: "Клиенттердің адалдығы", points: "<ul><li>Стандартталған жұмыс пен сараптамалық қадағалау тұрақты нәтиже береді.</li><li>Клиенттердің 80%-ы жаңа жобалармен қайта оралады.</li></ul>" },
					en: { title: "Client loyalty", points: "<ul><li>Standardised work and expert oversight deliver consistent results.</li><li>80% of clients return with new projects.</li></ul>" } } },
				{ tr: {
					ru: { title: "Экспертиза", points: "<ul><li>Экспертиза в ключевых отраслях: Продажи B2B, Финансы, IT, Логистика, Производство, Маркетинг, FMCG, Энергетика.</li></ul>" },
					kz: { title: "Сараптама", points: "<ul><li>Негізгі салалардағы сараптама: B2B сату, Қаржы, IT, Логистика, Өндіріс, Маркетинг, FMCG, Энергетика.</li></ul>" },
					en: { title: "Expertise", points: "<ul><li>Expertise in key industries: B2B Sales, Finance, IT, Logistics, Manufacturing, Marketing, FMCG, Energy.</li></ul>" } } },
				{ tr: {
					ru: { title: "Масштаб", points: "<ul><li>Более 10 000 проведенных интервью.</li><li>Успешно закрыто свыше 100 ключевых позиций.</li></ul>" },
					kz: { title: "Ауқым", points: "<ul><li>10 000-нан астам өткізілген сұхбат.</li><li>100-ден астам негізгі лауазым сәтті жабылды.</li></ul>" },
					en: { title: "Scale", points: "<ul><li>Over 10,000 interviews conducted.</li><li>More than 100 key positions successfully filled.</li></ul>" } } },
			],
		},
		{
			type: "block_cards",
			tr: { ru: { heading: "Наши услуги" }, kz: { heading: "Біздің қызметтер" }, en: { heading: "Our services" } },
			cards: [
				{
					icon: "human-resources", link_page: "/employers", sort: 1,
					tr: {
						ru: { title: "Классический рекрутинг", text: "Classic Recruit", text_under: "Однократный подбор персонала", button_label: "Подробнее" },
						kz: { title: "Классикалық рекрутинг", text: "Classic Recruit", text_under: "Бір реттік персонал таңдау", button_label: "Толығырақ" },
						en: { title: "Classic recruiting", text: "Classic Recruit", text_under: "One-time staff selection", button_label: "Read more" },
					},
				},
				{
					icon: "financial-networks", link_page: "/job", sort: 2,
					tr: {
						ru: { title: "HR-подписка", text: "Recruit Flow", text_under: "Абонентский подбор персонала", button_label: "Подробнее" },
						kz: { title: "HR-жазылым", text: "Recruit Flow", text_under: "Абоненттік персонал таңдау", button_label: "Толығырақ" },
						en: { title: "HR subscription", text: "Recruit Flow", text_under: "Subscription-based staffing", button_label: "Read more" },
					},
				},
			],
		},
		{
			type: "block_feature_list",
			tr: { ru: { heading: "Выбирают нас по следующим причинам" }, kz: { heading: "Бізді мына себептермен таңдайды" }, en: { heading: "Why clients choose us" } },
			items: [
				{ icon: "individual", sort: 1, tr: {
					ru: { title: "Индивидуальный подход", text: "Каждый клиент обладает индивидуальными потребностями и требованиями. Нашей командой разрабатываются уникальные стратегии, которые помогают находить решения, учитывающие все тонкости и соответствующие ценностям наших клиентов." },
					kz: { title: "Жеке көзқарас", text: "Әрбір клиенттің жеке қажеттіліктері мен талаптары бар. Біздің команда барлық нюанстарды ескеретін және клиенттеріміздің құндылықтарына сай шешімдер табуға көмектесетін бірегей стратегиялар әзірлейді." },
					en: { title: "Individual approach", text: "Every client has unique needs and requirements. Our team designs tailored strategies that account for every detail and match our clients' values." } } },
				{ icon: "quality", sort: 2, tr: {
					ru: { title: "Качество", text: "Мы придерживаемся высоких стандартов качества и сервиса на каждом этапе нашей работы, обеспечивая первоклассный подход от определения требований до достижения конечного результата." },
					kz: { title: "Сапа", text: "Жұмысымыздың әр кезеңінде жоғары сапа мен сервис стандарттарын ұстанамыз, талаптарды анықтаудан бастап түпкі нәтижеге жеткенге дейін бірінші дәрежелі көзқарасты қамтамасыз етеміз." },
					en: { title: "Quality", text: "We keep high standards of quality and service at every stage of our work, ensuring a first-class approach from defining the requirements to delivering the final result." } } },
				{ icon: "confidential", sort: 3, tr: {
					ru: { title: "Конфиденциальность", text: "При заключении сотрудничества с нами, каждый наш клиент может быть уверен в соблюдении высоких стандартов конфиденциальности при обращении с любой информацией." },
					kz: { title: "Құпиялылық", text: "Бізбен ынтымақтастық орнатқанда әрбір клиент кез келген ақпаратпен жұмыс істеуде жоғары құпиялылық стандарттарының сақталатынына сенімді бола алады." },
					en: { title: "Confidentiality", text: "When working with us, every client can be confident that high confidentiality standards are maintained with any information." } } },
			],
		},
		{
			type: "block_reviews", limit: 12,
			tr: { ru: { heading: "Отзывы и рекомендации" }, kz: { heading: "Пікірлер мен ұсыныстар" }, en: { heading: "Reviews & recommendations" } },
		},
		{
			type: "block_cta", form: "hire",
			tr: {
				ru: { heading: "Готовы усилить свою команду?", subheading: "Оставьте заявку — мы обсудим вашу задачу и предложим оптимальное решение.", button_label: "Оставить заявку" },
				kz: { heading: "Командаңызды күшейтуге дайынсыз ба?", subheading: "Өтінім қалдырыңыз — міндетіңізді талқылап, оңтайлы шешім ұсынамыз.", button_label: "Өтінім қалдыру" },
				en: { heading: "Ready to strengthen your team?", subheading: "Leave a request and we will discuss your needs and offer the best solution.", button_label: "Leave a request" },
			},
		},
	],
};

// ── EMPLOYERS (Classic Recruit) ─────────────────────────────────────────────

const employers = {
	permalink: t("/employers", "/employers", "/employers"),
	adminTitle: t("Классический рекрутинг", "Классикалық рекрутинг", "Classic recruiting"),
	seo: {
		ru: { title: "Классический рекрутинг | REC-A", meta_description: "Полный цикл подбора персонала на должности среднего и высшего звена." },
		kz: { title: "Классикалық рекрутинг | REC-A", meta_description: "Орта және жоғары буын лауазымдарына толық циклді персонал таңдау." },
		en: { title: "Classic recruiting | REC-A", meta_description: "Full-cycle recruitment for middle and senior positions." },
	},
	blocks: [
		{
			type: "block_hero", form: "hire",
			tr: {
				ru: { title: "Подбор персонала по системе Classic Recruit", suptitle: "Выбери себе только лучших из лучших", button_label: "Узнать стоимость услуг" },
				kz: { title: "Classic Recruit жүйесі бойынша персонал таңдау", suptitle: "Ең үздіктердің ішінен ең үздігін таңда", button_label: "Қызмет құнын білу" },
				en: { title: "Recruitment via the Classic Recruit system", suptitle: "Choose only the best of the best", button_label: "Find out the cost" },
			},
		},
		{
			type: "block_richtext",
			tr: {
				ru: { heading: "Что такое классический рекрутинг?", content: "<p>Мы обеспечиваем полный цикл подбора персонала, включая анализ рынка, активный поиск, многоуровневую оценку и привлечение кандидатов, обладающих всеми необходимыми компетенциями для достижения текущих и стратегических целей вашего бизнеса.</p><h3>Кому подходит?</h3><ul><li>Если вам нужен опытный специалист на конкретную позицию.</li><li>Если в компании нет постоянного потока вакансий, но есть разовые потребности.</li><li>Если вы хотите оплатить услугу только после выхода сотрудника на работу.</li></ul>" },
				kz: { heading: "Классикалық рекрутинг дегеніміз не?", content: "<p>Біз персоналды таңдаудың толық циклін қамтамасыз етеміз: нарық талдауы, белсенді іздеу, көп деңгейлі бағалау және бизнесіңіздің ағымдағы әрі стратегиялық мақсаттарына жету үшін қажетті құзыреттерге ие кандидаттарды тарту.</p><h3>Кімге қолайлы?</h3><ul><li>Нақты лауазымға тәжірибелі маман қажет болса.</li><li>Компанияда вакансиялардың тұрақты ағыны жоқ, бірақ бір реттік қажеттіліктер болса.</li><li>Қызметақыны қызметкер жұмысқа шыққаннан кейін ғана төлегіңіз келсе.</li></ul>" },
				en: { heading: "What is classic recruiting?", content: "<p>We deliver a full recruitment cycle: market analysis, active search, multi-level assessment and attracting candidates who have all the competencies needed to achieve your business's current and strategic goals.</p><h3>Who is it for?</h3><ul><li>You need an experienced specialist for a specific position.</li><li>Your company has no constant flow of vacancies but has one-off needs.</li><li>You want to pay for the service only after the employee starts work.</li></ul>" },
			},
		},
		{
			type: "block_stages",
			tr: { ru: { heading: "Этапы сотрудничества" }, kz: { heading: "Ынтымақтастық кезеңдері" }, en: { heading: "Stages of cooperation" } },
			items: [
				{ icon: "loop", sort: 1, tr: {
					ru: { title: "Оставьте заявку на сайте", text: "Наши специалисты свяжутся с вами для дальнейших шагов." },
					kz: { title: "Сайтта өтінім қалдырыңыз", text: "Мамандарымыз келесі қадамдар үшін сізбен байланысады." },
					en: { title: "Leave a request on the site", text: "Our specialists will contact you for the next steps." } } },
				{ icon: "agreement", sort: 2, tr: {
					ru: { title: "Брифинг", text: "Выявляем необходимые требования для кандидатов" },
					kz: { title: "Брифинг", text: "Кандидаттарға қажетті талаптарды анықтаймыз" },
					en: { title: "Briefing", text: "We define the necessary requirements for candidates" } } },
				{ icon: "interview", sort: 3, tr: {
					ru: { title: "Подписание договора", text: "Мы за прозрачность сотрудничества" },
					kz: { title: "Шартқа қол қою", text: "Біз ынтымақтастықтың ашықтығын жақтаймыз" },
					en: { title: "Signing the contract", text: "We stand for transparent cooperation" } } },
				{ icon: "checking", sort: 4, tr: {
					ru: { title: "Поиск и отбор кандидатов", text: "Профессиональная оценка соискателей, интервью" },
					kz: { title: "Кандидаттарды іздеу және таңдау", text: "Үміткерлерді кәсіби бағалау, сұхбат" },
					en: { title: "Candidate search and selection", text: "Professional assessment of applicants, interviews" } } },
				{ icon: "invating", sort: 5, tr: {
					ru: { title: "Гарантийное сопровождение", text: "Сопровождение на протяжении 6-ти месяцев с момента выхода кандидата" },
					kz: { title: "Кепілдік бойынша сүйемелдеу", text: "Кандидат жұмысқа шыққаннан бастап 6 ай бойы сүйемелдеу" },
					en: { title: "Warranty support", text: "Support for 6 months from the candidate's start date" } } },
			],
		},
		{
			type: "block_cta", form: "hire",
			tr: {
				ru: { heading: "Нужен сильный специалист на ключевую позицию?", subheading: "Оставьте заявку — обсудим вакансию и представим кандидатов в течение 7–18 рабочих дней.", button_label: "Заказать подбор" },
				kz: { heading: "Негізгі лауазымға мықты маман керек пе?", subheading: "Өтінім қалдырыңыз — вакансияны талқылап, 7–18 жұмыс күні ішінде кандидаттарды ұсынамыз.", button_label: "Іріктеуге тапсырыс беру" },
				en: { heading: "Need a strong specialist for a key position?", subheading: "Leave a request and we will discuss the vacancy and present candidates within 7-18 business days.", button_label: "Start the search" },
			},
		},
	],
};

// ── JOB (Recruit Flow / HR subscription) ────────────────────────────────────

const job = {
	permalink: t("/job", "/job", "/job"),
	adminTitle: t("HR-подписка", "HR-жазылым", "HR subscription"),
	seo: {
		ru: { title: "HR-подписка Recruit Flow | REC-A", meta_description: "Абонентский подбор персонала без переплат за каждого принятого кандидата." },
		kz: { title: "Recruit Flow HR-жазылымы | REC-A", meta_description: "Әр қабылданған кандидат үшін артық төлемсіз абоненттік персонал таңдау." },
		en: { title: "Recruit Flow HR subscription | REC-A", meta_description: "Subscription-based staffing without paying extra for each hire." },
	},
	blocks: [
		{
			type: "block_hero", form: "subscription",
			tr: {
				ru: { title: "Подбор персонала по системе Recruit Flow", suptitle: "Выбери работу, достойную тебя", button_label: "Узнать стоимость услуг" },
				kz: { title: "Recruit Flow жүйесі бойынша персонал таңдау", suptitle: "Өзіңе лайық жұмысты таңда", button_label: "Қызмет құнын білу" },
				en: { title: "Recruitment via the Recruit Flow system", suptitle: "Choose work worthy of you", button_label: "Find out the cost" },
			},
		},
		{
			type: "block_richtext",
			tr: {
				ru: { heading: "HR-подписка — подбор без переплат за каждого принятого кандидата", content: "<p>Мы предлагаем абонентский подбор персонала — удобное решение для компаний, которым требуется стабильный поток кандидатов без необходимости платить за каждого принятого сотрудника отдельно.</p><h3>Кому подходит?</h3><ul><li>Если в вашей компании постоянно открываются вакансии.</li><li>Если важно получать квалифицированных кандидатов без задержек.</li><li>Если вам необходимо избежать дополнительных расходов за каждого кандидата.</li></ul><h3>Почему Recruit Flow?</h3><ul><li><strong>Фиксированная ежемесячная оплата:</strong> Никаких неожиданных доплат.</li><li><strong>Системный поток кандидатов:</strong> Работаем как внешний HR-отдел, адаптируя подбор под кадровую стратегию бизнеса.</li><li><strong>Прозрачные условия:</strong> Количество вакансий в месяц определяется тарифным планом.</li><li><strong>Гибкость:</strong> Возможность корректировать требования по вакансиям.</li></ul>" },
				kz: { heading: "HR-жазылым: әр қабылданған кандидат үшін артық төлемсіз іріктеу", content: "<p>Біз абоненттік персонал іріктеуді ұсынамыз. Бұл әр қабылданған қызметкер үшін бөлек төлеместен, тұрақты кандидаттар ағынын қажет ететін компанияларға ыңғайлы шешім.</p><h3>Кімге қолайлы?</h3><ul><li>Компанияңызда вакансиялар үнемі ашылып тұрса.</li><li>Білікті кандидаттарды кідіріссіз алу маңызды болса.</li><li>Әр кандидат үшін қосымша шығындардан аулақ болу қажет болса.</li></ul><h3>Неге Recruit Flow?</h3><ul><li><strong>Тұрақты айлық төлем:</strong> Күтпеген қосымша төлемдер жоқ.</li><li><strong>Жүйелі кандидаттар ағыны:</strong> Сыртқы HR-бөлім ретінде жұмыс істеп, таңдауды бизнестің кадрлық стратегиясына бейімдейміз.</li><li><strong>Ашық шарттар:</strong> Айына вакансиялар саны тарифтік жоспармен анықталады.</li><li><strong>Икемділік:</strong> Вакансиялар бойынша талаптарды түзету мүмкіндігі.</li></ul>" },
				en: { heading: "HR subscription: hiring without overpaying for every candidate", content: "<p>We offer subscription-based staffing. It is a convenient solution for companies that need a steady flow of candidates without paying separately for each hire.</p><h3>Who is it for?</h3><ul><li>Your company opens vacancies constantly.</li><li>It's important to receive qualified candidates without delays.</li><li>You need to avoid extra costs for each candidate.</li></ul><h3>Why Recruit Flow?</h3><ul><li><strong>Fixed monthly fee:</strong> No unexpected surcharges.</li><li><strong>Systematic candidate flow:</strong> We work as an external HR department, adapting hiring to your business's staffing strategy.</li><li><strong>Transparent terms:</strong> The number of vacancies per month is defined by the plan.</li><li><strong>Flexibility:</strong> The ability to adjust vacancy requirements.</li></ul>" },
			},
		},
		{
			type: "block_stages",
			tr: { ru: { heading: "Этапы сотрудничества" }, kz: { heading: "Ынтымақтастық кезеңдері" }, en: { heading: "Stages of cooperation" } },
			items: [
				{ icon: "loop", sort: 1, tr: {
					ru: { title: "Оставьте заявку на сайте", text: "Наши специалисты свяжутся с вами для дальнейших шагов." },
					kz: { title: "Сайтта өтінім қалдырыңыз", text: "Мамандарымыз келесі қадамдар үшін сізбен байланысады." },
					en: { title: "Leave a request on the site", text: "Our specialists will contact you for the next steps." } } },
				{ icon: "agreement", sort: 2, tr: {
					ru: { title: "Брифинг", text: "Выявляем необходимые требования для кандидатов" },
					kz: { title: "Брифинг", text: "Кандидаттарға қажетті талаптарды анықтаймыз" },
					en: { title: "Briefing", text: "We define the necessary requirements for candidates" } } },
				{ icon: "interview", sort: 3, tr: {
					ru: { title: "Подписание договора", text: "Мы за прозрачность сотрудничества" },
					kz: { title: "Шартқа қол қою", text: "Біз ынтымақтастықтың ашықтығын жақтаймыз" },
					en: { title: "Signing the contract", text: "We stand for transparent cooperation" } } },
				{ icon: "checking", sort: 4, tr: {
					ru: { title: "Поиск и отбор кандидатов", text: "Профессиональная оценка соискателей, интервью" },
					kz: { title: "Кандидаттарды іздеу және таңдау", text: "Үміткерлерді кәсіби бағалау, сұхбат" },
					en: { title: "Candidate search and selection", text: "Professional assessment of applicants, interviews" } } },
			],
		},
		{
			type: "block_cta", form: "subscription",
			tr: {
				ru: { heading: "Нужен стабильный поток кандидатов?", subheading: "Оставьте заявку — подберём тариф Recruit Flow под кадровые задачи вашего бизнеса.", button_label: "Узнать условия" },
				kz: { heading: "Кандидаттардың тұрақты ағыны қажет пе?", subheading: "Өтінім қалдырыңыз — бизнесіңіздің кадрлық міндеттеріне сай Recruit Flow тарифін таңдаймыз.", button_label: "Шарттарын білу" },
				en: { heading: "Need a steady flow of candidates?", subheading: "Leave a request and we will tailor a Recruit Flow plan to your hiring needs.", button_label: "Get the details" },
			},
		},
	],
};

// ── CONTACT ─────────────────────────────────────────────────────────────────

const contact = {
	permalink: t("/contact", "/contact", "/contact"),
	adminTitle: t("Контакты", "Байланыс", "Contacts"),
	seo: {
		ru: { title: "Контакты | REC-A", meta_description: "Свяжитесь с REC-A: телефон, email, форма заявки. Работаем с компаниями по всему Казахстану." },
		kz: { title: "Байланыс | REC-A", meta_description: "REC-A-мен байланысыңыз: телефон, email, өтінім формасы. Бүкіл Қазақстан бойынша компаниялармен жұмыс істейміз." },
		en: { title: "Contacts | REC-A", meta_description: "Get in touch with REC-A: phone, email, request form. We work with companies across Kazakhstan." },
	},
	blocks: [
		{
			type: "block_contact", form: "contact", show_map: true,
			tr: { ru: { heading: "Свяжитесь с нами" }, kz: { heading: "Бізбен байланысыңыз" }, en: { heading: "Get in touch" } },
		},
		{
			type: "block_cta", form: "cv",
			tr: {
				ru: { heading: "Ищете работу?", subheading: "Отправьте резюме — мы добавим вас в базу кандидатов REC-A и свяжемся, когда появится подходящая вакансия.", button_label: "Отправить резюме" },
				kz: { heading: "Жұмыс іздеп жүрсіз бе?", subheading: "Түйіндеме жіберіңіз — сізді REC-A кандидаттар базасына қосамыз және қолайлы вакансия пайда болғанда байланысамыз.", button_label: "Түйіндеме жіберу" },
				en: { heading: "Looking for a job?", subheading: "Send your CV and we will add you to the REC-A candidate base and reach out when a suitable vacancy appears.", button_label: "Send CV" },
			},
		},
	],
};

// ── UPLOAD CV ───────────────────────────────────────────────────────────────

const uploadCv = {
	permalink: t("/upload-cv", "/upload-cv", "/upload-cv"),
	adminTitle: t("Отправить резюме", "Түйіндеме жіберу", "Send CV"),
	seo: {
		ru: { title: "Отправить резюме | REC-A", meta_description: "Загрузите резюме — мы добавим вас в базу кандидатов REC-A и свяжемся, когда появится подходящая вакансия." },
		kz: { title: "Түйіндеме жіберу | REC-A", meta_description: "Түйіндемеңізді жүктеңіз — сізді REC-A кандидаттар базасына қосамыз және қолайлы вакансия пайда болғанда байланысамыз." },
		en: { title: "Send your CV | REC-A", meta_description: "Upload your CV and we will add you to the REC-A candidate base and reach out when a suitable vacancy appears." },
	},
	blocks: [
		{
			type: "block_form", form: "cv",
			tr: {
				ru: { heading: "Отправьте резюме", subheading: "Заполните форму и прикрепите резюме — мы добавим вас в базу кандидатов REC-A и свяжемся, когда появится подходящая вакансия." },
				kz: { heading: "Түйіндеме жіберіңіз", subheading: "Форманы толтырып, түйіндемеңізді тіркеңіз — сізді REC-A кандидаттар базасына қосамыз және қолайлы вакансия пайда болғанда байланысамыз." },
				en: { heading: "Send your CV", subheading: "Fill in the form and attach your CV — we will add you to the REC-A candidate base and reach out when a suitable vacancy appears." },
			},
		},
	],
};

export const pages = [home, employers, job, contact, uploadCv];
