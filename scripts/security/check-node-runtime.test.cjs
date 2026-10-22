const test=require('node:test');
const assert=require('node:assert/strict');
const {safe}=require('./check-node-runtime.cjs');
const current=Date.parse('2026-10-22T00:00:00Z');
for(const v of ['18.20.8','20.20.0','22.23.3','24.22.0','26.12.1']) test(`reject unsupported or unpatched ${v}`,()=>assert.equal(safe(v,current),false));
for(const v of ['22.23.4','24.22.1','24.23.0']) test(`accept supported patched ${v}`,()=>assert.equal(safe(v,current),true));
for(const v of ['22.23.4','24.22.1']) test(`reject ${v} after its support window`,()=>assert.equal(safe(v,Date.parse('2029-01-01T00:00:00Z')),false));
test('reject malformed pins',()=>assert.throws(()=>safe('24.x',current)));
