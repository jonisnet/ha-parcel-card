// Full phase-B review. Uses an existing Playwright installation; no card dependency.
// NODE_PATH=<installed-node_modules> node scripts/review_all_step_scenes.mjs
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
import { loadScenePreview } from './scene-preview-api.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const output = path.resolve('previews/scenes');
await mkdir(output, { recursive: true });
const base = process.env.SCENE_OVERVIEW_URL || 'http://127.0.0.1:8123/ha-parcel-card/svg-carriers-overview.html';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1448, height: 1050 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
const result = { errors, overviews: [] };
try {
    for (const [query, filename] of [
        ['', 'overzicht-85-60px.png'],
        ['?no-phu', 'overzicht-85-60px-zonder-phu.png'],
        ['?dark', 'overzicht-85-60px-donker.png'],
        ['?dark&no-phu&future', 'overzicht-85-60px-donker-toekomst-zonder-phu.png'],
    ]) {
        await page.goto(base + query);
        await page.waitForSelector('html[data-ready="true"]');
        const checks = await page.evaluate(async () => {
            const api = window.HAParcelCard.stepScenes;
            const imageUrls = [...new Set([...document.querySelectorAll('image')].map(el => el.getAttribute('href')))];
            const badImages = (await Promise.all(imageUrls.map(url => new Promise(resolve => {
                const img = new Image(); img.onload = () => resolve(null); img.onerror = () => resolve(url); img.src = url;
            })))).filter(Boolean);
            await document.fonts.ready;
            return { carriers: document.querySelectorAll('[data-carrier]').length,
                scenes: document.querySelectorAll('.scene>[data-step-scene]').length,
                widths: [...new Set([...document.querySelectorAll('.scene>svg')].map(el => el.getBoundingClientRect().width))],
                invalidLogo: document.querySelectorAll('[data-step-scene="registered"] [data-scene-logo], [data-step-scene="delivered"] [data-scene-logo]').length,
                phuCarriers: [...document.querySelectorAll('[data-carrier]')].filter(el => el.querySelector('[data-scene-logo="phu"]')).length,
                providerPresent: !!window.customIconsets,
                badImages, minimumContrast: Math.min(...api.types.map(type => api.carrier(type).palette.logoContrast)) };
        });
        assert.equal(checks.carriers, 86);
        assert.equal(checks.scenes, 430);
        assert.deepEqual(checks.widths, [60]);
        assert.equal(checks.invalidLogo, 0);
        assert.deepEqual(checks.badImages, []);
        assert.equal(checks.phuCarriers, query.includes('no-phu') ? 0 : 35);
        assert.equal(checks.providerPresent, !query.includes('no-phu'));
        assert.ok(checks.minimumContrast >= 3);
        await page.screenshot({ path: path.join(output, filename), fullPage: true });
        result.overviews.push({ query, filename, ...checks });
    }
    // Three readable sheets retain 60px scenes without shrinking the full 85-carrier image.
    for (let part = 1; part <= 3; part++) {
        await page.goto(`${base}?page=${part}`);
        await page.waitForSelector('html[data-ready="true"]');
        await page.evaluate(async () => {
            await Promise.all([...document.querySelectorAll('image')].map(el => new Promise(resolve => {
                const img = new Image(); img.onload = img.onerror = resolve; img.src = el.getAttribute('href');
            })));
        });
        await page.screenshot({ path: path.join(output, `overzicht-deel-${part}.png`), fullPage: true });
    }
    result.allCarrierIntegration = await page.evaluate(() => {
        const api = window.HAParcelCard.stepScenes;
        const card = document.createElement('ha-parcel-card');
        card.config = { show_animation: true, carriers: [] };
        card.shadowRoot.innerHTML = '<div class="header-animation"></div>';
        const failures = [], signatures = new Map();
        const statuses = ['registered', 'in_transit', 'out_for_delivery', 'at_pickup_point', 'delivered'];
        for (const type of api.types) {
            const branding = card._carrierBranding({ type, color: type === 'custom' ? '#805ad5' : undefined });
            if (branding.carrier_steps !== null) failures.push(`${type}: still has legacy steps`);
            const c = api.carrier(type);
            for (const stage of api.stages) {
                const doc = new DOMParser().parseFromString(api.render(stage, c.palette, c.logo), 'image/svg+xml');
                doc.querySelectorAll('[data-scene-logo]').forEach(el => { el.replaceChildren(); el.removeAttribute('data-scene-logo'); });
                doc.querySelectorAll('*').forEach(el => { el.removeAttribute('fill'); el.removeAttribute('stroke'); });
                const geometry = new XMLSerializer().serializeToString(doc);
                if (!signatures.has(stage)) signatures.set(stage, geometry);
                if (signatures.get(stage) !== geometry) failures.push(`${type}/${stage}: geometry changed`);
            }
            const selected = { ...branding, key: `fictional-${type}`, name: 'Voorbeeldpakket', pickup: true,
                carrier_logo: '', carrier_van: branding.carrier_van ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' : '' };
            card._selectedParcel = selected.key;
            for (const status of statuses) {
                selected.status = status;
                card.updateAnimation([selected]);
                if (card.shadowRoot.querySelectorAll('.status-steps [data-step-scene]').length !== 5) failures.push(`${type}/${status}: tracker missing`);
                const selector = status === 'out_for_delivery' ? (branding.carrier_van ? '.carrier-van-gif' : '.carrier-chip') : '.status-hero [data-step-scene]';
                if (!card.shadowRoot.querySelector(selector)) failures.push(`${type}/${status}: hero missing`);
                const node = card.shadowRoot.querySelector('.status-tracker');
                card.updateAnimation([selected]);
                if (node !== card.shadowRoot.querySelector('.status-tracker')) failures.push(`${type}/${status}: DOM replaced`);
            }
            selected.pickup = false; selected.status = 'delivered';
            card.updateAnimation([selected]);
            if (card.shadowRoot.querySelectorAll('.status-steps [data-step-scene]').length !== 4) failures.push(`${type}: home-delivery step count`);
            if (card.shadowRoot.querySelectorAll('.status-step-check').length !== 4) failures.push(`${type}: completion check count`);
            selected.is_letter = true; card.updateAnimation([selected]);
            if (card.shadowRoot.querySelector('.status-tracker')) failures.push(`${type}: letter received a tracker`);
            selected.is_letter = false; selected.status = 'problem'; card.updateAnimation([selected]);
            if (card.shadowRoot.querySelector('.status-tracker')) failures.push(`${type}: problem status received a tracker`);
        }
        return { carriers: api.types.length, statusChecks: api.types.length * statuses.length, identicalGeometry: failures.every(f => !f.includes('geometry')), failures };
    });
    assert.deepEqual(result.allCarrierIntegration.failures, []);
    const { api } = await loadScenePreview();
    const audit = JSON.parse(await readFile('previews/scenes/phu-audit.json', 'utf8'));
    assert.equal(audit.carrierCount, 85);
    assert.equal(audit.mappedCarrierCount, 35);
    for (const carrier of audit.carriers) assert.equal(api.carrier(carrier.type).phu, carrier.icon);
    result.phu = { release: audit.release, mappedCarriers: audit.mappedCarrierCount, uniqueIcons: audit.uniqueIconCount, sha256: audit.sha256 };
    const modifiedImages = execFileSync('git', ['diff', '--name-only', 'HEAD', '--', 'images'], { encoding: 'utf8' }).trim();
    assert.equal(modifiedImages, '');
    result.oldImagesUnchanged = true;
    const source = await readFile('ha-parcel-card.js', 'utf8');
    assert.ok(source.includes("const CARD_VERSION = 'v2.0.0b18'"));
    assert.ok(!/\bsteps:\s*\{/.test(source));
    result.versionUnchanged = true;
    assert.deepEqual(errors, []);
    await writeFile(path.join(output, 'review-all-results.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }
