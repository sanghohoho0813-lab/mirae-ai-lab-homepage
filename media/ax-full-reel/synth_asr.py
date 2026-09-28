# 녹음이 오기 전 — 대본(spoken.txt)으로 '가상 받아쓰기'(asr-synth.json)를 만든다.
# 기술사업·MVP 녹음의 실제 속도(쉼을 뺀 말 속도 약 초당 6.9글자)와 쉼 규칙(쉼표 0.2 · 문장 0.35 · 장면 0.45초)을 쓴다.
# 녹음이 오면 asr.py 로 진짜 받아쓰기(asr.json)를 만들어 이 파일 대신 쓰면 된다 — align.py · build.mjs 는 그대로.
import json, re, sys
R = sys.argv[1]
RATE = float(sys.argv[2]) if len(sys.argv) > 2 else 6.9
SPECIAL = {'지원금 받으면 하겠습니다': 1.0}  # 이 문장 뒤엔 정적을 길게(연출)
def norm(s):
    s = s.lower()
    for a, b in [('mvp', '엠브이피'), ('ax', '에이엑스'), ('ai', '에이아이'), ('7,540억', '칠천오백사십억'), ('250곳', '이백오십곳'), ('10억', '십억'), ('12개', '십이개'), ('5건', '다섯건'), ('9월', '구월'), ('9년', '구년'), ('3분', '삼분'), ('3년', '삼년')]:
        s = s.replace(a, b)
    return [c for c in s if re.match(r'[가-힣a-z0-9]', c)]
blocks = [b.split('\n') for b in open(f'{R}/spoken.txt', encoding='utf-8').read().strip().split('\n\n')]
t = 0.12; out = []
for bi, b in enumerate(blocks):
    for li, line in enumerate(b):
        text = line.replace(' | ', ' ').replace('|', '')
        words = []
        for w in text.split():
            n = max(len(norm(w)), 1)
            d = max(n / RATE, 0.12)
            words.append({'s': round(t, 3), 'e': round(t + d, 3), 'w': w})
            t += d
            if re.search(r'[.?]’?$|’$', w) and w is not text.split()[-1]: t += 0.3
            elif w.endswith(','): t += 0.2
        out.append({'start': words[0]['s'], 'end': words[-1]['e'], 'text': text, 'words': words})
        extra = next((v for k, v in SPECIAL.items() if k in text), None)
        last_line = li == len(b) - 1
        t += extra if extra else (0.45 if last_line else 0.35)
json.dump(out, open(f'{R}/asr-synth.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'가상 받아쓰기: {len(out)}문장, 말 끝 {out[-1]["end"]:.1f}초')
