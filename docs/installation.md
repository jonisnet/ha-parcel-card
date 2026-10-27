# Installation

## Via HACS (recommended)

1. In Home Assistant go to **HACS → Dashboard → ⋮ → Custom repositories**
2. Add `https://github.com/jonisnet/ha-parcel-card` as category **Dashboard**
3. Search for **HA Parcel Card** and install
4. Restart Home Assistant or do a hard refresh (Ctrl+Shift+R)

---

## Manual

1. Download `ha-parcel-card.js` from the [latest release](https://github.com/jonisnet/ha-parcel-card/releases/latest)
2. Place the file at `/config/www/ha-parcel-card.js`
3. Go to **Settings → Dashboards → Resources** and add:

```
/local/ha-parcel-card.js
```

Select type: **JavaScript module**

4. Clear your browser cache (Ctrl+Shift+R / Cmd+Shift+R)

---

## Required integrations

Install the integration for each carrier you use **before** adding the card. All of them are part of the [ha-parcel-integrations](https://github.com/ha-parcel-integrations) family, publishing the same canonical parcel format — which is what lets one card support all of them.

!!! note "About the links below"
    Several of these integrations started as personal repos (`peternijssen/ha-*`, `HummelsTech/ha-dragonfly`) and were later moved into the `ha-parcel-integrations` org to be maintained together. The org repos are the actively maintained ones and are generally ahead in version — this documentation and the card's own "integration not found" links point there instead of the old personal forks.

### PostNL

| Label | Card type | Integration |
| ----- | --------- | ----------- |
| **PostNL** | `postnl` | [ha-parcel-integrations/ha-postnl](https://github.com/ha-parcel-integrations/ha-postnl) ≥ 4.0.0 |

!!! warning "PostNL (<v4.x) and PostNL (ArjenBos) are no longer supported"
    As announced ahead of this release, the older `postnl` (ha-postnl ≤ 3.x) and `postnl_legacy`
    (arjenbos/ha-postnl) card types have been removed from HA Parcel Card v2.0 — upgrade to
    [ha-postnl](https://github.com/ha-parcel-integrations/ha-postnl) ≥ 4.0.0 and use the single
    `postnl` card type above. The stable [hki-parcels-card](https://github.com/jonisnet/hki-parcels-card)
    v1.x line still supports both if you're not ready to upgrade yet.

### Every other carrier

The other 84 carriers — DHL, DPD, UPS, FedEx, USPS, GLS, bpost, La Poste, Evri and the rest — are listed with a link to their integration under **[Carrier types](card/configuration.md#carrier-types)**, together with what each one supports (Sent tab, letters, "Add parcel").

Roughly, they come in three kinds:

- **Account login** (PostNL, DHL NL, DPD, Vinted Go, Amazon, SEUR, ...) — every parcel sent to or from your account appears automatically. If the integration has no `track_parcel` service, the card has no "Add parcel" control for it; it isn't needed.
- **Tracking code only** (UPS, FedEx, USPS, Cainiao, ...) — you register parcels one by one, from the card's "Add parcel" control or the integration's own Configure dialog. A few tie a parcel to a postal code (GLS, Trunkrs, Evri, Slovak Parcel Service); the card's `user` field is then that postal code.
- **Both** (bpost, DHL, An Post, Canada Post, Hermes, PostNord, Posti, Swiss Post, ...) — log in for automatic parcels, and/or add codes by hand.

!!! info "Dragonfly's original integration"
    Dragonfly support was created by [Alwin Hummels (@HummelsTech)](https://github.com/HummelsTech), who maintains it standalone at [HummelsTech/ha-dragonfly](https://github.com/HummelsTech/ha-dragonfly) as well as the mirror in ha-parcel-integrations — either one works with this card.

!!! note "`dhl` and `dhl_global` are different integrations"
    The card type `dhl` (shown as **DHL NL**) is [ha-dhl-nl](https://github.com/ha-parcel-integrations/ha-dhl-nl). `dhl_global` (shown as **DHL**) is [ha-dhl](https://github.com/ha-parcel-integrations/ha-dhl): DHL Paket Germany, DHL Parcel Poland, DHL Express and DHL's wider network by tracking code.

---

## Optional: PHU carrier icons

Install [custom-brand-icons](https://github.com/elax46/custom-brand-icons) via HACS to get branded `phu:` carrier icons. The card detects this automatically — no configuration needed.

The SVG delivery scenes work without this optional iconset. Their logo panels prefer a
mapped PHU icon, then the carrier's existing logo (rounded for app icons), then a plain
panel in the configured carrier colour. For carriers without their own card artwork, the
"existing logo" is the icon that the installed integration ships in its `brand/` folder,
served by Home Assistant 2026.3 and newer; older versions use a copy kept in this repository. A `logo_path` override replaces the image fallback.
Registered and Delivered intentionally have no logo. If an older PHU installation lacks a
mapped icon, the scene retains its image fallback.

All 85 carrier mappings were checked on 27 October 2026 against the published
[custom-brand-icons 2026.10.3 release](https://github.com/elax46/custom-brand-icons/releases/tag/2026.10.3)
and its `dist/custom-brand-icons.js`. These 35 carrier types have released icons:

| Carrier | PHU icon |
| ------- | -------- |
| PostNL | `phu:postnl` |
| DHL NL | `phu:dhl` |
| DPD | `phu:dpd` |
| Vinted Go | `phu:vinted` |
| GLS | `phu:gls-group` |
| Dragonfly | `phu:dragonfly` |
| Trunkrs | `phu:trunkrs` |
| Cainiao | `phu:cainiao` |
| Hermes | `phu:hermes` |
| Packeta | `phu:packeta` |
| Correos | `phu:correos` |
| PostNord | `phu:postnord` |
| Sameday | `phu:sameday` |
| Swiss Post | `phu:swisspost` |
| Austrian Post | `phu:austrianpost` |
| Helthjem | `phu:helthjem` |
| Budbee | `phu:budbee` |
| Nova Post | `phu:nova_post` |
| SunYou | `phu:sunyou` |
| An Post | `phu:anpost` |
| InPost | `phu:inpost` |
| PPL CZ | `phu:ppl` |
| Ceska Posta | `phu:ceska-posta` |
| Amazon | `phu:amazon-logo` |
| CTT | `phu:ctt` |
| DHL | `phu:dhl` |
| Econt | `phu:econt` |
| FedEx | `phu:fedex` |
| La Poste | `phu:laposte` |
| Mondial Relay | `phu:mondialrelay` |
| NZ Post | `phu:nzpost` |
| Poste Italiane | `phu:posteitaliane` |
| UPS | `phu:ups-dlv` |
| USPS | `phu:usps` |
| Amazon Shipping | `phu:amazon-logo` |

The other 50 carriers use their existing logo in the scenes. Custom carriers use their
configured logo, or a plain brand-colour panel without text. Outside the SVG illustrations,
unmapped carriers keep the generic `mdi:package-variant-closed` icon. No local PR icons are
used or required. Pale PHU logo colours are darkened automatically for at least 3:1 contrast
on white; this follows the carrier's configured colour without per-carrier exceptions.

---

## Tested versions

| Integration | Tested version |
| ----------- | -------------- |
| ha-parcel-integrations/ha-postnl | 4.6.0 |
| ha-parcel-integrations/ha-dhl-nl | 2.6.0 |
| ha-parcel-integrations/ha-dpd | 2.7.0 |
| ha-parcel-integrations/ha-gls | 1.2.0 |
| ha-parcel-integrations/ha-dragonfly | — |
| ha-parcel-integrations/ha-trunkrs | — (early release) |
| ha-parcel-integrations/ha-cainiao | 0.9.0 (early release) |
| ha-parcel-integrations/ha-hermes | — (added 2026-07-23) |
| ha-parcel-integrations/ha-packeta | — (added 2026-07-29) |
| ha-parcel-integrations/ha-correos | — (added 2026-07-29) |
| ha-parcel-integrations/ha-vinted-go | — (added 2026-07-30) |
| ha-parcel-integrations/ha-postnord | — (added 2026-08-05) |
| ha-parcel-integrations/ha-sameday | — (added 2026-08-05) |
| ha-parcel-integrations/ha-swiss-post | — (added 2026-08-05) |
| ha-parcel-integrations/ha-planzer | — (added 2026-08-05) |
| ha-parcel-integrations/ha-oesterreichische-post | — (added 2026-08-05) |
| ha-parcel-integrations/ha-helthjem | — (added 2026-08-05) |
| ha-parcel-integrations/ha-dynalogic | — (added 2026-08-05) |
| ha-parcel-integrations/ha-budbee | — (added 2026-08-05) |
| ha-parcel-integrations/ha-nova-post | — (added 2026-08-10) |
| ha-parcel-integrations/ha-delhivery | — (added 2026-08-10) |
| ha-parcel-integrations/ha-sunyou | 0.9.0 (added 2026-08-07) |
