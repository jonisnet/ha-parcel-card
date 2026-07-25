# Examples

## PostNL only — minimal

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_v4
    user: my_account
```

---

## PostNL with letters tab

```yaml
type: custom:hki-parcels-card
title: PostNL
show_letters: true
carriers:
  - type: postnl_v4
    user: my_account
```

---

## Every carrier at once

```yaml
type: custom:hki-parcels-card
title: Alle pakketten
carriers:
  - type: postnl_v4
    user: my_account
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
```

With this many carriers, the combo banner (and the carrier overview popup when you click a logo in it) becomes the fastest way to check on a specific carrier without paging through every tab.

---

## Account-less carriers with add-parcel enabled

```yaml
type: custom:hki-parcels-card
title: Losse pakketten
show_add_parcel: true
carriers:
  - type: gls
    user: "1234ab"
  - type: dragonfly
  - type: trunkrs
    user: "1234ab"
  - type: cainiao
```

---

## PostNL (arjenbos legacy mode)

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_legacy
    entity: sensor.postnl_delivery
    distribution_entity: sensor.postnl_distribution
```

---

## Active deliveries only (no history)

```yaml
type: custom:hki-parcels-card
title: Onderweg
show_delivered: false
show_sent: false
show_letters: false
carriers:
  - type: postnl_v4
    user: my_account
  - type: dhl
    user: my_account
```

---

## History card (no animation, compact)

```yaml
type: custom:hki-parcels-card
title: Ontvangen
days_back: 14
show_animation: false
show_placeholder: false
show_header: true
carriers:
  - type: postnl_v4
    user: my_account
```

---

## Custom appearance

```yaml
type: custom:hki-parcels-card
title: Pakketjes
header_color: "#1a1a2e"
header_text_color: "#ffffff"
carriers:
  - type: postnl_v4
    user: my_account
    name: PostNL
    color: "#ed8c00"
    logo_path: "https://example.com/my-logo.png"
    van_path: "https://example.com/my-van.gif"
```

---

## Sensors without a username prefix

For setups where sensors are named `sensor.postnl_incoming_parcels` (no `<user>_` prefix):

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_v4
    user: ""
```

---

## Manual sensor override

When sensor entity IDs differ from the automatic pattern:

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_v4
    user: ""
    entity_incoming: sensor.postnl_parcels_inbound
    entity_delivered: sensor.postnl_parcels_delivered
    entity_letters: sensor.postnl_mail
```
