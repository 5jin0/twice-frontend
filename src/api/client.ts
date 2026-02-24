/**
 * API HTTP Client
 * - axios 인스턴스(lib/api) 기반, 응답 data만 반환
 */
import api from "@/lib/api";
import type { AxiosRequestConfig } from "axios";

export type RequestConfig = Omit<AxiosRequestConfig, "url" | "method">;

function withData<T>(config?: RequestConfig) {
  return (response: { data: T }) => response.data;
}

export const apiClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    api.get<T>(endpoint, config).then(withData<T>()),

  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    api.post<T>(endpoint, body, config).then(withData<T>()),

  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    api.put<T>(endpoint, body, config).then(withData<T>()),

  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    api.patch<T>(endpoint, body, config).then(withData<T>()),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    api.delete<T>(endpoint, config).then(withData<T>()),
};
