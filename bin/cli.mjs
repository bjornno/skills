#!/usr/bin/env node
/**
 * Installs Storyline into a project:
 * - .cursor/skills/storyline/  (SKILL + prompts — committed with the repo)
 * - .cursor/rules/storyline.mdc
 * - .cursor/commands/storyline-*.md
 * - specs/README.md (if missing, or with --force-readme)
 *
 * Usage:
 *   npm create storyline@latest
 *   npx create-storyline@latest [targetDir]
 *   node bin/cli.mjs [--dry-run] [--force-readme] [targetDir]
 */

import { access, cp, mkdir } from "node:fs/promises"
import { constants } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const kitRoot = path.join(__dirname, "..")

const argv = process.argv.slice(2)
const flags = new Set(argv.filter((a) => a.startsWith("-")))
const args = argv.filter((a) => !a.startsWith("-"))

const target = path.resolve(args[0] ?? process.cwd())
const dryRun = flags.has("--dry-run")
const forceReadme = flags.has("--force-readme")

if (flags.has("--help") || flags.has("-h")) {
  console.log(`create-storyline — install Storyline Cursor files into a project

  npm create storyline@latest
  npx create-storyline@latest [dir]

Options:
  --force-readme   Overwrite specs/README.md if present
  --dry-run        Show what would happen
  --help           This help

Also install the agent skill globally (optional):
  npx skills add bjornno/skills --skill storyline
`)
  process.exit(0)
}

const skillSrc = path.join(kitRoot, "storyline")
const cursorExtras = path.join(kitRoot, "cursor-extras")
const templateSpecsReadme = path.join(kitRoot, "template", "specs", "README.md")

async function main() {
  const destCursor = path.join(target, ".cursor")
  const destSkill = path.join(destCursor, "skills", "storyline")
  const destSpecsDir = path.join(target, "specs")
  const destSpecsReadme = path.join(destSpecsDir, "README.md")

  console.log(`Target: ${target}`)

  if (dryRun) {
    console.log(`[dry-run] copy skill: ${skillSrc} -> ${destSkill}`)
    console.log(`[dry-run] merge: ${path.join(cursorExtras, "rules")} -> ${path.join(destCursor, "rules")}`)
    console.log(`[dry-run] merge: ${path.join(cursorExtras, "commands")} -> ${path.join(destCursor, "commands")}`)
    console.log(`[dry-run] specs README -> ${destSpecsReadme}`)
    return
  }

  await mkdir(destSkill, { recursive: true })
  await cp(skillSrc, destSkill, { recursive: true })

  const destRules = path.join(destCursor, "rules")
  const destCommands = path.join(destCursor, "commands")
  await mkdir(destRules, { recursive: true })
  await mkdir(destCommands, { recursive: true })
  await cp(path.join(cursorExtras, "rules"), destRules, { recursive: true })
  await cp(path.join(cursorExtras, "commands"), destCommands, { recursive: true })

  let readmeExists = false
  try {
    await access(destSpecsReadme, constants.F_OK)
    readmeExists = true
  } catch {
    readmeExists = false
  }

  if (!readmeExists || forceReadme) {
    await mkdir(destSpecsDir, { recursive: true })
    await cp(templateSpecsReadme, destSpecsReadme)
    console.log(
      readmeExists && forceReadme ? "Wrote specs/README.md (--force-readme)" : "Wrote specs/README.md",
    )
  } else {
    console.log("Skipped specs/README.md (exists). Use --force-readme to replace.")
  }

  console.log("Installed .cursor/skills/storyline/, rules, commands.")
  console.log("Optional: npx skills add bjornno/skills --skill storyline (global skill copy for other agents).")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
