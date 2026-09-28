# 녹음(assets/voice.mp3) 받아쓰기 → asr.json (단어별 시간). 사용: python3 asr.py <이 폴더>
# pip install faster-whisper  (처음 실행 때 medium 모델을 내려받아요)
import json, sys, time
from faster_whisper import WhisperModel
R = sys.argv[1] if len(sys.argv) > 1 else '.'
t0 = time.time()
m = WhisperModel('medium', device='cpu', compute_type='int8', cpu_threads=4)
prompt = open(f'{R}/spoken.txt', encoding='utf-8').read().replace('|', '').replace('\n', ' ')[:800]
segs, info = m.transcribe(f'{R}/assets/voice.mp3', language='ko', word_timestamps=True, initial_prompt=prompt, beam_size=5)
out = []
for s in segs:
    out.append({'start': s.start, 'end': s.end, 'text': s.text, 'words': [{'s': w.start, 'e': w.end, 'w': w.word} for w in s.words]})
    print(f'{s.start:6.2f}-{s.end:6.2f} {s.text}', flush=True)
json.dump(out, open(f'{R}/asr.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('done', round(time.time() - t0), 's')
