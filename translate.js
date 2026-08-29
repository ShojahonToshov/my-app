const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/components/dashboard-pages/Analytics.tsx',
  'src/components/dashboard-pages/Customers.tsx',
  'src/components/dashboard-pages/Dashboard.tsx',
  'src/components/dashboard-pages/Schedule.tsx',
  'src/components/dashboard-pages/Settings.tsx',
  'src/components/DashboardLayout.tsx',
  'src/components/Landing.tsx',
  'src/components/LanguageSwitcher.tsx',
  'src/components/LiveTicket.tsx',
  'src/components/Login.tsx',
  'src/components/Signup.tsx',
  'src/app/search/components/SearchClient.tsx',
  'src/components/Onboarding/OnboardingWizard.tsx'
];

let enJson = JSON.parse(fs.readFileSync('public/localization/en/en.json', 'utf8'));
let ruJson = JSON.parse(fs.readFileSync('public/localization/ru/ru.json', 'utf8'));
let uzJson = JSON.parse(fs.readFileSync('public/localization/uz/uz.json', 'utf8'));

if (!enJson.extra) enJson.extra = {};
if (!ruJson.extra) ruJson.extra = {};
if (!uzJson.extra) uzJson.extra = {};

let counter = Object.keys(enJson.extra).length;

function addTranslation(enText, ruText, uzText) {
  for (let key in enJson.extra) {
    if (enJson.extra[key] === enText) return 'extra.' + key;
  }
  const key = 't' + (counter++);
  enJson.extra[key] = enText;
  ruJson.extra[key] = ruText;
  uzJson.extra[key] = uzText;
  return 'extra.' + key;
}

const replacements = [
  { file: 'Analytics.tsx', find: '>Revenue<', en: 'Revenue', ru: 'Выручка', uz: 'Daromad' },
  { file: 'Analytics.tsx', find: '>Visits<', en: 'Visits', ru: 'Визиты', uz: 'Tashriflar' },
  { file: 'Analytics.tsx', find: '>New Customers<', en: 'New Customers', ru: 'Новые клиенты', uz: 'Yangi mijozlar' },
  { file: 'Analytics.tsx', find: '>Utilization<', en: 'Utilization', ru: 'Утилизация', uz: 'Foydalanish' },
  { file: 'Analytics.tsx', find: '>Cancel Rate<', en: 'Cancel Rate', ru: 'Процент отмен', uz: 'Bekor qilish darajasi' },
  { file: 'Analytics.tsx', find: '>Analytics<', en: 'Analytics', ru: 'Аналитика', uz: 'Analitika' },
  { file: 'Analytics.tsx', find: 'placeholder="Search..."', en: 'Search...', ru: 'Поиск...', uz: 'Qidiruv...', attr: 'placeholder' },

  { file: 'Customers.tsx', find: '>Add Customer<', en: 'Add Customer', ru: 'Добавить клиента', uz: 'Mijoz qo\'shish' },
  { file: 'Customers.tsx', find: '>Delete<', en: 'Delete', ru: 'Удалить', uz: 'O\'chirish' },
  { file: 'Customers.tsx', find: '>Send message<', en: 'Send message', ru: 'Отправить сообщение', uz: 'Xabar yuborish' },
  { file: 'Customers.tsx', find: '>Call<', en: 'Call', ru: 'Позвонить', uz: 'Qo\'ng\'iroq qilish' },
  { file: 'Customers.tsx', find: '>Contact<', en: 'Contact', ru: 'Контакт', uz: 'Aloqa' },
  { file: 'Customers.tsx', find: '>Notes<', en: 'Notes', ru: 'Заметки', uz: 'Eslatmalar' },
  { file: 'Customers.tsx', find: 'placeholder="Search customers..."', en: 'Search customers...', ru: 'Поиск клиентов...', uz: 'Mijozlarni qidirish...', attr: 'placeholder' },
  { file: 'Customers.tsx', find: '>No customers found<', en: 'No customers found', ru: 'Клиенты не найдены', uz: 'Mijozlar topilmadi' },
  { file: 'Customers.tsx', find: '>Add your first customer to get started.<', en: 'Add your first customer to get started.', ru: 'Добавьте первого клиента, чтобы начать.', uz: 'Boshlash uchun birinchi mijozingizni qo\'shing.' },
  { file: 'Customers.tsx', find: '>Delete Customer<', en: 'Delete Customer', ru: 'Удалить клиента', uz: 'Mijozni o\'chirish' },
  { file: 'Customers.tsx', find: '>Are you sure you want to delete this customer? This action cannot be undone.<', en: 'Are you sure you want to delete this customer? This action cannot be undone.', ru: 'Вы уверены, что хотите удалить этого клиента? Это действие необратимо.', uz: 'Haqiqatan ham bu mijozni o\'chirib tashlamoqchimisiz? Bu amalni bekor qilib bo\'lmaydi.' },
  
  { file: 'Dashboard.tsx', find: '>Good morning,<', en: 'Good morning,', ru: 'Доброе утро,', uz: 'Xayrli tong,' },
  { file: 'Dashboard.tsx', find: '>Good afternoon,<', en: 'Good afternoon,', ru: 'Добрый день,', uz: 'Xayrli kun,' },
  { file: 'Dashboard.tsx', find: '>Good evening,<', en: 'Good evening,', ru: 'Добрый вечер,', uz: 'Xayrli kech,' },
  { file: 'Dashboard.tsx', find: '>Here is what\'s happening today.<', en: 'Here is what\'s happening today.', ru: 'Вот что происходит сегодня.', uz: 'Bugun nimalar bo\'lyapti.' },
  { file: 'Dashboard.tsx', find: '>Active Staff<', en: 'Active Staff', ru: 'Активный персонал', uz: 'Faol xodimlar' },
  { file: 'Dashboard.tsx', find: '>Total Revenue<', en: 'Total Revenue', ru: 'Общая выручка', uz: 'Umumiy daromad' },
  
  { file: 'Settings.tsx', find: '>Settings<', en: 'Settings', ru: 'Настройки', uz: 'Sozlamalar' },
  { file: 'Settings.tsx', find: '>Profile<', en: 'Profile', ru: 'Профиль', uz: 'Profil' },
  { file: 'Settings.tsx', find: '>Services<', en: 'Services', ru: 'Услуги', uz: 'Xizmatlar' },
  { file: 'Settings.tsx', find: '>Team<', en: 'Team', ru: 'Команда', uz: 'Jamoa' },
  { file: 'Settings.tsx', find: '>No-Show Protection<', en: 'No-Show Protection', ru: 'Защита от неявок', uz: 'Kelmaslikdan himoya' },
  { file: 'Settings.tsx', find: '>About Business<', en: 'About Business', ru: 'О бизнесе', uz: 'Biznes haqida' },
  { file: 'Settings.tsx', find: '>This information will be displayed to customers on the booking page<', en: 'This information will be displayed to customers on the booking page', ru: 'Эта информация будет отображаться клиентам на странице бронирования', uz: 'Ushbu ma\'lumot mijozlarga bron qilish sahifasida ko\'rsatiladi' },
  { file: 'Settings.tsx', find: '>Business Logo<', en: 'Business Logo', ru: 'Логотип', uz: 'Logotip' },
  { file: 'Settings.tsx', find: '>Upload<', en: 'Upload', ru: 'Загрузить', uz: 'Yuklash' },
  { file: 'Settings.tsx', find: '>Business Name<', en: 'Business Name', ru: 'Название бизнеса', uz: 'Biznes nomi' },
  { file: 'Settings.tsx', find: '>Address<', en: 'Address', ru: 'Адрес', uz: 'Manzil' },
  { file: 'Settings.tsx', find: 'placeholder="E.g., 123 Main St"', en: 'E.g., 123 Main St', ru: 'Например, ул. Главная 123', uz: 'Masalan, Asosiy ko\'cha 123', attr: 'placeholder' },
  { file: 'Settings.tsx', find: '>Social Links<', en: 'Social Links', ru: 'Социальные сети', uz: 'Ijtimoiy tarmoqlar' },
  { file: 'Settings.tsx', find: '>About us<', en: 'About us', ru: 'О нас', uz: 'Biz haqimizda' },
  { file: 'Settings.tsx', find: 'placeholder="Tell your customers about your business..."', en: 'Tell your customers about your business...', ru: 'Расскажите клиентам о вашем бизнесе...', uz: 'Mijozlaringizga biznesingiz haqida gapirib bering...', attr: 'placeholder' },
  { file: 'Settings.tsx', find: '>Working Hours<', en: 'Working Hours', ru: 'Рабочие часы', uz: 'Ish vaqti' },
  { file: 'Settings.tsx', find: '>Configure working days and operating hours for online booking<', en: 'Configure working days and operating hours for online booking', ru: 'Настройте рабочие дни и часы для онлайн-бронирования', uz: 'Onlayn bron qilish uchun ish kunlari va soatlarini sozlang' },
  { file: 'Settings.tsx', find: '>Services & Pricing<', en: 'Services & Pricing', ru: 'Услуги и цены', uz: 'Xizmatlar va narxlar' },
  { file: 'Settings.tsx', find: '>Configure services visible in online booking<', en: 'Configure services visible in online booking', ru: 'Настройте услуги, видимые при онлайн-бронировании', uz: 'Onlayn bron qilishda ko\'rinadigan xizmatlarni sozlang' },
  { file: 'Settings.tsx', find: '>Price list is empty<', en: 'Price list is empty', ru: 'Прайс-лист пуст', uz: 'Narxlar ro\'yxati bo\'sh' },
  { file: 'Settings.tsx', find: '>Add your first service for customers.<', en: 'Add your first service for customers.', ru: 'Добавьте первую услугу для клиентов.', uz: 'Mijozlar uchun birinchi xizmatingizni qo\'shing.' },
  { file: 'Settings.tsx', find: 'title="Toggle service status"', en: 'Toggle service status', ru: 'Переключить статус услуги', uz: 'Xizmat holatini o\'zgartirish', attr: 'title' },
  { file: 'Settings.tsx', find: '>Manage specialists and their availability<', en: 'Manage specialists and their availability', ru: 'Управляйте специалистами и их доступностью', uz: 'Mutaxassislar va ularning mavjudligini boshqaring' },
  { file: 'Settings.tsx', find: '>No team members<', en: 'No team members', ru: 'Нет членов команды', uz: 'Jamoa a\'zolari yo\'q' },
  { file: 'Settings.tsx', find: '>Add specialists to start taking bookings.<', en: 'Add specialists to start taking bookings.', ru: 'Добавьте специалистов, чтобы начать принимать бронирования.', uz: 'Bronlarni qabul qilishni boshlash uchun mutaxassislarni qo\'shing.' },
  { file: 'Settings.tsx', find: '>Available for booking<', en: 'Available for booking', ru: 'Доступен для бронирования', uz: 'Bron qilish uchun mavjud' },
  { file: 'Settings.tsx', find: 'title="Toggle specialist status"', en: 'Toggle specialist status', ru: 'Переключить статус специалиста', uz: 'Mutaxassis holatini o\'zgartirish', attr: 'title' },
  { file: 'Settings.tsx', find: '>Set cancellation and deposit rules to eliminate empty calendar slots.<', en: 'Set cancellation and deposit rules to eliminate empty calendar slots.', ru: 'Установите правила отмены и депозита, чтобы исключить пустые окна в расписании.', uz: 'Bo\'sh vaqtlarni yo\'q qilish uchun bekor qilish va depozit qoidalarini o\'rnating.' },
  { file: 'Settings.tsx', find: '>Free Cancellation Window<', en: 'Free Cancellation Window', ru: 'Окно бесплатной отмены', uz: 'Bepul bekor qilish vaqti' },
  { file: 'Settings.tsx', find: '>If a customer cancels past this window, their reliability karma rating will decrease.<', en: 'If a customer cancels past this window, their reliability karma rating will decrease.', ru: 'Если клиент отменит бронь после этого времени, его рейтинг надежности снизится.', uz: 'Agar mijoz ushbu vaqtdan keyin bekor qilsa, uning ishonchlilik reytingi pasayadi.' },
  { file: 'Settings.tsx', find: '>Smart Karma Protection<', en: 'Smart Karma Protection', ru: 'Умная защита кармы', uz: 'Aqlli Karma himoyasi' },
  { file: 'Settings.tsx', find: '>Recommended<', en: 'Recommended', ru: 'Рекомендуется', uz: 'Tavsiya etiladi' },
  { file: 'Settings.tsx', find: 'title="Toggle Smart Karma Protection"', en: 'Toggle Smart Karma Protection', ru: 'Включить/выключить умную защиту кармы', uz: 'Aqlli Karma himoyasini yoqish/o\'chirish', attr: 'title' },
  { file: 'Settings.tsx', find: '>Karma Threshold<', en: 'Karma Threshold', ru: 'Порог кармы', uz: 'Karma chegarasi' },
  { file: 'Settings.tsx', find: '>Close<', en: 'Close', ru: 'Закрыть', uz: 'Yopish' },
  { file: 'Settings.tsx', find: '>Service Name<', en: 'Service Name', ru: 'Название услуги', uz: 'Xizmat nomi' },
  { file: 'Settings.tsx', find: 'placeholder="E.g. Laser Hair Removal"', en: 'E.g. Laser Hair Removal', ru: 'Например, Лазерная эпиляция', uz: 'Masalan, Lazerli epilyatsiya', attr: 'placeholder' },
  { file: 'Settings.tsx', find: '>Duration (min)<', en: 'Duration (min)', ru: 'Длительность (мин)', uz: 'Davomiyligi (daq)' },
  { file: 'Settings.tsx', find: '>Price (UZS)<', en: 'Price (UZS)', ru: 'Цена (UZS)', uz: 'Narxi (UZS)' },
  { file: 'Settings.tsx', find: '>Specialist<', en: 'Specialist', ru: 'Специалист', uz: 'Mutaxassis' },
  { file: 'Settings.tsx', find: 'placeholder="Full Name"', en: 'Full Name', ru: 'Полное имя', uz: 'To\'liq ism', attr: 'placeholder' },
  { file: 'Settings.tsx', find: '>Alexey K.<', en: 'Alexey K.', ru: 'Алексей К.', uz: 'Aleksey K.' },
  { file: 'Settings.tsx', find: '>Role<', en: 'Role', ru: 'Роль', uz: 'Rol' },
  { file: 'Settings.tsx', find: '>Confirm Deletion<', en: 'Confirm Deletion', ru: 'Подтвердите удаление', uz: 'O\'chirishni tasdiqlang' },

  { file: 'DashboardLayout.tsx', find: '>Queue (Live)<', en: 'Queue (Live)', ru: 'Очередь (Live)', uz: 'Navbat (Jonli)' },
  { file: 'DashboardLayout.tsx', find: '>Menu<', en: 'Menu', ru: 'Меню', uz: 'Menyu' },
  { file: 'DashboardLayout.tsx', find: '>Free<', en: 'Free', ru: 'Свободно', uz: 'Bo\'sh' },

  { file: 'LanguageSwitcher.tsx', find: 'aria-label="Change language"', en: 'Change language', ru: 'Изменить язык', uz: 'Tilni o\'zgartirish', attr: 'aria-label' },

  { file: 'LiveTicket.tsx', find: '>Booking not found<', en: 'Booking not found', ru: 'Бронирование не найдено', uz: 'Bron topilmadi' },
  { file: 'LiveTicket.tsx', find: 'placeholder="Share your experience (optional)"', en: 'Share your experience (optional)', ru: 'Поделитесь впечатлениями (необязательно)', uz: 'Taassurotlaringiz bilan o\'rtoqlashing (ixtiyoriy)', attr: 'placeholder' },
  { file: 'LiveTicket.tsx', find: '>Cancel visit?<', en: 'Cancel visit?', ru: 'Отменить визит?', uz: 'Tashrifni bekor qilasizmi?' },
  { file: 'LiveTicket.tsx', find: '>Canceling in advance helps professionals manage their time and maintains your reliability karma.<', en: 'Canceling in advance helps professionals manage their time and maintains your reliability karma.', ru: 'Заблаговременная отмена помогает специалистам планировать свое время и сохраняет вашу карму надежности.', uz: 'Oldindan bekor qilish mutaxassislarga o\'z vaqtlarini boshqarishga yordam beradi va ishonchlilik karmangizni saqlaydi.' },

  { file: 'Login.tsx', find: '>New to Elara?<', en: 'New to Elara?', ru: 'Впервые в Elara?', uz: 'Elara-da yangimisiz?' },

  { file: 'OnboardingWizard.tsx', find: '>Suggestions<', en: 'Suggestions', ru: 'Предложения', uz: 'Takliflar' },
  { file: 'OnboardingWizard.tsx', find: '>Business Name<', en: 'Business Name', ru: 'Название бизнеса', uz: 'Biznes nomi' },
  { file: 'OnboardingWizard.tsx', find: 'placeholder="e.g. Bella Salon"', en: 'e.g. Bella Salon', ru: 'напр. Салон Белла', uz: 'masalan, Bella saloni', attr: 'placeholder' },
  { file: 'OnboardingWizard.tsx', find: '>Address<', en: 'Address', ru: 'Адрес', uz: 'Manzil' },
  { file: 'OnboardingWizard.tsx', find: 'placeholder="123 Main St, City"', en: '123 Main St, City', ru: 'ул. Главная 123, Город', uz: 'Asosiy ko\'cha 123, Shahar', attr: 'placeholder' },
  { file: 'OnboardingWizard.tsx', find: '>Select a category<', en: 'Select a category', ru: 'Выберите категорию', uz: 'Kategoriyani tanlang' },
  { file: 'OnboardingWizard.tsx', find: 'placeholder="e.g. Men\'s Haircut"', en: 'e.g. Men\'s Haircut', ru: 'напр. Мужская стрижка', uz: 'masalan, Erkaklar soch turmagi', attr: 'placeholder' },
  { file: 'OnboardingWizard.tsx', find: '>Price (UZS)<', en: 'Price (UZS)', ru: 'Цена (UZS)', uz: 'Narxi (UZS)' },
  { file: 'OnboardingWizard.tsx', find: '>Duration (min)<', en: 'Duration (min)', ru: 'Длительность (мин)', uz: 'Davomiyligi (daq)' },
  { file: 'OnboardingWizard.tsx', find: '>Staff Name<', en: 'Staff Name', ru: 'Имя сотрудника', uz: 'Xodim ismi' },
  { file: 'OnboardingWizard.tsx', find: 'placeholder="e.g. John Doe"', en: 'e.g. John Doe', ru: 'напр. Иван Иванов', uz: 'masalan, Eshmat Toshmatov', attr: 'placeholder' },
  { file: 'OnboardingWizard.tsx', find: '>Select a role<', en: 'Select a role', ru: 'Выберите роль', uz: 'Rolni tanlang' },
  { file: 'OnboardingWizard.tsx', find: '>Save & Continue<', en: 'Save & Continue', ru: 'Сохранить и продолжить', uz: 'Saqlash va davom etish' },
  { file: 'OnboardingWizard.tsx', find: '>Skip for now<', en: 'Skip for now', ru: 'Пропустить пока', uz: 'Hozircha o\'tkazib yuborish' },
  { file: 'OnboardingWizard.tsx', find: '>Complete Setup<', en: 'Complete Setup', ru: 'Завершить настройку', uz: 'Sozlashni yakunlash' },

  { file: 'Signup.tsx', find: '>First Name<', en: 'First Name', ru: 'Имя', uz: 'Ism' },
  { file: 'Signup.tsx', find: 'placeholder="Jane"', en: 'Jane', ru: 'Анна', uz: 'Aziza', attr: 'placeholder' },
  { file: 'Signup.tsx', find: '>Last Name<', en: 'Last Name', ru: 'Фамилия', uz: 'Familiya' },
  { file: 'Signup.tsx', find: 'placeholder="Doe"', en: 'Doe', ru: 'Иванова', uz: 'Toshmatova', attr: 'placeholder' },
  { file: 'Signup.tsx', find: '>Create Password<', en: 'Create Password', ru: 'Создать пароль', uz: 'Parol yaratish' },

  { file: 'Landing.tsx', find: '>Language<', en: 'Language', ru: 'Язык', uz: 'Til' },
  { file: 'Landing.tsx', find: '>Oct 24, 2024<', en: 'Oct 24, 2024', ru: '24 Окт, 2024', uz: '24 Okt, 2024' },
  { file: 'Landing.tsx', find: '>Alexander Studio<', en: 'Alexander Studio', ru: 'Студия Александр', uz: 'Alexander studiyasi' },
  { file: 'Landing.tsx', find: '>Sarah Jenkins<', en: 'Sarah Jenkins', ru: 'Сара Дженкинс', uz: 'Sarah Jenkins' },
  { file: 'Landing.tsx', find: '>Hair Coloring<', en: 'Hair Coloring', ru: 'Окрашивание волос', uz: 'Soch bo\'yash' },
  { file: 'Landing.tsx', find: '>Elena Rostova<', en: 'Elena Rostova', ru: 'Елена Ростова', uz: 'Elena Rostova' },
  { file: 'Landing.tsx', find: '>Consultation<', en: 'Consultation', ru: 'Консультация', uz: 'Konsultatsiya' },
  { file: 'Landing.tsx', find: '>Staff: Michael<', en: 'Staff: Michael', ru: 'Сотрудник: Майкл', uz: 'Xodim: Michael' },
  { file: 'Landing.tsx', find: '>Michael Scott<', en: 'Michael Scott', ru: 'Майкл Скотт', uz: 'Michael Scott' },
  { file: 'Landing.tsx', find: '>Premium Cut & Beard<', en: 'Premium Cut & Beard', ru: 'Премиум стрижка и борода', uz: 'Premium soch va soqol olish' },
  { file: 'Landing.tsx', find: '>David Lin<', en: 'David Lin', ru: 'Дэвид Лин', uz: 'David Lin' },
  { file: 'Landing.tsx', find: '>Perfect<', en: 'Perfect', ru: 'Идеально', uz: 'Mukammal' },
  { file: 'Landing.tsx', find: '>Requires Deposit<', en: 'Requires Deposit', ru: 'Требует депозит', uz: 'Depozit talab qilinadi' },
  { file: 'Landing.tsx', find: '>Booking Confirmation<', en: 'Booking Confirmation', ru: 'Подтверждение бронирования', uz: 'Bronni tasdiqlash' },
  { file: 'Landing.tsx', find: '>Your Karma score requires a non-refundable deposit to secure this booking.<', en: 'Your Karma score requires a non-refundable deposit to secure this booking.', ru: 'Ваш рейтинг Кармы требует невозвратного депозита для защиты этого бронирования.', uz: 'Karma reytingingiz ushbu bronni xavfsiz qilish uchun qaytarilmaydigan depozitni talab qiladi.' },
  { file: 'Landing.tsx', find: '>Directions<', en: 'Directions', ru: 'Маршрут', uz: 'Yo\'nalish' },
  { file: 'Landing.tsx', find: '>Contact<', en: 'Contact', ru: 'Связаться', uz: 'Aloqa' },
  { file: 'Landing.tsx', find: '>Cancel booking<', en: 'Cancel booking', ru: 'Отменить бронь', uz: 'Bronni bekor qilish' },
  { file: 'Landing.tsx', find: '>Scheduled for<', en: 'Scheduled for', ru: 'Запланировано на', uz: 'Rejalashtirilgan' },
  { file: 'Landing.tsx', find: '>Confirmed<', en: 'Confirmed', ru: 'Подтверждено', uz: 'Tasdiqlangan' },
  { file: 'Landing.tsx', find: '>Upcoming<', en: 'Upcoming', ru: 'Предстоящие', uz: 'Kelgusi' },
  { file: 'Landing.tsx', find: '>Queue<', en: 'Queue', ru: 'Очередь', uz: 'Navbat' },
  { file: 'Landing.tsx', find: '>In chair<', en: 'In chair', ru: 'В кресле', uz: 'Kresloda' },
  { file: 'Landing.tsx', find: '>Completed<', en: 'Completed', ru: 'Завершено', uz: 'Tugallangan' },
  { file: 'Landing.tsx', find: '>Professional<', en: 'Professional', ru: 'Специалист', uz: 'Mutaxassis' },
  { file: 'Landing.tsx', find: '>Date<', en: 'Date', ru: 'Дата', uz: 'Sana' },
  { file: 'Landing.tsx', find: '>Online & Accepting Bookings<', en: 'Online & Accepting Bookings', ru: 'Онлайн и принимает бронирования', uz: 'Onlayn va bronlarni qabul qilmoqda' },
  { file: 'Landing.tsx', find: '>Waiting<', en: 'Waiting', ru: 'Ожидание', uz: 'Kutmoqda' },
  { file: 'Landing.tsx', find: '>In Chair<', en: 'In Chair', ru: 'В кресле', uz: 'Kresloda' },
  { file: 'Landing.tsx', find: '>Any Professional<', en: 'Any Professional', ru: 'Любой специалист', uz: 'Istalgan mutaxassis' },
  { file: 'Landing.tsx', find: '>Call In<', en: 'Call In', ru: 'Вызвать', uz: 'Chaqirish' },
  { file: 'Landing.tsx', find: '>Complete & Call Next<', en: 'Complete & Call Next', ru: 'Завершить и вызвать следующего', uz: 'Tugatish va keyingisini chaqirish' },
  { file: 'Landing.tsx', find: '>+10 min delay<', en: '+10 min delay', ru: '+10 мин задержка', uz: '+10 daq kechikish' },
  { file: 'Landing.tsx', find: '>Business Protection<', en: 'Business Protection', ru: 'Защита бизнеса', uz: 'Biznes himoyasi' },
  { file: 'Landing.tsx', find: '>Michael<', en: 'Michael', ru: 'Майкл', uz: 'Michael' },
  
  { file: 'SearchClient.tsx', find: '>No results for "<', en: 'No results for "', ru: 'Нет результатов для "', uz: 'Uchun natija yo\'q "' },
  { file: 'SearchClient.tsx', find: '>. Try adjusting your search or clearing the filters.<', en: '. Try adjusting your search or clearing the filters.', ru: '". Попробуйте изменить запрос или очистить фильтры.', uz: '". Qidiruvni o\'zgartirib ko\'ring yoki filtrlarni tozalang.' },
  { file: 'SearchClient.tsx', find: '>No venues match the selected filters. Try a different category.<', en: 'No venues match the selected filters. Try a different category.', ru: 'Ни одно заведение не соответствует выбранным фильтрам. Попробуйте другую категорию.', uz: 'Tanlangan filtrlarga mos keladigan joy yo\'q. Boshqa kategoriyani sinab ko\'ring.' },
];

filesToProcess.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  replacements.forEach(r => {
    if (filePath.endsWith(r.file)) {
      if (content.includes(r.find)) {
        const key = addTranslation(r.en, r.ru, r.uz);
        if (r.attr) {
          content = content.replaceAll(r.find, r.attr + '={t("' + key + '")}');
        } else {
          content = content.replaceAll(r.find, '>{t("' + key + '")}<');
        }
        hasChanges = true;
      }
    }
  });

  if (hasChanges) {
    if (!content.includes('import { useI18nStore')) {
      content = 'import { useI18nStore } from "@/stores/i18nStore";\n' + content;
    }
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

fs.writeFileSync('public/localization/en/en.json', JSON.stringify(enJson, null, 2));
fs.writeFileSync('public/localization/ru/ru.json', JSON.stringify(ruJson, null, 2));
fs.writeFileSync('public/localization/uz/uz.json', JSON.stringify(uzJson, null, 2));

console.log("Translation applied");
