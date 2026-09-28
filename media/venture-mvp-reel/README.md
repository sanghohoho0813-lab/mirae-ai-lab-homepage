# 벤처인증 + MVP 소개 영상 (릴스 9:16) 원본

기술사업·MVP 페이지(`/business-services/venture-mvp`) 세 번째 구간 영상의 원본입니다.
대표님 녹음(`assets/voice.mp3`)에 맞춰 [HyperFrames](https://github.com/heygen-com/hyperframes)로 만들었습니다.

- 결과물: `public/business/venture-mvp/mvp-reel.mp4`(H.264 + AAC) · `mvp-reel.webm`(VP9 + Opus) · `mvp-reel-poster.webp`
  — 1080×1920(9:16), 약 97초(목소리 91초 + 샘플 22개 마무리 5초), 목소리 + 자막
- 녹음 원본(113.8초)의 긴 쉼을 줄이고(`tighten.py`: 문장 안 0.2초 · 문장 사이 0.26초 · 장면 사이 0.38초) 1.05배로 빠르게 했어요.
- 인스타그램 릴스에 그대로 올릴 수 있게 자막은 아래쪽 버튼·설명에 가리지 않는 높이(아래에서 420px 위)에 둡니다.

## 파일

| 파일 | 내용 |
|---|---|
| `spoken.txt` | 실제 녹음에서 말한 문장(= 자막). 빈 줄로 장면(12개)을 나누고, `\|` 로 자막을 직접 끊을 수 있어요 |
| `keys.json` | 장면 안 강조 타이밍에 쓰는 핵심 단어(예: "법인세" 나올 때 혜택 카드) |
| `asr.json` | 녹음 받아쓰기(단어별 시간) — faster-whisper medium |
| `align.py` | `asr.json` ↔ `spoken.txt` 글자 단위 정렬 → `timing.json`(문장·자막·핵심 단어 시간) |
| `tighten.py` | 쉼 줄이기 + 1.05배 → `assets/voice-fast.wav`, 같은 규칙으로 단어 시간을 옮긴 `asr-fast.json` |
| `build.mjs` | `timing.json` → `index.html`(컴포지션) · `subtitles.srt` · `ticks.json`(마지막 22개 화면 시간) |
| `ticks.py` | 22개 화면이 뜰 때의 작은 '틱' 소리 → `assets/ticks.wav` |

장면별 샘플: 2) 로컬맘 폰 · 4) ExpertMatch 클릭 · 7) EduPlaza MVP → 에듀마스터 학원 AX, PawBeauty MVP → LUMIÈRE 헤어숍 AX ·
9) 로컬맘 클릭 → 미용실·회계 사무소·옷가게 폰 3대 · 마지막) 샘플 22개(MVP 10 + AX 12)

## 다시 만들기

```bash
# 녹음을 새로 받았다면: 받아쓰기부터 (pip install faster-whisper)
python3 asr.py .                                          # asr.json
python3 align.py . spoken.txt keys.json && cp timing.json timing-orig.json  # 원본 기준(쉼 종류 판단에 씀)
python3 tighten.py . ffmpeg                               # voice-fast.wav · asr-fast.json
ASR=asr-fast.json python3 align.py . spoken.txt keys.json # 빨라진 목소리 기준 timing.json
node build.mjs                                            # index.html · subtitles.srt · ticks.json (TOTAL 출력)
npx --yes hyperframes@0.8.79 snapshot --at 5,30,60,90 --no-end
npx --yes hyperframes@0.8.79 render --fps 30 --quality high -o renders/reel-video.mp4
python3 ticks.py . <TOTAL>                                # ticks.wav
ffmpeg -i assets/voice-fast.wav -i assets/ticks.wav -filter_complex "[0:a]apad[v];[v][1:a]amix=inputs=2:duration=shortest:dropout_transition=0,volume=2[a]" -map "[a]" assets/final-audio.wav
# 영상 + 소리 → 웹용
ffmpeg -i renders/reel-video.mp4 -i assets/final-audio.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 24 -profile:v high -pix_fmt yuv420p -g 60 -c:a aac -b:a 128k -shortest -movflags +faststart mvp-reel.mp4
ffmpeg -i renders/reel-video.mp4 -i assets/final-audio.wav -map 0:v -map 1:a -c:v libvpx-vp9 -b:v 0 -crf 38 -deadline good -cpu-used 4 -row-mt 1 -g 60 -c:a libopus -b:a 96k -shortest mvp-reel.webm
```

글꼴은 Pretendard WOFF2(subset)를 씁니다 — OTF 원본을 여러 개 넣으면 HyperFrames 미리보기가 멈춥니다.

## 지켜야 할 것

- 화면은 미래AI랩 **자체 데모**입니다. 고객사 사례처럼 보이게 바꾸지 않습니다.
- 벤처기업확인서는 공식 문서를 따라 그리지 않은 **예시 그림**입니다("예시 그림" 표기 유지).
- AX 정책자금 우대는 **공식 근거(중소벤처기업부 2026 정책자금 · AX 스프린트 우대트랙)** 상자로 따로 보여 주고, 데모 화면과 섞지 않습니다.
- 확인 여부는 확인기관 심사 · 세제·자금·가점은 요건 충족 시 · 2주는 목표 일정 — 안내 문구를 지우지 않습니다.
