'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { tools, implementedTools, categoryLabels, categoryIcons, type ToolCategory, type ToolDefinition } from '@/lib/tools-config'
import FavoriteButton, { FavoritesBar } from '@/components/tools/FavoriteButton'
import { normalize, expandQuery, TOOL_READINGS } from '@/components/SearchDialog'

const categoryOrder: ToolCategory[] = [
  'nephrology', 'cardiology', 'hepatology', 'respiratory',
  'infectious', 'electrolyte', 'neurology', 'hematology',
  'antimicrobial', 'general',
]

const liveTools = tools.filter(t => implementedTools.has(t.slug))

export default function ToolsList() {
  const [query, setQuery] = useState('')
  const [recentSlugs, setRecentSlugs] = useState<string[]>([])

  // よく使うツール（閲覧履歴から上位5件）
  useEffect(() => {
    try {
      const raw = localStorage.getItem('iwor_tool_history')
      if (raw) {
        const history: Record<string, number> = JSON.parse(raw)
        const sorted = Object.entries(history).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([slug]) => slug)
        setRecentSlugs(sorted)
      }
    } catch {}
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return liveTools
    const queries = expandQuery(query)
    return liveTools.filter(t => {
      const reading = TOOL_READINGS[t.slug] || ''
      const haystack = normalize(`${t.name} ${t.nameEn} ${t.description} ${t.keywords.join(' ')} ${t.slug} ${reading}`)
      return queries.some(q => haystack.includes(q))
    })
  }, [query])

  const grouped = useMemo(() => {
    return filtered.reduce((acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = []
      acc[tool.category].push(tool)
      return acc
    }, {} as Record<ToolCategory, ToolDefinition[]>)
  }, [filtered])

  return (
    <>
      {/* お気に入りバー */}
      <FavoritesBar />

      {/* 検索窓 */}
      <div className="relative mb-8">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ツール名・キーワードで検索（例: eGFR, 心房細動, Na補正）"
          className="w-full pl-10 pr-10 py-2.5 bg-s0 border border-br rounded-xl text-sm text-tx
                     placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-ac/30 focus:border-ac"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-br/50 text-muted hover:text-tx text-xs"
            aria-label="クリア"
          >
            ✕
          </button>
        )}
      </div>

      {/* ツール数+検索結果カウント */}
      <p className="text-xs text-muted mb-4">
        {query ? `${filtered.length}件のツールが見つかりました` : `全${liveTools.length}種の臨床計算ツール`}
      </p>

      {/* よく使うツール（検索していない時のみ） */}
      {!query && recentSlugs.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-tx mb-2 flex items-center gap-1.5">
            <span>⭐</span>あなたがよく使う計算ツール
          </h2>
          <div className="grid gap-1.5">
            {recentSlugs.map(slug => {
              const tool = liveTools.find(t => t.slug === slug)
              if (!tool) return null
              return (
                <Link key={slug} href={`/tools/calc/${slug}`}
                  className="flex items-center justify-between gap-3 p-2.5 bg-acl border border-ac/10 rounded-lg hover:border-ac/30 transition-colors group">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ac">{tool.name}</p>
                  </div>
                  <span className="text-ac text-sm shrink-0">→</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* カテゴリ別リスト */}
      {categoryOrder.map(cat => {
        const catTools = grouped[cat]
        if (!catTools || catTools.length === 0) return null
        return (
          <section key={cat} className="mb-8">
            <h2 className="text-base font-bold text-tx mb-3 flex items-center gap-2">
              <span>{categoryIcons[cat]}</span>
              <span>{categoryLabels[cat]}</span>
              <span className="text-xs font-normal text-muted">({catTools.length})</span>
            </h2>
            <div className="grid gap-2">
              {catTools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/calc/${tool.slug}`}
                    className="flex items-center justify-between gap-3 p-3 bg-s0 border border-ac/10 rounded-lg hover:border-ac/30 hover:bg-acl transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-tx group-hover:text-ac transition-colors">{tool.name}</p>
                      <p className="text-xs text-muted line-clamp-1">{tool.description}</p>
                    </div>
                    <span className="text-ac text-sm shrink-0">→</span>
                  </Link>
              ))}
            </div>
          </section>
        )
      })}

      {/* 検索結果0件 */}
      {query && filtered.length === 0 && (
        <div className="text-center py-12 text-muted">
          <p className="text-sm">「{query}」に一致するツールが見つかりませんでした</p>
          <button
            onClick={() => setQuery('')}
            className="text-ac text-sm mt-2 hover:underline"
          >
            検索をクリア
          </button>
        </div>
      )}
    </>
  )
}
