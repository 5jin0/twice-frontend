/**
 * Aggregation (집계) API 타입
 */

/** 참여율 응답 */
export interface ParticipationRateResponse {
  participation_rate: number;
  total_accessed: number;
  total_finished_quiz: number;
}

/** 4주 지속률 응답 */
export interface Retention4WeeksResponse {
  retention_4weeks: number;
  baseline_count: number;
  retained_count: number;
}
