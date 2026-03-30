'use client'
import { useState } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('extravasation')!

const categories = [
  { risk: '壊死性起因性抗がん剤 (vesicant drug)', color: 'bg-dnl border-dnb', groups: [
    { cat: 'アントラサイクリン系', drugs: 'ダウノルビシン(ダウノマイシン®)、ドキソルビシン(アドリアシン®)、リポソーマルドキソルビシン(ドキシル®)*、エピルビシン(ファルモルビシン®)、イダルビシン(イダマイシン®)、アムルビシン(カルセド®)、ピラルビシン(ピノルビン®/テラルビシン®)、ミトキサントロン(ノバントロン®)*' },
    { cat: 'ビンカアルカロイド系', drugs: 'ビノレルビン(ナベルビン®/ロゼウス®)、ビンブラスチン(エクザール®)、ビンクリスチン(オンコビン®)、ビンデシン(フィルデシン®)' },
    { cat: '抗がん抗生物質', drugs: 'マイトマイシンC(マイトマイシン)、アクチノマイシンD(コスメゲン®)' },
    { cat: 'タキサン系', drugs: 'ドセタキセル(タキソテール®/ワンタキソテール®)*、パクリタキセル(タキソール®/アブラキサン®)*' },
    { cat: 'アルキル化薬', drugs: 'ラニムスチン(サイメリン®)*、ニムスチン(ニドラン®)*、ベンダムスチン(トレアキシン®)*' },
  ], note: '* 「炎症性抗がん剤」とする報告もある', action: '投与中止・残液吸引が基本。施設の血管外漏出プロトコルに従い担当医が判断。' },
  { risk: '炎症性抗がん剤 (irritant drug)', color: 'bg-wnl border-wnb', groups: [
    { cat: 'アントラサイクリン系', drugs: 'アクラルビシン(アクラシノン®)' },
    { cat: '抗がん抗生物質', drugs: 'ブレオマイシン(ブレオ®)**' },
    { cat: 'アルキル化薬', drugs: 'メルファラン(アルケラン®)、ダカルバジン(ダカルバジン)、イホスファミド(イホマイド®)、シクロホスファミド(エンドキサン®)、テモゾロミド(テモダール®)、ブスルファン(ブスルフェクス®/マブリン®)' },
    { cat: 'プラチナ系', drugs: 'オキサリプラチン(エルプラット®)、カルボプラチン(パラプラチン®)、シスプラチン(ランダ®/ブリプラチン®/アイエーコール®)、ネダプラチン(アクプラ®)' },
    { cat: '代謝拮抗薬', drugs: 'ゲムシタビン(ジェムザール®)、フルオロウラシル(5-FU)、フルダラビン(フルダラ®)、メトトレキサート(メソトレキセート®)**、クラドリビン(ロイスタチン®)**' },
    { cat: 'その他', drugs: 'エトポシド(ラステット®/ベプシド®)、イリノテカン(トポテシン®/カンプト®)、ノギテカン(ハイカムチン®)、ブレンツキシマブベドチン(アドセトリス®)、トラスツズマブエムタンシン(カドサイラ®)、ボルテゾミブ(ベルケイド®)' },
  ], note: '** 「非壊死性抗がん剤」とする報告もある', action: '投与中止・残液吸引が基本。多くは自然軽快するが、対応は担当医が判断。' },
  { risk: '非壊死性抗がん剤 (non-vesicant drug)', color: 'bg-s0 border-br', groups: [
    { cat: '抗がん抗生物質', drugs: 'ペプロマイシン(ペプレオ®)' },
    { cat: 'サイトカイン', drugs: 'インターフェロン製剤、インターロイキン製剤' },
    { cat: '代謝拮抗薬', drugs: 'エノシタビン(サンラビン®)、シタラビン(キロサイド®)、アザシチジン(ビダーザ®)、L-アスパラギナーゼ(ロイナーゼ®)' },
    { cat: 'その他', drugs: 'リツキシマブ(リツキサン®)、トラスツズマブ(ハーセプチン®)、パニツムマブ(ベクティビックス®)' },
  ], note: '', action: '投与中止→経過観察。組織障害は稀。' },
]

export default function ExtravasationPage() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? categories : categories.filter((_, i) => (filter === '0' ? i === 0 : filter === '1' ? i === 1 : i === 2))
  return (
    <CalculatorLayout slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={null}
      explanation={<div className="text-sm text-muted"><p>漏出発見時: ①即座に投与中止 ②可能な限り残液を吸引 ③リスク分類に応じた対応（担当医が判断）。写真記録を残す。</p></div>}
      relatedTools={[{ slug: 'ctcae', name: 'CTCAE v6.0' }]}
      references={toolDef.sources || []}
    >
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[{ id: 'all', l: 'すべて' }, { id: '0', l: '🔴 壊死性' }, { id: '1', l: '🟡 炎症性' }, { id: '2', l: '🔵 非壊死性' }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f.id ? 'bg-ac text-white' : 'bg-s0 border border-br text-muted'}`}>{f.l}</button>
        ))}
      </div>
      {filtered.map((cat, i) => (
        <div key={i} className={`mb-4 p-4 rounded-xl border ${cat.color}`}>
          <h3 className="text-sm font-bold text-tx mb-3">{cat.risk}</h3>
          {cat.groups.map((g, j) => (
            <div key={j} className="mb-2">
              <p className="text-xs font-bold text-muted">{g.cat}</p>
              <p className="text-xs text-tx leading-relaxed">{g.drugs}</p>
            </div>
          ))}
          {cat.note && <p className="text-[10px] text-muted mt-2">{cat.note}</p>}
          <div className="mt-3 pt-2 border-t border-br/50">
            <p className="text-xs text-tx"><strong>対応:</strong> {cat.action}</p>
          </div>
        </div>
      ))}
    </CalculatorLayout>
  )
}
