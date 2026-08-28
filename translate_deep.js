const fs = require('fs');

const translations = [
  { original: "Search", en: "Search", ru: "Поиск", uz: "Qidirish" },
  { original: "Nothing found", en: "Nothing found", ru: "Ничего не найдено", uz: "Hech narsa topilmadi" },
  { original: "Service or salon", en: "Service or salon", ru: "Услуга или салон", uz: "Xizmat yoki salon" },
  { original: "Where to search?", en: "Where to search?", ru: "Где искать?", uz: "Qayerda izlash kerak?" },
  { original: "Log in", en: "Log in", ru: "Войти", uz: "Kirish" },
  { original: "Sign up", en: "Sign up", ru: "Регистрация", uz: "Ro'yxatdan o'tish" },
  { original: "City, district...", en: "City, district...", ru: "Город, район...", uz: "Shahar, tuman..." },
  { original: "Saved", en: "Saved", ru: "Сохраненные", uz: "Saqlangan" },
  { original: "Open Now", en: "Open Now", ru: "Открыто сейчас", uz: "Hozir ochiq" },
  { original: "Sort", en: "Sort", ru: "Сортировка", uz: "Saralash" },
  { original: "Open now", en: "Open now", ru: "Открыто сейчас", uz: "Hozir ochiq" },
  { original: "Popular", en: "Popular", ru: "Популярные", uz: "Ommabop" },
  { original: "Closed", en: "Closed", ru: "Закрыто", uz: "Yopiq" },
  { original: "Open", en: "Open", ru: "Открыто", uz: "Ochiq" },
  { original: "New", en: "New", ru: "Новые", uz: "Yangi" },
  { original: "Book now", en: "Book now", ru: "Забронировать", uz: "Band qilish" },
  { original: "Cancel", en: "Cancel", ru: "Отмена", uz: "Bekor qilish" },
  { original: "Proceed to Book", en: "Proceed to Book", ru: "Перейти к бронированию", uz: "Band qilishga o'tish" },
  { original: "Booking", en: "Booking", ru: "Бронирование", uz: "Band qilish" },
  { original: "About", en: "About", ru: "О нас", uz: "Biz haqimizda" },
  { original: "Select service", en: "Select service", ru: "Выберите услугу", uz: "Xizmatni tanlang" },
  { original: "Professional", en: "Professional", ru: "Специалист", uz: "Mutaxassis" },
  { original: "Sign in to continue", en: "Sign in to continue", ru: "Войдите для продолжения", uz: "Davom etish uchun kiring" },
  { original: "Confirmation", en: "Confirmation", ru: "Подтверждение", uz: "Tasdiqlash" },
  { original: "Location", en: "Location", ru: "Локация", uz: "Joylashuv" },
  { original: "Opening hours", en: "Opening hours", ru: "Часы работы", uz: "Ish vaqti" },
  { original: "Contacts", en: "Contacts", ru: "Контакты", uz: "Aloqa" },
  { original: "Reviews", en: "Reviews", ru: "Отзывы", uz: "Sharhlar" },
  { original: "Go to booking", en: "Go to booking", ru: "Перейти к бронированию", uz: "Band qilishga o'tish" },
  { original: "Back to profile", en: "Back to profile", ru: "Вернуться в профиль", uz: "Profilga qaytish" },
  { original: "Upcoming", en: "Upcoming", ru: "Предстоящие", uz: "Kelgusida" },
  { original: "Queue", en: "Queue", ru: "Очередь", uz: "Navbat" },
  { original: "In chair", en: "In chair", ru: "В кресле", uz: "Kresloda" },
  { original: "Completed", en: "Completed", ru: "Завершено", uz: "Tugallandi" },
  { original: "Date", en: "Date", ru: "Дата", uz: "Sana" },
  { original: "Directions", en: "Directions", ru: "Маршрут", uz: "Yo'nalish" },
  { original: "Contact", en: "Contact", ru: "Связаться", uz: "Aloqa" },
  { original: "Cancel booking", en: "Cancel booking", ru: "Отменить запись", uz: "Yozuvni bekor qilish" },
  { original: "Total Bookings", en: "Total Bookings", ru: "Всего записей", uz: "Jami yozuvlar" },
  { original: "In Salon Now", en: "In Salon Now", ru: "Сейчас в салоне", uz: "Hozir salonda" },
  { original: "Waiting", en: "Waiting", ru: "Ожидают", uz: "Kutmoqda" },
  { original: "Revenue", en: "Revenue", ru: "Доход", uz: "Daromad" },
  { original: "Visits", en: "Visits", ru: "Визиты", uz: "Tashriflar" },
  { original: "Customer", en: "Customer", ru: "Клиент", uz: "Mijoz" },
  { original: "Status", en: "Status", ru: "Статус", uz: "Holat" },
  { original: "Actions", en: "Actions", ru: "Действия", uz: "Harakatlar" },
  { original: "Schedule", en: "Schedule", ru: "Расписание", uz: "Jadval" },
  { original: "Time", en: "Time", ru: "Время", uz: "Vaqt" },
  { original: "Staff", en: "Staff", ru: "Сотрудник", uz: "Xodim" },
  { original: "Service", en: "Service", ru: "Услуга", uz: "Xizmat" }
];

const fsP = fs.promises;
const path = require('path');

async function run() {
  const enJsonPath = path.join(__dirname, 'public', 'localization', 'en', 'en.json');
  const ruJsonPath = path.join(__dirname, 'public', 'localization', 'ru', 'ru.json');
  const uzJsonPath = path.join(__dirname, 'public', 'localization', 'uz', 'uz.json');

  let enJson = JSON.parse(await fsP.readFile(enJsonPath, 'utf8'));
  let ruJson = JSON.parse(await fsP.readFile(ruJsonPath, 'utf8'));
  let uzJson = JSON.parse(await fsP.readFile(uzJsonPath, 'utf8'));

  enJson.app = enJson.app || {};
  ruJson.app = ruJson.app || {};
  uzJson.app = uzJson.app || {};

  translations.forEach((tItem, i) => {
    const key = 't' + i;
    enJson.app[key] = tItem.en;
    ruJson.app[key] = tItem.ru;
    uzJson.app[key] = tItem.uz;
    tItem.key = key;
  });

  await fsP.writeFile(enJsonPath, JSON.stringify(enJson, null, 2), 'utf8');
  await fsP.writeFile(ruJsonPath, JSON.stringify(ruJson, null, 2), 'utf8');
  await fsP.writeFile(uzJsonPath, JSON.stringify(uzJson, null, 2), 'utf8');

  const files = [
    'src/app/search/components/SearchClient.tsx',
    'src/components/CustomerBooking.tsx',
    'src/components/LiveTicket.tsx',
    'src/components/dashboard-pages/Dashboard.tsx',
    'src/components/dashboard-pages/Analytics.tsx',
    'src/components/dashboard-pages/Customers.tsx',
    'src/components/dashboard-pages/Schedule.tsx',
    'src/components/dashboard-pages/Settings.tsx'
  ];

  for (let f of files) {
    const fullPath = path.join(__dirname, f);
    if (!fs.existsSync(fullPath)) continue;
    
    let content = await fsP.readFile(fullPath, 'utf8');
    
    let needsImport = false;

    translations.forEach(tItem => {
      // replace > text <
      const regex = new RegExp(`>\\s*${tItem.original.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}\\s*<`, 'g');
      if (content.match(regex)) {
        needsImport = true;
        content = content.replace(regex, `>{t("app.${tItem.key}")}<`);
      }
      
      // replace placeholder="text"
      const regex2 = new RegExp(`placeholder="${tItem.original.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}"`, 'g');
      if (content.match(regex2)) {
        needsImport = true;
        content = content.replace(regex2, `placeholder={t("app.${tItem.key}")}`);
      }

      // replace label="text"
      const regex3 = new RegExp(`label="${tItem.original.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}"`, 'g');
      if (content.match(regex3)) {
        needsImport = true;
        content = content.replace(regex3, `label={t("app.${tItem.key}")}`);
      }
    });

    if (needsImport && !content.includes('useI18nStore')) {
      // Very naive import injection
      const importStmt = `import { useI18nStore } from "@/stores/i18nStore";\n`;
      content = importStmt + content;
      
      // inject hook call inside the component
      // Find the export default function ...() {
      const funcRegex = /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*{/g;
      const match = funcRegex.exec(content);
      if (match) {
        content = content.replace(match[0], `${match[0]}\n  const { t } = useI18nStore();\n`);
      }
    }

    await fsP.writeFile(fullPath, content, 'utf8');
  }

  console.log("Deep translation applied");
}

run();
