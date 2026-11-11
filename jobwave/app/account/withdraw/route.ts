import {page} from '../../visitor';
import {identity} from '../../api/shared';
import {loginHref} from '../../member-access';
import {kakaoChatUrl} from '../../kakao-contact';
export const dynamic='force-dynamic';
const escape=(v:string)=>v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export async function GET(){
 const user=await identity();
 if(!user)return new Response(null,{status:303,headers:{Location:loginHref('/account/withdraw'),'Cache-Control':'private, no-store'}});
 return page('회원 탈퇴',`<main class="login-main withdraw-main"><p class="eyebrow">YOUR JOBWAVE ACCOUNT</p><h1>회원 탈퇴</h1><p><b>${escape(user.displayName)}</b> 계정을 탈퇴합니다.<br>탈퇴하면 아래 정보가 바로 삭제되며 되돌릴 수 없습니다.</p><ul class="withdraw-list"><li>커리어 프로필·진단 결과·커리어 플랜과 할 일</li><li>경험·성과 기록</li><li>관심 공고, 지원 현황, 일정과 체크리스트</li><li>상담 신청 내역</li><li>로그인 계정 정보(이메일 또는 카카오·Google 연결)</li><li>이 브라우저에 저장된 연습 기록</li></ul><p class="withdraw-note">필요한 기록은 탈퇴 전에 따로 옮겨 적어 두세요. 같은 이메일로 다시 가입해도 이전 정보는 복구되지 않습니다.</p><form class="login-form" id="withdrawForm"><label for="withdrawConfirm">확인을 위해 <b>탈퇴</b>를 입력해 주세요.</label><input id="withdrawConfirm" autocomplete="off" maxlength="4" placeholder="탈퇴" required><button class="entry-button withdraw-button" id="withdrawSubmit" disabled>탈퇴하기</button></form><p id="withdrawStatus" role="status" aria-live="polite"></p><a class="login-back" href="/?view=account">← 탈퇴하지 않고 돌아가기</a><small>문제가 있으면 <a href="${kakaoChatUrl}" target="_blank" rel="noopener noreferrer">카카오톡 채널</a>로 문의해 주세요.</small></main><script src="/account-withdraw.js" defer></script>`,true,'/login',{href:'/?view=account',label:'내 계정'},{path:'/account/withdraw',noindex:true,description:'잡웨이브 회원 탈퇴 안내와 신청.'});
}
