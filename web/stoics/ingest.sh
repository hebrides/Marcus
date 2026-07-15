#!/usr/bin/env bash
# stoics/ingest.sh
#
# Fetches and parses all pending Stoic works into the Marcus work JSON format.
# Run this script from the web/ directory once network access is available:
#
#   cd web
#   bash stoics/ingest.sh
#
# Each command fetches the source HTML, parses it into partition JSON, and
# writes a companion quotes list to /tmp/. After all works are ingested, merge
# the quotes into data-all-quotes.json (see the merge step at the bottom).
#
# Prerequisites: Python 3.x
#

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(dirname "$SCRIPT_DIR")"
cd "$WEB_DIR"

echo "=== Priority 1: Core works (currently placeholder stubs) ==="

# ----------------------------------------------------------------------------
# Work 6 — Seneca: On the Shortness of Life (De Brevitate Vitae)
# Source: Project Gutenberg — Stoic prose collection
# Verify the URL before running; Gutenberg occasionally restructures paths.
# ----------------------------------------------------------------------------
echo "[6] Seneca — On the Shortness of Life"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/files/1303/1303-h/1303-h.htm" \
  --output stoics/seneca/life.json \
  --quotes-output /tmp/quotes-6.json \
  --work-id 6

# ----------------------------------------------------------------------------
# Work 7 — Cicero: On the Ends of Good and Evil (de Finibus)
# Source: LacusCurtius (Loeb translation, University of Chicago)
# Note: The parser handles multi-page Loeb sources via the lacuscurtius profile.
# ----------------------------------------------------------------------------
echo "[7] Cicero — On the Ends of Good and Evil"
python3 stoics/parse_stoic_sources.py \
  --profile lacuscurtius-loeb \
  --url "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Cicero/de_Finibus/home.html" \
  --output stoics/cicero/goodevil.json \
  --quotes-output /tmp/quotes-7.json \
  --work-id 7

# ----------------------------------------------------------------------------
# Work 8 — Cicero: Tusculan Disputations
# Source: Project Gutenberg (C. D. Yonge translation, 1877)
# ----------------------------------------------------------------------------
echo "[8] Cicero — Tusculan Disputations"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/files/14988/14988-h/14988-h.htm" \
  --output stoics/cicero/tuscan.json \
  --quotes-output /tmp/quotes-8.json \
  --work-id 8

# ----------------------------------------------------------------------------
# Work 9 — Cicero: On Duties (De Officiis)
# Source: LacusCurtius (Loeb translation)
# ----------------------------------------------------------------------------
echo "[9] Cicero — On Duties"
python3 stoics/parse_stoic_sources.py \
  --profile lacuscurtius-loeb \
  --url "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Cicero/de_Officiis/home.html" \
  --output stoics/cicero/duties.json \
  --quotes-output /tmp/quotes-9.json \
  --work-id 9

echo ""
echo "=== Priority 2: Extended works (tier:extended) ==="

# ----------------------------------------------------------------------------
# Work 11 — Seneca: On Benefits (De Beneficiis)
# Source: Project Gutenberg — verify URL matches the correct translation.
# ----------------------------------------------------------------------------
echo "[11] Seneca — On Benefits"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/files/3794/3794-h/3794-h.htm" \
  --output stoics/seneca/benefits.json \
  --quotes-output /tmp/quotes-11.json \
  --work-id 11

# ----------------------------------------------------------------------------
# Work 12 — Seneca: On Anger (De Ira)
# Source: Project Gutenberg — verify URL before running.
# ----------------------------------------------------------------------------
echo "[12] Seneca — On Anger"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/files/1650/1650-h/1650-h.htm" \
  --output stoics/seneca/anger.json \
  --quotes-output /tmp/quotes-12.json \
  --work-id 12

echo ""
echo "=== Merging generated quotes into data-all-quotes.json ==="

python3 - <<'PYEOF'
import json, pathlib, sys

web = pathlib.Path(".")
quotes_path = web / "data-all-quotes.json"
existing = json.loads(quotes_path.read_text(encoding="utf-8"))

# Remove any stale stubs for these work IDs before merging
ingested_ids = {"6", "7", "8", "9", "11", "12"}
kept = [q for q in existing if str(q.get("workId")) not in ingested_ids]

new_quotes = []
for wid in sorted(ingested_ids):
    tmp = pathlib.Path(f"/tmp/quotes-{wid}.json")
    if tmp.exists():
        batch = json.loads(tmp.read_text(encoding="utf-8"))
        new_quotes.extend(batch)
        print(f"  Merged {len(batch)} quotes for workId {wid}")
    else:
        print(f"  Skipped workId {wid} — /tmp/quotes-{wid}.json not found")

merged = kept + new_quotes
quotes_path.write_text(json.dumps(merged, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Total quotes after merge: {len(merged)}")
PYEOF

echo ""
echo "=== Done. Next steps ==="
echo "1. Review the generated work JSON files for structure quality."
echo "2. Bump the version field in data-meta.json."
echo "3. Update ingestion-queue.json batch statuses to 'complete'."
echo "4. Run the Playwright tests: cd tests && npm test"
