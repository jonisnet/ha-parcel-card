# Screenshots

## Dashboard — parcel detail

The delivery tracker and expanded parcel detail panel (tracking number, delivery type, collection
deadline). Every carrier gets the same illustrated scenes in its own colour: four steps for home
delivery, five when the parcel goes via a pickup point. The large scene shows where the parcel is now.

<div class="grid" markdown>

![Parcel at a pickup point, dark theme](../images/v2-detail-pickup-dark.png)

![Parcel at a pickup point, light theme](../images/v2-detail-pickup-light.png)

![Parcel out for delivery, dark theme](../images/v2-detail-delivery-dark.png)

![Parcel out for delivery, light theme](../images/v2-detail-delivery-light.png)

![Parcel at the sorting centre, dark theme](../images/v2-detail-transit-dark.png)

![Parcel at the sorting centre, light theme](../images/v2-detail-transit-light.png)

</div>

---

## Delivery scenes — all 85 carriers

The five scenes (Registered · Sorting centre · Out for delivery · Pickup point · Delivered) for
every supported carrier, in its configured colour and with its logo. Logos come from
[custom-brand-icons](https://github.com/elax46/custom-brand-icons) when it is installed, otherwise
from the carrier's own artwork.

=== "Light theme"

    ![All 85 carriers, light theme](../images/v2-all-carriers-light.png)

=== "Dark theme"

    ![All 85 carriers, dark theme](../images/v2-all-carriers-dark.png)

---

## Combo banner — multiple carriers

When two or more carriers are configured, the Studio banner shows just those carriers
in equal-sized tiles, with up to four columns and a centred final row. Logo sizes follow
offline content measurements; square integration icons have rounded corners. Tiles use
the active Home Assistant card colour, including a dark background in dark mode. Dark
wordmarks keep their original colours with a subtle light edge for readability. Existing
single-carrier banners and custom placeholder images remain available.

<div class="grid" markdown>

![Carrier banner, dark theme](../images/v2-banner-dark.png)

![Carrier banner, light theme](../images/v2-banner-light.png)

</div>

Full dashboard with every carrier's own tile alongside the combo banner (earlier beta):

<div class="grid" markdown>

![Multi-carrier grid, dark theme](../images/screenshot-multi-carrier-grid-dark.png)

![Multi-carrier grid, light theme](../images/screenshot-multi-carrier-grid-light.png)

</div>

---

## Carrier overview popup

Click a carrier's logo in the combo banner to see every parcel and letter for that carrier — grouped by section (In Transit / Delivered / Sent / Post) — in one popup. Clicking an item expands its details in place.

<div class="grid" markdown>

![Carrier popup, dark theme](../images/screenshot-carrier-popup-dark.png)

![Carrier popup, light theme](../images/screenshot-carrier-popup-light.png)

</div>

---

## Visual editor

Full carrier list and live preview, side by side — no YAML required.

![Editor carriers and preview](../images/screenshot-editor-carriers.png)
