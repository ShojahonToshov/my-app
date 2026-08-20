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

export class AuthService {
  constructor(private customer: any) {}

  private get supabase() {
    return this.customer;
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

  async login(identifier: string, password: string) {
    const isPhone = identifier.startsWith('+') || /^\d+$/.test(identifier.replace(/\D/g, ''));
    
    // Now that Phone Auth is enabled, we can authenticate directly with the phone number
    const { data, error } = await this.supabase.auth.signInWithPassword({ 
      ...(isPhone ? { phone: identifier } : { email: identifier }), 
      password 
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

  async signup(identifier: string, password: string, options?: { data?: Record<string, unknown> }) {
    const isPhone = identifier.startsWith('+') || /^\d+$/.test(identifier.replace(/\D/g, ''));
    
    const { data, error } = await this.supabase.auth.signUp({
      ...(isPhone ? { phone: identifier } : { email: identifier }),
      password,
      options: {
        data: {
          ...options?.data,
          visible_password: password
        }
      }
    });

    if (error) throw error;
    
    if (data.user) {
      (data.user as AppUser).profile = {
        id: data.user.id,
        role: (options?.data?.role as string) || 'admin',
        full_name: (options?.data?.full_name as string) || '',
      };
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
    const { password, ...profileData } = userData;
    let data = {};

    if (Object.keys(profileData).length > 0) {
      const { data: dbData, error } = await this.supabase
        .from('profiles')
        .upsert({ id: userId, ...profileData })
        .select()
        .single();

      if (error) throw error;
      data = dbData;
    }
    
    const authUpdates: Record<string, unknown> = {};
    if (profileData.full_name) authUpdates.data = { full_name: profileData.full_name };
    if (password) {
      authUpdates.password = password;
      authUpdates.data = { ...((authUpdates.data as Record<string, unknown>) || {}), visible_password: password };
    }

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await this.supabase.auth.updateUser(authUpdates);
      if (authError) throw authError;
    }

    return data;
  }
}
