import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const out=path.resolve(process.argv[2]||'../../language-qa');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.clock.install();await page.goto('http://127.0.0.1:4173');
const expected={fr:'LANCER LA SIMULATION',ar:'ابدأ المحاكاة',en:'DEPLOY SIMULATION',tr:'SİMÜLASYONU BAŞLAT'};
for(const [lang,launch] of Object.entries(expected)){
 await page.selectOption('#language',lang);await page.waitForFunction(l=>document.documentElement.lang===l,lang);
 assert.match(await page.locator('#launch').innerText(),new RegExp(launch));
 assert.equal(await page.locator('html').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
 await page.locator('[data-module="rtg"]').click();assert.match(await page.locator('#launch').innerText(),new RegExp(launch));
 await page.reload();assert.equal(await page.locator('#language').inputValue(),lang);assert.match(await page.locator('#launch').innerText(),new RegExp(launch));
}
await page.selectOption('#language','ar');
const dynamic=await page.evaluate(async()=>{const {t}=await import('./i18n.js');return [t('SCANNING 37%'),t('SUNLIGHT · CONTACT OPEN · Buffer: 20 MB · pulse ready'),t('At 1 AU your selected source produced 600 W in full sunlight; peak load was 210 W. You mapped 3/3 sites and took 10 damage. Selected shield improvement after comparing constraints.'),t('At 1 AU your selected source produced 600 W in full sunlight; peak load was 210 W. You mapped 0/3 sites and took 100 damage. ')];});
assert.match(dynamic[0],/37/);assert.match(dynamic[0],/المسح/);assert.match(dynamic[1],/الاتصال متاح/);assert.match(dynamic[2],/الحماية/);assert.ok(!dynamic[2].includes('Selected'));assert.ok(!dynamic[3].includes('At '));
await page.screenshot({path:path.join(out,'astra-arabic.png'),fullPage:true});
await page.locator('#launch').click();await page.locator('#story-skip').click();await page.clock.runFor(1000);const before=await page.locator('#clock').innerText();
await page.selectOption('#language','tr');assert.equal(await page.locator('#overlay').innerText(),'');assert.equal(await page.locator('#clock').innerText(),before);await page.clock.runFor(1100);assert.notEqual(await page.locator('#clock').innerText(),before);assert.match(await page.locator('#objectives').innerText(),/Tasarım onaylandı/);
await page.locator('#pause').click();assert.match(await page.locator('#overlay').innerText(),/Bir nefes al/);await page.selectOption('#language','fr');assert.match(await page.locator('#overlay').innerText(),/Souffle un peu/);await page.locator('#resume').click();
await page.locator('#library').click();assert.match(await page.locator('.source').first().innerText(),/Concevoir/);await page.selectOption('#language','ar');assert.match(await page.locator('.source').first().innerText(),/تصميم المهمات/);await page.locator('#closeCodex').click();
await page.setViewportSize({width:390,height:844});await page.locator('#pause').click();await page.locator('#workshop').click();
for(const lang of ['ar','fr','tr','en']){await page.selectOption('#language',lang);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('#language').isVisible(),true);const rect=await page.locator('#language').boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=390);}
await page.selectOption('#language','ar');await page.screenshot({path:path.join(out,'astra-arabic-mobile.png')});
await page.locator('#launch').scrollIntoViewIfNeeded();assert.equal(await page.locator('#launch').isVisible(),true);
assert.deepEqual(errors,[]);console.log('Language checks passed: four languages, persistence, RTL, rerenders, mid-run switching without reset, pause, codex, mobile selector and overflow.');await browser.close();

