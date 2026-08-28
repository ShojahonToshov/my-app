const fs = require('fs');
const path = require('path');

const enJsonPath = path.join(__dirname, 'public', 'localization', 'en', 'en.json');
const ruJsonPath = path.join(__dirname, 'public', 'localization', 'ru', 'ru.json');
const uzJsonPath = path.join(__dirname, 'public', 'localization', 'uz', 'uz.json');

let enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
let ruJson = JSON.parse(fs.readFileSync(ruJsonPath, 'utf8'));
let uzJson = JSON.parse(fs.readFileSync(uzJsonPath, 'utf8'));

enJson.dashboard = enJson.dashboard || {};
ruJson.dashboard = ruJson.dashboard || {};
uzJson.dashboard = uzJson.dashboard || {};

const dashboardTranslations = {
  liveQueue: { en: "Live Queue", ru: "Живая очередь", uz: "Jonli navbat" },
  appointments: { en: "Appointments", ru: "Записи", uz: "Yozuvlar" },
  calendar: { en: "Calendar", ru: "Календарь", uz: "Taqvim" },
  customers: { en: "Customers", ru: "Клиенты", uz: "Mijozlar" },
  analytics: { en: "Analytics", ru: "Аналитика", uz: "Analitika" },
  settings: { en: "Settings", ru: "Настройки", uz: "Sozlamalar" },
  logout: { en: "Log out", ru: "Выйти", uz: "Chiqish" },
  collapse: { en: "Collapse menu", ru: "Свернуть меню", uz: "Menyuni yig'ish" },
  myProfile: { en: "My Profile", ru: "Мой профиль", uz: "Mening profilim" },
  notifications: { en: "Notifications", ru: "Уведомления", uz: "Bildirishnomalar" },
  clearAll: { en: "Clear all", ru: "Очистить всё", uz: "Barchasini tozalash" }
};

for (const [key, trans] of Object.entries(dashboardTranslations)) {
  enJson.dashboard[key] = trans.en;
  ruJson.dashboard[key] = trans.ru;
  uzJson.dashboard[key] = trans.uz;
}

fs.writeFileSync(enJsonPath, JSON.stringify(enJson, null, 2), 'utf8');
fs.writeFileSync(ruJsonPath, JSON.stringify(ruJson, null, 2), 'utf8');
fs.writeFileSync(uzJsonPath, JSON.stringify(uzJson, null, 2), 'utf8');

const layoutPath = path.join(__dirname, 'src', 'components', 'DashboardLayout.tsx');
if (fs.existsSync(layoutPath)) {
  let layoutCode = fs.readFileSync(layoutPath, 'utf8');
  layoutCode = layoutCode.replace('export default function DashboardLayout({ children }: { children: React.ReactNode }) {', 'import { useI18nStore } from "@/stores/i18nStore";\nimport LanguageSwitcher from "@/components/LanguageSwitcher";\n\nexport default function DashboardLayout({ children }: { children: React.ReactNode }) {\n  const { t } = useI18nStore();');
  
  // Replace texts
  const labelsToReplace = [
    { text: "Live Queue", key: "liveQueue" },
    { text: "Appointments", key: "appointments" },
    { text: "Calendar", key: "calendar" },
    { text: "Customers", key: "customers" },
    { text: "Analytics", key: "analytics" },
    { text: "Settings", key: "settings" },
    { text: "Log out", key: "logout" },
    { text: "Collapse menu", key: "collapse" },
    { text: "My Profile", key: "myProfile" },
    { text: "Notifications", key: "notifications" },
    { text: "Clear all", key: "clearAll" }
  ];

  labelsToReplace.forEach(item => {
    // text wrapped in > <
    const regex1 = new RegExp(`>\\s*${item.text}\\s*<`, 'g');
    layoutCode = layoutCode.replace(regex1, `>{t("dashboard.${item.key}")}<`);

    // label="..."
    const regex2 = new RegExp(`label="${item.text}"`, 'g');
    layoutCode = layoutCode.replace(regex2, `label={t("dashboard.${item.key}")}`);

    // content="..."
    const regex3 = new RegExp(`content="${item.text}"`, 'g');
    layoutCode = layoutCode.replace(regex3, `content={t("dashboard.${item.key}")}`);
  });
  
  // also inject language switcher next to notifications bell
  // Find <button onClick={() => setShowNotifications(!showNotifications)}
  layoutCode = layoutCode.replace(
    /(<button[^>]*onClick={\(\) => setShowNotifications\(!showNotifications\)}[^>]*>[\s\S]*?<\/button>)/,
    '<LanguageSwitcher />\n              $1'
  );

  // find mobile bell icon container
  layoutCode = layoutCode.replace(
    /(<button[^>]*onClick={\(\) => setShowMobileNotifications\(true\)}[^>]*>[\s\S]*?<\/button>)/,
    '<LanguageSwitcher />\n              $1'
  );

  fs.writeFileSync(layoutPath, layoutCode, 'utf8');
}

console.log("Dashboard translations applied");
