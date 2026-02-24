/**
 * MVP 시퀀스 API (접속 → 시작 → 완료 한 번에, 데모/테스트용)
 */
import { apiClient } from "@/api/client";
import type {
  MvpSequenceRequest,
  MvpSequenceResponse,
} from "@/api/types/mvp";

export const mvpApi = {
  /** 접속·시작·완료 3단계 한 번에 실행 */
  sequence: (body: MvpSequenceRequest) =>
    apiClient.post<MvpSequenceResponse>("/mvp/sequence", body),
};
