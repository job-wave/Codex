# 회원 탈퇴

- 화면: `/account/withdraw` (로그인 필요). 내 계정 창의 "회원 탈퇴" 링크로 들어갑니다.
- API: `POST /api/account` + `{"confirm":"탈퇴"}`. 같은 출처 요청만 받습니다.

## 삭제되는 것

| 위치 | 내용 |
| --- | --- |
| D1 `member_state` | 커리어 프로필, 진단, 플랜, 할 일, 경험 기록, 관심 공고, 일정 |
| D1 `consultation_requests` | 상담 신청 내역 |
| D1 `ai_usage` | 해당 회원의 AI 분석 횟수, 이메일 인증 시도 횟수 |
| Supabase Auth | 로그인 계정(이메일, 카카오·Google 연결) |
| 브라우저 | `jobwave`로 시작하는 localStorage / sessionStorage 항목 |

삭제는 즉시 이뤄지며 별도 보관 기간이 없습니다.

## 운영자가 한 번 해야 하는 설정 (필수)

이메일·카카오·Google 회원의 로그인 계정은 Supabase에 있습니다. 사이트는 공개 키만 쓰기 때문에,
회원 본인이 자기 계정만 지울 수 있는 함수를 Supabase에 만들어 두어야 합니다.
Supabase 대시보드 > SQL Editor에서 아래를 한 번 실행하세요.

```sql
create or replace function public.delete_own_account()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
```

이 함수가 없으면 탈퇴 요청은 "탈퇴를 처리하지 못했습니다"로 끝나고 아무것도 삭제되지 않습니다.

## 처리 순서

1. Supabase 로그인 계정 삭제(위 함수). 실패하면 여기서 중단하고 아무것도 지우지 않습니다.
2. D1의 회원 데이터 삭제(한 번 재시도). 실패하면 서버 로그에 남기고 응답의 `erased`가 `false`가 됩니다.
3. 로그인 쿠키 삭제, 브라우저 저장 항목 삭제 후 홈으로 이동.

기존 ChatGPT 로그인 회원은 1단계 없이 2단계만 수행하고 ChatGPT 로그아웃 경로로 이동합니다.

카카오·Google 쪽의 "연결된 서비스" 목록에서 JOBWAVE를 지우는 것은 회원이 각 서비스 설정에서 직접 합니다.

## 검증

`node scripts/test-withdrawal.cjs`
