const fs = require('fs');
let code = fs.readFileSync('src/hooks/useDashboard.ts', 'utf8');
code = code.replace(
  'const newBooking = {',
  'const newBooking: any = { client_id: null, business_id: typeof window !== \'undefined\' ? localStorage.getItem(\'elara_business_id\') || \'\' : \'\', service_id: null, guest_name: customerName, is_guest: true,'
);
fs.writeFileSync('src/hooks/useDashboard.ts', code);
