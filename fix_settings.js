const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard-pages/Settings.tsx', 'utf8');
code = code.replace(/t\("extra\.t368"\)/g, 'useI18nStore.getState().t("extra.t368")');
fs.writeFileSync('src/components/dashboard-pages/Settings.tsx', code);
