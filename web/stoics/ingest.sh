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

echo "=== Priority 1: Core Seneca works ==="

# ----------------------------------------------------------------------------
# Work 6 — Seneca: Minor Dialogues (includes On the Shortness of Life)
# Source: Project Gutenberg ebook 64576 — Minor Dialogues, Together With the
#         Dialogue on Clemency. Replaces old stale URL for ebook 1303.
# ----------------------------------------------------------------------------
echo "[6] Seneca — Minor Dialogues"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/cache/epub/64576/pg64576-images.html" \
  --output stoics/seneca/life.json \
  --quotes-output /tmp/quotes-6.json \
  --work-id 6

echo ""
echo "=== Priority 1: Core Cicero works ==="

# ----------------------------------------------------------------------------
# Work 7 — Cicero: Academic Questions & De Finibus
# Source: Project Gutenberg ebook 29247 — Academic Questions, Treatise De
#         Finibus, and Tusculan Disputations. Contains the full De Finibus
#         alongside Academic Questions and Tusculan Disputations.
# Note: Some overlap with work 8 (standalone Tusculan). Full comparison deferred.
# ----------------------------------------------------------------------------
echo "[7] Cicero — Academic Questions & De Finibus"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/cache/epub/29247/pg29247-images.html" \
  --output stoics/cicero/goodevil.json \
  --quotes-output /tmp/quotes-7.json \
  --work-id 7

# ----------------------------------------------------------------------------
# Work 8 — Cicero: Tusculan Disputations (standalone)
# Source: Project Gutenberg ebook 14988 (C. D. Yonge translation, 1877)
# ----------------------------------------------------------------------------
echo "[8] Cicero — Tusculan Disputations"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/cache/epub/14988/pg14988-images.html" \
  --output stoics/cicero/tuscan.json \
  --quotes-output /tmp/quotes-8.json \
  --work-id 8

# ----------------------------------------------------------------------------
# Work 9 — Cicero: On Duties (De Officiis)
# Source: Project Gutenberg ebook 47001 — De Officiis, Walter Miller translation
#         (1913, Loeb Classical Library). Dual-language edition: Latin and English
#         side-by-side. Parser profile gutenberg-bilingual extracts only the English
#         <div class="english"> sections.
# ----------------------------------------------------------------------------
echo "[9] Cicero — On Duties (De Officiis)"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg-bilingual \
  --url "https://www.gutenberg.org/cache/epub/47001/pg47001-images.html" \
  --output stoics/cicero/duties.json \
  --quotes-output /tmp/quotes-9.json \
  --work-id 9

echo ""
echo "=== Priority 2: Extended Seneca works ==="

# ----------------------------------------------------------------------------
# Work 11 — Seneca: On Benefits (standalone, De Beneficiis)
# Source: Project Gutenberg ebook 3794
# ----------------------------------------------------------------------------
echo "[11] Seneca — On Benefits"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/cache/epub/3794/pg3794-images.html" \
  --output stoics/seneca/benefits.json \
  --quotes-output /tmp/quotes-11.json \
  --work-id 11

# ----------------------------------------------------------------------------
# Work 12 — Seneca's Morals (includes On Anger, Benefits, Clemency, Happy Life)
# Source: Project Gutenberg ebook 56075 — Seneca's Morals of a Happy Life,
#         Benefits, Anger and Clemency. Replaces stale URL for ebook 1650.
# Note: Overlaps with work 11 (On Benefits). Comparison deferred.
# ----------------------------------------------------------------------------
echo "[12] Seneca's Morals"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/cache/epub/56075/pg56075-images.html" \
  --output stoics/seneca/anger.json \
  --quotes-output /tmp/quotes-12.json \
  --work-id 12

echo ""
echo "=== Priority 2: New authors (v1.4.0 batch) ==="

# ----------------------------------------------------------------------------
# Work 13 — Plutarch: Plutarch's Morals
# Source: Project Gutenberg ebook 23639
# ----------------------------------------------------------------------------
echo "[13] Plutarch — Morals"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/cache/epub/23639/pg23639-images.html" \
  --output stoics/plutarch/morals.json \
  --quotes-output /tmp/quotes-13.json \
  --work-id 13

# ----------------------------------------------------------------------------
# Work 14 — Diogenes Laertius: Lives and Opinions of Eminent Philosophers
# Source: Project Gutenberg ebook 57342 (Book VII covers the Stoics)
# ----------------------------------------------------------------------------
echo "[14] Diogenes Laertius — Lives and Opinions"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/cache/epub/57342/pg57342-images.html" \
  --output stoics/diogenes/lives.json \
  --quotes-output /tmp/quotes-14.json \
  --work-id 14

# ----------------------------------------------------------------------------
# Work 15 — Hierocles & Stobaeus: Political Fragments
# Source: Project Gutenberg ebook 75184 — Political fragments of Archytas,
#         Charondas, Zaleucus, and other ancient Pythagoreans, preserved by Stobaeus
# ----------------------------------------------------------------------------
echo "[15] Hierocles & Stobaeus — Political Fragments"
python3 stoics/parse_stoic_sources.py \
  --profile gutenberg \
  --url "https://www.gutenberg.org/cache/epub/75184/pg75184-images.html" \
  --output stoics/hierocles/fragments.json \
  --quotes-output /tmp/quotes-15.json \
  --work-id 15

echo ""
echo "=== Merging generated quotes into data-all-quotes.json ==="

python3 - <<'PYEOF'
import json, pathlib, sys

web = pathlib.Path(".")
quotes_path = web / "data-all-quotes.json"
existing = json.loads(quotes_path.read_text(encoding="utf-8"))

# Remove any stale stubs for these work IDs before merging
ingested_ids = {"6", "7", "8", "9", "11", "12", "13", "14", "15"}
kept = [q for q in existing if str(q.get("workId")) not in ingested_ids]

new_quotes = []
for wid in sorted(ingested_ids, key=int):
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
echo "1. Review generated work JSON files for structure quality."
echo "2. Review overlap between works 7/8 (Cicero) and 11/12 (Seneca)."
echo "3. Bump the version field in data-meta.json if re-running."
echo "4. Update ingestion-queue.json batch statuses as needed."
echo "5. Run the Playwright tests: cd tests && npm test"
