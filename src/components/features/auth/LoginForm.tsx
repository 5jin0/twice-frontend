"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi, kakaoApi } from "@/api";
import type { LoginFormState } from "@/types";
import { getApiErrorMessage } from "@/lib/error";
import { setTokens, setKakaoUserFromId } from "@/lib/auth";
import type { KakaoLoginMessage } from "@/types";
import { Button, Input } from "@/components/ui";

const KAKAO_POPUP_NAME = "kakaoLogin";
const KAKAO_POPUP_OPTIONS = "width=500,height=600,scrollbars=yes";

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [kakaoLoading, setKakaoLoading] = useState(false);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as KakaoLoginMessage | undefined;
      if (data?.type !== "kakao-login") return;
      setKakaoLoading(false);
      if ("error" in data && data.error) {
        setError(data.error);
        return;
      }
      if ("access_token" in data && data.access_token) {
        setTokens(data.access_token, data.refresh_token);
        if (data.user_id) setKakaoUserFromId(data.user_id);
        router.push("/dashboard");
        router.refresh();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [router]);

  const handleKakaoLogin = async () => {
    setKakaoLoading(true);
    setError("");
    try {
      let auth_url: string;
      try {
        const res = await kakaoApi.getOAuthLink();
        auth_url = res.auth_url;
      } catch (firstErr) {
        const msg = getApiErrorMessage(firstErr, "");
        if (msg.includes("404") || msg.includes("연결할 수 없습니다")) {
          setError(msg);
          setKakaoLoading(false);
          return;
        }
        const rootRes = await kakaoApi.getOAuthLinkFromRoot();
        auth_url = rootRes.auth_url;
      }
      const popup = window.open(auth_url, KAKAO_POPUP_NAME, KAKAO_POPUP_OPTIONS);
      const tid = setInterval(() => {
        if (popup?.closed) {
          clearInterval(tid);
          setKakaoLoading(false);
        }
      }, 300);
      setTimeout(() => clearInterval(tid), 5 * 60 * 1000);
    } catch (err) {
      setError(getApiErrorMessage(err, "카카오 로그인 링크를 불러오지 못했습니다."));
      setKakaoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.login(form);
      setTokens(data.accessToken, data.refreshToken);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "로그인에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-group">
        <Button
          type="button"
          variant="secondary"
          loading={kakaoLoading}
          onClick={handleKakaoLogin}
          style={{ width: "100%" }}
        >
          카카오로 로그인
        </Button>
      </div>
      <hr style={{ margin: "1rem 0", borderColor: "var(--border)" }} />
      <form onSubmit={handleSubmit}>
        <Input
          label="이메일"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
          autoComplete="email"
        />
        <Input
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
          autoComplete="current-password"
        />
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" loading={loading}>
          로그인
        </Button>
      </form>
    </>
  );
}
