import {sections} from '../resources/content';
import {readCatalog} from '../insights/store';
import {challenges} from '../challenges/content';
import {guides} from '../guides/content';
import {stories} from '../stories/content';
import {missions} from '../missions/content';
export async function GET(){const {items:insights}=await readCatalog();const paths=[{path:'/'},{path:'/guides'},{path:'/missions'},{path:'/stories'},{path:'/challenges'},{path:'/insights'},{path:'/resources'},{path:'/practice'},{path:'/company'},...sections.map(s=>({path:'/resources/'+s.slug,date:'2026-10-26'})),...insights.map(i=>({path:'/insights/'+i.slug,date:i.checked})),...challenges.map(c=>({path:'/challenges/'+c.track,date:c.published})),...stories.map(s=>({path:'/stories/'+s.slug,date:s.published})),...missions.map(m=>({path:'/missions/'+m.slug,date:m.published})),...guides.map(g=>({path:'/guides/'+g.slug,date:g.published}))];return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>`<url><loc>https://jobwave.kr${p.path}</loc>${'date' in p?`<lastmod>${p.date}</lastmod>`:''}</url>`).join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600'}})}
