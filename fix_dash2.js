const fs = require('fs');
let code = fs.readFileSync('src/hooks/useDashboard.ts', 'utf8');
code = code.replace(
  'typeof window !== \\'undefined\\' ? localStorage.getItem(\\'elara_business_id\\') || \\'\\' : \\'\\'',
  'null'
);
fs.writeFileSync('src/hooks/useDashboard.ts', code);
