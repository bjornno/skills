# bjornno/skills

Personal [agent skills](https://skills.sh) for Cursor and other agents. Two ways to use **Storyline**—pick one or both.

## Storyline

**Storyline** keeps **user stories, flows, and acceptance** in `specs/` next to the code—intent-first, not a clone of heavier spec toolchains. Good for backends with a separate UI: optional `ui.md` for app developers.

### Project-only (recommended for teams using git)

You do **not** need the Skills CLI. From your app repository root:

```bash
cd your-app
npm create storyline@latest
# or: npx create-storyline@latest
```

That installs **everything into this repo only**: `.cursor/skills/storyline/` (SKILL + prompts), `.cursor/rules/storyline.mdc`, `.cursor/commands/storyline-*.md`, and `specs/README.md` (if missing). **Commit** those paths—teammates get Storyline when they pull. **Skip** “Install the skill (global)” below unless you want a copy under `~/.cursor/skills/` too.

### 1) Install the skill (global / cross-project)

Uses the ecosystem CLI ([skills.sh](https://skills.sh)):

```bash
npx skills add bjornno/skills --skill storyline
```

Update later:

```bash
npx skills update
```

### 2) Installer options (same as project-only above)

```bash
npx create-storyline@latest /path/to/project
npx create-storyline --force-readme   # replace specs/README.md
npx create-storyline --dry-run
```

Until `create-storyline` is on npm, from a clone of this repo:

```bash
node /path/to/bjornno-skills/bin/cli.mjs /path/to/app
```

### 3) Slash commands (after project install)

In Cursor chat, type **`/`** and choose:

| Command | Purpose |
|--------|---------|
| `/storyline-refresh-overview` | Refresh `specs/OVERVIEW.md` |
| `/storyline-sync-feature` | Align feature specs with shipped code |
| `/storyline-ui-hints` | Add/update `ui.md` for frontend consumers |
| `/storyline-add-flow-diagram` | Add Mermaid for a complex flow |
| `/storyline-split-feature` | Split folder into intent / experience / constraints |
| `/storyline-story-first` | Rewrite specs around flows & examples |

### Layout this workflow expects

- `specs/OVERVIEW.md` — product-level picture  
- `specs/<feature-slug>/SPEC.md` — entry + changelog; optional `intent.md`, `experience.md`, `constraints.md`, `ui.md`

Details: see `storyline/SKILL.md`.

### Publish this repo

1. Create **GitHub** repo `bjornno/skills` and push this folder’s contents as the root.  
2. In `package.json`, set `"repository.url"` if yours differs.  
3. Publish the installer package (optional, for `npm create storyline`):

   ```bash
   npm login
   npm publish --access public
   ```

If the package is not on npm yet, use **`node …/bin/cli.mjs`** as in **§2** above.

## More than one skill in this repo

This repository is **not** single-skill-only. The [Skills CLI](https://skills.sh) expects a GitHub repo with **one folder per skill**, each containing at least **`SKILL.md`** (with YAML frontmatter).

Example layout:

```text
bjornno/skills/
  storyline/
    SKILL.md
    prompts.md
  ship/                    # hypothetical second skill
    SKILL.md
  cursor-extras/           # Storyline-specific Cursor rule + commands
  template/                # used by create-storyline only
  package.json             # npm package create-storyline (Storyline installer)
  bin/cli.mjs
  README.md
```

Install a specific skill:

```bash
npx skills add bjornno/skills --skill storyline
npx skills add bjornno/skills --skill ship
npx skills add bjornno/skills --all
```

**Storyline-specific pieces** (only for this workflow): `cursor-extras/`, `template/specs/`, and **`create-storyline`**. Another skill that needs Cursor rules or commands can add e.g. `cursor-extras/my-skill/` plus a separate **`create-my-skill`** package (second `package.json` in a subfolder, or a monorepo tool)—or document “copy these files by hand” if it’s rare.

## License

MIT
