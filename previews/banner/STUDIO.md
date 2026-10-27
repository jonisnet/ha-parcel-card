# Studio-banner — afgewerkt na de keuze

De gebruiker koos Studio en vroeg dat de tegels in dark mode een donkere kaartkleur
krijgen. Dit is op 27 oktober 2026 uitgevoerd en geïntegreerd in `ha-parcel-card.js`.

[Open de actuele demo](http://127.0.0.1:8124/ha-parcel-card/banner-v2-demo.html?set=A).
De demo gebruikt nu de echte `updateAnimation()`-route van de kaart, in plaats van een
losse variant-renderer. Alle vijf vervoerderssets zijn beschikbaar.

## Beelden

- [Studio — 500 px donker](studio-final-500-donker.png)
- [Studio — 375 px donker](studio-final-375-donker.png)
- [Licht en donker naast elkaar op beide breedtes](studio-final-licht-donker.png)
- Volledige sets: [A, zeven vervoerders](studio-final-set-A.png),
  [B, twee](studio-final-set-B.png), [C, drie](studio-final-set-C.png),
  [D, vijf met HA-brand-icoon](studio-final-set-D.png),
  [E, twaalf met app-iconen en custom](studio-final-set-E.png).
- [Telefoonviewport van 375 px](studio-final-telefoon-375.png).

## Eindresultaat

- De Studio-tegels gebruiken `var(--card-background-color)` en de HA-dividerkleur.
  Daardoor zijn ze wit in het lichte voorbeeld en donker in het donkere voorbeeld,
  en volgen ze ook een eigen HA-themakleur. Er is geen witte achtergrond meer op de
  volledige tegels in dark mode.
- Donkere woordmerken houden hun originele kleuren en krijgen in dark mode een
  subtiele lichte rand langs de afbeelding. De selectie hiervoor volgt een extra
  offline meting van het aandeel donkere pixels; er is geen handmatige lijst per
  vervoerder. In de set van de gebruiker krijgen DPD, GLS en Trunkrs deze contour.
  Originele witte vlakken die onderdeel van een logo-afbeelding zijn, blijven behouden.
- De gelijke cellen, gecentreerde laatste rij, gemeten logomaten, afgeronde app-iconen,
  kleuraccenten en fallback-chip van Studio zijn behouden. Twee/drie vervoerders
  gebruiken 150 px hoogte, vijf/zeven 168 px en twaalf 244 px.
- `renderLogoBanner()` en `mountLogoBanner()` worden nu werkelijk door de kaart gebruikt.
  De CSS staat als `LOGO_BANNER_CSS` in de bestaande render-stijl. Een themawissel past
  alleen een klasse aan; ongewijzigde logo's en focus worden niet opnieuw opgebouwd.
- De eerdere twee alternatieven en hun keuzeschakelaar zijn uit de implementatie en
  demo verwijderd. Oude screenshots zijn bewaard als historisch beoordelingsmateriaal;
  er zijn geen bestaande afbeeldingen verwijderd of hernoemd.
- De oude rijverdeler en oude combo-logo-CSS zijn vervangen door de gedeelde Studio-grid.
  De bestaande banners voor één vervoerder en een eigen placeholder behouden hun gedrag.
- Claude's brand-token-, laad- en fallbackfuncties, `_prepareBrandIcons()` en
  `_carrierBranding()` zijn ongemoeid gelaten. Ook de goedgekeurde SVG-statusscènes blijven.
- `CHANGELOG.md` heeft een extra Studio-regel onder `Unreleased`;
  `docs/card/screenshots.md` beschrijft Studio en markeert oudere screenshots als zodanig.

## Verificatie

[studio-review-results.json](studio-review-results.json) legt de controle vast:

- Vijf sets × twee breedtes × twee thema's: **20 weergaven** via de productiecode.
- Alle tegels hebben precies dezelfde achtergrondkleur als hun HA-kaart. Ook een
  afwijkende themakleur `#252d38` is gecontroleerd.
- Live wissel licht → donker behoudt dezelfde beeldnodes, actieve hover en keyboardfocus.
- Gelijke celgroottes, gecentreerde laatste rij, veilige logo-marges en geen horizontale
  scroll op een telefoonviewport van 375 px.
- Geen consolefouten of ontbrekende zichtbare logo's; gesimuleerde HA-brand-ophaling
  geeft één tokenaanvraag en één verversing voor de relevante set.
- Zonder brands-command blijven de bestaande logo-fallbacks werken. De demo gebruikt
  alleen lokale integratie-iconen en de verzonnen token `banner-demo-only`.
- Een eigen placeholder behoudt voorrang; bestaande single-carrier-banners blijven werken.
- SHA-256-controle van alle 85 originele logobestanden en van Claude's fallbackfuncties.
- `node --check ha-parcel-card.js`, `git diff --check`, `review_step_scenes.mjs` en
  `review_all_step_scenes.mjs` zijn uitgevoerd. De browsercontrole is een HA-stub;
  er is geen echte Home Assistant-installatie gewijzigd.

## Overdracht en stopmoment

**Studio is gekozen en afgewerkt. Nu weer stoppen voor beoordeling.** Geen extra
variant, release, commit of push uitvoeren op basis van deze oplevering. Versie blijft
`v2.0.0b18`; Claude verzorgt de latere `v2.0.0b19` volgens de afgesproken vervolgopdracht.

De publieke demo-API heet nu `window.HAParcelCard.logoBanner`; de eerdere
`bannerPreview`-API is verwijderd. De preview en kaart gebruiken dezelfde functies.
`scripts/review_banner_previews.mjs` is een dun compatibiliteitsingangspunt dat de
actuele `scripts/review_studio_banner.mjs` uitvoert.

Met de lokale server op poort 8124 en een bestaande Playwright/Sharp-runtime:

```powershell
python scripts/serve_banner_preview.py
# In een tweede terminal, vanuit dezelfde repo:
$env:NODE_PATH = '<pad-naar-node_modules-met-playwright-en-sharp>'
node scripts/measure_banner_logos.mjs
node scripts/review_studio_banner.mjs
```

Geen nieuwe afhankelijkheden geïnstalleerd. De aanvullende PNG's onder `previews/banner`
zijn alleen de gevraagde screenshots; voor de kaart zijn geen nieuwe logo- of bannerbestanden
gemaakt. Alle wijzigingen staan nog ongecommit in de gedeelde werkmap.
