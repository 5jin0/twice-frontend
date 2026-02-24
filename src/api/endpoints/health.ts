/**
 * Health 등 공통 API 엔드포인트
 */
import { apiClient } from "@/api/client";
import type { HealthResponse } from "@/api/types/health";

export const healthApi = {
  /** 서버 상태 확인 */
  check: () => apiClient.get<HealthResponse>("/health"),
};
