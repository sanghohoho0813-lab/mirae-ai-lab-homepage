#!/bin/bash
# v2 영상 4편 전체 렌더(FF=ffmpeg 경로) — 장면 파일을 다시 만들고 renders/final.mp4 로
set -e
cd "$(dirname "$0")"
for d in real-ep1 real-ep2 film-1 film-2; do
  (cd $d && node build.mjs && WORKERS=3 node ../../lib/reels-render.mjs . render)
done
