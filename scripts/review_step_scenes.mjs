// Local browser review; uses a preinstalled Playwright, adds no card dependency.
// NODE_PATH=<path-to-installed-node_modules> node scripts/review_step_scenes.mjs
import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { loadScenePreview } from './scene-preview-api.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const output = path.resolve('previews/scenes');
await mkdir(output, { recursive: true });
const base = process.env.SCENE_PREVIEW_URL || 'http://127.0.0.1:8123/ha-parcel-card/svg-postnl-demo.html';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1360, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const types = ['postnl', 'sameday', 'ukrposhta', 'spee_dee_delivery', 'dhl'];
const result = { carrierScreenshots: [], errors };
try {
    for (const type of types) {
        await page.goto(`${base}?carrier=${type}`);
        await page.waitForSelector('html[data-ready="true"]');
        await page.evaluate(async () => {
            await Promise.all([...document.querySelectorAll('image')].map(el => new Promise(resolve => {
                const img = new Image(); img.onload = img.onerror = resolve; img.src = el.getAttribute('href');
            })));
            await document.fonts.ready;
        });
        await page.locator(`#${type}`).screenshot({ path: path.join(output, `${type}-timeline.png`) });
        await page.locator(`#hero-${type}`).screenshot({ path: path.join(output, `${type}-hero.png`) });
        result.carrierScreenshots.push(type);
    }
    result.layout = await page.evaluate(() => ({
        desktop: document.querySelector('.desktop-row .node>svg').getBoundingClientRect().width,
        mobile: document.querySelector('.mobile-strip .node>svg').getBoundingClientRect().width,
        hero: document.querySelector('.hero-sheet .cell>svg').getBoundingClientRect().height,
        logos: [...document.querySelectorAll('[data-scene-logo]')].reduce((out, el) => {
            const parent = el.closest('[data-step-scene]');
            if (['registered', 'delivered'].includes(parent.dataset.stepScene)) out.invalid++;
            out[el.dataset.sceneLogo] = (out[el.dataset.sceneLogo] || 0) + 1;
            return out;
        }, { invalid: 0 }),
    }));
    assert.equal(result.layout.desktop, 60);
    assert.equal(result.layout.mobile, 44);
    assert.equal(result.layout.hero, 118);
    assert.equal(result.layout.logos.invalid, 0);

    result.geometry = await page.evaluate(() => {
        const api = window.HAParcelCard.stepScenes;
        const panelBounds = { sorting: [[19, 38, 77, 42]], transit: [[40, 37, 52, 45]], pickup_point: [[5, 8, 59, 24], [62, 82, 93, 34]] };
        let marginsValid = true;
        const serializeGeometry = type => api.stages.map(stage => {
            const c = api.carrier(type);
            const doc = new DOMParser().parseFromString(api.render(stage, c.palette, c.logo), 'image/svg+xml');
            const logos = [...doc.querySelectorAll('[data-scene-logo]')];
            logos.forEach((logo, i) => {
                const [px, py, pw, ph] = panelBounds[stage][i];
                const [x, y, w, h] = ['x', 'y', 'width', 'height'].map(attr => Number(logo.getAttribute(attr)));
                marginsValid &&= x > px + 1.8 && y > py + 1.8 && x + w < px + pw - 1.8 && y + h < py + ph - 1.8;
                logo.replaceChildren(); logo.removeAttribute('data-scene-logo');
            });
            doc.querySelectorAll('*').forEach(el => { el.removeAttribute('fill'); el.removeAttribute('stroke'); });
            return new XMLSerializer().serializeToString(doc);
        }).join('');
        const reference = serializeGeometry('postnl');
        return { identical: ['sameday', 'ukrposhta', 'spee_dee_delivery', 'dhl', 'custom'].every(type => serializeGeometry(type) === reference), marginsValid };
    });
    assert.equal(result.geometry.identical, true);
    assert.equal(result.geometry.marginsValid, true);

    // Real card class: track DOM retention rather than just comparing renderer output.
    result.integration = await page.evaluate(async () => {
        const card = document.createElement('ha-parcel-card');
        card.config = { show_animation: true, carriers: [{ type: 'dhl' }] };
        card.shadowRoot.innerHTML = '<div class="header-animation"></div>';
        const selected = { key: 'fictional-parcel', carrier_type: 'dhl', carrier_color: '#ffcc00', carrier_name: 'DHL',
            carrier_logo: 'images/dhl/DHL_logo.png', carrier_steps: null, pickup: true, status: 'at_pickup_point', name: 'Voorbeeldpakket' };
        card._selectedParcel = selected.key;
        card.updateAnimation([selected]);
        const before = card.shadowRoot.querySelector('[data-step-scene="pickup_point"]');
        for (let i = 0; i < 20; i++) card.updateAnimation([selected]);
        const retained = before === card.shadowRoot.querySelector('[data-step-scene="pickup_point"]');
        const count = card.shadowRoot.querySelectorAll('.status-steps [data-step-scene]').length;
        selected.status = 'out_for_delivery'; selected.carrier_van = 'images/dhl/DHL_van.gif';
        card.updateAnimation([selected]);
        const hasGif = !!card.shadowRoot.querySelector('.visual-road .carrier-van-gif');
        selected.carrier_van = ''; card.updateAnimation([selected]);
        const hasChip = !!card.shadowRoot.querySelector('.visual-road .carrier-chip');
        const overrideUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E';
        selected.status = 'in_transit'; selected.carrier_steps = { sorting: overrideUrl };
        card.updateAnimation([selected]);
        const override = card.shadowRoot.querySelector('.status-hero-img')?.getAttribute('src');
        selected.status = 'registered'; selected.carrier_steps = { registered: overrideUrl, registered_mini: overrideUrl + '#mini' };
        card.updateAnimation([selected]);
        const mini = card.shadowRoot.querySelector('.status-step-icon')?.getAttribute('src');
        return { retained, count, hasGif, hasChip, override, overrideUrl, mini };
    });
    assert.equal(result.integration.retained, true);
    assert.equal(result.integration.count, 5);
    assert.equal(result.integration.hasGif, true);
    assert.equal(result.integration.hasChip, true);
    assert.equal(result.integration.override, result.integration.overrideUrl);
    assert.equal(result.integration.mini, result.integration.overrideUrl + '#mini');

    await page.goto(`${base}?no-phu&carrier=postnl`);
    await page.waitForSelector('html[data-ready="true"]');
    assert.equal(await page.evaluate(() => !!window.customIconsets), false);
    assert.equal(await page.locator('[data-scene-logo="phu"]').count(), 0);
    assert.ok(await page.locator('[data-scene-logo="image"]').count() > 0);
    await page.setViewportSize({ width: 375, height: 900 });
    await page.screenshot({ path: path.join(output, 'mobile-375-kale-ha.png'), fullPage: true });
    result.mobilePageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.equal(result.mobilePageWidth, 375);

    result.asyncLogos = await page.evaluate(async () => {
        const api = window.HAParcelCard.stepScenes;
        const fixture = await fetch('scripts/scene-preview-phu.json').then(r => r.json());
        let calls = 0, updates = 0, resolveLogo;
        const delayed = new Promise(resolve => { resolveLogo = resolve; });
        window.customIconsets = { phu: () => { calls++; return delayed; } };
        const card = document.createElement('ha-parcel-card');
        document.body.append(card);
        card._isRendered = true;
        card.updateContent = () => { updates++; card._prepareStepSceneLogos(); };
        // Calling preparation repeatedly must join one request and yield one refresh.
        card.config = { carriers: [{ type: 'postnl' }] };
        for (let i = 0; i < 20; i++) card._prepareStepSceneLogos();
        await Promise.resolve(); await Promise.resolve();
        resolveLogo(fixture.icons.postnl);
        await api.preload(['postnl']);
        await new Promise(resolve => setTimeout(resolve, 0));
        const loaded = api.carrier('postnl').logo.kind;
        for (let i = 0; i < 20; i++) card._prepareStepSceneLogos();
        const success = { calls, updates, loaded };
        let missingCalls = 0;
        window.customIconsets.phu = async () => { missingCalls++; return ''; };
        await api.preload(['postnl']); await api.preload(['postnl']);
        const missing = { calls: missingCalls, kind: api.carrier('postnl').logo.kind };
        let rejectedCalls = 0;
        window.customIconsets.phu = async () => { rejectedCalls++; throw Error('Unavailable test provider'); };
        await api.preload(['postnl']); await api.preload(['postnl']);
        const rejected = { calls: rejectedCalls, kind: api.carrier('postnl').logo.kind };
        const custom = api.carrier('custom', { color: 'rgb(255, 240, 10)' });
        const customRender = api.render('sorting', custom.palette, custom.logo);
        card.remove();
        return { success, missing, rejected, customColor: custom.palette.primary, customBrand: customRender.includes('data-scene-logo="brand"') };
    });
    assert.deepEqual(result.asyncLogos.success, { calls: 1, updates: 1, loaded: 'phu' });
    assert.deepEqual(result.asyncLogos.missing, { calls: 1, kind: 'image' });
    assert.deepEqual(result.asyncLogos.rejected, { calls: 1, kind: 'image' });
    assert.equal(result.asyncLogos.customColor, '#fff00a');
    assert.equal(result.asyncLogos.customBrand, true);

    // Every carrier uses one geometry; no brands on parcel/house; contrast handles light customs.
    const { api } = await loadScenePreview();
    result.contrast = {};
    for (const type of [...types, 'custom']) {
        const c = api.carrier(type, type === 'custom' ? { color: '#ffffee' } : {});
        assert.ok(c.palette.logoContrast >= 3);
        result.contrast[type] = { color: c.palette.primary, logo: c.palette.logo, ratio: c.palette.logoContrast, kind: c.logo.kind };
        for (const stage of api.stages) {
            const svg = api.render(stage, c.palette, c.logo);
            assert.ok(svg.includes('viewBox="0 0 160 128"'));
            if (['registered', 'delivered'].includes(stage)) assert.ok(!svg.includes('data-scene-logo'));
        }
    }
    const fixture = JSON.parse(await readFile('scripts/scene-preview-phu.json', 'utf8'));
    result.phuRelease = fixture.release;
    assert.equal(errors.length, 0, errors.join('\n'));
    await writeFile(path.join(output, 'review-results.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }
