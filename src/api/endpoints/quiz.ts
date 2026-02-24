/**
 * Quiz API 엔드포인트
 */
import { apiClient } from "@/api/client";
import type {
  QuizStartRequest,
  QuizStartResponse,
  QuizFinishRequest,
  QuizFinishResponse,
} from "@/api/types/quiz";

const BASE = "/quiz";

export const quizApi = {
  /** 퀴즈 시작 - 응답 session_id를 완료 API에 전달 */
  start: (body: QuizStartRequest) =>
    apiClient.post<QuizStartResponse>(`${BASE}/start`, body),

  /** 퀴즈 완료 (점수 저장) */
  finish: (body: QuizFinishRequest) =>
    apiClient.post<QuizFinishResponse>(`${BASE}/finish`, body),
};
