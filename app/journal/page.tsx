import type { Metadata } from 'next'
import JournalTeaser from './JournalTeaser'

export const metadata: Metadata = {
  title: '論文フィード — iwor',
  description: '最新の医学論文を日本語で要約。PubMedから主要ジャーナルの論文を自動取得し、AIが日本語で要約。臨床に直結する知見を効率的にキャッチアップ。',
  openGraph: {
    title: '論文フィード — iwor',
    description: '最新の医学論文を日本語で要約。PubMedから主要ジャーナルの論文を自動取得し、AIが日本語で要約。',
    url: 'https://iwor.jp/journal',
  },
}

export default function JournalPage() {
  return <JournalTeaser />
}
