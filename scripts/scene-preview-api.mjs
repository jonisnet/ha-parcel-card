import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
export async function loadScenePreview({ phu = true } = {}) {
    const elements = new Map();
    const fixture = JSON.parse(await readFile(new URL('./scene-preview-phu.json', import.meta.url), 'utf8'));
    class Element { attachShadow() { this.shadowRoot = {}; } }
    const context = vm.createContext({
        window: { LitElement: Element, html: () => '', css: () => '' },
        HTMLElement: Element,
        customElements: { get: name => elements.get(name), define: (name, value) => elements.set(name, value) },
        console: { info() {} },
    });
    if (phu) context.window.customIconsets = { phu: async name => fixture.icons[name] || '' };
    vm.runInContext(await readFile(new URL('../ha-parcel-card.js', import.meta.url), 'utf8'), context);
    const api = context.window.HAParcelCard.stepScenes;
    await api.preload(api.types);
    return { api, context, elements };
}
