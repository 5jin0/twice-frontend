"use client";

import { useState, useCallback } from "react";
import { userApi } from "@/api";
import type { User } from "@/api";

/**
 * 사용자 목록/단건 조회 훅 예시
 */
export function useUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async (params?: { page?: number; limit?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getList(params);
      setUsers(data);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error"));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getById(id);
      setUser(data);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown error"));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, user, loading, error, fetchUsers, fetchUserById };
}
