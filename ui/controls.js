import {collection} from './missions.js';
import {sendProbe} from './probe.js';
import {devices, assessRepair} from './service.js';
import {advance,createState,current,help,nextLevel,submit} from '../engine/state.js';
import {render} from './render.js';
export function mount(data) {
  let state=createState(data); const app=document.querySelector('#app');
  app.addEventListener('submit', event => {
    if (event.target.id !== 'service') return;
    event.preventDefault();
    const round = current(state);
    const record = state.records[round.id];
    if (record.status !== 'unsolved') return;
    const result = assessRepair(round, record.device, new FormData(event.target));
    if (result.choice) submit(state, result.choice);
    else {
      if (result.mistake) record.attempts++;
      state.feedback = {good:false, text:result.guidance || result.mistake};
    }
    render(state,true);
  });
  app.addEventListener('click',event=>{ const action=event.target.closest('[data-action]')?.dataset.action; if(!action)return;
    if (action === 'radio') {
      const record = state.records[current(state).id];
      record.radioOpen = !record.radioOpen;
      event.target.setAttribute('aria-expanded', String(record.radioOpen));
      app.querySelector('#crew-report').hidden = !record.radioOpen;
      return;
    }
    if (action === 'probe') {
      const round = current(state);
      const record = state.records[round.id];
      const previouslyEarned = record.patchEarned;
      sendProbe(event.target.closest('.probe'), round, record);
      if (record.patchEarned && !previouslyEarned) {
        app.querySelector('.patch-board').innerHTML = collection(state);
      }
      return;
    }
    if (action === 'port') {
      const portButton = event.target.closest('[data-port]');
      const record = state.records[current(state).id];
      record.port = Number(portButton.dataset.port);
      render(state);
      app.querySelector('.rack-port[aria-pressed="true"]').focus();
      return;
    }
    if(action==='inspect') {
      const round=current(state);
      state.records[round.id].device=devices(round)[Number(event.target.dataset.device)];
      state.feedback=null;
      render(state);
      app.querySelector('.rack-face')?.classList.add('opening');
      document.querySelector('#device-title')?.focus();
      return;
    }
    if(action==='start')state.view='incident';
    if(action==='help')help(state);
    if(action==='next')advance(state);
    if(action==='skip')advance(state,true);
    if(action==='next-level')nextLevel(state);
    if(action==='restart' && window.confirm('Restart the shift? All session progress will be cleared.'))state=createState(data);
    render(state,true);
  }); render(state,true);
}
