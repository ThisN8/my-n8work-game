const locations = ['Gatehouse', 'Relay hut', 'Uplink tower', 'Pump station', 'Dispatch', 'Shelter'];
const palettes = [
  ['#11182e','#364266','#6d5871'], ['#141b34','#424569','#79586c'],
  ['#1c203b','#50496d','#896175'], ['#29253e','#645377','#a06f7a'],
  ['#39304a','#806183','#bc857f'], ['#51405a','#a57783','#d99b83'],
  ['#705775','#c99795','#ffd39a']
];

export function mountOutpost(container, state) {
  const rounds = state.data.levels.flatMap(level => level.rounds);
  const current = state.level * 2 + state.round;
  const statuses = rounds.map(round => state.records[round.id].status);
  const passed = statuses.filter(status => ['solved', 'skipped'].includes(status)).length;
  const scene = document.createElement('section');
  scene.className = 'outpost';
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 108;
  canvas.setAttribute('aria-hidden','true');
  const caption = document.createElement('div');
  caption.className = 'outpost-caption';
  const time = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00'][passed];
  const restored = statuses.filter(status => status === 'solved').length;
  caption.textContent = time + '  /  ' + (passed === 6 ? 'DAYBREAK' : 'NIGHT WATCH') + '   ·   ' + restored + '/6 sites online';
  const objective = document.createElement('p');
  objective.textContent = state.view === 'summary'
    ? (restored === 6 ? 'The outpost made it through the night. All six beacons are lit.' : 'Dawn has reached the outpost. Skipped sites remain dark.')
    : locations[current] + '  /  ' + (statuses[current] === 'solved' ? 'Beacon restored. Your next post awaits.' : 'Restore the network link to bring this site online.');
  if (current === 0) {
    objective.textContent = statuses[0] === 'solved'
      ? 'Gatehouse online. Barrier raised. The supply truck is cleared for delivery.'
      : 'Gatehouse offline. A supply truck is waiting at the barrier.';
  }
  scene.append(caption, canvas, objective);
  container.prepend(scene);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const rect = (x,y,w,h,color) => { ctx.fillStyle=color; ctx.fillRect(x,y,w,h); };
  const [sky,middle,horizon] = palettes[passed];
  rect(0,0,384,108,sky); rect(0,28,384,17,middle); rect(0,45,384,31,horizon);
  for(let i=0;i<47;i++) rect((i*79+13)%384,(i*23+2)%39,1,1,'#d9dcb9');
  const moonX=293+passed*8;
  rect(moonX,7+passed*4,9,12,'#ffdfa5'); rect(moonX-2,10+passed*4,13,6,'#ffdfa5');
  if(passed<5) rect(moonX-2,6+passed*4,7,9,sky);
  // Stepped ridgelines and spruce silhouettes are drawn on the native pixel grid.
  for(let x=0;x<384;x+=2) {
    const ridge=47+Math.round(8*Math.sin(x/22)+5*Math.cos(x/12));
    rect(x,ridge,2,78-ridge,'#384051');
  }
  for(let i=0;i<40;i++) {
    const x=(i*41)%384, y=47+(i*7)%16;
    for(let j=0;j<7;j++) rect(x-j,y+j*2,j*2+1,3,'#202f38');
    rect(x-1,y+14,3,9,'#202f38');
  }
  rect(0,75,384,33,'#182b2e'); rect(0,91,384,4,'#54605b');
  for(let i=0;i<85;i++) rect(i*47%384,97+i*13%11,3,1,'#30413e');
  for(let i=0;i<6;i++) {
    const x=12+i*62, lit=statuses[i]==='solved', active=i===current && !lit;
    const lamp=lit?'#eccc78':active?'#ff8767':'#415053';
    const height=[13,10,22,14,19,11][i], top=85-height;
    rect(x,top,36,height,'#263941'); rect(x-3,top-3,42,4,'#647779');
    rect(x+2,top+2,32,2,'#40565b'); rect(x+24,77,6,8,'#14262c');
    for(let j=0;j<3;j++) rect(x+3+j*6,top+5,4,4,lamp);
    rect(x+17,top-12,1,10,'#97aaa4'); rect(x+16,top-13,3,2,lamp);
    rect(x+2,85,32,2,'#0e1e23');
    if(i===current) {
      // Operator: cap, face, field jacket, boots and handheld terminal.
      rect(x+37,79,5,3,'#efb76c'); rect(x+37,82,4,3,'#dba38a');
      rect(x+36,85,6,5,'#a2be7b'); rect(x+36,90,2,3,'#141e29');
      rect(x+40,90,2,3,'#141e29'); rect(x+42,85,3,3,'#9ce6cd');
    }
  }
  const gate = state.records[rounds[0].id];
  const open = gate.status === 'solved';
  const animate = open && !gate.deliveryShown && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (open) gate.deliveryShown = true;
  const road = ctx.getImageData(0, 78, 130, 27);
  function drawDelivery(progress) {
    ctx.putImageData(road, 0, 78);
    rect(31, 93, 3, 8, '#758887');
    const angle = Math.min(progress * 3, 1) * Math.PI / 2;
    for (let step = 0; step < 14; step++) {
      rect(31 - Math.round(step * Math.cos(angle)), 92 - Math.round(step * Math.sin(angle)),
        2, 2, step % 5 < 3 ? '#ffd693' : '#d06e50');
    }
    const x = 1 + Math.round(92 * Math.max(0, (progress - 0.33) / 0.67));
    rect(x, 92, 14, 7, '#cb995f');
    rect(x + 2, 93, 10, 1, '#eac787');
    rect(x + 14, 94, 5, 5, '#71999a');
    rect(x + 16, 94, 3, 2, '#d3ebe0');
    rect(x + 2, 99, 3, 3, '#101b22');
    rect(x + 14, 99, 3, 3, '#101b22');
  }
  drawDelivery(open && !animate ? 1 : 0);
  if (animate) {
    const start = performance.now();
    function frame(now) {
      if (!scene.isConnected) return;
      const progress = Math.min(1, Math.max(0, (now - start) / 1500));
      drawDelivery(progress);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
}
