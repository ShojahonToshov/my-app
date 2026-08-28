const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/search/components/SearchClient.tsx',
  'src/components/dashboard-pages/Customers.tsx',
  'src/components/dashboard-pages/Settings.tsx'
];

filesToFix.forEach(f => {
  const fullPath = path.join(__dirname, f);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Remove `const { t } = useI18nStore();`
  content = content.replace(/const\s+\{\s*t\s*\}\s*=\s*useI18nStore\(\);\s*/g, '');

  // Replace `{t("` with `{useI18nStore.getState().t("`
  content = content.replace(/\{t\("/g, '{useI18nStore.getState().t("');
  
  // Replace ` t("` with ` useI18nStore.getState().t("`
  content = content.replace(/\s+t\("/g, ' useI18nStore.getState().t("');
  
  // Replace `(t("` with `(useI18nStore.getState().t("`
  content = content.replace(/\(t\("/g, '(useI18nStore.getState().t("');
  
  // Replace `[t("` with `[useI18nStore.getState().t("`
  content = content.replace(/\[t\("/g, '[useI18nStore.getState().t("');

  fs.writeFileSync(fullPath, content, 'utf8');
});
console.log("Fixed via getState()");
