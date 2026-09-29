# 목소리 없는(자막 전용) 영상의 시간표 만들기 — 녹음 대신 '읽는 속도'로 자막 시간을 정한다.
# spoken.txt(빈 줄 = 장면 묶음, 줄 = 문장, | = 자막 끊는 곳) + edits.json(gapBefore = 멈춤·제목 자리)
#  → timing.json(lines·cues) · asr-fast.json(단어 시간, 글자 수 비례) · sil-fast.json(자막 사이 쉼)
# 영상 1·2(녹음판)와 같은 lib.mjs 가 그대로 읽는다.
import json, re, sys

CPS = float(sys.argv[1]) if len(sys.argv) > 1 else 7.5   # 초당 읽는 글자 수(한글 기준)
LEAD, MIN = 0.5, 1.5                                      # 자막마다 기본 여유 · 최소 길이
GAP_PART, GAP_LINE, GAP_BLOCK = 0.15, 0.35, 0.55          # 쉼표 · 문장 · 장면 (녹음판 0.2 / 0.35 / 0.45 와 비슷하게)
START = 0.35

def weight(t):
    w = 0.0
    for ch in t:
        if re.match(r'[가-힣]', ch): w += 1
        elif re.match(r'[A-Za-z0-9]', ch): w += 0.55
        elif ch in ',.?!“”‘’': w += 0.25
    return w

blocks = [[l.strip() for l in b.strip().split('\n') if l.strip()] for b in open('spoken.txt', encoding='utf-8').read().split('\n\n') if b.strip()]
E = json.load(open('edits.json', encoding='utf-8'))
gap_before = {(g['block'], g['line']): g['sec'] for g in E.get('gapBefore', [])}

t = START
lines, cues, segs, sil = [], [], [], []
for bi, blk in enumerate(blocks, 1):
    for li, line in enumerate(blk, 1):
        if bi > 1 or li > 1:
            g = gap_before.get((bi, li), GAP_LINE if li > 1 else GAP_BLOCK)
            sil.append([round(t, 3), round(t + g, 3)])
            t += g
        parts = [p.strip() for p in line.split('|')]
        l0 = t
        for pi, part in enumerate(parts):
            if pi:
                sil.append([round(t, 3), round(t + GAP_PART, 3)])
                t += GAP_PART
            d = max(MIN, LEAD + weight(part) / CPS)
            c0 = t
            cues.append({'block': bi, 'line': li, 'part': pi, 'text': part, 'start': round(c0, 2), 'end': round(c0 + d, 2)})
            # 단어 시간 — 자막 안에서 글자 수에 비례해 나눈다(장면 안 요소를 해당 단어에 맞춰 띄우는 데 쓴다)
            ws = part.split(' ')
            tot = sum(max(weight(w), 0.5) for w in ws)
            x, words = c0 + 0.1, []
            for w in ws:
                dw = (d - 0.25) * max(weight(w), 0.5) / tot
                words.append({'s': round(x, 3), 'e': round(x + dw, 3), 'w': ' ' + w})
                x += dw
            segs.append({'start': round(c0, 2), 'end': round(c0 + d, 2), 'text': part, 'words': words})
            t = c0 + d
        lines.append({'block': bi, 'line': li, 'text': ' '.join(parts), 'start': round(l0, 2), 'end': round(t, 2)})

json.dump({'lines': lines, 'cues': cues, 'keys': {}, 'audioEnd': round(t, 2), 'matched': 0, 'total': 0}, open('timing.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(segs, open('asr-fast.json', 'w', encoding='utf-8'), ensure_ascii=False)
json.dump(sil, open('sil-fast.json', 'w'))
print(f'자막 {len(cues)}개 · 문장 {len(lines)}개 · 끝 {t:.1f}초 (읽기 {CPS}자/초)')
