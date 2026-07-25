# Installation

## Via HACS (recommended)

1. In Home Assistant go to **HACS → Dashboard → ⋮ → Custom repositories**
2. Add `https://github.com/jonisnet/hki-parcels-card` as category **Dashboard**
3. Search for **HKI Parcels Card** and install
4. Restart Home Assistant or do a hard refresh (Ctrl+Shift+R)

---

## Manual

1. Download `hki-parcels-card.js` from the [latest release](https://github.com/jonisnet/hki-parcels-card/releases/latest)
2. Place the file at `/config/www/hki-parcels-card.js`
3. Go to **Settings → Dashboards → Resources** and add:

```
/local/hki-parcels-card.js
```

Select type: **JavaScript module**

4. Clear your browser cache (Ctrl+Shift+R / Cmd+Shift+R)

---

## Required integrations

Install the integration for each carrier you use **before** adding the card. All of them are part of the [ha-parcel-integrations](https://github.com/ha-parcel-integrations) family, publishing the same canonical parcel format — which is what lets one card support all of them.

!!! note "About the links below"
    Several of these integrations started as personal repos (`peternijssen/ha-*`, `HummelsTech/ha-dragonfly`) and were later moved into the `ha-parcel-integrations` org to be maintained together. The org repos are the actively maintained ones and are generally ahead in version — this documentation and the card's own "integration not found" links point there instead of the old personal forks.

### PostNL

The card supports three PostNL variants.

| Label | Card type | Integration | When to use |
| ----- | --------- | ----------- | ----------- |
| **PostNL** | `postnl_v4` | [ha-parcel-integrations/ha-postnl](https://github.com/ha-parcel-integrations/ha-postnl) ≥ 4.0.0 | **Recommended** — new installs and upgrades |
| **PostNL (<v4.x)** | `postnl` | [ha-parcel-integrations/ha-postnl](https://github.com/ha-parcel-integrations/ha-postnl) ≤ 3.x | Still on version 3.x |
| **PostNL (ArjenBos)** | `postnl_legacy` | [arjenbos/ha-postnl](https://github.com/arjenbos/ha-postnl) | Single-entity legacy mode |

!!! tip "Upgrading from ha-postnl v3 to v4?"
    Change the card type from `postnl` to `postnl_v4`. Your sensor entity IDs stay the same.

!!! warning "Deprecation notice"
    **PostNL (<v4.x)** will no longer be supported starting from HKI Parcels Card v2.0 — upgrade to `ha-postnl` ≥ 4.0.0 and switch the card type to `postnl_v4` before then.

    **PostNL (ArjenBos)** will also be removed starting from v2.0, unless [arjenbos/ha-postnl](https://github.com/arjenbos/ha-postnl) receives an update of its own before that point.

### DHL, DPD and GLS

| Carrier | Integration |
| ------- | ----------- |
| **DHL** | [ha-parcel-integrations/ha-dhl-nl](https://github.com/ha-parcel-integrations/ha-dhl-nl) |
| **DPD** | [ha-parcel-integrations/ha-dpd](https://github.com/ha-parcel-integrations/ha-dpd) |
| **GLS** | [ha-parcel-integrations/ha-gls](https://github.com/ha-parcel-integrations/ha-gls) |

!!! note "GLS has no sender/account"
    You track parcels by tracking number and postal code, not a login. The card's `user` field maps to the hub's postal code (e.g. `1234ab`), and the Sent tab is not available for this carrier.

### Dragonfly, Trunkrs, Cainiao and Hermes

These four, together with GLS above, are the "account-less" carriers in the family: instead of logging into an account, you register individual parcels by tracking number (plus a postal code for GLS and Trunkrs). None of them have a Sent tab, since there's no sender/account concept to distinguish outgoing parcels.

| Carrier | Integration | Identified by |
| ------- | ----------- | ------------- |
| **Dragonfly** | [ha-parcel-integrations/ha-dragonfly](https://github.com/ha-parcel-integrations/ha-dragonfly) | Track & Trace code only — no account, no postal code |
| **Trunkrs** | [ha-parcel-integrations/ha-trunkrs](https://github.com/ha-parcel-integrations/ha-trunkrs) | Trunkrs number + postal code (one hub per postal code) |
| **Cainiao** | [ha-parcel-integrations/ha-cainiao](https://github.com/ha-parcel-integrations/ha-cainiao) | Tracking number only — cross-border parcels (AliExpress, Temu, Shein, ...) that haven't reached a local carrier yet |
| **Hermes** | [ha-parcel-integrations/ha-hermes](https://github.com/ha-parcel-integrations/ha-hermes) | 14-digit tracking code only — no account, no postal code. Germany ("Hermes Paket" / myhermes.de) |

!!! info "Dragonfly's original integration"
    Dragonfly support was created by [Alwin Hummels (@HummelsTech)](https://github.com/HummelsTech), who maintains it standalone at [HummelsTech/ha-dragonfly](https://github.com/HummelsTech/ha-dragonfly) as well as the mirror in ha-parcel-integrations linked above — either one works with this card. These docs default to the ha-parcel-integrations link to keep every integration under one roof, but the original repo is just as valid a choice, and updates may land there first.

!!! warning "Trunkrs is an early release"
    The integration only recognises the `SHIPMENT_DELIVERED` status so far; every other state currently shows as `unknown` rather than guessing. It will improve as more statuses get mapped upstream.

For all five of these, the card's "+ Add parcel" control can register a new parcel directly from the dashboard by calling the integration's own `track_parcel` service — no need to open the integration's own Configure dialog. See [Add parcel support](card/overview.md#add-parcel-support) for why PostNL/DHL/DPD don't have this control.

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
| Hermes | ❌ not available yet |

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
