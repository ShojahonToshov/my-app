import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors for response and error handling
apiClient.interceptors.response.use(
  (response) => {
    // Return data directly to avoid unpacking res.data in every service call
    return response.data;
  },
  (error) => {
    // Centralized API error logging
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);
