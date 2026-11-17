import {escapeHtml as escape} from '../engine/feedback.js';

export function rackPanel(round, record) {
  const rack = round.rack;
  const selected = record.port;
  const port = rack.ports[selected];
  const solved = record.status === 'solved';
  const reading = round.observations.find(item => item.target === rack.target);
  const sockets = rack.ports.map((entry, index) => {
    const tag = entry.tag || 'Spare';
    return `<button type="button" class="rack-port" data-action="port" data-port="${index}"
      aria-label="Port ${index + 1}, ${escape(tag)}, link ${entry.tag ? 'up' : 'down'}"
      aria-pressed="${selected === index}">
      <span class="port-number">${String(index + 1).padStart(2,'0')}</span>
      <span class="socket ${entry.tag ? 'connected' : ''}" aria-hidden="true"></span>
      <span class="cable-tag">${escape(tag)}</span></button>`;
  }).join('');
  let details = 'Select a port to inspect its cable and link status.';
  if (port) {
    const servicePort = selected === rack.servicePort;
    const vlan = servicePort ? (solved ? reading.expected : reading.observed) : port.vlan;
    details = `<strong>Gi0/${selected + 1} · ${escape(port.tag || 'Spare')}</strong>
      <p>Physical link ${port.tag ? 'up' : 'down'} · Access VLAN ${vlan}</p>`;
    if (servicePort && !solved) {
      details += `<form id="service"><label>Set access VLAN <input name="setting" inputmode="numeric" required autocomplete="off"></label>
        <button type="submit">Apply configuration</button></form>`;
    } else if (!servicePort) {
      details += '<p>This port is outside the work order.</p>';
    }
  }
  return `<h3 id="device-title" tabindex="-1">Gatehouse switch rack</h3>
    <p>Work order · Trace the cable for ${escape(rack.ports[rack.servicePort].tag)} and restore VLAN ${reading.expected}.</p>
    <div class="rack-face"><div class="rack-name">SW-01 <span>ACCESS SWITCH</span></div>
    <div class="rack-ports">${sockets}</div></div>
    <section class="rack-reading">${details}</section><div class="rack-probe"></div>`;
}
