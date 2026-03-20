'use client'

import { useState, useMemo } from 'react'
import AppHeader from '@/components/AppHeader'
import { CONFERENCES_2026, Conference, getSpecialtyCategory, SPECIALTY_COLORS } from '@/lib/conferences-data'

type ViewMode = 'list' | 'calendar'

const MC = '#1B4F3A'
const MCL = '#E8F0EC'

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + 'T00:00:00')
  const e = new Date(end + 'T00:00:00')
  const sM = s.getMonth() + 1
  const eM = e.getMonth() + 1
  if (sM === eM) {
    return `${sM}/${s.getDate()}-${e.getDate()}`
  }
  return `${sM}/${s.getDate()}-${eM}/${e.getDate()}`
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function ConferencesApp() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [filterArea, setFilterArea] = useState<string>('all')

  // ソート: 日付順
  const sorted = useMemo(() => {
    let list = [...CONFERENCES_2026]
    if (filterArea !== 'all') {
      list = list.filter(c => c.specialtyArea === filterArea)
    }
    return list.sort((a, b) => a.startDate.localeCompare(b.startDate))
  }, [filterArea])

  // 月ごとにグループ
  const grouped = useMemo(() => {
    const map = new Map<string, Conference[]>()
    for (const c of sorted) {
      const month = c.startDate.slice(0, 7)
      if (!map.has(month)) map.set(month, [])
      map.get(month)!.push(c)
    }
    return map
  }, [sorted])

  // 診療科一覧
  const areas = useMemo(() => {
    const set = new Set(CONFERENCES_2026.map(c => c.specialtyArea))
    return Array.from(set).sort()
  }, [])

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <AppHeader
        title="学会カレンダー"
        subtitle="基本領域19学会 2026年度 学術集会日程"
        badge="NEW"
        favoriteSlug="app-conferences"
        favoriteHref="/conferences"
      />

      {/* ビュー切替 */}
      <div className="flex bg-s1 rounded-xl p-1 mb-4">
        {(['list', 'calendar'] as ViewMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: viewMode === mode ? 'var(--s0)' : 'transparent',
              color: viewMode === mode ? MC : 'var(--m)',
              boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {mode === 'list' ? 'リスト' : '月表示'}
          </button>
        ))}
      </div>

      {/* 診療科フィルタ */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        <button
          onClick={() => setFilterArea('all')}
          className="px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all"
          style={{
            background: filterArea === 'all' ? MCL : 'transparent',
            color: filterArea === 'all' ? MC : undefined,
            borderColor: filterArea === 'all' ? `${MC}40` : 'var(--br)',
          }}
        >
          全て
        </button>
        {areas.map(area => (
          <button
            key={area}
            onClick={() => setFilterArea(area === filterArea ? 'all' : area)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all"
            style={{
              background: filterArea === area ? MCL : 'transparent',
              color: filterArea === area ? MC : undefined,
              borderColor: filterArea === area ? `${MC}40` : 'var(--br)',
            }}
          >
            {area}
          </button>
        ))}
      </div>

      {/* リスト表示 */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([month, confs]) => {
            const [y, m] = month.split('-')
            return (
              <div key={month}>
                <h3 className="text-sm font-bold text-tx mb-3">{y}年{parseInt(m)}月</h3>
                <div className="space-y-3">
                  {confs.map(conf => (
                    <ConferenceCard key={conf.id} conf={conf} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* カレンダー表示 */}
      {viewMode === 'calendar' && (
        <CalendarGrid conferences={sorted} />
      )}
    </div>
  )
}

function ConferenceCard({ conf }: { conf: Conference }) {
  const days = getDaysUntil(conf.startDate)
  const cat = getSpecialtyCategory(conf.specialtyArea)
  const catColor = SPECIALTY_COLORS[cat]
  const isPast = days < 0

  return (
    <div
      className="bg-s0 border border-br rounded-xl p-4 transition-all hover:border-ac/30"
      style={{ opacity: isPast ? 0.6 : 1 }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-1 self-stretch rounded-full shrink-0"
          style={{ background: catColor }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold" style={{ color: catColor }}>
              {formatDateRange(conf.startDate, conf.endDate)}
            </span>
            {days > 0 && days <= 30 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                あと{days}日
              </span>
            )}
            {isPast && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-s1 text-muted border border-br">
                終了
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-tx mb-1 leading-snug">{conf.meetingName}</p>
          <div className="flex items-center gap-2 text-[11px] text-muted">
            <span>📍 {conf.venue}（{conf.city}）</span>
          </div>
          {conf.theme && (
            <p className="text-[10px] text-muted mt-1 italic">「{conf.theme}」</p>
          )}
          {conf.president && (
            <p className="text-[10px] text-muted mt-0.5">
              会長: {conf.president}{conf.presidentAffiliation && `（${conf.presidentAffiliation}）`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── カレンダーグリッド ──
function CalendarGrid({ conferences }: { conferences: Conference[] }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    // 最も近い未来の学会の月、なければ4月
    const now = new Date()
    const upcoming = conferences.find(c => new Date(c.startDate + 'T00:00:00') >= now)
    if (upcoming) {
      const d = new Date(upcoming.startDate + 'T00:00:00')
      return new Date(d.getFullYear(), d.getMonth(), 1)
    }
    return new Date(2026, 3, 1)
  })

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // この月の学会
  const monthConfs = useMemo(() => {
    return conferences.filter(c => {
      const start = new Date(c.startDate + 'T00:00:00')
      const end = new Date(c.endDate + 'T00:00:00')
      return (start.getMonth() === month && start.getFullYear() === year) ||
             (end.getMonth() === month && end.getFullYear() === year)
    })
  }, [conferences, year, month])

  // カレンダーグリッド生成
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const weeks: (number | null)[][] = []
  let week: (number | null)[] = Array(firstDay).fill(null)

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  // 日付→学会マッピング
  const dayConfs = useMemo(() => {
    const map = new Map<number, Conference[]>()
    for (const c of monthConfs) {
      const start = new Date(c.startDate + 'T00:00:00')
      const end = new Date(c.endDate + 'T00:00:00')
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getMonth() === month && d.getFullYear() === year) {
          const day = d.getDate()
          if (!map.has(day)) map.set(day, [])
          map.get(day)!.push(c)
        }
      }
    }
    return map
  }, [monthConfs, year, month])

  const [selectedConf, setSelectedConf] = useState<Conference | null>(null)

  const prev = () => setCurrentMonth(new Date(year, month - 1, 1))
  const next = () => setCurrentMonth(new Date(year, month + 1, 1))

  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div>
      {/* 月ナビ */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-2 rounded-lg hover:bg-s1 text-muted hover:text-tx transition-colors">◀</button>
        <h3 className="text-sm font-bold text-tx">{year}年{month + 1}月</h3>
        <button onClick={next} className="p-2 rounded-lg hover:bg-s1 text-muted hover:text-tx transition-colors">▶</button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(w => (
          <div key={w} className="text-center text-[10px] font-bold text-muted py-1">{w}</div>
        ))}
      </div>

      {/* グリッド */}
      <div className="border border-br rounded-xl overflow-hidden">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-br last:border-b-0">
            {week.map((day, di) => {
              const confs = day ? (dayConfs.get(day) || []) : []
              return (
                <div
                  key={di}
                  className="min-h-[52px] p-0.5 border-r border-br last:border-r-0"
                  style={{ background: day ? 'var(--s0)' : 'var(--bg)' }}
                >
                  {day && (
                    <>
                      <p className="text-[10px] text-muted text-center">{day}</p>
                      {confs.slice(0, 2).map(c => {
                        const cat = getSpecialtyCategory(c.specialtyArea)
                        const color = SPECIALTY_COLORS[cat]
                        return (
                          <button
                            key={c.id}
                            onClick={() => setSelectedConf(c)}
                            className="w-full text-[8px] font-bold truncate rounded px-0.5 py-px mt-0.5 text-white leading-tight"
                            style={{ background: color }}
                            title={c.meetingName}
                          >
                            {c.societyShort}
                          </button>
                        )
                      })}
                      {confs.length > 2 && (
                        <p className="text-[8px] text-muted text-center">+{confs.length - 2}</p>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* この月の学会リスト */}
      {monthConfs.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold text-muted">{month + 1}月の学会（{monthConfs.length}件）</p>
          {monthConfs.map(c => (
            <ConferenceCard key={c.id} conf={c} />
          ))}
        </div>
      )}

      {monthConfs.length === 0 && (
        <div className="mt-4 text-center py-4">
          <p className="text-sm text-muted">この月に学会はありません</p>
        </div>
      )}

      {/* 学会詳細ポップアップ */}
      {selectedConf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedConf(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-bg border border-br rounded-2xl shadow-xl max-w-sm w-full p-5"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedConf(null)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-tx hover:bg-s1"
            >
              ✕
            </button>
            <p className="text-xs font-bold mb-1" style={{ color: SPECIALTY_COLORS[getSpecialtyCategory(selectedConf.specialtyArea)] }}>
              {formatDateRange(selectedConf.startDate, selectedConf.endDate)}
            </p>
            <h3 className="text-sm font-bold text-tx mb-2">{selectedConf.meetingName}</h3>
            <p className="text-xs text-muted mb-1">📍 {selectedConf.venue}（{selectedConf.city}）</p>
            {selectedConf.theme && <p className="text-xs text-muted italic mb-1">「{selectedConf.theme}」</p>}
            {selectedConf.president && (
              <p className="text-xs text-muted">会長: {selectedConf.president}{selectedConf.presidentAffiliation && `（${selectedConf.presidentAffiliation}）`}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
