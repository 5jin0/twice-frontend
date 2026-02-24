/**
 * Aggregation (집계) API 엔드포인트
 */
import { apiClient } from "@/api/client";
import type {
  ParticipationRateResponse,
  Retention4WeeksResponse,
} from "@/api/types/aggregation";

const BASE = "/aggregation";

export const aggregationApi = {
  /** 참여율 (대시보드용) */
  getParticipationRate: () =>
    apiClient.get<ParticipationRateResponse>(`${BASE}/participation-rate`),

  /** 4주 지속률 (대시보드용) */
  getRetention4Weeks: () =>
    apiClient.get<Retention4WeeksResponse>(`${BASE}/retention-4weeks`),
};
