export function ipv4(value) {
  if (typeof value !== 'string' || !/^(0|[1-9]\d{0,2})(\.(0|[1-9]\d{0,2})){3}$/.test(value)) return null;
  const parts = value.split('.').map(Number); if (parts.some(n => n > 255)) return null;
  return parts.reduce((n, part) => ((n << 8) | part) >>> 0, 0);
}
export function prefix(value) {
  if (typeof value !== 'string') return null;
  const match = /^(.*)\/(0|[1-9]|[12]\d|3[0-2])$/.exec(value); if (!match) return null;
  const address = ipv4(match[1]), length = Number(match[2]); if (address === null) return null;
  const mask = length === 0 ? 0 : (0xffffffff << (32 - length)) >>> 0;
  if (((address & mask) >>> 0) !== address) return null;
  return {address, length, mask};
}
export function matchingRoutes(destination, routes) {
  const ip = ipv4(destination); if (ip === null || !Array.isArray(routes)) return null;
  const matching = [];
  for (const route of routes) { const p = prefix(route.prefix); if (!p || ipv4(route.nextHop) === null) return null; if (((ip & p.mask) >>> 0) === p.address) matching.push({...route, length:p.length}); }
  matching.sort((a,b) => b.length-a.length); if (matching.length > 1 && matching[0].length === matching[1].length) return null;
  return matching[0] || false;
}
export function derive(fault) {
  if (!fault || typeof fault.target !== 'string' || !fault.target.trim()) return null;
  if (fault.kind === 'vlan') {
    if (![fault.expected,fault.observed].every(n => Number.isInteger(n) && n >= 1 && n <= 4094) || fault.expected === fault.observed) return null;
    return {diagnosis:'vlan',target:fault.target,value:fault.expected, evidence:`Expected VLAN ${fault.expected}; observed VLAN ${fault.observed}.`};
  }
  if (fault.kind === 'gateway') {
    if (ipv4(fault.expected) === null || ipv4(fault.observed) === null || fault.expected === fault.observed) return null;
    return {diagnosis:'gateway',target:fault.target,value:fault.expected,evidence:`Expected gateway ${fault.expected}; observed ${fault.observed}.`};
  }
  if (fault.kind === 'missing-route' || fault.kind === 'wrong-next-hop') {
    const selected = matchingRoutes(fault.destination, fault.routes), expected = fault.expected;
    if (selected === null || !expected || !prefix(expected.prefix) || ipv4(expected.nextHop) === null || !matchingRoutes(fault.destination,[expected])) return null;
    if (fault.kind === 'missing-route' && selected !== false) return null;
    if (fault.kind === 'wrong-next-hop' && (!selected || selected.prefix !== expected.prefix || selected.nextHop === expected.nextHop)) return null;
    return {diagnosis:fault.kind,target:fault.target,value:expected,evidence:fault.kind === 'missing-route' ? `No installed route matches ${fault.destination}; the intended route is ${expected.prefix} via ${expected.nextHop}.` : `The longest match for ${fault.destination} is ${selected.prefix} via ${selected.nextHop}; its intended next hop is ${expected.nextHop}.`};
  }
  return null;
}
function sameValue(a,b) { return typeof a === 'object' && a !== null && typeof b === 'object' && b !== null ? a.prefix === b.prefix && a.nextHop === b.nextHop : a === b; }
export function evaluate(incident, choiceId) {
  const expected = derive(incident?.fault); if (!expected || !Array.isArray(incident?.choices)) return {status:'content-error',expected:null,reasonCode:'invalid-content',evidence:null};
  if (!choiceId) return {status:'invalid-input',expected,reasonCode:'missing-choice',evidence:null};
  const choice = incident.choices.find(item => item.id === choiceId); if (!choice) return {status:'content-error',expected:null,reasonCode:'unknown-choice',evidence:null};
  const correct = choice.diagnosis === expected.diagnosis && choice.target === expected.target && sameValue(choice.value,expected.value);
  return {status:correct?'correct':'incorrect',expected,reasonCode:correct?'repair-matches':'conflicts-with-evidence',evidence:expected.evidence};
}
