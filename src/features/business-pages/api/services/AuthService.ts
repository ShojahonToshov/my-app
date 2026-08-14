import { apiClient } from "../client";
import type { RegisterData, UpdateProfileData } from "../../types";

class AuthService {
  // Получить всех пользователей (заглушка вместо нормального логина)
  async getUsers(): Promise<Record<string, string>[]> {
    return (await apiClient.get("/users")) as unknown as Record<string, string>[];
  }

  // Регистрация
  async register(userData: RegisterData): Promise<Record<string, string>> {
    return (await apiClient.post("/users", userData)) as unknown as Record<string, string>;
  }

  // Обновление профиля
  async updateProfile(userId: string, userData: UpdateProfileData): Promise<Record<string, string>> {
    return (await apiClient.put(`/users/${userId}`, userData)) as unknown as Record<string, string>;
  }
}

export default new AuthService();
