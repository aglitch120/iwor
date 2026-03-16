import type { Metadata } from 'next'
import DashboardApp from './DashboardApp'

export const metadata: Metadata = {
  title: '病棟TODO & 症例ログ — iwor',
  description:
    '入院患者のタスク管理と症例ログ。J-OSLER準拠の領域・疾患群で記録し、退院時に自動アーカイブ。CSV出力でExcel管理にも対応。',
  alternates: { canonical: 'https://iwor.jp/dashboard' },
  openGraph: {
    title: '病棟TODO & 症例ログ — iwor',
    description:
      '入院患者のタスク管理・症例ログ。J-OSLER準拠の領域・疾患群で記録し、CSV出力でExcel管理にも対応。',
    url: 'https://iwor.jp/dashboard',
    siteName: 'iwor',
    type: 'website',
  },
}

export default function DashboardPage() {
  return <DashboardApp />
}
