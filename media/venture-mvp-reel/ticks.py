# 마지막 22개 화면이 뜰 때마다 작은 '틱' 소리 → assets/ticks.wav (영상 전체 길이, 44.1kHz 스테레오)
import json, math, struct, sys, wave

R = sys.argv[1]
total = float(sys.argv[2])
times = json.load(open(f'{R}/ticks.json'))
SR = 44100
n = int(total * SR) + SR // 10
buf = [0.0] * n

def tick(t0, freq=1650.0, amp=0.18, dur=0.045):
    s0 = int(t0 * SR)
    for i in range(int(dur * SR)):
        if s0 + i >= n: break
        t = i / SR
        env = math.exp(-t * 95) * min(1.0, i / 40)  # 빠르게 사라지는 짧은 소리(시작 2ms 페이드)
        buf[s0 + i] += amp * env * (math.sin(2 * math.pi * freq * t) + 0.35 * math.sin(2 * math.pi * freq * 2.01 * t))

for i, t in enumerate(times):
    tick(t, freq=1650 + (i % 4) * 90)  # 음높이를 살짝씩 바꿔 단조롭지 않게

w = wave.open(f'{R}/assets/ticks.wav', 'wb')
w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
frames = bytearray()
for v in buf:
    s = max(-32767, min(32767, int(v * 32767)))
    frames += struct.pack('<hh', s, s)
w.writeframes(bytes(frames)); w.close()
print('ticks', len(times), 'total', total)
