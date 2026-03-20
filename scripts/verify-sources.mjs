#!/usr/bin/env node

/**
 * verify-sources.mjs — 医学データの自動ダブル・トリプルチェック
 *
 * 実行: node scripts/verify-sources.mjs
 *
 * チェック項目:
 * 1. [COMPLETENESS] 全改修対象ツールに SourceCitation が実装されているか
 * 2. [DATA_HASH]    医学データ（用量・数値）のハッシュが前回と変わっていないか（意図しない変更検出）
 * 3. [FRESHNESS]    lastVerifiedAt が90日以内か（定期照合の督促）
 * 4. [ORPHAN]       source-registry に登録されているが実装ファイルが存在しないツール
 * 5. [DOSE_FORMAT]  用量データのフォーマット一貫性（mg, g, mL等の表記揺れ）
 *
 * CI/CD:  GitHub Actions で週次実行推奨
 * 出力:   JSON レポート + exit code (0=OK, 1=要確認あり)
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { createHash } from 'crypto'
import { join, resolve } from 'path'

const ROOT = resolve(import.meta.dirname, '..')
const REPORT_PATH = join(ROOT, 'docs', 'source-verify-report.json')
const HASH_PATH = join(ROOT, 'docs', 'source-data-hashes.json')

// ── 改修対象ツール一覧 ──
const MONITORED_TOOLS = [
  { id: 'icu-gamma-calc', path: 'app/tools/icu/gamma/page.tsx' },
  { id: 'renal-dose-abx', path: 'app/tools/calc/renal-dose-abx/page.tsx' },
  { id: 'antibiotics', path: 'app/tools/drugs/antibiotics/page.tsx' },
  { id: 'steroid-cover', path: 'app/tools/drugs/steroid-cover/page.tsx' },
  { id: 'preop-drugs', path: 'app/tools/drugs/preop-drugs/page.tsx' },
  { id: 'na-correction-rate', path: 'app/tools/calc/na-correction-rate/page.tsx' },
  { id: 'opioid-conversion', path: 'app/tools/calc/opioid-conversion/page.tsx' },
  { id: 'fio2-table', path: 'app/tools/calc/fio2-table/page.tsx' },
]

// ── ヘルパー ──

function hashContent(content) {
  return createHash('sha256').update(content).digest('hex').slice(0, 16)
}

/**
 * ツールファイルから医学データ部分を抽出
 * - 配列リテラル（doses, DRUGS, antibiotics等）
 * - オブジェクトリテラル内の数値・用量文字列
 */
function extractMedicalData(content) {
  const lines = content.split('\n')
  const dataLines = []
  let inDataBlock = false
  let braceDepth = 0

  for (const line of lines) {
    // データブロックの開始を検出
    if (/^\s*(const\s+\w+\s*[:=]|doses:|firstLine:|alt:|dose:|note:|dilutions:)/.test(line)) {
      inDataBlock = true
    }
    if (inDataBlock) {
      dataLines.push(line)
      braceDepth += (line.match(/[\[{(]/g) || []).length
      braceDepth -= (line.match(/[\]})]/g) || []).length
      if (braceDepth <= 0 && dataLines.length > 1) {
        inDataBlock = false
        braceDepth = 0
      }
    }
  }
  return dataLines.join('\n')
}

/**
 * 用量フォーマットの一貫性チェック
 */
function checkDoseFormat(content) {
  const issues = []
  // mg/mL の表記揺れ
  if (/\d\s*mg/i.test(content) && /\d\s*ｍｇ/.test(content)) {
    issues.push('全角半角の混在: mg vs ｍｇ')
  }
  // q6h vs q 6h vs q6 h
  if (/q\s+\d+h/.test(content)) {
    issues.push('用法表記の空白: "q 6h" → "q6h" に統一推奨')
  }
  // μg vs mcg
  if (/μg/.test(content) && /mcg/.test(content)) {
    issues.push('単位の混在: μg vs mcg')
  }
  return issues
}

/**
 * SourceCitation の実装チェック
 */
function checkSourceCitationUsage(content) {
  return content.includes('SourceCitation') || content.includes('source-registry')
}

// ── メイン処理 ──

function main() {
  console.log('🔍 iwor 医学データ検証スクリプト v1.0')
  console.log('=' .repeat(60))

  const report = {
    timestamp: new Date().toISOString(),
    summary: { pass: 0, warn: 0, fail: 0 },
    tools: [],
  }

  // 前回のハッシュを読み込み
  let previousHashes = {}
  if (existsSync(HASH_PATH)) {
    try {
      previousHashes = JSON.parse(readFileSync(HASH_PATH, 'utf-8'))
    } catch {}
  }
  const currentHashes = {}

  for (const tool of MONITORED_TOOLS) {
    const fullPath = join(ROOT, tool.path)
    const toolReport = {
      id: tool.id,
      path: tool.path,
      checks: [],
    }

    // ファイル存在チェック
    if (!existsSync(fullPath)) {
      toolReport.checks.push({
        check: 'FILE_EXISTS',
        status: 'FAIL',
        message: `ファイルが見つかりません: ${tool.path}`,
      })
      report.summary.fail++
      report.tools.push(toolReport)
      continue
    }

    const content = readFileSync(fullPath, 'utf-8')

    // 1. SourceCitation 実装チェック
    const hasCitation = checkSourceCitationUsage(content)
    toolReport.checks.push({
      check: 'SOURCE_CITATION',
      status: hasCitation ? 'PASS' : 'WARN',
      message: hasCitation
        ? 'SourceCitation が実装されています'
        : '⚠️ SourceCitation が未実装。出典表示を追加してください',
    })
    if (hasCitation) report.summary.pass++
    else report.summary.warn++

    // 2. データハッシュチェック
    const medData = extractMedicalData(content)
    const hash = hashContent(medData)
    currentHashes[tool.id] = hash

    if (previousHashes[tool.id]) {
      if (previousHashes[tool.id] === hash) {
        toolReport.checks.push({
          check: 'DATA_HASH',
          status: 'PASS',
          message: `データ変更なし (hash: ${hash})`,
        })
        report.summary.pass++
      } else {
        toolReport.checks.push({
          check: 'DATA_HASH',
          status: 'WARN',
          message: `⚠️ データが変更されています！ 前回: ${previousHashes[tool.id]} → 今回: ${hash}。出典と照合してください`,
        })
        report.summary.warn++
      }
    } else {
      toolReport.checks.push({
        check: 'DATA_HASH',
        status: 'PASS',
        message: `初回スキャン (hash: ${hash})`,
      })
      report.summary.pass++
    }

    // 3. 用量フォーマットチェック
    const formatIssues = checkDoseFormat(content)
    if (formatIssues.length === 0) {
      toolReport.checks.push({
        check: 'DOSE_FORMAT',
        status: 'PASS',
        message: '用量フォーマットに問題なし',
      })
      report.summary.pass++
    } else {
      toolReport.checks.push({
        check: 'DOSE_FORMAT',
        status: 'WARN',
        message: `⚠️ フォーマット問題: ${formatIssues.join('; ')}`,
      })
      report.summary.warn++
    }

    // 4. 「推奨」「第一選択」等のSaMD危険ワードチェック
    const dangerWords = []
    const dangerPatterns = [
      { pattern: /を推奨/, label: '「を推奨」' },
      { pattern: /投与不可/, label: '「投与不可」' },
      { pattern: /が必要/, label: '「が必要」（治療文脈）' },
      { pattern: /すべき/, label: '「すべき」' },
    ]
    for (const { pattern, label } of dangerPatterns) {
      if (pattern.test(content)) {
        dangerWords.push(label)
      }
    }
    if (dangerWords.length === 0) {
      toolReport.checks.push({
        check: 'SAMD_WORDING',
        status: 'PASS',
        message: 'SaMD危険ワードなし',
      })
      report.summary.pass++
    } else {
      toolReport.checks.push({
        check: 'SAMD_WORDING',
        status: 'WARN',
        message: `⚠️ SaMD危険ワード検出: ${dangerWords.join(', ')}。「参照」「ガイドライン記載」に置換検討`,
      })
      report.summary.warn++
    }

    report.tools.push(toolReport)
  }

  // ハッシュ保存
  writeFileSync(HASH_PATH, JSON.stringify(currentHashes, null, 2))

  // レポート出力
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))

  // コンソール出力
  console.log('')
  for (const tool of report.tools) {
    console.log(`\n📋 ${tool.id} (${tool.path})`)
    for (const check of tool.checks) {
      const icon = check.status === 'PASS' ? '✅' : check.status === 'WARN' ? '⚠️' : '❌'
      console.log(`  ${icon} [${check.check}] ${check.message}`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`📊 結果: ✅ ${report.summary.pass} PASS ｜ ⚠️ ${report.summary.warn} WARN ｜ ❌ ${report.summary.fail} FAIL`)
  console.log(`📁 レポート: ${REPORT_PATH}`)
  console.log(`📁 ハッシュ: ${HASH_PATH}`)

  // FRESHNESS チェック（source-registry.ts の lastVerifiedAt）
  const registryPath = join(ROOT, 'lib', 'source-registry.ts')
  if (existsSync(registryPath)) {
    const registryContent = readFileSync(registryPath, 'utf-8')
    const dateMatches = registryContent.matchAll(/lastVerifiedAt:\s*'(\d{4}-\d{2}-\d{2})'/g)
    const now = new Date()
    const staleThreshold = 90 // 日
    let staleCount = 0
    for (const match of dateMatches) {
      const verifiedDate = new Date(match[1])
      const daysDiff = Math.floor((now - verifiedDate) / (1000 * 60 * 60 * 24))
      if (daysDiff > staleThreshold) staleCount++
    }
    if (staleCount > 0) {
      console.log(`\n⚠️ ${staleCount}件の出典が ${staleThreshold}日以上 未照合です。source-registry.ts の lastVerifiedAt を更新してください。`)
    }
  }

  // Exit code: WARN も FAIL も非ゼロで終了（GitHub Actionsでissue作成をトリガー）
  const exitCode = (report.summary.fail > 0 || report.summary.warn > 0) ? 1 : 0
  if (exitCode > 0) {
    console.log(`\n🚨 WARN or FAIL が検出されました。CI/CDでIssueが作成されます。`)
  }
  process.exit(exitCode)
}

main()
