const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/api/services/BookingService.ts', 'utf8');

const newMethods = `
  async getBookings() { return []; }
  async getBookingById(id: string) { return null; }
  async createBooking(data: any) { return { data }; }
  async updateBooking(id: string, data: any) { return { data }; }
  async deleteBooking(id: string) { return true; }
}
export default new BookingService();
`;

c = c.replace(/}\s*export default new BookingService\(\);/, newMethods);
fs.writeFileSync('src/features/market-pages/api/services/BookingService.ts', c);
