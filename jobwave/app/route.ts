import {productPreview,audienceOverview} from './brand';
import {identity} from './api/shared';
import {loginHref} from './member-access';
import {visitorHome} from './visitor';
import {withKakaoContact} from './kakao-contact';
import shell from './shell';
import {editorialHome} from './resources/editorial';
import {homeHtml} from './insights/content';
import {readSelection} from './insights/store';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const {pathname,search,searchParams}=new URL(request.url);
 const view=searchParams.get('view');
 const from=searchParams.get('from');
 // Use the same home for both audiences; load the member workspace only for explicit actions.
 const workspace=['today','career','account'].includes(view??'')||['guide','mission'].includes(from??'')||searchParams.get('business')==='inquiry';
 const member=Boolean(await identity());
 if(!workspace)return visitorHome(member);
 if(!member)return new Response(null,{status:303,headers:{Location:loginHref(pathname+search),'Cache-Control':'private, no-store'}});
 const current=await readSelection();const html=shell.replace('</body>','<template id="nextProductTemplate">'+productPreview()+'</template><template id="careerAudienceTemplate">'+audienceOverview(true)+'</template></body>').replace('</footer>','<a class="company-footer-link" href="/company">회사 소개 ↗</a></footer>').replace('</head>','<link rel="stylesheet" href="/resources.css"><link rel="stylesheet" href="/pastel.css"><link rel="stylesheet" href="/content-motion.css"><link rel="stylesheet" href="/home-editorial.css"><link rel="stylesheet" href="/reel-hero.css"></head>').replace('<script src="app.js">','<template id="homeResourcesTemplate">'+editorialHome()+'</template><template id="homeInsightsTemplate">'+homeHtml(current)+'</template><script src="app.js">').replace('</body>','<script src="/insights-home.js"></script><script src="/header-nav.js"></script><script src="/resources.js"></script><script src="/content-motion.js"></script><script src="/home-editorial.js"></script><script src="/reel-hero.js"></script><script src="/service-bridge.js"></script></body>');return new Response(withKakaoContact(html.replace(/<script src=/g,'<script defer src=')),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'}})}
