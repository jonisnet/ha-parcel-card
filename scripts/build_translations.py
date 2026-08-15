#!/usr/bin/env python3
"""
Assembles translations/*.json into the TRANSLATIONS object bundled inside
ha-parcel-card.js, between the GENERATED:TRANSLATIONS markers.

Usage:
  python scripts/build_translations.py          # regenerate ha-parcel-card.js
  python scripts/build_translations.py --check  # exit 1 if the file is out of date (CI)

Adding a language: drop translations/<lang>.json next to en.json with the same
keys (any subset is allowed for _meta), then run this script.
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANSLATIONS_DIR = os.path.join(ROOT, "translations")
CARD_JS = os.path.join(ROOT, "ha-parcel-card.js")
START_MARKER = "// GENERATED:TRANSLATIONS:START — run `python scripts/build_translations.py` after editing translations/*.json"
END_MARKER = "// GENERATED:TRANSLATIONS:END"
REFERENCE_LANG = "en"


def load_languages():
    langs = {}
    for fname in sorted(os.listdir(TRANSLATIONS_DIR)):
        if not fname.endswith(".json"):
            continue
        lang = fname[:-5]
        with open(os.path.join(TRANSLATIONS_DIR, fname), encoding="utf-8") as f:
            data = json.load(f)
        langs[lang] = data
    return langs


def validate(langs):
    if REFERENCE_LANG not in langs:
        sys.exit(f"translations/{REFERENCE_LANG}.json is missing — it is the reference for all keys.")
    ref_keys = set(k for k in langs[REFERENCE_LANG] if k != "_meta")
    errors = []
    for lang, data in langs.items():
        keys = set(k for k in data if k != "_meta")
        missing = ref_keys - keys
        extra = keys - ref_keys
        if missing:
            errors.append(f"translations/{lang}.json is missing keys: {sorted(missing)}")
        if extra:
            errors.append(f"translations/{lang}.json has unknown keys not in en.json: {sorted(extra)}")
    if errors:
        sys.exit("Translation validation failed:\n" + "\n".join(errors))


def js_string(s):
    # Minimal, safe JS single-quoted string literal.
    out = s.replace("\\", "\\\\").replace("'", "\\'")
    return f"'{out}'"


def js_key(k):
    # All our keys are valid JS identifiers, so no quoting needed.
    return k


def render_block(langs):
    order = [l for l in ["en", "nl"] if l in langs] + sorted(l for l in langs if l not in ("en", "nl"))
    lines = ["const TRANSLATIONS = {"]
    for lang in order:
        data = langs[lang]
        meta = data.get("_meta")
        if meta and meta.get("machine_drafted"):
            lines.append(f"    // {lang}: machine-drafted, not yet reviewed by a native speaker (see translations/{lang}.json)")
        lines.append(f"    {lang}: {{")
        for k, v in data.items():
            if k == "_meta":
                continue
            lines.append(f"        {js_key(k)}: {js_string(v)},")
        lines.append("    },")
    lines.append("};")
    return "\n".join(lines)


def main():
    check_only = "--check" in sys.argv
    langs = load_languages()
    validate(langs)
    new_block = render_block(langs)

    with open(CARD_JS, encoding="utf-8") as f:
        content = f.read()

    start = content.find(START_MARKER)
    end = content.find(END_MARKER)
    if start == -1 or end == -1:
        sys.exit("Could not find GENERATED:TRANSLATIONS markers in ha-parcel-card.js")
    end_of_end_line = content.find("\n", end)

    new_content = (
        content[:start]
        + START_MARKER + "\n"
        + new_block + "\n"
        + content[end:end_of_end_line + 1]
        + content[end_of_end_line + 1:]
    )
    # the slice above duplicates the END marker line; rebuild cleanly instead
    new_content = content[:start] + START_MARKER + "\n" + new_block + "\n" + content[end:]

    if check_only:
        if new_content != content:
            print("ha-parcel-card.js is OUT OF DATE relative to translations/*.json.")
            print("Run: python scripts/build_translations.py")
            sys.exit(1)
        print(f"OK — {len(langs)} languages, in sync.")
        return

    with open(CARD_JS, "w", encoding="utf-8", newline="\n") as f:
        f.write(new_content)
    print(f"Wrote TRANSLATIONS block for {len(langs)} languages: {', '.join(sorted(langs))}")


if __name__ == "__main__":
    main()
