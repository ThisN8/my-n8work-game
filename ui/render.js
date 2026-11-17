import {collection} from './missions.js';
import {probePanel} from './probe.js';
import {workbench} from './service.js';
import {mountOutpost} from './outpost.js';
import {current} from '../engine/state.js';
import {escapeHtml as e} from '../engine/feedback.js';
const button=(action,label,cls='')=>`<button type="button" data-action="${action}" class="${cls}">${label}</button>`;
function structuredEvidence(round) {
  const lines=round.observations.map(o=>`${o.target}: expected ${o.kind==='vlan'?'VLAN':'gateway'} ${o.expected}; observed ${o.observed}.`);
  const fault=round.fault;
  if(fault.kind==='missing-route'||fault.kind==='wrong-next-hop') {
    lines.push(`Destination ${fault.destination}; installed routes: ${fault.routes.length ? fault.routes.map(r=>`${r.prefix} via ${r.nextHop}`).join('; ') : 'none'}.`);
    lines.push(`Intended route: ${fault.expected.prefix} via ${fault.expected.nextHop}.`);
  }
  return lines;
}
export function render(s, focus=false) {
  const app=document.querySelector('#app'), level=s.data.levels[s.level], round=current(s), record=s.records[round.id], all=Object.values(s.records), solved=all.filter(r=>r.status==='solved').length, attempts=all.reduce((a,r)=>a+r.attempts,0), helped=all.filter(r=>r.help>0).length;
  let body='';
  if(s.view==='briefing') body=`<p class="kicker">SHIFT BRIEFING / LEVEL 0${s.level+1}</p><h2 tabindex="-1" id="view-title">${e(level.title)}</h2><div class="intro"><p>${e(level.briefing)}</p><p><strong>THE RULES OF THIS SHIFT</strong><br>This is a simplified, stable IPv4 network snapshot. The displayed evidence and intended settings are authoritative; components not identified as faulty are healthy. Each incident has one modeled root cause. Diagnose only from the evidence shown. IPv6, wireless, NAT, dynamic routing, loss, and changing network conditions are outside this model.</p><p>Inspect the devices on the path and enter the configuration that restores the link. Help and retries have no penalty.</p></div>${button('start','BEGIN INCIDENT →')}`;
  if(s.view==='incident') {
    const feedback=s.feedback?`<div id="feedback" class="feedback ${s.feedback.good?'good':''}" role="status" tabindex="-1">${e(s.feedback.text)}</div>`:'<div id="feedback" role="status"></div>';
    if(record.status==='unavailable') body=`<p class="kicker">INCIDENT ${e(round.id)} / CONTENT ERROR</p><h2 tabindex="-1" id="view-title">Incident unavailable</h2><p class="feedback">${e(round.error||'This incident has an authoring error and cannot be graded.')}</p><p>Skip this incident to continue. This level and your session will remain incomplete.</p>${button('skip','SKIP INCIDENT →')}`;
    else body=`<p class="kicker">INCIDENT ${e(round.id)} / ${record.status==='solved'?'RESOLVED':'INVESTIGATING'}</p><h2 tabindex="-1" id="view-title">${e(round.title)}</h2><div class="incident"><strong>${record.status==='solved'?'RESOLVED':'ALERT'}</strong> &nbsp; ${e(round.alert)}</div><p class="label">AFFECTED PATH ${record.status==='solved'?' / HEALTHY':''}</p><div class="path" aria-label="Network path">${e(round.path)} ${record.status==='solved'?' — HEALTHY':''}</div>${round.crewReport ? `<section class="crew-radio"><button type="button" data-action="radio" aria-controls="crew-report" aria-expanded="${Boolean(record.radioOpen)}">Radio the pump operator</button><p id="crew-report" ${record.radioOpen ? '' : 'hidden'}>${e(round.crewReport)}</p></section>` : ''}${probePanel(round,record)}<h3 style="margin-top:1.5rem">01 / INSPECT THE EVIDENCE</h3><div class="evidence" tabindex="0" aria-label="Incident evidence">${structuredEvidence(round).concat(round.evidence).map(x=>`<p>${e(x)}</p>`).join('')}</div>${record.status==='solved'&&!round.rack?'':workbench(round,record)}<div class="actions">${record.status==='solved'?button('next','Next'):button('help',`HELP ${record.help}/3`,'secondary')}</div>${record.help?`<div class="help"><strong>FIELD GUIDE</strong>${round.hints.slice(0,record.help).map((h,i)=>`<p>${['METHOD','WORKED STEP','SOLUTION'][i]}: ${e(h)}</p>`).join('')}</div>`:''}${feedback}`;
  }
  if(s.view==='level-summary'||s.view==='summary') { const isFinal=s.view==='summary', levels=isFinal?s.data.levels:[level], rows=levels.flatMap(l=>l.rounds.map(r=>({id:r.id,...s.records[r.id]}))), complete=rows.every(r=>r.status==='solved'); body=`<p class="kicker">${isFinal?'END OF SHIFT':'LEVEL REPORT'}</p><h2 tabindex="-1" id="view-title">${isFinal?'Session':'Level'} ${complete?'complete':'incomplete'}</h2><p>Completion records solved incidents; assistance is shown separately and is not independent mastery.</p><ul class="summary-list">${rows.map(r=>`<li>Incident ${e(r.id)}: ${e(r.status)} · ${r.attempts} valid attempt(s) · help level ${r.help}/3</li>`).join('')}</ul>${isFinal?button('restart','RESTART SHIFT'):button('next-level','CONTINUE →')}`; }
  const restart=s.view==='summary'?'':button('restart','RESTART','secondary');
  app.innerHTML=`<div class="layout"><section class="panel main-panel">${body}</section><aside class="panel side" aria-label="Session progress"><p class="kicker">SHIFT STATUS</p><h3>YOUR PROGRESS</h3><ul class="progress"><li>Level <strong>${s.level+1} / 3</strong></li><li>Solved <strong>${solved} / 6</strong></li><li>Attempts <strong>${attempts}</strong></li><li>Help used <strong>${helped} incident(s)</strong></li></ul><section class="patch-board">${collection(s)}</section><p class="label">NO TIMER · NO PENALTIES</p>${restart}</aside></div>`;
  const rackProbe = app.querySelector('.rack-probe');
  if (rackProbe) rackProbe.append(app.querySelector('.probe'));
  mountOutpost(app.querySelector('.main-panel'), s);
  if(focus) (document.querySelector('#feedback:not(:empty)')||document.querySelector('#view-title'))?.focus();
}

