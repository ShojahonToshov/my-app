const fs = require('fs');

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

filesToProcess.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.startsWith('import { useI18nStore } from "@/stores/i18nStore";\n"use client";')) {
    content = content.replace('import { useI18nStore } from "@/stores/i18nStore";\n"use client";', '"use client";\nimport { useI18nStore } from "@/stores/i18nStore";');
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
