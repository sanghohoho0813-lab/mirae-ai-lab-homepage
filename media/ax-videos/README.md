# AX 영상 1·2 (릴스 9:16, 녹음 맞춤) 원본

대표님이 직접 녹음·컷 편집한 목소리에 맞춰 [HyperFrames](https://github.com/heygen-com/hyperframes) 로 만든 두 편입니다.

| 폴더 | 제목 | 길이 | 속도 |
|---|---|---|---|
| `video-1/` | 영상 1 · AX가 뭐고, 왜 필요한가 — **v3** | 약 4분 27초(말 4분 24초 + 끝 화면 3초) | 1.1배 |
| `video-2/` | 영상 2 · 어떻게 진행하고, 얼마가 드나 — **v3** | 약 4분 11초(말 4분 8초 + 끝 화면 3초) | 1.08배 |
| `consultant/` | 컨설턴트 운영 OS 소개(MIRAE AI LAB OS) — 자막 전용 | 약 2분 36초(자막 153초 + 끝 화면 3초) | 읽는 속도 초당 7.5자 |

## 컨설턴트 운영 OS 소개 영상(`consultant/`)

목소리 없이 자막 중심으로 만든 컨설턴트용 영상. 영상 1·2와 같은 고급 모드·9:16·한 화면 4~5초(33장면)·중요한 말 뒤 1.5초 멈춤.
대본·장면표는 `consultant/script.md`.

- 녹음이 없으므로 `synth.py` 가 `spoken.txt` 를 읽는 속도로 나눠 `timing.json` · `asr-fast.json`(단어 시간) · `sil-fast.json`(쉼)을 만든다.
  그다음은 영상 1·2와 똑같이 `node build.mjs` → 렌더. 멈춤 자리는 `edits.json` 의 `gapBefore`.
- 화면은 `/consultants` 페이지의 예시 화면(오늘 화면·고객사 카드, 가상 데이터)을 캡처해 자른 것(`assets/cs/`)과 실제 도구 화면(크레탑 분석기·창업감면 판정기).
- 정식 출시 전이라 속도·성과 숫자, 가격, 무료 체험, 이용 후기는 넣지 않는다. 화면에는 '예시 화면 · 가상 데이터'.

```bash
cd consultant && python3 synth.py && node build.mjs
npx --yes hyperframes@0.8.79 render --fps 30 --quality high -o renders/consultant.mp4
```

## v3 — 샘플 화면 교체 · 영상 2 비용 순서 변경

디자인·비율·속도·장면 수는 v2 그대로 두고 필요한 부분만 바꿨다(v2 장면표는 각 폴더 `build-v2.mjs`).

**영상 1** — 고운솥 식당·반려동물 폰 화면을 **13 CLEANWAY(시설관리·현장 서비스)** · **18 LIVARTÉ(인테리어)** 로 바꿨다.

| 장면 | 말 | 화면 |
|---|---|---|
| 계획 → 실제 화면 | 실제로 무언가를 보여 줘야 되는 시대 | LIVARTÉ 무료 견적 상담(`lvcu`) |
| 고객 플랫폼 ↔ 회사 안 운영 | 고객이 직접 쓰는 플랫폼 | CLEANWAY 고객 관리현황(`cwcare`) |
| 대표님 폰 한 화면 | 직원·고객·재고·정산을 한 화면에 | LIVARTÉ AX 대시보드(`lvax`) |
| 고객이 직접 | 직접 견적·주문·예약 | LIVARTÉ 견적 상담 흐름(`lvcu`) |
| 안과 밖 연결 | AI가 데이터를 읽고 다음 할 일까지 | CLEANWAY 고객 화면 + AI 운영 브리핑 → AI Operations Center(`cwcare`·`cwax`) |
| 성장선 | 앞으로 어떻게 성장할 예정인지 | LIVARTÉ 고객 플랫폼(PC) |
| 심사장 | 이미 돌아가는 화면 · 직접 눌러 보시게 | LIVARTÉ AI Project Center · AI 스타일 찾기(`lvax`·`lvstyle`) |
| 닫기 심사장 | 이번엔 말 대신 화면을 | CLEANWAY AI 오늘의 운영 브리핑(`cwax`) |

'음식점부터 학원·제조·유통까지' 업종을 넘기는 장면(9.1)과 20개+ 샘플 벽에는 업종 대표 화면으로 음식점 샘플이 잠깐 그대로 나온다.

**영상 2** — 샘플 화면은 네 가지만: **18 LIVARTÉ(인테리어)** · **15 오토브릿지(자동차 정비)** · **20 MATERIX(건축자재 유통)** · **11 세움(제조)**.
대표님 폰 수치 = MATERIX 대시보드 + 오토브릿지 AX 대시보드, AI 판단 근거 = 세움, 더 밀고·막고 = LIVARTÉ AI Project Center(Opportunity·Risk),
고객·거래처가 직접 = 오토브릿지 정비 예약 + MATERIX 자재 찾기, 밖에서 보기에도 = 네 샘플 부채꼴, 심사장 = MATERIX AI Distribution Center.

**영상 2 비용 순서** — 가격 바로 뒤에 '부담되면 뒤로·후불'이 오도록 녹음 조각 순서를 옮겼다(다시 녹음하지 않음).

1. 비용 → MVP 500 · 플랫폼형 1,500 · 풀 패키지 3,000만 원부터(가격 뒤 프리즈는 뺐다)
2. 다만 자금 흐름이 부담되시면 정산 시점을 자금이 들어온 뒤로
3. 1년 동안 최소 5번 이상 신청 · 착수금만 내시면 개발비는 후불로도 → 프리즈 '개발비 후불 가능'
4. 처음에 MVP나 플랫폼형으로 시작해 한 단계씩
5. 풀 패키지 2주 기본 틀 · 유지보수 1년 무상 → 프리즈 '유지보수 1년 무상'
6. 이 금액은 컨설팅과 개발 비용, 진행 정도에 따라 정산 + **반짝이는 안내 '후불로 진행하기로 한 경우에는 후불로 정산합니다'**(읽을 틈 1.5초)
7. 그리고 정책자금과 지원사업 신청까지 … (그대로)

`video-2/reorder.py` 가 `assets/voice-orig.mp3`(대표님 원본 녹음)를 문장 사이 쉼 한가운데에서 잘라 순서만 바꿔 `assets/voice.mp3` 를 만들고,
받아쓰기 단어 시간(`asr-orig.json` → `asr.json`)도 같은 규칙으로 옮긴다. 이음매는 모두 쉼 속이라 끊김이 없다.
`tighten.py` 는 넓힌 쉼 안에 통째로 찍힌 짧은 단어('이 금액은' 의 '이')를 쉼 끝으로 옮기도록 고쳤다(자막이 프리즈 중에 먼저 뜨지 않게).

## 영상 1 v2(고급판) — 대표님 피드백 반영

v1 은 자막 조각마다(평균 2.5초) 화면이 바뀌어 정신없다는 의견을 받아 다시 만들었다(`video-1/build.mjs`, v1 은 `build-v1.mjs`).

- **화면은 4~6초에 한 번**(58장면, 평균 4.6초). 한 화면 안에서는 말에 맞춰 카드·글자·숫자가 차분히 하나씩 쌓인다.
- **고급 모드**(`createBuild(..., { premium: true })` + `lib/kit3.mjs`): 먹색 배경 + 샴페인 골드 한 가지 포인트,
  반투명 유리 카드·가는 선 아이콘, 전환은 페이드·블러·아래서 걷히기(번쩍임·튀는 움직임 없음), 카메라는 아주 느리게.
  프리즈도 흑백·흐림 위에 골드 가는 선으로 문구만 조용히 띄운다.

## 영상 2 v2(고급판)

영상 1 v2 와 같은 톤. 대표님 요청대로 **화면 전환을 영상 1보다 약 15% 느리게**(47장면, 평균 5.3초) 했고(`video-2/build.mjs`, v1 은 `build-v1.mjs`),
AX 화면은 고운솥 식당·반려동물 샘플 대신 다른 샘플을 새로 찍어 썼다(`assets/flows/`, `flow.mjs` 로 모바일 캡처):

- 세움정밀(제조 AX) 대시보드·AI 판단 근거 `seum-*` · 세움 거래처 포털 견적 요청 → 접수 완료 `seumportal-*`
- 벨로아(뷰티 커머스 AX) Growth SKU·AI 브리핑 `veloa-*` · 루미에르(헤어숍 AX) AI 운영 브리핑·캠페인 `lumiere-*` · 에듀마스터(학원 AX) `edumax-*`
- 단계마다 'STEP n / 4' 머리(네 칸 막대), 가격은 카드 3장이 말에 맞춰 차례로, '한 단계씩 올라가도' 는 계단 위 점이 올라간다.

## 만드는 방식(v1 기준)

- **자막 조각마다 화면이 바뀐다.** 한 샷 평균 2.5초(영상 1: 105샷, 영상 2: 94샷). 샷마다 들어오는 방식(밀기·확대·와이프·번쩍)과 느린 카메라 움직임이 다르다.
- **글자는 핵심어만.** 나머지는 그림·숫자(올라가며 세기)·실제 데모 폰 화면(눌러 가는 흐름)으로 보여 준다.
- **프리즈(1~1.3초):** 중요한 말 뒤 쉼에서 화면을 흑백·흐림으로 멈추고 한 줄로 강조한다.
  - 영상 1: 여기서 갈립니다 · 보여 줄 게 없다 · 사례 250건 가까이 분석 · 15억 원 보증·금융지원 · 다음 단계가 보이는 회사
  - 영상 2(v3): 2주 안에 MVP·기본 틀 · 먼저 도입한 회사가 유리(+샘플에서 직접 눌러 보세요) · 개발비 후불 가능 · 유지보수 1년 무상
- 쉼: 쉼표 0.2초 · 문장 0.35초 · 장면 0.45초(기술사업·MVP 1분 42초 영상과 같다). 훅이 끝나면 제목 카드.
- 장이 바뀔 때 왼쪽 위에 장 이름(② 문제 · 심사장 …)이 잠깐 뜬다.

## 자막 = 실제 목소리

`spoken-script.txt` 는 대본 원문, `spoken.txt` 는 **녹음에서 실제로 말한 대로 고친 자막**이다(받아쓰기로 대조).
영상 2 녹음에는 같은 안내(정책자금·지원사업 신청 + 수수료)가 두 번 들어 있어 앞의 한 번을 뺐다(`edits.json` 의 `drop`).

## 파일

| 파일 | 내용 |
|---|---|
| `lib/lib.mjs` | 샷 틀(전환·카메라)·자막·프리즈·단어 시간 찾기 |
| `lib/kit3.mjs` | 고급 모드 스타일·부품(유리 카드, 골드 머리말, 바뀌는 큰 글자, 제목 카드) |
| `lib/kit.mjs` · `lib/kit2.mjs` | 샷 부품(큰 글자·타일·도장·숫자·폰 흐름·브라우저·심사장·그래프·단계·가격 카드·진단 버튼 등) |
| `assets/` | 두 영상이 함께 쓰는 폰트·로고·데모 화면(`shots`, `flows`) — 각 영상 `assets/` 에 심볼릭 링크 |
| `video-N/assets/voice.mp3` | 대표님 녹음(컷 편집본). 영상 2는 `voice-orig.mp3` 가 원본, `voice.mp3` 는 `reorder.py` 로 만든다 |
| `video-N/spoken.txt` | 자막(빈 줄 = 장면, `\|` = 자막 끊는 곳) |
| `video-N/edits.json` | 프리즈용 쉼(`gapBefore`, 줄인 뒤 초) · 뺄 문장(`drop`) |
| `video-N/build.mjs` | 장면표(v3) — 자막 조각마다 어떤 샷을 쓸지. `build-v2.mjs`·`build-v1.mjs` 는 이전 판 |
| `video-2/reorder.py` | 영상 2 녹음 조각 순서 바꾸기(비용 구간) |

## 다시 만들기

```bash
cd video-1                      # video-2 는 SPEED=1.08, 먼저 python3 reorder.py ffmpeg (voice-orig.mp3 → voice.mp3 · asr-orig.json → asr.json)
python3 asr.py .                # 받아쓰기 → asr.json (faster-whisper)
python3 align.py . spoken.txt keys.json && cp timing.json timing-orig.json
SPEED=1.1 python3 tighten.py . ffmpeg          # 쉼 정리·배속 → assets/voice-fast.wav, asr-fast.json, sil-fast.json
ASR=asr-fast.json python3 align.py . spoken.txt keys.json
node build.mjs                  # → index.html, subtitles.srt
npx --yes hyperframes@0.8.79 render --fps 30 --quality high -o renders/video.mp4
# 목소리 합치기(고화질): libx264 CRF 18 · AAC 192k 48kHz
ffmpeg -i renders/video.mp4 -i assets/voice-fast.wav -filter_complex "[1:a]apad[a]" -map 0:v -map "[a]" -t <길이> \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart out.mp4
```

## 지켜야 할 것

- 사례는 **조사 사례 요약 · 미래AI랩 실적 아님**, 정책은 **공식 근거** 상자로 따로.
- 인증은 **'신청까지 함께 준비'**, 결과·기간은 외부기관 심사에 따른다는 각주. 특허는 **'출원'** 만.
- 실제 프로젝트는 업종만(업체명 비공개). 진단 시스템·알림·업무 공간 화면은 **예시 화면**.
- 영상 1의 "올해 중소벤처기업부가 … 7,540억 원 규모의 융자 지원" 은 녹음 그대로 자막에 두고, 화면에는 정확한 근거
  (AX-Sprint 7,540억 원 규모 지원 발표 · 정책브리핑 2026.3 / 중진공 정책자금 AX 스프린트 우대트랙)를 보여 준다. 다시 녹음할 때 표현을 맞추는 것이 좋다.
