'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter } from '@/components/tools/ERDisclaimer'

const FLOWS: Record<string, { title: string; desc: string; items: { label: string; severity: string; actions: string[]; workup: string[]; disposition: string; pitfall?: string }[] }> = {}

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto">
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span>
        <Link href="/tools/er" className="hover:text-ac">ER対応</Link><span className="mx-2">›</span>
        <span>準備中</span>
      </nav>
      <header className="mb-6">
        <span className="inline-block text-sm bg-wnl text-wn px-2.5 py-0.5 rounded-full font-medium mb-2">🔜 準備中</span>
        <h1 className="text-2xl font-bold text-tx mb-1">コンテンツ準備中</h1>
        <p className="text-sm text-muted">このフローは現在作成中です。近日公開予定。</p>
      </header>
      <Link href="/tools/er" className="inline-flex items-center gap-2 text-sm text-ac font-medium hover:underline">
        ← ER対応一覧に戻る
      </Link>
    </div>
  )
}
