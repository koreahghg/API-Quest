# API Quest 🗺️

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Zustand](https://img.shields.io/badge/Zustand-5-brown)](https://github.com/pmndrs/zustand)
[![MSW](https://img.shields.io/badge/MSW-2-orange)](https://mswjs.io)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?logo=vitest)](https://vitest.dev)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://vercel.com)

> 인터랙티브 API 학습 플랫폼

Postman은 API를 *호출*하는 도구다. API Quest는 API를 *이해*하는 도구다.

401이 왜 뜨는지, CORS가 무엇인지, 400과 422의 차이가 뭔지 — 문서를 읽는 게 아니라 **직접 실패하고 설명을 읽으면서** 깨닫게 만든다.

---

## 주요 기능

### 🛠️ API Playground
- HTTP 메서드 선택 (GET / POST / PUT / DELETE / PATCH)
- URL 직접 입력 — Enter 키로 즉시 전송
- 요청 헤더 편집기 (key-value, 활성화 토글)
- 요청 바디 편집기 (JSON, GET/DELETE 시 자동 비활성화)
- 응답 뷰어 (상태코드 색상 표시, 헤더, 바디, 응답 시간)
- cURL 내보내기 — 클립보드 복사 한 번에

### 📖 상태코드 힌트 시스템
응답이 오는 순간 한국어 설명이 자동으로 표시된다.
- **무엇이 잘못됐는지** (explanation)
- **흔히 하는 실수** (commonMistakes)
- **다음 시도 방향** (nextSteps)

`200`, `201`, `400`, `401`, `403`, `404`, `405`, `409`, `422`, `429`, `500`, `502`, `503` + `CORS` / `Network` / `Parse` 에러 모두 커버.

### 🗺️ 퀘스트 시스템
단계적 미션을 완수하면서 HTTP를 체득한다.

| 시나리오 | 난이도 | 미션 수 | 다루는 내용 |
|---|---|---|---|
| HTTP 기초 | Beginner | 5 | GET, POST, DELETE, 404 경험 |
| 인증 마스터 | Intermediate | 3 | 401, 400, Bearer 토큰 |
| 인증과 권한의 벽 | Advanced | 6 | 401, 403, 500, 지연 응답 |

미션마다 성공 조건이 자동 채점된다 (메서드, 상태코드, 응답 바디 필드 존재 등).

### 🔐 환경 변수
`{{BASE_URL}}`, `{{TOKEN}}` 같은 변수를 URL과 헤더 값에 사용할 수 있다.

### 📋 요청 히스토리
보낸 요청이 자동으로 저장되어 이전 시도를 다시 불러올 수 있다.

### 🧪 MSW 기반 목 API
외부 네트워크 없이도 동작한다. `api.quest` 도메인의 모든 엔드포인트는 MSW로 인터셉트되어 로컬에서 응답을 돌려준다.

---

## 기술 스택

| 분류 | 기술 | 선택 이유 |
|---|---|---|
| Framework | Next.js 15 (App Router) | 서버 컴포넌트 + 클라이언트 상태 분리 실험 |
| Language | TypeScript 5 | 타입 안전한 API 응답 처리, 조건 시스템 설계 |
| Styling | Tailwind CSS v3 | 빠른 프로토타이핑, 다크 테마 일관성 |
| State | Zustand v5 | 도메인별 스토어 분리 (request / response / scenario / evaluation / ui / history / env) |
| API 모킹 | MSW v2 | Service Worker 기반, 실제 fetch를 인터셉트하므로 앱 코드 변경 없음 |
| Testing | Vitest + Testing Library | 스토어 단위 테스트, 핸들러 시나리오 검증 |
| Deployment | Vercel | MSW 비활성화 환경변수로 프로덕션 전환 |

---

## 빠른 시작

```bash
git clone https://github.com/koreahghg/API-Quest.git
cd API-Quest
npm install
npm run dev
```

`http://localhost:3000` 열면 바로 시작된다.

> 개발 모드에서는 MSW가 자동으로 활성화되어 모든 API 요청이 로컬에서 처리된다.

### 테스트 실행

```bash
npm run test        # watch 모드
npm run test:run    # 단발 실행
npm run test:ui     # Vitest UI (브라우저)
npm run test:coverage
```

---

## 학습 포인트

이 프로젝트를 코드로 읽으면 얻어갈 수 있는 것들:

**MSW v2 + Next.js 15 통합**
Service Worker 초기화 타이밍 문제(`MSWProvider`)와 프로덕션 비활성화 처리 방식.

**Zustand 도메인 분리 설계**
하나의 거대한 스토어 대신 7개의 도메인 스토어로 분리하고 필요한 곳에서만 구독.

**조건 기반 채점 시스템**
`conditions: [{ type: 'status_equals', target: 'status', expected: 200 }, ...]` 형태로 선언적으로 미션 성공 조건을 정의하고, 응답이 오면 자동 평가.

**환경 변수 인터폴레이션**
`{{TOKEN}}` → 실제 값 치환을 URL, 헤더 값 모두에 적용하는 간단한 파싱 유틸.

**prop drilling 없는 UI 패널 상태 관리**
`uiStore`로 패널 열림/닫힘을 전역 관리, ESC 키 닫기까지 `PanelOverlay`로 추상화.

