import * as THREE from './vendor/three.module.js';

// Full-resolution 3D scene. Pixel typography belongs to the HTML overlay only.
export class MissionWorld {
 constructor(canvas){
  this.canvas=canvas;this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#07121e');this.scene.fog=new THREE.FogExp2('#07121e',.009);
  this.camera=new THREE.OrthographicCamera(-24,24,18,-18,.1,180);this.camera.position.set(27,33,27);this.camera.lookAt(0,0,0);
  this.scene.add(new THREE.HemisphereLight('#b8ddf2','#283039',2));
  this.sun=new THREE.DirectionalLight('#ffe3b8',3.5);this.sun.position.set(-18,30,12);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:.5,far:90});this.sun.shadow.bias=-.0004;this.scene.add(this.sun);
  const rim=new THREE.DirectionalLight('#6bd4e2',2);rim.position.set(12,8,-18);this.scene.add(rim);
  this.static=new THREE.Group();this.scene.add(this.static);this.actors=new THREE.Group();this.scene.add(this.actors);this.effects=new THREE.Group();this.scene.add(this.effects);
  this.ray=new THREE.Raycaster();this.ground=new THREE.Plane(new THREE.Vector3(0,1,0),0);this.target=new THREE.Vector3();this.enemyModels=new Map();this.nodeModels=[];this.effectPool=[];this.lastMission='';this.follow=new THREE.Vector3();this.shake=0;
  this.geometries={cube:new THREE.BoxGeometry(1,1,1),sphere:new THREE.SphereGeometry(1,20,14),rock:new THREE.IcosahedronGeometry(1,0),cylinder:new THREE.CylinderGeometry(1,1,1,24),cone:new THREE.ConeGeometry(1,1,6),ring:new THREE.TorusGeometry(1,.035,6,60)};
  this.mats=new Map();this.hero=this.createHero();this.actors.add(this.hero);this.resize();
  const stars=new THREE.BufferGeometry(),positions=[];for(let i=0;i<240;i++)positions.push(Math.sin(i*127.3)*80,8+Math.abs(Math.cos(i*19.1))*55,-40-Math.abs(Math.sin(i*39.1))*35);stars.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));this.scene.add(new THREE.Points(stars,new THREE.PointsMaterial({color:'#c3d7df',size:.09,transparent:true,opacity:.6})));
 }
 material(color,glow=false,metal=.25){const key=color+glow+metal;if(!this.mats.has(key))this.mats.set(key,new THREE.MeshStandardMaterial({color,metalness:metal,roughness:glow?.35:.7,emissive:glow?color:'#000000',emissiveIntensity:glow?.7:0}));return this.mats.get(key);}
 mesh(parent,shape,color,x,y,z,sx,sy=sx,sz=sx,glow=false){const mesh=new THREE.Mesh(this.geometries[shape],this.material(color,glow));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=!glow;mesh.receiveShadow=!glow;parent.add(mesh);return mesh;}
 ring(parent,x,y,z,r,color){const ring=this.mesh(parent,'ring',color,x,y,z,r,r,r,true);ring.rotation.x=-Math.PI/2;return ring;}
 createHero(){const root=new THREE.Group(),rig=new THREE.Group();root.add(rig);root.userData.rig=rig;
  this.mesh(rig,'cylinder','#263e4a',0,.92,0,.30,.65,.25);this.mesh(rig,'sphere','#c9d6ce',0,1.46,0,.34,.35,.32);
  this.mesh(rig,'sphere','#102c3f',0,1.46,.19,.28,.21,.22);this.mesh(rig,'cube','#87f4de',0,1.48,.39,.32,.065,.035,true);
  this.mesh(rig,'cube','#e0caa4',0,1.03,.14,.51,.42,.26);this.mesh(rig,'cube','#49c6b6',0,1.07,.29,.16,.17,.04,true);
  this.mesh(rig,'cube','#1c3546',0,1.06,-.30,.43,.55,.25);this.mesh(rig,'cylinder','#8faca8',-.23,1.04,-.3,.09,.55,.09);this.mesh(rig,'cylinder','#8faca8',.23,1.04,-.3,.09,.55,.09);
  root.userData.legs=[];root.userData.arms=[];
  for(const side of [-1,1]){
   const leg=new THREE.Group();leg.position.set(side*.17,.68,0);rig.add(leg);
   this.mesh(leg,'cylinder','#536a70',0,-.14,0,.12,.28,.12);
   const knee=new THREE.Group();knee.position.y=-.28;leg.add(knee);this.mesh(knee,'sphere','#cad0bc',0,0,.035,.13);
   this.mesh(knee,'cylinder','#536a70',0,-.13,0,.10,.26,.10);this.mesh(knee,'cube','#243744',0,-.26,.08,.25,.15,.40);
   root.userData.legs.push({hip:leg,knee});
   const arm=new THREE.Group();arm.position.set(side*.36,1.17,0);rig.add(arm);this.mesh(arm,'sphere','#d9ceb3',0,-.08,0,.17,.22,.17);
   const elbow=new THREE.Group();elbow.position.y=-.23;arm.add(elbow);this.mesh(elbow,'cylinder','#6a8587',0,-.1,.03,.10,.26,.10);root.userData.arms.push({shoulder:arm,elbow});
   if(side===1){const blade=this.mesh(elbow,'cube','#8bffe1',.03,-.18,.68,.045,.10,1.0,true);blade.rotation.x=-.12;root.userData.blade=arm;}
  }
  this.ring(root,0,.045,0,.55,'#8ad6bd');return root;
 }
 rebuild(mission){this.lastMission=mission.id;this.static.clear();this.enemyModels.forEach(m=>this.actors.remove(m));this.enemyModels.clear();this.nodeModels=[];
  const pal=mission.id==='mars'?{soil:'#724735',rock:'#9e6750',slab:'#483c3b',accent:'#ffbd88'}:mission.id==='europa'?{soil:'#486779',rock:'#9fbac5',slab:'#384e63',accent:'#a7b9ff'}:{soil:'#515e63',rock:'#8b9593',slab:'#34464c',accent:'#99efca'};this.palette=pal;
  const island=this.mesh(this.static,'cylinder',pal.slab,0,-1.15,0,16.8,2.2,16.8);island.rotation.y=Math.PI/8;
  this.mesh(this.static,'cylinder',pal.soil,0,-.05,0,16.55,.18,16.55);
  // Broad mineral bands and inset cables break up the terrain without pixel textures.
  for(let i=0;i<6;i++){const a=i*1.047,band=this.mesh(this.static,'cube',pal.slab,Math.cos(a)*7,.06,Math.sin(a)*7,.18,.035,10);band.rotation.y=-a;}
  for(let i=0;i<15;i++){const a=i*2.39996,r=3+(i%5)*2;const patch=this.mesh(this.static,'cylinder',i%2?pal.slab:pal.rock,Math.sin(a)*r,.045,Math.cos(a)*r,1.5,.022,.8);patch.rotation.y=a;}
  // Raised strata and distant terrain create actual depth and cast shadows.
  for(let i=0;i<70;i++){const angle=i*2.39996,radius=15.6+(i%5)*.47,x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;const rock=this.mesh(this.static,'rock',i%3?pal.rock:pal.slab,x,-.2-(i%4)*.25,z,1+(i%4)*.35,1.1+(i%6)*.33,1+(i%3)*.35);rock.rotation.set(i*.31,i*.67,i*.13);}
  for(let i=0;i<45;i++){const angle=i*2.39996,radius=3+(i%9)*1.2,x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;if(Math.abs(x)<2&&z>4)continue;const rock=this.mesh(this.static,'rock',pal.rock,x,.08,z,.18+(i%3)*.13,.12+(i%4)*.12,.22+(i%3)*.11);rock.rotation.set(i,.3*i,.1*i);}
  // Architectural remains: low wall, ribs, observatory arch and cable conduits.
  for(let i=0;i<9;i++){const a=-Math.PI*.9+i*.18,x=Math.cos(a)*14,z=Math.sin(a)*14;this.mesh(this.static,'cube',pal.slab,x,1,z,.65,2+(i%3),.65);this.mesh(this.static,'cube','#94a19c',x,2.2+(i%3)*.5,z,.86,.18,.86);}
  for(const x of [-4,4]){this.mesh(this.static,'cube','#303e48',x,2.2,-12,.8,4.4,1.2);this.mesh(this.static,'cube','#b3b3a2',x,4.5,-12,1.25,.3,1.45);}this.mesh(this.static,'cube','#5a7078',0,4.6,-12,8.8,.55,1.3);this.mesh(this.static,'cube',pal.accent,0,4.58,-11.3,5,.07,.06,true);
  for(let i=0;i<6;i++){const tile=this.mesh(this.static,'cube',pal.slab,0,.055,10-i*3,3.3,.14,2.65);tile.rotation.y=.07;this.mesh(this.static,'cube','#a5b0a1',1.4,.15,10-i*3,.05,.03,2);}
  this.ring(this.static,0,.13,0,13.8,pal.accent);this.ring(this.static,0,.15,0,13.65,'#354b55');
  for(const side of [-1,1]){const tower=new THREE.Group();tower.position.set(side*11,0,3);this.static.add(tower);this.mesh(tower,'cube','#283c48',0,.35,0,2,.7,2);this.mesh(tower,'cylinder','#6e888d',0,1.7,0,.24,2.8,.24);const panel=this.mesh(tower,'cube','#123b58',side*.65,2.4,0,2.6,.1,2.1);panel.rotation.z=side*.3;for(let j=0;j<5;j++)this.mesh(tower,'cube','#5b9da9',side*.65,2.47,j*.38-.76,2.5,.025,.025);this.mesh(tower,'sphere',pal.accent,0,3.4,0,.12,.12,.12,true);}
  // Three dimensional relay dish at the extraction zone.
  const relay=new THREE.Group();relay.position.set(0,0,11.4);this.static.add(relay);this.mesh(relay,'cylinder','#405662',0,.2,0,1.3,.4,1.3);this.mesh(relay,'cylinder','#a4b4b0',0,1.2,0,.18,2,.18);const dish=this.mesh(relay,'sphere','#d6d9c8',0,2.4,0,1,.17,1);dish.rotation.z=-.5;this.mesh(relay,'cylinder',pal.accent,.25,2.8,0,.035,.8,.035,true);this.ring(relay,0,.06,0,2.6,pal.accent);this.relay=relay;
  // Orbiting planet is background art; no claim of physical spatial scale.
  const planet=this.mesh(this.static,'sphere',mission.id==='moon'?'#477f9c':mission.id==='mars'?'#b28c6e':'#d6ac8f',-24,9,-33,7);planet.castShadow=false;const band=this.ring(this.static,-24,9,-33,8.5,'#688a9d');band.rotation.set(.6,.2,-.4);
  for(let i=0;i<14;i++){const a=i*1.3;this.mesh(this.static,'rock',pal.slab,Math.sin(a)*33,-6-(i%4),Math.cos(a)*28,2+(i%3),1+(i%4),2);}
 }
 createNode(node,index){const root=new THREE.Group();root.position.set(node.x/25,0,node.y/25);this.static.add(root);this.mesh(root,'cylinder','#344953',0,.2,0,.9,.4,.9);this.mesh(root,'cylinder','#adb7a9',0,.7,0,.25,.85,.25);const core=this.mesh(root,'cone',this.palette.accent,0,1.5,0,.35,.75,.35,true);this.ring(root,0,.05,0,1.5,this.palette.accent);root.userData.core=core;this.nodeModels[index]=root;return root;}
 createEnemy(enemy){const root=new THREE.Group(),boss=enemy.type==='boss',color=boss?'#e6ad7c':enemy.type==='charger'?'#d87864':enemy.type==='sentry'?'#b3a0e9':'#dcaa7e';
  this.mesh(root,boss?'sphere':'rock','#2b3c50',0,1,0,boss?1.15:.49,boss?1:.49,boss?1.15:.49);
  this.mesh(root,'sphere',color,0,1,.40,boss?.62:.22,boss?.35:.15,boss?.7:.22,true);
  for(const side of [-1,1]){this.mesh(root,'cube','#65777d',side*(boss?1.4:.65),1,0,boss?.7:.4,.22,.6);this.mesh(root,'cone',color,side*(boss?1.4:.65),.65,0,.18,.4,.18,true);}
  if(boss){const halo=this.ring(root,0,1.2,0,1.8,color);halo.rotation.x=.3;root.userData.halo=halo;this.mesh(root,'cone','#73828b',0,2,0,.55,1.1,.55);}else if(enemy.type==='charger')for(const side of [-1,1])this.mesh(root,'cone','#c4b9a0',side*.35,.7,.55,.15,.8,.15);
  const bg=this.mesh(root,'cube','#17212b',0,boss?3:1.9,0,boss?3:1.2,.10,.05);const health=this.mesh(root,'cube',color,0,boss?3.02:1.92,.04,boss?3:1.2,.08,.05,true);root.userData.health=health;root.userData.width=boss?3:1.2;root.userData.baseHp=enemy.maxHp||enemy.hp;this.actors.add(root);this.enemyModels.set(enemy.id,root);return root;
 }
 effect(index,shape,color){let mesh=this.effectPool[index];if(!mesh){mesh=new THREE.Mesh(this.geometries[shape],this.material(color,true));this.effects.add(mesh);this.effectPool[index]=mesh;}mesh.geometry=this.geometries[shape];mesh.material=this.material(color,true);mesh.visible=true;mesh.rotation.set(0,0,0);return mesh;}
 aim(clientX,clientY){const rect=this.canvas.getBoundingClientRect();this.ray.setFromCamera(new THREE.Vector2((clientX-rect.left)/rect.width*2-1,-(clientY-rect.top)/rect.height*2+1),this.camera);const hit=this.ray.ray.intersectPlane(this.ground,this.target);return hit?{x:hit.x*25,y:hit.z*25}:null;}
 project(x,y,z=0){const p=new THREE.Vector3(x/25,z,y/25).project(this.camera),r=this.canvas.getBoundingClientRect();return{x:(p.x+1)*r.width/2,y:(1-p.y)*r.height/2};}
 resize(){const width=this.canvas.clientWidth,height=this.canvas.clientHeight;this.renderer.setSize(width,height,false);const aspect=width/height,half=aspect<.8?22/aspect:20;this.camera.left=-half*aspect;this.camera.right=half*aspect;this.camera.top=half;this.camera.bottom=-half;this.camera.updateProjectionMatrix();}
 render(run,mission,state,time,dt){if(this.lastMission!==mission.id)this.rebuild(mission);const p=run?.p||{x:0,y:165,dx:0,dy:-1};
  const active=state==='play',speed=active?(run?.speed||0)/190:0,dashing=active&&run?.dashTime>0;
  this.hero.position.set(p.x/25,0,p.y/25);const angle=Math.atan2(run?.aim?.x??p.dx,run?.aim?.y??p.dy),old=this.hero.rotation.y;
  this.hero.rotation.y=old+Math.atan2(Math.sin(angle-old),Math.cos(angle-old))*(1-Math.exp(-22*dt));
  const rig=this.hero.userData.rig,phase=run?.stride||0,attack=active?(run?.attackAnim||0)/.22:0;
  const gait=Math.sin(phase),facing=Math.atan2(p.dx,p.dy)-this.hero.rotation.y;
  rig.position.y=dashing?.08:speed*Math.abs(gait)*.075+Math.sin(time*2)*.012;
  rig.rotation.x=(dashing?.52:speed*.13)*Math.cos(facing);rig.rotation.z=-(dashing?.42:speed*.10)*Math.sin(facing);
  rig.rotation.y=attack?Math.sin((1-attack)*Math.PI*2)*.35*(run.combo===2?-1:1):0;
  this.hero.userData.legs.forEach(({hip,knee},i)=>{const wave=Math.sin(phase+i*Math.PI);hip.rotation.x=dashing?(i===0?-.8:.6):wave*.65*speed*Math.cos(facing);hip.rotation.z=-wave*.42*speed*Math.sin(facing);knee.rotation.x=dashing?.9:Math.max(0,-wave)*.9*speed;});
  this.hero.userData.arms.forEach(({shoulder,elbow},i)=>{shoulder.rotation.set(dashing?-.7:-Math.sin(phase+i*Math.PI)*.4*speed,0,i===0?-.10:.10);elbow.rotation.x=-.35-speed*.25;});
  if(attack){const blade=this.hero.userData.blade;blade.rotation.y=(run.combo===2?-1:1)*(-1.4+2.8*(1-attack));blade.rotation.x=-.9-Math.sin(attack*Math.PI)*.4;}
  this.hero.visible=true;this.hero.scale.setScalar(state==='hangar'?1.8:1.65);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const target=new THREE.Vector3(p.x/25*.17+(run?.aim?.x||0)*.35,0,p.y/25*.17+(run?.aim?.y||0)*.35);this.follow.lerp(target,1-Math.exp(-5*dt));const shake=reduced?0:(run?.shake||0)*.35;
  this.camera.position.set(27+this.follow.x+Math.sin(time*98)*shake,33,27+this.follow.z+Math.cos(time*87)*shake);this.camera.lookAt(this.follow.x,0,this.follow.z);this.sun.intensity=run?.light<1?1.25:3.5;
  const nodes=run?.nodes||[{x:-225,y:-70},{x:205,y:-180},{x:265,y:155}];for(let i=0;i<nodes.length;i++){const model=this.nodeModels[i]||this.createNode(nodes[i],i);model.userData.core.rotation.y=time*.7;model.userData.core.position.y=nodes[i].done?.7:1.5+Math.sin(time*2+i)*.15;model.userData.core.visible=!nodes[i].done;}
  const alive=new Set();for(const enemy of run?.enemies||[]){alive.add(enemy.id);const model=this.enemyModels.get(enemy.id)||this.createEnemy(enemy);model.position.set(enemy.x/25,Math.sin(time*3+enemy.id)*.12,enemy.y/25);model.rotation.y=Math.atan2(p.x-enemy.x,p.y-enemy.y);const anticipation=enemy.windup>0?Math.sin(time*18)*.06:0;model.scale.set(1+anticipation,1-anticipation,1+anticipation);model.rotation.x=enemy.charge>0?.22:0;model.userData.health.scale.x=model.userData.width*Math.max(0,enemy.hp/model.userData.baseHp);if(model.userData.halo)model.userData.halo.rotation.z=time;if(enemy.stun>0)model.rotation.z=Math.sin(time*30)*.12;else model.rotation.z=0;}
  for(const [id,model] of this.enemyModels)if(!alive.has(id)){this.actors.remove(model);this.enemyModels.delete(id);}
  let count=0;if(dashing){for(let i=1;i<=5;i++){const trail=this.effect(count++,'sphere','#8bffe1');trail.position.set(p.x/25-run.dashDirection.x*i*.35,.5,p.y/25-run.dashDirection.y*i*.35);trail.scale.setScalar(.22-i*.03);}}for(const shot of run?.shots||[]){const mesh=this.effect(count++,'sphere',shot.friendly?'#9affe0':'#ff9d76');mesh.position.set(shot.x/25,.9,shot.y/25);mesh.scale.setScalar(shot.friendly?.16:.13);}
  if(run?.invuln>0){const shield=this.effect(count++,'ring','#d1fff3');shield.position.set(p.x/25,.12,p.y/25);shield.rotation.x=-Math.PI/2;shield.scale.setScalar(.9+Math.sin(time*18)*.08);}for(const enemy of run?.enemies||[]){if(enemy.windup>0&&enemy.type!=='boss'){const arrow=this.effect(count++,'cone','#ffb484');arrow.position.set(enemy.x/25+enemy.attackX*1.8,.2,enemy.y/25+enemy.attackY*1.8);arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(enemy.attackX,0,enemy.attackY));arrow.scale.set(.20,1.4,.20);}}for(const particle of run?.sparks||[]){const mesh=this.effect(count++,'sphere',particle.color);mesh.position.set(particle.x/25,Math.max(.1,particle.z/25),particle.y/25);mesh.scale.setScalar(.04+Math.max(0,particle.life)*.07);}
  for(const pulse of run?.rings||[]){const mesh=this.effect(count++,'ring','#91f6d9');mesh.position.set(pulse.x/25,.18,pulse.y/25);mesh.rotation.x=-Math.PI/2;mesh.scale.setScalar(pulse.t*13);}
  for(const telegraph of [run?.hazard,...(run?.enemies||[]).filter(e=>e.windup>0).map(e=>({x:e.x,y:e.y,t:e.windup,r:60}))].filter(Boolean)){const mesh=this.effect(count++,'ring','#ff9966');mesh.position.set(telegraph.x/25,.15,telegraph.y/25);mesh.rotation.x=-Math.PI/2;mesh.scale.setScalar((telegraph.r||75)/25);}
  if(run?.attackAnim>0){for(let i=0;i<9;i++){const a=angle-1.1+i*.27;const mesh=this.effect(count++,'sphere',run.combo===3?'#ffd599':'#b4ffe0');mesh.position.set(p.x/25+Math.sin(a)*2.1,.7,p.y/25+Math.cos(a)*2.1);mesh.scale.set(.1,.1,.35);mesh.rotation.y=a;}}
  for(let i=count;i<this.effectPool.length;i++)this.effectPool[i].visible=false;
  this.renderer.render(this.scene,this.camera);
 }
}
