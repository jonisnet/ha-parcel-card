# Examples

## PostNL only — minimal

```yaml
type: custom:ha-parcel-card
title: PostNL
carriers:
  - type: postnl
    user: my_account
```

---

## PostNL with letters tab

```yaml
type: custom:ha-parcel-card
title: PostNL
show_letters: true
carriers:
  - type: postnl
    user: my_account
```

---

## Every carrier at once

```yaml
type: custom:ha-parcel-card
title: Alle pakketten
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

With this many carriers, the combo banner (and the carrier overview popup when you click a logo in it) becomes the fastest way to check on a specific carrier without paging through every tab.

---

## Account-less carriers with add-parcel enabled

```yaml
type: custom:ha-parcel-card
title: Losse pakketten
show_add_parcel: true
carriers:
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

---

## Active deliveries only (no history)

```yaml
type: custom:ha-parcel-card
title: Onderweg
show_delivered: false
show_sent: false
show_letters: false
carriers:
  - type: postnl
    user: my_account
  - type: dhl
    user: my_account
```

---

## History card (no animation, compact)

```yaml
type: custom:ha-parcel-card
title: Ontvangen
days_back: 14
show_animation: false
show_placeholder: false
show_header: true
carriers:
  - type: postnl
    user: my_account
```

---

## Custom appearance

```yaml
type: custom:ha-parcel-card
title: Pakketjes
header_color: "#1a1a2e"
header_text_color: "#ffffff"
carriers:
  - type: postnl
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
type: custom:ha-parcel-card
title: PostNL
carriers:
  - type: postnl
    user: ""
```

---

## Manual sensor override

When sensor entity IDs differ from the automatic pattern:

```yaml
type: custom:ha-parcel-card
title: PostNL
carriers:
  - type: postnl
    user: ""
    entity_incoming: sensor.postnl_parcels_inbound
    entity_delivered: sensor.postnl_parcels_delivered
    entity_letters: sensor.postnl_mail
```
