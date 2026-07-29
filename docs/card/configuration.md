# Configuration

## Card options

These options apply to the card as a whole.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `title` | string | `Parcels` | Title shown in the card header |
| `days_back` | number | `90`* | Days to keep delivered parcels visible |
| `show_delivered` | boolean | `true` | Show the Delivered tab |
| `show_sent` | boolean | `true` | Show the Sent tab |
| `show_letters` | boolean | `true` | Show the Letters tab (PostNL only) |
| `show_animation` | boolean | `true` | Show the van animation when a parcel is selected |
| `show_header` | boolean | `true` | Show the header with title and statistics |
| `show_placeholder` | boolean | `true` | Show the background image when no parcel is selected |
| `header_color` | string | _(theme)_ | Header background colour |
| `header_text_color` | string | _(theme)_ | Header text colour |
| `placeholder_image` | string | _(built-in)_ | URL to a custom background image. Overrides the automatic combo banner — set to a fixed picture if you'd rather always show the same image |
| `show_add_parcel` | boolean | `true` | Show the "+ Add parcel" control at the bottom of the card (only appears when at least one configured carrier supports it — GLS, Dragonfly, Trunkrs, Cainiao, Hermes, Packeta, Correos) |
| `show_raw_status` | boolean | `false` | Show the carrier's own raw status text (e.g. GLS's "Onderweg - geladen voor aflevering") as the main status message instead of the card's generic translated label ("In transit"). Falls back to the generic label when a parcel has no raw status |
| `layout_order` | list | `[header, animation, tabs, list]` | Order of card sections |
| `carriers` | list | — | **Required.** List of carrier configurations (see below) |

\* When the card is first added, `days_back` is pre-filled from your actual delivered-parcel history (the oldest delivered parcel currently visible, across every detected carrier) instead of the flat `90`. This is a one-time default, not a live setting.

---

## Carrier options

Each entry in the `carriers` list supports the following options.

### Common options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `type` | string | — | **Required.** Carrier type (see [Carrier types](#carrier-types)) |
| `user` | string | `""` | Account part of the sensor name (omit for prefix-free sensors, or use a postal code for GLS/Trunkrs). The card detects the correct naming scheme automatically — see [Sensor naming](#sensor-naming) |
| `name` | string | _(carrier label)_ | Display name for this carrier |
| `icon` | string | _(carrier icon)_ | Icon for this carrier (`mdi:` or `phu:` prefix) |
| `color` | string | _(carrier colour)_ | Accent colour for this carrier |
| `logo_path` | string | _(carrier logo)_ | URL to a custom logo image (use the Browse button in the editor to pick from the media library) |
| `van_path` | string | _(carrier van GIF)_ | URL to a custom van animation |
| `banner_path` | string | _(carrier banner)_ | URL to a custom banner image (use the Browse button in the editor to pick from the media library) |
| `show_tracking_link` | boolean | `true` | Show the "Open Tracking" button in the detail panel |

### Sensor overrides

Normally the card generates sensor entity IDs automatically from `type` and `user`. Use these only if your sensor names differ.

| Option | Type | Description |
| ------ | ---- | ----------- |
| `entity_incoming` | string | Sensor for incoming parcels in transit |
| `entity_delivered` | string | Sensor for delivered incoming parcels |
| `entity_outgoing` | string | Sensor for outgoing parcels in transit (not applicable for GLS, Dragonfly, Trunkrs, Cainiao, Hermes, Packeta, Correos) |
| `entity_outgoing_delivered` | string | Sensor for delivered outgoing parcels (not applicable for GLS, Dragonfly, Trunkrs, Cainiao, Hermes, Packeta, Correos) |
| `entity_letters` | string | Sensor for PostNL letterbox mail (PostNL only) |

### PostNL (ArjenBos) options

When `type: postnl_legacy` these options apply instead.

| Option | Type | Description |
| ------ | ---- | ----------- |
| `entity` | string | **Required.** Combined PostNL delivery sensor |
| `distribution_entity` | string | Optional. PostNL distribution (sent) sensor |

---

## Carrier types

| Type | Label in editor | Integration | Schema | Letters | Add parcel from card |
| ---- | ---------------- | ----------- | ------ | :-----: | :-------------------: |
| `postnl_v4` | PostNL | ha-parcel-integrations/ha-postnl ≥ 4.0.0 | canonical | ✅ | — |
| `postnl` | PostNL (<v4.x) | ha-parcel-integrations/ha-postnl ≤ 3.x | legacy | ✅ | — |
| `dhl` | DHL | ha-parcel-integrations/ha-dhl-nl | canonical | — | — |
| `dpd` | DPD | ha-parcel-integrations/ha-dpd | canonical | — | — |
| `gls` | GLS | ha-parcel-integrations/ha-gls | canonical | — | ✅ |
| `dragonfly` | Dragonfly | ha-parcel-integrations/ha-dragonfly | canonical | — | ✅ |
| `trunkrs` | Trunkrs | ha-parcel-integrations/ha-trunkrs | canonical | — | ✅ |
| `cainiao` | Cainiao | ha-parcel-integrations/ha-cainiao | canonical | — | ✅ |
| `hermes` | Hermes | ha-parcel-integrations/ha-hermes | canonical | — | ✅ |
| `packeta` | Packeta | ha-parcel-integrations/ha-packeta | canonical | — | ✅ |
| `correos` | Correos | ha-parcel-integrations/ha-correos | canonical | — | ✅ |
| `postnl_legacy` | PostNL (ArjenBos) | arjenbos/ha-postnl | single_entity | — | — |
| `custom` | Custom | any | canonical | — | — |

!!! tip "Which PostNL type should I use?"
    Use `postnl_v4` ("PostNL") for new installations or if you have updated to ha-postnl 4.0.0 or later.
    Use `postnl` ("PostNL (<v4.x)") if you are still on version 3.x.
    Use `postnl_legacy` ("PostNL (ArjenBos)") only for the arjenbos/ha-postnl integration.

!!! warning "Deprecation notice"
    **PostNL (<v4.x)** will no longer be supported starting from HKI Parcels Card v2.0. **PostNL (ArjenBos)** will also be removed from v2.0, unless arjenbos updates that integration before then. See [Installation](../installation.md#postnl) for details.

!!! note
    `gls`, `dragonfly`, `trunkrs`, `cainiao`, `hermes`, `packeta` and `correos` have no Sent tab — these carriers track parcels by number (plus postal code for GLS/Trunkrs) with no sender/account concept, so `entity_outgoing` and `entity_outgoing_delivered` are not applicable. See [Add parcel support](overview.md#add-parcel-support) for why only these seven carriers get the "+ Add parcel" control.

---

## Sensor naming

The `user` field is the account part of the sensor name. The card builds all entity IDs automatically and supports both naming schemes used by the supported integrations:

| Scheme | Example |
| ------ | ------- |
| `sensor.<user>_<carrier>_*` | PostNL, DHL — `sensor.my_account_postnl_incoming_parcels` |
| `sensor.<carrier>_<user>_*` | DPD, GLS, Trunkrs — `sensor.dpd_my_account_binnenkomende_pakketten`, `sensor.gls_1234ab_incoming_parcels`, `sensor.trunkrs_1234ab_incoming_parcels` |
| `sensor.<carrier>_*` (no prefix) | Dragonfly, Cainiao, Hermes, Packeta, Correos — `sensor.dragonfly_incoming_parcels`, `sensor.cainiao_incoming_parcels`, `sensor.hermes_incoming_parcels`, `sensor.packeta_incoming_parcels`, `sensor.correos_incoming_parcels` |

The correct scheme is detected automatically. Leave `user` empty if your sensors have no account prefix, or for any Dragonfly/Cainiao/Hermes/Packeta/Correos sensor — those five have no account or postal code at all.

---

## Full configuration example

```yaml
type: custom:hki-parcels-card
title: Parcels
days_back: 90
show_delivered: true
show_sent: true
show_letters: true
show_animation: true
show_header: true
show_placeholder: true
show_add_parcel: true
show_raw_status: false
header_color: ""
header_text_color: ""
placeholder_image: ""
layout_order:
  - header
  - animation
  - tabs
  - list
carriers:
  - type: postnl_v4
    user: my_account
    name: PostNL
    icon: phu:postnl
    color: "#ed8c00"
    logo_path: ""
    van_path: ""
    banner_path: ""
    show_tracking_link: true
    # Optional sensor overrides — normally not needed:
    entity_incoming: sensor.my_account_postnl_incoming_parcels
    entity_delivered: sensor.my_account_postnl_delivered_parcels
    entity_outgoing: sensor.my_account_postnl_outgoing_parcels
    entity_outgoing_delivered: sensor.my_account_postnl_outgoing_delivered_parcels
    entity_letters: sensor.my_account_postnl_letters
  - type: dhl
    user: my_account
  - type: dpd
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
```
