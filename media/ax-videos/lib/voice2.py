# 영상 스타일 v2 음성 처리 — 원본 녹음 → assets/voice.wav (48kHz 스테레오, -14 LUFS)
#   ① (필요하면) 조각 이어 붙이기: --pieces "0-198.41,223.27-243.085,..." — 순서 바꾸기·뺄 문장 빼기(원본 기준 초)
#   ② 1.13배속(atempo, 음 높이 그대로)
#   ③ 문장 사이 쉼 살짝 줄이기 — 0.35초 넘는 쉼만, 넘는 부분의 55% 만 남김(0.91s→0.66s), 쉼 가운데만 자르고 8ms 교차
#   ④ 음량 -14 LUFS — loudnorm 두 번(재고 → 적용) + 0.05dB 넘게 빗나가면 volume 으로 미세 보정
# 사용: python3 voice2.py <영상 폴더> <원본 음성> [--pieces ...] [--speed 1.13]
import argparse, json, os, re, subprocess, wave
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('dir'); ap.add_argument('src')
ap.add_argument('--pieces', default=''); ap.add_argument('--speed', type=float, default=1.13)
ap.add_argument('--ff', default=os.environ.get('FF', 'ffmpeg'))
A = ap.parse_args()
FF, D = A.ff, A.dir
W = os.path.join(D, 'assets'); os.makedirs(W, exist_ok=True)
tmp = lambda n: os.path.join(W, n)
run = lambda *a: subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-y', *a], check=True)

# ① 조각 이어 붙이기(없으면 그대로) → src.wav (모노 48k)
if A.pieces:
    P = [tuple(map(float, p.split('-'))) for p in A.pieces.split(',')]
    g = ''.join(f'[0:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={max(b - a - 0.01, 0):.3f}:d=0.01[p{i}];' for i, (a, b) in enumerate(P))
    g += ''.join(f'[p{i}]' for i in range(len(P))) + f'concat=n={len(P)}:v=0:a=1[o]'
    run('-i', A.src, '-filter_complex', g, '-map', '[o]', '-ac', '1', '-ar', '48000', tmp('src.wav'))
else:
    run('-i', A.src, '-ac', '1', '-ar', '48000', tmp('src.wav'))

# ② 1.13배속
run('-i', tmp('src.wav'), '-af', f'atempo={A.speed}', '-ac', '1', '-ar', '48000', '-c:a', 'pcm_s16le', tmp('sped.wav'))

# ③ 쉼 줄이기
w = wave.open(tmp('sped.wav')); sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32); w.close()
hop = int(sr * .01); n = len(x) // hop
db = 20 * np.log10(np.sqrt(np.mean((x[:n * hop] / 32768).reshape(n, hop) ** 2, axis=1) + 1e-12))
sil = db < -38
runs, i = [], 0
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]: j += 1
        a, b = i * .01, j * .01
        if b - a >= .35 and a > .05 and b < n * .01 - .05: runs.append((a, b))
        i = j
    else: i += 1
KEEP, RATIO = .35, .55
cuts = []
for a, b in runs:
    L = b - a; newL = KEEP + (L - KEEP) * RATIO; cut = L - newL
    mid = (a + b) / 2
    cuts.append((mid - cut / 2, cut))
xf = int(sr * .008)
out, pos = [], 0
for c0, cl in cuts:
    s0, s1 = int(c0 * sr), int((c0 + cl) * sr)
    seg = x[pos:s0].copy()
    if out and xf:
        prev = out[-1]; ramp = np.linspace(0, 1, xf)
        prev[-xf:] = prev[-xf:] * (1 - ramp) + seg[:xf] * ramp
        seg = seg[xf:]
    out.append(seg); pos = s1
out.append(x[pos:])
y = np.concatenate(out)
wo = wave.open(tmp('tight.wav'), 'w'); wo.setnchannels(1); wo.setsampwidth(2); wo.setframerate(sr)
wo.writeframes(np.clip(y, -32768, 32767).astype(np.int16).tobytes()); wo.close()
print(f'쉼 {len(cuts)}곳 · {sum(c for _, c in cuts):.1f}초 줄임 · {len(x) / sr:.1f}s → {len(y) / sr:.1f}s')

# ④ 음량 -14 LUFS — 두 번
def measure(f, extra=''):
    e = subprocess.run([FF, '-hide_banner', '-i', f, '-af', f'{extra}loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return json.loads(e[e.rindex('{'):e.rindex('}') + 1])
def ebur(f):
    e = subprocess.run([FF, '-hide_banner', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    s = e[e.rindex('Summary:'):]
    return float(re.search(r'I:\s+(-?[\d.]+) LUFS', s).group(1)), float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', s).group(1))
m = measure(tmp('tight.wav'))
ln = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
run('-i', tmp('tight.wav'), '-af', f'{ln},aresample=48000', '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s16le', tmp('voice_pre.wav'))
I, pk = ebur(tmp('voice_pre.wav'))
adj = round(-14.0 - I, 2)
if abs(adj) > 0.05 and pk + adj <= -1.5:
    run('-i', tmp('voice_pre.wav'), '-af', f'volume={adj}dB', '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s16le', tmp('voice.wav'))
else:
    os.replace(tmp('voice_pre.wav'), tmp('voice.wav')); adj = 0
I2, pk2 = ebur(tmp('voice.wav'))
dur = float(subprocess.run([FF.replace('ffmpeg', 'ffprobe'), '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', tmp('voice.wav')], capture_output=True, text=True).stdout)
for f in ('src.wav', 'sped.wav', 'tight.wav', 'voice_pre.wav'):
    if os.path.exists(tmp(f)): os.remove(tmp(f))
json.dump({'speed': A.speed, 'pieces': A.pieces, 'pauses_cut': len(cuts), 'cut_sec': round(sum(c for _, c in cuts), 2), 'duration': round(dur, 3), 'lufs': I2, 'peak_dbfs': pk2, 'fine_gain_db': adj},
          open(os.path.join(D, 'voice.json'), 'w'), indent=1)
print(f'음량 {I2} LUFS · 피크 {pk2} dBFS (미세 보정 {adj} dB) · 길이 {dur:.2f}s')
