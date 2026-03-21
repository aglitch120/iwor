import type { Metadata } from 'next'
import JoslerApp from '../josler/JoslerApp'

export const metadata: Metadata = {
  title: '研修記録（J-OSLER / EPOC）— iwor',
  description: '内科専攻医のJ-OSLER管理と初期研修医のEPOC管理を統合。症例登録・進捗管理・病歴要約。120症例・56疾患群・29病歴要約の達成状況を一目で把握。',
  alternates: { canonical: 'https://iwor.jp/record' },
  openGraph: {
    title: '研修記録（J-OSLER / EPOC）— iwor',
    description: '内科専攻医のJ-OSLER管理と初期研修医のEPOC管理を統合。',
    url: 'https://iwor.jp/record',
  },
}

export default function RecordPage() {
  return <JoslerApp />
}
