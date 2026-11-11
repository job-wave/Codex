'use strict';
(()=>{
const media=matchMedia('(prefers-reduced-motion: reduce)'),scenes=new Map();let paused=false;
function paint(node){node.classList.toggle('is-playing',!!scenes.get(node)&&!paused&&!media.matches&&!document.hidden)}
function controls(){document.querySelectorAll('[data-resource-motion-toggle]').forEach(button=>{button.disabled=media.matches;button.setAttribute('aria-pressed',String(paused||media.matches));const label=media.matches?'모션 줄이기 적용 중':paused?'모션 재생':'모션 일시정지';if(button.textContent!==label)button.textContent=label})}
const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{scenes.set(entry.target,entry.isIntersecting);paint(entry.target)}),{threshold:.15}):null;
function register(root){if(root.nodeType!==1)return;const nodes=[...(root.matches('[data-motion-scene]')?[root]:[]),...root.querySelectorAll('[data-motion-scene]')];nodes.forEach(node=>{if(scenes.has(node))return;scenes.set(node,false);observer?.observe(node)})}
register(document.documentElement);controls();
new MutationObserver(records=>{records.forEach(record=>record.addedNodes.forEach(register));scenes.forEach((_,node)=>{if(!node.isConnected){observer?.unobserve(node);scenes.delete(node)}});controls()}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',event=>{if(!event.target.closest('[data-resource-motion-toggle]')||media.matches)return;paused=!paused;scenes.forEach((_,node)=>paint(node));controls()});
media.addEventListener('change',()=>{scenes.forEach((_,node)=>paint(node));controls()});document.addEventListener('visibilitychange',()=>scenes.forEach((_,node)=>paint(node)));
})();
