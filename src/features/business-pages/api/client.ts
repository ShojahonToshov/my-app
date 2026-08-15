import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response and error interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Return data payload directly
    return response.data;
  },
  (error) => {
    // Centralized error logging
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);
