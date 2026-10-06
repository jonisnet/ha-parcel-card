# HA Parcel Card (v2, beta)

> ⚠️ **Beta, not yet a stable release.** This is the v2 successor to
> [`hki-parcels-card`](https://github.com/jonisnet/hki-parcels-card) (the stable v1.7.x card) —
> renamed because "HKI" is [jimz011](https://github.com/jimz011)'s own trade name, and v2 is
> moving toward the broader [ha-parcel-integrations](https://github.com/ha-parcel-integrations)
> family instead. Not (yet) submitted to HACS' default store, but installable as a **HACS custom
> repository** now that pre-releases exist — see [Installation](https://jonisnet.github.io/ha-parcel-card/installation/),
> or install manually:
>
> 1. Download `ha-parcel-card.js` from the [latest release](https://github.com/jonisnet/ha-parcel-card/releases/latest)
> 2. Place it at `/config/www/ha-parcel-card.js`
> 3. Go to **Settings → Dashboards → Resources** and add it as a **JavaScript module** resource
> 4. Use `type: custom:ha-parcel-card` in your dashboard — this is a different card type than
>    `custom:hki-parcels-card`, so both can be installed side by side without conflict
>
> Found a bug? Open an issue here, not on `hki-parcels-card`.

[![Version](https://img.shields.io/badge/version-v2.0.0b12-blue?style=flat-square)](https://github.com/jonisnet/ha-parcel-card/releases/latest)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange?style=flat-square)](https://hacs.xyz)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/jonisnet/ha-parcel-card/blob/main/LICENSE)
[![HA](https://img.shields.io/badge/Home%20Assistant-2026.7%2B-41bdf5?style=flat-square)](https://www.home-assistant.io)
[![Downloads](https://img.shields.io/github/downloads/jonisnet/ha-parcel-card/total?style=flat-square&label=downloads)](https://github.com/jonisnet/ha-parcel-card/releases)
[![Sponsor](https://img.shields.io/badge/sponsor-ea4aaa?style=flat-square&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/jonisnet)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=flat-square&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/jonisnet)

**Track parcels from all 68 carriers of the [ha-parcel-integrations](https://github.com/ha-parcel-integrations) family — PostNL, DHL, DPD, UPS, FedEx, USPS, GLS, bpost, La Poste, Evri and many more — in a single Home Assistant card** — with animated banners, letter scan images, automatic sensor detection, a "+ Add parcel" control for account-less carriers, and a full visual editor.

📖 **Full documentation, configuration reference and screenshots:** **[jonisnet.github.io/ha-parcel-card](https://jonisnet.github.io/ha-parcel-card/)**

![Dashboard screenshot](https://raw.githubusercontent.com/jonisnet/ha-parcel-card/main/images/screenshot-dashboard.png)

*Parcel detail with the 4-step delivery tracker*

> Based on [jimz011/hki-elements](https://github.com/jimz011/hki-elements) — the original PostNL card from the HKI project, extended with multi-carrier support, automatic sensor templating and letterbox mail.

---

## Features

- **Multi-carrier** — any of the 68 supported carriers side by side in one card, each with its own logo and brand colour (most with full banner, van animation and step artwork; the newest carriers use their integration's own icon until that artwork is done)
- **Four tabs** — In Transit · Delivered · Sent · Letters, with parcel details, barcode and a direct tracking link
- **4-step delivery tracker** — a branded progress illustration (Registered · Sorting centre · Out for delivery · Delivered) when a parcel is selected
- **Carrier overview popup** — click a logo in the multi-carrier banner to see every parcel and letter for that carrier across all tabs in one popup, with details expandable in place
- **Add a parcel from the card** — every carrier whose integration has a `track_parcel` service gets a "+ Add parcel" control that registers a new Track & Trace number directly; see [Add parcel support](#add-parcel-support) below
- **Custom parcel names** — give any parcel a short label of your own (e.g. "Birthday gift") right from its detail panel, instead of just a tracking code; shared instance-wide with live updates by default, or scope it to just you or just this browser — see `custom_name_scope`
- **Flexible sorting & grouping** — soonest-arriving parcel on top by default, or pin newest/oldest-first everywhere; group parcels by carrier or show one flat, interleaved list — see `sort_order`/`group_by_carrier`
- **Letterbox mail** — PostNL letters get their own tab with scan images, matched automatically and resilient to ha-postnl updates
- **Full visual editor** — no YAML required, with auto sensor detection, a media browser for custom images, a colour picker and live preview
- **Automatic combo banner** — with two or more carriers configured, the card builds a combo banner from just the carriers you've actually added

![Editor screenshot](https://raw.githubusercontent.com/jonisnet/ha-parcel-card/main/images/screenshot-editor-carriers.png)

*Visual editor with live preview*

<table>
<tr>
<td><img src="https://raw.githubusercontent.com/jonisnet/ha-parcel-card/main/images/screenshot-banners-dark.png" alt="Combo banner, dark theme"></td>
<td><img src="https://raw.githubusercontent.com/jonisnet/ha-parcel-card/main/images/screenshot-banners-light.png" alt="Combo banner, light theme"></td>
</tr>
<tr>
<td align="center"><em>Dark theme</em></td>
<td align="center"><em>Light theme</em></td>
</tr>
</table>

More screenshots and examples: [jonisnet.github.io/ha-parcel-card/card/screenshots](https://jonisnet.github.io/ha-parcel-card/card/screenshots/)

---

## Required integrations

Install the integration for each carrier you use **before** adding the card. All of them are part of the [ha-parcel-integrations](https://github.com/ha-parcel-integrations) family, publishing the same canonical parcel format — which is what lets one card support all of them.

Maintain a different parcel-tracking integration and want your users to use this card? It's not
limited to the carriers below — any integration publishing the same canonical format works today
via `type: custom`, no code changes needed here. See **[the integration contract](contract.md)**.

| Carrier | Integration | Add parcel from card | Sent tab | Letters |
| ------- | ----------- | :------------------: | :------: | :-----: |
| **4PX** | [ha-parcel-integrations/ha-4px](https://github.com/ha-parcel-integrations/ha-4px) | ✅ | — | — |
| **Airmee** | [ha-parcel-integrations/ha-airmee](https://github.com/ha-parcel-integrations/ha-airmee) | ✅ | — | — |
| **Amazon** | [ha-parcel-integrations/ha-amazon](https://github.com/ha-parcel-integrations/ha-amazon) | — | — | — |
| **Ampère** | [ha-parcel-integrations/ha-ampere](https://github.com/ha-parcel-integrations/ha-ampere) | — | — | — |
| **An Post** | [ha-parcel-integrations/ha-an-post](https://github.com/ha-parcel-integrations/ha-an-post) | ✅ | — | — |
| **Apple Express** | [ha-parcel-integrations/ha-apple-express](https://github.com/ha-parcel-integrations/ha-apple-express) | ✅ | — | — |
| **Aramex** | [ha-parcel-integrations/ha-aramex](https://github.com/ha-parcel-integrations/ha-aramex) | ✅ | — | — |
| **Austrian Post** | [ha-parcel-integrations/ha-oesterreichische-post](https://github.com/ha-parcel-integrations/ha-oesterreichische-post) | ✅ | — | — |
| **Better Trucks** | [ha-parcel-integrations/ha-better-trucks](https://github.com/ha-parcel-integrations/ha-better-trucks) | ✅ | — | — |
| **BoxNow** | [ha-parcel-integrations/ha-boxnow](https://github.com/ha-parcel-integrations/ha-boxnow) | ✅ | — | — |
| **bpost** | [ha-parcel-integrations/ha-bpost](https://github.com/ha-parcel-integrations/ha-bpost) | ✅ | ✅ | ✅ |
| **Budbee** | [ha-parcel-integrations/ha-budbee](https://github.com/ha-parcel-integrations/ha-budbee) | ✅ | ✅ | — |
| **Cainiao** | [ha-parcel-integrations/ha-cainiao](https://github.com/ha-parcel-integrations/ha-cainiao) | ✅ | — | — |
| **Canada Post** | [ha-parcel-integrations/ha-canada-post](https://github.com/ha-parcel-integrations/ha-canada-post) | ✅ | — | — |
| **Canpar** | [ha-parcel-integrations/ha-canpar](https://github.com/ha-parcel-integrations/ha-canpar) | ✅ | — | — |
| **Ceska Posta** | [ha-parcel-integrations/ha-ceska-posta](https://github.com/ha-parcel-integrations/ha-ceska-posta) | ✅ | — | — |
| **Correos** | [ha-parcel-integrations/ha-correos](https://github.com/ha-parcel-integrations/ha-correos) | ✅ | — | — |
| **CTT** | [ha-parcel-integrations/ha-ctt](https://github.com/ha-parcel-integrations/ha-ctt) | ✅ | — | — |
| **DAO** | [ha-parcel-integrations/ha-dao](https://github.com/ha-parcel-integrations/ha-dao) | — | ✅ | — |
| **Delhivery** | [ha-parcel-integrations/ha-delhivery](https://github.com/ha-parcel-integrations/ha-delhivery) | ✅ | — | — |
| **DHL** | [ha-parcel-integrations/ha-dhl](https://github.com/ha-parcel-integrations/ha-dhl) | ✅ | ✅ | — |
| **DHL NL** | [ha-parcel-integrations/ha-dhl-nl](https://github.com/ha-parcel-integrations/ha-dhl-nl) | — | ✅ | — |
| **DPD** | [ha-parcel-integrations/ha-dpd](https://github.com/ha-parcel-integrations/ha-dpd) | — | ✅ | — |
| **Dragonfly** | [ha-parcel-integrations/ha-dragonfly](https://github.com/ha-parcel-integrations/ha-dragonfly) | ✅ | — | — |
| **Dynalogic** | [ha-parcel-integrations/ha-dynalogic](https://github.com/ha-parcel-integrations/ha-dynalogic) | ✅ | — | — |
| **Econt** | [ha-parcel-integrations/ha-econt](https://github.com/ha-parcel-integrations/ha-econt) | ✅ | — | — |
| **ELTA Courier** | [ha-parcel-integrations/ha-elta-courier](https://github.com/ha-parcel-integrations/ha-elta-courier) | ✅ | — | — |
| **Evri** | [ha-parcel-integrations/ha-evri](https://github.com/ha-parcel-integrations/ha-evri) | ✅ | ✅ | — |
| **FAN Courier** | [ha-parcel-integrations/ha-fan-courier](https://github.com/ha-parcel-integrations/ha-fan-courier) | ✅ | — | — |
| **FedEx** | [ha-parcel-integrations/ha-fedex](https://github.com/ha-parcel-integrations/ha-fedex) | ✅ | — | — |
| **GLS** | [ha-parcel-integrations/ha-gls](https://github.com/ha-parcel-integrations/ha-gls) | ✅ | — | — |
| **GOFO Express** | [ha-parcel-integrations/ha-gofo](https://github.com/ha-parcel-integrations/ha-gofo) | ✅ | — | — |
| **Helthjem** | [ha-parcel-integrations/ha-helthjem](https://github.com/ha-parcel-integrations/ha-helthjem) | ✅ | — | — |
| **Hermes** | [ha-parcel-integrations/ha-hermes](https://github.com/ha-parcel-integrations/ha-hermes) | ✅ | — | — |
| **ICS Courier** | [ha-parcel-integrations/ha-ics-courier](https://github.com/ha-parcel-integrations/ha-ics-courier) | ✅ | — | — |
| **InPost** | [ha-parcel-integrations/ha-inpost](https://github.com/ha-parcel-integrations/ha-inpost) | ✅ | — | — |
| **La Poste** | [ha-parcel-integrations/ha-laposte](https://github.com/ha-parcel-integrations/ha-laposte) | ✅ | — | — |
| **Matkahuolto** | [ha-parcel-integrations/ha-matkahuolto](https://github.com/ha-parcel-integrations/ha-matkahuolto) | ✅ | — | — |
| **Mondial Relay** | [ha-parcel-integrations/ha-mondial-relay](https://github.com/ha-parcel-integrations/ha-mondial-relay) | — | ✅ | — |
| **Nova Post** | [ha-parcel-integrations/ha-nova-post](https://github.com/ha-parcel-integrations/ha-nova-post) | ✅ | — | — |
| **NZ Post** | [ha-parcel-integrations/ha-nz-post](https://github.com/ha-parcel-integrations/ha-nz-post) | ✅ | — | — |
| **OnTrac** | [ha-parcel-integrations/ha-ontrac](https://github.com/ha-parcel-integrations/ha-ontrac) | ✅ | — | — |
| **ORLEN Paczka** | [ha-parcel-integrations/ha-orlen-paczka](https://github.com/ha-parcel-integrations/ha-orlen-paczka) | ✅ | — | — |
| **Paack** | [ha-parcel-integrations/ha-paack](https://github.com/ha-parcel-integrations/ha-paack) | ✅ | — | — |
| **Packeta** | [ha-parcel-integrations/ha-packeta](https://github.com/ha-parcel-integrations/ha-packeta) | ✅ | ✅ | — |
| **Planzer** | [ha-parcel-integrations/ha-planzer](https://github.com/ha-parcel-integrations/ha-planzer) | ✅ | — | — |
| **Poczta Polska** | [ha-parcel-integrations/ha-poczta-polska](https://github.com/ha-parcel-integrations/ha-poczta-polska) | ✅ | — | — |
| **Poste Italiane** | [ha-parcel-integrations/ha-poste-italiane](https://github.com/ha-parcel-integrations/ha-poste-italiane) | ✅ | — | — |
| **Posten Bring** | [ha-parcel-integrations/ha-posten-bring](https://github.com/ha-parcel-integrations/ha-posten-bring) | — | ✅ | — |
| **Posti** | [ha-parcel-integrations/ha-posti](https://github.com/ha-parcel-integrations/ha-posti) | ✅ | — | — |
| **PostNL** | [ha-parcel-integrations/ha-postnl](https://github.com/ha-parcel-integrations/ha-postnl) | — | ✅ | ✅ |
| **PostNord** | [ha-parcel-integrations/ha-postnord](https://github.com/ha-parcel-integrations/ha-postnord) | ✅ | ✅ | — |
| **PPL CZ** | [ha-parcel-integrations/ha-ppl-cz](https://github.com/ha-parcel-integrations/ha-ppl-cz) | — | ✅ | — |
| **Purolator** | [ha-parcel-integrations/ha-purolator](https://github.com/ha-parcel-integrations/ha-purolator) | ✅ | ✅ | — |
| **Quickpac** | [ha-parcel-integrations/ha-quickpac](https://github.com/ha-parcel-integrations/ha-quickpac) | ✅ | — | — |
| **Sameday** | [ha-parcel-integrations/ha-sameday](https://github.com/ha-parcel-integrations/ha-sameday) | ✅ | — | — |
| **SEUR** | [ha-parcel-integrations/ha-seur](https://github.com/ha-parcel-integrations/ha-seur) | — | ✅ | — |
| **Shopee Xpress** | [ha-parcel-integrations/ha-shopee-xpress](https://github.com/ha-parcel-integrations/ha-shopee-xpress) | ✅ | — | — |
| **Slovak Parcel Service** | [ha-parcel-integrations/ha-slovak-parcel-service](https://github.com/ha-parcel-integrations/ha-slovak-parcel-service) | ✅ | — | — |
| **Slovenská Pošta** | [ha-parcel-integrations/ha-slovenska-posta](https://github.com/ha-parcel-integrations/ha-slovenska-posta) | ✅ | — | — |
| **SpeedX** | [ha-parcel-integrations/ha-speedx](https://github.com/ha-parcel-integrations/ha-speedx) | ✅ | — | — |
| **SunYou** | [ha-parcel-integrations/ha-sunyou](https://github.com/ha-parcel-integrations/ha-sunyou) | ✅ | — | — |
| **Swiss Post** | [ha-parcel-integrations/ha-swiss-post](https://github.com/ha-parcel-integrations/ha-swiss-post) | ✅ | ✅ | — |
| **Trunkrs** | [ha-parcel-integrations/ha-trunkrs](https://github.com/ha-parcel-integrations/ha-trunkrs) | ✅ | — | — |
| **UniUni** | [ha-parcel-integrations/ha-uniuni](https://github.com/ha-parcel-integrations/ha-uniuni) | ✅ | — | — |
| **UPS** | [ha-parcel-integrations/ha-ups](https://github.com/ha-parcel-integrations/ha-ups) | ✅ | — | — |
| **USPS** | [ha-parcel-integrations/ha-usps](https://github.com/ha-parcel-integrations/ha-usps) | ✅ | — | — |
| **Vinted Go** | [ha-parcel-integrations/ha-vinted-go](https://github.com/ha-parcel-integrations/ha-vinted-go) | — | ✅ | — |

PostNL needs ≥ 4.0.0. Dragonfly is also maintained standalone by its creator at [HummelsTech/ha-dragonfly](https://github.com/HummelsTech/ha-dragonfly); either works with this card. `DHL NL` and `DHL` are two different integrations, see [Carrier types](https://jonisnet.github.io/ha-parcel-card/card/configuration/#carrier-types).

Full version compatibility notes, PostNL variant details and sensor naming: [jonisnet.github.io/ha-parcel-card/card/configuration](https://jonisnet.github.io/ha-parcel-card/card/configuration/).

### Add parcel support

The card's "+ Add parcel" control appears for every carrier whose integration has a `track_parcel` service (the **Add parcel from card** column above) — mostly carriers that track by tracking number, plus account-based ones that also accept a code, such as An Post, bpost and DHL. Account-based integrations without such a service (PostNL, DHL NL, DPD, Vinted Go, ...) don't need one: every parcel sent to or from your account appears automatically.

---

## Installation

### Via HACS (recommended)

1. Go to **HACS → Dashboard → ⋮ → Custom repositories**
2. Add `https://github.com/jonisnet/ha-parcel-card` with category **Dashboard**
3. Search for **HA Parcel Card** and click Install
4. Restart Home Assistant (or do a hard refresh: Ctrl+Shift+R)

### Manual

1. Download `ha-parcel-card.js` from the [latest release](https://github.com/jonisnet/ha-parcel-card/releases/latest)
2. Copy the file to `/config/www/ha-parcel-card.js`
3. Go to **Settings → Dashboards → Resources** and add `/local/ha-parcel-card.js` (type: JavaScript module)
4. Hard refresh your browser

Optional: install [custom-brand-icons](https://github.com/elax46/custom-brand-icons) via HACS for branded PHU carrier icons — detected automatically, no configuration needed.

Full installation guide: [jonisnet.github.io/ha-parcel-card/installation](https://jonisnet.github.io/ha-parcel-card/installation/).

---

## Quick start

Add the card to your dashboard — it auto-detects every installed carrier integration and pre-fills a fully configured entry for each one it finds. Open the visual editor afterwards only if you want to tweak something.

Or add it via YAML:

```yaml
type: custom:ha-parcel-card
title: Parcels
carriers:
  - type: postnl
    user: my_account
  - type: dhl
    user: my_account
  - type: dpd
    user: my_account
  - type: vinted_go
    user: my_account
  - type: gls
    user: "1234ab"
  - type: dragonfly
  - type: trunkrs
    user: "1234ab"
  - type: cainiao
  - type: hermes
  - type: packeta
  - type: correos
  - type: postnord
  - type: sameday
  - type: swiss_post
  - type: planzer
  - type: austrian_post
  - type: helthjem
  - type: dynalogic
  - type: budbee
  - type: nova_post
  - type: delhivery
  - type: sunyou
```

For the full list of card/carrier options, sensor naming schemes and the carrier types reference table, see the **[Configuration guide](https://jonisnet.github.io/ha-parcel-card/card/configuration/)**.

---

## Translations

The card automatically follows your Home Assistant UI language — no setting to configure. Currently available: 🇬🇧 English, 🇳🇱 Dutch, 🇩🇪 German, 🇫🇷 French, 🇪🇸 Spanish, 🇮🇹 Italian, 🇵🇱 Polish, 🇵🇹 Portuguese, 🇨🇿 Czech, 🇸🇰 Slovak, 🇭🇺 Hungarian, 🇷🇴 Romanian, 🇧🇬 Bulgarian, 🇺🇦 Ukrainian, 🇮🇳 Hindi, 🇸🇪 Swedish, 🇩🇰 Danish, 🇫🇮 Finnish, 🇳🇴 Norwegian (Bokmål) (any other language falls back to English) — chosen to match the languages the underlying carrier integrations themselves support. Want to add or improve one? See **[translations/README.md](translations/README.md)** — it's a single JSON file per language, no code changes needed.

---

## Sponsor

This card is free and maintained in my spare time. If it's useful to you, a small contribution is very welcome and appreciated:

[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor-ea4aaa?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/jonisnet)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/jonisnet)

---

## Credits

- [jimz011/hki-elements](https://github.com/jimz011/hki-elements) — original PostNL card and visual design
- [ha-parcel-integrations](https://github.com/ha-parcel-integrations) — the 68 carrier integrations this card supports, all sharing one canonical parcel format
- [Alwin Hummels (@HummelsTech)](https://github.com/HummelsTech) — created the Dragonfly integration ([HummelsTech/ha-dragonfly](https://github.com/HummelsTech/ha-dragonfly)), also mirrored into ha-parcel-integrations above

---

## License

[MIT](LICENSE)
