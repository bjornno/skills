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

**Split when** the spec grows or when you want **review-ready** focused files. Each file maps to a specific review question—one file, one focus.

```text
specs/<feature>/
  SPEC.md              # entry point + one-line summary + changelog

  # Product review files
  problem.md           # 5 Whys: root cause, why this matters
  actors.md            # who uses this, roles, contexts, personas
  journey.md           # story map placement, entry/exit points, flow steps + diagram
  acceptance.md        # testable pass/fail criteria only

  # Architecture review files
  systems.md           # which repos/packages/services are affected, pointers to code
  data.md              # tables, columns, migrations, relationships, volume
  api.md               # endpoints, methods, contracts, breaking changes
  risks.md             # load patterns, failure modes, edge cases, recovery

  # Cross-cutting
  scope.md             # in/out, open questions, deferred items
  ui.md                # frontend integration hints (optional)

  reviews/             # saved review results (auto-generated)
```

| File | Focus | Review step it serves |
|------|-------|----------------------|
| **`SPEC.md`** | Entry point + changelog | — |
| **`problem.md`** | Why this exists; 5 Whys root cause | Product: "What problem are we solving?" |
| **`actors.md`** | Who uses this, roles, personas, contexts | Product: "Who is the user?" |
| **`journey.md`** | Story map position, entry/exit points, flow steps, Mermaid diagram | Product: "Where does this fit in the journey?" |
| **`acceptance.md`** | Testable pass/fail criteria | Product: "Are acceptance criteria testable?" |
| **`systems.md`** | Which repos/packages change, pointers to code | Architecture: "Which systems are affected?" |
| **`data.md`** | Tables, columns, migrations, relationships | Architecture: "Data model impact?" |
| **`api.md`** | Endpoints, methods, contracts | Architecture: "API design?" |
| **`risks.md`** | Load, failure modes, edge cases, recovery | Architecture: "What can go wrong?" |
| **`scope.md`** | In/out boundaries, open questions | Both: "Is the scope right?" |
| **`ui.md`** | Frontend integration hints | Cross-cutting |

**Files are optional.** If a feature has no database changes, skip `data.md`. If there's no API, skip `api.md`. Missing files are auto-skipped in review.

Rules:

- **`SPEC.md` is always the canonical entry** (and holds **Changelog**).
- Split only when it **reduces noise** for reviewers—not to fill every template.
- Mermaid diagrams live in **`journey.md`** when split; otherwise in **`SPEC.md`**.

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

[problem](problem.md) · [actors](actors.md) · [journey](journey.md) · [acceptance](acceptance.md) · [systems](systems.md) · [data](data.md) · [api](api.md) · [risks](risks.md) · [scope](scope.md) · [ui](ui.md)

## Changelog
- YYYY-MM-DD: …
```

### `problem.md`

```markdown
# <Feature> — problem

## The problem
<!-- What is broken, missing, or painful? Be specific. -->

## 5 Whys
1. Why? …
2. Why? …
3. Why? …
4. Why? …
5. Why? … (root cause)

## What happens if we don't solve this?
<!-- Impact of inaction -->
```

### `actors.md`

```markdown
# <Feature> — actors

## Primary users
<!-- Who directly uses this? Role, context, frequency -->

## Secondary users
<!-- Who is affected indirectly? Admin, system, other roles -->

## Non-users
<!-- Who explicitly does NOT use this? Helps scope -->
```

### `journey.md`

```markdown
# <Feature> — journey

## Story map position
- **Activity:** <top-level user goal from STORY-MAP.md>
- **Step:** <which step within that activity>
- **This feature:** <what it does in that step>

## Entry points
- From: <what the user was doing before>

## Exit points
- To: <where the user goes next>

## Flow
1. …
2. …

## Flow diagram (optional)
<!-- Mermaid when branches/actors make text hard to follow -->
```

### `acceptance.md`

```markdown
# <Feature> — acceptance

Each item must be verifiable with a clear yes/no test.

- [ ] …
- [ ] …
```

### `systems.md`

```markdown
# <Feature> — systems

## Affected repos/packages
<!-- Which parts of the codebase change? -->

## Pointers to code
<!-- Key files, packages, controllers — at most a few lines -->
```

### `data.md`

```markdown
# <Feature> — data model

## New/changed tables
<!-- Table name, key columns, relationships -->

## Migrations
<!-- Migration file reference, backward compatibility -->

## Data volume
<!-- Expected row counts, growth rate -->
```

### `api.md`

```markdown
# <Feature> — API

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| … | … | … |

## Breaking changes
<!-- Any? Migration path? -->

## Auth requirements
<!-- Which roles/scopes needed per endpoint -->
```

### `risks.md`

```markdown
# <Feature> — risks

## Load patterns
<!-- Expected request volume, hot paths, caching needs -->

## Failure modes
<!-- What can go wrong? Network, race conditions, data loss -->

## Recovery
<!-- How does the system recover from each failure? -->

## Edge cases
<!-- Non-obvious scenarios that could break things -->
```

### `scope.md`

```markdown
# <Feature> — scope

## In
- …

## Out
- …

## Open questions
<!-- Unresolved product or policy questions -->

## Deferred
<!-- Things we decided to do later, with context on why -->
```

### `ui.md`

```markdown
# <Feature> — UI / app integration hints

## Auth & context
## Screens / flows → API (high level)
## Dynamic behaviour
## Errors & empty states
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
- **Use code as truth for "how".** Pointers to code go in `systems.md`, never a full implementation map.
- **Technical requirements** = constraints the product cares about (legal, security, latency, compatibility).

## Concision rules

- Prefer **scenarios** over abstract feature lists.
- **Examples** beat generic rules.
- **Changelog**: reverse-chronological, one line per material change.

## Two-way flow (spec ↔ code)

- **Code changed** → same session, update relevant files; **`SPEC.md` Changelog** always; **`OVERVIEW.md`** only when capabilities shift; **`STORY-MAP.md`** when journey changes.
- **User edits spec** → treat as **product intent**; implement or track unknowns in `scope.md`.

### Spec-led workflow

When the user **edits `specs/`** and asks to implement:

1. **Find the feature folder** via `specs/INDEX.md` or `OVERVIEW.md`.
2. **Read all files** in the folder — especially `acceptance.md` and `scope.md`.
3. **Treat the spec as authoritative** for what and why; change code to match.
4. **After implementation** — update files only if reality differs; append `SPEC.md` Changelog.

## Prompts

| Trigger | What to do |
|---------|------------|
| **"refresh overview"** | Update `specs/OVERVIEW.md`. Trim bloat. Append Changelog. |
| **"implement from spec"** | Read the feature's files, compare to code, list gaps, implement, append Changelog. |
| **"sync feature"** | Update spec files to match current code. Append Changelog. |
| **"split feature"** | Split `SPEC.md` into the focused files (problem, actors, journey, acceptance, systems, data, api, risks, scope). Make `SPEC.md` an index. Append Changelog. |
| **"ui hints"** | Add or update `ui.md`. Append Changelog. |
| **"add flow diagram"** | Add or refresh Mermaid in `journey.md` (or `SPEC.md` if not split). Append Changelog. |
| **"prepare for review"** | Check review readiness: (1) `problem.md` has specific root cause, (2) `actors.md` lists all roles, (3) `journey.md` has story map position + flows, (4) `acceptance.md` has testable criteria, (5) `scope.md` has in/out, (6) Changelog has today's entry. Report pass/fail per item. Fix what you can without changing intent. If `storyline-review/` exists, remind the user to run `cd storyline-review && npm run dev`. |
| **"update story map"** | Refresh `specs/STORY-MAP.md` to reflect current features and their journey positions. |
| **"start review"** / **"/storyline-review"** | Create a hosted collaborative review session. See **Hosted review workflow** below. |

## Hosted review workflow

When the user says **"start review"**, **"/storyline-review"**, or **"create a review session"**:

1. **Check for changed specs** — identify which feature spec files have been modified recently (default: last 7 days). Summarize what changed.
2. **Ask the user** which review type to create:
   - **Product review** — problem, actors, journey, acceptance, scope
   - **Architecture review** — systems, data, API, risks, scope
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
