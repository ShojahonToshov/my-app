const fs = require('fs');
const path = require('path');

const landingPath = path.join(__dirname, 'src', 'components', 'Landing.tsx');
let landingCode = fs.readFileSync(landingPath, 'utf8');

const enJsonPath = path.join(__dirname, 'public', 'localization', 'en', 'en.json');
const ruJsonPath = path.join(__dirname, 'public', 'localization', 'ru', 'ru.json');
const uzJsonPath = path.join(__dirname, 'public', 'localization', 'uz', 'uz.json');

let enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
let ruJson = JSON.parse(fs.readFileSync(ruJsonPath, 'utf8'));
let uzJson = JSON.parse(fs.readFileSync(uzJsonPath, 'utf8'));

enJson.landing = {};
ruJson.landing = {};
uzJson.landing = {};

const translations = [
  {
    key: "startJourney",
    en: "Start your journey",
    ru: "Начать путешествие",
    uz: "Sayohatni boshlash",
    original: "Start your journey"
  },
  {
    key: "exploreFeatures",
    en: "Explore features",
    ru: "Изучить возможности",
    uz: "Imkoniyatlarni o'rganish",
    original: "Explore features"
  },
  {
    key: "experienceLove",
    en: "An experience clients love.",
    ru: "Опыт, который любят клиенents.",
    uz: "Mijozlar sevgan tajriba.",
    original: "An experience clients love."
  },
  {
    key: "digitalTicket",
    en: "Delight your customers with a Digital Live Ticket. They get real-time booking updates, seamless QR check-ins, and one-tap rescheduling—all beautifully organized in a single, interactive pass. When booking is this easy, they keep coming back.",
    ru: "Порадуйте своих клиентов цифровым Live Ticket. Они получают обновления бронирования в реальном времени, удобную регистрацию по QR-коду и перенос записи в один клик. Когда бронировать так просто, они возвращаются.",
    uz: "Mijozlaringizni raqamli Live Ticket bilan xursand qiling. Ular real vaqtda bron yangilanishlarini, uzluksiz QR tekshiruvlarini va bir teginish orqali qayta rejalashtirishni olishadi. Bron qilish shunchalik oson bo'lganda, ular qaytib kelishadi.",
    original: "Delight your customers with a Digital Live Ticket. They get real-time booking updates, seamless QR check-ins, and one-tap rescheduling—all beautifully organized in a single, interactive pass. When booking is this easy, they keep coming back."
  },
  {
    key: "realTimeStatus",
    en: "Real-time status tracking",
    ru: "Отслеживание статуса в реальном времени",
    uz: "Haqiqiy vaqtda holatni kuzatish",
    original: "Real-time status tracking"
  },
  {
    key: "instantNav",
    en: "Instant venue navigation",
    ru: "Мгновенная навигация к месту",
    uz: "Joyga tezkor navigatsiya",
    original: "Instant venue navigation"
  },
  {
    key: "businessThrives",
    en: "When clients are happy, your business thrives.",
    ru: "Когда клиенты счастливы, ваш бизнес процветает.",
    uz: "Mijozlar xursand bo'lganda, biznesingiz rivojlanadi.",
    original: "When clients are happy, your business thrives."
  },
  {
    key: "totalControl",
    en: "Take total operational control. Manage your team's schedules, analyze revenue insights, and track Karma metrics in a calm, distraction-free environment. Elara saves your administrators hours of work every week.",
    ru: "Возьмите полный операционный контроль. Управляйте расписанием команды, анализируйте доходы и отслеживайте метрики Кармы в спокойной обстановке. Elara экономит часы работы ваших администраторов.",
    uz: "To'liq operatsion nazoratni o'z qo'lingizga oling. Jamoangiz jadvalini boshqaring, daromadlarni tahlil qiling va Karma ko'rsatkichlarini kuzatib boring. Elara administratorlaringizning vaqtini tejaydi.",
    original: "Take total operational control. Manage your team's schedules, analyze revenue insights, and track Karma metrics in a calm, distraction-free environment. Elara saves your administrators hours of work every week."
  },
  {
    key: "kanbanFlow",
    en: "Kanban-style appointment flow",
    ru: "Поток записей в стиле Канбан",
    uz: "Kanban uslubidagi yozuvlar oqimi",
    original: "Kanban-style appointment flow"
  },
  {
    key: "smartProtection",
    en: "Smart no-show protection",
    ru: "Умная защита от неявок",
    uz: "Kelmaslikdan aqlli himoya",
    original: "Smart no-show protection"
  },
  {
    key: "stopLosingMoney",
    en: "Stop losing money to no-shows.",
    ru: "Перестаньте терять деньги из-за неявок.",
    uz: "Kelmaslik tufayli pul yo'qotishni to'xtating.",
    original: "Stop losing money to no-shows."
  },
  {
    key: "karmaDesc",
    en: "Missed appointments cost the industry billions. Our proprietary Karma System automatically identifies risky clients and requires non-refundable deposits, protecting your calendar and your revenue.",
    ru: "Пропущенные записи стоят индустрии миллиарды. Наша система Karma автоматически выявляет рискованных клиентов и требует невозвратный депозит, защищая ваш календарь и доход.",
    uz: "O'tkazib yuborilgan yozuvlar industriyaga milliardlab zarar keltiradi. Bizning Karma tizimimiz xavfli mijozlarni avtomatik aniqlaydi va qaytarilmaydigan depozit talab qiladi, kalendaringiz va daromadingizni himoya qiladi.",
    original: "Missed appointments cost the industry billions. Our proprietary Karma System automatically identifies risky clients and requires non-refundable deposits, protecting your calendar and your revenue."
  },
  {
    key: "newStandard",
    en: "A new standard for premium bookings.",
    ru: "Новый стандарт для премиальных бронирований.",
    uz: "Premium bronlar uchun yangi standart.",
    original: "A new standard for premium bookings."
  },
  {
    key: "everythingYouNeed",
    en: "Everything you need to manage your appointments, wrapped in a calm, intelligent interface.",
    ru: "Всё необходимое для управления записями в спокойном и умном интерфейсе.",
    uz: "Yozuvlarni boshqarish uchun barcha kerakli narsalar tinch va aqlli interfeysda.",
    original: "Everything you need to manage your appointments, wrapped in a calm, intelligent interface."
  },
  {
    key: "howElaraWorks",
    en: "How Elara works",
    ru: "Как работает Elara",
    uz: "Elara qanday ishlaydi",
    original: "How Elara works"
  },
  {
    key: "frequentlyAsked",
    en: "Frequently asked questions",
    ru: "Часто задаваемые вопросы",
    uz: "Ko'p so'raladigan savollar",
    original: "Frequently asked questions"
  },
  {
    key: "readyToElevate",
    en: "Ready to elevate your business?",
    ru: "Готовы поднять свой бизнес на новый уровень?",
    uz: "Biznesingizni yangi bosqichga ko'tarishga tayyormisiz?",
    original: "Ready to elevate your business?"
  },
  {
    key: "joinElara",
    en: "Join Elara today and transform the way you manage appointments, clients, and revenue.",
    ru: "Присоединяйтесь к Elara сегодня и измените подход к управлению записями, клиентами и доходом.",
    uz: "Bugun Elara ga qo'shiling va yozuvlar, mijozlar va daromadlarni boshqarish usulini o'zgartiring.",
    original: "Join Elara today and transform the way you manage appointments, clients, and revenue."
  }
];

translations.forEach(tItem => {
  enJson.landing[tItem.key] = tItem.en;
  ruJson.landing[tItem.key] = tItem.ru;
  uzJson.landing[tItem.key] = tItem.uz;
  
  // Replace in code
  // If the text is wrapped in >text< or is a pure string
  const regex = new RegExp(`>\\s*${tItem.original}\\s*<`, 'g');
  if (landingCode.match(regex)) {
    landingCode = landingCode.replace(regex, `>{t("landing.${tItem.key}")}<`);
  } else {
    // try exact replace
    landingCode = landingCode.replace(tItem.original, `{t("landing.${tItem.key}")}`);
  }
});

// Also replace the features and karma sections using more complex replacements if needed

fs.writeFileSync(landingPath, landingCode, 'utf8');
fs.writeFileSync(enJsonPath, JSON.stringify(enJson, null, 2), 'utf8');
fs.writeFileSync(ruJsonPath, JSON.stringify(ruJson, null, 2), 'utf8');
fs.writeFileSync(uzJsonPath, JSON.stringify(uzJson, null, 2), 'utf8');

console.log('Landing page translations applied');
