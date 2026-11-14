import {sampleSpectrum} from './observations.js';
import {recordTelemetry} from './telemetry.js';
import {solarPower,energyStep} from './science.js';
import {screenMovement,moveWithinArena,strike,createEnemy,clamp} from './combat.js';

export function tickMission(r,cfg,mission,keys,dt,hooks){
 const {announce,sparks,beep,hurt,decision,upgrade,result}=hooks,p=r.p;r.time+=dt;
 for(const k of ['dash','pulse','invuln','attackCd','special','attackAnim','comboWindow','shake'])r[k]=Math.max(0,r[k]-dt);
 const sx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),sy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0),movement=screenMovement(sx,sy);r.moving=!!(sx||sy);
 if(r.moving){p.dx=movement.x;p.dy=movement.y;}
 if(keys.has(' ')&&r.dash<=0){r.dash=.85;r.dashTime=.18;r.dashDirection={x:p.dx,y:p.dy};r.invuln=.22;r.wh=Math.max(0,r.wh-.18);sparks(p.x,p.y,mission.color,10);beep(230,.05);}
 // Exponential response is independent of frame rate; braking is firmer than acceleration.
 r.velocity??={x:0,y:0};const response=1-Math.exp(-(r.moving?24:32)*dt);
 r.velocity.x+=(movement.x*190-r.velocity.x)*response;r.velocity.y+=(movement.y*190-r.velocity.y)*response;
 const before={x:p.x,y:p.y};
 if(r.dashTime>0){r.dashTime=Math.max(0,r.dashTime-dt);moveWithinArena(p,r.dashDirection.x,r.dashDirection.y,dt,650);}else moveWithinArena(p,r.velocity.x/190,r.velocity.y/190,dt,190);
 r.stride=(r.stride||0)+Math.hypot(p.x-before.x,p.y-before.y)/22;
 r.speed=Math.hypot(r.velocity.x,r.velocity.y);
 // A quick tap during recovery survives for 140 ms, instead of disappearing in one frame.
 r.inputBuffer??={};for(const [action,aliases] of Object.entries({strike:['j','mouse0'],bolt:['k','mouse2'],pulse:['q']}))r.inputBuffer[action]=aliases.some(k=>keys.has(k))?.14:Math.max(0,(r.inputBuffer[action]||0)-dt);
 const closest=[...r.enemies].sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
 if(hooks.pointer?.active){const d=Math.hypot(hooks.pointer.x-p.x,hooks.pointer.y-p.y)||1;r.aim={x:(hooks.pointer.x-p.x)/d,y:(hooks.pointer.y-p.y)/d};}else if(closest){const d=Math.hypot(closest.x-p.x,closest.y-p.y)||1;r.aim={x:(closest.x-p.x)/d,y:(closest.y-p.y)/d};}else r.aim={x:p.dx,y:p.dy};
 if(r.inputBuffer.strike>0&&r.attackCd<=0){r.inputBuffer.strike=0;r.combo=r.comboWindow>0?r.combo%3+1:1;r.comboWindow=.9;r.attackCd=r.combo===3?.43:.26;r.attackAnim=.22;const hits=strike(r,r.aim,{damage:r.combo===3?4:2,range:r.combo===3?105:85,wide:r.combo===3});r.attacks++;if(hits){r.shake=.13;sparks(p.x+r.aim.x*40,p.y+r.aim.y*40,'#b8ffe1',8);}beep(300+r.combo*90,.045);}
 if(r.inputBuffer.bolt>0&&r.special<=0&&r.heat<88){r.inputBuffer.bolt=0;r.special=.65;r.heat+=9;r.wh=Math.max(0,r.wh-.08);r.shots.push({x:p.x,y:p.y,dx:r.aim.x*610,dy:r.aim.y*610,life:1.1,friendly:true});beep(700,.06);}
 if(r.inputBuffer.pulse>0&&r.pulse<=0&&r.heat<90){r.inputBuffer.pulse=0;r.pulse=3;r.heat+=13;r.wh=Math.max(0,r.wh-.15);r.rings.push({x:p.x,y:p.y,t:0});r.shots=r.shots.filter(s=>s.friendly||Math.hypot(s.x-p.x,s.y-p.y)>165);strike(r,r.aim,{damage:2,range:165,wide:true});for(const e of r.enemies)if(Math.hypot(e.x-p.x,e.y-p.y)<165)e.stun=e.type==='boss'?.1:1.3;beep(600,.12);}
 const cycle=r.time%34,old=r.field;r.light=cycle>23?mission.id==='mars'?.22:0:1;r.field=cycle>23?(mission.id==='mars'?'dust event':'shadow passage'):'sunlight';r.contact=(r.time%18)<12;
 if(old!==r.field)announce(r.light<1?'Reduced sunlight. Watch generation and battery.':'Sunlight restored. Your array can generate again.');r.gen=cfg.power.id==='solar'?solarPower(cfg.power.watts,mission.au,r.light):cfg.power.watts;
 let demand=r.powerMode==='conserve'?45:80,prompt='',near=r.nodes.find(n=>!n.done&&Math.hypot(n.x-p.x,n.y-p.y)<62);
 if(near){prompt=r.heat>85?'Instrument cooling — stop scanning briefly':'Hold E / SCAN · measure this site';if(keys.has('e')&&r.heat<95){r.scanTime+=dt;demand+=cfg.payload.watts;r.heat+=12*dt;const scanDuration=cfg.payload.scan*(r.powerMode==='conserve'?1.5:1);prompt=`SCANNING ${Math.min(100,Math.round(r.scanTime/scanDuration*100))}%`;if(r.scanTime>=scanDuration){near.done=true;if(r.objective==='composition')near.spectrum=sampleSpectrum(r.nodes.indexOf(near));r.scans++;r.stored+=cfg.payload.data;r.scanTime=0;sparks(near.x,near.y,mission.color,25);announce(`${cfg.payload.data} MB collected. ${r.scans}/3 sites mapped. Data still needs to reach Earth.`);beep(800,.15);if(r.scans===1&&!r.decisionMade){r.decisionMade=true;decision();return;}if(r.scans===2&&!r.upgrade){r.upgrade=true;upgrade();return;}if(r.scans===3&&!r.bossSpawned){r.bossSpawned=true;r.enemies.push(createEnemy(++r.nextId,'boss',0,-240));announce('The relay guardian is awake. Break its lock, then transmit the archive.');}}}else r.scanTime=Math.max(0,r.scanTime-dt*.5);}else r.scanTime=0;
 if(Math.hypot(p.x,p.y-285)<75){if(r.bossSpawned&&!r.bossDefeated)prompt='Relay locked · defeat the guardian';else if(r.stored>0){if(r.contact){const transfer=Math.min(r.stored,cfg.comms.rate*r.up.rate*dt);r.stored-=transfer;r.returned+=transfer;demand+=cfg.comms.watts;prompt='UPLINK ACTIVE · stay within the beacon';}else prompt=`NO CONTACT · next window in ${Math.ceil(18-r.time%18)}s`;}else prompt=r.scans<3?'UPLINK READY · scan more sites':'All measurements transmitted';}
 r.prompt=prompt||(r.scans===3?(r.bossDefeated?'Return to the southern uplink beacon ↓':'Break the guardian’s lock · J strike / K bolt'):'');r.wh=energyStep(r.wh,r.gen,demand,dt*30,cfg.capacityWh);r.heat=clamp(r.heat-5*r.up.cooling*dt,0,100);recordTelemetry(r,demand);
 r.spawn-=dt;if(!r.bossSpawned&&r.spawn<=0&&r.enemies.length<6){const angle=r.nextId*2.39996,type=['scout','sentry','charger'][r.nextId%3];r.enemies.push(createEnemy(++r.nextId,type,Math.cos(angle)*330,Math.sin(angle)*330));r.spawn=5.5;}
 for(const e of r.enemies){if(e.hp<=0)continue;e.stun=Math.max(0,e.stun-dt);const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;if(e.stun>0)continue;
  if(e.charge>0){e.charge-=dt;e.x+=e.attackX*340*dt;e.y+=e.attackY*340*dt;if(d<30)hurt(13);}else if(e.windup>0){e.windup-=dt;if(e.windup<=0){if(e.type==='charger')e.charge=.55;else if(e.type==='boss'){const count=e.hp<30?16:10;for(let i=0;i<count;i++){const a=i/count*Math.PI*2+r.time*.2;r.shots.push({x:e.x,y:e.y,dx:Math.cos(a)*135,dy:Math.sin(a)*135,life:5});}}else r.shots.push({x:e.x,y:e.y,dx:e.attackX*180,dy:e.attackY*180,life:4});}}
  else{const speed=e.type==='boss'?22:e.type==='charger'?42:e.type==='sentry'?(d<145?-25:25):48;e.x+=dx/d*speed*dt;e.y+=dy/d*speed*dt;e.fire-=dt;if(e.fire<=0){e.attackX=dx/d;e.attackY=dy/d;e.windup=e.type==='boss'?1:.65;e.fire=e.type==='boss'?(e.hp<30?2.7:3.7):e.type==='charger'?3.2:2.8;}if(d<(e.type==='boss'?40:25))hurt(8);}
  const edge=Math.hypot(e.x,e.y);if(edge>345){e.x=e.x/edge*345;e.y=e.y/edge*345;}
 }
 for(const s of r.shots){s.x+=s.dx*dt;s.y+=s.dy*dt;s.life-=dt;if(s.friendly){for(const e of r.enemies)if(e.hp>0&&Math.hypot(s.x-e.x,s.y-e.y)<(e.type==='boss'?35:22)){e.hp-=3;s.life=0;sparks(e.x,e.y,'#a2f3d2',5);break;}}else if(Math.hypot(s.x-p.x,s.y-p.y)<16){hurt(9);s.life=0;}}
 r.shots=r.shots.filter(s=>s.life>0);for(const e of r.enemies.filter(e=>e.hp<=0)){r.kills++;r.hp=Math.min(100,r.hp+2);r.wh=Math.min(30,r.wh+.25);sparks(e.x,e.y,mission.color,12);if(e.type==='boss'){r.bossDefeated=true;r.shots=r.shots.filter(s=>s.friendly);announce('Relay unlocked. Your discovery is still aboard: bring it home.');}}
 r.enemies=r.enemies.filter(e=>e.hp>0);
 if(!r.hazard&&r.time>12&&Math.floor(r.time)%13===0)r.hazard={x:p.x,y:p.y,t:2};if(r.hazard){r.hazard.t-=dt;if(r.hazard.t<=0){if(Math.hypot(r.hazard.x-p.x,r.hazard.y-p.y)<75)hurt(18);sparks(r.hazard.x,r.hazard.y,'#ffb384',28);r.hazard=null;}}
 for(const s of r.sparks){s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt;s.vz-=110*dt;s.life-=dt;}r.sparks=r.sparks.filter(s=>s.life>0);r.rings.forEach(a=>a.t+=dt);r.rings=r.rings.filter(a=>a.t<.5);
 if(r.wh<=0||r.hp<=0){recordTelemetry(r,demand,true);result(false);}else if(r.scans===3&&r.bossDefeated&&r.returned>=(r.targetData??mission.target)-.01&&r.stored<.01){recordTelemetry(r,demand,true);result(true);}
}
