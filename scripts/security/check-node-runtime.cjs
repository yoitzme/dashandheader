// October 21, 2026 security floor. Check the official latest patch as well.
const https = require('node:https');
const fs = require('node:fs');
const floors = {22:[22,23,4],24:[24,22,1]};
function parts(v) { if(!/^v?\d+\.\d+\.\d+$/.test(v)) throw Error('Use an exact Node patch version'); return v.replace(/^v/,'').split('.').map(Number); }
function compare(a,b) { for(let i=0;i<3;i++) { if(a[i]!==b[i]) return a[i]-b[i]; } return 0; }
const ends = {22:'2027-04-30',24:'2028-04-30'};
function safe(v, now=Date.now()) { const p=parts(v); return !!floors[p[0]] && compare(p,floors[p[0]])>=0 && now < Date.parse(ends[p[0]]+'T00:00:00Z'); }
module.exports={safe,parts,compare};
if(require.main===module) {
 const pinned=fs.readFileSync(require('node:path').resolve(__dirname,'../../.nvmrc'),'utf8').trim();
 if(!safe(process.version)||!safe(pinned)) throw Error('Unsupported or vulnerable Node runtime/pin');
 const req=https.get('https://nodejs.org/dist/index.json',res=>{
  if(res.statusCode!==200) {res.resume(); throw Error('Official Node release lookup failed');}
  let text=''; res.on('data',b=>{text+=b;if(text.length>2_000_000) req.destroy(Error('Release response too large'));});
  res.on('end',()=>{const releases=JSON.parse(text);for(const v of [process.version,pinned]) {
   const current=parts(v);const latest=releases.filter(r=>parts(r.version)[0]===current[0]&&r.lts).sort((a,b)=>compare(parts(b.version),parts(a.version)))[0];
   if(!latest) throw Error('No supported LTS release found');
   if(compare(current,parts(latest.version))<0) throw Error(`Node ${v} is behind official LTS patch ${latest.version}; update and test`);
  } console.log(`Node runtime ${process.version} and repository pin ${pinned} match current LTS security patches`);});
 });req.setTimeout(15000,()=>req.destroy(Error('Node release lookup timed out')));req.on('error',e=>{console.error(e.message);process.exitCode=1;});
}
