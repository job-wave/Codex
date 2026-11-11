'use strict';
(()=>{
 async function copy(text,button){try{await navigator.clipboard.writeText(text);const status=document.querySelector('#guideCopyStatus');if(status)status.textContent='복사했어요. 메모장이나 나의 기록에 붙여 넣어 작성해 보세요.';const before=button.textContent;button.textContent='복사 완료 ✓';setTimeout(()=>button.textContent=before,2000)}catch{const status=document.querySelector('#guideCopyStatus');if(status)status.textContent='자동 복사를 사용할 수 없어요. 질문을 직접 선택해 복사해 주세요.';if(button.hasAttribute('data-copy-link')){button.textContent='주소창의 링크를 복사해 주세요.'}else{const r=document.createRange();r.selectNodeContents(document.querySelector('#guideTemplate'));const s=window.getSelection();s.removeAllRanges();s.addRange(r)}}}
 document.querySelector('[data-copy-template]')?.addEventListener('click',e=>copy(document.querySelector('#guideTemplate').textContent,e.currentTarget));document.querySelector('[data-copy-link]')?.addEventListener('click',e=>copy(location.origin+location.pathname,e.currentTarget));
})();
