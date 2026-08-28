const fs = require('fs');
const path = require('path');

const files = [
  'src/app/search/components/SearchClient.tsx',
  'src/components/CustomerBooking.tsx',
  'src/components/LiveTicket.tsx',
  'src/components/Onboarding/OnboardingWizard.tsx',
  'src/components/AccountSettings.tsx',
  'src/components/dashboard-pages/Dashboard.tsx',
  'src/components/dashboard-pages/Analytics.tsx',
  'src/components/dashboard-pages/Customers.tsx',
  'src/components/dashboard-pages/Schedule.tsx',
  'src/components/dashboard-pages/Settings.tsx',
  'src/components/dashboard-pages/DashboardSettings.tsx'
];

let allTexts = new Set();

files.forEach(f => {
  const fullPath = path.join(__dirname, f);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // match > Text <
  const regex = />\s*([a-zA-Z][a-zA-Z0-9\s,.!?'"-]+)\s*</g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text.length > 2 && !text.includes('{') && !text.includes('}')) {
      allTexts.add(text);
    }
  }
  
  // match placeholder="..."
  const regex2 = /placeholder="([a-zA-Z0-9\s,.!?'"-]+)"/g;
  while ((match = regex2.exec(content)) !== null) {
    allTexts.add(match[1].trim());
  }
});

fs.writeFileSync('extracted_texts.json', JSON.stringify(Array.from(allTexts), null, 2));
console.log("Extracted " + allTexts.size + " texts");
