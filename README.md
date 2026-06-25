# AI Business Lab — 업무 자동화 LAB

**AI 도구를 직접 만드는 경영 컨설턴트, 김팀장**

컨설턴트를 위한 실무형 AI 업무도구를 만듭니다. 법인컨설팅, 정책자금, 고용지원금, 기업인증,
절세, 고객관리 업무에서 반복되는 판단·계산·안내·제안 과정을 AI 도구로 바꾸는 컨설턴트용
도구 쇼룸 웹사이트입니다.

## 다루는 활용분야

정책자금 · 고용지원금 · 기업인증 · 연구소 관리 · 세무·절세 · 자본거래 · 고객관리·영업 · 업무자동화

## 기술 스택

- [Vite](https://vite.dev/) — 빌드 도구 / 개발 서버
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite` 플러그인)
- [Pretendard](https://github.com/orioncactus/pretendard) — 본문 한글 웹폰트

## 시작하기

사전 요구사항: **Node.js 18+** (권장 20+) 및 npm

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행 (http://localhost:5173)
npm run dev

# 3. 프로덕션 빌드 (dist/ 생성)
npm run build

# 4. 빌드 결과 미리보기
npm run preview
```

## 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버를 실행합니다. |
| `npm run build` | 타입 체크 후 프로덕션 빌드를 생성합니다. |
| `npm run lint` | TypeScript 타입 검사를 수행합니다. |
| `npm run preview` | 빌드된 결과물을 로컬에서 미리봅니다. |

## 프로젝트 구조

```
ai-business-lab/
├── api/
│   └── inquiry.ts        # 문의 폼 → Resend 이메일 전송 (Vercel Serverless / Node)
├── index.html            # 앱 진입 HTML (메타·폰트 포함)
├── public/
│   └── thumbnails/       # 도구 카드 썸네일 (실서비스 캡처 .png / 대시보드 미리보기 .svg)
├── scripts/
│   └── gen-thumbnails.mjs # 대시보드 미리보기 SVG 생성기
├── src/
│   ├── main.tsx          # React 진입점
│   ├── App.tsx           # 랜딩 페이지 (히어로 · 소개 · 대상 · 도구 · 개발중 · 전자책 · 문의)
│   ├── components/
│   │   ├── HeroSlider.tsx   # 히어로 자동 슬라이드 미리보기
│   │   └── InquiryForm.tsx  # 업무 자동화 제작 문의 폼
│   ├── data/
│   │   └── tools.ts      # 도구·개발중 도구 데이터, 상태 배지, KPI 자동 계산
│   └── index.css         # Tailwind 엔트리 · 폰트 토큰 · 애니메이션
├── .env.example          # 문의 폼 이메일 전송용 환경변수 예시
├── vite.config.ts        # Vite + Tailwind 설정
└── tsconfig*.json        # TypeScript 설정
```

## 문의 폼 메일 발송 설정 방법

문의 폼은 `POST /api/inquiry` (Vercel Serverless Function, Node 런타임)로 전송되어
[Resend](https://resend.com) SDK로 메일을 발송합니다. 메일 제목은 `[AI Business Lab 문의] {이름}`
형식입니다.

### 1) Resend 가입 & API Key 발급
1. <https://resend.com> 에 가입합니다.
2. 좌측 **API Keys → Create API Key** 로 키를 발급합니다. (`re_...`)
3. (선택) 본인 도메인을 쓰려면 **Domains** 에서 도메인을 인증합니다.
   인증 전에는 기본 발신주소 `onboarding@resend.dev` 를 그대로 사용하면 됩니다.

### 2) 로컬 `.env` 설정
`.env.example` 을 복사해 `.env` 를 만들고 값을 채웁니다.

```bash
cp .env.example .env
```

| 환경변수 | 필수 | 설명 |
| --- | --- | --- |
| `RESEND_API_KEY` | ✅ | Resend API 키. 없으면 서버가 500을 반환하고 폼은 안내 메시지로 폴백됩니다. |
| `INQUIRY_TO_EMAIL` | ⬜ | 받는 주소 (기본값 `sanghohoho0813@gmail.com`) |
| `INQUIRY_FROM_EMAIL` | ⬜ | 보내는 주소 (기본값 `AI Business Lab <onboarding@resend.dev>`) |

> 로컬 `npm run dev` 에는 서버리스 함수(`/api`)가 동작하지 않습니다. 실제 발송 테스트는
> `vercel dev` 또는 Vercel 배포 환경에서 가능합니다.

### 3) Vercel 환경변수 설정
Vercel 프로젝트 → **Settings → Environment Variables** 에 아래 3개를 등록합니다.
(Production / Preview 모두 체크 권장)

```
RESEND_API_KEY        = re_xxxxxxxxxxxxxxxx
INQUIRY_TO_EMAIL      = sanghohoho0813@gmail.com
INQUIRY_FROM_EMAIL    = AI Business Lab <onboarding@resend.dev>
```

### 4) 재배포 (중요)
환경변수는 **저장만으로는 적용되지 않습니다.** Vercel → **Deployments → 최신 배포 → Redeploy**
로 반드시 재배포해야 새 환경변수가 함수에 반영됩니다.

### 5) 테스트
1. 배포된 사이트의 `#inquiry` 폼에서 필수값(이름·연락처·반복 업무·문의 내용)을 채워 제출합니다.
2. `sanghohoho0813@gmail.com` 수신함을 확인합니다. (처음엔 스팸함도 확인)
3. 실패 시 Vercel → **Functions/Logs** 에서 `[inquiry]` 로그로 원인을 확인합니다.
   (키 누락 / Resend 오류 등)

## 커스터마이징 메모

- 도구/개발중 도구 목록과 상태(`status`, `subStatus`, `isPublic` 등)는 `src/data/tools.ts`에서
  관리합니다. 운영 현황 KPI는 이 배열의 상태값을 기준으로 자동 계산됩니다.
- 도구 카드 썸네일은 `public/thumbnails/<id>.(png|svg)` 입니다. 로그인/게이트 화면 대신
  대시보드 미리보기를 보여주는 3개 도구는 `scripts/gen-thumbnails.mjs`로 생성한 SVG를 사용합니다
  (`node scripts/gen-thumbnails.mjs`로 재생성). 실제 대시보드 캡처가 생기면 같은 경로로 교체하세요.
  비공개 도구(`isPublic: false`)는 잠금 표시로 렌더링됩니다.
- 전자책(`#resources`) 표지 이미지(`public/ebook-cover.png`)와 버튼은 외부 판매 페이지
  (`futureailab.crekit.io/l/deals/zy3n6rjd`)로 새 탭 연결됩니다.

## 라이선스

내부 프로젝트 — 별도 명시 전까지 무단 배포를 금합니다.
