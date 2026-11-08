# Moving from HKI Parcels Card

[HKI Parcels Card](https://github.com/jonisnet/hki-parcels-card) (v1.7.x) no longer gets
updates. HA Parcel Card is its successor: the same card, still maintained, with support for every
carrier in the [ha-parcel-integrations](https://github.com/ha-parcel-integrations) family.

Both cards can be installed at the same time, because they use different card types. You can
set up HA Parcel Card next to your current card, check it, and only then remove the old one.

## What carries over

- **Card options:** title, tabs, sorting, grouping, colours, layout order and every `show_*`
  switch keep their name and meaning.
- **Carrier entries:** `user`, the `entity_*` fields and the `*_path` fields stay the same.
- **Custom parcel names:** they move over automatically the first time HA Parcel Card loads.
- **Required Home Assistant version:** 2026.7 or newer, the same as before.

## What you need to change

| HKI Parcels Card | HA Parcel Card |
| --- | --- |
| `type: custom:hki-parcels-card` | `type: custom:ha-parcel-card` |
| carrier `type: postnl_v4` | carrier `type: postnl` |
| carrier `type: postnl` (PostNL <v4.x) | update [ha-postnl](https://github.com/ha-parcel-integrations/ha-postnl) to 4.0.0 or newer, then `type: postnl` |
| carrier `type: postnl_legacy` (PostNL ArjenBos) | switch to [ha-postnl](https://github.com/ha-parcel-integrations/ha-postnl) 4.0.0 or newer, then `type: postnl` |

!!! warning "Change `postnl_v4` to `postnl`"
    HA Parcel Card does not know the type `postnl_v4`. A carrier entry that keeps it is shown
    as a generic custom carrier without PostNL detection or branding.

In HKI Parcels Card, `type: postnl` meant the old ha-postnl 3.x. In HA Parcel Card,
`type: postnl` means ha-postnl 4.0.0 and newer, so a card that used PostNL <v4.x keeps working
only after ha-postnl has been updated.

All other carrier types (`dhl`, `dpd`, `gls`, `vinted_go` and so on) keep their name.

## Step by step

1. Install **HA Parcel Card**, see [Installation](installation.md). Leave HKI Parcels Card
   installed for now.
2. Reload your browser.
3. Open the dashboard with your current card and choose **Edit dashboard**.
4. Open the card's menu and choose **Show code editor**, copy the YAML, and add a new
   **Manual** card with that YAML.
5. In the new card, change the first line to `type: custom:ha-parcel-card` and apply the carrier
   changes from the table above.
6. Save, and check that every carrier shows its parcels.
7. Remove the old card from the dashboard.
8. Once no dashboard uses it any more, remove **HKI Parcels Card** in the Marketplace (or HACS).

Prefer starting fresh? Add HA Parcel Card as a new card instead: it detects every installed
carrier integration and fills in the carriers for you.

Something doesn't work after moving? Open an issue on
[ha-parcel-card](https://github.com/jonisnet/ha-parcel-card/issues).
