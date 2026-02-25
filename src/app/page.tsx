"use client";

import { useState, useEffect, useRef } from "react";
import {
  recordVisit,
  startQuiz,
  completeQuiz,
  abandonQuiz,
  getQuizHistory,
  getParticipation,
  getRetention4w,
  getSnapshots,
  type DifficultyLevel,
  type QuizHistoryItem,
  type SnapshotItem,
  type SnapshotMetricType,
} from "@/lib/api";

const USER_ID_KEY = "oh_userId";
const QUIZ_COMPLETED_KEY = "oh_quiz_completed";

type Phase = "LOGIN" | "QUIZ" | "HOME";

export default function DashboardPage() {
  const [phase, setPhase] = useState<Phase>("LOGIN");
  const [userId, setUserIdState] = useState("");
  const [visitStatus, setVisitStatus] = useState<"idle" | "loading" | "recorded" | "error">("idle");
  const [visitError, setVisitError] = useState("");
  const visitRecordedThisLoad = useRef(false);

  const [quizId, setQuizId] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>("LOW");
  const [startLoading, setStartLoading] = useState(false);
  const [startResult, setStartResult] = useState<{ attemptId: string; startedAt: string } | null>(null);
  const [startError, setStartError] = useState("");

  const [completeScore, setCompleteScore] = useState("");
  const [completeLoading, setCompleteLoading] = useState(false);
  const [completeError, setCompleteError] = useState("");
  const [leaveLoading, setLeaveLoading] = useState(false);

  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState<QuizHistoryItem[] | null>(null);
  const [historyError, setHistoryError] = useState("");

  const [partFrom, setPartFrom] = useState("");
  const [partTo, setPartTo] = useState("");
  const [partLoading, setPartLoading] = useState(false);
  const [partData, setPartData] = useState<{
    finishedUsers: number;
    targetUsers: number;
    participationRate: number;
  } | null>(null);
  const [partError, setPartError] = useState("");

  const [anchorDate, setAnchorDate] = useState("");
  const [retLoading, setRetLoading] = useState(false);
  const [retData, setRetData] = useState<{
    retainedUsers: number;
    totalUsers: number;
    retentionRate: number;
  } | null>(null);
  const [retError, setRetError] = useState("");

  const [snapshotMetricType, setSnapshotMetricType] = useState<SnapshotMetricType>("ALL");
  const [snapLoading, setSnapLoading] = useState(false);
  const [snapshots, setSnapshots] = useState<SnapshotItem[] | null>(null);
  const [snapError, setSnapError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  type HomeNav = "quiz" | "history" | "analytics";
  const [homeNav, setHomeNav] = useState<HomeNav>("quiz");

  const setUserId = (value: string) => {
    setUserIdState(value);
    if (value) localStorage.setItem(USER_ID_KEY, value);
    else localStorage.removeItem(USER_ID_KEY);
  };

  useEffect(() => {
    const stored = localStorage.getItem(USER_ID_KEY);
    const quizDone = localStorage.getItem(QUIZ_COMPLETED_KEY) === "true";
    if (stored) setUserIdState(stored);
    if (stored && quizDone) setPhase("HOME");
    else if (stored) setPhase("QUIZ");
    else setPhase("LOGIN");
  }, []);

  useEffect(() => {
    if (!userId || visitRecordedThisLoad.current) return;
    visitRecordedThisLoad.current = true;
    setVisitStatus("loading");
    setVisitError("");
    recordVisit(userId).then((res) => {
      if (res.error) {
        setVisitStatus("error");
        setVisitError(res.error);
      } else {
        setVisitStatus("recorded");
      }
    });
  }, [userId]);

  const handleStartQuiz = async () => {
    if (!userId.trim()) {
      setStartError("Set userId first.");
      return;
    }
    if (!quizId.trim()) {
      setStartError("Enter quizId.");
      return;
    }
    setStartLoading(true);
    setStartError("");
    setStartResult(null);
    const res = await startQuiz(userId.trim(), quizId.trim(), difficultyLevel);
    setStartLoading(false);
    if (res.error) setStartError(res.error);
    else if (res.data) setStartResult(res.data);
  };

  const handleCompleteQuiz = async () => {
    const attemptId = startResult?.attemptId;
    if (!attemptId) {
      setCompleteError("Start a quiz first to get attemptId.");
      return;
    }
    const scoreNum = Number(completeScore);
    if (Number.isNaN(scoreNum) || scoreNum < 0) {
      setCompleteError("Enter a valid score (number >= 0).");
      return;
    }
    setCompleteLoading(true);
    setCompleteError("");
    const res = await completeQuiz(userId.trim(), attemptId, scoreNum);
    setCompleteLoading(false);
    if (res.error) setCompleteError(res.error);
    else {
      setCompleteScore("");
      localStorage.setItem(QUIZ_COMPLETED_KEY, "true");
      setPhase("HOME");
    }
  };

  const handleLogin = async () => {
    if (!userId.trim()) return;
    setLoginLoading(true);
    const res = await getQuizHistory(userId.trim());
    setLoginLoading(false);
    if (res.error) setPhase("QUIZ");
    else if (res.data && res.data.length > 0) setPhase("HOME");
    else setPhase("QUIZ");
  };

  const handleLoadHistory = async () => {
    if (!userId.trim()) {
      setHistoryError("Set userId first.");
      return;
    }
    setHistoryLoading(true);
    setHistoryError("");
    setHistory(null);
    const res = await getQuizHistory(userId.trim());
    setHistoryLoading(false);
    if (res.error) setHistoryError(res.error);
    else if (res.data) setHistory(res.data);
  };

  const handleFetchParticipation = async () => {
    if (!partFrom || !partTo) {
      setPartError("Set both from and to dates.");
      return;
    }
    setPartLoading(true);
    setPartError("");
    setPartData(null);
    const res = await getParticipation(partFrom, partTo);
    setPartLoading(false);
    if (res.error) setPartError(res.error);
    else if (res.data) setPartData(res.data);
  };

  const handleFetchRetention = async () => {
    if (!anchorDate) {
      setRetError("Set anchor date.");
      return;
    }
    setRetLoading(true);
    setRetError("");
    setRetData(null);
    const res = await getRetention4w(anchorDate);
    setRetLoading(false);
    if (res.error) setRetError(res.error);
    else if (res.data) setRetData(res.data);
  };

  const handleFetchSnapshots = async () => {
    setSnapLoading(true);
    setSnapError("");
    setSnapshots(null);
    const res = await getSnapshots(snapshotMetricType);
    setSnapLoading(false);
    if (res.error) setSnapError(res.error);
    else if (res.data) setSnapshots(res.data);
  };

  const handleLeave = async () => {
    const attemptId = startResult?.attemptId;
    if (attemptId && userId.trim()) {
      setLeaveLoading(true);
      const res = await abandonQuiz(userId.trim(), attemptId);
      setLeaveLoading(false);
      if (!res.error) {
        localStorage.setItem(QUIZ_COMPLETED_KEY, "true");
        setPhase("HOME");
      }
    } else {
      localStorage.setItem(QUIZ_COMPLETED_KEY, "true");
      setPhase("HOME");
    }
  };

  const handleRetryQuiz = () => {
    setStartResult(null);
    setStartError("");
    setCompleteError("");
    setCompleteScore("");
    setPhase("QUIZ");
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>DOOZZON Q</h1>
      {phase === "HOME" && (
        <p style={{ margin: "0 0 16px" }}>
          <button type="button" onClick={handleRetryQuiz}>
            퀴즈 다시 도전
          </button>
        </p>
      )}

      {(phase === "QUIZ" || phase === "HOME") && (
        <>
          <header style={headerStyle}>
            <button
              type="button"
              onClick={() => phase === "HOME" && setHomeNav("quiz")}
              style={{ ...headerNavButtonStyle, fontWeight: phase === "QUIZ" || homeNav === "quiz" ? 600 : 400 }}
            >
              Quiz
            </button>
            <span style={{ margin: "0 8px", color: "#999" }}>|</span>
            <button
              type="button"
              onClick={() => {
                setPhase("HOME");
                setHomeNav("history");
              }}
              style={{ ...headerNavButtonStyle, fontWeight: homeNav === "history" ? 600 : 400 }}
            >
              Quiz 이력 조회
            </button>
            <span style={{ margin: "0 8px", color: "#999" }}>|</span>
            <button
              type="button"
              onClick={() => {
                setPhase("HOME");
                setHomeNav("analytics");
              }}
              style={{ ...headerNavButtonStyle, fontWeight: homeNav === "analytics" ? 600 : 400 }}
            >
              Analytics
            </button>
          </header>
        </>
      )}

      {phase === "LOGIN" && (
      <>
      {/* User Setup */}
      <section style={sectionStyle}>
        <h2>User 로그인</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ padding: 6, width: 200 }}
          />
          <button type="button" onClick={handleLogin} disabled={loginLoading}>
            {loginLoading ? "확인 중…" : "로그인"}
          </button>
        </div>
        <p style={{ margin: "8px 0 0", color: "#666", fontSize: 12 }}>
          Stored in localStorage on change. Used for visit and quiz.
        </p>
      </section>
      </>
      )}

      {phase === "QUIZ" && (
      <>
      {/* Quiz */}
      <section style={sectionStyle}>
        <h2>Quiz</h2>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>Start Quiz</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              placeholder="quizId"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              style={{ padding: 6, width: 120 }}
            />
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value as DifficultyLevel)}
              style={{ padding: 6 }}
            >
              <option value="LOW">LOW</option>
              <option value="MID">MID</option>
              <option value="HIGH">HIGH</option>
            </select>
            <button type="button" onClick={handleStartQuiz} disabled={startLoading}>
              {startLoading ? "Starting…" : "Start"}
            </button>
          </div>
          {startError && <p style={{ color: "red", margin: "8px 0 0" }}>{startError}</p>}
          {startResult && (
            <p style={{ margin: "8px 0 0", color: "green" }}>
              attemptId: {startResult.attemptId}, startedAt: {startResult.startedAt}
            </p>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>Complete Quiz</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <input
              type="number"
              placeholder="score"
              value={completeScore}
              onChange={(e) => setCompleteScore(e.target.value)}
              min={0}
              style={{ padding: 6, width: 80 }}
            />
            <button type="button" onClick={handleCompleteQuiz} disabled={completeLoading}>
              {completeLoading ? "Completing…" : "Complete"}
            </button>
          </div>
          {completeError && <p style={{ color: "red", margin: "8px 0 0" }}>{completeError}</p>}
        </div>
      </section>
      </>
      )}

      {phase === "HOME" && (
      <>
      {homeNav === "quiz" && (
      <section style={sectionStyle}>
        <h2>Quiz</h2>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>Start Quiz</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              placeholder="quizId"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              style={{ padding: 6, width: 120 }}
            />
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value as DifficultyLevel)}
              style={{ padding: 6 }}
            >
              <option value="LOW">LOW</option>
              <option value="MID">MID</option>
              <option value="HIGH">HIGH</option>
            </select>
            <button type="button" onClick={handleStartQuiz} disabled={startLoading}>
              {startLoading ? "Starting…" : "Start"}
            </button>
          </div>
          {startError && <p style={{ color: "red", margin: "8px 0 0" }}>{startError}</p>}
          {startResult && (
            <p style={{ margin: "8px 0 0", color: "green" }}>
              attemptId: {startResult.attemptId}, startedAt: {startResult.startedAt}
            </p>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>Complete Quiz</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <input
              type="number"
              placeholder="score"
              value={completeScore}
              onChange={(e) => setCompleteScore(e.target.value)}
              min={0}
              style={{ padding: 6, width: 80 }}
            />
            <button type="button" onClick={handleCompleteQuiz} disabled={completeLoading}>
              {completeLoading ? "Completing…" : "Complete"}
            </button>
          </div>
          {completeError && <p style={{ color: "red", margin: "8px 0 0" }}>{completeError}</p>}
        </div>
      </section>
      )}

      {homeNav === "history" && (
      <section style={sectionStyle}>
        <h2>Quiz 이력 조회</h2>
        <button type="button" onClick={handleLoadHistory} disabled={historyLoading}>
          {historyLoading ? "Loading…" : "Load history"}
        </button>
        {historyError && <p style={{ color: "red", margin: "8px 0 0" }}>{historyError}</p>}
        {history && (
          <table style={{ marginTop: 12, width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                <th style={thStyle}>startedAt</th>
                <th style={thStyle}>quizId</th>
                <th style={thStyle}>difficultyLevel</th>
                <th style={thStyle}>score</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 8 }}>No records.</td></tr>
              ) : (
                history.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={tdStyle}>{row.startedAt}</td>
                    <td style={tdStyle}>{row.quizId}</td>
                    <td style={tdStyle}>{row.difficultyLevel}</td>
                    <td style={tdStyle}>{row.score ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
      )}

      {homeNav === "analytics" && (
      <>
      <section style={sectionStyle}>
        <h2>Analytics</h2>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>Participation</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <input
              type="date"
              value={partFrom}
              onChange={(e) => setPartFrom(e.target.value)}
              style={{ padding: 6 }}
            />
            <input
              type="date"
              value={partTo}
              onChange={(e) => setPartTo(e.target.value)}
              style={{ padding: 6 }}
            />
            <button type="button" onClick={handleFetchParticipation} disabled={partLoading}>
              {partLoading ? "Fetching…" : "Fetch participation"}
            </button>
          </div>
          {partError && <p style={{ color: "red", margin: "8px 0 0" }}>{partError}</p>}
          {partData && (
            <p style={{ margin: "8px 0 0" }}>
              finishedUsers: {partData.finishedUsers}, targetUsers: {partData.targetUsers},
              participationRate: {partData.participationRate}
            </p>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>Retention 4w</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <input
              type="date"
              value={anchorDate}
              onChange={(e) => setAnchorDate(e.target.value)}
              style={{ padding: 6 }}
            />
            <button type="button" onClick={handleFetchRetention} disabled={retLoading}>
              {retLoading ? "Fetching…" : "Fetch retention"}
            </button>
          </div>
          {retError && <p style={{ color: "red", margin: "8px 0 0" }}>{retError}</p>}
          {retData && (
            <p style={{ margin: "8px 0 0" }}>
              retainedUsers: {retData.retainedUsers}, totalUsers: {retData.totalUsers},
              retentionRate: {retData.retentionRate}
            </p>
          )}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2>Snapshots</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <select
            value={snapshotMetricType}
            onChange={(e) => setSnapshotMetricType(e.target.value as SnapshotMetricType)}
            style={{ padding: 6 }}
          >
            <option value="PARTICIPATION">PARTICIPATION</option>
            <option value="RETENTION_4W">RETENTION_4W</option>
            <option value="ALL">ALL</option>
          </select>
          <button type="button" onClick={handleFetchSnapshots} disabled={snapLoading}>
            {snapLoading ? "Fetching…" : "Fetch snapshots"}
          </button>
        </div>
        {snapError && <p style={{ color: "red", margin: "0 0 8px" }}>{snapError}</p>}
        {snapshots && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                <th style={thStyle}>createdAt</th>
                <th style={thStyle}>metricType</th>
                <th style={thStyle}>numerator</th>
                <th style={thStyle}>denominator</th>
                <th style={thStyle}>rate</th>
                <th style={thStyle}>period / anchor</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 8 }}>No snapshots.</td></tr>
              ) : (
                snapshots.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={tdStyle}>{row.createdAt}</td>
                    <td style={tdStyle}>{row.metricType}</td>
                    <td style={tdStyle}>{row.numerator}</td>
                    <td style={tdStyle}>{row.denominator}</td>
                    <td style={tdStyle}>{row.rate}</td>
                    <td style={tdStyle}>{row.period ?? row.anchor ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
      </>
      )}
      </>
      )}
    </main>
  );
}

const headerStyle: React.CSSProperties = {
  padding: "12px 0",
  marginBottom: 8,
  borderBottom: "1px solid #e0e0e0",
};

const headerNavButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  color: "#0066cc",
  cursor: "pointer",
  fontSize: 14,
};

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  marginBottom: 16,
  borderRadius: 8,
  border: "1px solid #e0e0e0",
};

const thStyle: React.CSSProperties = { padding: "8px 6px", fontSize: 12 };
const tdStyle: React.CSSProperties = { padding: "8px 6px", fontSize: 13 };
