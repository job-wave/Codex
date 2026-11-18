# Acoustic-pop background: plucked guitar strums (Karplus-Strong), marimba melody,
# warm bass, soft kick + finger-snap-like tonal tick. G major, 120 BPM.
# No noise percussion, smooth note releases, gentle low-pass.
import sys, wave, numpy as np
SR=44100; BPM=120; B=60/BPM
L=float(sys.argv[1]) if len(sys.argv)>1 else 76.5
OUT=sys.argv[2] if len(sys.argv)>2 else 'music4.wav'
INTRO=float(sys.argv[3]) if len(sys.argv)>3 else 11.0
END=L-3.5
N=int(SR*L); out=np.zeros((N,2)); rng=np.random.default_rng(3)
mf=lambda m:440*2**((m-69)/12)

def put(sig,t,pan=0.0,g=1.0):
    i=int(t*SR)
    if i>=N or i<0: return
    j=min(N,i+len(sig)); s=sig[:j-i]*g
    out[i:j,0]+=s*(1-pan*.6); out[i:j,1]+=s*(1+pan*.6)

def fade(n,a,r):
    e=np.ones(n); a=max(1,int(a*SR)); r=max(1,int(r*SR))
    e[:a]=np.linspace(0,1,a); e[-r:]*=np.linspace(1,0,r)**2; return e

def pluck(f,dur,bright=.5,decay=.996):
    """Karplus-Strong string, computed one period-block at a time."""
    n=int(dur*SR); P=max(2,int(SR/f)); y=np.zeros(n+P+1)
    exc=rng.uniform(-1,1,P)
    for _ in range(2): exc=(exc+np.roll(exc,1))*.5          # soften the attack
    y[:P]=exc*bright+exc.mean()*(1-bright)
    k=P
    while k<n:
        m=min(P,n-k); prev=y[k-P:k-P+m+1]
        y[k:k+m]=decay*.5*(prev[:-1]+prev[1:]); k+=m
    return y[:n]*fade(n,.002,.08)

def strum(chord,t,down=True,g=.07):
    notes=chord if down else chord[::-1]
    for i,m in enumerate(notes):
        put(pluck(mf(m),1.6,.6,.997),t+i*.012,pan=-.25+.1*i,g=g)

def marimba(f,dur):
    n=int(dur*SR); t=np.arange(n)/SR
    s=np.sin(2*np.pi*f*t)*np.exp(-t*4.5)+.25*np.sin(2*np.pi*f*4*t)*np.exp(-t*14)
    return s*fade(n,.003,.08)

def bass(f,dur):
    n=int(dur*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)+.3*np.sin(4*np.pi*f*t))*np.exp(-t*2.5)*fade(n,.006,.06)

def kick():
    n=int(.32*SR); t=np.arange(n)/SR; f=50+65*np.exp(-t*30)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*11)*fade(n,.002,.04)

def tick():
    n=int(.09*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*1100*t)+.6*np.sin(2*np.pi*1650*t))*np.exp(-t*60)*fade(n,.001,.02)

def pad(fs,dur):
    n=int(dur*SR); t=np.arange(n)/SR
    return sum(np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*f*1.004*t) for f in fs)*fade(n,.5,.6)

# G - D - Em - C, guitar voicings (low to high)
prog=[([55,59,62,67,71,79],43),([54,57,62,66,69,74],38),([52,59,64,67,71,76],40),([48,55,60,64,67,72],36)]
# strum pattern per bar: (beat, down?, accent)
pat=[(0,1,1),(1,1,.7),(1.5,0,.55),(2.5,0,.6),(3,1,.75),(3.5,0,.55)]
mel=[[(79,0,1),(81,1,.5),(83,1.5,1),(81,2.5,.5),(79,3,1)],
     [(78,0,1.5),(76,1.5,.5),(78,2,1),(81,3,1)],
     [(83,0,1),(81,1,.5),(79,1.5,1),(78,2.5,.5),(76,3,1)],
     [(76,0,1),(79,1,1),(81,2,1.5),(79,3.5,.5)]]
bars=int(np.ceil(L/(4*B)))
for bar in range(bars):
    t0=bar*4*B
    if t0>=END: break
    ch,bn=prog[bar%4]; main=t0>=INTRO-1e-6
    if main:
        for (bt,d,a) in pat: strum(ch,t0+bt*B,bool(d),g=.06*a)
        for (m,o,d) in mel[bar%4]: put(marimba(mf(m),d*B+.6),t0+o*B,pan=.25,g=.09)
        for k,o in enumerate([0,1.5,2,3]): put(bass(mf(bn),B*.9),t0+o*B,g=.18)
        for k in range(4): put(kick(),t0+k*B,g=.26)
        for k in (1,3): put(tick(),t0+k*B,pan=.3,g=.035)
        put(pad([mf(m) for m in ch[1:4]],4*B+.5),t0,g=.012)
    else:   # intro: gentle arpeggiated guitar + pad, building
        for k in range(8):
            put(pluck(mf(ch[[0,2,3,4,5,4,3,2][k]]),1.4,.5,.997),t0+k*B/2,pan=.2*(1 if k%2 else -1),g=.16)
        put(pad([mf(m) for m in ch[1:4]],4*B+.5),t0,g=.03)
        if t0>=INTRO-4*B-1e-6:
            for k in range(4): put(marimba(mf(ch[3+k%3]+12),B+.4),t0+k*B,g=.08+.015*k)
# ring-out: last G chord strummed slowly
strum(prog[0][0],END,True,g=.09); put(marimba(mf(79),3.0),END,g=.08); put(bass(mf(43),3.0),END,g=.18)
put(pad([mf(m) for m in [59,62,67]],3.5),END,g=.016)

for c in range(2):   # gentle low-pass ~7.5 kHz
    X=np.fft.rfft(out[:,c]); fr=np.fft.rfftfreq(N,1/SR)
    X*=1/np.sqrt(1+(fr/7500)**4); out[:,c]=np.fft.irfft(X,N)
t=np.arange(N)/SR
out*=np.clip((L-t)/3.0,0,1)[:,None]*np.clip(t/.6,0,1)[:,None]
out/=np.abs(out).max()/0.85
w=wave.open(OUT,'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
