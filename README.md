# bjornno/skills

Agent skills for Cursor, Claude Code, Copilot, Codex, and [other agents](https://skills.sh).

| Skill | What it does |
|-------|-------------|
| **[Storyline](skills/storyline/SKILL.md)** | Living feature docs (stories, flows, acceptance) in `specs/` next to code |
| **[fn-contracts](skills/fn-contracts/SKILL.md)** | Functional contract architecture: `fun interface` + `operator invoke` for composable, testable Kotlin/Spring services |

## Install

```bash
npx skills add bjornno/skills
```

Pick which skill(s) and which agents to install for. Skills land in `.agents/skills/<name>/`.

### Install a specific skill

```bash
npx skills add bjornno/skills --skill storyline
npx skills add bjornno/skills --skill fn-contracts
```

### Install globally

```bash
npx skills add bjornno/skills -g
```

## License

MIT
