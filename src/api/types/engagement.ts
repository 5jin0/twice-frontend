/**
 * Engagement (서비스 접속) API 타입
 */

/** 서비스 접속 기록 요청 */
export interface EngagementAccessRequest {
  user_id: string;
}

/** 서비스 접속 기록 응답 */
export interface EngagementAccessResponse {
  user_id: string;
  accessed_at: string; // ISO 8601
  access_id: string;
}
