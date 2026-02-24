/**
 * 공통 타입 (API와 무관한 도메인/UI 타입)
 */
export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
