'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { CheckItem } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('legionella-score')!

// 宮下ら 2019: レジオネラ肺炎予測スコア（6項目、各1点、合計0-6点）
const items = [
  { id: 'male', label: '男性', points: 1 },
  { id: 'noCough', label: '咳嗽なし', points: 1 },
  { id: 'dyspnea', label: '呼吸困難感あり', points: 1 },
  { id: 'crp', label: 'CRP ≧ 18 mg/dL', points: 1 },
  { id: 'na', label: 'Na < 134 mmol/L', points: 1 },
  { id: 'ldh', label: 'LDH ≧ 260 U/L', points: 1 },
]

export default function LegionellaScorePage() {
  const [checks, setChecks] = useState<Record<string, boolean>>(Object.fromEntries(items.map(i => [i.id, false])))
  const result = useMemo(() => {
    const total = items.filter(i => checks[i.id]).reduce((s, i) => s + i.points, 0)
    if (total >= 3) return { total, severity: 'dn' as const, label: `${total}点（≧3）: レジオネラ肺炎を疑う` }
    return { total, severity: 'ok' as const, label: `${total}点（<3）: レジオネラ肺炎の可能性は低い` }
  }, [checks])

  return (
    <CalculatorLayout slug={toolDef.slug} title="レジオネラ肺炎予測スコア（宮下ら）" titleEn="Legionella Pneumonia Prediction Score (Miyashita)"
      description="市中肺炎の中からレジオネラ肺炎を予測するスコア。6項目各1点、合計3点以上でレジオネラ肺炎を疑う。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={<ResultCard severity={result.severity} value={`${result.total}/6点`} interpretation={result.label}
        details={[{ label: '感度/特異度（≧3点）', value: '感度93%, 特異度75%, 陽性尤度比3.7, 陰性尤度比0.10' }]} />}
      explanation={<div className="text-sm text-muted space-y-1">
        <p>成人肺炎診療ガイドライン2024でも本スコアによる治療方針決定が記載されている。</p>
        <p className="text-xs text-wn">注意: 症例対照研究のため選択バイアスによる診断能力の過大評価の可能性あり。免疫抑制患者・30日以内の入院・施設入所者・活動性結核・混合感染は原著で除外。日本国内でのみ評価。</p>
      </div>}
      relatedTools={[{ slug: 'curb-65', name: 'CURB-65' }, { slug: 'a-drop', name: 'A-DROP' }, { slug: 'psi-port', name: 'PSI/PORT' }]}
      references={[
        { text: 'Miyashita N, et al. A new clinical scoring system for evaluating the possibility of Legionella pneumonia. J Infect Chemother. 2019 Jun;25(6):407-412' },
        { text: '日本呼吸器学会. 成人肺炎診療ガイドライン 2024' },
      ]}
    >
      <div className="space-y-2">{items.map(i => <CheckItem key={i.id} id={i.id} label={`${i.label} (+${i.points}点)`} checked={checks[i.id]} onChange={v => setChecks(p => ({ ...p, [i.id]: v }))} />)}</div>
    </CalculatorLayout>
  )
}
