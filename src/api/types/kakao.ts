/**
 * Kakao OAuth API 타입
 */

/** OAuth 링크 발급 응답 (로그인 버튼용) */
export interface KakaoOAuthLinkResponse {
  auth_url: string;
  client_id: string;
  redirect_uri: string;
  response_type: string;
}

/** 인가 코드로 토큰·사용자 정보 응답 (리다이렉트 후) */
export interface KakaoUser {
  id: number;
  nickname: string;
  email: string;
  profile_image_url: string;
}

export interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
  user: KakaoUser;
}
