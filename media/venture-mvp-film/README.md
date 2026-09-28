# 2주 기술사업 빌드 — 1분 소개 영상 원본

> **지금 페이지에는 쓰지 않아요.** 목소리를 넣은 릴스(9:16) 판 `media/venture-mvp-reel/`로 바뀌었어요.
> 이 폴더는 첫 판(4:5, 76초, 자막만)의 원본과 v2 대본(`script-v2.md`)을 보관해요.

기술사업·MVP 페이지(`/business-services/venture-mvp`) 세 번째 구간에 들어가는 영상의 원본입니다.
[HyperFrames](https://github.com/heygen-com/hyperframes)(HTML → 영상)로 만들었습니다.

- 결과물(당시): `mvp-film.mp4`(H.264) · `mvp-film.webm`(VP9) — 지금은 public 에서 뺐어요
  — 1080×1350(4:5), 76초, 소리 없음·자막 포함
- 포스터: `public/business/venture-mvp/mvp-film-poster.webp` — 자막 없이 뽑은 52초 장면(영상 컨트롤과 자막이 겹치지 않게)

## 파일

| 파일 | 내용 |
|---|---|
| `story.mjs` | **여기만 고치면 됩니다.** 장면 순서·길이, 데모 6개 문구, 자막(=녹음 대본) |
| `build.mjs` | `story.mjs` → `index.html`(컴포지션) · `subtitles.srt` · `script.md` 생성 |
| `script.md` | 녹음용 대본(시간표) — 목소리를 입힐 때 이 시간에 맞춰 읽으면 자막과 맞습니다 |
| `subtitles.srt` | 자막 파일(편집 프로그램에 불러오기용) |
| `assets/shots/` | 자체 데모 10종 실제 화면 캡처(PC·모바일·클릭 후 화면) |

## 다시 만들기

```bash
node build.mjs                                   # story.mjs 를 고친 뒤
npx --yes hyperframes@0.8.79 snapshot --at 3,20,50   # 장면 몇 개 미리 보기
npx --yes hyperframes@0.8.79 render --fps 30 --quality high -o renders/mvp-full.mp4
# 웹용으로 줄이기 (용량·빠른 시작)
ffmpeg -i renders/mvp-full.mp4 -c:v libx264 -preset slow -crf 25 -profile:v high -pix_fmt yuv420p -g 60 -movflags +faststart -an mvp-film.mp4
ffmpeg -i renders/mvp-full.mp4 -c:v libvpx-vp9 -b:v 0 -crf 38 -deadline good -cpu-used 4 -row-mt 1 -g 60 -an mvp-film.webm
# 포스터: index.html 의 </style> 앞에 `.sub { display: none !important; }` 를 넣은 사본으로
npx --yes hyperframes@0.8.79 snapshot --at 52.2 --no-end   # → 720px 폭 WebP 로 저장
```

FFmpeg 와 Chrome 이 필요합니다(`npx hyperframes doctor` 로 확인).
글꼴은 Pretendard WOFF2(subset)를 씁니다 — OTF 원본을 여러 개 넣으면 HyperFrames 미리보기가 멈춥니다.

## 지켜야 할 것

- 화면은 미래AI랩 **자체 데모**입니다. 고객사 사례처럼 보이게 바꾸지 않습니다(마지막 장면·벽 장면 안내 문구 유지).
- '벤처인증까지'처럼 인증을 약속하는 말은 쓰지 않습니다. 확인기관 심사 안내 문구를 지우지 않습니다.
- 가격은 페이지와 같아야 합니다(정상가 500만원 → 런칭 파트너 300만원 · 선착순 5개사).
