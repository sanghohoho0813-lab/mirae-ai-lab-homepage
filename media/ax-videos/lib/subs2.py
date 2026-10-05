# 영상 스타일 v2 — 대본(spoken.txt) 글자 그대로의 자막을 최종 음성 단어 시각(asr.json)에 맞춘다 → timing.json
#  - spoken.txt: 빈 줄 = 장면 묶음(block), 한 줄 = 문장(line), ' | ' = 자막 조각(part), **단어** = 강조(조각당 0~1개)
#  - 대본 글자열과 받아쓰기 글자열을 글자 단위로 정렬(difflib) → 맞은 글자는 받아쓰기 시각, 틀린 글자는 앞뒤 사이를 고르게
#  - 조각 시작 = 첫 글자 시각 − 0.05초, 끝 = 마지막 글자 끝 + 0.35초(다음 자막 0.08초 전까지), 최소 0.9초
#  - 앞 여백(0.6초)은 장면 도구(reels2.mjs)가 더한다
# 사용: python3 subs2.py <영상 폴더>
import json, re, sys, difflib
D = sys.argv[1]
norm = lambda s: re.sub(r'[^0-9A-Za-z가-힣]', '', s.replace('**', '')).lower()

script = open(f'{D}/spoken.txt', encoding='utf-8').read().strip()
chunks = []  # {block,line,part,text}
for bi, blk in enumerate(script.split('\n\n')):
    for li, line in enumerate([l for l in blk.split('\n') if l.strip()]):
        for pi, part in enumerate([p.strip() for p in line.split('|') if p.strip()]):
            chunks.append({'block': bi + 1, 'line': li + 1, 'part': pi, 'text': part})
sc, owner = [], []
for i, c in enumerate(chunks):
    n = norm(c['text']); c['a'] = len(sc); sc += list(n); owner += [i] * len(n); c['b'] = len(sc) - 1
S = ''.join(sc)

ac, at0, at1 = [], [], []
for sg in json.load(open(f'{D}/asr.json', encoding='utf-8')):
    for w in sg['words']:
        n = norm(w['w'])
        if not n: continue
        d = (w['e'] - w['s']) / len(n)
        for k, ch in enumerate(n):
            ac.append(ch); at0.append(w['s'] + k * d); at1.append(w['s'] + (k + 1) * d)
A = ''.join(ac)

sm = difflib.SequenceMatcher(None, S, A, autojunk=False)
t0 = [None] * len(S); t1 = [None] * len(S); hit = [False] * len(S)
for a, b, size in sm.get_matching_blocks():
    for k in range(size):
        t0[a + k] = at0[b + k]; t1[a + k] = at1[b + k]; hit[a + k] = True
known = [i for i in range(len(S)) if t0[i] is not None]
import bisect
for i in range(len(S)):
    if t0[i] is None:
        j = bisect.bisect_left(known, i)
        prev = known[j - 1] if j > 0 else None
        nxt = known[j] if j < len(known) else None
        if prev is None: t0[i] = t1[i] = t0[nxt]
        elif nxt is None: t0[i] = t1[i] = t1[prev]
        else:
            f = (i - prev) / (nxt - prev); t0[i] = t1[prev] + (t0[nxt] - t1[prev]) * f; t1[i] = t0[i]
matched = sum(hit)

for c in chunks:
    c['start'] = t0[c['a']]; c['end'] = t1[c['b']]
    c['match'] = round(sum(hit[c['a']:c['b'] + 1]) / max(1, c['b'] - c['a'] + 1), 2)
for i, c in enumerate(chunks):
    nxt = chunks[i + 1]['start'] if i + 1 < len(chunks) else c['end'] + 1.0
    c['start'] = max(0.0, c['start'] - 0.05); c['end'] = min(c['end'] + 0.35, nxt - 0.05 - 0.08)
for i, c in enumerate(chunks):
    if c['end'] - c['start'] < 0.9:
        lim = chunks[i + 1]['start'] - 0.08 if i + 1 < len(chunks) else c['start'] + 0.9
        c['end'] = min(max(c['end'], c['start'] + 0.9), lim)
for c in chunks: c['start'], c['end'] = round(c['start'], 2), round(c['end'], 2)

voice = json.load(open(f'{D}/voice.json'))
lines = []
for c in chunks:
    if c['part'] == 0: lines.append({'block': c['block'], 'line': c['line'], 'start': c['start'], 'end': c['end'], 'text': c['text']})
    else: lines[-1]['end'] = c['end']; lines[-1]['text'] += ' ' + c['text']
json.dump({'cues': chunks, 'lines': lines, 'chars': S, 'ctime': [round(x, 3) for x in t0], 'audioEnd': voice['duration'],
           'matched': matched, 'total': len(S)}, open(f'{D}/timing.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

print(f'대본 {len(S)}자 중 음성과 맞은 글자 {matched} ({matched / len(S):.1%}) · 자막 {len(chunks)}개')
bad = [c for c in chunks if c['match'] < 0.6]
for c in bad: print(f"  ⚠️ 덜 맞은 조각({c['match']:.0%}) {c['block']}.{c['line']}.{c['part']} {c['text']}")
short = [c for c in chunks if c['end'] - c['start'] < 0.89]
for c in short: print(f"  ⚠️ 짧은 자막({c['end'] - c['start']:.2f}s) {c['block']}.{c['line']}.{c['part']} {c['text']}")
order = all(chunks[i]['start'] <= chunks[i + 1]['start'] for i in range(len(chunks) - 1))
print('시각 순서', '올바름' if order else '⚠️ 뒤바뀐 곳 있음')
