const fs = require('fs');
const path = require('path');

const footerPath = path.join(__dirname, 'src', 'components', 'Footer.tsx');
let footerCode = fs.readFileSync(footerPath, 'utf8');

const enJsonPath = path.join(__dirname, 'public', 'localization', 'en', 'en.json');
const ruJsonPath = path.join(__dirname, 'public', 'localization', 'ru', 'ru.json');
const uzJsonPath = path.join(__dirname, 'public', 'localization', 'uz', 'uz.json');

let enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
let ruJson = JSON.parse(fs.readFileSync(ruJsonPath, 'utf8'));
let uzJson = JSON.parse(fs.readFileSync(uzJsonPath, 'utf8'));

enJson.footer = {};
ruJson.footer = {};
uzJson.footer = {};

const translations = [
  {
    key: "desc",
    en: "The premium destination for discovering and booking top-tier services in your city. Elevating the standard of appointment management.",
    ru: "Премиальное место для поиска и бронирования лучших услуг в вашем городе. Повышаем стандарты управления записями.",
    uz: "Shahringizdagi eng yaxshi xizmatlarni topish va bron qilish uchun premium manzil. Yozuvlarni boshqarish standartlarini oshiramiz.",
    original: "The premium destination for discovering and booking top-tier\n            services in your city. Elevating the standard of appointment\n            management."
  },
  {
    key: "platform",
    en: "Platform",
    ru: "Платформа",
    uz: "Platforma",
    original: "Platform"
  },
  {
    key: "search",
    en: "Search",
    ru: "Поиск",
    uz: "Qidirish",
    original: "Search"
  },
  {
    key: "connect",
    en: "Connect",
    ru: "Контакты",
    uz: "Aloqa",
    original: "Connect"
  },
  {
    key: "rights",
    en: "All rights reserved.",
    ru: "Все права защищены.",
    uz: "Barcha huquqlar himoyalangan.",
    original: "All rights reserved."
  },
  {
    key: "privacy",
    en: "Privacy Policy",
    ru: "Политика конфиденциальности",
    uz: "Maxfiylik siyosati",
    original: "Privacy Policy"
  },
  {
    key: "terms",
    en: "Terms of Service",
    ru: "Условия использования",
    uz: "Foydalanish shartlari",
    original: "Terms of Service"
  }
];

translations.forEach(tItem => {
  enJson.footer[tItem.key] = tItem.en;
  ruJson.footer[tItem.key] = tItem.ru;
  uzJson.footer[tItem.key] = tItem.uz;
  
  if (tItem.key === 'desc') {
    footerCode = footerCode.replace(/The premium destination[\s\S]*management\./, '{t("footer.desc")}');
  } else {
    const regex = new RegExp(`>\\s*${tItem.original}\\s*<`, 'g');
    if (footerCode.match(regex)) {
      footerCode = footerCode.replace(regex, `>{t("footer.${tItem.key}")}<`);
    } else {
      footerCode = footerCode.replace(tItem.original, `{t("footer.${tItem.key}")}`);
    }
  }
});

// Import the hook in Footer
footerCode = footerCode.replace('import SignupRoleModal from "@/components/SignupRoleModal";', 'import SignupRoleModal from "@/components/SignupRoleModal";\nimport { useI18nStore } from "@/stores/i18nStore";');
footerCode = footerCode.replace('export default function Footer() {', 'export default function Footer() {\n  const { t } = useI18nStore();');
// replace Log in and Sign up
footerCode = footerCode.replace(/>\s*Log in\s*</g, '>{t("auth.signIn")}<');
footerCode = footerCode.replace(/>\s*Sign up\s*</g, '>{t("auth.getStarted")}<');


fs.writeFileSync(footerPath, footerCode, 'utf8');
fs.writeFileSync(enJsonPath, JSON.stringify(enJson, null, 2), 'utf8');
fs.writeFileSync(ruJsonPath, JSON.stringify(ruJson, null, 2), 'utf8');
fs.writeFileSync(uzJsonPath, JSON.stringify(uzJson, null, 2), 'utf8');

console.log('Footer translations applied');
