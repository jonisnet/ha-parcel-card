// Final Studio review. NODE_PATH=<existing-node_modules> node scripts/review_studio_banner.mjs
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const output=path.resolve('previews/banner');await mkdir(output,{recursive:true});
const base='http://127.0.0.1:8124/ha-parcel-card/banner-v2-demo.html';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1100,height:1100},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const result={errors,sets:[]};
const capture=async(target,options)=>{
 for(let attempt=0;attempt<3;attempt++){
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  try{return await target.screenshot({animations:'disabled',...options});}
  catch(error){if(attempt===2)throw error;await page.waitForTimeout(250);}
 }
};
const prepare=async url=>{
 await page.goto(url);await page.waitForSelector('html[data-ready="true"]');
 const missing=await page.evaluate(async()=>{
  await document.fonts.ready;
  const images=window.bannerDemo.sampleCards.flatMap(c=>[...c.shadowRoot.querySelectorAll('image')]);
  return (await Promise.all([...new Set(images.map(el=>el.getAttribute('href')))].map(src=>new Promise(resolve=>{let img=new Image();img.onload=()=>resolve(null);img.onerror=()=>resolve(src);img.src=src;})))).filter(Boolean);
 });assert.deepEqual(missing,[]);
};
try{
 for(const [set,count]of Object.entries({A:7,B:2,C:3,D:5,E:12})){
  await prepare(`${base}?set=${set}`);
  const checks=await page.evaluate(()=>{
   const demo=window.bannerDemo,failures=[],samples=[];
   demo.sampleCards.forEach((card,i)=>{
    const root=card.shadowRoot.querySelector('.logo-banner'),grid=card.shadowRoot.querySelector('.logo-grid');
    const tiles=[...card.shadowRoot.querySelectorAll('.brand-tile')],bounds=tiles.map(el=>el.getBoundingClientRect());
    const ref=bounds[0],gr=grid.getBoundingClientRect(),last=bounds.filter(b=>Math.abs(b.top-bounds.at(-1).top)<1);
    if(Math.abs((last[0].left+last.at(-1).right)/2-(gr.left+gr.right)/2)>1)failures.push('last row not centred');
    if(bounds.some(b=>Math.abs(b.width-ref.width)>.05||Math.abs(b.height-ref.height)>.05))failures.push('unequal cells');
    for(const frame of card.shadowRoot.querySelectorAll('.brand-image')){
     const f=frame.getBoundingClientRect(),t=frame.closest('.brand-tile').getBoundingClientRect();
     if(f.left<t.left+3||f.right>t.right-3||f.top<t.top+2||f.bottom>t.bottom-2)failures.push('logo outside safe area');
    }
    const wrapper=card.closest('.ha-card');
    const bg=getComputedStyle(tiles[0]).backgroundColor,expected=getComputedStyle(wrapper).backgroundColor;
    if(bg!==expected)failures.push('tile does not use HA card colour');
    if(root.classList.contains('is-dark')!==(demo.samples[i].theme==='dark'))failures.push('wrong dark class');
    if(root.offsetHeight>Math.max(150,Math.ceil(demo.items.length/4)*90))failures.push('banner too tall');
    if(card.scrollWidth>card.clientWidth+1)failures.push('horizontal overflow');
    const node=tiles[0],image=card.shadowRoot.querySelector('image');
    for(let n=0;n<20;n++)card.updateAnimation([]);
    if(node!==card.shadowRoot.querySelector('.brand-tile')||image!==card.shadowRoot.querySelector('image'))failures.push('nodes replaced');
    samples.push({width:wrapper.getBoundingClientRect().width,height:root.offsetHeight,cellWidth:ref.width,cellHeight:ref.height,background:bg,dark:root.classList.contains('is-dark')});
   });
   for(let n=0;n<20;n++)demo.card._prepareBrandIcons();
   return {failures,samples,items:demo.items.length,brandIcons:demo.items.filter(i=>i.carrier_logo.startsWith('/api/brands/')).length,wsCalls:demo.wsCalls,refreshes:demo.brandRefreshes};
  });
  assert.deepEqual(checks.failures,[]);assert.equal(checks.items,count);
  assert.equal(checks.brandIcons,set==='D'?1:set==='E'?4:0);
  assert.equal(checks.wsCalls,set==='D'||set==='E'?1:0);assert.equal(checks.refreshes,checks.wsCalls);
  await capture(page,{path:path.join(output,`studio-final-set-${set}.png`),fullPage:true});
  result.sets.push({set,...checks});
  if(set==='A'){
   await capture(page.locator('.sample').nth(2),{path:path.join(output,'studio-final-500-donker.png')});
   await capture(page.locator('.sample').nth(3),{path:path.join(output,'studio-final-375-donker.png')});
   await capture(page.locator('#previews'),{path:path.join(output,'studio-final-licht-donker.png')});
   result.darkEdges=await page.evaluate(()=>[...window.bannerDemo.sampleCards[2].shadowRoot.querySelectorAll('.low-light-contrast')].map(el=>({name:el.closest('button').dataset.carrier,filter:getComputedStyle(el.querySelector('svg')).filter})));
   assert.equal(result.darkEdges.length,3);assert.ok(result.darkEdges.every(x=>x.filter.includes('drop-shadow')));
  }
 }
 await prepare(base+'?set=A');
 await page.locator('.brand-tile').first().hover();
 await page.waitForFunction(()=>Math.abs(new DOMMatrix(getComputedStyle(window.bannerDemo.sampleCards[0].shadowRoot.querySelector('.brand-image')).transform).a-1.06)<.00001);
 result.themeSwitch=await page.evaluate(()=>{
  const c=window.bannerDemo.sampleCards[0],wrapper=c.closest('.ha-card');
  const tile=c.shadowRoot.querySelector('.brand-tile'),image=tile.querySelector('.brand-image');tile.focus();
  const before=getComputedStyle(image).transform;
  c._hass.themes.darkMode=true;wrapper.classList.replace('light','dark');c.updateAnimation([]);
  const same=tile===c.shadowRoot.querySelector('.brand-tile')&&image===c.shadowRoot.querySelector('.brand-image');
  const background=getComputedStyle(tile).backgroundColor,focus=c.shadowRoot.activeElement===tile;
  wrapper.style.setProperty('--card-background-color','#252d38');c.updateAnimation([]);
  return {same,focus,before,after:getComputedStyle(image).transform,background,customThemeBackground:getComputedStyle(tile).backgroundColor,dark:c.shadowRoot.querySelector('.logo-banner').classList.contains('is-dark')};
 });
 assert.equal(result.themeSwitch.same,true);assert.equal(result.themeSwitch.focus,true);assert.equal(result.themeSwitch.dark,true);
 assert.equal(result.themeSwitch.before,result.themeSwitch.after);assert.equal(result.themeSwitch.background,'rgb(23, 28, 36)');assert.equal(result.themeSwitch.customThemeBackground,'rgb(37, 45, 56)');
 await page.locator('.brand-tile').first().click();assert.ok((await page.locator('#selection').textContent()).includes('PostNL geselecteerd'));
 result.overrides=await page.evaluate(()=>{
  const c=window.bannerDemo.sampleCards[0];
  const combo=c._getNoSelectionBackground().comboLogos.length;
  c.config.placeholder_image='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E';c.updateAnimation([]);
  const customPlaceholder=!c.shadowRoot.querySelector('.logo-banner')&&c.shadowRoot.querySelector('.header-animation').style.backgroundImage.includes('data:image/svg');
  c.config.carriers=[{type:'postnl',name:'PostNL'}];delete c.config.placeholder_image;
  return {combo,customPlaceholder,singleCarrierBanner:c._getNoSelectionBackground().image.includes('postnl-banner.jpg')};
 });assert.equal(result.overrides.combo,7);assert.equal(result.overrides.customPlaceholder,true);assert.equal(result.overrides.singleCarrierBanner,true);
 await prepare(base+'?set=E&brands=unsupported');
 result.olderHa=await page.evaluate(()=>({brandIcons:window.bannerDemo.items.filter(i=>i.carrier_logo.startsWith('/api/brands/')).length,logos:window.bannerDemo.items.filter(i=>i.carrier_logo).length,refreshes:window.bannerDemo.brandRefreshes}));
 assert.deepEqual(result.olderHa,{brandIcons:0,logos:11,refreshes:0});
 await page.setViewportSize({width:375,height:900});await prepare(base+'?set=E');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),375);
 await capture(page,{path:path.join(output,'studio-final-telefoon-375.png'),fullPage:true});
 result.configuredFallbackIcon=await page.evaluate(()=>{
  customElements.define('ha-icon',class extends HTMLElement {});
  const html=window.HAParcelCard.logoBanner.render([{carrier_type:'custom',carrier_name:'Voorbeeldvervoerder',carrier_color:'#805ad5',carrier_icon:'mdi:bicycle',carrier_logo:''}]);
  return new DOMParser().parseFromString(html,'text/html').querySelector('ha-icon')?.getAttribute('icon');
 });assert.equal(result.configuredFallbackIcon,'mdi:bicycle');
 const source=await readFile('ha-parcel-card.js','utf8');
 const section=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start))).replace(/\r\n/g,'\n');
 const baseline=JSON.parse(await readFile('previews/banner/protected-baseline.json','utf8'));
 for(const [name,value]of Object.entries({brand_icon_functions:section('const BRANDS_TOKEN_REFRESH_MS','// Card\n'),brand_methods:section('    _prepareBrandIcons()','    _canonicalStatusLabel(')}))assert.equal(createHash('sha256').update(value).digest('hex'),baseline[name],`${name} changed`);
 const report=JSON.parse(await readFile('previews/banner/logo-measurements.json','utf8'));
 for(const logo of report.logos)assert.equal(createHash('sha256').update(await readFile(logo.file)).digest('hex'),logo.sha256);
 assert.ok(!source.includes('logo-banner--label')&&!source.includes('logo-banner--gallery')&&!source.includes('bannerPreview'));
 assert.ok(source.includes('${LOGO_BANNER_CSS}'));assert.ok(source.includes("const CARD_VERSION = 'v2.0.0b18'"));
 result.originalLogosUnchanged=true;result.claudeFallbackUnchanged=true;result.onlyStudio=true;
 assert.deepEqual(errors,[]);
 await writeFile(path.join(output,'studio-review-results.json'),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({sets:result.sets.length,samples:result.sets.length*4,errors,themeSwitch:result.themeSwitch,darkEdges:result.darkEdges,olderHa:result.olderHa,onlyStudio:true,claudeFallbackUnchanged:true},null,2));
}finally{await browser.close();}
