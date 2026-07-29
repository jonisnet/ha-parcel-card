# HKI Parcels Card

**Track parcels from PostNL, DHL, DPD, GLS, Dragonfly, Trunkrs, Cainiao, Hermes, Packeta and Correos in a single Home Assistant card.**

Automatic sensor detection, animated banners, a 4-step delivery tracker, letterbox mail with scan images, a carrier overview popup, and a complete visual editor — no YAML required.

![Dashboard screenshot](images/screenshot-dashboard.png)

<div class="grid cards" markdown>

-   :package:{ .lg .middle } **Multi-carrier**

    ---

    PostNL, DHL, DPD, GLS, Dragonfly, Trunkrs, Cainiao, Hermes, Packeta and Correos side by side. Add the same carrier multiple times for multiple accounts or hubs.

-   :magic_wand:{ .lg .middle } **Auto sensor detection**

    ---

    Enter your account name — the card finds your sensors and fills in all entity IDs automatically, for both known naming schemes.

-   :bell:{ .lg .middle } **Carrier overview popup**

    ---

    Click a carrier's logo in the combo banner to see every parcel and letter for that carrier across all tabs, expandable in place.

-   :heavy_plus_sign:{ .lg .middle } **Add a parcel from the card**

    ---

    Account-less carriers (GLS, Dragonfly, Trunkrs, Cainiao, Hermes, Packeta, Correos) get a "+ Add parcel" control that registers a tracking number directly.

-   :frame_with_picture:{ .lg .middle } **Media browser**

    ---

    Browse the HA media library from the editor to pick logos, banners and placeholder images.

-   :envelope:{ .lg .middle } **Letterbox mail**

    ---

    PostNL letters with scan images, split into *Still to be delivered* and *Delivered* sections.

</div>

---

## Quick start

=== "PostNL"

    ```yaml
    type: custom:hki-parcels-card
    title: Parcels
    carriers:
      - type: postnl_v4
        user: my_account
    ```

    !!! tip "Which PostNL type?"
        Use `postnl_v4` ("PostNL") for ha-postnl ≥ 4.0.0 (recommended). `postnl` ("PostNL (<v4.x)") and `postnl_legacy` ("PostNL (ArjenBos)") are being phased out — see [Installation](installation.md#postnl).

=== "DHL / DPD / GLS"

    ```yaml
    type: custom:hki-parcels-card
    title: Parcels
    carriers:
      - type: dhl
        user: my_account
      - type: dpd
        user: my_account
      - type: gls
        user: "1234ab"
    ```

    !!! note "GLS has no account"
        GLS tracks parcels by tracking number and postal code rather than a login — `user` maps to the hub's postal code.

=== "Dragonfly / Trunkrs / Cainiao / Hermes / Packeta / Correos"

    ```yaml
    type: custom:hki-parcels-card
    title: Parcels
    carriers:
      - type: dragonfly
      - type: trunkrs
        user: "1234ab"
      - type: cainiao
      - type: hermes
      - type: packeta
      - type: correos
    ```

    These six (plus GLS) are the account-less carriers — register a parcel with the "+ Add parcel" control on the card itself instead of logging into an account. See [Add parcel support](card/overview.md#add-parcel-support).

=== "Every carrier"

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

Or skip the YAML entirely — add the card via the dashboard UI and it auto-detects every installed carrier integration, pre-filling a fully configured entry for each one it finds.

[Installation :material-arrow-right:](installation.md){ .md-button .md-button--primary }
[Configuration :material-arrow-right:](card/configuration.md){ .md-button }

---

## Supported carriers

All carriers below are part of the [ha-parcel-integrations](https://github.com/ha-parcel-integrations) family — Home Assistant integrations that publish a shared canonical parcel format, which is what lets one card support all of them with the same logic.

| Carrier | Integration | Card type | Account type |
| ------- | ----------- | --------- | ------------ |
| **PostNL** (recommended) | [ha-postnl](https://github.com/ha-parcel-integrations/ha-postnl) ≥ 4.0.0 | `postnl_v4` | Account login |
| **PostNL (<v4.x)**² | [ha-postnl](https://github.com/ha-parcel-integrations/ha-postnl) ≤ 3.x | `postnl` | Account login |
| **PostNL (ArjenBos)**² | [arjenbos/ha-postnl](https://github.com/arjenbos/ha-postnl) | `postnl_legacy` | Account login |
| **DHL** | [ha-dhl-nl](https://github.com/ha-parcel-integrations/ha-dhl-nl) | `dhl` | Account login |
| **DPD** | [ha-dpd](https://github.com/ha-parcel-integrations/ha-dpd) | `dpd` | Account login |
| **GLS** | [ha-gls](https://github.com/ha-parcel-integrations/ha-gls) | `gls` | Tracking number + postal code |
| **Dragonfly**¹ | [ha-dragonfly](https://github.com/ha-parcel-integrations/ha-dragonfly) | `dragonfly` | Tracking number only |
| **Trunkrs** | [ha-trunkrs](https://github.com/ha-parcel-integrations/ha-trunkrs) | `trunkrs` | Tracking number + postal code |
| **Cainiao** | [ha-cainiao](https://github.com/ha-parcel-integrations/ha-cainiao) | `cainiao` | Tracking number only |
| **Hermes** | [ha-hermes](https://github.com/ha-parcel-integrations/ha-hermes) | `hermes` | Tracking number only |
| **Packeta** | [ha-packeta](https://github.com/ha-parcel-integrations/ha-packeta) | `packeta` | Tracking number only |
| **Correos** | [ha-correos](https://github.com/ha-parcel-integrations/ha-correos) | `correos` | Tracking number only |

¹ Created by [Alwin Hummels (@HummelsTech)](https://github.com/HummelsTech), who also maintains it standalone at [HummelsTech/ha-dragonfly](https://github.com/HummelsTech/ha-dragonfly) — see [Installation](installation.md#dragonfly-trunkrs-cainiao-hermes-packeta-and-correos) for details.

² Being phased out — see the [deprecation notice](installation.md#postnl).

!!! note "Add parcel support"
    Only the account-less carriers (GLS, Dragonfly, Trunkrs, Cainiao, Hermes, Packeta, Correos) get the card's "+ Add parcel" control — PostNL, DHL and DPD auto-sync every parcel tied to the logged-in account and don't expose a service to register one manually. Full explanation on the [Overview page](card/overview.md#add-parcel-support).

---

!!! note "Part of HKI Elements"
    This card is based on [jimz011/hki-elements](https://github.com/jimz011/hki-elements) — the original PostNL card from the HKI project, extended with multi-carrier support, a carrier overview popup and letterbox mail.
