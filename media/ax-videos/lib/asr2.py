# 영상 스타일 v2 — 최종 음성(assets/voice.wav)을 받아써서 단어별 시각을 얻는다 → asr.json
# 자막 글자는 대본(spoken.txt) 그대로 쓰고, 여기서는 시각만 가져온다(subs2.py).
# 사용: python3 asr2.py <영상 폴더> [모델 이름(기본 medium)]
import json, sys, time
from faster_whisper import WhisperModel
D = sys.argv[1]
MODEL = sys.argv[2] if len(sys.argv) > 2 else 'medium'
t0 = time.time()
m = WhisperModel(MODEL, device='cpu', compute_type='int8', cpu_threads=4)
# 대본의 고유명사·숫자를 미리 알려 준다(대본 앞부분)
prompt = open(f'{D}/spoken.txt', encoding='utf-8').read().replace('|', '').replace('*', '').replace('\n', ' ')[:600]
segs, _ = m.transcribe(f'{D}/assets/voice.wav', language='ko', beam_size=5, word_timestamps=True,
                       vad_filter=True, vad_parameters={'min_silence_duration_ms': 300},
                       condition_on_previous_text=False, initial_prompt=prompt)
out = []
for s in segs:
    out.append({'start': s.start, 'end': s.end, 'text': s.text, 'words': [{'s': w.start, 'e': w.end, 'w': w.word} for w in s.words]})
json.dump(out, open(f'{D}/asr.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'받아쓰기 {len(out)}조각 · {round(time.time() - t0)}초 ({MODEL})')
