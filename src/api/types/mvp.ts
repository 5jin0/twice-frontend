/**
 * MVP 시퀀스 API 타입 (접속 → 시작 → 완료 한 번에)
 */

/** MVP 시퀀스 요청 */
export interface MvpSequenceRequest {
  user_id: string;
  quiz_id?: string; // 기본 "quiz-1"
  score?: number; // 기본 80
  improvement_rate?: number;
  evaluation?: string;
}

/** MVP 시퀀스 응답 - 3단계 결과 */
export interface MvpSequenceResponse {
  step1_access: {
    user_id: string;
    accessed_at: string;
    access_id: string;
  };
  step2_start: {
    session_id: string;
    user_id: string;
    quiz_id: string;
    state: string;
    started_at: string;
  };
  step4_5_6_finish: {
    session_id: string;
    user_id: string;
    state: string;
    score: number;
    finished_at: string;
    [key: string]: unknown;
  };
}
