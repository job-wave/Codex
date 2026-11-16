# 120 BPM 업비트 배경음 합성 (60s). 0-6s 인트로, 6s 드롭, 54s 이후 아웃트로.
import numpy as np, wave
import sys
SR=44100; BPM=120; B=60/BPM; L=float(sys.argv[1]) if len(sys.argv)>1 else 60.0; OUT=sys.argv[2] if len(sys.argv)>2 else "music.wav"; END=L-6; N=int(SR*L)
out=np.zeros((N,2))
def put(sig,t,pan=0.0,g=1.0):
    i=int(t*SR); j=min(N,i+len(sig)); s=sig[:j-i]*g
    out[i:j,0]+=s*(1-pan)/1; out[i:j,1]+=s*(1+pan)/1
def env(n,a=0.005,d=0.3):
    t=np.arange(n)/SR; return np.minimum(1,t/a)*np.exp(-t/d)
def note(f,dur,d=0.25,h=(1,.5,.25,.12)):
    n=int(dur*SR); t=np.arange(n)/SR
    return sum(a*np.sin(2*np.pi*f*(k+1)*t) for k,a in enumerate(h))*env(n,0.004,d)
def kick():
    n=int(.35*SR);t=np.arange(n)/SR;f=50+110*np.exp(-t*30)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*8)
rng=np.random.default_rng(1)
def noise(dur,d,hp=True):
    n=int(dur*SR);x=rng.standard_normal(n)
    if hp:x=np.diff(x,prepend=0)
    return x*env(n,0.001,d)
mf=lambda m:440*2**((m-69)/12)
# I-V-vi-IV in D major: D A Bm G
prog=[[62,66,69,74],[61,64,69,73],[59,62,66,71],[59,62,67,71]]
bass=[38,33,35,31]
bars=int(L/(4*B))
for bar in range(bars):
    t0=bar*4*B; ch=prog[bar%4]; drop= t0>=6-1e-6 and t0<END
    intro=t0<6
    # pluck arpeggio 8ths
    pat=[0,1,2,3,2,1,2,3]
    for k in range(8):
        f=mf(ch[pat[k]]+12); put(note(f,.5,.18,(1,.35,.15)),t0+k*B/2,pan=.25*(1 if k%2 else -1),g=.07 if drop else .05)
    # pad
    n=int(4*B*SR); tt=np.arange(n)/SR
    pad=sum(np.sin(2*np.pi*mf(m)*tt+0.3*np.sin(2*np.pi*.5*tt)) for m in ch[:3])
    pad*=np.minimum(1,tt/.4)*np.minimum(1,(4*B-tt)/.4)
    put(pad,t0,g=.022)
    if t0>=END: continue
    # hats
    for k in range(8):
        put(noise(.08,.025 if k%2 else .015),t0+k*B/2+ (0 if k%2 else 0),pan=.3,g=.06 if k%2 else .035)
    if intro:
        if t0>=4*B*2:  # build: snare roll into drop
            for k in range(16): put(noise(.1,.05,False),t0+k*B/4,g=.03+.05*k/16)
        continue
    for k in range(4): put(kick(),t0+k*B,g=.55)
    for k in (1,3): put(noise(.25,.09,False),t0+k*B,g=.14); put(noise(.2,.05),t0+k*B,g=.08)
    for k in range(8):
        f=mf(bass[bar%4]+ (12 if k in (3,7) else 0))
        put(note(f,B/2,.15,(1,.3)),t0+k*B/2,g=.16)
# sidechain-ish duck on kicks after drop
t=np.arange(N)/SR; ph=(t%B)/B; duck=np.where((t>=6)&(t<END),0.55+0.45*np.minimum(1,ph/0.35),1)
out[:,0]*=duck; out[:,1]*=duck
# crash at drop
put(noise(2.0,.6),6.0,g=.06)
fade=np.clip((L-t)/3.0,0,1); out*=fade[:,None]; out[:int(.02*SR)]*=np.linspace(0,1,int(.02*SR))[:,None]
out/=np.abs(out).max()/0.89
w=wave.open(OUT,'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
