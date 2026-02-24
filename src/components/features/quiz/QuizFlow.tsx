"use client";

import { useState } from "react";
import { quizApi } from "@/api";
import type { QuizFinishResponse } from "@/api";
import { getUserId } from "@/lib/auth";
import { Button, Input } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/error";

const QUIZ_ID = "quiz-1";

export function QuizFlow() {
  const userId = getUserId();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<QuizFinishResponse | null>(null);

  const handleStart = async () => {
    if (!userId) {
      setError("로그인 후 퀴즈를 시작할 수 있습니다.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await quizApi.start({ user_id: userId, quiz_id: QUIZ_ID });
      setSessionId(res.session_id);
    } catch (err) {
      setError(getApiErrorMessage(err, "퀴즈 시작에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    const numScore = Number(score);
    if (Number.isNaN(numScore) || numScore < 0 || numScore > 100) {
      setError("점수는 0~100 사이로 입력해 주세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await quizApi.finish({
        session_id: sessionId,
        score: numScore,
        improvement_rate: 0,
        evaluation: "Good",
      });
      setResult(res);
    } catch (err) {
      setError(getApiErrorMessage(err, "퀴즈 제출에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <p>
        퀴즈를 하려면 <a href="/login">로그인</a>해 주세요.
      </p>
    );
  }

  if (result) {
    return (
      <div>
        <p><strong>제출 완료</strong></p>
        <p>점수: {result.score} / 100</p>
        <p>완료 시각: {result.finished_at}</p>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div>
        <Button onClick={handleStart} loading={loading}>
          퀴즈 시작
        </Button>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleFinish}>
      <Input
        label="점수 (0~100)"
        type="number"
        min={0}
        max={100}
        value={score}
        onChange={(e) => setScore(e.target.value)}
        required
      />
      {error && <p className="error-message">{error}</p>}
      <Button type="submit" loading={loading}>
        제출
      </Button>
    </form>
  );
}
