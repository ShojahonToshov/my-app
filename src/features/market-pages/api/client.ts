import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors Р Т‘Р В»РЎРЏ Р С•Р В±РЎР‚Р В°Р В±Р С•РЎвЂљР С”Р С‘ Р С•РЎвЂљР Р†Р ВµРЎвЂљР С•Р Р† Р С‘ Р С•РЎв‚¬Р С‘Р В±Р С•Р С”
apiClient.interceptors.response.use(
  (response) => {
    // Р вЂ™Р С•Р В·Р Р†РЎР‚Р В°РЎвЂ°Р В°Р ВµР С  РЎРѓРЎР‚Р В°Р В·РЎС“ data, РЎвЂЎРЎвЂљР С•Р В±РЎвЂ№ Р Р…Р Вµ Р С—Р С‘РЎРѓР В°РЎвЂљРЎРЉ Р Р†Р ВµР В·Р Т‘Р Вµ res.data
    return response.data;
  },
  (error) => {
    // Р В¦Р ВµР Р…РЎвЂљРЎР‚Р В°Р В»Р С‘Р В·Р С•Р Р†Р В°Р Р…Р Р…Р В°РЎРЏ Р С•Р В±РЎР‚Р В°Р В±Р С•РЎвЂљР С”Р В° Р С•РЎв‚¬Р С‘Р В±Р С•Р С”
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);
