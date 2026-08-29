const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard-pages/Dashboard.tsx', 'utf8');
code = code.replace(/newStatus = t\("extra\.t387"\);/g, 'newStatus = "completed";');
fs.writeFileSync('src/components/dashboard-pages/Dashboard.tsx', code);
