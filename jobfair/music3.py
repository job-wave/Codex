# Bright, upbeat background track: D major, 116 BPM.
# Bouncy piano, bell melody, warm pad, octave bass, soft kick + tonal "clap".
# No noise percussion; every note has a smooth release; gentle low-pass.
import sys, wave, numpy as np
SR=44100; BPM=116; B=60/BPM
L=float(sys.argv[1]) if len(sys.argv)>1 else 60.0
OUT=sys.argv[2] if len(sys.argv)>2 else 'music3.wav'
INTRO=float(sys.argv[3]) if len(sys.argv)>3 else 9.0   # drums/bass enter here
END=L-4.0                                                # ring-out from here
N=int(SR*L); out=np.zeros((N,2))
mf=lambda m:440*2**((m-69)/12)

def put(sig,t,pan=0.0,g=1.0):
    i=int(t*SR)
    if i>=N or i<0: return
    j=min(N,i+len(sig)); s=sig[:j-i]*g
    out[i:j,0]+=s*(1-pan*.6); out[i:j,1]+=s*(1+pan*.6)

def fade(n,a,r):
    e=np.ones(n); a=max(1,int(a*SR)); r=max(1,int(r*SR))
    e[:a]=np.linspace(0,1,a); e[-r:]*=np.linspace(1,0,r)**2; return e

def piano(f,dur,v=1.0):
    n=int(dur*SR); t=np.arange(n)/SR
    s=sum(a*np.sin(2*np.pi*f*k*t)*np.exp(-t*(1.8+1.1*k)) for k,a in enumerate([1,.5,.28,.14,.07],1))
    s+=.25*np.sin(2*np.pi*f*1.0025*t)*np.exp(-t*2)
    return s*fade(n,.004,.1)*v

def bell(f,dur):
    n=int(dur*SR); t=np.arange(n)/SR
    s=np.sin(2*np.pi*f*t)*np.exp(-t*2.2)+.35*np.sin(2*np.pi*f*2*t)*np.exp(-t*4)+.12*np.sin(2*np.pi*f*3*t)*np.exp(-t*7)
    return s*fade(n,.003,.15)

def pad(fs,dur):
    n=int(dur*SR); t=np.arange(n)/SR
    s=sum(np.sin(2*np.pi*f*t+.3*np.sin(2*np.pi*.3*t))+.4*np.sin(2*np.pi*f*1.004*t) for f in fs)
    return s*fade(n,.4,.6)

def bass(f,dur):
    n=int(dur*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)+.25*np.sin(4*np.pi*f*t))*np.exp(-t*3)*fade(n,.005,.06)

def kick():
    n=int(.35*SR); t=np.arange(n)/SR; f=48+70*np.exp(-t*28)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*10)*fade(n,.002,.05)

def clap():   # tonal, soft "tock" instead of noise snare
    n=int(.18*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*190*t)+.5*np.sin(2*np.pi*380*t))*np.exp(-t*28)*fade(n,.002,.04)

# D - A - Bm - G   (I-V-vi-IV)
prog=[([62,66,69],50),([61,64,69],45),([62,66,71],47),([62,67,71],43)]
# bell melody, 2 bars per phrase (MIDI, beat offset, length in beats)
mel=[[(74,0,1),(76,1,.5),(78,1.5,1.5),(76,3,1)],[(73,0,1.5),(74,1.5,.5),(76,2,2)],
     [(74,0,1),(78,1,1),(81,2,1.5),(78,3.5,.5)],[(79,0,1),(78,1,1),(76,2,2)]]
bars=int(np.ceil(L/(4*B)))
for bar in range(bars):
    t0=bar*4*B
    if t0>=END: break
    ch,bn=prog[bar%4]; main=t0>=INTRO-1e-6
    # piano: bouncy 8ths, syncopated accents
    pat=[0,2,1,2,0,2,1,3]
    for k in range(8):
        idx=pat[k]; m=ch[idx%3]+12*(idx//3)+12
        v=1.0 if k in (0,3,6) else .7
        put(piano(mf(m),1.0,v),t0+k*B/2,pan=.3*(1 if k%2 else -1),g=.11)
    put(pad([mf(m) for m in ch],4*B+.6),t0,g=.024 if main else .018)
    if main:
        for (m,o,d) in mel[bar%4]:
            put(bell(mf(m+12),d*B+.8),t0+o*B,pan=.15,g=.07)
        for k in range(8):   # octave-bouncing bass
            put(bass(mf(bn+(12 if k%2 else 0)),B/2),t0+k*B/2,g=.17)
        for k in range(4): put(kick(),t0+k*B,g=.32)
        for k in (1,3): put(clap(),t0+k*B,g=.10)
    elif t0>=INTRO-4*B-1e-6:   # one-bar lift into the main section
        for k in range(4): put(bell(mf(ch[k%3]+24),B+.5),t0+k*B,g=.04+.01*k)
# ring-out
put(pad([mf(m) for m in [62,66,69,74]],4.2),END,g=.03)
put(piano(mf(74),4.0),END,g=.11); put(bell(mf(86),3.5),END,g=.07); put(piano(mf(50),4.0),END,g=.12)

for c in range(2):   # gentle low-pass ~8 kHz
    X=np.fft.rfft(out[:,c]); fr=np.fft.rfftfreq(N,1/SR)
    X*=1/np.sqrt(1+(fr/8000)**4); out[:,c]=np.fft.irfft(X,N)
t=np.arange(N)/SR
out*=np.clip((L-t)/3.0,0,1)[:,None]*np.clip(t/.6,0,1)[:,None]
out/=np.abs(out).max()/0.85
w=wave.open(OUT,'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
