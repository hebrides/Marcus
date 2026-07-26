# CLAUDE.md — The Stoic Reader

> Coding style rules live in `.github/copilot-instructions.md` — read that first. Key points below.

## Project Purpose

Browser-based digital library for reading ancient Stoic philosophical texts (Marcus Aurelius, Epictetus, Seneca, Cicero, and others). Serves as the reading companion for The Aurelius Fund (a veterans charity). Emphasizes offline-first, no-dependency simplicity.

## Coding Style (from `.github/copilot-instructions.md`)

- **Zero runtime dependencies** — `index.html`, `style.css`, `script.js`, `script-worker.js` only. `package.json` is test tooling only. Do not add runtime deps without explicit approval.
- **No speculative abstraction** — match existing patterns, no future-proofing, no scaffolding unless asked.
- **No comments explaining what the code obviously does** — only add a comment when the WHY is non-obvious.
- **Explicit over clever** — no hidden control flow, no magic.
- **Migration path**: incrementally converting JS → TypeScript, file-by-file. Prefer strict typing, avoid `any`.
- **Never claim something works unless verified** — say "unverified" if it wasn't actually run or traced.
- **New dependencies**: flag explicitly, name the tradeoff, wait for confirmation.
- **Tests**: state what each test exercises AND what it doesn't. Flag trivially-passing tests. Pagination/chunking/resize tests must simulate real async timing, not fixed waits.
- **With UIX and feature updates, run tests and write new tests as needed**

## Deployment

GitHub Pages via `.github/workflows/deploy.yml`. Deploys `./web` directory on push to `master`. No build step.

## Tech Stack

- **Pure vanilla JS/HTML5/CSS3** — no framework, no build tooling, no npm in production
- **ES6+**: arrow functions, async/await, destructuring, Map/Set, Promises
- **IndexedDB**: versioned offline cache for quotes, bios, and work data
- **localStorage**: reader settings, bookmarks, open books, last reading positions
- **Testing**: Playwright (chromium/webkit/firefox), 22+ tests in `web/tests/`
- **Data pipeline**: Python 3 scripts + shell (`web/stoics/ingest.sh`)

## Directory Structure

```
/
├── CLAUDE.md
├── README.md
├── TODO.md
├── stoics.epub
├── iOSNative/
└── web/
    ├── index.html              # Single-page app entry point
    ├── script.js               # Main app logic (~2,000 lines)
    ├── script-worker.js        # Web Worker stub (not yet integrated)
    ├── style.css               # Responsive CSS, dark/day themes, reader UI
    ├── favicon.png
    ├── data-meta.json          # Authors, works, curation metadata (v1.5.1)
    ├── data-all-quotes.json    # 1,217 curated quotes [{workId, location, quote}]
    ├── img/                    # Logos, brand images
    ├── stoics/                 # Per-author data dirs + ingestion scripts
    │   ├── aurelius/
    │   │   ├── meditations.json   # [indexList, partitions, timeline]
    │   │   ├── bio-marcus.html    # HTML bio snippet (inserted as-is into modal)
    │   │   └── marcus.jpg
    │   ├── epictetus/ seneca/ cicero/ plutarch/ diogenes/ hierocles/
    │   ├── parse_stoic_sources.py
    │   ├── ingest.sh
    │   ├── curation-policy.json
    │   └── ingestion-queue.json
    ├── FAKE_DATA/              # Test data generation
    └── tests/
        ├── stoic-reader.spec.js
        ├── package.json
        └── node_modules/
```

## How Text Files Are Loaded & Parsed

### Startup
1. `fetch('data-meta.json')` → loads all author and work metadata
2. Restore reader state, settings, bookmarks from localStorage
3. Check IDB cache version; if stale, fetch `data-all-quotes.json` from network and repopulate IDB

### Work Data (lazy-loaded)
- Only fetched when user opens a work in the reader
- `getWorkData(work)` → check IDB → fetch `stoics/{author}/{work}.json` → cache in IDB

### Work File Format
Each work is a JSON tuple: `[indexList, partitions, timeline]`
- **indexList**: `["1", "2", "3.4", ...]` — dot-separated location markers for section boundaries
- **partitions**: `["<h2 id='1'>...</h2><p id='1.1'>...</p>...", ...]` — HTML content chunks; IDs are the canonical location strings
- **timeline** (optional, v1.5+): `{ids, wordOffsets, totalWords}` — enables accurate word-based progress tracking

### Quote File Format
`data-all-quotes.json`: flat array of `{workId, location, quote}` objects. Location is dot-separated (e.g., `"4.7"` = Book 4 Verse 7).

### Location System
- Dot-separated numeric strings: `"2.16"` = Book 2, Verse 16
- `versionCompare("2.16", "3.4")` used to find correct partition for a location
- CSS.escape used when querying by id: `CSS.escape('3.4')` → `"3\\.4"`

## Key Conventions & Patterns

### Global State
Single `appState` object holds all runtime state:
- `currentQuote`, `currentWork`, `currentAuthor`, `currentView`
- `openBooks`: array of `{workId, location, minimized, fullscreen}`
- `readerSettings`: theme, font, spacing, largeText
- `bookmarks`: `[{key, workId, location, createdAt}]`
- `readerViews`: Map of cached DOM per work
- `readerChunks`: Map with `{chunks, previousChunkIndex, nextChunkIndex, timeline}`

### Reader Rendering
- **Chunking**: work content split into ≤16KB chunks to avoid DOM overload
- `appendNextReaderChunk()` / `prependPreviousReaderChunk()`: demand-loaded on scroll/page-turn
- **Fullscreen spread**: two-column layout on desktop (≥900px); single-column scroll on mobile
- **Anchor tracking**: viewport intersection used to track current reading position
- `waitForStableReaderLayout()`: polls for 2+ identical geometry measurements before anchor calculation (font rendering stability)

### State Persistence
- **Epoch pattern**: `readerStateEpoch` rotated on reset; stale localStorage writes ignored if epoch mismatches
- **Render token**: `readerRenderToken` incremented per render; async callbacks check token to prevent race conditions

### Modal System
- CSS-driven via `#modal-toggle` checkbox (no JS for show/hide)
- Modes: standard, reader (with progress bar + page controls), settings

### Menu System
- Nested checkboxes with CSS `:checked + label + ul` — collapse/expand with no JS

### Daily Quote
```javascript
Math.ceil(Date.now() / (1000 * 3600 * 24)) % quotePool.length
```
Deterministic per UTC day; same result for all users on the same day.

### Responsive Breakpoints
- `<768px`: hamburger menu, single-column, hidden footer
- `≥900px`: two-column fullscreen reader layout

## Gotchas & Constraints

- **No full-text search**: quotes are pre-curated; no in-work search
- **Chat is stubbed**: `showChat()` returns immediately — backend + LLM not yet implemented
- **Web Worker unused**: `script-worker.js` is skeleton only
- **Mobile fullscreen reader disabled**: fullscreen spread requires ≥900px
- **URL does not update** during navigation (no history API integration)
- **MINIMUM_LOADING_TIME = 350ms**: artificial minimum to prevent flash of loading indicator
- **Bio HTML is raw snippets**: `bio-{author}.html` files have no outer document tags; inserted via `innerHTML`
- **No CI**: no GitHub Actions workflow exists yet
- **Visual regression baselines**: Playwright snapshots not yet captured
- **Some bios/chat UI may be GPT-generated**: treat as placeholder content pending review

## Library Tiers & Curation

- **Core tier**: Marcus Aurelius, Epictetus, Seneca, selected Cicero (default visible)
- **Extended tier**: Plutarch, Diogenes Laertius, Hierocles (opt-in)
- **Scope tags**: `stoic` vs `related` (Cicero) — affects chat scope filtering
- Work metadata requires: `tier`, `scope`, `genre`, `difficulty`, `estimatedReadingMinutes`, `sourceProfile`

## Data Pipeline

Run from `web/stoics/`:
```bash
./ingest.sh
```
Orchestrates `parse_stoic_sources.py` → compiles per-work JSON + updates `data-all-quotes.json`. Supports parser profiles: `gutenberg`, `gutenberg-bilingual`, `local-json`.

## Running Locally

```bash
cd web
python3 -m http.server 8080
```

## Running Tests

```bash
cd web/tests
npx playwright test
```


# Git Workflow

The agent should make small, logical commits.

After completing a coherent unit of work:

1. Review the changes.
2. Run tests for the affected code.
3. Ensure `git status` is clean except for intended changes.
4. Commit with a descriptive message.
5. Push to the current feature branch.
6. Report:
   - branch name
   - commit hash
   - test results
   - files changed

Never claim a commit or push succeeded unless the command completed successfully.

If any git command fails, stop immediately, explain why, and ask for guidance instead of assuming success.


# Branching

- Never commit directly to main.
- Create feature branches.
- Keep commits focused and small.
- Prefer many small commits over one large commit.


# Validation

Before declaring a task complete:

- TypeScript builds successfully.
- Tests pass.
- Linter passes.
- No TODOs introduced without explanation.
- Working tree is clean.



