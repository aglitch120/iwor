'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // 記事本文内のh2, h3を収集
    const article = document.querySelector('.prose')
    if (!article) return

    const elements = article.querySelectorAll('h2, h3')
    const items: TocItem[] = []

    elements.forEach((el, index) => {
      // IDがなければ付与
      if (!el.id) {
        el.id = `heading-${index}`
      }
      items.push({
        id: el.id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      })
    })

    setHeadings(items)
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 画面上部に最も近い見出しをactiveにする
        const visibleEntries = entries.filter((e) => e.isIntersecting)
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav className="hidden lg:block sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
        目次
      </p>
      <ul className="space-y-1 border-l-2 border-br">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(heading.id)
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  // URLにハッシュを追加
                  history.pushState(null, '', `#${heading.id}`)
                }
              }}
              className={`block text-sm py-1 transition-colors ${
                heading.level === 3 ? 'pl-6' : 'pl-3'
              } ${
                activeId === heading.id
                  ? 'text-ac font-medium border-l-2 border-ac -ml-[2px]'
                  : 'text-muted hover:text-tx'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
