require('dotenv').config({ path: '.env.local' });
const url = process.argv[2];
if (!url) { console.error('Please provide your Vercel URL, e.g. node setup-webhook.js https://my-app.vercel.app'); process.exit(1); }
const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) { console.error('TELEGRAM_BOT_TOKEN not found in .env.local'); process.exit(1); }

fetch("https://api.telegram.org/bot/setWebhook", {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: ${url}/api/telegram })
}).then(r => r.json()).then(console.log).catch(console.error);
