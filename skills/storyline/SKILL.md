---
name: storyline
description: >-
  Maintains living feature docs under specs/: user stories, flows, acceptance,
  and product intent (why/what), with review-optimized file splits.
  Updates specs/OVERVIEW.md for the big picture and specs/STORY-MAP.md for
  the user journey. Use for every coding task, product-intent discussion, or
  when the user asks for documentation. When the user edits specs and asks to
  implement, treat updated specs as the source of truth and close gaps in code.
---

# Storyline

## What specs are for

Specs are **durable intent**: who the feature is for, **why** it exists, **what** users should experience, and **acceptance** in plain language. They are **not** a substitute for code—avoid class names, long endpoint lists, and implementation walkthroughs unless a short **technical requirement** matters (e.g. "must call registry X", "no PII in logs").

## Multi-repo workspaces

When the workspace contains **multiple repos** (e.g. a backend and a frontend side by side), specs can live at **two levels**:

- **`specs/`** (workspace root) — **product-level** specs that span repos or describe cross-cutting features.
- **`<repo>/specs/`** — repo-specific feature specs scoped to that codebase.

When a feature touches **multiple repos**, use the top-level `specs/`. When it lives entirely in one repo, use that repo's `specs/` folder. Link between levels when useful.

## Always do this alongside implementation

Whenever you **write or materially change** application code (features, bugfixes, refactors, migrations, config that affects behavior), also **update or create** the relevant spec under `specs/`, **touch `specs/OVERVIEW.md` when the big picture shifts**, and **update `specs/STORY-MAP.md` when the user journey changes**.

If the user **only** explores or asks questions without changing behavior, you may **read** specs and code without writing files unless they ask you to document something.

## Layout

- **`specs/OVERVIEW.md`** — product- and system-level **orientation** (what the service offers, main capabilities in user terms, who it's for).
- **`specs/STORY-MAP.md`** — user story map: top-level activities, steps within each, and links to feature specs. This is how features relate to each other in the user journey.
- **`specs/INDEX.md`** — master directory of all feature specs.
- **`specs/ARCHITECTURE.md`** — optional; only for **non-obvious structural patterns**.
- **Feature specs** — each feature lives in a folder with focused files (see **Feature folder shape** below).

Do not put specs only in chat; they belong in `specs/`.

### Story map (`specs/STORY-MAP.md`)

The story map organizes the **entire product** as a user journey. Each **activity** is a top-level user goal; **steps** within each activity link to feature specs.

```markdown
# Story map

## Manage my vehicle
- Add vehicle → [vehicle/](vehicle/SPEC.md)
- View timeline → [vehicle/](vehicle/SPEC.md)
- Record event → [vehicle/](vehicle/SPEC.md)

## Get vehicle serviced
- Request quotes → [quotes/](quotes/SPEC.md)
- Book appointment → [booking/](booking/SPEC.md)
```

Update when you add a new feature or when a feature's position in the user journey changes.

### Scaling: area folders and indexes

As the number of features grows, keep **navigation** cheap for humans and agents.

- Introduce `specs/<area>/` groupings when **~8+ feature folders** exist or clear bounded contexts emerge.
- **`specs/INDEX.md`** holds the complete spec catalog. **`OVERVIEW.md`** stays short with links.
- Every feature has **exactly one canonical entry file**: `SPEC.md` (Changelog lives there).

## Feature folder shape

**Default:** a single **`SPEC.md`** with the full template (below). Good for small or young features.

**Split when** the spec grows or when you want **review-ready** focused files. Each file maps to a clear review question—one file, one focus. **Use 4 files, not 10.**

```text
specs/<feature>/
  SPEC.md              # entry point + one-line summary + changelog
  intent.md            # why this exists, who it's for, how it fits in the journey
  acceptance.md        # testable pass/fail criteria only
  design.md            # systems, data model, API — how we build it
  risks.md             # what can go wrong, scope boundaries, open questions

  reviews/             # saved review results (auto-generated)
```

| File | Focus | Review question |
|------|-------|----------------|
| **`SPEC.md`** | Entry point + changelog | — |
| **`intent.md`** | Problem, actors, journey, Mermaid diagrams | "Why are we building this and for whom?" |
| **`acceptance.md`** | Testable pass/fail criteria | "How do we know it's done?" |
| **`design.md`** | Systems, data, API, UI hints | "How are we building it?" |
| **`risks.md`** | Failure modes, edge cases, scope in/out, open questions | "What could go wrong and what's out of scope?" |

**Files are optional.** If a feature has no technical design worth discussing, skip `design.md`. Missing files are auto-skipped in review.

Rules:

- **`SPEC.md` is always the canonical entry** (and holds **Changelog**).
- Split only when it **reduces noise** for reviewers—not to fill every template.
- Mermaid diagrams live in **`intent.md`** when split; otherwise in **`SPEC.md`**.
- **Backward compatibility:** the review tool also recognizes legacy filenames (`problem.md`, `actors.md`, `journey.md`, `systems.md`, `data.md`, `api.md`, `scope.md`, `ui.md`). Old specs keep working. New specs should use the 4-file structure.

## File templates

### `SPEC.md` (single-file, before splitting)

```markdown
# <Feature title>

## Why
<!-- Problem or opportunity; why we're building this -->

## Who & context
<!-- Actors: end user, workshop, admin, system. When they encounter this -->

## User flows
<!-- Numbered or short steps: happy path + important edge paths -->

## Acceptance / outcomes
<!-- Bullet checklist in plain language—what must be true when done -->

## Scope
- In: …
- Out: …

## Technical requirements (keep short)
<!-- Only non-obvious constraints -->

## Open questions
<!-- Unresolved product or policy questions -->

## Changelog
- YYYY-MM-DD: …
```

### `SPEC.md` (index when split)

```markdown
# <Feature title>

One-line summary.

[intent](intent.md) · [acceptance](acceptance.md) · [design](design.md) · [risks](risks.md)

## Changelog
- YYYY-MM-DD: …
```

### `intent.md`

```markdown
# <Feature> — intent

## The problem
<!-- What is broken, missing, or painful? Be specific. -->

## Why it matters
<!-- Impact of inaction — what happens if we don't solve this? -->

## Who uses this
<!-- Primary users: role, context, frequency. Secondary users. Who does NOT use this. -->

## User flow
<!-- Numbered steps: happy path + key alternatives. Entry and exit points. -->

## Flow diagram (optional)
<!-- Mermaid when branches or multiple actors make text hard to follow -->
```

### `acceptance.md`

```markdown
# <Feature> — acceptance

Each item must be verifiable with a clear yes/no test.

- [ ] …
- [ ] …
```

### `design.md`

```markdown
# <Feature> — design

## Systems affected
<!-- Which repos, packages, services change? Key files/controllers. -->

## Data model
<!-- Tables, columns, relationships, migrations. Skip if no DB changes. -->

## API
<!-- Endpoints, methods, contracts. Skip if no API. -->

## UI / integration (optional)
<!-- Screens, states, error handling — only when helpful for discussion. -->
```

### `risks.md`

```markdown
# <Feature> — risks & scope

## Scope
- In: …
- Out: …

## Open questions
<!-- Unresolved product or policy decisions that could change scope -->

## Failure modes
<!-- What can go wrong? Network, race conditions, data loss, edge cases -->

## Load & recovery
<!-- Expected volume, hot paths, recovery strategy. Skip if not relevant. -->
```

## New work vs continuing work

**Before changing code**, decide which spec folder applies:

1. **Continuing** — update the **right file(s)** for what changed; **always** append **`SPEC.md` Changelog**.
2. **New** → create `specs/<feature-slug>/SPEC.md`; add to **`OVERVIEW.md`**, **`INDEX.md`**, and **`STORY-MAP.md`**.

### `OVERVIEW.md` — when to edit

Update when capabilities, integrations, or product boundaries change. Small edits + one Changelog line.

### `STORY-MAP.md` — when to edit

Update when a new feature is added, or when a feature's position in the user journey changes.

## How specs relate to code

- **Specs lead with outcomes and flows.** After code changes, update the spec so **acceptance** matches what users get.
- **Use code as truth for "how".** Pointers to code go in `design.md`, never a full implementation map.
- **Technical requirements** = constraints the product cares about (legal, security, latency, compatibility).

## Concision rules

- Prefer **scenarios** over abstract feature lists.
- **Examples** beat generic rules.
- **Changelog**: reverse-chronological, one line per material change.

## Two-way flow (spec ↔ code)

- **Code changed** → same session, update relevant files; **`SPEC.md` Changelog** always; **`OVERVIEW.md`** only when capabilities shift; **`STORY-MAP.md`** when journey changes.
- **User edits spec** → treat as **product intent**; implement or track unknowns in `risks.md` (scope section).

### Spec-led workflow

When the user **edits `specs/`** and asks to implement:

1. **Find the feature folder** via `specs/INDEX.md` or `OVERVIEW.md`.
2. **Read all files** in the folder — especially `acceptance.md` and `risks.md`.
3. **Treat the spec as authoritative** for what and why; change code to match.
4. **After implementation** — update files only if reality differs; append `SPEC.md` Changelog.

## Prompts

| Trigger | What to do |
|---------|------------|
| **"refresh overview"** | Update `specs/OVERVIEW.md`. Trim bloat. Append Changelog. |
| **"implement from spec"** | Read the feature's files, compare to code, list gaps, implement, append Changelog. |
| **"sync feature"** | Update spec files to match current code. Append Changelog. |
| **"split feature"** | Split `SPEC.md` into the 4 focused files (`intent.md`, `acceptance.md`, `design.md`, `risks.md`). Make `SPEC.md` an index. Append Changelog. |
| **"consolidate feature"** | Merge old 10-file specs into 4 files: `problem.md` + `actors.md` + `journey.md` → `intent.md`; `systems.md` + `data.md` + `api.md` + `ui.md` → `design.md`; `risks.md` + `scope.md` → `risks.md`. Keep `acceptance.md`. Remove the old files. Update `SPEC.md` index links. Append Changelog. |
| **"add flow diagram"** | Add or refresh Mermaid in `intent.md` (or `SPEC.md` if not split). Append Changelog. |
| **"prepare for review"** | Check review readiness: (1) `intent.md` has problem, users, and flow, (2) `acceptance.md` has testable criteria, (3) `risks.md` has scope in/out, (4) Changelog has today's entry. Report pass/fail per item. Fix what you can without changing intent. If `storyline-review/` exists, remind the user to run `cd storyline-review && npm run dev`. |
| **"update story map"** | Refresh `specs/STORY-MAP.md` to reflect current features and their journey positions. |
| **"start review"** / **"/storyline-review"** | Create a hosted collaborative review session. See **Hosted review workflow** below. |

## Hosted review workflow

When the user says **"start review"**, **"/storyline-review"**, or **"create a review session"**:

1. **Check for changed specs** — identify which feature spec files have been modified recently (default: last 7 days). Summarize what changed.
2. **Ask the user** which review type to create:
   - **Product review** — intent, acceptance
   - **Architecture review** — design, risks
   - **Focus review** (default) — only files that actually changed
3. **Create the session** using the CLI:
   ```bash
   cd storyline-review/cli && npx tsx index.ts create --since 7d
   # or for architecture: npx tsx index.ts create --since 7d --arch
   ```
4. **Present the output** — the CLI prints a review URL and a share link. Tell the user:
   - "Here's your review session: `<review URL>`"
   - "Share this link with your team: `<share link>`"
   - "Anyone with the share link can join without an account."
5. **After the review** — when the user says "apply review" or "export review":
   ```bash
   cd storyline-review/cli && npx tsx index.ts export <session-id> --out specs/reviews/
   ```
   Then read the exported markdown and help apply any agreed changes to the specs.

### CLI configuration

If the hosted server is not the default, configure it first:
```bash
cd storyline-review/cli && npx tsx index.ts config https://your-server.vercel.app
```

## Install

```bash
npx skills add bjornno/skills --skill storyline
```
