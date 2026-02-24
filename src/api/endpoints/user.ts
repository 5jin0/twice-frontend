/**
 * User API 엔드포인트
 */
import { apiClient } from "@/api/client";
import type { User } from "@/api/types/user";

const USER_BASE = "/users";

export const userApi = {
  getList: (params?: { page?: number; limit?: number }) => {
    const searchParams = params
      ? {
          ...(params.page != null && { page: String(params.page) }),
          ...(params.limit != null && { limit: String(params.limit) }),
        }
      : undefined;
    return apiClient.get<User[]>(USER_BASE, { params: searchParams });
  },

  getById: (id: string) =>
    apiClient.get<User>(`${USER_BASE}/${id}`),

  update: (id: string, data: Partial<User>) =>
    apiClient.patch<User>(`${USER_BASE}/${id}`, data),
};
