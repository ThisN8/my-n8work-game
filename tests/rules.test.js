import {evaluate,matchingRoutes,prefix} from '../engine/rules.js';
const assert=(x,message='assertion failed')=>{if(!x)throw new Error(message)};
export function runRules(test,data) {
  for(const level of data.levels) for(const round of level.rounds) { const right={'1.1':'vlan','1.2':'gateway','2.1':'route','2.2':'vlan','3.1':'specific','3.2':'vlan'}[round.id]; const wrong={'1.1':'gateway','1.2':'vlan','2.1':'gateway','2.2':'router','3.1':'default','3.2':'gateway'}[round.id]; test(`${round.id} independently expected correct`,()=>assert(evaluate(round,right).status==='correct')); test(`${round.id} independently expected wrong`,()=>assert(evaluate(round,wrong).status==='incorrect')); }
  const r=data.levels[0].rounds[0]; test('empty selection',()=>assert(evaluate(r,null).status==='invalid-input')); test('unknown selection',()=>assert(evaluate(r,'absent').status==='content-error'));
  test('equivalent choice',()=>{const copy=structuredClone(r); copy.choices.push({...copy.choices[0],id:'equivalent'});assert(evaluate(copy,'equivalent').status==='correct');});
  const routes=[{prefix:'0.0.0.0/0',nextHop:'10.0.0.1'},{prefix:'192.168.40.0/24',nextHop:'10.0.0.3'}];
  test('prefix boundary inside',()=>assert(matchingRoutes('192.168.40.255',routes).prefix==='192.168.40.0/24')); test('prefix boundary outside',()=>assert(matchingRoutes('192.168.41.0',routes).prefix==='0.0.0.0/0')); test('no route',()=>assert(matchingRoutes('192.168.41.0',[])===false)); test('noncanonical prefix',()=>assert(prefix('192.168.40.5/24')===null)); test('equal longest tie',()=>assert(matchingRoutes('192.168.40.5',[routes[1],routes[1]])===null));
}
