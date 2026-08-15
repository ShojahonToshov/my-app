import { apiClient } from "../client";
import type { RegisterData, UpdateProfileData } from "../../types";

class AuthService {
  // Get all users
  async getUsers(): Promise<Record<string, string>[]> {
    return (await apiClient.get("/users")) as unknown as Record<string, string>[];
  }

  // Registration
  async register(userData: RegisterData): Promise<Record<string, string>> {
    return (await apiClient.post("/users", userData)) as unknown as Record<string, string>;
  }

  // Profile update
  async updateProfile(userId: string, userData: UpdateProfileData): Promise<Record<string, string>> {
    return (await apiClient.put(`/users/${userId}`, userData)) as unknown as Record<string, string>;
  }
}

export default new AuthService();
