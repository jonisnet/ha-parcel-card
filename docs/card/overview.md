# HA Parcel Card

A multi-carrier parcel tracking card for Home Assistant. Track parcels from all 68 carriers of the [ha-parcel-integrations](https://github.com/ha-parcel-integrations) family — PostNL, DHL, DPD, UPS, FedEx, USPS, GLS, bpost, La Poste, Evri and many more — in a single unified view, with support for letterbox mail images.

!!! note
    This card was created for the visual editor in Home Assistant. It is possible that the documentation is not complete for all features.

---

## Requirements

This card requires at least one parcel-tracking integration to be installed in Home Assistant. See [Installation](../installation.md) for the full list and links.

Every supported carrier, with its integration and what it supports, is listed under [Carrier types](configuration.md#carrier-types).

---

## Features

### :package: Parcel tracking

- **Multi-carrier** — any of the 68 supported carriers side by side; add the same carrier multiple times for multiple accounts or hubs
- **Automatic sensor names** — enter only the account name; the card builds all sensor entity IDs automatically, for both known naming schemes
- **Four tabs** — In Transit · Delivered · Sent · Letters
- **Split sections** — both Sent and Letters are split into *Still to be delivered* and *Delivered*
- **Click-to-expand** — click any parcel for barcode, delivery type and a direct tracking link
- **4-step delivery tracker** — selecting a parcel shows a progress row (Registered · Sorting centre · Out for delivery · Delivered) with a carrier-branded illustration for the current step
- **Historical tracking** — configure how many days back delivered parcels remain visible

### Carrier overview popup

Click a carrier's logo in the multi-carrier combo banner to open a popup listing every item for that carrier — parcels and letters — across all four tabs, grouped by section. Clicking an item expands its details (tracking number, status, delivery type, tracking link) in place, using the same accordion behaviour as the main list, so the popup stays open while you browse.

### Add parcel support

For every carrier whose integration has a `track_parcel` service — the tracking-code carriers, plus account-based ones that also accept a code, such as An Post, bpost and DHL — the card shows a "+ Add parcel" control that calls the integration's own `track_parcel` service directly — the parcel is genuinely registered with the integration, not just added to the card's own view. Toggle it off with `show_add_parcel: false` if you'd rather add parcels through the integration itself.

Which carriers have it is listed under [Carrier types](configuration.md#carrier-types). Account-based integrations without such a service (PostNL, DHL NL, DPD, Vinted Go, ...) don't need it: every parcel on the account appears automatically.

For GLS and Trunkrs, which can have multiple hubs (one per postal code), the carrier's configured `user` value is passed along automatically so the parcel lands on the right hub.

### :email: Letterbox mail

- **PostNL and bpost letters** — dedicated tab with scan images matched automatically from `image.*` entities
- **Works across ha-postnl versions** — matching is based on the `mailitem-xxx` ID, not the entity name, so it survives integration updates

### :art: Visual interface

- **Carrier banners** — animated banner shown when no parcel is selected. With one carrier configured, that carrier's own banner/logo is shown. With two or more, the card automatically builds a combo banner from the logos of *only the carriers you've actually configured*
- **Custom branding** — configurable logo, van animation and banner per carrier
- **Header statistics** — shows count of parcels in transit and recently delivered
- **Carrier colours** — each carrier has its own accent colour, editable per carrier
- **PHU icons** — branded carrier icons via [custom-brand-icons](https://github.com/elax46/custom-brand-icons) when installed (coverage varies — see [Installation](../installation.md#optional-phu-carrier-icons))

### :wrench: Customization

- **Toggle elements** — show/hide header, tabs, animation and placeholder
- **Layout reordering** — change the order of header, animation, tabs and list
- **Visual editor** — full configuration through the Home Assistant UI; sensor accounts are detected automatically
- **Media browser** — browse the HA media library from the editor to select logos, banners and placeholder images
- **Colour picker with hex input** — set custom carrier and header colours with one-click reset to the carrier default
