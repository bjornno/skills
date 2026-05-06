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

## Mono-repo recommended

Storyline works best when specs and code live in the **same repo**. Specs travel with PRs, the GitHub Action reviews them together, and there's one source of truth.

If you have **separate repos** (e.g. backend and frontend), see the [multi-repo guide](MULTI-REPO.md) for workable patterns and trade-offs.

## Before you write any code

**Always read relevant specs first.** Find the feature folder via `specs/INDEX.md`, read the spec files — especially `acceptance.md` and `risks.md`. You need to know the existing intent and constraints before touching code, even for a bug fix.

## How to work: spec-first vs spec-after

**New features and significant changes** — spec first, then code, then reconcile:

1. **Draft specs** — create or update `intent.md` (why, who, flow) and `acceptance.md` (how we know it's done) **before writing code**. This is your plan.
2. **Implement** — write the code to satisfy the acceptance criteria.
3. **Reconcile** — update `design.md` with code pointers, check off acceptance items, fix any drift between plan and reality. Append `SPEC.md` Changelog. Touch `OVERVIEW.md` / `STORY-MAP.md` if the big picture shifted.

**Bug fixes, refactors, small changes** — code first, then update:

1. **Implement** the fix.
2. **Update specs** — adjust acceptance criteria if behavior changed, update `design.md` if structure changed, append `SPEC.md` Changelog. Touch `OVERVIEW.md` / `STORY-MAP.md` only when capabilities or journey change.

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

## Onboard new user
- Sign up → [signup/](signup/SPEC.md)
- Configure workspace → [workspace-setup/](workspace-setup/SPEC.md)
- Invite team → [invitations/](invitations/SPEC.md)

## Collaborate on projects
- Create project → [projects/](projects/SPEC.md)
- Assign tasks → [tasks/](tasks/SPEC.md)
- Review & approve → [reviews/](reviews/SPEC.md)
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

- **`SPEC.md`** — Entry point + changelog
- **`intent.md`** — Problem, actors, journey, Mermaid diagrams → "Why are we building this and for whom?"
- **`acceptance.md`** — Testable pass/fail criteria → "How do we know it's done?"
- **`design.md`** — Systems, data, API, UI hints → "How are we building it?"
- **`risks.md`** — Failure modes, edge cases, scope in/out, open questions → "What could go wrong and what's out of scope?"

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

**Before changing code**, find and read the relevant spec folder:

1. **Continuing** — read the existing specs, then follow the appropriate workflow (spec-first for significant changes, spec-after for small fixes). **Always** append **`SPEC.md` Changelog**.
2. **New** → create `specs/<feature-slug>/SPEC.md` with at least `intent.md` and `acceptance.md` **before implementing**; add to **`OVERVIEW.md`**, **`INDEX.md`**, and **`STORY-MAP.md`**.

### `OVERVIEW.md` — when to edit

Update when capabilities, integrations, or product boundaries change. Small edits + one Changelog line.

### `STORY-MAP.md` — when to edit

Update when a new feature is added, or when a feature's position in the user journey changes.

## How specs relate to code

- **Specs lead with intent and outcomes.** For new work, write acceptance criteria before coding. After implementation, reconcile so specs match what users actually get.
- **Use code as truth for "how".** Pointers to code go in `design.md`, never a full implementation map.
- **Technical requirements** = constraints the product cares about (legal, security, latency, compatibility).

## Concision rules

- Prefer **scenarios** over abstract feature lists.
- **Examples** beat generic rules.
- **Changelog**: reverse-chronological, one line per material change.

## Two-way flow (spec ↔ code)

- **New work** → read specs, draft intent + acceptance, implement, reconcile, append **`SPEC.md` Changelog**; **`OVERVIEW.md`** only when capabilities shift; **`STORY-MAP.md`** when journey changes.
- **Small fix** → read specs, implement, update relevant spec files, append **`SPEC.md` Changelog**.
- **User edits spec** → treat as **product intent**; implement or track unknowns in `risks.md` (scope section).

### Spec-led workflow

When the user **edits `specs/`** and asks to implement:

1. **Find the feature folder** via `specs/INDEX.md` or `OVERVIEW.md`.
2. **Read all files** in the folder — especially `acceptance.md` and `risks.md`.
3. **Treat the spec as authoritative** for what and why; change code to match.
4. **After implementation** — update files only if reality differs; append `SPEC.md` Changelog.

## Prompts

- **"refresh overview"** — Update `specs/OVERVIEW.md`. Trim bloat. Append Changelog.
- **"implement from spec"** — Read the feature's files, compare to code, list gaps, implement, append Changelog.
- **"sync feature"** — Update spec files to match current code. Append Changelog.
- **"split feature"** — Split `SPEC.md` into the 4 focused files (`intent.md`, `acceptance.md`, `design.md`, `risks.md`). Make `SPEC.md` an index. Append Changelog.
- **"consolidate feature"** — Merge old 10-file specs into 4 files: `problem.md` + `actors.md` + `journey.md` → `intent.md`; `systems.md` + `data.md` + `api.md` + `ui.md` → `design.md`; `risks.md` + `scope.md` → `risks.md`. Keep `acceptance.md`. Remove the old files. Update `SPEC.md` index links. Append Changelog.
- **"add flow diagram"** — Add or refresh Mermaid in `intent.md` (or `SPEC.md` if not split). Append Changelog.
- **"prepare for review"** — Check review readiness: (1) `intent.md` has problem, users, and flow, (2) `acceptance.md` has testable criteria, (3) `risks.md` has scope in/out, (4) Changelog has today's entry. Report pass/fail per item. Fix what you can without changing intent.
- **"update story map"** — Refresh `specs/STORY-MAP.md` to reflect current features and their journey positions.
- **"apply review"** — Read a review from `specs/reviews/`, identify concerns and blockers, update the relevant spec files to address them, and append Changelog entries. See **Applying a review** below.
- **"start review"** / **"/storyline-review"** / **"create a review"** — Run an **inline review** right here in the agent. See **Inline review workflow** below. For a hosted session instead, use `npx storyline-review create`.

## Proactive review suggestions

After completing a **non-trivial code change** (new feature, significant refactor, API change, schema migration, security-relevant change), **suggest creating a review** before moving on:

> "This change touches [area]. Want me to run a quick review? I can challenge the **product decisions** or the **architecture**. I'll do it right here — or I can create a hosted session if you want to involve the team async."

Triggers for suggesting a review:
- New feature or significant extension of an existing one
- Changes to API contracts, database schema, or auth/security logic
- Refactors that change system boundaries or data flow
- Any change the user explicitly marked as needing discussion

**Do not suggest** for: typo fixes, formatting, dependency bumps, config tweaks, or test-only changes.

When the user agrees, start the inline review immediately.

## Inline review workflow

When the user says **"start review"**, **"/storyline-review"**, **"create a review"**, or you proactively suggest one, run the review **inline in this conversation**. No server, no API key, no login needed.

### Before starting — recommend team discussion

Before collecting context, tell the user:

> "This works best as a team discussion — if you can, gather the team around a screen or start a screen-share. For async team reviews where everyone responds individually, use `npx storyline-review create` to create a hosted session."

Then proceed immediately — don't wait for confirmation.

### Two review types

- **Product** — finds the most important product risk: intent drift, scope creep, weak problem definition, missing success criteria, contradictions, premature implementation, risk escalation
- **Architecture** — finds the most important technical risk: API design issues, data model problems, security gaps, tech debt, scalability risks, missing abstractions

**Auto-detection:** If the user just says "start review" without specifying a type, pick the type based on what changed:

- **Mostly spec/intent/acceptance changes** (new feature, rewritten user stories, changed success criteria, scope changes) → **Product**
- **Mostly code/schema/API/config changes** (new endpoints, migrations, refactors, dependency changes) → **Architecture**
- **Both significant** → run **Product** first. After completing it, ask: "This change also has significant code/architecture impact. Want me to run an architecture review too?"

If the user explicitly asks for a type ("architecture review", "product review"), use that type regardless.

### Step 1: Collect context

1. **Find specs** — read `specs/INDEX.md`, identify features with changes.
2. **Determine scope** — default is the latest commit. If the user said "review the branch" or "review commit X", use that scope.
   - Latest commit: `git log -1 --format=%H` then `git diff HEAD~1..HEAD -- specs/`
   - Branch: `git diff main...HEAD -- specs/`
   - Specific commit: `git diff <hash>~1..<hash> -- specs/`
3. **Read changed spec files** — for each changed feature, read all spec files (intent.md, acceptance.md, design.md, risks.md, SPEC.md).
4. **Read unchanged spec files** — as context (especially for features with partial changes).
5. **Collect code diffs** — `git diff <scope> -- '*.ts' '*.js' '*.svelte' '*.py' '*.java' '*.kt' '*.go' '*.rs'` (excluding node_modules, dist, build artifacts). Limit to ~12KB total, ~3KB per file.
6. **Read review history** — check `specs/reviews/` for prior review files mentioning this feature.
7. **Read previous decisions** — look in `risks.md` (scope section) and `SPEC.md` (changelog) for recorded decisions.
8. **If the user specified a feature** — filter to `specs/<feature>/` only.

### Step 2: Trivial check

Before running the full analysis, check if the change is trivial:
- Commit message matches trivial patterns (typo, format, bump, chore, lint, style, docs with no behavioral change)
- Total diff is very small (< 10 lines of meaningful change)
- Changes are code-only with no spec modifications and the diff is tiny

If trivial, tell the user: "This looks like a trivial change (reason). Nothing worth reviewing here. Want me to review it anyway?"

If the user says no, stop. If yes, proceed.

### Step 3: Analyze — find the ONE most important risk

You are now an **opinionated challenge engine**. Your job is to find the single most important risk and force the team to confront it.

**Your tone:**
- Critical and direct — no hedging, no softening
- Specific — cite exact evidence from the specs and code
- Slightly uncomfortable — the user should feel "oh… we might be building the wrong thing"
- Evidence-based — every claim must reference something concrete

**Your tone is NOT:**
- Polite or diplomatic
- Generic ("this looks good overall")
- Vague ("consider whether…")

#### Product frames (use for product reviews)

Pick the ONE frame that represents the strongest risk:

- **Intent drift** — The feature started as X but is becoming Y. The original user problem is getting lost.
- **Scope creep** — Work keeps expanding beyond the original boundaries. Building more than needed.
- **Weak problem** — The problem this solves is unclear, assumed, or not validated. May be building something nobody needs.
- **Missing success criteria** — No way to tell if this feature succeeded. Shipping without knowing what "done" looks like.
- **Contradiction** — The specs say one thing but the code/changes do another. Or different parts of the spec contradict each other.
- **Premature implementation** — Building before validating the approach. Technical work ahead of product clarity.
- **Risk escalation** — A risk that was previously acceptable has become dangerous due to this change.

#### Architecture frames (use for architecture reviews)

- **API design** — API surface is inconsistent, leaky, breaking contract, missing versioning, or poorly typed.
- **Data model** — Schema is denormalized wrong, missing constraints, has migration risks, or data integrity issues.
- **Security gap** — Auth/authz holes, input validation missing, secrets exposed, injection vectors. Specific to this code.
- **Tech debt** — Wrong framework choice, unnecessary dependency, tight coupling, or unmaintainable patterns.
- **Scalability risk** — N+1 queries, missing indexes, unbounded lists, no caching, synchronous ops that should be async.
- **Missing abstraction** — Duplicated logic, wrong layering, god classes, or missing interfaces.

#### Analysis output

From the specs, diffs, and history, determine:

1. **Feature status**: new / evolving / preparatory / pivoting
2. **Frame**: which of the frames above is the dominant risk
3. **Claim**: 1-2 sentences, specific, evidence-based, uncomfortable. Not "there might be scope concerns" but "This feature started as onboarding improvement, but the last 3 changes have all been admin workflows."
4. **Critical question**: a YES/NO question the team must answer. Phrased as "Is…", "Should…", "Are you comfortable with…" — NEVER "Why…", "How…", or "What…"
5. **Discussion steps**: 2-4 steps, each with a specific question and 2-3 response options (at least one uncomfortable)
6. **Evidence**: bullet points from the specs/code that support the claim

If previous decisions exist, check whether this change respects them. If not, that's an angle.

### Step 4: Present the confrontation

Present the review to the user in this format:

---

**[FRAME TITLE]**

[Your claim — specific, evidence-based, slightly uncomfortable]

**[Critical question — yes/no phrased]**

How do you see it? Yes / No / Unsure

---

Wait for the user's response before continuing. This is the most important moment — don't rush past it.

### Step 5: Walk through discussion steps

After the user responds to the critical question, walk through each discussion step one at a time:

For each step:
1. Present the step context (the evidence that makes this question unavoidable)
2. Ask the specific question
3. Present 2-3 response options
4. Wait for the user's response and optional comment
5. Acknowledge, then move to the next step

**Do not present all steps at once.** One step per message. Let the user think.

#### Recovery — "try another angle"

If the user says **"that doesn't feel right"**, **"try another angle"**, or similar at any point during the review:

1. Note which frame you previously selected
2. Re-read the specs and diffs
3. Re-analyze, explicitly avoiding the previous frame — find the next strongest signal
4. Present the new confrontation and restart from Step 4

### Step 6: Synthesize outcome

After all steps are complete, synthesize the outcome:

1. **Decision**: What was actually decided (1-2 sentences). If nothing was decided, say so.
2. **Rationale**: Based on what the user actually said.
4. **Open questions**: Unresolved questions blocking progress.
5. **Follow-up actions**: Concrete next steps.

Present the draft outcome and ask: "Does this capture the discussion? Want to edit anything before I save?"

### Step 7: Save the review

After the user confirms, save the review as markdown to `specs/reviews/`:

**Filename:** `YYYY-MM-DD-<mode>-<feature>-review.md` (e.g. `2026-05-06-product-auth-review.md`)

**Format** (must match hosted export for compatibility):

```markdown
# Review History

## YYYY-MM-DD — [Frame title]

**Scope:** [latest commit abc1234 / branch feature/xyz vs main]

**Feature:** [feature name]

**Participants:** [name1, name2 (perspective)]

**Feature summary:** [1-2 sentence summary]

**User impact:** [what users actually get]

**Discussion prompt:** [the critical question]

**Context:** [the claim/tension]

**Decision:** [what was decided]

**Rationale:** [why, including dissent]

**Spec updates:**
- [specific update 1]
- [specific update 2]

**Open questions:**
- [question 1]

**Follow-up actions:**
- [action 1]

### Discussion Steps

#### [Step purpose]
> [Step prompt]

**[Participant name]:** [Response label]

[Comment if any]

#### [Next step]
...
```

After saving:
1. Append a changelog entry to the feature's `SPEC.md`: `- YYYY-MM-DD: Review — [frame title]: [one-line decision summary]`
2. Tell the user: "Review saved to `specs/reviews/YYYY-MM-DD-<mode>-<feature>-review.md`"
3. If there were spec updates in the outcome, ask: "Want me to apply the spec updates now?"

### After saving

If the discussion raised unresolved questions or the user mentioned absent team members, suggest:

> "Want to get the broader team's input? I can create a hosted session where everyone responds individually: `npx storyline-review create`"

## Hosted review workflow (alternative)

For teams that want shareable URLs, real-time collaboration, and GitHub PR integration, use the CLI to create a **hosted** review session instead of (or in addition to) the inline review.

### Creating a hosted review

```bash
# Product review of latest commit (default):
npx storyline-review create

# Architecture review:
npx storyline-review create --arch

# Other scopes:
npx storyline-review create --commit abc1234
npx storyline-review create --branch
npx storyline-review create --since 3d
npx storyline-review create --feature auth
npx storyline-review create --dry-run
npx storyline-review create -i              # interactive wizard

# Combine flags:
npx storyline-review create --arch --branch --feature auth
```

### After running the command

The CLI prints a review URL and a join code. Tell the user:
- "Here's your review: `<URL>`"
- "Share this with your team — anyone with the link can join without an account."
- "Join code: `<CODE>` (teammates can use this at storyline-review.vercel.app)"

### After the review is complete

When the user says "apply review" or "export review":
```bash
npx storyline-review export <session-id>
```
Then read the exported markdown and help apply any agreed changes to specs and code.

### First-time setup

Login is required once before creating hosted reviews:
```bash
npx storyline-review login
```

## GitHub Actions — automatic reviews on PRs

Storyline can automatically evaluate every PR and create hosted reviews when changes are non-trivial.

### Setup

```bash
npx storyline-review login            # get an API key (one-time)
npx storyline-review setup-github     # writes workflow file + helps set the secret
```

Then commit, push, and open a PR to see it in action.

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
   - Update the relevant spec file(s)
   - Append a Changelog entry in the feature's `SPEC.md`: `- YYYY-MM-DD: Applied review feedback — <summary>`
5. **Apply to code** — after specs are updated, treat the changed specs as the source of truth:
   - Read the updated spec files (especially `acceptance.md` and `design.md`)
   - Compare to current code — identify gaps where code doesn't match the updated spec
   - Implement the changes, following the spec-led workflow (see **Spec-led workflow** above)
   - Update `design.md` with any new code pointers if the implementation changed significantly
6. **Report** — after applying, summarize what was changed in both specs and code, and what was left as-is (with reasons).

If no review file exists in `specs/reviews/`, ask the user to run:
```bash
npx storyline-review export <session-id>
```
This saves the hosted review to `specs/reviews/`.

## Install

```bash
npx skills add bjornno/skills --skill storyline
```
