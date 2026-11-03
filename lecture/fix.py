import sherpa_onnx, wave, numpy as np, difflib, re, shutil, os
from script import SCENES
from tts import say
A='/tmp/tts/sherpa-onnx-zipformer-korean-2024-06-24'
r=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f'{A}/encoder-epoch-99-avg-1.int8.onnx',decoder=f'{A}/decoder-epoch-99-avg-1.int8.onnx',joiner=f'{A}/joiner-epoch-99-avg-1.int8.onnx',tokens=f'{A}/tokens.txt',num_threads=8)
def norm(s):
    s=s.replace('에이아이','AI').replace('AI','에이아이')
    return re.sub(r'[^가-힣0-9]','',s)
def asr(f):
    w=wave.open(f);x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
    s=r.create_stream();s.accept_waveform(w.getframerate(),x);r.decode_stream(s);return s.result.text
def score(f,t): return difflib.SequenceMatcher(None,norm(asr(f)),norm(t)).ratio()
for si,(sid,sents) in enumerate(SCENES):
    for k,t in enumerate(sents):
        f=f'wav/{si:02d}_{k:02d}.wav'; best=score(f,t)
        tries=0
        while best<0.93 and tries<5:
            tries+=1
            say(t,'tmp.wav',sid=4,speed=1.0,steps=[16,10,16,12,16][tries-1])
            sc=score('tmp.wav',t)
            if sc>best: best=sc; shutil.copy('tmp.wav',f)
        print(f, round(best,3), tries)
