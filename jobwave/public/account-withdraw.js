(()=>{'use strict';
const $=s=>document.querySelector(s),form=$('#withdrawForm'),input=$('#withdrawConfirm'),button=$('#withdrawSubmit'),status=$('#withdrawStatus');let busy=false;
input.oninput=()=>{button.disabled=busy||input.value.trim()!=='탈퇴'};
async function post(path,data){const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),cache:'no-store'});let result={};try{result=await r.json()}catch{}return {status:r.status,result}}
form.onsubmit=async e=>{e.preventDefault();if(busy||input.value.trim()!=='탈퇴')return;busy=true;button.disabled=true;status.textContent='탈퇴를 처리하고 있습니다.';
 try{let r=await post('/api/account',{confirm:'탈퇴'});
  // An expired access cookie is renewed once, then the request is repeated.
  if(r.status===401){const renewed=await post('/api/auth',{action:'refresh'});if(renewed.status===200)r=await post('/api/account',{confirm:'탈퇴'})}
  if(r.status===401){location.assign('/login?next='+encodeURIComponent('/account/withdraw'));return}
  if(r.status!==200||!r.result.ok)throw Error(r.result.error||'탈퇴를 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  for(const store of [localStorage,sessionStorage]){try{Object.keys(store).filter(k=>k.startsWith('jobwave')).forEach(k=>store.removeItem(k))}catch{}}
  form.hidden=true;status.textContent='탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.';
  const next=typeof r.result.next==='string'&&r.result.next.startsWith('/')&&!r.result.next.startsWith('//')?r.result.next:'/';setTimeout(()=>location.replace(next),1600);
 }catch(e){status.textContent=e.message;busy=false;button.disabled=input.value.trim()!=='탈퇴'}
};
})();
