# Multi-repo setups

[← Back to Storyline](SKILL.md)

Storyline is designed for **mono-repos** where specs and code live together. When your product spans multiple repos (e.g. a backend API and a frontend app), specs get harder to keep connected to code. This guide covers why, and what you can do about it.

## Why multi-repo is harder

- **Two PRs for one feature.** A cross-cutting change produces separate PRs in each repo. Specs can only live in one of them — the other PR has no spec context.
- **GitHub Action runs per repo.** The CI review only sees the code and specs checked out in that repo. It can't reach across to the other repo's specs or changes.
- **Spec drift.** Without atomic commits, specs and code can get out of sync when one PR merges before the other.

## Running the CLI from a parent folder (local only)

If your repos sit side by side in a workspace folder, you can run the CLI from the parent:

```
workspace/
  backend/          ← git repo
  frontend/         ← git repo
  specs/            ← shared specs (not in either repo)
```

```bash
cd workspace
npx storyline-review create
```

The CLI picks up `specs/` and git history from the current directory. This works for **local development** — you get a unified review that sees both repos' changes and the shared specs.

**Limitation:** this does not work in CI/GitHub Actions, where each workflow checks out a single repo.

## Approaches

### 1. Move to a mono-repo (recommended)

Put backend, frontend, and specs in one repo. One PR per feature, one `specs/` folder, GitHub Action works out of the box.

This is the simplest model and removes the multi-repo problem entirely. If your team can make the migration, do it.

### 2. Specs in the "product" repo

Pick the repo closest to the user experience (often frontend) as the spec home. The other repo's PRs reference spec changes via links.

```
frontend/specs/     ← all specs live here
backend/            ← PRs link to frontend spec PRs
```

**How it works:**
- Spec changes go in the frontend repo's PR, where the GitHub Action reviews them together with code.
- Backend PRs include a note like `Spec: frontend-repo#42` in the description.
- Local development works normally — the agent updates `specs/` in the frontend repo.

**Trade-off:** backend PRs lack spec context in CI. Reviewers need to follow the cross-reference.

### 3. Specs in each repo, scoped to that repo's responsibilities

Each repo owns specs for the features it implements. Cross-cutting features get a spec in both repos, each focused on that repo's side.

```
frontend/specs/auth/     ← login UI, token handling, route guards
backend/specs/auth/      ← API endpoints, session storage, token validation
```

**How it works:**
- A feature like "auth" has two spec folders — one per repo, each describing that repo's part.
- Both share the same problem statement (`intent.md`) but have different `design.md` and `acceptance.md`.
- GitHub Action runs independently in each repo and sees that repo's specs.

**Trade-off:** cross-cutting intent is duplicated. You need discipline to keep the shared parts aligned.

### 4. Specs in a third repo

A dedicated specs repo, referenced from both code repos.

```
specs-repo/         ← all specs
frontend/           ← code only
backend/            ← code only
```

**How it works:**
- Cross-cutting features get one spec that describes the full picture.
- Code PRs reference the spec repo (`Spec: specs-repo#15`).
- Local development: clone the specs repo alongside the code repos and run the CLI from the parent folder.

**Trade-off:** specs and code PRs are fully disconnected in CI. No atomic reviews. Requires manual cross-linking. The GitHub Action can't see specs unless you add a checkout step for the specs repo.

### 5. Specs repo as a git submodule

Like option 4, but the specs repo is included as a submodule in both code repos. Spec changes show up in either repo's PR diff.

```
frontend/specs/     ← submodule → specs-repo
backend/specs/      ← submodule → specs-repo
```

**Trade-off:** submodules add operational complexity — everyone on the team needs to understand `git submodule update`, and simultaneous spec changes from both repos cause merge conflicts.

## Summary

| Approach | Spec–code connection | CI support | Complexity |
|----------|---------------------|------------|------------|
| **Mono-repo** | Full | Full | Migration cost |
| **Specs in product repo** | One repo full, other linked | One repo | Low |
| **Specs in each repo** | Full per-repo | Full per-repo | Duplication risk |
| **Third specs repo** | Disconnected | Manual | Cross-linking overhead |
| **Submodule** | Both repos see specs | Full | Submodule pain |

**Recommendation:** use a mono-repo if you can. If you can't, pick option 2 (specs in the product repo) for simplicity, or option 3 (specs in each repo) if most features are naturally scoped to one repo.

[← Back to Storyline](SKILL.md)
