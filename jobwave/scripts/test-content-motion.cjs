const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
let io,mo,mediaChange,hiddenChange,click,scenes=[],writes=0;const media={matches:false,addEventListener:(_,cb)=>mediaChange=cb};
function scene(){const classes=new Set();return {nodeType:1,isConnected:true,matches:s=>s==='[data-motion-scene]',querySelectorAll:()=>[],classList:{toggle:(c,on)=>on?classes.add(c):classes.delete(c),contains:c=>classes.has(c)}}}
const first=scene();scenes.push(first);const control={disabled:false,pressed:'false',label:'모션 일시정지',setAttribute:(k,v)=>control.pressed=v,get textContent(){return this.label},set textContent(v){writes++;this.label=v}};
const document={hidden:false,body:{},documentElement:{nodeType:1,matches:()=>false,querySelectorAll:()=>scenes},querySelectorAll:()=>[control],addEventListener:(event,cb)=>{if(event==='click')click=cb;else if(event==='visibilitychange')hiddenChange=cb}};
class IO{constructor(cb){io=cb}observe(){}unobserve(){}}
class MO{constructor(cb){mo=cb}observe(){}}
vm.runInNewContext(fs.readFileSync('public/content-motion.js','utf8'),{document,matchMedia:()=>media,IntersectionObserver:IO,MutationObserver:MO,window:{IntersectionObserver:IO}});
assert(!first.classList.contains('is-playing'));io([{target:first,isIntersecting:true}]);assert(first.classList.contains('is-playing'));
click({target:{closest:()=>control}});assert(!first.classList.contains('is-playing'));assert.equal(control.pressed,'true');assert.equal(control.label,'모션 재생');click({target:{closest:()=>control}});assert(first.classList.contains('is-playing'));
io([{target:first,isIntersecting:false}]);assert(!first.classList.contains('is-playing'));io([{target:first,isIntersecting:true}]);document.hidden=true;hiddenChange();assert(!first.classList.contains('is-playing'));document.hidden=false;hiddenChange();assert(first.classList.contains('is-playing'));
media.matches=true;mediaChange();assert(!first.classList.contains('is-playing'));assert(control.disabled);click({target:{closest:()=>control}});assert(!first.classList.contains('is-playing'));media.matches=false;mediaChange();assert(!control.disabled);assert(first.classList.contains('is-playing'));
const added=scene();scenes.push(added);mo([{addedNodes:[added]}]);io([{target:added,isIntersecting:true}]);assert(added.classList.contains('is-playing'));const before=writes;mo([{addedNodes:[]}]);assert.equal(writes,before,'unchanged controls must not cause a MutationObserver text-write loop');
console.log('PASS: visible-only playback, pause/resume, offscreen and background suspension, reduced-motion preference, dynamically inserted scenes, and stable control labels.');
