"use client";

import { useEffect, useState } from "react";
import { aggregationApi, engagementApi } from "@/api";
import type { ParticipationRateResponse, Retention4WeeksResponse } from "@/api";
import { getUserId } from "@/lib/auth";
import { Card } from "@/components/ui";

export function DashboardStats() {
  const [participation, setParticipation] = useState<ParticipationRateResponse | null>(null);
  const [retention, setRetention] = useState<Retention4WeeksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = getUserId();

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        if (userId) {
          await engagementApi.access({ user_id: userId });
        }
        const [partRes, retRes] = await Promise.all([
          aggregationApi.getParticipationRate(),
          aggregationApi.getRetention4Weeks(),
        ]);
        setParticipation(partRes);
        setRetention(retRes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "집계를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) return <p>집계 로딩 중...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <Card title="참여율" style={{ marginTop: "1rem" }}>
        {participation ? (
          <p>
            <strong>{participation.participation_rate.toFixed(1)}%</strong>
            <br />
            접속 {participation.total_accessed}명 / 퀴즈 완료 {participation.total_finished_quiz}명
          </p>
        ) : (
          <p>—</p>
        )}
      </Card>
      <Card title="4주 지속률" style={{ marginTop: "1rem" }}>
        {retention ? (
          <p>
            <strong>{retention.retention_4weeks.toFixed(1)}%</strong>
            <br />
            기준 {retention.baseline_count}명 / 유지 {retention.retained_count}명
          </p>
        ) : (
          <p>—</p>
        )}
      </Card>
    </>
  );
}
