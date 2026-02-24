# twice-frontend

Next.js 14 + TypeScript 기반 프론트엔드 (API 분리 구조).

## 폴더 구조

```
src/
├── api/                    # API 레이어 (분리 구조)
│   ├── client.ts           # HTTP 클라이언트 (fetch, base URL, 공통 헤더)
│   ├── endpoints/          # 도메인별 API 엔드포인트
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── index.ts
│   ├── types/              # API 요청/응답 타입
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── index.ts
│   └── index.ts            # API 진입점 (client, endpoints, types export)
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # 재사용 UI 컴포넌트
│   └── common/              # 공통 레이아웃/공통 컴포넌트
├── hooks/                  # 커스텀 훅 (API 연동 예: useUser)
├── lib/                    # 유틸, 상수 등
└── types/                  # 앱 전역 타입 (API 타입 제외)
```

## 실행

```bash
npm install
cp .env.example .env   # 필요 시 API URL 수정
npm run dev
```

## API 사용 예시

```ts
import { authApi, userApi } from "@/api";

// 로그인
const res = await authApi.login({ email, password });

// 사용자 목록
const users = await userApi.getList({ page: 1, limit: 10 });
```
