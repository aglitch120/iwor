import type { Metadata } from 'next'
import JoslerApp from './JoslerApp'

export const metadata: Metadata = {
  title: 'J-OSLER管理 — iwor',
  description: '内科専攻医のJ-OSLER症例管理。120症例・56疾患群・29病歴要約の達成状況を一目で把握。病歴要約ジェネレーター搭載。',
  alternates: { canonical: 'https://iwor.jp/josler' },
  openGraph: {
    title: 'J-OSLER管理 — iwor',
    description: '内科専攻医のJ-OSLER症例管理。',
    url: 'https://iwor.jp/josler',
  },
}

export default function JoslerPage() {
  return <JoslerApp initialMode="josler" />
}
