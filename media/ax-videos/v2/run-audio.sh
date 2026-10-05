#!/bin/bash
# v2 음성 4편 만들기 + 받아쓰기 (FF=ffmpeg 경로)
set -e
cd "$(dirname "$0")"
L=../lib
python3 $L/voice2.py film-1 ../video-1/assets/voice.mp3
python3 $L/voice2.py film-2 ../video-2/assets/voice-orig.mp3 --pieces "0-198.41,223.27-243.085,198.41-215.84,215.84-223.27,251.75-307.51"
python3 $L/voice2.py real-ep1 ../real-ep1/assets/voice-orig.mp3
python3 $L/voice2.py real-ep2 ../real-ep2/assets/voice-orig.mp3
for d in real-ep1 real-ep2 film-1 film-2; do python3 $L/asr2.py $d; done
