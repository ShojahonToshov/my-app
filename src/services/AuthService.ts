import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { RegisterData, UpdateProfileData } from "@/types";

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

  // Helper to fetch user profile from Supabase database
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
    
    if (data.user) {
      const profile = await this.fetchProfile(data.user.id);
      if (profile) {
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
    
    if (data.user) {
      let profile = null;
      for (let i = 0; i < 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: pData } = await this.supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (pData) {
          profile = pData;
          break;
        }
      }
      
      if (profile) {
        (data.user as AppUser).profile = profile;
      } else {
        (data.user as AppUser).profile = {
          id: data.user.id,
          role: (options?.data?.role as string) || 'admin',
          full_name: (options?.data?.full_name as string) || '',
        };
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

  // Profile update
  async updateProfile(userId: string, userData: UpdateProfileData): Promise<Record<string, unknown>> {
    const { data, error } = await this.supabase
      .from('profiles')
      .upsert({ id: userId, ...userData })
      .select()
      .single();

    if (error) throw error;
    
    if (userData.full_name) {
      await this.supabase.auth.updateUser({
        data: { full_name: userData.full_name }
      });
    }

    return data;
  }
}

export default new AuthService();
