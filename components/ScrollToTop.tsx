'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** ルート遷移時にスクロール位置をトップにリセット */
export default function ScrollToTop() {
  const pathname = usePathname()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
