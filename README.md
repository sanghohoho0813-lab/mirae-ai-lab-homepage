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
├── index.html            # 앱 진입 HTML (메타·폰트 포함)
├── public/               # 정적 에셋
├── src/
│   ├── main.tsx          # React 진입점
│   ├── App.tsx           # 랜딩 페이지 (히어로 · 활용분야 · 도구 · 제작철학 · 문의)
│   └── index.css         # Tailwind 엔트리 · 폰트 토큰
├── vite.config.ts        # Vite + Tailwind 설정
└── tsconfig*.json        # TypeScript 설정
```

## 커스터마이징 메모

- 활용분야·도구 목록은 `src/App.tsx` 상단의 `fields`, `tools` 배열에서 관리합니다.
- 문의 CTA 버튼은 현재 `mailto:` 플레이스홀더입니다. `src/App.tsx`의 문의 섹션에서
  실제 이메일 또는 문의 폼 주소로 교체하세요.

## 라이선스

내부 프로젝트 — 별도 명시 전까지 무단 배포를 금합니다.
