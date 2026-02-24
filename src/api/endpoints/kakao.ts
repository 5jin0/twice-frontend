/**
 * Kakao OAuth API 엔드포인트
 */
import { apiClient } from "@/api/client";
import type {
  KakaoOAuthLinkResponse,
  KakaoTokenResponse,
} from "@/api/types/kakao";

const BASE = "/kakao-authentication";
const BASE_URL = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000")
  : "http://localhost:8000";

/** 토큰 요청 결과: 302면 redirectUrl, 200이면 data */
export type GetTokenResult =
  | { redirectUrl: string; data?: never }
  | { redirectUrl?: never; data: KakaoTokenResponse };

export const kakaoApi = {
  /** OAuth 인증 URL 발급 (로그인 버튼용) - auth_url로 이동 */
  getOAuthLink: () =>
    apiClient.get<KakaoOAuthLinkResponse>(BASE + "/request-oauth-link"),

  /** 루트 경로도 동일 응답 */
  getOAuthLinkFromRoot: () =>
    apiClient.get<KakaoOAuthLinkResponse>("/"),

  /**
   * 인가 코드로 토큰·사용자 정보 (리다이렉트 후 code로 호출).
   * 브라우저는 302를 자동으로 따라가므로 fetch(redirect: 'manual')로 302를 받아 Location으로 이동.
   */
  getTokenAfterRedirect: async (code: string): Promise<GetTokenResult> => {
    const url = `${BASE_URL}${BASE}/request-access-token-after-redirection?${new URLSearchParams({ code }).toString()}`;
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      credentials: "omit",
      headers: { Accept: "application/json" },
    });

    if (res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400)) {
      const location = res.headers.get("Location");
      if (location) {
        const redirectUrl = location.startsWith("http") ? location : `${BASE_URL}${location}`;
        return { redirectUrl };
      }
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `HTTP ${res.status}`);
    }
    const data = (await res.json()) as KakaoTokenResponse;
    return { data };
  },
};
