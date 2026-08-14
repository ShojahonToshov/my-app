import { createClient } from '@/utils/supabase/client';

class AuthService {
  private get supabase() {
    return createClient();
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  }

  async signup(email: string, password: string, options?: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...options?.data,
        }
      }
    });

    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

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

