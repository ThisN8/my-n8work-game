import {runRules} from './rules.test.js';
import {runContent} from './content.test.js';
import {runState} from './state.test.js';
const results=[]; function test(id,fn) { try { fn(); results.push({id,pass:true}); } catch(e) { results.push({id,pass:false,error:e.message}); } }
try { const response=await fetch('../data/levels.json'); if(!response.ok) throw new Error('Content fetch failed'); const data=await response.json(); runRules(test,data); runContent(test,data); runState(test,data); } catch(e) { results.push({id:'test setup',pass:false,error:e.message}); }
const failures=results.filter(r=>!r.pass); document.querySelector('#summary').textContent=results.length ? `${results.length-failures.length}/${results.length} passed; ${failures.length} failed` : 'FAIL: zero tests discovered'; document.title=failures.length||!results.length?'FAIL — Night Shift tests':'PASS — Night Shift tests'; const list=document.querySelector('#results'); for(const r of results){const li=document.createElement('li');li.textContent=`${r.pass?'PASS':'FAIL'} ${r.id}${r.error?`: ${r.error}`:''}`;list.append(li);}
