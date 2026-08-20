const fs = require('fs');
let code = fs.readFileSync('src/hooks/useBooking.ts', 'utf8');
code = code.replace(
  'const newBooking = {',
  'const newBooking = {\n      client_id: currentUser?.id || null,\n      business_id: String((venueData as ExtendedBusiness)?.id || venueId),\n      service_id: serviceObj?.id || null,\n      guest_name: customerName,\n      guest_phone: String(customerPhone),\n      is_guest: !currentUser?.id,'
);
fs.writeFileSync('src/hooks/useBooking.ts', code);
