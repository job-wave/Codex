"""Render JOBWAVE's aligned, code-native 60-second silent motion film."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math, subprocess, argparse
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/media'
W,H,FPS=1280,720,24
INK='#20231f'; LIME='#d5f861'; PAPER='#f8f9f5'; GRAY='#8b9282'
FONT=Path('/root/.local/share/fonts/Pretendard-Regular.ttf'); BOLD=FONT.with_name('Pretendard-Bold.ttf')
# Shared margins, drawing center and footer anchors for every chapter.
LEFT,RIGHT,CX,CY=60,1220,970,350
fonts={}
def font(n,b=False):
    k=(n,b)
    if k not in fonts: fonts[k]=ImageFont.truetype(str(BOLD if b else FONT),n)
    return fonts[k]
def ease(x):
    x=max(0,min(1,x)); return 1-(1-x)**3
scenes=[(0,10,'01 / CAMPUS','입학은 했는데,','어디로 가야 할까?','수많은 가능성 앞에서, 나의 첫 방향 찾기',PAPER,INK),
(10,22,'02 / DISCOVER','나를 이해하면,','방향이 보입니다.','관심 · 가치 · 경험에서 나만의 기준을 찾다',INK,PAPER),
(22,34,'03 / BUILD','막연한 고민을,','오늘의 실행으로.','학년별 계획에 작은 경험을 하나씩 쌓다',PAPER,INK),
(34,46,'04 / CONNECT','쌓아온 경험이','기회와 연결됩니다.','경험 기록 → 지원 준비 → 나에게 맞는 공고',LIME,INK),
(46,56,'05 / GROW','첫 취업을 넘어,','다음 커리어까지.','업무 성과를 기록하고, 성장과 이직을 설계하다',INK,PAPER),
(56,60,'YOUR NEXT WAVE','나의 다음을','만드는 곳.','진로의 시작부터, 커리어의 다음까지',LIME,INK)]
def frame(t):
    idx=next((i for i,s in enumerate(scenes) if s[0]<=t<s[1]),5)
    start,end,k,a,b,sub,bg,fg=scenes[idx]; u=t-start; v=u/(end-start)
    im=Image.new('RGB',(W,H),bg); d=ImageDraw.Draw(im)
    def text(x,y,s,n=17,c=fg,bold=False,align='left'):
        # Position by the actual ink bounds, not the font's ascender/leading.
        f=font(n,bold); x0,y0,x1,y1=d.textbbox((0,0),s,font=f)
        if align=='center': pos=(x-(x0+x1)/2,y-(y0+y1)/2)
        elif align=='top-center': pos=(x-(x0+x1)/2,y-y0)
        elif align=='right': pos=(x-x1,y-y0)
        else: pos=(x-x0,y-y0)
        d.text(pos,s,font=f,fill=c)
    def line(pts,c=fg,w=4): d.line(pts,fill=c,width=w,joint='curve')
    def circle(x,y,r,c):
        if r>0:d.ellipse((x-r,y-r,x+r,y+r),fill=c)
    def arrow(tail,tip,c=fg,shaft=5,head=21):
        # A single joined polygon eliminates protruding diagonal stroke caps.
        dx,dy=tip[0]-tail[0],tip[1]-tail[1]; length=math.hypot(dx,dy)
        ux,uy=dx/length,dy/length; nx,ny=-uy,ux
        bx,by=tip[0]-ux*head,tip[1]-uy*head
        d.polygon([(tail[0]+nx*shaft/2,tail[1]+ny*shaft/2),(bx+nx*shaft/2,by+ny*shaft/2),(bx+nx*head/2,by+ny*head/2),tip,(bx-nx*head/2,by-ny*head/2),(bx-nx*shaft/2,by-ny*shaft/2),(tail[0]-nx*shaft/2,tail[1]-ny*shaft/2)],fill=c)
    text(LEFT,48,'JOBWAVE',29,fg,True)
    text(RIGHT,54,'YOUR NEXT MOVE',12,fg,True,'right')
    x=LEFT+24*(1-ease(u/1.1))
    text(x,194,k,14,GRAY if idx in [0,1,2,4] else fg,True)
    text(x,247,a,53,fg,True); text(x,316,b,53,fg,True)
    text(LEFT,425,sub,20)
    if idx==0:
        circle(CX,CY,170,LIME)
        # Center the student within the left half; branches stay inside the circle.
        sx=930; circle(sx,303,28,INK)
        line([(sx,334),(sx,420)],INK,11)
        line([(sx,354),(sx-38,383)],INK,9);line([(sx,354),(sx+38,378)],INK,9)
        line([(sx,417),(sx-25,466)],INK,10);line([(sx,417),(sx+25,466)],INK,10)
        d.polygon([(sx-43,264),(sx,246),(sx+43,264),(sx,282)],fill=INK)
        line([(sx+39,268),(sx+39,294)],INK,3)
        origin=(995,350); junction=1045
        for i,yy in enumerate([270,350,430]):
            p=ease((u-.5-i*.2)/1.7); tipx=junction+int(55*p)
            line([origin,(junction,350),(junction,yy),(tipx,yy)],INK,3)
            # Endpoints travel with their lines, without detached dots.
            circle(tipx,yy,6,INK)
        text(CX,563,'A NEW BEGINNING',15,INK,True,'center')
    elif idx==1:
        # Symmetric layout. Edges track the same animated centers as the nodes.
        offsets=[(-132,-98),(132,-98),(132,98),(-132,98)]
        nodes=[(CX+dx,CY+dy+math.sin(u*1.25+i)*5) for i,(dx,dy) in enumerate(offsets)]
        for xx,yy in nodes:
            dx,dy=xx-CX,yy-CY; length=math.hypot(dx,dy)
            line([(CX+dx*43/length,CY+dy*43/length),(xx-dx*40/length,yy-dy*40/length)],GRAY,2)
        for i,(xx,yy) in enumerate(nodes):
            circle(xx,yy,40,LIME if i==0 else '#424b37')
            text(xx,yy,['관심','가치','경험','강점'][i],20,INK if i==0 else PAPER,True,'center')
        circle(CX,CY,43,PAPER);text(CX,CY,'나',31,INK,True,'center')
        text(CX,563,'FIND YOUR OWN DIRECTION',14,LIME,True,'center')
    elif idx==2:
        for i,label in enumerate(['진로 탐색','역량 쌓기','실무 경험','취업 준비']):
            xx=760+i*110; yy=420-i*55+14*(1-ease((u-i*.22)/1.1)); width=90
            d.rounded_rectangle((xx,yy,xx+width,550),radius=5,fill=LIME if i==min(3,int(v*4)) else '#e8ecdf')
            text(xx+width/2,yy+30,f'{i+1}학년',19,INK,True,'center')
            text(xx+width/2,yy+65,label,15,INK,False,'center')
        tail,tip=(790,383),(1150,190)
        arrow(tail,tip,INK,4,20)
        # Use precisely the same vector for the path and the traveling marker.
        q=.07+.8*ease(v)
        circle(tail[0]+(tip[0]-tail[0])*q,tail[1]+(tip[1]-tail[1])*q,8,INK)
    elif idx==3:
        # Common left/right edges, identical gutters, and aligned text baselines.
        for i,(label,n) in enumerate([('프로젝트','01 / RECORD'),('포트폴리오','02 / PREPARE'),('맞춤 공고','03 / OPPORTUNITY')]):
            xx=790; yy=190+i*110+14*(1-ease((u-i*.25)/1.1))
            d.rounded_rectangle((xx,yy,xx+360,yy+92),radius=8,fill=INK)
            text(xx+24,yy+17,n,12,LIME,True)
            text(xx+24,yy+44,label,20,PAPER,True)
        circle(CX,555,27,INK)
        arrow((CX-11,566),(CX+11,544),LIME,4,12)
    elif idx==4:
        for i,labels in enumerate([('첫','커리어'),('전문성','성과'),('다음','역할')]):
            xx=785+i*140; yy=430-i*80
            d.rounded_rectangle((xx,yy,xx+90,550),radius=6,fill='#38402f' if i<2 else LIME)
            color=PAPER if i<2 else INK
            text(xx+45,yy+31,labels[0],17,color,True,'center')
            text(xx+45,yy+61,labels[1],17,color,True,'center')
        pts=[]
        for step in range(161):
            f=step/160;pts.append((790+360*f,380-190*f-12*math.sin(f*math.pi)+4*math.sin(u*.6)*math.sin(f*math.pi)))
        line(pts,LIME,4)
        q=(.04+.9*ease(v))*160; lo=int(q);mix=q-lo
        circle(pts[lo][0]*(1-mix)+pts[lo+1][0]*mix,pts[lo][1]*(1-mix)+pts[lo+1][1]*mix,9,PAPER)
        text(CX,577,'GROW AT YOUR OWN PACE',14,LIME,True,'center')
    else:
        # Brand symbol uses its own centered 80x80 coordinate system.
        p=ease(u/1.1);circle(CX,CY,154*p,INK)
        logo=[(16,12),(68,12),(68,64),(59,64),(59,27.36),(18.36,68),(12,61.64),(52.64,21),(16,21)]
        if p>0:d.polygon([(CX+(xx-40)*3*p,CY+(yy-40)*3*p) for xx,yy in logo],fill=LIME)
        text(CX,554,'JOBWAVE.KR',27,INK,True,'center')
    # Endpoints and labels share one six-column grid and consistent vertical spacing.
    d.line((LEFT,620,RIGHT,620),fill='#596248' if idx in [1,4] else '#b8c0a9',width=1)
    for i,label in enumerate(['입학','발견','경험','취업','성장','NEXT']):
        xx=LEFT+(RIGHT-LEFT)*i/5
        circle(xx,620,5,LIME if idx in [1,4] and i<=idx else fg if i<=idx else GRAY)
        color=fg if i<=idx else GRAY
        if i==0:text(xx,645,label,14,color,i==idx)
        elif i==5:text(xx,645,label,14,color,i==idx,'right')
        else:text(xx,645,label,14,color,i==idx,'top-center')
    d.rectangle((0,714,int(W*t/60),720),fill=LIME if idx in [1,4] else INK)
    fade=min(1,u/.45,(end-t)/.35) if t<59.6 else 1
    if fade<1:im=Image.blend(Image.new('RGB',(W,H),bg),im,max(0,fade))
    return im

def contact_sheet(path,times):
    sheet=Image.new('RGB',(1280,360*math.ceil(len(times)/2)),PAPER)
    for i,t in enumerate(times):sheet.paste(frame(t).resize((640,360),Image.Resampling.LANCZOS),((i%2)*640,(i//2)*360))
    sheet.save(path,quality=94)

def render():
    OUT.mkdir(exist_ok=True)
    frame(28).save(OUT/'career-poster-v2.jpg',quality=94)
    pipe=subprocess.Popen(['ffmpeg','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'career-journey-v2.mp4')],stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
    for i in range(FPS*60):
        pipe.stdin.write(frame(i/FPS).tobytes())
        if i%(FPS*10)==0:print(f'Rendered {i//FPS}s',flush=True)
    pipe.stdin.close();assert pipe.wait()==0
    subprocess.run(['ffmpeg','-y','-i',str(OUT/'career-journey-v2.mp4'),'-vf','setpts=PTS/5,scale=960:540','-an','-r','24','-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'career-loop-v2.mp4')],stderr=subprocess.DEVNULL,check=True)
    print('Rendered aligned 60-second film and 12-second hero loop.',flush=True)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--contact-sheet');parser.add_argument('--early',action='store_true');args=parser.parse_args()
    if args.contact_sheet:contact_sheet(args.contact_sheet,[.65,10.65,22.65,34.65,46.65,56.65] if args.early else [5,16,28,40,51,58])
    else:render()
