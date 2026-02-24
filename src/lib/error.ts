import type { AxiosErrorBody } from "@/types";

const DEFAULT_MESSAGE = "요청을 처리하지 못했습니다.";

/**
 * API 에러에서 사용자에게 보여줄 메시지 추출
 */
export function getApiErrorMessage(
  err: unknown,
  defaultMessage: string = DEFAULT_MESSAGE
): string {
  if (!err || typeof err !== "object") return defaultMessage;
  const body = err as AxiosErrorBody & { message?: string };
  const serverMessage = body.response?.data?.message;
  if (typeof serverMessage === "string") return serverMessage;
  const status = body.response?.status;
  if (status === 404) return "해당 API를 찾을 수 없습니다(404). 백엔드 경로를 확인해 주세요.";
  if (status && status >= 500) return `서버 오류(${status})입니다. 백엔드 로그를 확인해 주세요.`;
  if (body.message === "Network Error" || body.code === "ERR_NETWORK") {
    return "백엔드에 연결할 수 없습니다. 백엔드가 실행 중인지, 주소가 맞는지(.env의 NEXT_PUBLIC_API_BASE_URL) 확인해 주세요.";
  }
  if (typeof body.message === "string") return body.message;
  return defaultMessage;
}
