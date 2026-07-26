# The Stoic Reader — project context

A reader app for classic/public-domain works.

## Core features (current)
1. Reader — clean reading UI, works across all screen sizes
2. Classics focus — curated public-domain philosophy/classics library
3. Quote of the Day
4. Stoic Chat — chat with an AI Audio Visual "voice / talking head" of a classical author
5. The Aurelius Fund — veterans charity link + donation CTA

## Planned (not yet built — don't scaffold unless asked)
- AI audio reading functionality
- Accessibility pass (screen reader, dyslexia-friendly modes, etc.)
- "Import any book" — Gutenberg/free-use book browser (maybe a separate app)

## Migration goal
Migrating JS -> TypeScript, incrementally, with PWA/mobile support as the
end target. Prefer strict typing over `any`. Convert file-by-file rather
than repo-wide rewrites unless asked.

## Style
- Minimal, readable, no unnecessary abstraction layers.
- No unrequested features, TODOs, or "future-proofing" scaffolding, unless asked and tasked.
- Match existing patterns in the file being edited before introducing new ones.


# Personal coding preferences

- Write clean, minimal, stripped-down code. No defensive over-engineering,
  no speculative abstraction, no comments explaining what the code obviously does.
- Prefer explicit over clever. No magic, no hidden control flow.
- Do not pad responses with caveats, reassurance, or "great question" style
  framing. State the change, show the diff, move on.
- If something is ambiguous, make the most reasonable call and note the
  assumption in one line — don't ask unless it genuinely blocks the task, or
  presents a risk to derailing the direction and intent of the task.
- Never claim something works, was tested, or is complete unless it actually
  was. If unverified, say so explicitly. Do not guess and present it as fact.
- I am an experienced engineer — skip beginner explanations unless asked.

## Anti-sycophancy / anti-doubling-down

- If I push back on your solution, do not assume I'm right and immediately
  agree. Re-examine the actual problem first. If your original approach was
  correct, say so and explain why, even if I seem unhappy with it.
- If a fix doesn't work, do not re-apply small variations of the same failed
  approach. Stop, state explicitly what you tried and why you think it failed,
  and propose a genuinely different approach or ask for more information.
- Never say something is "fixed," "working," or "should work now" unless you
  have actually verified it (ran it, traced the logic, or have direct evidence).
  "This should resolve it" is only acceptable when paired with your actual
  confidence level and what would prove it wrong.
- If you're not sure why something failed, say "I don't know why this is
  failing" explicitly rather than offering a plausible-sounding guess as fact.
- I will ask "are you sure?" or push back sometimes specifically to test your
  reasoning, not because I already know the answer. Don't treat pushback as
  a signal to capitulate.

## Dependency policy

- Default to writing custom, mathematically-reasoned logic over pulling in a
  package, even for things like pagination math, text measurement, chunking,
  or layout calculations. This is a deliberate architectural choice, not a
  gap to fill.
- Before suggesting or adding any new dependency (including for tests, build
  tooling, or dev-only use), explicitly flag it and explain what it would
  replace and why a custom implementation isn't preferable. Wait for
  confirmation before adding it.
- Existing dependency footprint: package.json is currently scoped to test
  tooling only. index.html, one CSS file, script.js, and script-worker.js
  are the entire runtime app, with zero runtime dependencies. Preserve this.
- If solving something well genuinely requires a dependency (e.g. a PDF/image
  processing library for scanned manuscripts), say so explicitly, name the
  tradeoff, and let me decide — don't silently add it.

## Test-writing specifically

- When writing Playwright (or any) tests, do not consider a test "passing" a
  sufficient bar. State explicitly what behavior each test actually exercises
  and what it does NOT cover.
- Flag any test that passes trivially (weak assertion, doesn't hit the real
  async/timing path, mocks away the thing being tested) rather than letting
  it look equivalent to a meaningful test.
- For this app specifically: tests touching pagination, chunked loading, or
  viewport resize must actually simulate the async timing and resize events,
  not just check final DOM state after a fixed wait.


## Development Workflow

Work in small, coherent milestones rather than large batches of changes.

A milestone should represent a complete logical unit of work, such as:
- A feature implementation
- A completed refactor
- A resolved bug
- A finished TypeScript migration for a subsystem
- A complete test suite for a component

Avoid mixing unrelated changes into the same milestone.

---

## Validation Before Completion

Before declaring any milestone complete:

- Build the project (or affected packages).
- Run all relevant tests.
- Run linting and formatting if configured.
- Resolve all compilation or type errors introduced by the changes.
- Review the diff for unnecessary edits.
- Ensure only intended files have changed.

Do not declare success if any validation step fails.

---

## Git Workflow

After a milestone is complete:

1. Review the diff.
2. Stage only the intended files.
3. Create a descriptive commit.
4. Push to the current feature branch.

Never state that a commit or push was completed unless the Git command actually succeeded.

If a Git command fails:
- Report the exact error.
- Do not fabricate success.
- Ask for guidance if user intervention is required.

Always report:

- Current branch
- Commit hash
- Commit message
- Push status

---

## Branching Strategy

- Never commit directly to `main`.
- Work on feature branches.
- Prefer many small, reviewable commits over large commits.
- Keep each commit focused on one logical change.

---

## End-of-Session Report

At the end of every work session, provide a concise engineering handoff in this format:

### Session Summary

Completed:
- ...

Validation:
- Build: ✅ / ❌
- Tests: ✅ / ❌
- Lint: ✅ / ❌

Git:
- Branch:
- Last commit:
- Push status:

Repository Status:
- Working tree clean: Yes / No

Outstanding Issues:
- ...

Recommended Next Task:
- ...

Notes:
- Any important architectural decisions or assumptions made during this session.

Do not omit this summary, even if only a small amount of work was completed.
