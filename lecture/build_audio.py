import json, wave, numpy as np, os
from script import SCENES, subtitle
from tts import say

FPS = 30
SR = 44100
GAP = 0.3      # 문장 사이
SCENE_GAP = 0.8 # 장면 사이
LEAD = 0.8      # 시작 여백
os.makedirs("wav", exist_ok=True)

audio = [np.zeros(int(LEAD * SR), np.int16)]
t = LEAD
timeline = []
for si, (sid, sents) in enumerate(SCENES):
    scene = {"id": sid, "start": t, "sents": []}
    for k, s in enumerate(sents):
        f = f"wav/{si:02d}_{k:02d}.wav"
        if not os.path.exists(f):
            say(s, f, sid=1, speed=1.15, steps=10)
        w = wave.open(f); x = np.frombuffer(w.readframes(w.getnframes()), np.int16)
        assert w.getframerate() == SR
        d = len(x) / SR
        scene["sents"].append({"start": t, "end": t + d, "text": subtitle(s)})
        audio.append(x); t += d
        g = GAP if k < len(sents) - 1 else SCENE_GAP
        audio.append(np.zeros(int(g * SR), np.int16)); t += g
    scene["end"] = t
    timeline.append(scene)
audio.append(np.zeros(int(1.5 * SR), np.int16)); t += 1.5
a = np.concatenate(audio)
w = wave.open("narration.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes()); w.close()

# 립싱크용 프레임별 음량 envelope
af = a.astype(np.float32) / 32768
hop = SR // FPS
n = len(af) // hop
env = np.array([np.sqrt(np.mean(af[i*hop:(i+1)*hop] ** 2)) for i in range(n)])
env = env / (np.percentile(env[env > 0.01], 95) + 1e-9)
env = np.clip(env, 0, 1)
json.dump({"duration": t, "fps": FPS, "scenes": timeline, "env": [round(float(v), 3) for v in env]},
          open("timeline.json", "w"), ensure_ascii=False)
print("total", round(t, 1), "sec")
for s in timeline: print(s["id"], round(s["start"], 1), round(s["end"] - s["start"], 1))
