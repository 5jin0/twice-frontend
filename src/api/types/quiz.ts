/**
 * Quiz API 타입
 */

/** 퀴즈 시작 요청 */
export interface QuizStartRequest {
  user_id: string;
  quiz_id: string;
}

/** 퀴즈 시작 응답 */
export interface QuizStartResponse {
  session_id: string;
  user_id: string;
  quiz_id: string;
  state: string;
  started_at: string; // ISO 8601
}

/** 퀴즈 완료 요청 */
export interface QuizFinishRequest {
  session_id: string;
  score: number; // 0~100
  improvement_rate?: number;
  evaluation?: string;
}

/** 퀴즈 완료 응답 */
export interface QuizFinishResponse {
  session_id: string;
  user_id: string;
  quiz_id: string;
  state: string;
  started_at: string;
  finished_at: string;
  score: number;
  improvement_rate?: number;
  evaluation?: string;
}
