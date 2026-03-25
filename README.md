# bjornno/skills

Personal [agent skills](https://skills.sh) for Cursor and other agents.

| Skill | What it does |
|-------|-------------|
| **[Storyline](skills/storyline/SKILL.md)** | Living feature docs (stories, flows, acceptance) in `specs/` next to code |
| **[fn-contracts](skills/fn-contracts/SKILL.md)** | Functional contract architecture: `fun interface` + `operator invoke` for composable, testable Kotlin/Spring services |

---

## Install

```bash
npx skills add bjornno/skills
```

The interactive installer lets you pick which skill(s) and which agents (Cursor, Claude Code, Copilot, Codex, etc.) to install for. Skills land in `.agents/skills/<name>/` (project) or `~/.cursor/skills/<name>/` (global with `-g`).

### Install a specific skill

```bash
npx skills add bjornno/skills --skill storyline
npx skills add bjornno/skills --skill fn-contracts
```

### Install globally

```bash
npx skills add bjornno/skills -g
```

### Full project setup (npm scaffolder)

The npm scaffolder deploys extras (Cursor rules, slash commands, templates) that the `skills` CLI doesn't handle:

```bash
npx create-storyline@latest
npx create-fn-contracts@latest
```

This installs `.cursor/skills/<name>/`, `.cursor/rules/*.mdc`, `.cursor/commands/*.md`, and any starter templates. **Commit those paths** so teammates get the skill when they pull.

Options: `--force-readme` (overwrite template files), `--dry-run`, `--all`.

---

## Storyline

**Storyline** keeps **user stories, flows, and acceptance** in `specs/` next to the code—intent-first, not a clone of heavier spec toolchains. Good for backends with a separate UI: optional `ui.md` for app developers.

### Slash commands

| Command | Purpose |
|--------|---------|
| `/storyline-refresh-overview` | Refresh `specs/OVERVIEW.md` |
| `/storyline-sync-feature` | Align feature specs with shipped code |
| `/storyline-ui-hints` | Add/update `ui.md` for frontend consumers |
| `/storyline-add-flow-diagram` | Add Mermaid for a complex flow |
| `/storyline-split-feature` | Split folder into intent / experience / constraints |
| `/storyline-story-first` | Rewrite specs around flows & examples |
| `/storyline-implement-from-spec` | User edited spec → read folder, gap analysis, implement acceptance |

Details: [`skills/storyline/SKILL.md`](skills/storyline/SKILL.md) · [`skills/storyline/prompts.md`](skills/storyline/prompts.md)

---

## fn-contracts

**fn-contracts** teaches agents the functional contract architecture: define capabilities as Kotlin `fun interface` with `operator invoke`, implement as local-db, HTTP client, caching decorator, routing switch, controller, or any adapter. One contract, many wiring options, trivially testable with lambdas.

### Slash commands

| Command | Purpose |
|--------|---------|
| `/fn-contracts-new` | Define a new functional contract + first implementation |
| `/fn-contracts-add-impl` | Add an implementation (LocalDb, Client, Controller, Service) |
| `/fn-contracts-add-decorator` | Add a decorator (Caching, Routing, Validation, Metrics) |
| `/fn-contracts-review` | Review code for fn-contracts candidates |

Details: [`skills/fn-contracts/SKILL.md`](skills/fn-contracts/SKILL.md) · [`skills/fn-contracts/prompts.md`](skills/fn-contracts/prompts.md)

---

## Repo layout

```text
bjornno/skills/
  skills/
    storyline/
      SKILL.md
      prompts.md
      extras/
        rules/storyline.mdc
        commands/storyline-*.md
      template/
        specs/README.md
    fn-contracts/
      SKILL.md
      prompts.md
      extras/
        rules/fn-contracts.mdc
        commands/fn-contracts-*.md
  bin/cli.mjs                # npm scaffolder (deploys extras + templates)
  package.json
  README.md
```

The `skills/` directory follows the [skills.sh](https://skills.sh) convention. Each subfolder with a `SKILL.md` (containing `name` + `description` frontmatter) is discoverable by `npx skills add`.

The `extras/` subdirectories contain Cursor rules and slash commands. These are deployed automatically by the npm scaffolder (`npx create-storyline`) but not by the `skills` CLI — the agent can read them from `.agents/skills/<name>/extras/` after install.

## Publish

1. Push to **GitHub** as `bjornno/skills`.
2. Optionally publish the npm package (enables `npx create-storyline` and `npx create-fn-contracts`):

   ```bash
   npm login
   npm publish --access public
   ```

## License

MIT
