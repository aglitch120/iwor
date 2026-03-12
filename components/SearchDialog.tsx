'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface SearchResult {
  slug: string
  title: string
  description: string
  categoryName: string
  tags: string[]
  readingTime: number
}

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 開閉
  const open = useCallback(() => {
    setIsOpen(true)
    setQuery('')
    setResults([])
    setSelectedIndex(0)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setResults([])
  }, [])

  // Cmd+K / Ctrl+K ショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) {
          close()
        } else {
          open()
        }
      }
      if (e.key === 'Escape' && isOpen) {
        close()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, open, close])

  // モーダル開いたらinputにフォーカス
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // bodyスクロール制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // 検索実行（デバウンス付き）
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        setResults(data.results || [])
        setSelectedIndex(0)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 200)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  // キーボードナビゲーション
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      close()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={open}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-ac hover:bg-s1 transition-colors"
        aria-label="サイト内検索"
        title="検索（⌘K）"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
    )
  }

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-tx/40 z-[60] backdrop-blur-sm"
        onClick={close}
      />

      {/* モーダル */}
      <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] px-4">
        <div
          className="w-full max-w-lg bg-s0 rounded-xl shadow-2xl border border-br overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 検索入力 */}
          <div className="flex items-center gap-3 px-4 border-b border-br">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted flex-shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="記事を検索..."
              className="flex-1 py-3.5 bg-transparent text-tx text-sm outline-none placeholder:text-muted/60"
            />
            <button
              onClick={close}
              className="text-xs text-muted bg-s1 px-1.5 py-0.5 rounded border border-br font-mono"
            >
              ESC
            </button>
          </div>

          {/* 結果 */}
          <div className="max-h-[50vh] overflow-y-auto">
            {isLoading && query.trim() && (
              <div className="px-4 py-8 text-center text-sm text-muted">
                検索中...
              </div>
            )}

            {!isLoading && query.trim() && results.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted">
                「{query}」に一致する記事が見つかりませんでした
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <ul className="py-2">
                {results.map((result, index) => (
                  <li key={result.slug}>
                    <Link
                      href={`/blog/${result.slug}`}
                      onClick={close}
                      className={`block px-4 py-3 transition-colors ${
                        index === selectedIndex
                          ? 'bg-acl'
                          : 'hover:bg-s1'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted bg-s1 px-2 py-0.5 rounded">
                          {result.categoryName}
                        </span>
                        <span className="text-xs text-muted">
                          {result.readingTime}分
                        </span>
                      </div>
                      <p className="text-sm font-medium text-tx leading-snug">
                        {result.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">
                        {result.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!query.trim() && (
              <div className="px-4 py-8 text-center text-sm text-muted">
                キーワードを入力して記事を検索
              </div>
            )}
          </div>

          {/* フッターヒント */}
          <div className="px-4 py-2.5 border-t border-br bg-s1/50 flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <kbd className="bg-s0 border border-br px-1 py-0.5 rounded font-mono text-[10px]">↑</kbd>
              <kbd className="bg-s0 border border-br px-1 py-0.5 rounded font-mono text-[10px]">↓</kbd>
              移動
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-s0 border border-br px-1 py-0.5 rounded font-mono text-[10px]">Enter</kbd>
              開く
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
