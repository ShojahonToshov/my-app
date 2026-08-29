const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard-pages/Schedule.tsx', 'utf8');
code = code.replace(/t\("extra\.t497"\)/g, '"Select Date"');
code = code.replace(/t\("extra\.t346"\)/g, '"waiting"');
fs.writeFileSync('src/components/dashboard-pages/Schedule.tsx', code);
