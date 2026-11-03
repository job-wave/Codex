const {chromium}=require('playwright');const {spawn}=require('child_process');
const [s,e,out]=[+process.argv[2],+process.argv[3],process.argv[4]];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+process.cwd()+'/lecture.html');await p.waitForFunction('window.READY');
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-r','30',out]);
for(let f=s;f<e;f++){await p.evaluate(t=>setTime(t),f/30);const buf=await p.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(f%300==0)console.log(out,f);}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();})();
