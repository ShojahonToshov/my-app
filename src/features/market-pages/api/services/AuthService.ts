import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id?: string;
  role?: string;
  full_name?: string;
  avatar_url?: string;
  [key: string]: unknown;
}

export type AppUser = User & {
  profile?: UserProfile;
};

class AuthService {
  private get supabase() {
    return createClient();
  }

  // Вспомогательная функция для получения профиля пользователя из БД
  private async fetchProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Подтягиваем данные публичного профиля
    if (data.user) {
      const profile = await this.fetchProfile(data.user.id);
      if (profile) {
        // Добавляем данные профиля прямо в объект пользователя для удобства
        (data.user as AppUser).profile = profile;
      }
    }
    
    return { ...data, user: data.user as AppUser | null };
  }

  async signup(email: string, password: string, options?: { data?: Record<string, unknown> }) {
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
    
    // Профиль будет создан автоматически через SQL-триггер,
    // но чтобы вернуть его сразу после регистрации:
    if (data.user) {
      // Даем триггеру долю секунды на создание профиля
      await new Promise(resolve => setTimeout(resolve, 500));
      const profile = await this.fetchProfile(data.user.id);
      if (profile) {
        (data.user as AppUser).profile = profile;
      }
    }

    return { ...data, user: data.user as AppUser | null };
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<AppUser | null> {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    
    if (user) {
      const profile = await this.fetchProfile(user.id);
      if (profile) {
        (user as AppUser).profile = profile;
      }
      return user as AppUser;
    }
    
    return null;
  }

  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  async getUser(id: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return { data };
  }

  async updateProfile(userId: string, userData: Partial<UserProfile>) {
    // Обновляем данные в таблице profiles
    const { data, error } = await this.supabase
      .from('profiles')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    
    // Если меняется имя, обновляем и мету в auth.users
    if (userData.full_name) {
      await this.supabase.auth.updateUser({
        data: { full_name: userData.full_name }
      });
    }

    return data;
  }

  async patchProfile(userId: string, userData: Partial<UserProfile>) {
    return this.updateProfile(userId, userData);
  }
}

export default new AuthService();
