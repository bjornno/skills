# Storyline — phrases for the developer

**Cursor does not load this file as slash commands.** Use **`/storyline-*`** from `.cursor/commands/` after running **`npm create storyline@latest`** in the app (see [SKILL.md](SKILL.md)).

Copy or adapt the table below in chat to steer the agent.

| Intent | Example prompt |
|--------|----------------|
| Story-first spec | “Rewrite `specs/<slug>/SPEC.md` around user flows and examples; move implementation detail out.” |
| Capture why / what | “Add a **Why** and **Acceptance** section; keep **Technical requirements** to bullets only.” |
| Refresh high-level picture | “Update `specs/OVERVIEW.md` for a product reader; keep the developer section short.” |
| Tighten overview | “Trim `OVERVIEW.md` to one screenful; keep links to feature specs.” |
| Start a new tracked area | “Create `specs/<slug>/SPEC.md` for what we’re building—flows and acceptance first.” |
| Continue an existing area | “Update `specs/<slug>/SPEC.md` so stories and acceptance match what we shipped.” |
| Spec before code (rare) | “Draft a minimal SPEC.md (Why, flows, acceptance only); I’ll review before implementation.” |
| Implement from edited spec | “I updated `specs/<slug>/` — read intent, experience, constraints, ui; list gaps vs code; implement acceptance; append SPEC Changelog.” |
| Spec from existing code | “Infer user flows and acceptance from the code; keep **Pointers to code** to a few lines.” |
| Tighten scope | “Trim SPEC.md: keep Why, one flow, Stories, Acceptance, Changelog.” |
| Record a product decision | “Append Changelog and add one line under **Technical requirements** or **Open questions**.” |
| Optional checklist | “Add a short `checklists.md` for manual QA of this feature.” |
| Complex flows | “Add a small Mermaid diagram to `specs/<slug>/SPEC.md` for the branching/status flow; user-facing labels.” |
| Split stable vs volatile | “Split `specs/<slug>/` into `intent.md`, `experience.md`, `constraints.md`; keep `SPEC.md` as index + Changelog.” |
| Collapse to one file | “Merge `specs/<slug>/` split files back into a single `SPEC.md`; dedupe Changelog.” |
| UI / app developer hints | “Add or update `specs/<slug>/ui.md` for the team building the frontend: screens, auth context, and error/empty behaviour—no OpenAPI paste.” |
| Architecture exceptions | “Add or refresh `specs/ARCHITECTURE.md` with only non-standard patterns; link from `OVERVIEW.md` For developers.” |
| Spec index / folders | “Add `specs/INDEX.md` and/or group specs under `specs/<area>/`; update `OVERVIEW.md` links.” |

After editing specs locally: “Implement the gaps between the spec folder and the code.” (Entry: `specs/<slug>/SPEC.md`.) The agent should read that folder **before** coding and treat your edits as **intent**, not suggestions—unless you say “review only” or “estimate only”.
