// Response headers applied to every page the worker serves.
// 'unsafe-inline' stays for scripts and styles: the pages carry inline JSON-LD/styles and the CDN injects a small inline script.
export const contentSecurityPolicy=[
 "default-src 'self'",
 "script-src 'self' 'unsafe-inline'",
 "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
 "font-src 'self' data: https://cdn.jsdelivr.net",
 "img-src 'self' data: blob: https:",
 "media-src 'self' blob:",
 "connect-src 'self'",
 "object-src 'none'",
 "base-uri 'self'",
 "form-action 'self'",
 "frame-ancestors 'none'",
].join('; ');
export const securityHeaders:Record<string,string>={
 'Strict-Transport-Security':'max-age=31536000; includeSubDomains',
 'X-Content-Type-Options':'nosniff',
 'X-Frame-Options':'DENY',
 'Referrer-Policy':'strict-origin-when-cross-origin',
 'Permissions-Policy':'camera=(), geolocation=(), payment=(), usb=(), microphone=(self)',
};
export function withSecurityHeaders(response:Response){
 // Redirect and streamed media responses can be immutable; copy before changing headers.
 const headers=new Headers(response.headers);
 for(const [name,value] of Object.entries(securityHeaders))if(!headers.has(name))headers.set(name,value);
 if((headers.get('content-type')||'').includes('text/html')&&!headers.has('Content-Security-Policy'))headers.set('Content-Security-Policy',contentSecurityPolicy);
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
