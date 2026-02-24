/**
 * Engagement (서비스 접속) API 엔드포인트
 */
import { apiClient } from "@/api/client";
import type {
  EngagementAccessRequest,
  EngagementAccessResponse,
} from "@/api/types/engagement";

const BASE = "/engagement";

export const engagementApi = {
  /** 서비스 접속 기록 (앱/페이지 진입 시 1회 호출) */
  access: (body: EngagementAccessRequest) =>
    apiClient.post<EngagementAccessResponse>(`${BASE}/access`, body),
};
