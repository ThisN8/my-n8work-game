import {derive, evaluate, ipv4, prefix} from './rules.js';
const present = value => typeof value === 'string' && value.trim().length > 0;
// Each modeled comparison is displayed and checked. Unknown comparison types
// fail closed: the validator must not infer a repair from unmodeled evidence.
export function validateObservations(round) {
  if (!Array.isArray(round.observations)) return false;
  const mismatches = [];
  for (const item of round.observations) {
    if (!item || !present(item.target) || !['vlan','gateway'].includes(item.kind)) return false;
    if (item.kind === 'vlan' && ![item.expected,item.observed].every(n=>Number.isInteger(n)&&n>=1&&n<=4094)) return false;
    if (item.kind === 'gateway' && ![item.expected,item.observed].every(v=>ipv4(v)!==null)) return false;
    if (item.expected !== item.observed) mismatches.push(item);
  }
  const fault=round.fault;
  if (fault?.kind === 'vlan' || fault?.kind === 'gateway') {
    return mismatches.length===1 && mismatches[0].kind===fault.kind && mismatches[0].target===fault.target && mismatches[0].expected===fault.expected && mismatches[0].observed===fault.observed;
  }
  return mismatches.length===0 && ['missing-route','wrong-next-hop'].includes(fault?.kind) && prefix(fault.expected?.prefix)!==null;
}
export function validateContent(data) {
  if (!data || data.schemaVersion !== 1 || !Array.isArray(data.sources) || !Array.isArray(data.levels) || data.levels.length !== 3) throw new Error('The incident file is unreadable or has an unsupported structure.');
  const sources = new Set(); for (const source of data.sources) { if (!source || !['id','title','url','section','claim'].every(k=>present(source[k])) || sources.has(source.id)) throw new Error('The source list is incomplete or has duplicate IDs.'); sources.add(source.id); }
  const ids = new Set(), levels = new Set();
  for (const level of data.levels) {
    if (!level || !present(level.id) || levels.has(level.id) || !Array.isArray(level.rounds) || level.rounds.length !== 2 || !level.rounds.every(r=>r && present(r.id) && !ids.has(r.id) && ids.add(r.id))) throw new Error('Level or incident ordering and identity are invalid.'); levels.add(level.id);
    if (!present(level.title) || !present(level.outcome) || !present(level.briefing) || !Number.isInteger(level.difficulty) || !Array.isArray(level.sources) || !level.sources.length || !level.sources.every(s=>sources.has(s))) throw new Error(`The briefing for ${level.id} is incomplete.`);
    level.rounds = level.rounds.map(round => {
      const fail = message => ({id:round.id, unavailable:true, error:`Incident ${round.id} is unavailable: ${message}`});
      if (round.probes !== undefined && (!Array.isArray(round.probes) || !round.probes.every(probe =>
        probe && ['healthy','restored','unrelated'].includes(probe.condition) &&
        Array.isArray(probe.path) && probe.path.length >= 2 && probe.path.every(present)))) {
        return fail('a probe path or outcome is unsupported.');
      }
      if (!['title','alert','path'].every(k=>present(round[k])) || !Array.isArray(round.evidence) || !round.evidence.length || !round.evidence.every(present) || !Array.isArray(round.hints) || round.hints.length !== 3 || !round.hints.every(present) || !Array.isArray(round.sources) || !round.sources.length || !round.sources.every(s=>sources.has(s))) return fail('required evidence, help, or source is missing.');
      if (!derive(round.fault) || !validateObservations(round) || !Array.isArray(round.choices) || round.choices.length < 2) return fail('the structured observations, fault, or choices cannot be validated.');
      if (round.rack !== undefined) {
        const rack = round.rack;
        const validPort = (port, index) => port && typeof port.tag === 'string' &&
          (index === rack.servicePort ? present(port.tag) : Number.isInteger(port.vlan) && port.vlan >= 1 && port.vlan <= 4094);
        if (!rack || round.fault.kind !== 'vlan' || rack.target !== round.fault.target ||
            !Number.isInteger(rack.servicePort) || rack.servicePort < 0 || rack.servicePort > 7 ||
            !rack.target.endsWith('Gi0/' + (rack.servicePort + 1)) ||
            !Array.isArray(rack.ports) || rack.ports.length !== 8 || !rack.ports.every(validPort)) {
          return fail('the switch rack does not match its service port.');
        }
      }
      const choiceIds = new Set(); if (!round.choices.every(c=>c && present(c.id) && !choiceIds.has(c.id) && choiceIds.add(c.id) && present(c.label) && present(c.diagnosis) && present(c.target) && c.value !== undefined && (evaluate(round,c.id).status === 'correct' || present(c.why)))) return fail('choices are invalid or lack explanations.');
      if (!round.choices.some(c=>evaluate(round,c.id).status === 'correct') || !round.choices.some(c=>evaluate(round,c.id).status === 'incorrect')) return fail('a valid repair and a wrong choice are required.');
      return {...round,unavailable:false};
    });
  }
  return data;
}
