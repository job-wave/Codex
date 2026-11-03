const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+process.cwd()+'/lecture.html');await p.waitForFunction('window.READY');
for(const t of process.argv.slice(2)){await p.evaluate(t=>setTime(+t),t);await p.screenshot({path:`prev_${t}.png`});}
await b.close();})();
