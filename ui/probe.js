import {missionText, registerProbe} from './missions.js';
import {escapeHtml as escape} from '../engine/feedback.js';

export function probePanel(round, record) {
  const probes = round.probes;
  if (!probes?.length) return '';
  const selected = record.probeIndex ?? 0;
  const options = probes.map(({path}, index) => {
    const label = path[0] + ' → ' + path.at(-1);
    return `<option value="${index}" ${index === selected ? 'selected' : ''}>${escape(label)}</option>`;
  });
  return `<section class="probe"><h3>Packet probe</h3><p class="mission" role="status">${escape(missionText(record))}</p>
    <label>Test path <select class="probe-target">${options.join('')}</select></label>
    <button type="button" data-action="probe">Send ping</button>
    <div class="probe-track" aria-hidden="true"></div>
    <div class="probe-log" role="status">${historyText(record)}</div></section>`;
}

function historyText(record) {
  return (record.probeHistory ?? []).map(escape).join('<br>');
}

export function sendProbe(panel, round, record) {
  const index = Number(panel.querySelector('select').value);
  const probe = round.probes[index];
  if (!probe) return;
  record.probeIndex = index;
  registerProbe(record, index, probe);
  panel.querySelector('.mission').textContent = missionText(record);
  const repaired = record.status === 'solved';
  const reply = probe.condition === 'healthy' || (probe.condition === 'restored' && repaired);
  const result = (repaired ? 'After repair' : 'Before repair') + ' · ' + probe.path[0] + ' → ' +
    probe.path.at(-1) + (reply ? ' · Echo reply received' : ' · No echo reply');
  record.probeHistory = [...(record.probeHistory ?? []), result].slice(-4);
  const track = panel.querySelector('.probe-track');
  track.innerHTML = probe.path.map(name => '<span>' + escape(name) + '</span>').join('') +
    '<i class="packet' + (reply ? ' returning' : '') + '"></i>';
  panel.querySelector('.probe-log').innerHTML = historyText(record);
}
