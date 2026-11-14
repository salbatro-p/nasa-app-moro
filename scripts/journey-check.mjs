import {chromium} from 'playwright';import assert from 'node:assert/strict';import path from 'node:path';
const out=path.resolve(process.argv[2]||'../../adventure-qa');const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install();await page.goto('http://127.0.0.1:4173');await page.locator('#launch').click();await page.locator('#story-skip').click();
const snapshot=()=>page.evaluate(async()=>(await import('./game.js')).getGameSnapshot());let down=new Set();
async function press(keys){const next=new Set(keys);for(const key of down)if(!next.has(key))await page.keyboard.up(key);for(const key of next)if(!down.has(key))await page.keyboard.down(key);down=next;}
let bossShot=false,decisions=0,upgrades=0;
for(let step=0;step<650;step++){
 const s=await snapshot();if(s.state==='result')break;
 if(s.state==='decision'){decisions++;await press([]);await page.screenshot({path:path.join(out,'astra-engineering-choice.png')});await page.locator('#full-power').click();continue;}
 if(s.state==='upgrade'){upgrades++;await press([]);await page.locator('[data-up="shield"]').click();continue;}
 const r=s.run,boss=r.enemies.find(e=>e.type==='boss'),node=r.nodes.find(n=>!n.done);let target=node||boss||{x:0,y:285};
 const dx=target.x-r.p.x,dy=target.y-r.p.y,d=Math.hypot(dx,dy);const keys=['j'];
 if(node&&d<45)keys.push('e');else if(boss&&d<65){keys.push('k','q');}else if(!node&&!boss&&d<30){}else{const sx=dx-dy,sy=dx+dy,m=Math.max(Math.abs(sx),Math.abs(sy));if(Math.abs(sx)>m*.28)keys.push(sx>0?'d':'a');if(Math.abs(sy)>m*.28)keys.push(sy>0?'s':'w');if(!node)keys.push('k');}
 await press(keys);await page.clock.runFor(160);
 if(boss&&!bossShot){await page.screenshot({path:path.join(out,'astra-guardian-3d.png')});bossShot=true;}
}
await press([]);const final=await snapshot();console.log(JSON.stringify({state:final.state,hp:final.run.hp,scans:final.run.scans,boss:final.run.bossDefeated,returned:final.run.returned,seconds:final.run.time,decisions,upgrades}));
assert.equal(final.state,'result');assert.equal(final.run.finished,true);assert.equal(decisions,1);assert.equal(upgrades,1);assert.deepEqual(errors,[]);await page.screenshot({path:path.join(out,'astra-adventure-debrief.png')});const downloadEvent=page.waitForEvent('download');await page.locator('#export-report').click();const download=await downloadEvent;const reportPath=path.join(out,'astra-example-mission-report.json');await download.saveAs(reportPath);const report=JSON.parse(await (await import('node:fs/promises')).readFile(reportPath,'utf8'));assert.equal(report.completed,true);assert.ok(report.results.returnedMB>59.9);assert.ok(report.sources.length>=9);assert.equal(report.version,'0.3');await browser.close();
