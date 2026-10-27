// Verify the card's mappings against an actual downloaded release, never a PR checkout.
// node scripts/audit_scene_phu.mjs <released-dist.js> <github-release-metadata.json>
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { loadScenePreview } from './scene-preview-api.mjs';

const [distFile, metadataFile] = process.argv.slice(2);
assert.ok(distFile && metadataFile, 'Pass the published dist and releases/latest metadata files.');
const dist = await readFile(distFile, 'utf8');
const metadata = JSON.parse(await readFile(metadataFile, 'utf8'));
assert.match(metadata.tag_name, /^[\w.-]+$/);
const source = `https://raw.githubusercontent.com/elax46/custom-brand-icons/${metadata.tag_name}/dist/custom-brand-icons.js`;
const upstream = { window: {}, console: { log() {} } };
vm.createContext(upstream);
vm.runInContext(dist, upstream);
const names = new Set((await upstream.window.customIcons.phu.getIconList()).map(i => i.name));
const { api } = await loadScenePreview();
const icons = {}, carriers = [];
for (const type of api.types) {
    const carrier = api.carrier(type);
    if (carrier.phu) {
        const name = carrier.phu.slice(4);
        assert.ok(names.has(name), `${type}: ${name} missing from published ${metadata.tag_name}`);
        const def = await upstream.window.customIconsets.phu(name);
        assert.ok(def.path && def.viewBox, `${type}: unusable released icon`);
        icons[name] = { path: def.path, viewBox: def.viewBox };
    }
    carriers.push({ type, label: carrier.label, icon: carrier.phu, fallback: type === 'custom' ? 'brand' : 'carrier-logo' });
}
const fixture = { release: metadata.tag_name, source, verified: '2026-10-27', sha256: createHash('sha256').update(dist).digest('hex'), icons };
const audit = { release: metadata.tag_name, published: metadata.published_at, releaseUrl: metadata.html_url,
    source, verified: fixture.verified, sha256: fixture.sha256, carrierCount: carriers.length - 1,
    mappedCarrierCount: carriers.filter(c => c.icon).length, uniqueIconCount: Object.keys(icons).length, carriers };
await mkdir('previews/scenes', { recursive: true });
await writeFile('scripts/scene-preview-phu.json', JSON.stringify(fixture, null, 2) + '\n');
await writeFile('previews/scenes/phu-audit.json', JSON.stringify(audit, null, 2) + '\n');
console.log(JSON.stringify({ release: audit.release, carriers: audit.carrierCount, mappings: audit.mappedCarrierCount, uniqueIcons: audit.uniqueIconCount, sha256: audit.sha256 }, null, 2));
