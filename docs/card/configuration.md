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
| `show_add_parcel` | boolean | `true` | Show the "+ Add parcel" control at the bottom of the card (only appears when at least one configured carrier's integration has a `track_parcel` service — see [Carrier types](#carrier-types)) |
| `show_raw_status` | boolean | `false` | Show the carrier's own raw status text (e.g. GLS's "Onderweg - geladen voor aflevering") as the main status message instead of the card's generic translated label ("In transit"). Falls back to the generic label when a parcel has no raw status |
| `custom_name_scope` | string | `everyone` | Show a "+ Add name" control in each parcel's detail panel, letting you give it a short custom label (e.g. "Birthday gift") instead of just a tracking code. `off` hides the control entirely; `device` saves names in this browser only; `me` saves them to your Home Assistant account (synced across your own devices); `everyone` saves them instance-wide for every user to see. See the note below |
| `sort_order` | string | `auto` | `auto` (recommended) shows the soonest-arriving parcel first in In Transit and Sent, and the most recently delivered parcel first in Delivered. `newest_first`/`oldest_first` pin one direction everywhere instead. See the note below |
| `group_by_carrier` | boolean | `true` | Group parcels into per-carrier sections. Set to `false` for one flat list sorted purely by `sort_order`, interleaving carriers directly instead of showing all of one carrier's parcels before the next |
| `layout_order` | list | `[header, animation, tabs, list]` | Order of card sections |
| `carriers` | list | — | **Required.** List of carrier configurations (see below) |

\* When the card is first added, `days_back` is pre-filled from your actual delivered-parcel history (the oldest delivered parcel currently visible, across every detected carrier) when that is longer than `90`; it never goes below `90`. This is a one-time default, not a live setting. `days_back` applies to delivered parcels only — the Letters tab always shows every letter the integration reports.

!!! note "Custom parcel names: three scopes"
    There's no backend to write a custom name into an integration's own sensor data, and a live dashboard card can't persist into its own stored YAML config either (only the editor can, while you're editing the dashboard) — so this has to live somewhere else:

    - `custom_name_scope: device` saves names in the browser's local storage. Simple, but a name you set on your phone won't show up on a tablet or another device — each browser keeps its own labels.
    - `custom_name_scope: me` saves names to Home Assistant's own per-user storage instead (the same mechanism HA's own frontend uses for small preferences), via the `frontend/get_user_data`/`frontend/set_user_data` websocket calls. That's server-side, so it's the same for every device signed in with *your* HA account — but a different HA user on the same instance won't see it.
    - `custom_name_scope: everyone` (the default) saves names instance-wide, via Home Assistant's `frontend/get_system_data`/`set_system_data`/`subscribe_system_data` websocket calls — visible to every user of this Home Assistant instance, with live updates (no refresh needed to see a name someone else just added). Reading is open to everyone, but **adding or editing a name requires an administrator account** — HA enforces that server-side. Non-admin users still see existing shared names, just without the "+ Add name"/edit controls. This also needs a reasonably recent Home Assistant core (the system-data API landed in HA core ~2025.12); on an older core it degrades to showing no shared names rather than erroring.
    - `custom_name_scope: off` hides the control entirely.

    Switching between scopes starts with a blank set of names for the new scope — the stores aren't merged or migrated automatically. `shared` is still accepted as a legacy alias for `me`, from before this option split into `me` and `everyone`.

!!! note "Parcel order and grouping"
    By default (`sort_order: auto`, `group_by_carrier: true`) In Transit and Sent show the parcel arriving soonest first *within* each carrier's own section, and the carrier whose next parcel is soonest gets its section shown first — the sections aren't in a fixed order. Delivered shows the most recently delivered parcel first. Set `group_by_carrier: false` for one flat, ungrouped list instead — parcels from different carriers then interleave directly by date (e.g. a PostNL parcel, then two DHL parcels, then three more PostNL parcels, purely in delivery-time order) rather than being grouped into contiguous per-carrier sections. `sort_order: newest_first`/`oldest_first` override the automatic soonest/most-recent split and pin one fixed direction across every tab.

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
| `entity_outgoing` | string | Sensor for outgoing parcels in transit (only for carriers with a Sent tab — see [Carrier types](#carrier-types)) |
| `entity_outgoing_delivered` | string | Sensor for delivered outgoing parcels (only for carriers with a Sent tab — see [Carrier types](#carrier-types)) |
| `entity_letters` | string | Sensor for PostNL letterbox mail (PostNL only) |

---

## Carrier types

| Type | Label in editor | Integration | Letters | Sent tab | Add parcel from card |
| ---- | ---------------- | ----------- | :-----: | :------: | :-------------------: |
| `fourpx` | 4PX | [ha-parcel-integrations/ha-4px](https://github.com/ha-parcel-integrations/ha-4px) | — | — | ✅ |
| `airmee` | Airmee | [ha-parcel-integrations/ha-airmee](https://github.com/ha-parcel-integrations/ha-airmee) | — | — | ✅ |
| `amazon_orders` | Amazon | [ha-parcel-integrations/ha-amazon](https://github.com/ha-parcel-integrations/ha-amazon) | — | — | — |
| `ampere` | Ampère | [ha-parcel-integrations/ha-ampere](https://github.com/ha-parcel-integrations/ha-ampere) | — | — | — |
| `an_post` | An Post | [ha-parcel-integrations/ha-an-post](https://github.com/ha-parcel-integrations/ha-an-post) | — | — | ✅ |
| `apple_express` | Apple Express | [ha-parcel-integrations/ha-apple-express](https://github.com/ha-parcel-integrations/ha-apple-express) | — | — | ✅ |
| `aramex` | Aramex | [ha-parcel-integrations/ha-aramex](https://github.com/ha-parcel-integrations/ha-aramex) | — | — | ✅ |
| `austrian_post` | Austrian Post | [ha-parcel-integrations/ha-oesterreichische-post](https://github.com/ha-parcel-integrations/ha-oesterreichische-post) | — | — | ✅ |
| `better_trucks` | Better Trucks | [ha-parcel-integrations/ha-better-trucks](https://github.com/ha-parcel-integrations/ha-better-trucks) | — | — | ✅ |
| `boxnow` | BoxNow | [ha-parcel-integrations/ha-boxnow](https://github.com/ha-parcel-integrations/ha-boxnow) | — | — | ✅ |
| `bpost` | bpost | [ha-parcel-integrations/ha-bpost](https://github.com/ha-parcel-integrations/ha-bpost) | ✅ | ✅ | ✅ |
| `budbee` | Budbee | [ha-parcel-integrations/ha-budbee](https://github.com/ha-parcel-integrations/ha-budbee) | — | ✅ | ✅ |
| `cainiao` | Cainiao | [ha-parcel-integrations/ha-cainiao](https://github.com/ha-parcel-integrations/ha-cainiao) | — | — | ✅ |
| `canada_post` | Canada Post | [ha-parcel-integrations/ha-canada-post](https://github.com/ha-parcel-integrations/ha-canada-post) | — | — | ✅ |
| `canpar` | Canpar | [ha-parcel-integrations/ha-canpar](https://github.com/ha-parcel-integrations/ha-canpar) | — | — | ✅ |
| `ceska_posta` | Ceska Posta | [ha-parcel-integrations/ha-ceska-posta](https://github.com/ha-parcel-integrations/ha-ceska-posta) | — | — | ✅ |
| `correos` | Correos | [ha-parcel-integrations/ha-correos](https://github.com/ha-parcel-integrations/ha-correos) | — | — | ✅ |
| `ctt` | CTT | [ha-parcel-integrations/ha-ctt](https://github.com/ha-parcel-integrations/ha-ctt) | — | — | ✅ |
| `dao` | DAO | [ha-parcel-integrations/ha-dao](https://github.com/ha-parcel-integrations/ha-dao) | — | ✅ | — |
| `delhivery` | Delhivery | [ha-parcel-integrations/ha-delhivery](https://github.com/ha-parcel-integrations/ha-delhivery) | — | — | ✅ |
| `dhl_global` | DHL | [ha-parcel-integrations/ha-dhl](https://github.com/ha-parcel-integrations/ha-dhl) | — | ✅ | ✅ |
| `dhl` | DHL NL | [ha-parcel-integrations/ha-dhl-nl](https://github.com/ha-parcel-integrations/ha-dhl-nl) | — | ✅ | — |
| `dpd` | DPD | [ha-parcel-integrations/ha-dpd](https://github.com/ha-parcel-integrations/ha-dpd) | — | ✅ | — |
| `dragonfly` | Dragonfly | [ha-parcel-integrations/ha-dragonfly](https://github.com/ha-parcel-integrations/ha-dragonfly) | — | — | ✅ |
| `dynalogic` | Dynalogic | [ha-parcel-integrations/ha-dynalogic](https://github.com/ha-parcel-integrations/ha-dynalogic) | — | — | ✅ |
| `econt` | Econt | [ha-parcel-integrations/ha-econt](https://github.com/ha-parcel-integrations/ha-econt) | — | — | ✅ |
| `elta_courier` | ELTA Courier | [ha-parcel-integrations/ha-elta-courier](https://github.com/ha-parcel-integrations/ha-elta-courier) | — | — | ✅ |
| `evri` | Evri | [ha-parcel-integrations/ha-evri](https://github.com/ha-parcel-integrations/ha-evri) | — | ✅ | ✅ |
| `fan_courier` | FAN Courier | [ha-parcel-integrations/ha-fan-courier](https://github.com/ha-parcel-integrations/ha-fan-courier) | — | — | ✅ |
| `fedex` | FedEx | [ha-parcel-integrations/ha-fedex](https://github.com/ha-parcel-integrations/ha-fedex) | — | — | ✅ |
| `gls` | GLS | [ha-parcel-integrations/ha-gls](https://github.com/ha-parcel-integrations/ha-gls) | — | — | ✅ |
| `gofo` | GOFO Express | [ha-parcel-integrations/ha-gofo](https://github.com/ha-parcel-integrations/ha-gofo) | — | — | ✅ |
| `helthjem` | Helthjem | [ha-parcel-integrations/ha-helthjem](https://github.com/ha-parcel-integrations/ha-helthjem) | — | — | ✅ |
| `hermes` | Hermes | [ha-parcel-integrations/ha-hermes](https://github.com/ha-parcel-integrations/ha-hermes) | — | — | ✅ |
| `ics_courier` | ICS Courier | [ha-parcel-integrations/ha-ics-courier](https://github.com/ha-parcel-integrations/ha-ics-courier) | — | — | ✅ |
| `inpost` | InPost | [ha-parcel-integrations/ha-inpost](https://github.com/ha-parcel-integrations/ha-inpost) | — | — | ✅ |
| `laposte` | La Poste | [ha-parcel-integrations/ha-laposte](https://github.com/ha-parcel-integrations/ha-laposte) | — | — | ✅ |
| `matkahuolto` | Matkahuolto | [ha-parcel-integrations/ha-matkahuolto](https://github.com/ha-parcel-integrations/ha-matkahuolto) | — | — | ✅ |
| `mondial_relay` | Mondial Relay | [ha-parcel-integrations/ha-mondial-relay](https://github.com/ha-parcel-integrations/ha-mondial-relay) | — | ✅ | — |
| `nova_post` | Nova Post | [ha-parcel-integrations/ha-nova-post](https://github.com/ha-parcel-integrations/ha-nova-post) | — | — | ✅ |
| `nz_post` | NZ Post | [ha-parcel-integrations/ha-nz-post](https://github.com/ha-parcel-integrations/ha-nz-post) | — | — | ✅ |
| `ontrac` | OnTrac | [ha-parcel-integrations/ha-ontrac](https://github.com/ha-parcel-integrations/ha-ontrac) | — | — | ✅ |
| `orlen_paczka` | ORLEN Paczka | [ha-parcel-integrations/ha-orlen-paczka](https://github.com/ha-parcel-integrations/ha-orlen-paczka) | — | — | ✅ |
| `paack` | Paack | [ha-parcel-integrations/ha-paack](https://github.com/ha-parcel-integrations/ha-paack) | — | — | ✅ |
| `packeta` | Packeta | [ha-parcel-integrations/ha-packeta](https://github.com/ha-parcel-integrations/ha-packeta) | — | ✅ | ✅ |
| `planzer` | Planzer | [ha-parcel-integrations/ha-planzer](https://github.com/ha-parcel-integrations/ha-planzer) | — | — | ✅ |
| `poczta_polska` | Poczta Polska | [ha-parcel-integrations/ha-poczta-polska](https://github.com/ha-parcel-integrations/ha-poczta-polska) | — | — | ✅ |
| `poste_italiane` | Poste Italiane | [ha-parcel-integrations/ha-poste-italiane](https://github.com/ha-parcel-integrations/ha-poste-italiane) | — | — | ✅ |
| `posten_bring` | Posten Bring | [ha-parcel-integrations/ha-posten-bring](https://github.com/ha-parcel-integrations/ha-posten-bring) | — | ✅ | — |
| `posti` | Posti | [ha-parcel-integrations/ha-posti](https://github.com/ha-parcel-integrations/ha-posti) | — | — | ✅ |
| `postnl` | PostNL | [ha-parcel-integrations/ha-postnl](https://github.com/ha-parcel-integrations/ha-postnl) | ✅ | ✅ | — |
| `postnord` | PostNord | [ha-parcel-integrations/ha-postnord](https://github.com/ha-parcel-integrations/ha-postnord) | — | ✅ | ✅ |
| `ppl_cz` | PPL CZ | [ha-parcel-integrations/ha-ppl-cz](https://github.com/ha-parcel-integrations/ha-ppl-cz) | — | ✅ | — |
| `purolator` | Purolator | [ha-parcel-integrations/ha-purolator](https://github.com/ha-parcel-integrations/ha-purolator) | — | ✅ | ✅ |
| `quickpac` | Quickpac | [ha-parcel-integrations/ha-quickpac](https://github.com/ha-parcel-integrations/ha-quickpac) | — | — | ✅ |
| `sameday` | Sameday | [ha-parcel-integrations/ha-sameday](https://github.com/ha-parcel-integrations/ha-sameday) | — | — | ✅ |
| `seur` | SEUR | [ha-parcel-integrations/ha-seur](https://github.com/ha-parcel-integrations/ha-seur) | — | ✅ | — |
| `shopee_xpress` | Shopee Xpress | [ha-parcel-integrations/ha-shopee-xpress](https://github.com/ha-parcel-integrations/ha-shopee-xpress) | — | — | ✅ |
| `slovak_parcel_service` | Slovak Parcel Service | [ha-parcel-integrations/ha-slovak-parcel-service](https://github.com/ha-parcel-integrations/ha-slovak-parcel-service) | — | — | ✅ |
| `slovenska_posta` | Slovenská Pošta | [ha-parcel-integrations/ha-slovenska-posta](https://github.com/ha-parcel-integrations/ha-slovenska-posta) | — | — | ✅ |
| `speedx` | SpeedX | [ha-parcel-integrations/ha-speedx](https://github.com/ha-parcel-integrations/ha-speedx) | — | — | ✅ |
| `sunyou` | SunYou | [ha-parcel-integrations/ha-sunyou](https://github.com/ha-parcel-integrations/ha-sunyou) | — | — | ✅ |
| `swiss_post` | Swiss Post | [ha-parcel-integrations/ha-swiss-post](https://github.com/ha-parcel-integrations/ha-swiss-post) | — | ✅ | ✅ |
| `trunkrs` | Trunkrs | [ha-parcel-integrations/ha-trunkrs](https://github.com/ha-parcel-integrations/ha-trunkrs) | — | — | ✅ |
| `uniuni` | UniUni | [ha-parcel-integrations/ha-uniuni](https://github.com/ha-parcel-integrations/ha-uniuni) | — | — | ✅ |
| `ups` | UPS | [ha-parcel-integrations/ha-ups](https://github.com/ha-parcel-integrations/ha-ups) | — | — | ✅ |
| `usps` | USPS | [ha-parcel-integrations/ha-usps](https://github.com/ha-parcel-integrations/ha-usps) | — | — | ✅ |
| `vinted_go` | Vinted Go | [ha-parcel-integrations/ha-vinted-go](https://github.com/ha-parcel-integrations/ha-vinted-go) | — | ✅ | — |
| `custom` | Custom | any integration following [the contract](../contract.md) | — | ✅ | — |

!!! note "PostNL (<v4.x) and PostNL (ArjenBos) removed"
    Both were removed in this v2.0 release, as announced ahead of time — see [Installation](../installation.md#postnl). The stable [hki-parcels-card](https://github.com/jonisnet/hki-parcels-card) v1.x line still supports both.

!!! note "Generated from the card itself"
    This table lists every carrier type the card knows, with each capability read from the carrier's own integration: **Sent tab** when it has an `outgoing_parcels` sensor, **Add parcel from card** when it has a `track_parcel` service, **Letters** for PostNL's MyMail and bpost's Mail Ahead. Carriers without a Sent tab ignore `entity_outgoing`/`entity_outgoing_delivered`.

!!! note "`dhl` vs `dhl_global`"
    `dhl` is **DHL NL** ([ha-dhl-nl](https://github.com/ha-parcel-integrations/ha-dhl-nl)) and keeps its type name so existing cards keep working. `dhl_global` is the separate [ha-dhl](https://github.com/ha-parcel-integrations/ha-dhl) integration (DHL Paket Germany, DHL Parcel Poland, DHL Express and DHL's wider network by tracking code). Both create `sensor.dhl_*` entities; the card tells them apart through Home Assistant's entity registry.

---

## Sensor naming

The `user` field is the account part of the sensor name. The card builds all entity IDs automatically and supports both naming schemes used by the supported integrations:

| Scheme | Example |
| ------ | ------- |
| `sensor.<user>_<carrier>_*` | PostNL, DHL — `sensor.my_account_postnl_incoming_parcels` |
| `sensor.<carrier>_<user>_*` | DPD, Vinted Go, GLS, Trunkrs — `sensor.dpd_my_account_binnenkomende_pakketten`, `sensor.vinted_go_my_account_incoming_parcels`, `sensor.gls_1234ab_incoming_parcels`, `sensor.trunkrs_1234ab_incoming_parcels` |
| `sensor.<carrier>_*` (no prefix) | Most tracking-code carriers — `sensor.ups_incoming_parcels`, `sensor.dragonfly_incoming_parcels`, `sensor.oesterreichische_post_incoming_parcels` (Austrian Post) |

The correct scheme is detected automatically. Leave `user` empty if your sensors have no account prefix, or for a tracking-code carrier without a prefix — the editor's help text says which applies to the carrier you picked. On current Home Assistant versions the card matches sensors through the entity registry, so the exact entity_id rarely matters.

---

## Full configuration example

```yaml
type: custom:ha-parcel-card
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
  - type: postnl
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
```
