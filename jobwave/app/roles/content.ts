import data from './articles.json';
export type RoleArticle=(typeof data)[number];
export const articles=data;
export const kinds=[['all','전체'],['guide','직무 가이드'],['compare','직무 비교'],['interview','공개 인터뷰 요약']] as const;
export const label=(kind:string)=>kinds.find(([key])=>key===kind)?.[1]||'직무 콘텐츠';
export const escape=(value:unknown)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function card(a:RoleArticle,member:boolean){
 const path='/roles/'+a.slug,href=member?path:'/login?next='+encodeURIComponent(path);
 return '<a class="role-card" href="'+href+'"><span class="role-card-meta">'+label(a.kind)+' · 약 '+a.minutes+'분</span><h3>'+escape(a.title)+'</h3><p>'+escape(a.deck)+'</p><span class="role-card-action">'+(member?'읽어보기':'로그인하고 읽기')+' <span aria-hidden="true">↗</span></span></a>';
}
export function libraryHtml(selected:string,member:boolean){
 const chosen=kinds.some(([key])=>key===selected)?selected:'all',visible=articles.filter(a=>chosen==='all'||a.kind===chosen);
 return '<main class="role-main" id="roleMain"><header class="role-library-head"><p class="eyebrow">JOBWAVE · CAREER READS</p><h1>직무를 알면,<br>일의 모습이 보입니다.</h1><p>실제로 하는 일과 협업 방식, 현직자가 전하는 이야기.<br>짧게 읽으며 궁금했던 직무를 알아보세요.</p><div class="role-library-facts"><span>직무 가이드 10편</span><span>직무 비교 3편</span><span>공개 인터뷰 요약 3편</span></div></header><nav class="role-filters" aria-label="직무 콘텐츠 종류">'+kinds.map(([key,name])=>'<a href="/roles'+(key==='all'?'':'?type='+key)+'" '+(key===chosen?'aria-current="page"':'')+'>'+name+'</a>').join('')+'</nav><div class="role-results"><h2>'+label(chosen)+' <span>'+visible.length+'편</span></h2><p>'+(member?'궁금한 제목부터 편하게 읽어보세요.':'콘텐츠 소개는 누구나, 본문은 로그인 후 볼 수 있습니다.')+'</p></div><section class="role-grid" aria-label="직무 콘텐츠 목록">'+visible.map(a=>card(a,member)).join('')+'</section><p class="role-library-note">직무 가이드는 공식 직무 소개 등을 참고한 JOBWAVE의 일반적인 설명입니다. 공개 인터뷰 요약에는 원문 출처를 표시했으며, 실제 업무 범위는 기업과 팀에 따라 달라질 수 있습니다.</p></main>';
}
export function articleHtml(a:RoleArticle){
 const related=a.related.map(slug=>articles.find(x=>x.slug===slug)).filter((x):x is RoleArticle=>!!x);
 return '<main class="role-main role-article-main" id="roleMain"><nav class="role-breadcrumb" aria-label="현재 위치"><a href="/roles">직무 가이드·인터뷰</a><span>/</span><a href="/roles?type='+a.kind+'">'+label(a.kind)+'</a></nav><article class="role-article"><header class="role-article-head"><p class="eyebrow">'+label(a.kind)+' · 약 '+a.minutes+'분 읽기</p><h1>'+escape(a.title)+'</h1><p>'+escape(a.deck)+'</p><div class="role-byline"><span>'+(a.kind==='interview'?'JOBWAVE 편집 · 공식 공개 인터뷰 요약':'JOBWAVE 에디토리얼')+'</span><time datetime="'+a.published+'">'+a.published.replaceAll('-','. ')+'</time></div></header>'+
 (a.context?'<aside class="role-context"><strong>원문과 요약 안내</strong><p>'+escape(a.context)+'</p><a href="'+escape(a.sources[0].url)+'" target="_blank" rel="noopener noreferrer">공식 인터뷰 원문 보기 ↗</a></aside>':'')+
 '<aside class="role-quick" aria-label="핵심 요약"><p class="eyebrow">먼저, 핵심만</p><p class="role-one-line">'+escape(a.oneLine)+'</p><ul>'+a.highlights.map(t=>'<li>'+escape(t)+'</li>').join('')+'</ul></aside><div class="role-body">'+
 a.sections.map((s,i)=>'<section aria-labelledby="role-section-'+i+'"><h2 id="role-section-'+i+'">'+escape(s.title)+'</h2><p>'+escape(s.body)+'</p></section>').join('')+
 '<section class="role-sources"><h2>'+(a.kind==='interview'?'인터뷰 원문':'참고한 공식 자료')+'</h2><ul>'+a.sources.map(s=>'<li><a href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer">'+escape(s.title)+' ↗</a></li>').join('')+'</ul><p>자료 확인일: <time datetime="'+a.checked+'">'+a.checked+'</time>. '+(a.kind==='interview'?'요약은 원문에서 확인한 내용의 범위 안에서 작성했습니다. 해당 인터뷰 시점과 조직의 사례로 읽어주세요.':'업무 흐름의 예시는 이해를 돕기 위한 JOBWAVE의 설명입니다. 자료의 채용 진행 여부나 모든 기업의 공통 요건을 뜻하지 않습니다.')+'</p></section></div></article><section class="role-related"><h2>이어서 읽어보세요.</h2><div class="role-grid">'+related.map(x=>card(x,true)).join('')+'</div></section><a class="role-back" href="/roles?type='+a.kind+'">← '+label(a.kind)+' 목록으로</a></main>';
}
