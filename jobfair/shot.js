const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+process.cwd()+'/'+(process.env.PAGE||'sketch.html'));await p.waitForFunction('window.READY');
for(const t of process.argv.slice(2)){await p.evaluate(x=>setTime(x),+t);await p.screenshot({path:process.env.OUT+'/t'+t+'.jpg',type:'jpeg',quality:70});}
await b.close();})();
