# 녹음의 긴 쉼을 줄이고 전체를 1.05배로 → assets/voice-fast.wav
# 같은 규칙으로 받아쓰기 단어 시간도 옮겨 asr-fast.json 을 만든다(다시 받아쓰지 않아도 정확히 맞는다).
#  - 쉼표 쉼(문장 안): 0.2초까지
#  - 문장 사이(같은 장면): 0.35초
#  - 장면 사이: 0.45초
#  - 말 끝 꼬리는 넉넉히(60%), 다음 말 앞은 40% 남겨 소리가 잘리지 않게 한다
#  - edits.json: 특정 문장 앞 쉼을 늘리거나(gapBefore, 모자라면 무음을 끼움) 문장을 통째로 뺀다(drop)
import json, os, re, subprocess, sys

R = sys.argv[1]
FF = sys.argv[2]
SPEED = 1.05
T = json.load(open(f'{R}/timing-orig.json', encoding='utf-8'))  # 원본 녹음 기준 정렬(쉼 종류 판단용)
asr = json.load(open(f'{R}/asr.json', encoding='utf-8'))
src = f'{R}/assets/voice.mp3'

out = subprocess.run([FF, '-hide_banner', '-i', src, '-af', 'silencedetect=noise=-38dB:d=0.18', '-f', 'null', '-'], capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', out)]
ends = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', out)]
dur = float(re.search(r'Duration: (\d+):(\d+):([0-9.]+)', out).group(3)) + 60 * int(re.search(r'Duration: (\d+):(\d+)', out).group(2))
sil = list(zip(starts, ends))

lines = T['lines']
E = json.load(open(f'{R}/edits.json', encoding='utf-8')) if os.path.exists(f'{R}/edits.json') else {}
GAP = {(g['block'], g['line']): g['sec'] * SPEED for g in E.get('gapBefore', [])}  # 1.05배 뒤 길이 → 원본 길이
DROP = [(d['block'], d['line']) for d in E.get('drop', [])]

def boundary(s, e):
    """쉼의 종류: 장면 사이 / 문장 사이 / 문장 안.
    쉼이 끝난 바로 뒤에 새 문장이 시작하면 문장(또는 장면) 사이로 본다.
    (받아쓰기의 말 끝 시간은 실제보다 늦게 잡혀서, 앞 문장 끝으로 판단하면 문장 사이를 쉼표로 잘못 본다)"""
    for i in range(1, len(lines)):
        a, b = lines[i - 1], lines[i]
        if s - 0.2 <= b['start'] + 0.08 <= e + 0.45:
            return ('block' if a['block'] != b['block'] else 'line'), (b['block'], b['line'])
    return 'comma', None
def kind(s, e):
    return boundary(s, e)[0]

TARGET = {'block': 0.45, 'line': 0.35, 'comma': 0.2}
# 뺄 문장: 그 문장 앞 쉼 ~ 다음 문장 앞 쉼을 한 번에 잘라, 앞뒤 문장 사이에 보통 쉼 하나만 남긴다
drops, spans = [], []
for key in DROP:
    i = next(k for k, l in enumerate(lines) if (l['block'], l['line']) == key)
    prv, nxt = lines[i - 1], lines[i + 1]
    s0, e0 = next((s, e) for s, e in sil if boundary(s, e)[1] == key)
    s1, e1 = next((s, e) for s, e in sil if boundary(s, e)[1] == (nxt['block'], nxt['line']))
    t = GAP.get((nxt['block'], nxt['line']), TARGET['block' if prv['block'] != nxt['block'] else 'line'])
    # 남길 쉼: 앞 문장 뒤 꼬리 + 다음 문장 앞머리. 각 쉼 안에서만 가져와(말소리가 섞이지 않게), 모자라면 무음을 끼운다
    tail = min(t * 0.6, e0 - s0 - 0.03); head = min(t - tail, e1 - s1 - 0.03)
    drops.append((s0 + tail, e1 - head)); spans.append((s0, e1))
    if tail + head < t - 0.005:
        inserts.append((s0 + tail - 0.001, t - tail - head))
cuts, inserts, widened = [], [], []  # 잘라낼 구간 (시작, 끝) · 끼워 넣을 무음 (위치, 길이) · 무음을 끼운 쉼
for s, e in sil:
    d = e - s
    if any(a <= s and e <= b for a, b in spans):
        continue
    if s < 0.05:          # 맨 앞 침묵
        if d > 0.15: cuts.append((0.0, e - 0.15))
        continue
    if e >= dur - 0.05:   # 맨 끝 침묵
        if d > 0.3: cuts.append((s + 0.3, e))
        continue
    k, who = boundary(s, e)
    t = GAP.get(who, TARGET[k])
    if d > t:
        cuts.append((s + t * 0.6, e - t * 0.4))
    elif who in GAP:
        inserts.append((s + d * 0.6, t - d)); widened.append((s, e))
cuts = sorted(cuts + drops)

keep, cur = [], 0.0
for a, b in cuts:
    if a > cur: keep.append((cur, a))
    cur = b
if cur < dur: keep.append((cur, dur))

def remap(t):
    removed = 0.0
    for a, b in cuts:
        if t >= b: removed += b - a
        elif t > a: t = a; break
    added = sum(d for p, d in inserts if t > p)
    return (t - removed + added) / SPEED

# 오디오 만들기: 남길 조각을 이어 붙이고(조각 경계엔 5ms 페이드, 늘릴 쉼엔 무음) 1.05배
pieces = []
for a, b in keep:
    cur = a
    for p, d in sorted(x for x in inserts if a < x[0] < b):
        pieces += [('seg', cur, p), ('sil', d)]; cur = p
    pieces.append(('seg', cur, b))
FMT = 'aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo'
parts = ''.join((f'[0:a]atrim=start={x[1]:.3f}:end={x[2]:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.005,afade=t=out:st={max(x[2] - x[1] - 0.005, 0):.3f}:d=0.005,{FMT}[p{i}];'
                 if x[0] == 'seg' else f'aevalsrc=0|0:s=44100:d={x[1]:.3f},{FMT}[p{i}];') for i, x in enumerate(pieces))
graph = parts + ''.join(f'[p{i}]' for i in range(len(pieces))) + f'concat=n={len(pieces)}:v=0:a=1,atempo={SPEED}[out]'
open(f'{R}/tighten.filter', 'w').write(graph)
subprocess.run([FF, '-loglevel', 'error', '-y', '-i', src, '-filter_complex_script', f'{R}/tighten.filter', '-map', '[out]', '-ar', '44100', '-ac', '2', f'{R}/assets/voice-fast.wav'], check=True)

dropped = lambda w: any(a <= (w['s'] + w['e']) / 2 <= b for a, b in drops)  # 뺀 문장의 단어는 받아쓰기에서도 뺀다
def snap(w):
    # 받아쓰기는 말 앞뒤를 쉼 속까지 넉넉히 잡는다. 무음을 끼운 쉼에선 그 차이가 커지므로 말 시작·끝을 쉼 경계에 맞춘다
    ws, we = w['s'], w['e']
    for a, b in widened:
        if a < ws < b < we: ws = b - 0.02
        if ws < a < we < b: we = a + 0.05
    return {'s': ws, 'e': we, 'w': w['w']}
fast = []
for seg in asr:
    ws = [{'s': remap(x['s']), 'e': remap(x['e']), 'w': x['w']} for x in (snap(w) for w in seg['words'] if not dropped(w))]
    if ws:
        fast.append({'start': ws[0]['s'], 'end': ws[-1]['e'], 'text': ' '.join(w['w'] for w in ws), 'words': ws})
json.dump(fast, open(f'{R}/asr-fast.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump({'speed': SPEED, 'cuts': cuts, 'inserts': inserts, 'drops': drops, 'kinds': TARGET}, open(f'{R}/tighten.json', 'w'), indent=1)
removed = sum(b - a for a, b in cuts); added = sum(d for _, d in inserts)
print(f'쉼 {len(cuts)}곳에서 {removed:.1f}초 줄임(뺀 문장 {len(drops)}개 포함), 무음 {added:.1f}초 넣음 → {dur - removed + added:.1f}초 → 1.05배 {((dur - removed + added) / SPEED):.1f}초')
from collections import Counter
print(Counter(kind(s, e) for s, e in sil if 0.05 < s < dur - 0.05))
