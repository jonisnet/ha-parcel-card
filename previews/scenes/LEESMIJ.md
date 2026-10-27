# V2-scèneconcept — fase A

**Fase A is goedgekeurd en fase B is uitgevoerd. Zie [het actuele fase-B-verslag](FASE-B.md) en [het volledige overzicht](http://127.0.0.1:8123/ha-parcel-card/svg-carriers-overview.html). Onderstaande tekst bewaart de oorspronkelijke fase-A-oplevering.**

Gemaakt op 27 oktober 2026. Wacht op visueel akkoord; fase B is niet uitgevoerd.

Open de [interactieve demo](http://127.0.0.1:8123/ha-parcel-card/svg-postnl-demo.html). De lokale previewsserver draait op poort 8123 vanuit de bovenliggende werkmap. Na een herstart kan die opnieuw worden gestart met `python -m http.server 8123 --bind 127.0.0.1` vanuit die werkmap.

## Beelden

Elke tijdlijnscreenshot bevat 60 px, 44 px, de grijze toekomststand, licht/donker en met/zonder PHU. Elke hero-screenshot toont alle vijf scènes op 118 px hoogte, in dezelfde vier combinaties.

| Vervoerder | Tijdlijnen | Heroes |
|---|---|---|
| PostNL | [60/44 px](postnl-timeline.png) | [118 px](postnl-hero.png) |
| Sameday | [60/44 px](sameday-timeline.png) | [118 px](sameday-hero.png) |
| Ukrposhta | [60/44 px](ukrposhta-timeline.png) | [118 px](ukrposhta-hero.png) |
| Spee-Dee Delivery | [60/44 px](spee_dee_delivery-timeline.png) | [118 px](spee_dee_delivery-hero.png) |
| DHL | [60/44 px](dhl-timeline.png) | [118 px](dhl-hero.png) |

Ook beschikbaar: [kale HA op een scherm van 375 px breed](mobile-375-kale-ha.png).

## Implementatie

- Eén set handgeschreven scènefuncties en paletlogica in `ha-parcel-card.js`; kaart, demo en dunne exporter delen deze bron. Iedere scène heeft viewBox `0 0 160 128`.
- De vijf conceptvervoerders gebruiken de nieuwe scènes in de tracker. Andere vervoerders behouden hun bestaande stapafbeeldingen; omzetting van alle 85 plus custom hoort bij fase B.
- Een expliciete stap-URL houdt voorrang. Legacy mini-afbeeldingen blijven bruikbaar totdat ook die vervoerders worden omgezet. De afhaalpuntfallback is nu SVG.
- Geneste SVG-logovakken met vaste binnenmarges. PHU-paden worden vooraf geladen en gecachet; bij ontbreken volgt het bestaande logo en anders een effen merkvlak. App-iconen krijgen afgeronde hoeken.
- Het logo op wit krijgt generiek minimaal 3:1 contrast. Kleuren en tinten volgen de carrierkleur, inclusief een eigen custom-kleur.
- Pakket en huis hebben geen logo. De balie volgt de referentiecompositie, met gevulde kastdeuren, dunne vaklijnen en een klant vóór de balie.
- De rijdende hero behoudt de bestaande voertuig-GIF of carrier-chip.

## PHU-controle

Gecontroleerd tegen de uitgebrachte [release 2026.10.3](https://github.com/elax46/custom-brand-icons/releases/tag/2026.10.3) en de bijbehorende [dist](https://raw.githubusercontent.com/elax46/custom-brand-icons/2026.10.3/dist/custom-brand-icons.js).

PostNL, DHL en Sameday bestaan daarin. Ukrposhta en Spee-Dee ontbreken en krijgen daarom geen nieuwe mapping. Hun beide demovarianten gebruiken het bestaande logo. Sameday is nu toegevoegd aan de mapping. De volledige audit van de overige mappings volgt in fase B.

De demo gebruikt drie ongewijzigde paden uit deze release in `scripts/scene-preview-phu.json`, zodat de beoordeling zonder externe PHU-installatie reproduceerbaar is. De kaart zelf leest uitsluitend de eventueel aanwezige `window.customIconsets.phu` en laadt deze previewdata niet.

## Verificatie

Alle controles in [review-results.json](review-results.json) zijn geslaagd:

- Browserdemo zonder HA; geen consolefouten. Ook getest met volledig ontbrekende PHU-provider.
- Werkelijke SVG-viewports: 60 en 44 px; hero 118 px. Geen paginabrede overflow op 375 px.
- Geometrie identiek voor alle vijf conceptvervoerders en custom; logo-viewports blijven binnen de panelen met marge tot de contour.
- Geen logovakken op Aangemeld of Bezorgd. Visuele controle van alle vijf hero-sheets en de tijdlijnen.
- Twintig gelijke HA-updates behouden dezelfde SVG-DOM-elementen. Vertraagd PHU-pad: één aanvraag en één verversing. Ontbrekende of falende PHU-provider blijft gecachet op de fallback.
- Expliciete URL-voorrang, legacy mini-voorrang, bestaande GIF en carrier-chip gecontroleerd.
- PHU-kleurcontrast: PostNL 3,25:1; Sameday 4,51:1; DHL 3,12:1. De generieke kleurregel haalt ook voor Ukrposhta-geel en een zeer lichte custom-kleur minimaal 3:1.
- `node --check ha-parcel-card.js` en `git diff --check` geslaagd.

Reproduceren: stel `NODE_PATH` in op een bestaande Playwright-installatie en voer `node scripts/review_step_scenes.mjs` uit terwijl de lokale previewsserver draait. Hiervoor is de al aanwezige workspace-runtime gebruikt; er is niets geïnstalleerd. `node scripts/generate_carrier_svg_art.mjs` exporteert optioneel 25 SVG-previews vanuit dezelfde kaartcode.

Geen bestaande afbeeldingen verwijderd of hernoemd. Er zijn geen nieuwe rasterafbeeldingen voor de kaart; de PNG's in deze previewmap zijn uitsluitend de gevraagde screenshots. Geen persoonsgegevens, nieuwe runtime-afhankelijkheden, commits, push, versieaanpassing of release. README, docs en changelog wachten conform de opdracht op fase B.

De browsercontroles gebruiken een HA-stub. Beoordeling in een echte HA-dashboardconfiguratie blijft onderdeel van de uiteindelijke integratie na het visuele akkoord.
