#!/usr/bin/env node
/**
 * recalc-hensachi.mjs — 偏差値を「本気倍率」ベースに再計算
 *
 * 新公式:
 *   本気倍率 = (applicants × honmeiIndex) / capacity
 *   honmeiIndexがない場合: 本気倍率 = applicants / capacity (従来通り)
 *   偏差値 = 50 + 10 × z(本気倍率)
 *
 * これにより大学病院の「滑り止め志望」バイアスが除去され、
 * 大学と市中を同じスケールで比較できる。
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const ROOT = resolve(import.meta.dirname, '..')
const filePath = resolve(ROOT, 'app/matching/hospitals-data.ts')
let content = readFileSync(filePath, 'utf-8')

// Extract all hospital objects as text lines
const lines = content.split('\n')
const dataLines = []
const headerLines = []
const footerLines = []

let inData = false
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export const HOSPITALS')) {
    headerLines.push(...lines.slice(0, i + 1))
    inData = true
    continue
  }
  if (inData && lines[i].trim() === ']') {
    footerLines.push(...lines.slice(i))
    inData = false
    continue
  }
  if (inData) {
    dataLines.push(lines[i])
  }
}

// Parse each hospital line into an object
function parseLine(line) {
  const trimmed = line.trim()
  if (!trimmed.startsWith('{')) return null
  // Remove trailing comma
  const json = trimmed.replace(/,\s*$/, '')
  try {
    return eval(`(${json})`)
  } catch {
    return null
  }
}

const hospitals = dataLines.map(parseLine).filter(Boolean)
console.log(`Parsed ${hospitals.length} hospitals`)

// Calculate median honmeiIndex for fallback
const validHonmei = hospitals.filter(h => h.honmeiIndex != null && h.honmeiIndex > 0).map(h => h.honmeiIndex).sort((a, b) => a - b)
const medianHonmei = validHonmei[Math.floor(validHonmei.length / 2)]
console.log(`honmeiIndex: ${validHonmei.length}件有効 / ${hospitals.length}件中, 中央値=${medianHonmei}`)
const noHonmei = hospitals.filter(h => h.honmeiIndex == null || h.honmeiIndex === 0)
console.log(`honmeiIndexなし: ${noHonmei.length}件 (中央値${medianHonmei}で代替)`)

// Anomaly detection: fix honmeiIndex outliers caused by program ID mismatch
// Calculate P10 (10th percentile) per capacity band as floor
const capBands = [[1,2],[3,5],[6,10],[11,20],[21,50],[51,999]]
const bandFloors = {}
for (const [lo,hi] of capBands) {
  const vals = hospitals
    .filter(h => h.capacity >= lo && h.capacity <= hi && h.honmeiIndex != null && h.honmeiIndex > 0)
    .map(h => h.honmeiIndex)
    .sort((a,b) => a - b)
  if (vals.length >= 10) {
    bandFloors[`${lo}-${hi}`] = vals[Math.floor(vals.length * 0.10)]
  }
}
console.log('異常値フロア（P10）:', JSON.stringify(bandFloors))

// Load 2025 JRMP data to identify programs with verified honmeiIndex
let verified2025 = new Set()
try {
  const jrmpData = JSON.parse(readFileSync('/tmp/jrmp2025.json', 'utf-8'))
  for (const [pid, info] of Object.entries(jrmpData)) {
    if (info.honmeiIndex != null && info.honmeiIndex > 0 && info.honmeiIndex <= 1.0) {
      verified2025.add(pid)
    }
  }
  console.log(`2025年検証済みhonmeiIndex: ${verified2025.size}件をロード`)
} catch { console.log('2025年データなし — 異常値補正を通常実行') }

// Save original honmeiIndex before any modification
for (const h of hospitals) {
  h._originalHonmei = h.honmeiIndex
  h._is2025Verified = verified2025.has(h.programId)
}

let fixedCount = 0
for (const h of hospitals) {
  if (h.honmeiIndex == null || h.honmeiIndex <= 0) continue
  const band = capBands.find(([lo,hi]) => h.capacity >= lo && h.capacity <= hi)
  if (!band) continue
  const floor = bandFloors[`${band[0]}-${band[1]}`]
  if (floor && h.honmeiIndex < floor && h.applicants >= 20 && !h._is2025Verified) {
    // Anomalous: likely program ID mismatch. Replace with band median
    const bandMedian = hospitals
      .filter(x => x.capacity >= band[0] && x.capacity <= band[1] && x._originalHonmei != null && x._originalHonmei > 0)
      .map(x => x._originalHonmei)
      .sort((a,b) => a - b)
    const median = bandMedian[Math.floor(bandMedian.length / 2)]
    h.honmeiIndex = median
    h._wasFixed = true
    fixedCount++
  }
}
console.log(`異常値修正: ${fixedCount}件`)

// Improved fallback for missing/corrected honmeiIndex using matchRate history
// Logic: hospitals that consistently fill all seats attract serious applicants,
// so their honmeiIndex should be higher than the generic median.
// This replaces the flat median (0.33-0.36) with a matchRate-aware estimate.
// Improved fallback using matchRate history
// ONLY for hospitals where honmeiIndex was missing or replaced by anomaly detection
// Never overwrite valid original data
let improvedCount = 0
for (const h of hospitals) {
  if (h._is2025Verified) continue // 2025 data is authoritative, skip estimation
  const needsImprovement = h._wasFixed || h._originalHonmei == null || h._originalHonmei <= 0

  // Also flag: matchRate 100% but honmei < 0.40 AND original data was missing/fixed
  // (NOT for hospitals with valid original honmei — low honmei + 100% matchRate is normal for universities)
  const mr3y = h.avgMatchRate3y || h.matchRate || 0
  const hadValidOriginal = h._originalHonmei != null && h._originalHonmei > 0 && !h._wasFixed
  const suspiciouslyLow = mr3y >= 100 && h.honmeiIndex != null && h.honmeiIndex < 0.40 && !hadValidOriginal

  if (needsImprovement || suspiciouslyLow) {
    if (mr3y >= 100) {
      h.honmeiIndex = 0.55
      improvedCount++
    } else if (mr3y >= 80) {
      h.honmeiIndex = 0.42
      improvedCount++
    }
  }
}
console.log(`充足率ベース推定: ${improvedCount}件のhonmeiIndexを充足率から推定`)

// Calculate 本気倍率 for each hospital
for (const h of hospitals) {
  if (h.capacity === 0) {
    h._honkiBairitsu = 0
    continue
  }
  const hi = (h.honmeiIndex != null && h.honmeiIndex > 0) ? h.honmeiIndex : medianHonmei
  // 本気倍率 = (志望者 × 第1志望率) / 定員
  h._honkiBairitsu = (h.applicants * hi) / h.capacity
}

// Small-sample correction: capacity 1-2 programs have inflated honkiBairitsu
// due to statistical noise. Apply Bayesian shrinkage toward the mean ONLY for these.
const globalMeanHonki = hospitals.reduce((a, h) => a + h._honkiBairitsu, 0) / hospitals.length
// Graduated shrinkage: smaller capacity → stronger pull toward mean
for (const h of hospitals) {
  if (h.capacity > 0 && h.capacity <= 4) {
    // Calibrated to make each capacity band average ≈ 47 (same as cap 11-15 baseline)
    // cap1: C=50, cap2: C=30, cap3: C=15, cap4: C=8
    const C = h.capacity === 1 ? 50 : h.capacity === 2 ? 30 : h.capacity === 3 ? 15 : 8
    h._honkiBairitsu = (h._honkiBairitsu * h.capacity + globalMeanHonki * C) / (h.capacity + C)
  }
}
const smallCount = hospitals.filter(h => h.capacity <= 4).length
console.log(`小規模補正: 定員1-4の${smallCount}件に段階的ベイズ縮小適用 (全体平均=${globalMeanHonki.toFixed(2)})`)

// Log-transform for more natural distribution (倍率 is log-normal)
for (const h of hospitals) {
  h._logHonki = h._honkiBairitsu > 0 ? Math.log(h._honkiBairitsu) : -3 // floor for 0
}
const logValues = hospitals.map(h => h._logHonki)
const mean = logValues.reduce((a, b) => a + b, 0) / logValues.length
const std = Math.sqrt(logValues.reduce((a, b) => a + (b - mean) ** 2, 0) / logValues.length)

console.log(`本気倍率: mean=${mean.toFixed(3)}, std=${std.toFixed(3)}`)

// Calculate new hensachi from log-transformed z-scores
for (const h of hospitals) {
  const z = std > 0 ? (h._logHonki - mean) / std : 0
  h.hensachi = Math.round((50 + 10 * z) * 10) / 10
  // Soft clamp: min 30, max 80 (偏差値 range that users understand)
  h.hensachi = Math.max(30, Math.min(80, h.hensachi))
}

// Post-hoc capacity bias correction
// Measure each capacity band's average hensachi, then adjust toward baseline (cap 8-15 avg)
const baseline = hospitals.filter(h => h.capacity >= 8 && h.capacity <= 15)
const baselineAvg = baseline.reduce((a, h) => a + h.hensachi, 0) / baseline.length
for (let cap = 1; cap <= 4; cap++) {
  const group = hospitals.filter(h => h.capacity === cap)
  if (group.length < 5) continue
  const groupAvg = group.reduce((a, h) => a + h.hensachi, 0) / group.length
  const bias = groupAvg - baselineAvg
  if (bias > 2) { // only correct upward bias > 2 points
    for (const h of group) {
      h.hensachi = Math.round((h.hensachi - bias) * 10) / 10
      h.hensachi = Math.max(30, h.hensachi)
    }
    console.log(`定員${cap}: バイアス${bias.toFixed(1)}pt補正 (${group.length}件, 平均${groupAvg.toFixed(1)}→${(groupAvg-bias).toFixed(1)})`)
  }
}

// Detect university hospitals from name
const uniPatterns = ['大学病院', '大学附属', '大学医学部', '大学付属', '医科大学']
for (const h of hospitals) {
  h.isUniversity = uniPatterns.some(p => h.name.includes(p) || h.program.includes(p))
}

// Deduplicate: pick each hospital's main program (largest capacity) for ranking
// Sub-programs (小児科専門, 産婦人科専門 etc.) inherit the main program's rank
const byName = {}
for (const h of hospitals) {
  if (!byName[h.name] || h.capacity > byName[h.name].capacity) {
    byName[h.name] = h
  }
}
const mainPrograms = Object.values(byName)
const sorted = mainPrograms.sort((a, b) => b.hensachi - a.hensachi || b._honkiBairitsu - a._honkiBairitsu)
const rankByName = {}
for (let i = 0; i < sorted.length; i++) {
  rankByName[sorted[i].name] = i + 1
}
// Assign rank to all programs (including sub-programs)
for (const h of hospitals) {
  h.popularityRank = rankByName[h.name] || 9999
}
console.log(`ランキング: ${mainPrograms.length}病院（${hospitals.length}プログラムから本体のみ抽出）`)

// Print top 50 for verification
console.log('\n=== TOP 50 ===')
for (let i = 0; i < 50; i++) {
  const h = sorted[i]
  const uni = h.isUniversity ? '🏫' : '🏥'
  console.log(`${i + 1}. ${uni} ${h.name} (${h.prefecture}) — 偏差値${h.hensachi} | 本気倍率${h._honkiBairitsu.toFixed(2)} | 倍率${h.popularity} | honmei=${h.honmeiIndex || 'N/A'}`)
}

// Print university vs community stats
const uniHospitals = sorted.filter(h => h.isUniversity)
const comHospitals = sorted.filter(h => !h.isUniversity)
const top50Uni = sorted.slice(0, 50).filter(h => h.isUniversity).length
const top50Com = sorted.slice(0, 50).filter(h => !h.isUniversity).length
console.log(`\n=== 大学 vs 市中 (top50) ===`)
console.log(`大学: ${top50Uni}件, 市中: ${top50Com}件`)
console.log(`大学平均偏差値: ${(uniHospitals.reduce((a, h) => a + h.hensachi, 0) / uniHospitals.length).toFixed(1)}`)
console.log(`市中平均偏差値: ${(comHospitals.reduce((a, h) => a + h.hensachi, 0) / comHospitals.length).toFixed(1)}`)

// Now rewrite the file
function serializeHospital(h) {
  const parts = [
    `id: ${h.id}`,
    `name: '${h.name}'`,
    `prefecture: '${h.prefecture}'`,
    `programId: '${h.programId}'`,
    `program: '${h.program}'`,
    `capacity: ${h.capacity}`,
    `matched: ${h.matched}`,
    `vacancy: ${h.vacancy}`,
    `applicants: ${h.applicants}`,
    `matchRate: ${h.matchRate}`,
    `popularity: ${h.popularity}`,
  ]
  if (h.avgMatchRate3y != null) parts.push(`avgMatchRate3y: ${h.avgMatchRate3y}`)
  if (h.honmeiIndex != null) parts.push(`honmeiIndex: ${h.honmeiIndex}`)
  if (h.popularityTrend != null) parts.push(`popularityTrend: ${h.popularityTrend}`)
  parts.push(`hensachi: ${h.hensachi}`)
  if (h.anabaScore != null) parts.push(`anabaScore: ${h.anabaScore}`)
  if (h.risingScore != null) parts.push(`risingScore: ${h.risingScore}`)
  if (h.stabilityScore != null) parts.push(`stabilityScore: ${h.stabilityScore}`)
  parts.push(`popularityRank: ${h.popularityRank}`)
  if (h.firstChoiceTrend != null) {
    const fct = JSON.stringify(h.firstChoiceTrend).replace(/"/g, "'")
    parts.push(`firstChoiceTrend: ${fct}`)
  }
  if (h.isUniversity) parts.push(`isUniversity: true`)
  return `  { ${parts.join(', ')} },`
}

const newDataLines = hospitals.map(serializeHospital)
const output = [...headerLines, ...newDataLines, ...footerLines].join('\n')
writeFileSync(filePath, output, 'utf-8')
console.log('\n✅ hospitals-data.ts updated with 本気倍率-based 偏差値')
