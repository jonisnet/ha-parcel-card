// Offline measurement only. Original PNG/SVG files stay untouched; no raster output.
// NODE_PATH=<existing-node_modules> node scripts/measure_banner_logos.mjs
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadScenePreview } from './scene-preview-api.mjs';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const { api } = await loadScenePreview({ phu: false });
const report = [], table = [];
for (const type of api.types.filter(type => type !== 'custom')) {
    const carrier = api.carrier(type, { withoutPhu: true });
    const file = carrier.logo.href.replace('https://github.com/jonisnet/ha-parcel-card/blob/main/', '').replace('?raw=true', '');
    const bytes = await readFile(file);
    const { data, info } = await sharp(bytes, { density: 144 }).resize({ width: 768, height: 768, fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height } = info;
    const bounds = (ignoreWhite) => {
        let x0 = width, y0 = height, x1 = -1, y1 = -1, count = 0;
        for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            if (data[i + 3] < 24 || (ignoreWhite && Math.min(data[i], data[i + 1], data[i + 2]) >= 246)) continue;
            x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); count++;
        }
        return count ? { x: Math.max(0, x0 - 1), y: Math.max(0, y0 - 1), right: Math.min(width, x1 + 2), bottom: Math.min(height, y1 + 2), count } : null;
    };
    const alpha = bounds(false), ink = bounds(true) || alpha;
    if (!ink) throw Error(`No visible logo: ${file}`);
    const w = ink.right - ink.x, h = ink.bottom - ink.y;
    const linear = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
    const nightLuminance = .2126 * linear(23) + .7152 * linear(28) + .0722 * linear(36);
    let visible = 0, lowContrast = 0;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        const lum = .2126 * linear(data[i]) + .7152 * linear(data[i + 1]) + .0722 * linear(data[i + 2]);
        const ratio = (Math.max(lum, nightLuminance) + .05) / (Math.min(lum, nightLuminance) + .05);
        visible++; if (ratio < 3) lowContrast++;
    }
    const darkShare = visible ? lowContrast / visible : 0;
    const values = [ink.x / width, ink.y / height, w / width, h / height, w / h, ink.count / (w * h), darkShare].map(v => Number(v.toFixed(5)));
    report.push({ type, file, sha256: createHash('sha256').update(bytes).digest('hex'), sampledSize: [width, height],
        alphaBounds: alpha, inkBounds: ink, normalized: values, appIcon: !!carrier.logo.rounded });
    table.push(`    ${type}: [${values.join(',')}],`);
}
const sourceFile = 'ha-parcel-card.js';
let source = await readFile(sourceFile, 'utf8');
const start = '// GENERATED:BANNER_LOGO_METRICS:START';
const end = '// GENERATED:BANNER_LOGO_METRICS:END';
const block = `${start}\n// Offline bounds [x, y, width, height, aspect, ink density, low-contrast share on dark].\n// No browser canvas or pixel sampling at runtime.\nconst BANNER_LOGO_METRICS = Object.freeze({\n${table.join('\n')}\n});\n${end}`;
if (source.includes(start)) source = source.slice(0, source.indexOf(start)) + block + source.slice(source.indexOf(end) + end.length);
else source = source.replace('// Shared, dependency-free SVG artwork.', block + '\n\n// Shared, dependency-free SVG artwork.');
await writeFile(sourceFile, source);
await mkdir('previews/banner', { recursive: true });
await writeFile('previews/banner/logo-measurements.json', JSON.stringify({ method: 'Offline sharp; alpha>=24; excludes near-white>=246; 1px margin; max768px sample', logos: report }, null, 2) + '\n');
console.log(JSON.stringify(report.filter(r => ['postnl','dhl','dpd','gls','dragonfly','trunkrs','cainiao'].includes(r.type)).map(r => ({ type: r.type, bounds: r.normalized.slice(0, 4), aspect: r.normalized[4], density: r.normalized[5] })), null, 2));
