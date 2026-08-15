const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/api/services/BookingService.ts', 'utf8');

const newMethods = `
  async getBusinesses() {
    const { data, error } = await this.supabase
      .from('businesses')
      .select('*');
    if (error) {
      console.error("Error fetching businesses:", error);
      return [];
    }
    return data;
  }
}
export default new BookingService();
`;

c = c.replace(/}\s*export default new BookingService\(\);/, newMethods);
fs.writeFileSync('src/features/market-pages/api/services/BookingService.ts', c);
