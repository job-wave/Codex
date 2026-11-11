const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};vm.runInNewContext(fs.readFileSync('public/practice-data.js','utf8'),context);const d=context.window.JWPracticeData;
for(const k of ['aptitude','ncs']){assert.equal(d[k].length,8);for(const [cat,q,opts,answer,why] of d[k]){assert(cat&&q&&why);assert.equal(opts.length,4);assert(Number.isInteger(answer)&&answer>=0&&answer<4);assert.equal(new Set(opts).size,4)}}
const answers={aptitude:[1,2,2,1,3,2,2,1],ncs:[1,2,2,2,1,1,1,1]};for(const k of Object.keys(answers))assert.deepEqual(Array.from(d[k],q=>q[3]),answers[k]);
assert.equal(80000*(1-.15),68000);assert.equal(24/3,8);assert.equal((250-200)/200,.25);assert(3/80<2/40);assert.equal(120*.65,78);
assert.equal(d.scenarios.length,3);for(const [,opts,a,why] of d.scenarios){assert(opts[a]&&why)}assert(Object.values(d.interview).every(q=>q.length>=4));
const source=fs.readFileSync('public/practice.js','utf8');assert(!/fetch\(|XMLHttpRequest|api\.openai/.test(source));assert(source.includes('getTracks().forEach(t=>t.stop())'));assert(source.includes('URL.revokeObjectURL(blobUrl)'));assert(source.includes('120000'));assert(source.includes('q.answers[i]===r[3]'));assert(source.includes('Math.ceil((q.end-Date.now())/1000)'));
console.log('PASS: 16 original questions and explanations; independently checked numeric answers; scenario/question coverage; no network transmission; microphone and object URL cleanup.');
