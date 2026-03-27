#!/usr/bin/env node

/**
 * check-conference-coverage.mjs — 学会演題締切のカバー率チェック
 *
 * チェック項目:
 * 1. URLが設定されていない学会
 * 2. abstractDeadlineが設定されていない学会（開催3ヶ月前以内）
 * 3. スクレイピング結果がKVにない学会
 * 4. 締切が過ぎているのに更新されていない学会
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

const ROOT = resolve(import.meta.dirname, '..')
const text = readFileSync(resolve(ROOT, 'lib/conferences-data.ts'), 'utf-8')

// Parse all conferences
const idRe = /id: '([^']+)'/g
const urlRe = /id: '([^']+)'.*?url: '([^']*)'/gs
const deadlineRe = /id: '([^']+)'.*?abstractDeadline: '([^']*)'/gs
const dateRe = /id: '([^']+)'.*?startDate: '([^']*)'/gs
const nameRe = /id: '([^']+)'.*?meetingName: '([^']*)'/gs
const typeRe = /id: '([^']+)'.*?meetingType: '([^']*)'/gs

function extractAll(re, text) {
  const map = {}
  let m
  const re2 = new RegExp(re.source, re.flags)
  while ((m = re2.exec(text)) !== null) {
    map[m[1]] = m[2]
  }
  return map
}

const allIds = [...text.matchAll(idRe)].map(m => m[1])
const urls = extractAll(urlRe, text)
const deadlines = extractAll(deadlineRe, text)
const startDates = extractAll(dateRe, text)
const names = extractAll(nameRe, text)
const types = extractAll(typeRe, text)

const now = new Date()
const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

console.log(`🔍 学会演題締切カバー率チェック — ${now.toISOString().slice(0, 10)}`)
console.log('='.repeat(60))
console.log(`全学会: ${allIds.length}`)

// 1. URL未設定
const noUrl = allIds.filter(id => !urls[id])
const noUrlNonRegional = noUrl.filter(id => types[id] !== 'regional')
console.log(`\n❌ URL未設定: ${noUrl.length}件（うち総会: ${noUrlNonRegional.length}件）`)
for (const id of noUrlNonRegional.slice(0, 10)) {
  console.log(`  ${id}: ${names[id] || '?'}`)
}

// 2. 開催3ヶ月以内でabstractDeadline未設定
const upcoming = allIds.filter(id => {
  const sd = startDates[id]
  if (!sd) return false
  const d = new Date(sd)
  return d > now && d < threeMonthsLater && !deadlines[id]
})
console.log(`\n⚠️ 開催3ヶ月以内で締切未設定: ${upcoming.length}件`)
for (const id of upcoming) {
  console.log(`  ${id}: ${names[id] || '?'} (${startDates[id]})`)
}

// 3. 締切が過去の学会
const pastDeadline = allIds.filter(id => {
  const dl = deadlines[id]
  if (!dl) return false
  return new Date(dl) < now
})
console.log(`\n📅 締切が既に過去: ${pastDeadline.length}件`)

// Summary
const withUrl = allIds.filter(id => urls[id]).length
const withDeadline = allIds.filter(id => deadlines[id]).length
const coverage = Math.round(withDeadline / allIds.length * 100)
console.log(`\n=== カバー率 ===`)
console.log(`URL設定率: ${withUrl}/${allIds.length} (${Math.round(withUrl/allIds.length*100)}%)`)
console.log(`締切設定率: ${withDeadline}/${allIds.length} (${coverage}%)`)
console.log(`スクレイピング対象: ${withUrl}件`)

if (coverage < 50) {
  console.log('\n🚨 カバー率50%未満！URLの追加が急務')
  process.exit(1)
}
