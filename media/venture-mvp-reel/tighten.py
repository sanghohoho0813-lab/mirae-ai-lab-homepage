# 녹음의 긴 쉼을 줄이고 전체를 1.05배로 → assets/voice-fast.wav
# 같은 규칙으로 받아쓰기 단어 시간도 옮겨 asr-fast.json 을 만든다(다시 받아쓰지 않아도 정확히 맞는다).
#  - 쉼표 쉼(문장 안): 0.2초까지
#  - 문장 사이(같은 장면): 0.35초
#  - 장면 사이: 0.45초
#  - 말 끝 꼬리는 넉넉히(60%), 다음 말 앞은 40% 남겨 소리가 잘리지 않게 한다
import json, re, subprocess, sys

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
def kind(s, e):
    """쉼의 종류: 장면 사이 / 문장 사이 / 문장 안.
    쉼이 끝난 바로 뒤에 새 문장이 시작하면 문장(또는 장면) 사이로 본다.
    (받아쓰기의 말 끝 시간은 실제보다 늦게 잡혀서, 앞 문장 끝으로 판단하면 문장 사이를 쉼표로 잘못 본다)"""
    for i in range(1, len(lines)):
        a, b = lines[i - 1], lines[i]
        if s - 0.2 <= b['start'] + 0.08 <= e + 0.45:
            return 'block' if a['block'] != b['block'] else 'line'
    return 'comma'

TARGET = {'block': 0.45, 'line': 0.35, 'comma': 0.2}
cuts = []  # (시작, 끝) 잘라낼 구간
for s, e in sil:
    d = e - s
    if s < 0.05:          # 맨 앞 침묵
        if d > 0.15: cuts.append((0.0, e - 0.15))
        continue
    if e >= dur - 0.05:   # 맨 끝 침묵
        if d > 0.3: cuts.append((s + 0.3, e))
        continue
    t = TARGET[kind(s, e)]
    if d > t:
        cuts.append((s + t * 0.6, e - t * 0.4))

keep, cur = [], 0.0
for a, b in cuts:
    if a > cur: keep.append((cur, a))
    cur = b
if cur < dur: keep.append((cur, dur))

def remap(t):
    removed = 0.0
    for a, b in cuts:
        if t >= b: removed += b - a
        elif t > a: return (a - removed) / SPEED
    return (t - removed) / SPEED

# 오디오 만들기: 남길 조각을 이어 붙이고(조각 경계엔 5ms 페이드) 1.05배
parts = ''.join(f'[0:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.005,afade=t=out:st={max(b - a - 0.005, 0):.3f}:d=0.005[p{i}];' for i, (a, b) in enumerate(keep))
graph = parts + ''.join(f'[p{i}]' for i in range(len(keep))) + f'concat=n={len(keep)}:v=0:a=1,atempo={SPEED}[out]'
open(f'{R}/tighten.filter', 'w').write(graph)
subprocess.run([FF, '-loglevel', 'error', '-y', '-i', src, '-filter_complex_script', f'{R}/tighten.filter', '-map', '[out]', '-ar', '44100', '-ac', '2', f'{R}/assets/voice-fast.wav'], check=True)

fast = []
for seg in asr:
    fast.append({'start': remap(seg['start']), 'end': remap(seg['end']), 'text': seg['text'],
                 'words': [{'s': remap(w['s']), 'e': remap(w['e']), 'w': w['w']} for w in seg['words']]})
json.dump(fast, open(f'{R}/asr-fast.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump({'speed': SPEED, 'cuts': cuts, 'kinds': TARGET}, open(f'{R}/tighten.json', 'w'), indent=1)
removed = sum(b - a for a, b in cuts)
print(f'쉼 {len(cuts)}곳에서 {removed:.1f}초 줄임 → {dur - removed:.1f}초 → 1.05배 {((dur - removed) / SPEED):.1f}초')
from collections import Counter
print(Counter(kind(s, e) for s, e in sil if 0.05 < s < dur - 0.05))
