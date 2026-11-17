/* Motion-graphic intro (0–6s) + global film grain / vignette.
   Uses globals from the page script: add, clamp, eo, eio, back, C. */
function buildIntro(SC){
  SC=SC||1;
  const W=['0330','0322','6333','0277','2302','0344','0312','6342','0301','0314','0289','2298',
           '0340','6352','0283','0336','0342','0305','0332','0346','0287','0328','2304','0303',
           '6325','0293','0310','0326','6361','0324'];
  const COLS=6, PER=5;
  const cols=[...Array(COLS)].map((_,c)=>{
    const ims=[...Array(PER*3)].map((_,i)=>`<img src="assets/w/${W[(c*PER+i)%W.length]}.jpg">`).join('');
    return `<div class="wc" data-c="${c}">${ims}</div>`;}).join('');
  const DOORS=[['기업',C.blue],['지역',C.red],['학교',C.purple],['체험',C.yellow]];
  const AW=230,AH=380,GAP=40,AX0=(1920-(AW*4+GAP*3))/2,AB=820,IN=26;

  const css=`<style>
  .intro{position:absolute;inset:0;overflow:hidden;background:#0c2418}
  .wall{position:absolute;left:50%;top:50%;width:2900px;height:2000px;margin:-1000px 0 0 -1450px;align-items:flex-start;display:flex;gap:18px;justify-content:center;transform-style:preserve-3d}
  .wc{display:flex;flex-direction:column;gap:18px;width:400px}
  .wc img{width:400px;height:280px;object-fit:cover;border-radius:14px;display:block}
  .wdim{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(12,36,24,.55),rgba(8,24,16,.95) 75%)}
  .big2026{position:absolute;top:50%;left:0;white-space:nowrap;font-size:520px;font-weight:900;letter-spacing:-.04em;color:transparent;-webkit-text-stroke:2px rgba(255,255,255,.14);line-height:1;margin-top:-260px}
  .ttl{position:absolute;left:0;right:0;top:290px;text-align:center}
  .ttl .k{font-size:28px;font-weight:700;letter-spacing:.32em;color:#f6d98a}
  .ttl .ln{overflow:hidden;line-height:1;padding:6px 0}
  .ttl .ln span{display:inline-block;font-size:168px;font-weight:900;letter-spacing:-.03em}
  .ttl .bars{display:flex;gap:10px;justify-content:center;margin-top:34px}
  .ttl .bars i{width:120px;height:10px;border-radius:5px;display:block;transform-origin:left}
  .ttl .kr{font-size:40px;font-weight:800;margin-top:30px;letter-spacing:.02em}
  .floor{position:absolute;inset:0}
  .arch{position:absolute;width:${AW}px;height:${AH}px;border-radius:${AW/2}px ${AW/2}px 0 0;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.45)}
  .arch .door{position:absolute;left:${IN}px;right:${IN}px;top:${IN}px;bottom:0;border-radius:${(AW-2*IN)/2}px ${(AW-2*IN)/2}px 0 0;background:linear-gradient(180deg,#fff6d8,#ffe7a8 55%,#ffd27a)}
  .arch .lab{position:absolute;left:0;right:0;top:${IN+64}px;text-align:center;font-size:40px;font-weight:900;color:rgba(0,0,0,.72)}
  .arch .p{position:absolute;left:50%;bottom:0;width:62px;height:150px;margin-left:-31px}
  .arch .p:before{content:'';position:absolute;left:14px;top:0;width:34px;height:34px;border-radius:50%;background:#1d4a32}
  .arch .p:after{content:'';position:absolute;left:0;top:40px;width:62px;height:110px;border-radius:30px 30px 0 0;background:#1d4a32}
  .beam{position:absolute;width:${AW-2*IN}px;bottom:${1080-AB}px;height:900px;transform-origin:bottom center;background:linear-gradient(0deg,rgba(255,230,160,.35),rgba(255,230,160,0));filter:blur(18px)}
  .ah{position:absolute;left:0;right:0;top:150px;text-align:center}
  .ah .a1{font-size:26px;font-weight:700;letter-spacing:.3em;color:#f6d98a}
  .ah .a2{font-size:76px;font-weight:900;margin-top:16px;letter-spacing:-.02em}
  .portal{position:absolute;overflow:hidden}
  .portal img{position:absolute;width:1920px;height:1080px;object-fit:cover}
  .pshade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,26,18,.88) 0,rgba(8,26,18,.55) 45%,rgba(8,26,18,.1) 80%)}
  .slog{position:absolute;left:120px;top:330px}
  .slog .s0{font-size:26px;font-weight:800;letter-spacing:.3em;color:#f6d98a}
  .slog .ln{overflow:hidden;line-height:1.08;padding:4px 0}
  .slog .ln b{display:inline-block;font-size:124px;font-weight:900;letter-spacing:-.03em}
  .slog .s3{font-size:36px;font-weight:700;margin-top:30px}
  .slog .s3 em{font-style:normal;color:#f6d98a;font-weight:900}
  .flash{position:absolute;inset:0;background:#fff;opacity:0;mix-blend-mode:screen}
  .leak{position:absolute;width:1400px;height:1400px;border-radius:50%;background:radial-gradient(circle,rgba(255,150,60,.55),rgba(255,90,60,0) 65%);mix-blend-mode:screen;filter:blur(20px)}
  .grain{position:absolute;inset:-50px;pointer-events:none;opacity:.075;mix-blend-mode:overlay}
  .vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.38) 100%)}
  </style>`;
  document.head.insertAdjacentHTML('beforeend',css);

  const archHTML=DOORS.map(([l,c],i)=>`<div class="beam" style="left:${AX0+i*(AW+GAP)+IN}px"></div><div class="arch" style="left:${AX0+i*(AW+GAP)}px;top:${AB-AH}px;background:${c}"><div class="door"><div class="p"></div></div><div class="lab">${l}</div></div>`).join('');
  const floorSVG=`<svg class="floor" width="1920" height="1080">${DOORS.map(([l,c],i)=>{
      const x0=AX0+i*(AW+GAP)+IN, x1=x0+AW-2*IN, cx=960, k=2.4;
      const bx0=cx+(x0-cx)*k, bx1=cx+(x1-cx)*k;
      return `<polygon points="${x0},${AB} ${x1},${AB} ${bx1},1080 ${bx0},1080" fill="${c}" opacity=".9"/>`;}).join('')}</svg>`;
  const T1='GLOCAL', T2='JOB FAIR';
  const spans=s=>[...s].map(ch=>`<span>${ch===' '?'&nbsp;':ch}</span>`).join('');
  const PI=2, px=AX0+PI*(AW+GAP)+IN, py=AB-AH+IN, pw=AW-2*IN, ph=AH-IN;

  add(0,6.35*SC,`<div class="intro">
    <div class="wall">${cols}</div><div class="wdim"></div>
    <div class="big2026">2026 GLOCAL JOB FAIR 2026 GLOCAL JOB FAIR</div>
    <div class="leak"></div>
    <div class="ttl"><div class="k">2026. 11. 11. WED · 건국대학교 GLOCAL캠퍼스</div>
      <div class="ln l1">${spans(T1)}</div><div class="ln l2">${spans(T2)}</div>
      <div class="bars"><i style="background:${C.blue}"></i><i style="background:${C.red}"></i><i style="background:${C.purple}"></i><i style="background:${C.yellow}"></i></div>
      <div class="kr">2026학년도 글로컬 잡페어</div></div>
    <div class="stage"><div class="ah"><div class="a1">기업 · 지역 · 학교 · 체험</div><div class="a2">네 개의 문이 열립니다</div></div>${floorSVG}${archHTML}</div>
    <div class="portal"><img src="assets/d/0330.jpg"><div class="pshade"></div></div>
    <div class="slog"><div class="s0">2026 GLOCAL JOB FAIR</div>
      <div class="ln"><b>충북 청년,</b></div><div class="ln"><b>내일의 문을 열다</b></div>
      <div class="s3">11.11 하루, <em class="cnt">0</em>명이 문을 열었다</div></div>
    <div class="flash"></div>
  </div>`,(n,t)=>{ t=t/SC;
    // photo wall: tilted, columns scrolling opposite ways
    const wall=n.querySelector('.wall'), wOut=eio((t-2.0)/.6);
    wall.style.transform=`perspective(1600px) rotateX(${22-6*t/6}deg) rotateZ(-12deg) scale(${1.25-.12*eo(t/4)})`;
    wall.style.opacity=clamp(t/.4)*(1-.65*wOut);
    wall.style.filter=`blur(${wOut*6}px)`;
    n.querySelectorAll('.wc').forEach((c,i)=>{const d=i%2?1:-1;c.style.transform=`translateY(${-1500+(i%2?-150:0)+d*t*90}px)`});
    const big=n.querySelector('.big2026');big.style.transform=`translateX(${-200-t*260}px)`;big.style.opacity=clamp(t/.5)*(1-clamp((t-2.2)/.4));
    const lk=n.querySelector('.leak');lk.style.left=`${-500+t*380}px`;lk.style.top=`${-500+Math.sin(t*1.3)*120}px`;lk.style.opacity=.75*clamp(t/.6)*(1-clamp((t-3.4)/.5));
    // title kinetic type
    const ttl=n.querySelector('.ttl'), out=clamp((t-1.95)/.35);
    ttl.style.display=t<2.4?'':'none';
    const k=n.querySelector('.ttl .k');k.style.opacity=clamp((t-.15)/.3)*(1-out);k.style.letterSpacing=`${.6-.28*eo((t-.15)/.8)}em`;
    n.querySelectorAll('.l1 span').forEach((s,i)=>{const a=eo((t-.3-i*.05)/.45),b=eio((t-1.95-i*.03)/.35);s.style.transform=`translateY(${(1-a)*110-b*110}%)`});
    n.querySelectorAll('.l2 span').forEach((s,i)=>{const a=eo((t-.5-i*.05)/.45),b=eio((t-2.0-i*.03)/.35);s.style.transform=`translateY(${(1-a)*110-b*110}%)`;s.style.color=i<3?'#fff':'#f6d98a'});
    n.querySelectorAll('.bars i').forEach((b,i)=>{b.style.transform=`scaleX(${eo((t-1.0-i*.08)/.35)*(1-out)})`});
    const kr=n.querySelector('.kr');kr.style.opacity=clamp((t-1.25)/.3)*(1-out);kr.style.transform=`translateY(${(1-eo((t-1.25)/.4))*20}px)`;
    // arches stage
    const st=n.querySelector('.stage');st.style.display=t>=2.1&&t<4.7?'':'none';
    const zoom=eio((t-3.55)/.95);
    st.style.transform=`scale(${1+zoom*1.6})`;st.style.transformOrigin=`${px+pw/2}px ${py+ph/2}px`;
    const ah=n.querySelector('.ah');ah.style.opacity=clamp((t-2.75)/.3)*(1-clamp((t-3.5)/.25));ah.style.transform=`translateY(${(1-eo((t-2.75)/.5))*-30}px)`;
    n.querySelectorAll('.floor polygon').forEach((p,i)=>{const a=eo((t-2.2-i*.07)/.5);p.style.transform=`scaleY(${a})`;p.style.transformOrigin=`960px ${AB}px`});
    n.querySelectorAll('.arch').forEach((a,i)=>{const r=back((t-2.25-i*.1)/.55);a.style.transform=`translateY(${(1-r)*560}px)`;
      const d=a.querySelector('.door');d.style.filter=`brightness(${1+.25*Math.sin(t*6+i)})`;
      a.querySelector('.p').style.transform=`translateY(${(1-eo((t-2.7-i*.1)/.4))*150}px)`;
      a.querySelector('.lab').style.opacity=clamp((t-2.75-i*.08)/.25);});
    n.querySelectorAll('.beam').forEach((b,i)=>{b.style.opacity=clamp((t-2.8-i*.08)/.4)*(.8+.2*Math.sin(t*5+i));b.style.transform=`scaleX(${1+.3*Math.sin(t*3+i)})`});
    // portal: doorway grows to full frame
    const pt=n.querySelector('.portal'), g=eio((t-3.6)/1.0);
    pt.style.display=t>=3.6?'':'none';
    const L=px+(-600-px)*g, Tp=py+(-700-py)*g, Wd=pw+(3120-pw)*g, Ht=(AB-py)+(2400-(AB-py))*g;
    const s0=1+zoom*1.6, cxp=px+pw/2, cyp=py+ph/2; // follow the stage zoom
    const L2=cxp+(L-cxp)*s0, T2=cyp+(Tp-cyp)*s0, W2=Wd*s0, H2=Ht*s0;
    pt.style.left=L2+'px';pt.style.top=T2+'px';pt.style.width=W2+'px';pt.style.height=H2+'px';pt.style.borderRadius=`${W2/2}px ${W2/2}px 0 0`;
    const im=pt.querySelector('img');im.style.left=-L2+'px';im.style.top=-T2+'px';im.style.transform=`scale(${1.25-.15*eo((t-3.6)/2.6)})`;
    pt.querySelector('.pshade').style.opacity=clamp((t-4.3)/.4);
    const fl=n.querySelector('.flash');fl.style.opacity=.55*Math.max(0,1-Math.abs(t-4.55)/.18);
    // slogan
    const sl=n.querySelector('.slog');sl.style.display=t>=4.4?'':'none';
    sl.querySelector('.s0').style.opacity=clamp((t-4.45)/.25);
    sl.querySelectorAll('.ln b').forEach((b,i)=>{b.style.transform=`translateY(${(1-eo((t-4.55-i*.15)/.45))*110}%)`});
    const s3=sl.querySelector('.s3');s3.style.opacity=clamp((t-5.0)/.25);s3.style.transform=`translateY(${(1-eo((t-5.0)/.4))*20}px)`;
    sl.querySelector('.cnt').textContent=Math.round(1090*eo((t-5.0)/.9)).toLocaleString('en-US');
  });

  /* Outro in the same visual language: photo shrinks back into the door, arches + slogan + thanks */
  window.buildOutro=function(S0,D){
    document.head.insertAdjacentHTML('beforeend',`<style>
    .ot{position:absolute;left:0;right:0;top:110px;text-align:center}
    .ot .s0{font-size:26px;font-weight:800;letter-spacing:.32em;color:#f6d98a}
    .ot .ln{overflow:hidden;line-height:1.1;padding:6px 0;margin-top:10px}
    .ot .ln b{display:inline-block;font-size:92px;font-weight:900;letter-spacing:-.03em}
    .ot .s3{font-size:32px;font-weight:700;margin-top:14px;opacity:.95}
    .ocred{position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(0deg,rgba(6,20,13,.92) 35%,rgba(6,20,13,0));display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding-bottom:34px;font-size:20px;font-weight:600;line-height:1.7;color:rgba(255,255,255,.85)}
    .ocred b{color:#f6d98a;font-weight:800;letter-spacing:.08em}
    .oblk{position:absolute;inset:0;background:#000;opacity:0}
    </style>`);
    add(S0,S0+D+.1,`<div class="intro">
      <div class="wall">${cols}</div><div class="wdim"></div><div class="leak"></div>
      <div class="stage">${floorSVG}${archHTML}</div>
      <div class="portal"><img src="assets/d/2302.jpg"><div class="pshade" style="opacity:.35"></div></div>
      <div class="ot"><div class="s0">2026 GLOCAL JOB FAIR</div>
        <div class="ln"><b>충북 청년, 내일의 문을 열다</b></div>
        <div class="s3">함께해 주신 모든 분께 감사드립니다.</div></div>
      <div class="ocred"><div>주최 · 지원&nbsp;&nbsp;건국대학교 GLOCAL캠퍼스 · 대학혁신지원사업 · KU ANCHOR사업단 · 고용노동부</div><b>glocaljobfair.kr</b></div>
      <div class="oblk"></div>
    </div>`,(n,t)=>{
      n.style.opacity=clamp(t/.4);
      const wall=n.querySelector('.wall');
      wall.style.transform=`perspective(1600px) rotateX(18deg) rotateZ(-12deg) scale(${1.12+.04*t/D})`;
      wall.style.opacity=.4;wall.style.filter='blur(5px)';
      n.querySelectorAll('.wc').forEach((c,i)=>{const d=i%2?1:-1;c.style.transform=`translateY(${-1500+(i%2?-150:0)+d*t*60}px)`});
      const lk=n.querySelector('.leak');lk.style.left=`${900-t*120}px`;lk.style.top=`${-600+Math.sin(t*.8)*100}px`;lk.style.opacity=.5;
      // reverse portal: full-frame photo shrinks back into the 학교 door
      const g=1-eio(t/1.6), s0=1+g*1.6, cxp=px+pw/2, cyp=py+ph/2;
      const st=n.querySelector('.stage');st.style.transform=`scale(${s0})`;st.style.transformOrigin=`${cxp}px ${cyp}px`;
      const L=px+(-600-px)*g, Tp=py+(-700-py)*g, Wd=pw+(3120-pw)*g, Ht=(AB-py)+(2400-(AB-py))*g;
      const L2=cxp+(L-cxp)*s0, T2=cyp+(Tp-cyp)*s0, W2=Wd*s0, H2=Ht*s0;
      const pt=n.querySelector('.portal');
      pt.style.left=L2+'px';pt.style.top=T2+'px';pt.style.width=W2+'px';pt.style.height=H2+'px';pt.style.borderRadius=`${W2/2}px ${W2/2}px 0 0`;
      pt.style.opacity=1-clamp((t-1.5)/.5);pt.style.display=t<2.1?'':'none';
      const im=pt.querySelector('img');im.style.left=-L2+'px';im.style.top=-T2+'px';
      n.querySelectorAll('.floor polygon').forEach(p=>{p.style.transform='none'});
      n.querySelectorAll('.arch').forEach((a,i)=>{
        const d=a.querySelector('.door');d.style.filter=`brightness(${1+.2*Math.sin(t*4+i)+.6*eio((t-D+2.2)/1.4)})`;
        a.style.transform=`translateY(${Math.sin(t*1.6+i*.8)*4}px)`;
        a.querySelector('.lab').style.opacity=1;});
      n.querySelectorAll('.beam').forEach((b,i)=>{b.style.opacity=(.75+.25*Math.sin(t*3+i))*(1+eio((t-D+2.2)/1.4));b.style.transform=`scaleX(${1+.3*Math.sin(t*2+i)})`});
      const ot=n.querySelector('.ot');
      ot.querySelector('.s0').style.opacity=clamp((t-1.6)/.4);
      ot.querySelector('.s0').style.letterSpacing=`${.6-.28*eo((t-1.6)/1.0)}em`;
      ot.querySelector('.ln b').style.transform=`translateY(${(1-eo((t-1.9)/.7))*110}%)`;
      const s3=ot.querySelector('.s3');s3.style.opacity=clamp((t-2.9)/.5);s3.style.transform=`translateY(${(1-eo((t-2.9)/.6))*20}px)`;
      const cr=n.querySelector('.ocred');cr.style.opacity=clamp((t-3.6)/.6);
      n.querySelector('.oblk').style.opacity=clamp((t-(D-1.0))/1.0);
    });
  };
}
function buildGrain(){
  const cv=document.createElement('canvas');cv.width=cv.height=256;const x=cv.getContext('2d'),im=x.createImageData(256,256);
  let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let i=0;i<im.data.length;i+=4){const v=r()*255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}
  x.putImageData(im,0,0);const url=cv.toDataURL();
  add(0,9999,`<div class="L" style="pointer-events:none"><div class="grain" style="background-image:url(${url})"></div><div class="vig"></div></div>`,(n,t)=>{
    const f=Math.floor(t*24);n.firstChild.style.backgroundPosition=`${(f*73)%256}px ${(f*151)%256}px`;
  });
}
