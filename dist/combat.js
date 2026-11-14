export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function screenMovement(x,y){const length=Math.hypot(x,y)||1;return{x:(x+y)/length/Math.SQRT2,y:(y-x)/length/Math.SQRT2};}
export function createEnemy(id,type,x,y){const hp=type==='boss'?60:type==='charger'?7:type==='sentry'?5:4;return{id,type,x,y,hp,maxHp:hp,stun:0,fire:2,windup:0,charge:0,attackX:0,attackY:0};}
export function strike(run,direction,{range=85,damage=2,wide=false}={}){let hits=0;for(const e of run.enemies){const x=e.x-run.p.x,y=e.y-run.p.y,d=Math.hypot(x,y)||1,dot=(x*direction.x+y*direction.y)/d;if(d<range&&(wide||dot>-.1)){e.hp-=damage;e.stun=e.type==='boss'?.08:.35;e.x+=direction.x*(e.type==='boss'?2:17);e.y+=direction.y*(e.type==='boss'?2:17);hits++;}}return hits;}
export function moveWithinArena(player,dx,dy,dt,speed=190){player.x+=dx*dt*speed;player.y+=dy*dt*speed;const distance=Math.hypot(player.x,player.y);if(distance>350){player.x=player.x/distance*350;player.y=player.y/distance*350;}}
