const fs = require('fs');
let code = fs.readFileSync('src/app/account/components/AccountClient.tsx', 'utf8');
code = code.replace(/t\("extra\.t357"\)/g, 'useI18nStore.getState().t("extra.t357")');
code = code.replace(/t\("extra\.t516"\)/g, 'useI18nStore.getState().t("extra.t516")');
fs.writeFileSync('src/app/account/components/AccountClient.tsx', code);
