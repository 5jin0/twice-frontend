/**
 * 클라이언트 인증 유틸 (토큰·카카오 사용자 저장/조회)
 * - SSR 시 window 없음 처리
 */
import type { KakaoUser } from "@/api/types/kakao";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const KAKAO_USER_KEY = "kakaoUser";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/** 카카오 로그인 후 사용자 저장 (engagement/quiz 등에서 user_id로 사용) */
export function setKakaoUser(user: KakaoUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KAKAO_USER_KEY, JSON.stringify(user));
}

export function getKakaoUser(): KakaoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KAKAO_USER_KEY);
    return raw ? (JSON.parse(raw) as KakaoUser) : null;
  } catch {
    return null;
  }
}

export function clearKakaoUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KAKAO_USER_KEY);
}

/** user_id만 있을 때 저장 (postMessage 등에서 사용) */
export function setKakaoUserFromId(userId: string): void {
  const id = Number(userId);
  if (Number.isNaN(id)) return;
  setKakaoUser({
    id,
    nickname: "",
    email: "",
    profile_image_url: "",
  } as KakaoUser);
}

/** engagement/quiz API용 수강생 ID (문자열) */
export function getUserId(): string | null {
  const user = getKakaoUser();
  return user ? String(user.id) : null;
}
