import type { AxiosErrorBody, ApiErrorResponse } from "@/types";

const DEFAULT_MESSAGE = "요청 처리 중 오류가 발생했습니다.";

/**
 * API 에러에서 사용자에게 보여줄 메시지 추출
 */
export function getApiErrorMessage(err: unknown, fallback = DEFAULT_MESSAGE): string {
  if (!err || typeof err !== "object") return fallback;
  const body = err as AxiosErrorBody;
  const data = body.response?.data as ApiErrorResponse | undefined;
  if (data?.message) return data.message;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first[0]) return first[0];
  }
  return fallback;
}
