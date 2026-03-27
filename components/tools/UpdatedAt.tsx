'use client'

import { useState, useEffect } from 'react'

/** 最終確認日の表示コンポーネント — verify-status.jsonから動的取得 */
export default function UpdatedAt({ date }: { date?: string }) {
  const [verified, setVerified] = useState(date || '')

  useEffect(() => {
    fetch('/verify-status.json')
      .then(r => r.json())
      .then(d => {
        if (d.lastVerified) {
          const dt = new Date(d.lastVerified)
          const pad = (n: number) => String(n).padStart(2, '0')
          setVerified(`${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日 ${pad(dt.getHours())}:${pad(dt.getMinutes())}`)
        }
      })
      .catch(() => {})
  }, [])

  if (!verified) return null
  return <p className="text-xs text-muted/60 mt-1">最終検証: {verified}</p>
}
