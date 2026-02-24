/**
 * 인증 관련 도메인 타입 (폼 상태, 세션 등)
 * - API 요청/응답 타입은 @/api/types/auth
 */
export interface LoginFormState {
  email: string;
  password: string;
}

/** 카카오 로그인 콜백(팝업) → 메인 창 postMessage 타입 */
export type KakaoLoginMessage =
  | { type: "kakao-login"; access_token: string; refresh_token?: string; user_id?: string }
  | { type: "kakao-login"; error: string };
