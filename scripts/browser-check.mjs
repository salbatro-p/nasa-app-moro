import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const output=path.resolve(process.argv[2]||'../../browser-qa');fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.clock.install();await page.goto('http://127.0.0.1:4173');await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:path.join(output,'astra-workshop.png'),fullPage:true});
await page.locator('[data-module="rtg"]').click();await page.locator('[data-module="spectrometer"]').click();await page.locator('[data-module="dish"]').click();assert.equal(await page.locator('#launch').isDisabled(),true);
await page.locator('[data-module="solar"]').click();await page.locator('[data-module="camera"]').click();await page.locator('[data-module="compact"]').click();await page.locator('#launch').click();await page.clock.runFor(250);
await page.screenshot({path:path.join(output,'astra-field.png')});
async function hold(key,ms){await page.keyboard.down(key);await page.clock.runFor(ms);await page.keyboard.up(key);}
// Follow the actual keyboard path from spawn through the three sites.
await hold('a',1520);await hold('w',1890);await hold('e',1850);assert.match(await page.locator('#objectives').innerText(),/1\/3/);
await hold('d',2900);await hold('w',740);await hold('q',80);await hold('e',1850);assert.equal(await page.locator('[data-up="shield"]').count(),1);await page.locator('[data-up="shield"]').click();
await hold('d',405);await hold('s',2260);await hold('q',80);await hold('e',1850);assert.match(await page.locator('#objectives').innerText(),/3\/3/);
await hold('a',1790);await hold('s',880);await page.keyboard.down('q');await page.clock.runFor(21000);await page.keyboard.up('q');
const outcome=await page.locator('#overlay').innerText();assert.match(outcome,/Discovery delivered\./);await page.screenshot({path:path.join(output,'astra-debrief.png')});
await page.locator('#library').click();assert.equal(await page.locator('.source').count(),11);await page.locator('#closeCodex').click();assert.match(await page.locator('#overlay').innerText(),/Discovery delivered/);
await page.locator('#again').click();await page.locator('#launch').click();await page.locator('#pause').click();const paused=await page.locator('#clock').innerText();await page.clock.runFor(5000);assert.equal(await page.locator('#clock').innerText(),paused);await page.locator('#resume').click();await page.clock.runFor(2000);assert.notEqual(await page.locator('#clock').innerText(),paused);
await page.setViewportSize({width:390,height:844});await page.locator('#pause').click();await page.locator('#workshop').click();await page.screenshot({path:path.join(output,'astra-mobile.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
assert.deepEqual(errors,[]);console.log('Browser checks passed: invalid launch, movement, 3 scans, upgrade, uplink victory, codex, pause, mobile overflow.');await browser.close();
