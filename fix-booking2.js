const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/api/services/BookingService.ts', 'utf8');

c = c.replace(/async getBookingById\(id: string\) { return null; }/, 'async getBookingById(id: string): Promise<any> { return {} as any; }');
fs.writeFileSync('src/features/market-pages/api/services/BookingService.ts', c);
