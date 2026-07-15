# Marcus — Stoic Reader TODO & Backlog

_Last updated: 2026-07-15. Tracks data ingestion backlog, product features, and integration goals._

---

## ✅ Done (v1.5.0)

- Ingest Cicero: Academic Questions & De Finibus (Work 7, ebook 29247)
- Ingest Cicero: Tusculan Disputations (Work 8, ebook 14988)
- Ingest Cicero: De Officiis (Work 9, ebook 47001) — new `gutenberg-bilingual` parser
- Ingest Seneca: Minor Dialogues / On the Shortness of Life (Work 6, ebook 64576)
- Ingest Seneca: On Benefits (Work 11, ebook 3794)
- Ingest Seneca: Morals / On Anger (Work 12, ebook 56075)
- Ingest Plutarch: Morals (Work 13, ebook 23639)
- Ingest Diogenes Laertius: Lives of Eminent Philosophers (Work 14, ebook 57342)
- Ingest Hierocles & Stobaeus: Political Fragments (Work 15, ebook 75184)
- Total corpus: **1,217 quotes** across 15 works, 7 authors
- Playwright test suite: smoke, quote interaction, biography, modal, menu, readability (22 tests)

---

## 📚 Data Ingestion Backlog

### Cicero — Orations (Priority: High)
- Gutenberg author page: https://www.gutenberg.org/ebooks/author/128
- Extensive catalog — most orations likely available as dual-language Loeb editions
- Check existing session comparison notes for previously identified ebook IDs
- Use `gutenberg-bilingual` profile for Loeb editions; standard `gutenberg` for English-only
- Candidate ebooks to evaluate:
  - Pro Milone, Philippics, De Re Publica, De Natura Deorum, De Divinatione, Somnium Scipionis
  - Many orations available in Latin on Gutenberg — cross-reference for bilingual Loeb editions

### Minor Stoics (Priority: Medium)
- **Musonius Rufus** — fragments/lectures, Gutenberg source TBD
- **Cleanthes** — standalone Hymn to Zeus (within Golden Sayings ebook 871)
- **Chrysippus** — fragments only, no complete works; consider paraphrase sources
- **Zeno of Citium** — fragments only; Diogenes Laertius (Work 14) already covers him

### Extended Sources (Priority: Low)
- **Arius Didymus** — Stoic compendium fragments

---

## 🤖 Feature: AI Virtual Stoic

- Allow users to converse with a virtual Stoic philosopher (Marcus Aurelius, Epictetus, Seneca)
- AI responds in the voice/style of the selected philosopher, grounded in the ingested corpus
- Needs: LLM backend, prompt engineering per author, UI for chat panel or modal
- Consider: RAG over the corpus so responses cite actual passages
- README already notes: "Uses AI for conversation component"

---

## 🔔 Feature: Daily Stoic Delivery

Explore the best channel for delivering a daily stoic text to users. Options ranked by friction:

| Format | Notes |
|--------|-------|
| **Browser push notification** | Works on desktop + Android; iOS Safari support improving |
| **Email digest** | Low friction to subscribe; good for morning ritual |
| **Morning meditation mode** | Timed, full-screen reading experience in the app itself |
| **New Tab / browser background** | Chrome/Firefox extension; rich visual presentation |
| **PWA home screen** | iOS/Android shortcut; can prompt on return visit |
| **RSS/Atom feed** | Developer-friendly; works with existing feed readers |

- Consider a simple `Subscribe` UI that collects email or enables push
- Content rotation: cycle through corpus daily, possibly thematic (e.g. Monday = virtue, etc.)
- Could tie into Aurelius Fund outreach/newsletter

---

## 🏛️ Feature: Aurelius Fund Integration

- The app serves as the reading companion for The Aurelius Fund (veterans charity)
- Potential integrations:
  - Donation CTA / link on the main page or about modal
  - Fund-branded version of the app or dedicated deployment
  - Shared content calendar (daily quote mirrors fund's comms)
  - Impact storytelling: pairing stoic passages with veteran testimonials

---

## 📖 Feature: Reader Usability (Needs Live Testing)

Open items to verify during live testing on master:

- [ ] Modal scroll position resets correctly when navigating between sections
- [ ] Section/chapter navigation (prev/next) works smoothly across long works (De Officiis = 226 sections)
- [ ] Font size / line height comfortable on mobile (readability tests pass at ≥18px / ≥26px)
- [ ] Fullscreen two-column layout on desktop — verify text width and balance
- [ ] Works with IndexedDB offline cache — test reload behavior after first load
- [ ] Works list in menu — all 15 works appear, organized by author
- [ ] Deep-link / share: can a specific quote or section be bookmarked/shared?

---

## 🔧 Technical Debt & Infrastructure

- Visual snapshot baselines need to be captured after first clean deploy:
  `npm run test:update-snapshots` from `web/tests/`
- Mobile-Safari Playwright tests require WebKit install (`npx playwright install webkit`)
- Consider GitHub Actions CI workflow to run tests on push
- Version bump cadence: target v1.6.0 for Cicero Orations batch
- Potential overlap between Work 11 (On Benefits) and Work 12 (Seneca's Morals) — deferred deduplication

---

## 📝 Notes

- Gutenberg Cicero author page: https://www.gutenberg.org/ebooks/author/128
  - Latin originals available; many also have English translations or dual-language Loeb editions
  - Cross-reference with previous session comparison notes for already-identified ebook IDs
- `gutenberg-bilingual` parser profile extracts English from `<div class="english">` in Loeb dual-language HTML
- Standard `gutenberg` profile works for English-only Gutenberg editions
- Data pipeline: `web/stoics/parse_stoic_sources.py` → `web/stoics/ingest.sh` → `data-all-quotes.json`
- Fake data generator/validator: `web/FAKE_DATA/test.sh`
