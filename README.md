# bjornno/skills

Personal [agent skills](https://skills.sh) for Cursor and other agents.

| Skill | What it does |
|-------|-------------|
| **[Storyline](storyline/SKILL.md)** | Living feature docs (stories, flows, acceptance) in `specs/` next to code |
| **[fn-contracts](fn-contracts/SKILL.md)** | Functional contract architecture: `fun interface` + `operator invoke` for composable, testable Kotlin/Spring services |

---

## Storyline

**Storyline** keeps **user stories, flows, and acceptance** in `specs/` next to the code—intent-first, not a clone of heavier spec toolchains. Good for backends with a separate UI: optional `ui.md` for app developers.

### Install into a project

```bash
npx create-storyline@latest
# or: npx create-storyline@latest /path/to/project
```

Installs `.cursor/skills/storyline/`, `.cursor/rules/storyline.mdc`, `.cursor/commands/storyline-*.md`, and `specs/README.md` (if missing). **Commit** those paths—teammates get Storyline when they pull.

Options: `--force-readme` (overwrite `specs/README.md`), `--dry-run`.

### Install globally (optional)

```bash
npx skills add bjornno/skills --skill storyline
```

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

Details: [`storyline/SKILL.md`](storyline/SKILL.md) · [`storyline/prompts.md`](storyline/prompts.md)

---

## fn-contracts

**fn-contracts** teaches agents the functional contract architecture: define capabilities as Kotlin `fun interface` with `operator invoke`, implement as local-db, HTTP client, caching decorator, routing switch, controller, or any adapter. One contract, many wiring options, trivially testable with lambdas.

### Install into a project

```bash
npx create-fn-contracts@latest
# or: npx create-fn-contracts@latest /path/to/project
```

Installs `.cursor/skills/fn-contracts/`, `.cursor/rules/fn-contracts.mdc`, and `.cursor/commands/fn-contracts-*.md`.

Options: `--dry-run`.

### Install globally (optional)

```bash
npx skills add bjornno/skills --skill fn-contracts
```

### Slash commands

| Command | Purpose |
|--------|---------|
| `/fn-contracts-new` | Define a new functional contract + first implementation |
| `/fn-contracts-add-impl` | Add an implementation (LocalDb, Client, Controller, Service) |
| `/fn-contracts-add-decorator` | Add a decorator (Caching, Routing, Validation, Metrics) |
| `/fn-contracts-review` | Review code for fn-contracts candidates |

Details: [`fn-contracts/SKILL.md`](fn-contracts/SKILL.md) · [`fn-contracts/prompts.md`](fn-contracts/prompts.md)

---

## Install all skills at once

```bash
node bin/cli.mjs --all /path/to/project
```

Or globally:

```bash
npx skills add bjornno/skills --all
```

## Repo layout

Each skill is **self-contained** — its rule, commands, templates, and prompts all live inside the skill folder.

```text
bjornno/skills/
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
  bin/cli.mjs                # skill-aware installer CLI
  package.json               # npm installer (create-storyline, create-fn-contracts)
  README.md
```

The installer detects which skill to install from the binary name (`create-storyline` vs `create-fn-contracts`). You can also use `--skill <name>` or `--all`.

## Publish

1. Push to **GitHub** as `bjornno/skills`.
2. Publish the npm package (enables `npx create-storyline` and `npx create-fn-contracts`):

   ```bash
   npm login
   npm publish --access public
   ```

## License

MIT
