import {validateContent} from '../engine/content.js';
import {createState,current,submit,help,advance,nextLevel} from '../engine/state.js';
const assert=x=>{if(!x)throw new Error('assertion failed')};
export function runState(test,data) {
 const fresh=()=>createState(validateContent(structuredClone(data)));
 test('empty input is not an attempt',()=>{const s=fresh();submit(s,null);assert(s.records['1.1'].attempts===0)});
 test('wrong then correct counts once each; duplicate ignored',()=>{const s=fresh();submit(s,'gateway');submit(s,'vlan');submit(s,'vlan');assert(s.records['1.1'].attempts===2&&s.records['1.1'].status==='solved')});
 test('help does not complete',()=>{const s=fresh();help(s);help(s);help(s);help(s);assert(s.records['1.1'].help===3&&s.records['1.1'].status==='unsolved')});
 test('skip unavailable without progress',()=>{const d=structuredClone(data);d.levels[0].rounds[0].fault.expected=0;const s=createState(validateContent(d));advance(s,true);assert(s.records['1.1'].status==='skipped'&&s.records['1.1'].attempts===0&&current(s).id==='1.2')});
 test('last incident skip opens incomplete level summary',()=>{const d=structuredClone(data);d.levels[2].rounds[1].fault.expected=0;const s=createState(validateContent(d));s.level=2;s.round=1;advance(s,true);assert(s.view==='level-summary'&&s.records['3.2'].status==='skipped');nextLevel(s);assert(s.view==='summary')});
 test('new state resets progress',()=>{const s=fresh();submit(s,'vlan');const reset=fresh();assert(reset.records['1.1'].attempts===0&&reset.view==='briefing')});
}
