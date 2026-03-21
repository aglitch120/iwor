import type { Metadata } from 'next'
import StudyApp from './StudyApp'

export const metadata: Metadata = {
  title: '医学フラッシュカード — CBT・国試・専門医試験対策 | iwor Study',
  description: 'FSRS搭載の医学フラッシュカードアプリ。Ankiデッキ(.apkg)インポート対応。CBT・国試・専門医試験対策。日本語ネイティブUI。デフォルト3デッキ150枚、自作デッキ無制限。無料。',
  alternates: { canonical: 'https://iwor.jp/study' },
  openGraph: {
    title: '医学フラッシュカード — CBT・国試・専門医試験対策 | iwor Study',
    description: 'FSRS搭載。Ankiデッキ互換。CBT・国試・専門医試験対策。日本語UI。無料。',
    url: 'https://iwor.jp/study',
  },
}

export default function StudyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <StudyApp />
    </div>
  )
}
