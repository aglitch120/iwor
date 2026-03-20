'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import Link from 'next/link'
import AppHeader from '@/components/AppHeader'
import { CBT_CARDS, TAGS, FlashCard } from './cbt-cards'
import {
  Rating, CardData,
  createNewCard, reviewCard, getScheduledIntervals,
  getDueCards, loadAllCardData, saveAllCardData,
} from './fsrs'

const MC = '#1B4F3A'
const MCL = '#E8F0EC'

// ── セッション統計（localStorage） ──
const STATS_KEY = 'iwor_study_stats'
interface DayStats { date: string; reviewed: number; correct: number }

function getTodayStats(): DayStats {
  const today = new Date().toISOString().split('T')[0]
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (raw) {
      const stats: DayStats = JSON.parse(raw)
      if (stats.date === today) return stats
    }
  } catch {}
  return { date: today, reviewed: 0, correct: 0 }
}

function saveTodayStats(stats: DayStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

// ── メインコンポーネント ──
type Screen = 'home' | 'study' | 'result'

const RATING_BUTTONS: { rating: Rating; label: string; color: string; bgColor: string; borderColor: string }[] = [
  { rating: 1, label: 'もう一度', color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA' },
  { rating: 2, label: '難しい',  color: '#D97706', bgColor: '#FFFBEB', borderColor: '#FDE68A' },
  { rating: 3, label: '正解',    color: '#059669', bgColor: '#ECFDF5', borderColor: '#A7F3D0' },
  { rating: 4, label: '余裕',    color: '#2563EB', bgColor: '#EFF6FF', borderColor: '#BFDBFE' },
]

export default function StudyApp() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [studyQueue, setStudyQueue] = useState<number[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [dayStats, setDayStats] = useState<DayStats>({ date: '', reviewed: 0, correct: 0 })
  const [cardDataMap, setCardDataMap] = useState<Map<number, CardData>>(new Map())

  // Load data on mount
  useEffect(() => {
    setDayStats(getTodayStats())
    setCardDataMap(loadAllCardData())
  }, [])

  // ── Filtered card IDs ──
  const filteredIds = useMemo(() => {
    if (selectedTags.size === 0) return CBT_CARDS.map(c => c.id)
    return CBT_CARDS.filter(c => selectedTags.has(c.tag)).map(c => c.id)
  }, [selectedTags])

  // ── Due counts ──
  const dueInfo = useMemo(() => {
    const now = new Date()
    let dueCount = 0
    let newCount = 0
    let learningCount = 0

    for (const id of filteredIds) {
      const data = cardDataMap.get(id)
      if (!data || data.state === 'new') {
        newCount++
        continue
      }
      if (data.state === 'learning' || data.state === 'relearning') {
        learningCount++
        dueCount++
        continue
      }
      if (data.lastReview) {
        const elapsed = (now.getTime() - new Date(data.lastReview).getTime()) / (1000 * 60 * 60 * 24)
        if (elapsed >= data.scheduledDays) dueCount++
      }
    }

    return { dueCount, newCount, learningCount, total: filteredIds.length }
  }, [filteredIds, cardDataMap])

  // ── Start session ──
  const startSession = useCallback(() => {
    const queue = getDueCards(cardDataMap, filteredIds)
    if (queue.length === 0) return
    setStudyQueue(queue)
    setCurrentIdx(0)
    setFlipped(false)
    setSessionCorrect(0)
    setSessionTotal(0)
    setScreen('study')
  }, [cardDataMap, filteredIds])

  // ── Answer with FSRS rating ──
  const answer = useCallback((rating: Rating) => {
    const cardId = studyQueue[currentIdx]
    const existing = cardDataMap.get(cardId) || createNewCard(cardId)
    const updated = reviewCard(existing, rating)

    // Update map
    const newMap = new Map<number, CardData>()
    cardDataMap.forEach((v, k) => newMap.set(k, v))
    newMap.set(cardId, updated)
    setCardDataMap(newMap)
    saveAllCardData(newMap)

    // Session stats
    const isCorrect = rating >= 3
    setSessionTotal(prev => prev + 1)
    if (isCorrect) setSessionCorrect(prev => prev + 1)

    // Day stats
    const stats = getTodayStats()
    stats.reviewed++
    if (isCorrect) stats.correct++
    saveTodayStats(stats)
    setDayStats({ ...stats })

    // Next card or result
    if (currentIdx + 1 >= studyQueue.length) {
      setScreen('result')
    } else {
      setCurrentIdx(currentIdx + 1)
      setFlipped(false)
    }
  }, [studyQueue, currentIdx, cardDataMap])

  // ── Tag toggle ──
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => {
      const n = new Set(prev)
      n.has(tag) ? n.delete(tag) : n.add(tag)
      return n
    })
  }, [])

  // ── Current card helpers ──
  const currentCard = useMemo(() => {
    if (screen !== 'study' || studyQueue.length === 0) return null
    return CBT_CARDS.find(c => c.id === studyQueue[currentIdx]) || null
  }, [screen, studyQueue, currentIdx])

  const intervalPreviews = useMemo(() => {
    if (!currentCard) return []
    const data = cardDataMap.get(currentCard.id) || createNewCard(currentCard.id)
    return getScheduledIntervals(data)
  }, [currentCard, cardDataMap])

  // ──────── ホーム画面 ────────
  if (screen === 'home') {
    return (
      <div className="px-4 py-8 max-w-lg mx-auto">
        <AppHeader
          title="iwor Study"
          subtitle="医学フラッシュカード — FSRS搭載の科学的復習スケジューラー"
          badge="NEW"
          favoriteSlug="app-study"
          favoriteHref="/study"
        />

        {/* 今日の統計 */}
        {dayStats.reviewed > 0 && (
          <div className="bg-s0 border border-br rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-muted mb-2">今日の学習</p>
            <div className="flex gap-4">
              <div className="text-center flex-1">
                <p className="text-2xl font-bold" style={{ color: MC }}>{dayStats.reviewed}</p>
                <p className="text-[10px] text-muted">枚</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold" style={{ color: MC }}>
                  {dayStats.reviewed > 0 ? Math.round((dayStats.correct / dayStats.reviewed) * 100) : 0}%
                </p>
                <p className="text-[10px] text-muted">正答率</p>
              </div>
            </div>
          </div>
        )}

        {/* デッキ */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-tx mb-3">デッキ</h2>
          <button
            onClick={startSession}
            className="w-full bg-s0 border border-br rounded-xl p-4 hover:border-ac/40 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: MCL }}>
                  🧠
                </div>
                <div>
                  <p className="text-sm font-bold text-tx">CBT基礎</p>
                  <p className="text-[11px] text-muted">{dueInfo.total}枚</p>
                </div>
              </div>
              {/* Due badges */}
              <div className="flex items-center gap-1.5">
                {dueInfo.dueCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">
                    復習 {dueInfo.dueCount}
                  </span>
                )}
                {dueInfo.newCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 border border-blue-200">
                    新規 {dueInfo.newCount}
                  </span>
                )}
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* タグフィルタ */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-tx mb-3">分野で絞り込み</h2>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selectedTags.has(tag)
                    ? 'text-white border-transparent'
                    : 'border-br text-muted hover:border-ac/30'
                }`}
                style={selectedTags.has(tag) ? { background: MC } : undefined}
              >
                {tag}
              </button>
            ))}
            {selectedTags.size > 0 && (
              <button
                onClick={() => setSelectedTags(new Set())}
                className="px-3 py-1.5 rounded-lg text-xs text-muted hover:text-tx transition-colors"
              >
                ✕ リセット
              </button>
            )}
          </div>
        </div>

        {/* 将来のデッキ（プレースホルダー） */}
        <div className="space-y-3 mb-8">
          {['国試必修', '内科基礎'].map(name => (
            <div key={name} className="bg-s0 border border-br rounded-xl p-4 opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-s1">🔒</div>
                <div>
                  <p className="text-sm font-bold text-tx">{name}</p>
                  <p className="text-[11px] text-muted">準備中</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FSRS説明 */}
        <div className="bg-s1 rounded-xl p-4 mb-6 text-[11px] text-muted leading-relaxed">
          <p className="font-bold text-tx mb-1">📊 FSRSアルゴリズム搭載</p>
          <p>科学的な復習スケジューリングで効率よく記憶を定着。回答の自信度に応じて次の復習タイミングを最適化します。</p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-muted hover:text-ac transition-colors">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  // ──────── 学習画面 ────────
  if (screen === 'study' && currentCard) {
    const progress = ((currentIdx) / studyQueue.length) * 100

    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setScreen('home')} className="text-xs text-muted hover:text-tx transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </button>
          <span className="text-xs font-medium text-muted">{currentIdx + 1} / {studyQueue.length}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: MCL, color: MC }}>
            {currentCard.tag}
          </span>
        </div>

        {/* プログレスバー */}
        <div className="w-full h-1.5 bg-s1 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: MC }}
          />
        </div>

        {/* カード */}
        <div
          className="perspective-1000 mb-6 cursor-pointer select-none"
          onClick={() => setFlipped(!flipped)}
          style={{ perspective: '1000px' }}
        >
          <div
            className="relative w-full transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '280px',
            }}
          >
            {/* 表面 */}
            <div
              className="absolute inset-0 bg-s0 border border-br rounded-2xl p-6 flex flex-col justify-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center">
                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-4" style={{ background: MCL, color: MC }}>
                  Question
                </span>
                <p className="text-base font-bold text-tx leading-relaxed">
                  {currentCard.front}
                </p>
                <p className="text-xs text-muted mt-6">タップで回答を表示</p>
              </div>
            </div>

            {/* 裏面 */}
            <div
              className="absolute inset-0 bg-s0 border-2 rounded-2xl p-6 flex flex-col justify-center overflow-y-auto"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                borderColor: `${MC}40`,
              }}
            >
              <div>
                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-3" style={{ background: MC, color: '#fff' }}>
                  Answer
                </span>
                <div className="text-sm text-tx leading-relaxed whitespace-pre-line">
                  {currentCard.back}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FSRS 4択回答ボタン */}
        {flipped && (
          <div className="grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {RATING_BUTTONS.map((btn, i) => {
              const preview = intervalPreviews[i]
              return (
                <button
                  key={btn.rating}
                  onClick={() => answer(btn.rating)}
                  className="py-3 rounded-xl text-center border-2 transition-all hover:opacity-90 active:scale-95"
                  style={{
                    color: btn.color,
                    background: btn.bgColor,
                    borderColor: btn.borderColor,
                  }}
                >
                  <span className="text-[10px] font-bold block">{preview?.label || ''}</span>
                  <span className="text-xs font-bold block mt-0.5">{btn.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {!flipped && (
          <div className="text-center">
            <p className="text-[11px] text-muted">カードをタップして裏面を確認してください</p>
          </div>
        )}
      </div>
    )
  }

  // ──────── 結果画面 ────────
  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0
  const emoji = accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'
  const message = accuracy >= 80 ? '素晴らしい！' : accuracy >= 60 ? 'いい調子！' : 'もう一周しよう！'

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <div className="bg-s0 border border-br rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">{emoji}</div>
        <h2 className="text-xl font-bold text-tx mb-1">{message}</h2>
        <p className="text-sm text-muted mb-6">セッション完了</p>

        <div className="flex gap-4 justify-center mb-8">
          <div className="bg-bg rounded-xl p-4 flex-1">
            <p className="text-2xl font-bold" style={{ color: MC }}>{sessionTotal}</p>
            <p className="text-[10px] text-muted">学習枚数</p>
          </div>
          <div className="bg-bg rounded-xl p-4 flex-1">
            <p className="text-2xl font-bold" style={{ color: MC }}>{accuracy}%</p>
            <p className="text-[10px] text-muted">正答率</p>
          </div>
          <div className="bg-bg rounded-xl p-4 flex-1">
            <p className="text-2xl font-bold" style={{ color: MC }}>{sessionCorrect}</p>
            <p className="text-[10px] text-muted">正解数</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={startSession}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-colors hover:opacity-90"
            style={{ background: MC }}
          >
            もう一度
          </button>
          <button
            onClick={() => setScreen('home')}
            className="w-full py-3 rounded-xl text-sm font-medium text-muted border border-br hover:border-ac/30 transition-colors"
          >
            ホームに戻る
          </button>
        </div>
      </div>

      {/* 今日の累計 */}
      <div className="mt-6 bg-s0 border border-br rounded-xl p-4">
        <p className="text-xs font-bold text-muted mb-2">今日の累計</p>
        <div className="flex gap-4">
          <div className="text-center flex-1">
            <p className="text-lg font-bold" style={{ color: MC }}>{dayStats.reviewed}</p>
            <p className="text-[10px] text-muted">枚</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-lg font-bold" style={{ color: MC }}>
              {dayStats.reviewed > 0 ? Math.round((dayStats.correct / dayStats.reviewed) * 100) : 0}%
            </p>
            <p className="text-[10px] text-muted">正答率</p>
          </div>
        </div>
      </div>
    </div>
  )
}
