import {validateContent} from '../engine/content.js';
const assert=x=>{if(!x)throw new Error('assertion failed')};
export function runContent(test,data) {
 test('all six authored incidents validate',()=>assert(validateContent(structuredClone(data)).levels.flatMap(l=>l.rounds).every(r=>!r.unavailable)));
 test('invalid VLAN isolates incident',()=>{const d=structuredClone(data);d.levels[0].rounds[0].fault.expected=4095;assert(validateContent(d).levels[0].rounds[0].unavailable)});
 test('missing source isolates incident',()=>{const d=structuredClone(data);d.levels[0].rounds[0].sources=['missing'];assert(validateContent(d).levels[0].rounds[0].unavailable)});
 test('no mismatch isolates incident',()=>{const d=structuredClone(data);d.levels[0].rounds[0].fault.observed=10;assert(validateContent(d).levels[0].rounds[0].unavailable)});
 test('contradictory structured evidence isolates incident',()=>{const d=structuredClone(data);d.levels[0].rounds[0].observations[0].observed=30;assert(validateContent(d).levels[0].rounds[0].unavailable)});
 test('second independent mismatch isolates incident',()=>{const d=structuredClone(data);d.levels[0].rounds[0].observations.push({kind:'gateway',target:'HOST-07',expected:'192.168.10.1',observed:'192.168.10.2'});assert(validateContent(d).levels[0].rounds[0].unavailable)});
 test('unsupported observation isolates incident',()=>{const d=structuredClone(data);d.levels[0].rounds[0].observations.push({kind:'firewall',target:'FW-1',expected:'allow',observed:'deny'});assert(validateContent(d).levels[0].rounds[0].unavailable)});
 test('duplicate slot blocks load',()=>{const d=structuredClone(data);d.levels[0].rounds[1].id=d.levels[0].rounds[0].id;let failed=false;try{validateContent(d)}catch{failed=true}assert(failed)});
 test('missing slot blocks load',()=>{const d=structuredClone(data);d.levels[0].rounds.pop();let failed=false;try{validateContent(d)}catch{failed=true}assert(failed)});
}
