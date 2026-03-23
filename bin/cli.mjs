#!/usr/bin/env node
/**
 * Installs one or all skills into a project.
 *
 * Each skill is self-contained under its own folder:
 *   <skill>/SKILL.md            → .cursor/skills/<skill>/SKILL.md
 *   <skill>/prompts.md          → .cursor/skills/<skill>/prompts.md
 *   <skill>/extras/rules/*      → .cursor/rules/*
 *   <skill>/extras/commands/*   → .cursor/commands/*
 *   <skill>/template/**         → project root (preserving structure)
 *
 * Usage:
 *   npx create-storyline@latest [dir]
 *   npx create-fn-contracts@latest [dir]
 *   node bin/cli.mjs --skill <name> [dir]
 *   node bin/cli.mjs --all [dir]
 */

import { access, cp, mkdir, readdir } from "node:fs/promises"
import { constants } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const kitRoot = path.join(__dirname, "..")

const SKILLS = {
  storyline: {
    templates: [{ src: "template/specs/README.md", dest: "specs/README.md" }],
  },
  "fn-contracts": {},
}
const ALL_SKILL_NAMES = Object.keys(SKILLS)

const argv = process.argv.slice(2)
const flags = new Set(argv.filter((a) => a.startsWith("-") && !a.startsWith("--skill")))
const args = argv.filter((a) => !a.startsWith("-"))

let skillFlag = null
const skillIdx = argv.indexOf("--skill")
if (skillIdx !== -1 && argv[skillIdx + 1]) {
  skillFlag = argv[skillIdx + 1]
}

const dryRun = flags.has("--dry-run")
const forceReadme = flags.has("--force-readme")
const installAll = flags.has("--all")

function detectSkillFromBinaryName() {
  const bin = path.basename(process.argv[1] || "")
  for (const name of ALL_SKILL_NAMES) {
    const normalized = name.replace(/-/g, "")
    if (bin.includes(normalized) || bin.includes(name)) return name
  }
  return null
}

function resolveSkills() {
  if (installAll) return ALL_SKILL_NAMES
  if (skillFlag) {
    if (!SKILLS[skillFlag]) {
      console.error(`Unknown skill: ${skillFlag}. Available: ${ALL_SKILL_NAMES.join(", ")}`)
      process.exit(1)
    }
    return [skillFlag]
  }
  const detected = detectSkillFromBinaryName()
  if (detected) return [detected]
  return ["storyline"]
}

if (flags.has("--help") || flags.has("-h")) {
  console.log(`bjornno/skills installer — install Cursor skills into a project

  npx create-storyline@latest [dir]
  npx create-fn-contracts@latest [dir]
  node bin/cli.mjs --skill <name> [dir]
  node bin/cli.mjs --all [dir]

Skills: ${ALL_SKILL_NAMES.join(", ")}

Options:
  --skill <name>   Install a specific skill (default: detect from binary name)
  --all            Install all skills
  --force-readme   Overwrite template files if present
  --dry-run        Show what would happen
  --help           This help

Also install skills globally (optional):
  npx skills add bjornno/skills --skill <name>
`)
  process.exit(0)
}

const targetArgs = args.filter((a) => a !== skillFlag)
const target = path.resolve(targetArgs[0] ?? process.cwd())
const skillsToInstall = resolveSkills()

async function dirExists(dirPath) {
  try {
    await access(dirPath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function copyDirContents(srcDir, destDir) {
  if (!(await dirExists(srcDir))) return
  const entries = await readdir(srcDir)
  if (entries.length === 0) return
  await mkdir(destDir, { recursive: true })
  for (const entry of entries) {
    await cp(path.join(srcDir, entry), path.join(destDir, entry), { recursive: true })
  }
}

async function installSkill(skillName) {
  const config = SKILLS[skillName] || {}
  const skillDir = path.join(kitRoot, skillName)
  const destCursor = path.join(target, ".cursor")
  const destSkill = path.join(destCursor, "skills", skillName)

  const extrasRules = path.join(skillDir, "extras", "rules")
  const extrasCommands = path.join(skillDir, "extras", "commands")

  if (dryRun) {
    console.log(`[dry-run] [${skillName}] skill: ${skillDir} -> ${destSkill}`)
    console.log(`[dry-run] [${skillName}] rules: ${extrasRules} -> .cursor/rules/`)
    console.log(`[dry-run] [${skillName}] commands: ${extrasCommands} -> .cursor/commands/`)
    if (config.templates) {
      for (const t of config.templates) {
        console.log(`[dry-run] [${skillName}] template: ${t.dest}`)
      }
    }
    return
  }

  await mkdir(destSkill, { recursive: true })
  const skillEntries = await readdir(skillDir)
  for (const entry of skillEntries) {
    if (entry === "extras" || entry === "template") continue
    await cp(path.join(skillDir, entry), path.join(destSkill, entry), { recursive: true })
  }

  await copyDirContents(extrasRules, path.join(destCursor, "rules"))
  await copyDirContents(extrasCommands, path.join(destCursor, "commands"))

  if (config.templates) {
    for (const t of config.templates) {
      const destPath = path.join(target, t.dest)
      const exists = await fileExists(destPath)

      if (!exists || forceReadme) {
        await mkdir(path.dirname(destPath), { recursive: true })
        await cp(path.join(skillDir, t.src), destPath)
        console.log(exists && forceReadme ? `Wrote ${t.dest} (--force-readme)` : `Wrote ${t.dest}`)
      } else {
        console.log(`Skipped ${t.dest} (exists). Use --force-readme to replace.`)
      }
    }
  }

  console.log(`Installed ${skillName}: .cursor/skills/${skillName}/, rule, commands.`)
}

async function main() {
  console.log(`Target: ${target}`)
  console.log(`Skills: ${skillsToInstall.join(", ")}`)
  console.log()

  for (const skillName of skillsToInstall) {
    await installSkill(skillName)
  }

  console.log()
  console.log("Optional: npx skills add bjornno/skills --skill <name> (global skill copy).")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
