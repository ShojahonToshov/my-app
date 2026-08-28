const fs = require('fs');
const path = require('path');

const enJsonPath = path.join(__dirname, 'public', 'localization', 'en', 'en.json');
const ruJsonPath = path.join(__dirname, 'public', 'localization', 'ru', 'ru.json');
const uzJsonPath = path.join(__dirname, 'public', 'localization', 'uz', 'uz.json');

let enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
let ruJson = JSON.parse(fs.readFileSync(ruJsonPath, 'utf8'));
let uzJson = JSON.parse(fs.readFileSync(uzJsonPath, 'utf8'));

enJson.auth = enJson.auth || {};
ruJson.auth = ruJson.auth || {};
uzJson.auth = uzJson.auth || {};

const authTranslations = {
  welcomeBack: { en: "Welcome back", ru: "С возвращением", uz: "Xush kelibsiz" },
  chooseLogin: { en: "Choose how you want to log in", ru: "Выберите способ входа", uz: "Kirish usulini tanlang" },
  phone: { en: "Phone", ru: "Телефон", uz: "Telefon" },
  email: { en: "Email", ru: "Email", uz: "Pochta" },
  name: { en: "Name", ru: "Имя", uz: "Ism" },
  phoneNumber: { en: "Phone number", ru: "Номер телефона", uz: "Telefon raqami" },
  emailAddress: { en: "Email address", ru: "Адрес электронной почты", uz: "Email manzil" },
  username: { en: "Username", ru: "Имя пользователя", uz: "Foydalanuvchi nomi" },
  password: { en: "Password", ru: "Пароль", uz: "Parol" },
  forgotPassword: { en: "Forgot your password?", ru: "Забыли пароль?", uz: "Parolni unutdingizmi?" },
  signInBtn: { en: "Sign in", ru: "Войти", uz: "Kirish" },
  signingIn: { en: "Signing in...", ru: "Вход...", uz: "Kirilmoqda..." },
  noAccount: { en: "Don't have an account?", ru: "Нет аккаунта?", uz: "Hisobingiz yo'qmi?" },
  signUp: { en: "Sign up", ru: "Зарегистрироваться", uz: "Ro'yxatdan o'tish" },
  createAccount: { en: "Create an account", ru: "Создать аккаунт", uz: "Hisob yaratish" },
  enterDetails: { en: "Enter your details below to create your account", ru: "Введите данные ниже для создания аккаунта", uz: "Hisob yaratish uchun quyidagi ma'lumotlarni kiriting" },
  fullName: { en: "Full Name", ru: "Полное имя", uz: "To'liq ism" },
  signingUp: { en: "Creating account...", ru: "Создание...", uz: "Yaratilmoqda..." },
  hasAccount: { en: "Already have an account?", ru: "Уже есть аккаунт?", uz: "Hisobingiz bormi?" }
};

for (const [key, trans] of Object.entries(authTranslations)) {
  enJson.auth[key] = trans.en;
  ruJson.auth[key] = trans.ru;
  uzJson.auth[key] = trans.uz;
}

fs.writeFileSync(enJsonPath, JSON.stringify(enJson, null, 2), 'utf8');
fs.writeFileSync(ruJsonPath, JSON.stringify(ruJson, null, 2), 'utf8');
fs.writeFileSync(uzJsonPath, JSON.stringify(uzJson, null, 2), 'utf8');

const loginPath = path.join(__dirname, 'src', 'components', 'Login.tsx');
if (fs.existsSync(loginPath)) {
  let loginCode = fs.readFileSync(loginPath, 'utf8');
  // inject i18n
  loginCode = loginCode.replace('export default function Login() {', 'import { useI18nStore } from "@/stores/i18nStore";\n\nexport default function Login() {\n  const { t } = useI18nStore();');
  
  loginCode = loginCode.replace(/>\s*Welcome back\s*</g, '>{t("auth.welcomeBack")}<');
  loginCode = loginCode.replace(/>\s*Choose how you want to log in\s*</g, '>{t("auth.chooseLogin")}<');
  loginCode = loginCode.replace(/>\s*Phone\s*</g, '>{t("auth.phone")}<');
  loginCode = loginCode.replace(/>\s*Email\s*</g, '>{t("auth.email")}<');
  loginCode = loginCode.replace(/>\s*Name\s*</g, '>{t("auth.name")}<');
  
  loginCode = loginCode.replace(/>\s*Forgot your password\?\s*</g, '>{t("auth.forgotPassword")}<');
  loginCode = loginCode.replace(/>\s*Sign in\s*</g, '>{t("auth.signInBtn")}<');
  loginCode = loginCode.replace(/>\s*Signing in\.\.\.\s*</g, '>{t("auth.signingIn")}<');
  loginCode = loginCode.replace(/>\s*Don't have an account\?\s*</g, '>{t("auth.noAccount")}<');
  loginCode = loginCode.replace(/>\s*Sign up\s*</g, '>{t("auth.signUp")}<');

  // placeholders
  loginCode = loginCode.replace(/label: "Phone number"/g, 'label: t("auth.phoneNumber")');
  loginCode = loginCode.replace(/label: "Email address"/g, 'label: t("auth.emailAddress")');
  loginCode = loginCode.replace(/label: "Username"/g, 'label: t("auth.username")');
  loginCode = loginCode.replace(/label="Password"/g, 'label={t("auth.password")}');
  
  fs.writeFileSync(loginPath, loginCode, 'utf8');
}

const signupPath = path.join(__dirname, 'src', 'components', 'Signup.tsx');
if (fs.existsSync(signupPath)) {
  let signupCode = fs.readFileSync(signupPath, 'utf8');
  signupCode = signupCode.replace('export default function Signup() {', 'import { useI18nStore } from "@/stores/i18nStore";\n\nexport default function Signup() {\n  const { t } = useI18nStore();');
  
  signupCode = signupCode.replace(/>\s*Create an account\s*</g, '>{t("auth.createAccount")}<');
  signupCode = signupCode.replace(/>\s*Enter your details below to create your account\s*</g, '>{t("auth.enterDetails")}<');
  signupCode = signupCode.replace(/>\s*Already have an account\?\s*</g, '>{t("auth.hasAccount")}<');
  signupCode = signupCode.replace(/>\s*Log in\s*</g, '>{t("auth.signInBtn")}<');
  
  signupCode = signupCode.replace(/label="Full Name"/g, 'label={t("auth.fullName")}');
  signupCode = signupCode.replace(/label="Password"/g, 'label={t("auth.password")}');

  // there might be a button text Create account
  signupCode = signupCode.replace(/>\s*Create account\s*</g, '>{t("auth.createAccount")}<');
  signupCode = signupCode.replace(/>\s*Creating account\.\.\.\s*</g, '>{t("auth.signingUp")}<');

  fs.writeFileSync(signupPath, signupCode, 'utf8');
}

console.log("Auth translations applied");
