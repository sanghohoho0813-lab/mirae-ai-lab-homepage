# flow.mjs 로 찍은 단계별 화면(PNG, 2배) → assets/flows/<name>-NN(a).jpg (폰 560px) + flows.json(누른 위치)
# 사용: python3 convert_flows.py <flows 폴더> <이름...>
import json, os, subprocess, sys
src, names = sys.argv[1], sys.argv[2:]
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, 'assets', 'flows'); os.makedirs(out, exist_ok=True)
fj = os.path.join(out, 'flows.json')
F = json.load(open(fj)) if os.path.exists(fj) else {}
for name in names:
    d = os.path.join(src, name)
    meta = json.load(open(os.path.join(d, 'meta.json')))
    for f in sorted(os.listdir(d)):
        if not f.endswith('.png'): continue
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(d, f), '-vf', 'scale=560:-2', '-q:v', '3', os.path.join(out, f'{name}-{f[:-4]}.jpg')], check=True)
    F[name] = {'w': 390, 'steps': len(meta) - 1,
               'taps': {str(m['i']): m['tap'] for m in meta if m.get('tap')},
               'a': sorted(int(f[:2]) for f in os.listdir(d) if f.endswith('a.png'))}
    print(name, F[name]['steps'], 'steps, taps', list(F[name]['taps']))
json.dump(F, open(fj, 'w'), ensure_ascii=False)
