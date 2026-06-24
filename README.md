# 김팀장의 AI 경영도구 백화점 / AI Business Lab

실무에 바로 쓰는 AI 경영도구를 한 곳에서 골라 쓰는 큐레이션 웹사이트입니다.
기획·전략, 마케팅·세일즈, 운영·자동화 등 카테고리별로 현장에서 검증된 AI 도구를 소개합니다.

## 기술 스택

- [Vite](https://vite.dev/) — 빌드 도구 / 개발 서버
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite` 플러그인)

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
├── index.html            # 앱 진입 HTML
├── public/               # 정적 에셋
├── src/
│   ├── main.tsx          # React 진입점
│   ├── App.tsx           # 랜딩 페이지
│   └── index.css         # Tailwind 엔트리
├── vite.config.ts        # Vite + Tailwind 설정
└── tsconfig*.json        # TypeScript 설정
```

## 라이선스

내부 프로젝트 — 별도 명시 전까지 무단 배포를 금합니다.
