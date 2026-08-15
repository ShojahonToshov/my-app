const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/api/services/BookingService.ts', 'utf8');

c = c.replace(/console.error\("Error fetching businesses:", error\);/, 'console.error("Error fetching businesses:", error.message, error.details, error.hint, error.code);');

fs.writeFileSync('src/features/market-pages/api/services/BookingService.ts', c);
