// Optional preview export: one source of truth, no production asset generation.
// node scripts/generate_carrier_svg_art.mjs [output-directory]
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadScenePreview } from './scene-preview-api.mjs';
const { api } = await loadScenePreview();
const output = path.resolve(process.argv[2] || 'previews/scenes/svg');
await mkdir(output, { recursive: true });
for (const type of ['postnl', 'sameday', 'ukrposhta', 'spee_dee_delivery', 'dhl']) {
    const carrier = api.carrier(type);
    for (const stage of api.stages) {
        await writeFile(path.join(output, `${type}-${stage}.svg`), api.render(stage, carrier.palette, carrier.logo));
    }
}
console.log(`25 SVG previews exported from ha-parcel-card.js to ${output}`);
