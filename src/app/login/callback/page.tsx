"use client";

import { useLayoutEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { kakaoApi } from "@/api";
import { getApiErrorMessage } from "@/lib/error";
import { setTokens, setKakaoUser } from "@/lib/auth";
import type { KakaoUser } from "@/api/types/kakao";
import type { KakaoLoginMessage } from "@/types";
import { PageContainer } from "@/components/ui";

const isPopup = () => typeof window !== "undefined" && !!window.opener;

function setUserFromId(userId: string | null): void {
  if (!userId) return;
  const id = Number(userId);
  if (Number.isNaN(id)) return;
  setKakaoUser({
    id,
    nickname: "",
    email: "",
    profile_image_url: "",
  } as KakaoUser);
}

/**
 * 카카오 로그인 콜백 (체크리스트)
 * - 열리자마자 URL(query)에서 access_token, refresh_token, user_id, error 반드시 읽기.
 * - error 있으면: 에러 메시지만 표시, 로딩 돌리지 않기.
 * - 토큰 있으면: 저장 후 바로 /dashboard 이동. 추가 대기 없음.
 * - 팝업이면: 읽고 저장 → postMessage → window.close(). 부모는 메시지 받으면 저장 후 /dashboard.
 */
export default function LoginCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  useLayoutEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const userIdParam = searchParams.get("user_id");
    const errorParam = searchParams.get("error");
    const code = searchParams.get("code");

    // 1) error 쿼리 → 에러만 표시, 로딩 돌리지 않기
    if (errorParam) {
      if (isPopup() && window.opener) {
        window.opener.postMessage(
          { type: "kakao-login", error: errorParam } as KakaoLoginMessage,
          window.location.origin
        );
        window.close();
        return;
      }
      setStatus("error");
      setMessage(errorParam);
      return;
    }

    // 2) 토큰 있으면 저장 후 바로 이동 (추가 대기 없음)
    if (accessToken) {
      setTokens(accessToken, refreshToken ?? undefined);
      setUserFromId(userIdParam);
      if (isPopup() && window.opener) {
        window.opener.postMessage(
          {
            type: "kakao-login",
            access_token: accessToken,
            refresh_token: refreshToken ?? undefined,
            user_id: userIdParam ?? undefined,
          } as KakaoLoginMessage,
          window.location.origin
        );
        window.close();
        return;
      }
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    // 3) code만 있으면 API 호출 (이때만 로딩 표시)
    if (!code) {
      setStatus("error");
      setMessage("인가 코드 또는 토큰이 없습니다. 백엔드가 로그인 후 이 페이지로 리다이렉트해 주세요.");
      return;
    }

    setStatus("loading");
    let cancelled = false;
    kakaoApi
      .getTokenAfterRedirect(code)
      .then((result) => {
        if (cancelled) return;
        if ("redirectUrl" in result && result.redirectUrl) {
          window.location.href = result.redirectUrl;
          return;
        }
        const data = result.data;
        const userId = data.user ? String(data.user.id) : undefined;
        setTokens(data.access_token, data.refresh_token);
        if (data.user) setKakaoUser(data.user);
        if (isPopup() && window.opener) {
          window.opener.postMessage(
            {
              type: "kakao-login",
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              user_id: userId,
            } as KakaoLoginMessage,
            window.location.origin
          );
          window.close();
          return;
        }
        router.replace("/dashboard");
        router.refresh();
      })
      .catch((err) => {
        if (cancelled) return;
        const errMsg = getApiErrorMessage(err, "로그인 처리에 실패했습니다.");
        if (isPopup() && window.opener) {
          window.opener.postMessage(
            { type: "kakao-login", error: errMsg } as KakaoLoginMessage,
            window.location.origin
          );
          window.close();
          return;
        }
        setStatus("error");
        setMessage(errMsg);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, router]);

  return (
    <PageContainer narrow>
      <h1>로그인 콜백</h1>
      {status === "error" && (
        <>
          <p className="error-message">{message}</p>
          <a href="/login" style={{ display: "inline-block", marginTop: "1rem" }}>
            로그인 페이지로
          </a>
        </>
      )}
      {status === "loading" && <p>잠시만 기다려 주세요.</p>}
    </PageContainer>
  );
}
