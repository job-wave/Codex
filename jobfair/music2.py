# Warm, soft background track (piano arpeggio + pad + sub bass + soft kick).
# No hi-hats/noise, every note has a smooth release, global low-pass.
import sys, wave, numpy as np
SR=44100; BPM=100; B=60/BPM
L=float(sys.argv[1]) if len(sys.argv)>1 else 60.0
OUT=sys.argv[2] if len(sys.argv)>2 else 'music2.wav'
N=int(SR*L); out=np.zeros((N,2))
mf=lambda m:440*2**((m-69)/12)

def put(sig,t,pan=0.0,g=1.0):
    i=int(t*SR)
    if i>=N: return
    j=min(N,i+len(sig)); s=sig[:j-i]*g
    out[i:j,0]+=s*(1-pan*.6); out[i:j,1]+=s*(1+pan*.6)

def fade(n,a,r):
    e=np.ones(n); a=int(a*SR); r=int(r*SR)
    e[:a]=np.linspace(0,1,a); e[-r:]*=np.linspace(1,0,r)**2; return e

def piano(f,dur,vel=1.0):
    n=int(dur*SR); t=np.arange(n)/SR
    s=sum(a*np.sin(2*np.pi*f*k*t*(1+.0004*k))*np.exp(-t*(1.2+.9*k)) for k,a in enumerate([1,.45,.22,.1,.05],1))
    s+= .3*np.sin(2*np.pi*f*1.002*t)*np.exp(-t*1.5)   # slight chorus
    return s*fade(n,.006,.12)*vel

def pad(fs,dur):
    n=int(dur*SR); t=np.arange(n)/SR
    s=sum(np.sin(2*np.pi*f*t+.4*np.sin(2*np.pi*.25*t))+.5*np.sin(2*np.pi*f*1.003*t) for f in fs)
    return s*fade(n,.6,.8)

def bass(f,dur):
    n=int(dur*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)+.2*np.sin(4*np.pi*f*t))*np.exp(-t*.8)*fade(n,.01,.15)

def kick():
    n=int(.4*SR); t=np.arange(n)/SR; f=45+60*np.exp(-t*25)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)*fade(n,.003,.05)

# C - G/B - Am - F  (I-V-vi-IV), voicings
prog=[([60,64,67],48),([59,62,67],47),([57,60,64],45),([53,57,60],41)]
bars=int(np.ceil(L/(4*B)))
END=L-6
for bar in range(bars):
    t0=bar*4*B; ch,bn=prog[bar%4]
    if t0>=L: break
    main= 6<=t0<END
    # piano arpeggio, 8ths, up-down
    pat=[0,1,2,1+3,2,1,0+3,1]
    for k in range(8):
        tt=t0+k*B/2
        if tt>=L-1.5: break
        idx=pat[k]; m=ch[idx%3]+12*(1+idx//3)
        put(piano(mf(m),1.6,.9 if k%2==0 else .7),tt,pan=.35*(1 if k%2 else -1),g=.10 if main else .08)
    # top melody note on beat 1 in main section
    if main:
        put(piano(mf(ch[2]+24),2.4,1.0),t0,g=.06)
    put(pad([mf(m) for m in ch],4*B+1.0),t0,g=.028 if main else .022)
    if t0>=6-1e-6 and t0<END:
        put(bass(mf(bn),4*B),t0,g=.22)
        for k in (0,2): put(kick(),t0+k*B,g=.30)
# final chord ring-out
put(pad([mf(m) for m in [60,64,67,72]],6.0),END,g=.03)
put(piano(mf(72),5.5,1.0),END,g=.08); put(piano(mf(48),5.5,1.0),END,g=.10)

# global low-pass (~6 kHz smooth roll-off) via FFT
for c in range(2):
    X=np.fft.rfft(out[:,c]); fr=np.fft.rfftfreq(N,1/SR)
    X*=1/np.sqrt(1+(fr/6000)**4); out[:,c]=np.fft.irfft(X,N)
t=np.arange(N)/SR
out*=np.clip((L-t)/3.5,0,1)[:,None]*np.clip(t/1.0,0,1)[:,None]
out/=np.abs(out).max()/0.85
w=wave.open(OUT,'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
