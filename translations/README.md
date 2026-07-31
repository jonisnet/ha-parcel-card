# Translations

The card automatically uses your Home Assistant UI language (`hass.language`) —
there is no language setting on the card itself. If your language isn't available yet,
it falls back to English.

## Adding or improving a language

1. Copy `en.json` to `<lang>.json` using the [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes)
   two-letter code Home Assistant uses (e.g. `de.json`, `fr.json`).
2. Translate every value. Keep the keys unchanged, keep carrier/brand names
   (PostNL, DHL, GLS, ...) untranslated, and keep placeholders like `sensor.dragonfly_*`
   and `mdi:...` as-is.
3. If your file is a first draft you'd like a native speaker to double-check later, add:
   ```json
   "_meta": { "machine_drafted": true },
   ```
   as the first key. Remove it once you're confident it reads naturally.
4. Run `python scripts/build_translations.py` from the repo root — this bundles
   `translations/*.json` into the `TRANSLATIONS` block in `hki-parcels-card.js`
   (between the `GENERATED:TRANSLATIONS` markers) and fails if any file is missing
   or has extra keys compared to `en.json`.
5. Commit both your `translations/<lang>.json` and the regenerated `hki-parcels-card.js`,
   and open a PR. CI (`validate-translations.yml`) re-checks that the two stay in sync.

Do not hand-edit the `TRANSLATIONS` block inside `hki-parcels-card.js` — it's generated
and any manual edit will be overwritten the next time the script runs.
