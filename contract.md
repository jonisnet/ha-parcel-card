# Integration contract

HA Parcel Card doesn't have per-carrier logic for parsing tracking data — every carrier is read
through the same **canonical parcel format**. Any Home Assistant integration that exposes its
data this way works with the card today, with `type: custom` and zero changes to the card
itself. This page documents that format for integration authors.

If you maintain (or are writing) a parcel-tracking integration and want your users to be able to
use this card, this is the contract to match.

---

## Two levels of support

1. **Works via `type: custom`** — the only requirement is the sensor attribute shape below. No
   auto-detection, no branded logo/van/banner (a generic icon is used unless the user supplies
   `logo_path`/`van_path`/`banner_path` themselves), no automatic sensor discovery — the user
   configures `entity_incoming`/`entity_delivered`/etc by hand. This is the whole contract; you
   don't need anyone's permission or involvement to support it.
2. **First-class support** (a dedicated carrier preset — proper name, branding, colour, an entry
   in the carrier-type dropdown, and automatic account detection when the card is added to a
   dashboard) — open an issue or PR on this repo once your integration exposes the canonical
   format. Most first-class carriers today are part of
   [ha-parcel-integrations](https://github.com/ha-parcel-integrations), but that's not a
   requirement — it's just where most of them happened to end up.

---

## Sensor shape

Each carrier is read from up to five sensors (letters only apply to PostNL-style mailbox
integrations, and outgoing/outgoing-delivered only apply if you track sent parcels too):

| Card config field | Purpose |
| --- | --- |
| `entity_incoming` | Parcels on their way to the user |
| `entity_delivered` | Parcels already delivered to the user |
| `entity_outgoing` | Parcels the user has sent, in transit (optional) |
| `entity_outgoing_delivered` | Parcels the user has sent, delivered (optional) |
| `entity_letters` | Mailbox/letter items (optional, PostNL-style only) |

Each sensor's **state** is not read at all by the card — only its **attributes** matter. The
attributes must resolve (via [`_extractRawList`](ha-parcel-card.js)) to a plain array of parcel
objects, found via the first of these that matches:

- The attributes themselves are an array (rare — most integrations expose an object of
  attributes, not a bare array state attribute, but it's supported).
- An `enroute`/`en_route` array attribute plus a `delivered` array attribute — both are read and
  concatenated (a legacy shape some integrations use to split active/delivered within one
  sensor's attributes; if you're starting fresh, prefer separate `entity_incoming`/
  `entity_delivered` sensors instead and skip this entirely).
- A `shipments` array attribute.
- A `parcels` array attribute.
- A `letters` array attribute (letters sensor only).
- Falls back to every attribute value that is itself an object (i.e. attributes keyed by
  tracking number rather than a single array).

Attribute-key matching is case-insensitive.

---

## Parcel object shape

Every item in that array should look like this. Only `status` is truly required — everything
else has a sane fallback, but the more you provide, the more the card can show.

```jsonc
{
  // One of: registered, in_transit, out_for_delivery, at_pickup_point, delivered,
  // returning, problem, unknown. Case-insensitive (ha-postnl v4.x sends UPPERCASE,
  // most others lowercase — the card normalizes this itself, don't worry about casing).
  "status": "in_transit",

  // Optional. If omitted, derived from status (true only for "delivered").
  // Provide it explicitly if your integration has a more precise signal.
  "delivered": false,

  // A stable unique identifier for this parcel - tracking number, barcode, whatever
  // is unique per shipment. Falls back to `barcode` or `id` if `key` isn't present.
  "key": "3SABCD1234567",

  // Optional. Either works - `name` wins if both are present. If neither is set,
  // the card shows a generic "Unknown parcel" label.
  "name": "Order #4471",
  "sender": "Some Webshop",

  // Optional dates (ISO 8601 strings, or anything `new Date()` accepts). Used for
  // sorting and the days_back cutoff filter. delivered_at wins over planned_from
  // wins over delivery_date, when more than one is present.
  "delivered_at": "2026-08-14T14:32:00+02:00",
  "planned_from": "2026-08-15T00:00:00+02:00",

  // Optional. true only for a genuine pickup-point/locker delivery (never a plain
  // "left with a neighbour" home delivery) - adds a 5th step to the tracker between
  // "out for delivery" and "delivered".
  "pickup": false,

  // Optional. Shown in the detail panel when the user enables show_raw_status,
  // instead of the card's own generic translated label for this status.
  "raw_status": "Onderweg - geladen voor aflevering",

  // Optional. Carrier-specific extra fields. Never blindly dumped - only shown if
  // this repo's CARRIER_EXTRA_DETAILS has a mapping function for your carrier type.
  // Open a PR to add one once you have a real field worth surfacing (weight,
  // dimensions, a delivery code, etc).
  "raw": { }
}
```

### Letters (mailbox items)

`entity_letters` items use a different, smaller shape - `date`/`delivery_date`, `title`,
`unread` (boolean), `id`/`key`, and `image_url` for a scan image (a URL ending in something
matched against `/letter_placeholder/i` is treated as "not ready yet" and skipped). Letters are
currently a PostNL-specific concept (`ha-postnl`'s own mailbox-scan feature) - if your
integration has something equivalent, open an issue to discuss the shape before building against
it, since this side of the contract is far less generalized than the parcel shape above.

---

## Auto-detection (optional, needed only for first-class support)

The card can auto-populate a carrier entry when first added to a dashboard, by finding your
integration's sensors and guessing `entity_incoming`/`entity_delivered`/etc. Two mechanisms,
tried in order:

1. **`translation_key` matching** (preferred) — if your entities use `has_entity_name` (the
   modern HA entity-naming convention) with stable, English, unlocalized `translation_key`
   values (`incoming_parcels`, `delivered_parcels`, `outgoing_parcels`,
   `outgoing_delivered_parcels`, `letters`), detection works correctly regardless of what
   language the user's Home Assistant frontend is set to. This is the only approach that's
   actually language-proof — see the `registryEntitiesByDevice`/`repairStaleEntityId` comments in
   `ha-parcel-card.js` for the history of why (an integration's entity_id suffix is derived from
   whatever language was active when the entity was first created, not from `translation_key`,
   so text-guessing alone breaks the moment a user's language differs from what the card expects).
2. **Entity ID text-guessing** (fallback) — `sensor.<user>_incoming_parcels`,
   `sensor.<user>_delivered_parcels`, etc. (English suffixes), tried in both `<user>_<suffix>`
   and `<suffix>_<user>` order. Works without `translation_key`, but only for the specific
   suffix words the card already knows about.

If you want first-class support, using `has_entity_name` + the `translation_key` values above is
the most robust option — reach out (open an issue) if you'd like help wiring this up.

---

## Not part of the contract

- The sensor's own **state** value — the card never reads it, only attributes.
- Any specific HA domain name for your integration — `type: custom` doesn't care what your
  integration is called.
- Icons/branding — bring your own via `logo_path`/`van_path`/`banner_path`, or ask for a preset
  (see above).
