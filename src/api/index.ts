/**
 * API 레이어 진입점
 * - client, endpoints, types 한 곳에서 import
 */
export { apiClient } from "./client";
export type { RequestConfig } from "./client";
export {
  authApi,
  userApi,
  kakaoApi,
  engagementApi,
  quizApi,
  aggregationApi,
  mvpApi,
  healthApi,
} from "./endpoints";
export type {
  AuthLoginRequest,
  AuthLoginResponse,
  User,
  KakaoOAuthLinkResponse,
  KakaoTokenResponse,
  KakaoUser,
  EngagementAccessRequest,
  EngagementAccessResponse,
  QuizStartRequest,
  QuizStartResponse,
  QuizFinishRequest,
  QuizFinishResponse,
  ParticipationRateResponse,
  Retention4WeeksResponse,
  MvpSequenceRequest,
  MvpSequenceResponse,
  HealthResponse,
} from "./types";
