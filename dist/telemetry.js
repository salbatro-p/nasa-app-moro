// Keep a bounded evidence trail; this is measured game state, not NASA telemetry.
export function recordTelemetry(r,demand,force=false){
 r.peakDemand=Math.max(r.peakDemand||0,demand);r.minBattery=Math.min(r.minBattery??30,r.wh);
 r.telemetry??=[];const last=r.telemetry.at(-1);if(!force&&last&&r.time-last.time<.5)return;
 r.telemetry.push({time:+r.time.toFixed(2),battery:+r.wh.toFixed(3),generation:+r.gen.toFixed(2),demand:+demand.toFixed(2),stored:+r.stored.toFixed(2),returned:+r.returned.toFixed(2),light:r.light});
 if(r.telemetry.length>1200)r.telemetry.splice(1,1);
}
export function telemetryMarkup(r){
 const points=r.telemetry||[];if(points.length<2)return '';
 const duration=Math.max(1,r.time),plot=(key,max)=>points.map(p=>(36+p.time/duration*528).toFixed(1)+','+(154-p[key]/max*126).toFixed(1)).join(' ');
 return `<section class="flight-evidence"><h2>Mission evidence</h2><p>Battery and delivered data over your actual run. Time is measured in play seconds.</p><svg viewBox="0 0 600 200" role="img" aria-label="Mission battery and returned data history"><path d="M36 24V154H564" fill="none" stroke="#63818c"/><path d="M36 91H564" stroke="#334f5a" stroke-dasharray="3 5"/><polyline points="${plot('battery',30)}" fill="none" stroke="#91edcb" stroke-width="3"/><polyline points="${plot('returned',r.targetData||60)}" fill="none" stroke="#ffd18c" stroke-width="3"/><g fill="#b9c9ce" font-size="12"><text x="6" y="32">100%</text><text x="8" y="158">0%</text><text x="36" y="181">0 s</text><text x="526" y="181">${Math.round(duration)} s</text></g></svg><div class="evidence-key"><span>■ Battery / 30 Wh</span><span>■ Returned / target data</span></div><div class="stat-line">Lowest battery <b data-no-translate>${(r.minBattery??r.wh).toFixed(1)} Wh</b></div><div class="stat-line">Measured peak load <b data-no-translate>${Math.round(r.peakDemand||0)} W</b></div><p>Stored data is not delivered science. The orange curve rises only when the ground link receives it.</p></section>`;
}
