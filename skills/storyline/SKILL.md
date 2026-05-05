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
| **"prepare for review"** | Check review readiness: (1) `intent.md` has problem, users, and flow, (2) `acceptance.md` has testable criteria, (3) `risks.md` has scope in/out, (4) Changelog has today's entry. Report pass/fail per item. Fix what you can without changing intent. If the review tool directory exists, remind the user to run `npm run dev` in it. |
| **"update story map"** | Refresh `specs/STORY-MAP.md` to reflect current features and their journey positions. |
| **"apply review"** | Read an exported review from `specs/reviews/`, identify concerns and blockers, update the relevant spec files to address them, and append Changelog entries. See **Applying a review** below. |
| **"start review"** / **"/storyline-review"** / **"create a review"** | Run `npx storyline-review create` to create a hosted review. See **Hosted review workflow** below. |

## Proactive review suggestions

After completing a **non-trivial code change** (new feature, significant refactor, API change, schema migration, security-relevant change), **suggest creating a review** before moving on:

> "This change touches [area]. Want me to create a review so your team can weigh in? I can create a **product review** (challenges product decisions) or an **architecture review** (challenges technical decisions)."

Triggers for suggesting a review:
- New feature or significant extension of an existing one
- Changes to API contracts, database schema, or auth/security logic
- Refactors that change system boundaries or data flow
- Any change the user explicitly marked as needing discussion

**Do not suggest** for: typo fixes, formatting, dependency bumps, config tweaks, or test-only changes.

When the user agrees, run the appropriate CLI command immediately — don't ask them to run it themselves.

## Hosted review workflow

When the user says **"start review"**, **"/storyline-review"**, **"create a review"**, or you proactively suggest one:

### Two review types

| Type | Flag | What Storyline looks for |
|------|------|-------------------|
| **Product** (default) | `--product` or no flag | The most important product risk: intent drift, scope creep, weak problem definition, missing success criteria, contradictions, premature implementation, risk escalation |
| **Architecture** | `--arch` | The most important technical risk: API design issues, data model problems, security gaps, tech debt, scalability risks, missing abstractions |

Both types find **one critical question** and create a structured discussion around it. Choose product for "are we building the right thing?" and architecture for "are we building it the right way?"

### Creating a review

1. **Default — product review of the latest commit** (right choice most of the time):
   ```bash
   npx storyline-review create
   ```

2. **Architecture review:**
   ```bash
   npx storyline-review create --arch
   ```

3. **Other scopes:**
   ```bash
   # Specific commit (by hash or ref):
   npx storyline-review create --commit abc1234

   # Current branch vs main:
   npx storyline-review create --branch

   # Changes from a time range:
   npx storyline-review create --since 3d

   # Named feature (appears in session title):
   npx storyline-review create --feature onboarding

   # Preview what would be sent without creating:
   npx storyline-review create --dry-run

   # Interactive wizard (choose scope + type step by step):
   npx storyline-review create -i
   ```

4. **Combine flags** as needed:
   ```bash
   npx storyline-review create --arch --branch --feature auth-rework
   ```

### After running the command

The CLI prints a review URL and a join code. Tell the user:
- "Here's your review: `<URL>`"
- "Share this with your team — anyone with the link can join without an account."
- "Join code: `<CODE>` (teammates can use this at storyline-review.vercel.app)"
- "Storyline found the most critical [product/technical] risk in your changes."

### After the review is complete

When the user says "apply review" or "export review":
```bash
npx storyline-review export <session-id>
```
Then read the exported markdown and help apply any agreed changes to specs and code.

### First-time setup

Login is required once before creating reviews:
```bash
npx storyline-review login
```

If using a custom server (not the default):
```bash
npx storyline-review config https://your-server.vercel.app
```

## GitHub Actions — automatic reviews on PRs

Storyline can automatically evaluate every PR and create reviews when changes are non-trivial. The workflow reviews the **full PR branch diff** against main — not just the last commit. Trivial changes (typos, formatting, version bumps, tiny diffs) are skipped without costing an API call.

### Setup

The fastest way:

```bash
npx storyline-review login            # get an API key (one-time)
npx storyline-review setup-github     # writes workflow file + helps set the secret
```

`setup-github` does three things:
1. Creates `.github/workflows/storyline-review.yml` in your repo
2. Detects your GitHub remote and prints a direct link to the secrets page
3. If the `gh` CLI is installed, offers to set `STORYLINE_API_KEY` automatically

Then commit, push, and open a PR to see it in action.

**Manual setup** (if you prefer):
1. Get an API key — `npx storyline-review login`, then `npx storyline-review whoami`.
2. Add `STORYLINE_API_KEY` as a GitHub Actions secret (Settings > Secrets > Actions).
3. Copy the workflow file from the storyline-review repo to `.github/workflows/storyline-review.yml`.

**Optional: custom server** — set the `STORYLINE_SERVER` repository variable if you self-host.

### CI flags reference

```bash
npx storyline-review create --json --skip-trivial                    # product review, JSON output, skip if trivial
npx storyline-review create --arch --json --skip-trivial             # architecture review for CI
npx storyline-review create --branch feature/xyz --json              # full branch diff vs main (used by GH Action)
npx storyline-review create --commit abc1234 --json                  # specific commit diff
npx storyline-review config <url> --key <key>                        # non-interactive auth
```

`--json` outputs machine-readable JSON:
```json
{ "ok": true, "trivial": false, "sessionId": "...", "reviewUrl": "...", "shareUrl": "...", "joinCode": "ABC123", "mode": "product" }
```

When trivial: `{ "ok": true, "trivial": true, "reason": "..." }`

`--skip-trivial` exits cleanly (exit 0, no API call) when the CLI detects a trivial change. Without it, `--json` still reports trivial but makes the API call.

## Applying a review

When the user says **"apply review"**, or has an exported review file they want to act on:

1. **Find the review file** — look in `specs/reviews/` for the most recent `.md` file (or the specific file the user references).
2. **Parse the review** — the exported markdown has this structure:
   - Header with date, scope, mode, and participants
   - Sections grouped by feature path (e.g. `## cli`, `## export`)
   - Under each feature, subsections per spec file (e.g. `### acceptance`)
   - Each verdict entry: participant name, verdict (OK/CONCERN/BLOCKER), and comment
3. **Triage by verdict:**
   - **OK** — no action needed, the reviewer approved this file.
   - **CONCERN** — read the comment, decide if the spec should be updated. Present each concern to the user with a proposed change.
   - **BLOCKER** — these must be resolved. Read the comment, propose a concrete spec update, and ask the user to confirm before applying.
4. **Apply to specs** — for each concern/blocker the user agrees to address:
   - Update the relevant spec file(s) under `specs/<feature>/`
   - Append a Changelog entry in `SPEC.md`: `- YYYY-MM-DD: Applied review feedback — <summary>`
5. **Apply to code** — after specs are updated, treat the changed specs as the source of truth:
   - Read the updated spec files (especially `acceptance.md` and `design.md`)
   - Compare to current code — identify gaps where code doesn't match the updated spec
   - Implement the changes, following the spec-led workflow (see **Spec-led workflow** above)
   - Update `design.md` with any new code pointers if the implementation changed significantly
6. **Report** — after applying, summarize what was changed in both specs and code, and what was left as-is (with reasons).

If the review file is not in `specs/reviews/`, ask the user to run:
```bash
npx storyline-review export <session-id>
```

## Install

```bash
npx skills add bjornno/skills --skill storyline
```
