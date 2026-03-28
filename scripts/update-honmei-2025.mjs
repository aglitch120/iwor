#!/usr/bin/env node
/**
 * Update honmeiIndex in hospitals-data.ts using 2025 JRMP data.
 * Only updates if the new value is valid (0 < honmei <= 1.0).
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const ROOT = resolve(import.meta.dirname, '..')
const JRMP_JSON = '/tmp/jrmp2025.json'
const HOSPITALS_FILE = resolve(ROOT, 'app/matching/hospitals-data.ts')

// Load 2025 data
const jrmp = JSON.parse(readFileSync(JRMP_JSON, 'utf-8'))

// Load hospitals-data.ts
let content = readFileSync(HOSPITALS_FILE, 'utf-8')

let updated = 0
let skipped = 0
let noMatch = 0

for (const [progId, info] of Object.entries(jrmp)) {
  if (info.honmeiIndex == null || info.honmeiIndex <= 0 || info.honmeiIndex > 1.0) {
    skipped++
    continue
  }

  // Find this programId in hospitals-data.ts and update honmeiIndex
  const regex = new RegExp(`(programId: '${progId}'[^}]*?honmeiIndex: )[0-9.]+`)
  if (regex.test(content)) {
    content = content.replace(regex, `$1${info.honmeiIndex}`)
    updated++
  } else {
    // Maybe honmeiIndex doesn't exist for this program, try to add it
    const insertRegex = new RegExp(`(programId: '${progId}'[^}]*?popularityTrend: [0-9.]+)`)
    if (insertRegex.test(content)) {
      content = content.replace(insertRegex, `$1, honmeiIndex: ${info.honmeiIndex}`)
      updated++
    } else {
      noMatch++
    }
  }
}

writeFileSync(HOSPITALS_FILE, content, 'utf-8')
console.log(`Updated: ${updated}, Skipped (invalid): ${skipped}, No match in file: ${noMatch}`)
