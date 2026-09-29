# 녹음 순서 바꾸기(영상 2 v3) — 문장 사이 쉼 한가운데를 잘라 조각 순서만 옮긴다.
# 받아쓰기(asr) 단어 시간도 같은 규칙으로 옮겨, 다시 받아쓰지 않아도 싱크가 그대로 맞는다.
#  원래: … 8.2(가격) | 8.3·8.4(한 단계씩·풀 패키지) | 9.1(진행 정도에 따라 정산) | 9.2·9.3(부담되면 뒤로·후불) | 10.1…
#  새로: … 8.2(가격) | 9.2·9.3 | 8.3·8.4 | 9.1 | 10.1…
import json, subprocess, sys
FF = sys.argv[1]
c1, c2, c3, c4 = 198.41, 215.84, 223.27, 243.085      # 쉼 한가운데(원본 기준)
dur = float(subprocess.run([FF.replace('ffmpeg', 'ffprobe'), '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'assets/voice-orig.mp3'], capture_output=True, text=True).stdout)
pieces = [(0.0, c1), (c3, c4), (c1, c2), (c2, c3), (c4, dur)]
# 오디오
graph = ''.join(f'[0:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={max(b - a - 0.01, 0):.3f}:d=0.01[p{i}];' for i, (a, b) in enumerate(pieces))
graph += ''.join(f'[p{i}]' for i in range(len(pieces))) + f'concat=n={len(pieces)}:v=0:a=1[out]'
subprocess.run([FF, '-loglevel', 'error', '-y', '-i', 'assets/voice-orig.mp3', '-filter_complex', graph, '-map', '[out]', '-c:a', 'libmp3lame', '-b:a', '320k', '-ar', '44100', 'assets/voice.mp3'], check=True)
# 받아쓰기 시간 옮기기
starts, acc = [], 0.0
for a, b in pieces: starts.append(acc); acc += b - a
def piece_of(t):
    for i, (a, b) in enumerate(pieces):
        if a <= t < b: return i
    return len(pieces) - 1
asr = json.load(open('asr-orig.json', encoding='utf-8'))
out = []
for seg in asr:
    groups = {}
    for w in seg['words']:
        i = piece_of(w['s'])
        a = pieces[i][0]
        groups.setdefault(i, []).append({'s': round(w['s'] - a + starts[i], 3), 'e': round(min(w['e'], pieces[i][1]) - a + starts[i], 3), 'w': w['w']})
    for i, ws in groups.items():
        out.append({'start': ws[0]['s'], 'end': ws[-1]['e'], 'text': ''.join(x['w'] for x in ws), 'words': ws})
out.sort(key=lambda s: s['start'])
json.dump(out, open('asr.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('pieces', [(round(a, 2), round(b, 2)) for a, b in pieces], 'total', round(acc, 2), 'orig', round(dur, 2))
