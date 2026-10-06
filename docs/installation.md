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

The other 67 carriers — DHL, DPD, UPS, FedEx, USPS, GLS, bpost, La Poste, Evri and the rest — are listed with a link to their integration under **[Carrier types](card/configuration.md#carrier-types)**, together with what each one supports (Sent tab, letters, "+ Add parcel").

Roughly, they come in three kinds:

- **Account login** (PostNL, DHL NL, DPD, Vinted Go, Amazon, SEUR, ...) — every parcel sent to or from your account appears automatically. If the integration has no `track_parcel` service, the card has no "+ Add parcel" control for it; it isn't needed.
- **Tracking code only** (UPS, FedEx, USPS, Cainiao, ...) — you register parcels one by one, from the card's "+ Add parcel" control or the integration's own Configure dialog. A few tie a parcel to a postal code (GLS, Trunkrs, Evri, Slovak Parcel Service); the card's `user` field is then that postal code.
- **Both** (bpost, DHL, An Post, Canada Post, Hermes, PostNord, Posti, Swiss Post, ...) — log in for automatic parcels, and/or add codes by hand.

!!! info "Dragonfly's original integration"
    Dragonfly support was created by [Alwin Hummels (@HummelsTech)](https://github.com/HummelsTech), who maintains it standalone at [HummelsTech/ha-dragonfly](https://github.com/HummelsTech/ha-dragonfly) as well as the mirror in ha-parcel-integrations — either one works with this card.

!!! note "`dhl` and `dhl_global` are different integrations"
    The card type `dhl` (shown as **DHL NL**) is [ha-dhl-nl](https://github.com/ha-parcel-integrations/ha-dhl-nl). `dhl_global` (shown as **DHL**) is [ha-dhl](https://github.com/ha-parcel-integrations/ha-dhl): DHL Paket Germany, DHL Parcel Poland, DHL Express and DHL's wider network by tracking code.

---

## Optional: PHU carrier icons

Install [custom-brand-icons](https://github.com/elax46/custom-brand-icons) via HACS to get branded `phu:` carrier icons. The card detects this automatically — no configuration needed.

Coverage varies by carrier:

| Carrier | PHU icon |
| ------- | :------: |
| PostNL | ✅ real logo |
| DHL | ✅ real logo |
| DPD | ✅ (basic placeholder-style artwork, not the official red DPD logo) |
| GLS | ✅ (plain "GLS" text mark, not the official logo) |
| Dragonfly | ✅ real logo |
| Trunkrs | ❌ not available yet |
| Cainiao | ❌ not available yet |
| Hermes | ✅ real logo |
| Packeta | ✅ real logo |
| Correos | ✅ real logo |
| Vinted Go | ❌ not available yet |
| PostNord | ❌ wordmark-only brand, no standalone icon mark exists |
| Sameday | ⏳ submitted upstream, pending merge ([#1435](https://github.com/elax46/custom-brand-icons/pull/1435)) |
| Swiss Post | ✅ real logo |
| Planzer | ❌ wordmark-only brand, no standalone icon mark exists |
| Austrian Post | ✅ real logo |
| Helthjem | ⏳ submitted upstream, pending merge ([#1435](https://github.com/elax46/custom-brand-icons/pull/1435)) |
| Dynalogic | ❌ wordmark-only brand, no standalone icon mark exists |
| Budbee | ⏳ submitted upstream, pending merge ([#1435](https://github.com/elax46/custom-brand-icons/pull/1435)) |
| Nova Post | ⏳ submitted upstream, pending merge ([#1435](https://github.com/elax46/custom-brand-icons/pull/1435)) |
| Delhivery | ❌ not available yet |
| SunYou | ✅ real logo |
| An Post | ✅ real logo |
| Quickpac | ❌ wordmark + plain accent dot, no standalone icon mark to extract |
| InPost | ✅ real logo |
| Every carrier added in 2026-10 | ❌ not yet — they use the integration's own icon in the banner meanwhile |

Carriers without a proper branded icon yet fall back to a generic `mdi:package-variant-closed` icon.

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
