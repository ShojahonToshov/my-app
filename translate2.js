const fs = require('fs');

const filesToProcess = [
  'src/app/account/components/AccountClient.tsx',
  'src/app/account/page.tsx'
];

let enJson = JSON.parse(fs.readFileSync('public/localization/en/en.json', 'utf8'));
let ruJson = JSON.parse(fs.readFileSync('public/localization/ru/ru.json', 'utf8'));
let uzJson = JSON.parse(fs.readFileSync('public/localization/uz/uz.json', 'utf8'));

let counter = Object.keys(enJson.extra || {}).length;

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
  { file: 'AccountClient.tsx', find: '>Keep it<', en: 'Keep it', ru: 'Оставить', uz: 'Qoldirish' },
  { file: 'AccountClient.tsx', find: '>Cancel Booking<', en: 'Cancel Booking', ru: 'Отменить бронь', uz: 'Bronni bekor qilish' },
  { file: 'AccountClient.tsx', find: '>Leave a review<', en: 'Leave a review', ru: 'Оставить отзыв', uz: 'Sharh qoldirish' },
  { file: 'AccountClient.tsx', find: '>Rate your visit<', en: 'Rate your visit', ru: 'Оцените ваш визит', uz: 'Tashrifingizni baholang' },
  { file: 'AccountClient.tsx', find: '>Cancel<', en: 'Cancel', ru: 'Отмена', uz: 'Bekor qilish' },
  { file: 'AccountClient.tsx', find: '>Submit Review<', en: 'Submit Review', ru: 'Отправить отзыв', uz: 'Sharhni yuborish' },
  { file: 'AccountClient.tsx', find: '>No favorites yet<', en: 'No favorites yet', ru: 'Пока нет избранного', uz: 'Hozircha sevimlilar yo\'q' },
  { file: 'AccountClient.tsx', find: '>Explore directory<', en: 'Explore directory', ru: 'Изучить каталог', uz: 'Katalogni kashf etish' },
  { file: 'page.tsx', find: '>Book<', en: 'Book', ru: 'Забронировать', uz: 'Bron qilish' },
  { file: 'page.tsx', find: '>Active Booking<', en: 'Active Booking', ru: 'Активное бронирование', uz: 'Faol bron' },
  { file: 'page.tsx', find: '>Confirmed<', en: 'Confirmed', ru: 'Подтверждено', uz: 'Tasdiqlangan' },
  { file: 'page.tsx', find: '>LiveTracker<', en: 'LiveTracker', ru: 'LiveTracker', uz: 'LiveTracker' },
  { file: 'page.tsx', find: 'title="No active bookings"', en: 'No active bookings', ru: 'Нет активных бронирований', uz: 'Faol bronlar yo\'q', attr: 'title' },
  { file: 'page.tsx', find: '>Find a venue<', en: 'Find a venue', ru: 'Найти заведение', uz: 'Joyni topish' },
  { file: 'page.tsx', find: '>Cancelled<', en: 'Cancelled', ru: 'Отменено', uz: 'Bekor qilingan' },
  { file: 'page.tsx', find: '>Completed<', en: 'Completed', ru: 'Завершено', uz: 'Tugallangan' },
  { file: 'page.tsx', find: '>No review needed<', en: 'No review needed', ru: 'Отзыв не требуется', uz: 'Sharh talab qilinmaydi' },
  { file: 'page.tsx', find: '>Book again<', en: 'Book again', ru: 'Забронировать снова', uz: 'Yana bron qilish' },
  { file: 'page.tsx', find: 'title="No history yet"', en: 'No history yet', ru: 'История пуста', uz: 'Hozircha tarix yo\'q', attr: 'title' }
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
      if (content.includes('"use client";')) {
        content = content.replace('"use client";', '"use client";\nimport { useI18nStore } from "@/stores/i18nStore";');
      } else {
        content = 'import { useI18nStore } from "@/stores/i18nStore";\n' + content;
      }
    }
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

fs.writeFileSync('public/localization/en/en.json', JSON.stringify(enJson, null, 2));
fs.writeFileSync('public/localization/ru/ru.json', JSON.stringify(ruJson, null, 2));
fs.writeFileSync('public/localization/uz/uz.json', JSON.stringify(uzJson, null, 2));

console.log("Applied second batch");
