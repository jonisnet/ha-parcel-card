# Basic Usage

## Minimal example

The quickest way to add the card is to specify a carrier type and account name. The card automatically generates all required sensor entity IDs.

```yaml
type: custom:hki-parcels-card
title: My Parcels
carriers:
  - type: postnl_v4
    user: my_account
```

The `user` field is the account part of your sensor name. For example, if your sensor is `sensor.john_postnl_incoming_parcels`, use `user: john`.

!!! tip
    If your sensors have no username prefix (e.g. `sensor.postnl_incoming_parcels`), leave `user` empty or omit it entirely.

---

## Multiple carriers

```yaml
type: custom:hki-parcels-card
title: Parcels
carriers:
  - type: postnl_v4
    user: my_account
  - type: dhl
    user: my_account
  - type: dpd
    user: my_account
```

With two or more carriers configured, the card automatically builds a combo banner from the logos of only the carriers you've actually added — no configuration needed.

---

## Vinted Go (incoming and outgoing)

```yaml
type: custom:hki-parcels-card
title: Parcels
carriers:
  - type: vinted_go
    user: my_account
```

Like PostNL/DHL/DPD, Vinted Go is account-based (login is an e-mail address plus a verification link, no password) — every parcel tied to the account appears automatically, so there's no `track_parcel` service and no "+ Add parcel" control for it. Unlike PostNL/DHL/DPD, Vinted Go tracks both incoming *and* outgoing parcels, and there's no `next_delivery`/ETA sensor for it at all.

---

## Account-less carriers (GLS, Dragonfly, Trunkrs, Cainiao, Hermes, Packeta, Correos, PostNord, Sameday, Swiss Post, Planzer, Austrian Post, Helthjem, Dynalogic, Budbee, Nova Post, Delhivery, SunYou)

These carriers have no login — GLS and Trunkrs use a postal code, the rest use nothing but the tracking number itself:

```yaml
type: custom:hki-parcels-card
title: Parcels
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

Since there's no account to auto-sync from, each of these carriers shows a "+ Add parcel" control on the card so you can register a tracking number directly. Disable it per-card with `show_add_parcel: false`.

---

## PostNL with letters

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_v4
    user: my_account
show_letters: true
```

---

## PostNL (ArjenBos) / legacy single-entity mode

```yaml
type: custom:hki-parcels-card
title: PostNL
carriers:
  - type: postnl_legacy
    entity: sensor.postnl_delivery
    distribution_entity: sensor.postnl_distribution
```

---

## Customized appearance

```yaml
type: custom:hki-parcels-card
title: My Parcels
days_back: 30
header_color: "#1a1a2e"
header_text_color: "#ffffff"
show_animation: true
show_placeholder: true
carriers:
  - type: postnl_v4
    user: my_account
    name: PostNL
    color: "#ed8c00"
```
