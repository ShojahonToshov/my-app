const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/api/services/AuthService.ts', 'utf8');

const newMethods = `
  async getUser(id: string) {
    // Replace with supabase DB query if using tables, for now just returning dummy structure
    return { data: { id, name: "User" } };
  }

  async updateProfile(userId: string, userData: unknown) {
    const { data, error } = await this.supabase.auth.updateUser({
      data: userData as any
    });
    if (error) throw error;
    return data;
  }

  async patchProfile(userId: string, userData: unknown) {
    return this.updateProfile(userId, userData);
  }
}
export default new AuthService();
`;

c = c.replace(/}\s*export default new AuthService\(\);/, newMethods);
fs.writeFileSync('src/features/market-pages/api/services/AuthService.ts', c);
