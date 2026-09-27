// 영상 한 편의 대본·장면·자막 — 여기 하나만 고치면 index.html · 자막(SRT) · 대본(md)이 같이 바뀐다.
// 시간 단위: 초. 자막은 나중에 대표님 목소리를 입힐 때 그대로 읽을 문장이다(해요체, 한 호흡씩).

export const W = 1080
export const H = 1350

// 대표 데모 6개 — '지금 하는 사업 → 새 기술사업'. 화면은 미래AI랩 자체 데모(고객사 사례 아님)
export const DEMOS = [
  { slug: 'pawbeauty', name: 'PawBeauty', from: '동네 반려동물 미용실', to: '예약·재방문 관리 플랫폼', sub: '동네 반려동물 미용실은\n예약·재방문 관리 플랫폼으로,' },
  { slug: 'localmom', name: '로컬맘', from: '농산물 유통 회사', to: '산지직송 신선식품 커머스', sub: '농산물 유통 회사는 산지직송 커머스로,' },
  { slug: 'expertmatch', name: 'ExpertMatch', from: '전문가 상담 사무소', to: '전문가 상담 매칭 플랫폼', sub: '상담 사무소는 전문가 매칭 플랫폼으로,' },
  { slug: 'eduplaza', name: 'EduPlaza', from: '동네 보습학원', to: '온라인 학습·진도관리 플랫폼', sub: '보습학원은 온라인 학습 플랫폼으로,' },
  { slug: 'insightai', name: 'InsightAI', from: '회계·경영 자문 사무소', to: 'AI 경영데이터 분석 서비스', sub: '회계 사무소는\nAI 경영데이터 분석 서비스로,' },
  { slug: 'stylecheck', name: 'StyleCheck AI', from: '옷가게·의류 쇼핑몰', to: 'AI 코디 점검 서비스', sub: '옷가게는 AI 코디 점검 서비스로.' },
]
export const DEMO_START = 18.5
export const DEMO_LEN = 5

// 장면 순서와 길이
export const SCENES = [
  { id: 's-hook', start: 0, dur: 4 },
  { id: 's-pain', start: 4, dur: 3.5 },
  { id: 's-promise', start: 7.5, dur: 6 },
  { id: 's-noidea', start: 13.5, dur: 5 },
  ...DEMOS.map((d, i) => ({ id: `s-demo-${d.slug}`, start: DEMO_START + i * DEMO_LEN, dur: DEMO_LEN, demo: d, index: i })),
  { id: 's-wall', start: 48.5, dur: 4.5 },
  { id: 's-proof', start: 53, dur: 7 },
  { id: 's-steps', start: 60, dur: 6 },
  { id: 's-price', start: 66, dur: 5.5 },
  { id: 's-cta', start: 71.5, dur: 4.5 },
]
export const TOTAL = 76

// 자막(= 나중에 녹음할 대본). [시작, 끝, 문장] — \n 은 자막 줄바꿈(뜻 단위로 끊는다)
export const SUBS = [
  [0.3, 3.9, '대표님, 기술사업 해야 한다는 얘기\n많이 들으셨죠?'],
  [4.1, 7.4, '막상 뭘 만들어야 할지, 막막하셨죠?'],
  [7.6, 10.5, '아이디어는 작동하는 서비스로,'],
  [10.5, 13.4, '회사는 벤처기업으로 만들어드려요.'],
  [13.6, 18.4, '아이디어가 없어도 괜찮아요.\n경영컨설턴트가 지금 사업에서 찾아 드려요.'],
  ...DEMOS.map((d, i) => [DEMO_START + i * DEMO_LEN + 0.1, DEMO_START + (i + 1) * DEMO_LEN - 0.1, d.sub]),
  [48.6, 52.9, '모두 미래AI랩이 직접 만든,\n실제로 작동하는 데모예요.'],
  [53.1, 56.5, '심사위원, 투자자 앞에서\n직접 눌러 보여 드리세요.'],
  [56.5, 59.9, '말로만 하던 사업계획이\n눈에 보이는 근거가 돼요.'],
  [60.1, 65.9, '아이디어부터 MVP, 벤처기업확인 신청까지.\n2주 안에 함께해요.'],
  [66.1, 71.4, '정상가 500만원,\n런칭 파트너 선착순 5개사는 300만원이에요.'],
  [71.6, 75.8, '지금 무료로 상담받아 보세요.'],
]
