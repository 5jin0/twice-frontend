/**
 * API 공통 타입 (에러, 응답 래퍼 등)
 */
export interface ApiErrorResponse {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface AxiosErrorBody {
  response?: {
    status: number;
    data?: ApiErrorResponse;
  };
}
