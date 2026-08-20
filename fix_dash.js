const fs = require('fs');
let code = fs.readFileSync('src/hooks/useDashboard.ts', 'utf8');
code = code.replace(
  'const newBooking = {',
  'const newBooking = {\n      client_id: null,\n      business_id: typeof window !== \'undefined\' ? localStorage.getItem(\'elara_business_id\') || \'\' : \'\',\n      service_id: null,\n      guest_name: customerName,\n      guest_phone: \'+998 90 000 00 00\',\n      is_guest: true,'
);
fs.writeFileSync('src/hooks/useDashboard.ts', code);
