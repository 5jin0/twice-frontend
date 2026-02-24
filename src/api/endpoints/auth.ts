/**
 * Auth API 엔드포인트
 */
import { apiClient } from "@/api/client";
import type { AuthLoginRequest, AuthLoginResponse } from "@/api/types/auth";

const AUTH_BASE = "/auth";

export const authApi = {
  login: (data: AuthLoginRequest) =>
    apiClient.post<AuthLoginResponse>(`${AUTH_BASE}/login`, data),

  logout: () =>
    apiClient.post<void>(`${AUTH_BASE}/logout`),

  refresh: () =>
    apiClient.post<AuthLoginResponse>(`${AUTH_BASE}/refresh`),

  me: () =>
    apiClient.get<AuthLoginResponse>(`${AUTH_BASE}/me`),
};
