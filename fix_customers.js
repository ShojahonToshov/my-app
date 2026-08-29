const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard-pages/Customers.tsx', 'utf8');
code = code.replace(/t\("app\.t14"\)/g, 'useI18nStore.getState().t("app.t14")');
fs.writeFileSync('src/components/dashboard-pages/Customers.tsx', code);
