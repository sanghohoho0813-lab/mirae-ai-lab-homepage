# 벤처인증 + MVP 소개 영상 (릴스 9:16) 원본

기술사업·MVP 페이지(`/business-services/venture-mvp`) 세 번째 구간 영상의 원본입니다.
대표님 녹음(`assets/voice.mp3`)에 맞춰 [HyperFrames](https://github.com/heygen-com/hyperframes)로 만들었습니다.

- 결과물: `public/business/venture-mvp/mvp-reel.mp4`(H.264 + AAC) · `mvp-reel.webm`(VP9 + Opus) · `mvp-reel-poster.webp`
  — 1080×1920(9:16), 약 115초, 목소리 + 자막
- 인스타그램 릴스에 그대로 올릴 수 있게 자막은 아래쪽 버튼·설명에 가리지 않는 높이(아래에서 420px 위)에 둡니다.

## 파일

| 파일 | 내용 |
|---|---|
| `spoken.txt` | 실제 녹음에서 말한 문장(= 자막). 빈 줄로 장면(12개)을 나누고, `\|` 로 자막을 직접 끊을 수 있어요 |
| `keys.json` | 장면 안 강조 타이밍에 쓰는 핵심 단어(예: "법인세" 나올 때 혜택 카드) |
| `asr.json` | 녹음 받아쓰기(단어별 시간) — faster-whisper medium |
| `align.py` | `asr.json` ↔ `spoken.txt` 글자 단위 정렬 → `timing.json`(문장·자막·핵심 단어 시간) |
| `build.mjs` | `timing.json` → `index.html`(컴포지션) · `subtitles.srt` |

## 다시 만들기

```bash
# 녹음을 새로 받았다면: 받아쓰기부터 (pip install faster-whisper)
python3 asr.py .                               # asr.json
python3 align.py . spoken.txt keys.json       # timing.json
node build.mjs                                 # index.html · subtitles.srt
npx --yes hyperframes@0.8.79 snapshot --at 5,30,60,90 --no-end
npx --yes hyperframes@0.8.79 render --fps 30 --quality high -o renders/reel-video.mp4
# 목소리 합치기 + 웹용
ffmpeg -i renders/reel-video.mp4 -i assets/voice.mp3 -map 0:v -map 1:a -c:v libx264 -preset slow -crf 24 -profile:v high -pix_fmt yuv420p -g 60 -c:a aac -b:a 128k -movflags +faststart -af apad -shortest mvp-reel.mp4
ffmpeg -i renders/reel-video.mp4 -i assets/voice.mp3 -map 0:v -map 1:a -c:v libvpx-vp9 -b:v 0 -crf 38 -deadline good -cpu-used 4 -row-mt 1 -g 60 -c:a libopus -b:a 96k -af apad -shortest mvp-reel.webm
```

글꼴은 Pretendard WOFF2(subset)를 씁니다 — OTF 원본을 여러 개 넣으면 HyperFrames 미리보기가 멈춥니다.

## 지켜야 할 것

- 화면은 미래AI랩 **자체 데모**입니다. 고객사 사례처럼 보이게 바꾸지 않습니다.
- 벤처기업확인서는 공식 문서를 따라 그리지 않은 **예시 그림**입니다("예시 그림" 표기 유지).
- AX 정책자금 우대는 **공식 근거(중소벤처기업부 2026 정책자금 · AX 스프린트 우대트랙)** 상자로 따로 보여 주고, 데모 화면과 섞지 않습니다.
- 확인 여부는 확인기관 심사 · 세제·자금·가점은 요건 충족 시 · 2주는 목표 일정 — 안내 문구를 지우지 않습니다.
