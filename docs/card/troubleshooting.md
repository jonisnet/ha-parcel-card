# Troubleshooting

## "Entiteit niet gevonden" (Entity not found)

The card cannot find one or more sensor entities.

**Causes and solutions:**

1. The parcel integration is not installed — install the integration for your carrier (see [Installation](../installation.md)) and configure your account or tracking number.
2. The `user` field does not match your sensor prefix — check the actual sensor name in **Developer Tools → States** and adjust `user` accordingly.
3. The sensors have no username prefix — leave `user` empty (`user: ""`).
4. You selected the wrong PostNL type — if your sensor names include `postnl`, use `postnl_v4` ("PostNL", for ha-postnl ≥ 4.x) or `postnl` ("PostNL (<v4.x)", for ha-postnl ≤ 3.x), not `postnl_legacy` ("PostNL (ArjenBos)").
5. The editor's "integration not found" link points at the wrong repo — this was fixed to point at the [ha-parcel-integrations](https://github.com/ha-parcel-integrations) org; update the card if you still see links to `peternijssen/*` or `HummelsTech/*`.

---

## No parcels shown

The card loads but the parcel list is empty.

**Causes and solutions:**

1. `days_back` is too short — increase the value to show older delivered parcels.
2. The integration has not yet received data from the carrier — wait for the next update cycle or trigger a manual refresh.
3. The sensor exists but has no attributes — verify the integration is authenticated (or, for account-less carriers, that at least one parcel has been registered).
4. For account-less carriers (GLS, Dragonfly, Trunkrs, Cainiao, Hermes) — nothing has been tracked yet. Use the "+ Add parcel" control, or the integration's own Configure dialog, to register a tracking number.

---

## Delivered parcels not visible

Delivered parcels do not appear in the Delivered tab.

**Causes and solutions:**

1. `show_delivered` is set to `false` — enable it in the card options.
2. The parcels are older than `days_back` — increase the value.
3. Using `postnl_v4` type with an older ha-postnl version — ha-postnl ≥ 4.0.0 is required for `postnl_v4`. Use `postnl` for version 3.x.

---

## Sent parcels not visible

The Sent tab is empty, or missing entirely.

**Causes and solutions:**

1. `show_sent` is set to `false` — enable it.
2. The carrier is GLS, Dragonfly, Trunkrs, Cainiao or Hermes — these carriers have no Sent tab at all, since there's no sender/account concept for account-less tracking. This is expected, not a bug.
3. The `entity_outgoing` sensor is not configured and cannot be derived automatically — verify the sensor exists in Developer Tools and add a manual override if needed.
4. For `postnl_legacy` — configure `distribution_entity` alongside `entity`.

---

## Letters tab not visible or empty

The Post tab does not appear or shows no letters.

**Causes and solutions:**

1. `show_letters` is set to `false` — enable it.
2. The carrier type is not PostNL — only `postnl_v4` and `postnl` support letters.
3. The `entity_letters` sensor does not exist — the letters sensor is created by ha-postnl when your account has letterbox mail. Verify it exists in Developer Tools.

---

## Letter images not showing

Letters appear but no scan images are displayed.

**Causes and solutions:**

1. ha-postnl has not yet downloaded the images — images are fetched asynchronously and may take a few minutes after the letter data appears.
2. The letter only has a placeholder image — ha-postnl v4.x creates a placeholder `image.*` entity before the real scan is available. The card automatically skips placeholder entities; when the real image is available it will appear automatically.
3. The image entity is `unavailable` — the scan has not been received yet. Check the entity state in Developer Tools.

---

## "+ Add parcel" is missing or fails

**Causes and solutions:**

1. The control doesn't appear at all — it only shows when at least one configured carrier is account-less (GLS, Dragonfly, Trunkrs, Cainiao, Hermes). PostNL, DHL and DPD don't support it; see [Add parcel support](overview.md#add-parcel-support) for why.
2. `show_add_parcel: false` is set — remove it or set to `true`.
3. Submitting a tracking number does nothing / errors — the control calls the integration's own `track_parcel` service directly. Check **Developer Tools → Actions** to confirm that service exists for your carrier's integration (e.g. `gls.track_parcel`), and check the integration's own logs for the actual failure reason (invalid tracking number, carrier API error, etc.) — the card only relays the call, it doesn't validate tracking numbers itself.
4. For GLS/Trunkrs specifically — the parcel may land on the wrong hub if `user` (the postal code) isn't set correctly on that carrier entry, since it's passed along automatically with the service call.

---

## Carrier overview popup shows the wrong icon or colour

**Causes and solutions:**

1. If a carrier currently has zero parcels in every tab, the popup previously fell back to a generic icon and colour instead of the carrier's configured branding — fixed in v1.5.0b3. Update to the latest version.
2. The icon shown is a plain generic shape or a text mark instead of a proper logo — this isn't a bug in the card. [custom-brand-icons](https://github.com/elax46/custom-brand-icons) coverage varies per carrier; some (DPD, GLS) currently only have placeholder-style artwork upstream, and Trunkrs/Cainiao/Hermes have no PHU icon at all yet. See [PHU carrier icons](../installation.md#optional-phu-carrier-icons).

---

## Animation not showing

The van animation does not appear when a parcel is selected.

**Causes and solutions:**

1. `show_animation` is set to `false` — enable it.
2. No parcel is selected — click a parcel in the list to trigger the animation.

---

## Card shows blank / white screen

**Causes and solutions:**

1. The JavaScript file is not loaded — verify the resource is added in **Settings → Dashboards → Resources** and the path is correct.
2. A JavaScript error occurred — open the browser console (F12) and check for errors. Report any errors on the [issue tracker](https://github.com/jonisnet/hki-parcels-card/issues).
3. Clear your browser cache (Ctrl+Shift+R) and reload Home Assistant.
