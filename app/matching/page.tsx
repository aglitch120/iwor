import type { Metadata } from 'next'
import MatchingApp from './MatchingApp'

export const metadata: Metadata = {
  title: '医学生マッチング対策 — 病院DB・履歴書・見学メール | iwor',
  description:
    '初期臨床研修マッチング対策。全国50病院の倍率・年収データベース、JIS履歴書自動生成、見学申込メール作成、志望リスト管理。無料で使えるマッチング対策ツール。',
  alternates: { canonical: 'https://iwor.jp/matching' },
  openGraph: {
    title: '医学生マッチング対策 — 病院DB・履歴書・見学メール | iwor',
    description:
      '全国50病院の倍率・年収データベース。JIS履歴書自動生成。見学申込メール作成。',
    url: 'https://iwor.jp/matching',
    siteName: 'iwor',
    type: 'website',
  },
}

export default function MatchingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <MatchingApp />
    </div>
  )
}
