# V2-logobanner — drie proeven, wacht op keuze

**Inmiddels gekozen en afgewerkt: Studio, met donkere HA-kaartkleur in dark mode.
Lees [STUDIO.md](STUDIO.md) voor de actuele oplevering en screenshots. De tekst en
keuzebeelden hieronder zijn historisch; de andere varianten staan niet meer in de code of demo.**

Gemaakt op 27 oktober 2026 volgens `..\PROMPT-CODEX-V2-BANNER.md` in de bovenliggende
werkmap. De instructie is gevonden in `Claude werkmap`, niet één map daarboven.

## Openen en vergelijken

[Open de omschakelbare demo](http://127.0.0.1:8124/ha-parcel-card/banner-v2-demo.html).
Kies een van de drie varianten en vervoerderssets A–E. Iedere combinatie toont echte
kaartbreedtes van 500 en 375 px, beide in licht en donker thema.

1. **Studio** — losse witte logotegels, een zachte schaduw en een kleine kleurlijn.
2. **Accent + naam** — lichte kaartjes met een smalle accentrand en een vervoerdersnaam.
3. **Galerij** — een doorlopend wit vlak met volledige scheidingslijnen tussen gelijke vakken.

Snelle vergelijkingen naast elkaar:

- [De echte set van zeven vervoerders, 500 px, donker](vergelijking-A-500-donker.png)
- [Dezelfde set, 375 px, donker](vergelijking-A-375-donker.png)
- [Dezelfde set, 500 px, licht](vergelijking-A-500-licht.png)
- [Twaalf vervoerders, 375 px, donker](vergelijking-E-375-donker.png)
- [Volledige telefoonweergave op een scherm van 375 px](telefoon-375-set-E.png)

Alle screenshots per variant bevatten zowel licht/donker als 500/375 px:

| Set | Inhoud | Studio | Accent + naam | Galerij |
|---|---|---|---|---|
| A | PostNL, DHL, DPD, GLS, Dragonfly, Trunkrs, Cainiao | [beeld](studio-set-A.png) | [beeld](label-set-A.png) | [beeld](gallery-set-A.png) |
| B | PostNL, DHL | [beeld](studio-set-B.png) | [beeld](label-set-B.png) | [beeld](gallery-set-B.png) |
| C | PostNL, Dragonfly, Trunkrs | [beeld](studio-set-C.png) | [beeld](label-set-C.png) | [beeld](gallery-set-C.png) |
| D | PostNL, DPD, GLS, Dragonfly, TIPSA | [beeld](studio-set-D.png) | [beeld](label-set-D.png) | [beeld](gallery-set-D.png) |
| E | Twaalf: woordmerken, app-iconen en custom zonder logo | [beeld](studio-set-E.png) | [beeld](label-set-E.png) | [beeld](gallery-set-E.png) |

## Wat is gebouwd

`ha-parcel-card.js` bevat een kleine gegenereerde tabel `BANNER_LOGO_METRICS`, gemeten
met `scripts/measure_banner_logos.mjs`. De 85 bestaande logobestanden zijn offline in
geheugen gelezen: zichtbare inhoud zonder transparante of bijna witte rand, verhouding
en inktdichtheid. De volledige metingen en hashes staan in [logo-measurements.json](logo-measurements.json).
Er zijn geen bijgesneden afbeeldingsbestanden gemaakt en geen browser-canvasmetingen nodig.

De proeven worden door `renderLogoBannerPreview()` en `mountLogoBannerPreview()` uit
de kaartcode getekend. CSS en API staan onder `window.HAParcelCard.bannerPreview`, zodat
de demo geen eigen kopie van de normalisatie of banneropmaak heeft. Een SVG-viewport
snijdt alleen de gemeten lege marges uit de originele afbeelding; originele kleuren
blijven behouden. Brede woordmerken krijgen een lagere hoogte, app-iconen een vaste
maat met afgeronde hoeken, en een custom-vervoerder zonder logo een pakket-chip.

Het grid houdt alle cellen even groot en centreert een onvolledige laatste rij. De
bannerhoogte is 150 px bij twee/drie vervoerders, 168 px bij vijf/zeven en 244 px bij
twaalf. Dat is gelijk aan of lager dan de huidige minimumhoogtes van 150/180/270 px.

De HA-brand-iconen worden in de demo via **Claude's bestaande ophaalcode** voorbereid.
De lokale server simuleert voor TIPSA, Ukrposhta, bpost en FedEx het HA-endpoint met
dezelfde bestaande integratie-iconen uit de repo en de verzonnen token `banner-demo-only`.
Er zijn geen echte HA-tokens of persoonsgegevens gebruikt. Dit is een browserproef;
er is geen echte Home Assistant-installatie gewijzigd.

Gemeten uitsneden van de integratie-iconen worden ook gebruikt voor hun HA-endpoint.
Als een geïnstalleerde integratie later andere inhoud/marges voor dat icoon levert,
kan de vooraf gemeten uitsnede daarvoor opnieuw gecontroleerd moeten worden. Onbekende
eigen logo-URL's blijven volledig zichtbaar en krijgen een veilige standaardmaat.

## Behouden tijdens deze keuzeproef

- De huidige productie-combo-banner, `_getNoSelectionBackground()`,
  `_splitIntoBalancedRows()` en `updateAnimation()` zijn ongewijzigd.
- Claude's brand-token-, laad- en fallbackfuncties, `_prepareBrandIcons()` en
  `_carrierBranding()` zijn ongewijzigd.
- De goedgekeurde SVG-statusscènes zijn behouden.
- De bestaande changelog en documentatie zijn tijdens deze bannerproef niet gewijzigd.
  De nieuwe bannerregel volgt pas na de variantkeuze, zoals de opdracht voorschrijft.
- Alle originele logobestanden zijn met hun SHA-256 gecontroleerd en ongewijzigd.
  Er zijn geen bestaande afbeeldingen verwijderd of hernoemd. De PNG's in deze map
  zijn uitsluitend de gevraagde screenshots.
- Er is geen nieuwe runtime-afhankelijkheid of pakketinstallatie toegevoegd.

## Controles

[review-results.json](review-results.json) bevat alle uitkomsten. Geslaagd:

- Drie varianten × vijf sets × vier breedte/themacombinaties: **60 weergaven**.
- Gelijke celgroottes, gecentreerde laatste rijen en logo's binnen hun veilige vakken.
- Geen horizontale scroll bij een telefoonviewport van 375 px.
- Geen hogere banner dan de huidige bij hetzelfde aantal vervoerders.
- Alle zichtbare afbeeldingen geladen; geen consolefouten.
- HA-brand-iconen: één tokenaanvraag en één verversing per relevante set; fallback
  naar de bestaande logo's bij een gesimuleerde oudere HA zonder brands-command.
- Twintig identieke updates behouden de beeldnodes én de actieve hover-zoom.
- Klikken op een tegel werkt in de demo; er wordt geen externe actie uitgevoerd.
- Hashcontrole van de ongewijzigde productie- en fallbackfuncties en changelog.
- `node --check ha-parcel-card.js` en `git diff --check` slagen.
- Beide gevraagde regressies slagen: `review_step_scenes.mjs` en
  `review_all_step_scenes.mjs`, inclusief de 430 statuscombinaties.

## Hervatten

De lokale server draait op poort 8124. Zo nodig opnieuw starten vanuit de repo:

```powershell
python scripts/serve_banner_preview.py
```

Met de aanwezige runtime, zonder installatie:

```powershell
$env:NODE_PATH = '<pad-naar-node_modules-met-playwright-en-sharp>'
node scripts/measure_banner_logos.mjs
node scripts/review_banner_previews.mjs
```

De scènecontroles gebruiken de bestaande previewsserver op poort 8123, gestart vanuit
de bovenliggende werkmap met `python -m http.server 8123 --bind 127.0.0.1`.

## Stopmoment en overdracht

**Nu stoppen: de gebruiker kiest eerst variant 1, 2 of 3.** Er is nog geen variant
als nieuwe productie-banner geactiveerd. Daarna uitsluitend de gekozen variant
afwerken en integreren, de andere proeven uit de implementatie verwijderen,
`Unreleased` en waar nodig `docs/card/screenshots.md` aanvullen, opnieuw beelden
tonen en weer stoppen. De hashbeveiliging van de oude productie-banner geldt alleen
voor deze keuzeproef; pas die test bij de bewuste integratie aan zonder de
brand-icon-fallback of statusscènes terug te draaien.

Versie blijft `v2.0.0b18`. Niets gecommit, gepusht, getagd of uitgebracht. Claude verzorgt
de latere uitgave van `v2.0.0b19` volgens de opdracht; deze proef geeft daar geen opdracht toe.
