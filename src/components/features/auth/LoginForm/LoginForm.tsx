"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api";
import { Button, Input } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/utils";

const LOGIN_ERROR_FALLBACK = "로그인에 실패했습니다.";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      if (typeof window !== "undefined" && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, LOGIN_ERROR_FALLBACK));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        name="email"
        label="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        type="password"
        name="password"
        label="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      {error && <p className="error-message" role="alert">{error}</p>}
      <Button type="submit" loading={loading}>
        로그인
      </Button>
    </form>
  );
}
