import {rackPanel} from './rack.js';
import {escapeHtml as escape} from '../engine/feedback.js';
import {derive, ipv4, prefix} from '../engine/rules.js';

const names = {vlan:'Switch port', gateway:'Host gateway', route:'Routing table'};
function toolFor(kind) {
  return kind === 'vlan' || kind === 'gateway' ? kind : 'route';
}
export function devices(round) {
  return [...new Set(round.choices.map(choice => choice.target))];
}

export function workbench(round, record) {
  const targets = devices(round);
  const target = record.device;
  const controls = targets.map((name, index) =>
    `<button type="button" data-action="inspect" data-device="${index}" aria-pressed="${target === name}">${escape(name === round.rack?.target ? 'SW-01 switch rack' : name)}</button>`
  ).join('');
  let panel = '<p>Select a device to open its service panel.</p>';
  if (targets.includes(target)) {
    const options = round.choices.filter(choice => choice.target === target);
    const tool = toolFor(options[0].diagnosis);
    const reading = round.observations.find(item => item.target === target);
    let telemetry = 'Use the path observations to check this device.';
    if (reading) telemetry = `Configured ${reading.kind}: ${reading.observed}. Intended: ${reading.expected}.`;
    if (tool === 'route' && round.fault.routes) {
      telemetry = round.fault.routes.map(route => route.prefix + ' via ' + route.nextHop).join(', ') || 'No matching route installed.';
    }
    const fields = tool === 'route'
      ? '<label>Destination prefix <input name="network" placeholder="network/prefix" required></label><label>Next hop <input name="setting" placeholder="IPv4 address" required></label>'
      : `<label>${tool === 'vlan' ? 'Access VLAN' : 'Gateway address'} <input name="setting" required autocomplete="off"></label>`;
    panel = `<h3 tabindex="-1" id="device-title">${escape(target)} · ${names[tool]}</h3><p>${escape(telemetry)}</p><form id="service">${fields}<button type="submit">Apply configuration</button></form>`;
  }
  if (round.rack && target === round.rack.target) panel = rackPanel(round, record);
  if (record.status === 'solved') return '<section class="service-panel">' + panel + '</section>';
  return `<h3>Field service</h3><div class="devices">${controls}</div><section class="service-panel">${panel}</section>`;
}

export function assessRepair(round, target, form) {
  const choice = round.choices.find(item => item.target === target);
  if (!choice) return {guidance:'Select a device first.'};
  const tool = toolFor(choice.diagnosis);
  const setting = String(form.get('setting') ?? '').trim();
  const network = String(form.get('network') ?? '').trim();
  if (tool === 'vlan' && (!/^\d+$/.test(setting) || +setting < 1 || +setting > 4094))
    return {guidance:'Enter a VLAN from 1 through 4094.'};
  if (tool !== 'vlan' && ipv4(setting) === null) return {guidance:'Enter a valid IPv4 address.'};
  if (tool === 'route' && !prefix(network)) return {guidance:'Enter a network address with its prefix length.'};
  const repair = derive(round.fault);
  const matches = target === repair.target && (tool === 'route'
    ? network === repair.value.prefix && setting === repair.value.nextHop
    : (tool === 'vlan' ? +setting : setting) === repair.value);
  if (!matches) return {mistake:target === repair.target ? 'That setting does not restore the intended path. Compare it with the intended configuration.' : choice.why};
  const accepted = round.choices.find(item => item.target === target && item.diagnosis === repair.diagnosis &&
    (tool === 'route' ? item.value?.prefix === network && item.value?.nextHop === setting : item.value === repair.value));
  return {choice:accepted.id};
}
