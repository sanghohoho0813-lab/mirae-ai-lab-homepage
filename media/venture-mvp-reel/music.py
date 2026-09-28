# 마지막 8초 배경음악 — 잔잔하고 희망찬 느낌을 직접 합성한다(저작권 걱정 없음).
# 화성: Am → F → G → C (vi–IV–V–I, 마지막에 밝게 풀림), 한 코드 2초.
# 부드러운 패드 + 맑은 벨 아르페지오 + 낮은 베이스 + 잔향. 목소리가 남아 있는 동안은 작게, 끝나면 조금 올린다.
# 사용: python asr/bin/python music.py <이 폴더>  → assets/music.wav (영상 전체 길이), music.json 필요
import json, sys
import numpy as np

R = sys.argv[1]
M = json.load(open(f'{R}/music.json'))
SR = 44100
DUR = 8.0
n = int(DUR * SR)
t = np.arange(n) / SR

def hz(m):  # MIDI 번호 → 주파수
    return 440.0 * 2 ** ((m - 69) / 12)

CHORDS = [  # (베이스, 패드, 아르페지오)
    (45, [57, 60, 64, 69], [69, 72, 76, 81]),   # Am
    (41, [53, 57, 60, 65], [69, 72, 77, 81]),   # F
    (43, [55, 59, 62, 67], [67, 71, 74, 79]),   # G
    (48, [55, 60, 64, 67], [72, 76, 79, 84]),   # C
]
L = np.zeros(n); Rr = np.zeros(n)

def env_adsr(length, a, r):
    e = np.ones(length)
    ai = min(int(a * SR), length); ri = min(int(r * SR), length)
    e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] *= np.linspace(1, 0, ri)
    return e

for ci, (bass, pad, arp) in enumerate(CHORDS):
    s0 = int(ci * 2.0 * SR)
    seg = int(2.45 * SR)  # 다음 코드와 살짝 겹치게
    seg = min(seg, n - s0)
    tt = np.arange(seg) / SR
    e = env_adsr(seg, 0.55, 0.6)
    # 패드: 살짝 어긋난 두 개의 부드러운 파형(합창 느낌)
    for k, m in enumerate(pad):
        f = hz(m)
        v = sum(np.sin(2 * np.pi * f * d * tt) for d in (0.9985, 1.0015)) / 2
        v += 0.22 * np.sin(2 * np.pi * 2 * f * tt) + 0.06 * np.sin(2 * np.pi * 3 * f * tt)
        pan = 0.35 + 0.1 * k
        L[s0:s0 + seg] += 0.055 * e * v * (1 - pan); Rr[s0:s0 + seg] += 0.055 * e * v * pan
    # 베이스
    fb = hz(bass)
    vb = np.sin(2 * np.pi * fb * tt) + 0.3 * np.sin(2 * np.pi * 2 * fb * tt)
    L[s0:s0 + seg] += 0.07 * e * vb; Rr[s0:s0 + seg] += 0.07 * e * vb
    # 벨 아르페지오: 8분음표(0.25초), 위로 올라갔다 내려오기
    order = [0, 1, 2, 3, 2, 1, 2, 3]
    for j, idx in enumerate(order):
        b0 = s0 + int(j * 0.25 * SR)
        ln = min(int(1.4 * SR), n - b0)
        if ln <= 0: continue
        tb = np.arange(ln) / SR
        f = hz(arp[idx])
        de = np.exp(-tb * 3.2) * np.minimum(1, tb / 0.004)
        v = np.sin(2 * np.pi * f * tb) + 0.35 * np.sin(2 * np.pi * 2 * f * tb) * np.exp(-tb * 6) + 0.08 * np.sin(2 * np.pi * 4.2 * f * tb) * np.exp(-tb * 10)
        vel = 0.05 * (0.85 + 0.15 * ((j * 7) % 3) / 2)
        pan = 0.3 if j % 2 else 0.7
        L[b0:b0 + ln] += vel * de * v * (1 - pan); Rr[b0:b0 + ln] += vel * de * v * pan

# 마지막 코드(C)에 높은 음 하나 더 — 밝게 끝나는 느낌
b0 = int(6.0 * SR); ln = n - b0; tb = np.arange(ln) / SR
v = np.sin(2 * np.pi * hz(88) * tb) * np.exp(-tb * 1.6) * np.minimum(1, tb / 0.004)
L[b0:] += 0.03 * v; Rr[b0:] += 0.03 * v

# 잔향: 지수적으로 사라지는 잡음과 합성곱
rng = np.random.default_rng(7)
ir_len = int(1.8 * SR)
ir_t = np.arange(ir_len) / SR
def reverb(x, seed):
    ir = np.random.default_rng(seed).standard_normal(ir_len) * np.exp(-ir_t / 0.45)
    ir[0] = 0; ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + ir_len)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:len(x)]
    return x * 0.8 + y * 0.28
L = reverb(L, 1); Rr = reverb(Rr, 2)

# 전체 모양: 1.2초 페이드 인, 끝 1.8초 페이드 아웃
fade = np.ones(n)
fi = int(1.2 * SR); fo = int(1.8 * SR)
fade[:fi] = np.linspace(0, 1, fi) ** 1.5
fade[-fo:] = np.linspace(1, 0, fo) ** 1.3
# 목소리가 남아 있는 동안은 작게(0.2 — 목소리보다 약 12dB 아래), 끝나면 0.6초에 걸쳐 올린다(0.8)
start = M['start']; voice_end = M['voiceEnd']
g = np.full(n, 0.8)
ve = int(max(0.0, voice_end - start) * SR)
if ve > 0:
    g[:ve] = 0.2
    ramp = min(int(0.6 * SR), n - ve)
    g[ve:ve + ramp] = np.linspace(0.2, 0.8, ramp)
L *= fade * g; Rr *= fade * g
peak = max(np.abs(L).max(), np.abs(Rr).max())
L *= 0.24 / peak; Rr *= 0.24 / peak   # 최고 약 -12dB — 잔잔하게 깔리는 정도

# 영상 전체 길이의 트랙에 배치
total = int(M['total'] * SR) + SR // 10
out = np.zeros((total, 2))
s0 = int(start * SR)
out[s0:s0 + n, 0] = L[:max(0, min(n, total - s0))]
out[s0:s0 + n, 1] = Rr[:max(0, min(n, total - s0))]
import wave
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
w = wave.open(f'{R}/assets/music.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(pcm.tobytes()); w.close()
print('music', DUR, 's at', start, '→ total', M['total'])
