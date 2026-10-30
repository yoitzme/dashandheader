const test=require('node:test');
const assert=require('node:assert/strict');
const {safe,latestLts}=require('./check-node-runtime.cjs');
const current=Date.parse('2026-10-22T00:00:00Z');
for(const v of ['18.20.8','20.20.0','22.23.3','24.22.0','26.12.1']) test(`reject unsupported or unpatched ${v}`,()=>assert.equal(safe(v,current),false));
for(const v of ['22.23.4','24.22.1','24.23.0']) test(`accept supported patched ${v}`,()=>assert.equal(safe(v,current),true));
for(const v of ['22.23.4','24.22.1']) test(`reject ${v} after its support window`,()=>assert.equal(safe(v,Date.parse('2029-01-01T00:00:00Z')),false));
test('reject malformed pins',()=>assert.throws(()=>safe('24.x',current)));

test('ignore alpha and prerelease entries in the official release feed',()=>{
 const releases=[{version:'v27.0.0-alpha.0.0.0',lts:false},{version:'v24.22.2',lts:'Krypton'},{version:'v24.23.0-rc.1',lts:'Krypton'}];
 assert.equal(latestLts(releases,24).version,'v24.22.2');
});
test('select the newest stable patch in the requested LTS line',()=>{
 const releases=[{version:'v24.22.1',lts:'Krypton'},{version:'v26.13.0',lts:'LTS'},{version:'v24.22.2',lts:'Krypton'},{version:'v24.23.0',lts:false}];
 assert.equal(latestLts(releases,24).version,'v24.22.2');
});
test('ignore malformed release records without relaxing exact repository pins',()=>{
 assert.equal(latestLts([null,{}, {version:'invalid',lts:true},{version:24,lts:true},{version:'v24.22.2',lts:'Krypton'}],24).version,'v24.22.2');
 assert.throws(()=>safe('24.22.2-rc.1',current));
});
test('missing supported LTS line remains a failure signal',()=>{
 assert.equal(latestLts([{version:'v27.0.0-alpha.0',lts:false},{version:'v22.23.4',lts:'Jod'}],24),undefined);
});
