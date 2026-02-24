import axios, { type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, clearTokens } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request: JWT 토큰 자동 첨부
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: 401 시 인증 정리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearTokens();
      // 필요 시: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
