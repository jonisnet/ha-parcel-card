# SVG-statusscènes — fase B

Uitgevoerd na het visuele akkoord op fase A, op 27 oktober 2026.

## Overzicht op 60 px

[Open het volledige interactieve overzicht](http://127.0.0.1:8123/ha-parcel-card/svg-carriers-overview.html): alle 85 vervoerders en custom, met vijf scènes van 60 px per vervoerder. De knoppen wisselen licht/donker, met/zonder PHU en de grijze toekomststand. Custom toont als voorbeeld een eigen paarse kleur.

- [Volledig overzicht op 60 px](overzicht-85-60px.png)
- Leesbare deelvellen: [1–30](overzicht-deel-1.png), [31–60](overzicht-deel-2.png), [61–85 en custom](overzicht-deel-3.png)
- [Alle vervoerders zonder PHU](overzicht-85-60px-zonder-phu.png)
- [Donker thema](overzicht-85-60px-donker.png)
- [Donker, zonder PHU en met de grijze toekomststand](overzicht-85-60px-donker-toekomst-zonder-phu.png)
- [Detaildemo op 44, 60 en 118 px](http://127.0.0.1:8123/ha-parcel-card/svg-postnl-demo.html)

De PNG-bestanden in deze previewmap zijn uitsluitend screenshots. De kaart gebruikt gedeelde inline SVG, geen 85 × 5 gegenereerde afbeeldingsbestanden.

## Wijzigingen

- Alle 85 vervoerders en custom gebruiken dezelfde vijf goedgekeurde scènefuncties in `ha-parcel-card.js`.
- De resterende 26 oude `steps`-blokken zijn verwijderd uit `CARRIER_ASSETS`. De drie conceptvervoerders waren al in fase A omgezet. Alle bestaande afbeeldingen blijven staan voor oudere geïnstalleerde versies.
- De tracker heeft vier stappen voor thuisbezorging en vijf voor levering via een afhaalpunt. Een eigen carrierkleur en logo werken voor custom. Bestaande voertuig-GIF's en de carrier-chip blijven behouden.
- Expliciete `steps`-URL's houden voorrang. De gedeelde SVG's hebben geen ingebakken vinkjes; voltooiing gebruikt het bestaande ronde vinkje.
- PHU-paden komen uit de aanwezige iconset en worden gecachet. Bij een ontbrekend icoon volgt het bestaande logo; zonder logo volgt een effen merkvlak. Geen aanvullende installatie nodig.
- `CHANGELOG.md` heeft een `Unreleased`-entry. README en docs beschrijven nu de gedeelde SVG-scènes, de logo-fallbacks en de actuele PHU-dekking. Het bestaande docs-changelog neemt de hoofdchangelog automatisch op.

## Live PHU-audit

Opnieuw opgehaald via GitHub `releases/latest`: [release 2026.10.3](https://github.com/elax46/custom-brand-icons/releases/tag/2026.10.3), gepubliceerd op 26 oktober 2026. Alle mappings zijn gecontroleerd tegen de [dist van die release](https://raw.githubusercontent.com/elax46/custom-brand-icons/2026.10.3/dist/custom-brand-icons.js). Er is geen lokale PR-build gebruikt.

Resultaat: **35 vervoerdersmappings naar 33 unieke uitgebrachte iconen**. De overige 50 vervoerders gebruiken hun bestaande logo als fallback; custom gebruikt het eigen logo of een merkvlak. De nieuwe PHU-kandidaten zijn ook visueel gecontroleerd in [het auditvel](phu-audit.png).

Alle 86 types staan in [phu-audit.json](phu-audit.json), inclusief de gecontroleerde bron-URL en SHA-256. De demo gebruikt een reproduceerbare selectie van de 33 ongewijzigde paden in `scripts/scene-preview-phu.json`. De kaart zelf laadt dit previewbestand niet.

## Controles

[Volledige resultaten](review-all-results.json) en [detailcontroles](review-results.json):

- 430 statuscombinaties gecontroleerd voor alle 85 vervoerders en custom; vier/vijf stappen en voltooiingsvinkjes kloppen. Brieven en probleemstatussen blijven buiten de tracker.
- Alle vier overzichtsvarianten bevatten 430 SVG-scènes, daadwerkelijk op 60 px. Geen consolefouten of onbereikbare logo-afbeeldingen; zonder PHU ontbreekt de provider volledig.
- Geometrie identiek voor alle 86 types. Geen logo op Aangemeld of Bezorgd. Vaste logovakken en marges gecontroleerd op 44, 60 en 118 px.
- Het laagste berekende PHU-kleurcontrast over alle carrierpaletten is **3,013:1** op wit. Een zeer lichte custom-kleur en een `rgb()`-kleur zijn ook getest.
- Herhaalde HA-updates behouden de tracker-DOM. Vertraagde PHU-ophaling geeft één aanvraag en één verversing; ontbrekende of falende iconen blijven op de fallback zonder render-lus.
- Expliciete URL-voorrang, optionele mini-override, voertuig-GIF en carrier-chip getest.
- Bestaande bestanden in `images/` zijn niet gewijzigd, verwijderd of hernoemd. Geen nieuwe runtime-afhankelijkheden of echte persoonsgegevens.
- JavaScript-syntax en `git diff --check` geslaagd.

De automatische browsercontroles gebruiken een HA-stub. Er is geen echte Home Assistant-installatie gewijzigd.

## Stopmoment

Versie blijft **v2.0.0b18**. Geen commit, push, tag of release uitgevoerd. Geen aanvullende SVG-banner of geanimeerde SVG-bus gebouwd. De versienummering en uitgave van v2.0.0b19 blijven bij de gebruiker, conform de opdracht.

## Reproduceren

Start vanuit de bovenliggende werkmap `python -m http.server 8123 --bind 127.0.0.1`. Stel `NODE_PATH` in op een bestaande Playwright-installatie en voer vanuit de repo uit:

```text
node scripts/review_step_scenes.mjs
node scripts/review_all_step_scenes.mjs
```

De PHU-audit kan opnieuw worden uitgevoerd met een uitgebrachte dist en de bijbehorende GitHub-release-metadata:

```text
node scripts/audit_scene_phu.mjs <released-dist.js> <github-release-metadata.json>
```
