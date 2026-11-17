import {escapeHtml as escape} from '../engine/feedback.js';

// Pixel embroidery for each site's souvenir, drawn on the same seven-stitch grid.
const designs = [
  ['0011100','0111110','1100011','1100011','1100011','1100011','1111111'],
  ['0001000','0011100','0101010','1001001','0001000','0011100','0111110'],
  ['1000001','0100010','0011100','0001000','0011100','0010100','0110110'],
  ['0001000','0011100','0011100','0111110','1101111','1111111','0111110'],
  ['0011100','0111110','1100011','1000001','1100011','0000110','0011100'],
  ['0001000','0011100','0111110','1111111','0110110','0110110','0111110']
];

export function registerProbe(record, index, probe) {
  if (probe.condition !== 'restored' || record.patchEarned) return;
  if (record.status === 'unsolved') record.baselineProbe = index;
  if (record.status === 'solved' && record.baselineProbe === index) record.patchEarned = true;
}

export function missionText(record) {
  if (record.patchEarned) return 'Patch earned! You verified that your repair restored this path.';
  if (record.status === 'solved' && record.baselineProbe !== undefined) return 'Link repaired. Ping the same path again to collect your patch.';
  if (record.status === 'solved') return 'Site restored. This patch needed a probe of the affected path before repair.';
  if (record.baselineProbe !== undefined) return 'Baseline recorded. Repair the link, then ping that path again.';
  return 'Optional mission: find the affected path with a ping before repair, then verify it afterward.';
}

export function collection(state) {
  const sites = state.data.levels.flatMap(level => level.rounds);
  const earned = sites.filter(site => state.records[site.id].patchEarned).length;
  const patches = sites.map((site,index) => {
    const owned = Boolean(state.records[site.id].patchEarned);
    const stitches = designs[index].join('').split('').map(bit => bit === '1' ? '<b></b>' : '<i></i>').join('');
    const name = site.patchName || site.id;
    return `<li class="site-patch" data-earned="${owned}"><span class="stitches" aria-hidden="true">${stitches}</span><span>${escape(name)}<small>${owned ? 'Earned' : 'Uncollected'}</small></span></li>`;
  });
  return `<h3>Field patches · ${earned}/${sites.length}</h3><ul class="patches">${patches.join('')}</ul>`;
}
