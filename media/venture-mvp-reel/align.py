# 받아쓰기(asr.json, 단어 시간) ↔ 대본(voice.txt) 글자 단위 정렬 → timing.json
# 대본 문장마다 시작·끝 시간, 그리고 장면 안 핵심 단어(KEYS)의 시간을 뽑는다.
import json, re, sys, difflib

R = sys.argv[1]
script = open(sys.argv[2], encoding='utf-8').read().strip()
import os
ASR = os.environ.get('ASR', 'asr.json')  # 속도 조절본은 ASR=asr-fast.json
asr = json.load(open(f'{R}/{ASR}', encoding='utf-8'))

def norm_chars(s):
    s = s.lower()
    rep = [('mvp', '엠브이피'), ('ax', '에이엑스'), ('ai', '에이아이'), ('500만원', '오백만원'), ('300만원', '삼백만원'),
           ('5년간', '오년간'), ('5개사', '다섯개사'), ('9년', '구년'), ('2주', '이주'), ('·', '')]
    for a, b in rep:
        s = s.replace(a, b)
    return [c for c in s if re.match(r'[가-힣a-z0-9]', c)]

# 받아쓰기 글자열 + 글자별 시간
achars, atimes = [], []
for seg in asr:
    for w in seg['words']:
        cs = norm_chars(w['w'])
        n = len(cs)
        for i, c in enumerate(cs):
            achars.append(c)
            atimes.append(w['s'] + (w['e'] - w['s']) * (i + 0.5) / max(n, 1))

# 대본 글자열 (문장·장면 번호 기억)
blocks = [b.split('\n') for b in script.split('\n\n')]
schars, sowner = [], []  # sowner: (block, line, charidx_in_norm_line)
lines = []
for bi, b in enumerate(blocks):
    for li, line in enumerate(b):
        cs = norm_chars(line)
        lines.append({'block': bi + 1, 'line': li + 1, 'text': line, 'n': len(cs), 'offset': len(schars)})
        schars += cs

sm = difflib.SequenceMatcher(None, schars, achars, autojunk=False)
stime = [None] * len(schars)
for a, b, size in sm.get_matching_blocks():
    for k in range(size):
        stime[a + k] = atimes[b + k]
matched = sum(1 for t in stime if t is not None)
# 빈 곳은 앞뒤 시간으로 채움
last = None
for i in range(len(stime)):
    if stime[i] is None:
        nxt = next((stime[j] for j in range(i + 1, len(stime)) if stime[j] is not None), last)
        stime[i] = (last if last is not None else nxt) if nxt is None or last is None else (last + nxt) / 2
    last = stime[i]

def t_of(line, needle, end=False):
    """문장 안 needle 의 시작(또는 끝) 시간"""
    cs = norm_chars(line['text'])
    nd = norm_chars(needle)
    s = ''.join(cs)
    k = s.find(''.join(nd))
    if k < 0:
        raise SystemExit(f'못 찾음: {needle} in {line["text"]}')
    idx = line['offset'] + k + (len(nd) - 1 if end else 0)
    return round(stime[idx], 2)

out_lines = []
for L in lines:
    st = stime[L['offset']]
    en = stime[L['offset'] + L['n'] - 1]
    out_lines.append({'block': L['block'], 'line': L['line'], 'text': L['text'].replace(' | ', ' ').replace('|', ''), 'start': round(st - 0.2, 2), 'end': round(en + 0.25, 2)})

# 자막 조각 — 긴 문장은 쉼표·마침표에서 끊고, 두 줄(약 26자) 안으로 묶는다
MAXC = 28   # 쉼표 조각을 이 길이까지 묶는다
SPLIT = 30  # 이보다 긴 조각은 가운데 가까운 띄어쓰기에서 한 번 더 끊는다
def halve(t):
    if len(t) <= SPLIT:
        return [t]
    mid = len(t) / 2
    sp = min((i for i, ch in enumerate(t) if ch == ' '), key=lambda i: abs(i - mid), default=None)
    if sp is None:
        return [t]
    return halve(t[:sp]) + halve(t[sp + 1:])
cues = []
for L in lines:
    if '|' in L['text']:  # 대본에 '|' 로 직접 끊은 곳이 있으면 그대로 따른다
        merged = [p.strip() for p in L['text'].split('|') if p.strip()]
        pos = 0
        for m in merged:
            n = len(norm_chars(m)); a = L['offset'] + pos; b = a + n - 1
            cues.append({'block': L['block'], 'text': m, 'start': round(stime[a] - 0.2, 2), 'end': round(stime[b] + 0.3, 2)})
            pos += n
        continue
    parts = [p for p in re.split(r'(?<=[,.?])\s+', L['text']) if p]
    merged = []
    for p in parts:
        if merged and len(merged[-1]) + 1 + len(p) <= MAXC:
            merged[-1] += ' ' + p
        else:
            merged.append(p)
    merged = [h for m in merged for h in halve(m)]
    pos = 0
    for m in merged:
        n = len(norm_chars(m))
        a = L['offset'] + pos
        b = a + n - 1
        cues.append({'block': L['block'], 'text': m, 'start': round(stime[a] - 0.2, 2), 'end': round(stime[b] + 0.3, 2)})
        pos += n
# 다음 자막과 겹치지 않게, 너무 짧게 사라지지 않게
for i, c in enumerate(cues):
    nxt = cues[i + 1]['start'] if i + 1 < len(cues) else c['end'] + 1
    c['end'] = round(min(max(c['end'], c['start'] + 0.9), nxt - 0.02), 2)

keys = {}
if len(sys.argv) > 3:
    for spec in json.load(open(sys.argv[3], encoding='utf-8')):
        L = next(x for x in lines if x['block'] == spec['block'] and x['line'] == spec['line'])
        keys[spec['id']] = t_of(L, spec['word'], spec.get('end', False))

dur = asr[-1]['end'] if asr else 0
json.dump({'lines': out_lines, 'cues': cues, 'keys': keys, 'audioEnd': round(dur, 2), 'matched': matched, 'total': len(schars)}, open(f'{R}/timing.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'정렬 {matched}/{len(schars)} 글자 ({matched / len(schars) * 100:.0f}%)')
for L in out_lines:
    print(f"{L['block']:>2}.{L['line']} {L['start']:6.2f}–{L['end']:6.2f}  {L['text']}")
for k, v in keys.items():
    print('  key', k, v)
