'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════
   Storage keys (duplicated intentionally — 
   HomeWidgets reads but never writes)
═══════════════════════════════════ */
const FSRS_KEY = 'iwor_study_fsrs'
const CUSTOM_DECKS_KEY = 'iwor_study_custom_decks'
const STREAK_KEY = 'iwor_study_streak'
const JOSLER_KEY = 'iwor_josler_data'

/* ═══════════════════════════════════
   Types
═══════════════════════════════════ */
interface WidgetData {
  // Study
  studyDue: number
  studyNew: number
  studyStreak: number
  studyTotal: number
  studyReviewed: number  // cards that have been reviewed at least once
  // J-OSLER
  joslerCases: number
  joslerGroups: number
  joslerSummaries: number
  hasJosler: boolean
  hasStudy: boolean
}

/* ═══════════════════════════════════
   Data loaders (read-only, no side effects)
═══════════════════════════════════ */
function loadWidgetData(): WidgetData {
  const result: WidgetData = {
    studyDue: 0, studyNew: 0, studyStreak: 0, studyTotal: 0, studyReviewed: 0,
    joslerCases: 0, joslerGroups: 0, joslerSummaries: 0,
    hasJosler: false, hasStudy: false,
  }

  try {
    // ── Study: FSRS card data ──
    const fsrsRaw = localStorage.getItem(FSRS_KEY)
    if (fsrsRaw) {
      const arr: [string, any][] = JSON.parse(fsrsRaw)
      const now = new Date()
      let due = 0, newC = 0, reviewed = 0

      for (const [, data] of arr) {
        if (!data || data.state === 'new') { newC++; continue }
        reviewed++
        if (data.state === 'learning' || data.state === 'relearning') { due++; continue }
        if (data.lastReview) {
          const elapsed = (now.getTime() - new Date(data.lastReview).getTime()) / (1000 * 60 * 60 * 24)
          if (elapsed >= data.scheduledDays) due++
        }
      }
      result.studyDue = due
      result.studyNew = newC
      result.studyReviewed = reviewed
      result.studyTotal = arr.length
      result.hasStudy = arr.length > 0
    }

    // ── Study: check custom decks exist (even if no FSRS data yet) ──
    if (!result.hasStudy) {
      const customRaw = localStorage.getItem(CUSTOM_DECKS_KEY)
      if (customRaw) {
        const metas = JSON.parse(customRaw)
        if (metas.length > 0) result.hasStudy = true
      }
      // Default decks always exist, so Study is always "available"
      result.hasStudy = true
    }

    // ── Study: streak ──
    const streakRaw = localStorage.getItem(STREAK_KEY)
    if (streakRaw) {
      const streak = JSON.parse(streakRaw)
      result.studyStreak = streak.count || 0
    }

    // ── J-OSLER ──
    const joslerRaw = localStorage.getItem(JOSLER_KEY)
    if (joslerRaw) {
      const data = JSON.parse(joslerRaw)
      result.hasJosler = true

      // Count cases and groups from eg (experience grid)
      if (data.eg) {
        for (const spId of Object.keys(data.eg)) {
          const sp = data.eg[spId] || {}
          for (const dgId of Object.keys(sp)) {
            const dg = sp[dgId]
            if (dg?.on) result.joslerGroups++
            if (dg?.d) {
              result.joslerCases += Object.values(dg.d).filter(Boolean).length
            }
          }
        }
      }

      // Count accepted summaries
      if (data.summaries) {
        result.joslerSummaries = data.summaries.filter((s: any) => s.status === 'accepted').length
      }
    }
  } catch {
    // localStorage read failure — silently return defaults
  }

  return result
}

/* ═══════════════════════════════════
   Progress Bar Component
═══════════════════════════════════ */
function MiniProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--s2)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

/* ═══════════════════════════════════
   Main Component
═══════════════════════════════════ */
export default function HomeWidgets() {
  const [data, setData] = useState<WidgetData | null>(null)

  useEffect(() => {
    setData(loadWidgetData())
  }, [])

  // CLS対策: SSR/初回レンダリング時はスケルトン表示（高さを確保）
  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-hidden="true">
        <div className="rounded-xl p-4 animate-pulse" style={{ background: 'var(--s0)', border: '1px solid var(--br)', minHeight: '100px' }}>
          <div className="h-3 w-12 rounded bg-s2 mb-3" />
          <div className="h-4 w-32 rounded bg-s2 mb-2" />
          <div className="h-1.5 w-full rounded-full bg-s2" />
        </div>
      </div>
    )
  }

  // Don't show if user has no activity at all
  const hasActivity = data.studyReviewed > 0 || data.studyStreak > 0 || data.hasJosler
  if (!hasActivity) return null

  const showStudy = data.studyDue > 0 || data.studyNew > 0 || data.studyStreak > 0
  const showJosler = data.hasJosler

  if (!showStudy && !showJosler) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="アクティビティウィジェット">

      {/* ── Study Widget (Zeigarnik + Streak) ── */}
      {showStudy && (
        <Link href="/study" className="block" aria-label={`Study — ${data.studyDue > 0 ? `${data.studyDue}枚の復習待ち` : data.studyNew > 0 ? `${data.studyNew}枚の新規カード` : '今日の復習完了'}`}>
          <div
            className="rounded-xl p-4 transition-all hover:shadow-md"
            style={{ background: 'var(--s0)', border: '1px solid var(--br)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--m)' }}>Study</span>
              {data.studyStreak > 0 && (
                <span className="text-xs font-bold" style={{ color: 'var(--ac)' }}>
                  🔥 {data.studyStreak}日
                </span>
              )}
            </div>

            {/* Zeigarnik: unfinished reviews pull you back */}
            {data.studyDue > 0 ? (
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--tx)' }}>
                {data.studyDue}枚の復習待ち
              </p>
            ) : data.studyNew > 0 ? (
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--tx)' }}>
                {data.studyNew}枚の新規カード
              </p>
            ) : (
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--ok)' }}>
                ✓ 今日の復習完了
              </p>
            )}

            {/* Goal Gradient: deck completion */}
            {data.studyTotal > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--m)' }}>
                  <span>学習済み</span>
                  <span>{data.studyReviewed}/{data.studyTotal}</span>
                </div>
                <MiniProgress value={data.studyReviewed} max={data.studyTotal} color="var(--ac)" />
              </div>
            )}
          </div>
        </Link>
      )}

      {/* ── コミットメント階段バナー ── */}
      <CommitmentBanner />
    </div>
  )
}

/* ═══════════════════════════════════
   コミットメント階段 + 未触アプリレコメンド
   ペルソナ×使用履歴に基づいて次のステップを提案
═══════════════════════════════════ */

// ペルソナ別おすすめアプリ（優先順）
const PERSONA_APPS: Record<string, { href: string; text: string; cta: string }[]> = {
  student: [
    { href: '/study', text: '毎日5分で医学知識を定着', cta: 'Studyを始める' },
    { href: '/matching', text: 'マッチング対策を始めよう', cta: '病院を探す' },
    { href: '/tools', text: '臨床計算ツールを使ってみよう', cta: 'ツール一覧' },
  ],
  resident: [
    { href: '/tools', text: '当直で使える臨床ツール', cta: 'ツール一覧' },
    { href: '/study', text: '毎日5分で知識をアップデート', cta: 'Studyを始める' },
    { href: '/epoc', text: 'EPOC到達目標を管理', cta: 'EPOCを開く' },
    { href: '/shift', text: '当直シフトを自動作成', cta: 'シフトを作る' },
  ],
  fellow: [
    { href: '/josler', text: 'J-OSLER症例登録を効率化', cta: 'JOSLERを開く' },
    { href: '/josler/summary-generator', text: '病歴要約をAIで下書き', cta: 'AI生成を試す' },
    { href: '/study', text: '専門医試験対策をStudyで', cta: 'Studyを始める' },
    { href: '/journal', text: '論文フィードで最新論文をチェック', cta: '論文を読む' },
  ],
  attending: [
    { href: '/journal', text: '専門分野の最新論文を配信', cta: '論文フィード' },
    { href: '/tools', text: '臨床計算ツール', cta: 'ツール一覧' },
    { href: '/study', text: '生涯学習をStudyで効率化', cta: 'Studyを始める' },
    { href: '/money', text: 'ふるさと納税・NISA・手取り計算', cta: 'マネーツール' },
  ],
}

function CommitmentBanner() {
  const [rec, setRec] = useState<{ text: string; cta: string; href: string; color: string } | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // 直近で閉じたなら24時間は非表示
    const lastDismissed = localStorage.getItem('iwor_recommend_dismissed_at')
    if (lastDismissed && Date.now() - Number(lastDismissed) < 86400000) return

    const role = localStorage.getItem('iwor_user_role') || ''
    const isPro = localStorage.getItem('iwor_pro_user') === 'true'
    const isLoggedIn = !!localStorage.getItem('iwor_session_token')
    let toolUses = 0
    try { const u = JSON.parse(localStorage.getItem('iwor_tool_usage') || '{}'); toolUses = u._total || 0 } catch {}
    const hasFavorites = (localStorage.getItem('iwor_favorites') || '').length > 5
    const hasStudied = !!localStorage.getItem('iwor_study_fsrs')

    // コミットメント階段（ペルソナ未選択 or 初期段階）
    if (toolUses < 3) {
      setRec({ text: '臨床ツールを使ってみましょう', cta: 'ツール一覧', href: '/tools', color: '#6B6760' })
      return
    }
    if (!hasFavorites) {
      setRec({ text: 'よく使うツールをお気に入りに追加', cta: 'お気に入り', href: '/tools', color: '#1B4F3A' })
      return
    }
    if (!isLoggedIn) {
      setRec({ text: 'アカウントを作成してデータを保存', cta: 'アカウント作成', href: '/pro/activate', color: '#1B4F3A' })
      return
    }
    if (isLoggedIn && !hasStudied) {
      setRec({ text: 'iwor Studyで医学知識を定着', cta: 'Studyを始める', href: '/study', color: '#1B4F3A' })
      return
    }
    if (!isPro && isLoggedIn && hasStudied) {
      setRec({ text: 'PRO会員で全機能を解放', cta: 'PRO詳細', href: '/pro', color: '#1B4F3A' })
      return
    }

    // ペルソナ連動: まだ触れていないアプリをレコメンド
    if (role && PERSONA_APPS[role]) {
      const visitedPages = new Set<string>()
      try {
        const usage = JSON.parse(localStorage.getItem('iwor_tool_usage') || '{}')
        Object.keys(usage).forEach(k => { if (k !== '_total') visitedPages.add(k) })
      } catch {}
      // 訪問済みページの簡易判定（localStorageにデータがあるかで判定）
      if (localStorage.getItem('iwor_study_fsrs')) visitedPages.add('/study')
      if (localStorage.getItem('iwor_josler_data')) visitedPages.add('/josler')
      if (localStorage.getItem('iwor_epoc_data')) visitedPages.add('/epoc')

      const unreached = PERSONA_APPS[role].find(app => !visitedPages.has(app.href))
      if (unreached) {
        setRec({ ...unreached, color: '#1B4F3A' })
      }
    }
  }, [])

  if (dismissed || !rec) return null

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem('iwor_recommend_dismissed_at', String(Date.now()))
  }

  return (
    <div className="mt-3 relative">
      <Link href={rec.href} className="block bg-s0 border border-br rounded-xl p-3 hover:border-ac/30 transition-all">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">{rec.text}</p>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-white" style={{ background: rec.color }}>{rec.cta}</span>
        </div>
      </Link>
      <button onClick={dismiss} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-s2 text-muted text-[10px] flex items-center justify-center hover:bg-s1" aria-label="閉じる">&times;</button>
    </div>
  )
}
