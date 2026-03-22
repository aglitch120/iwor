import type { Metadata } from 'next'
import JoslerApp from '../josler/JoslerApp'

export const metadata: Metadata = {
  title: 'EPOC管理 — iwor',
  description: '初期研修医のEPOC管理。必須症候・疾患・手技の達成状況を一目で把握。効率的な研修記録管理を支援。',
  alternates: { canonical: 'https://iwor.jp/epoc' },
  openGraph: {
    title: 'EPOC管理 — iwor',
    description: '初期研修医のEPOC管理。',
    url: 'https://iwor.jp/epoc',
  },
}

export default function EpocPage() {
  return <JoslerApp initialMode="epoc" />
}
