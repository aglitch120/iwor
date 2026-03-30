'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { CheckItem } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('i-road')!

// I-ROAD 5項目
const iroadItems = [
  { id: 'i', label: 'I: 免疫不全（Immunodeficiency）— 悪性腫瘍または免疫不全状態' },
  { id: 'r', label: 'R: 呼吸不全（Respiration）— SpO₂>90%維持にFiO₂>35%を要する' },
  { id: 'o', label: 'O: 意識障害（Orientation）— 意識レベルの低下' },
  { id: 'a', label: 'A: 年齢（Age）— 男性≧70歳 / 女性≧75歳' },
  { id: 'd', label: 'D: 脱水（Dehydration）— 乏尿または脱水' },
]

export default function IROADPage() {
  const [checks, setChecks] = useState<Record<string, boolean>>(Object.fromEntries(iroadItems.map(i => [i.id, false])))
  const [crp20, setCrp20] = useState(false)
  const [cxr23, setCxr23] = useState(false)

  const result = useMemo(() => {
    const count = iroadItems.filter(i => checks[i.id]).length

    // 3項目以上 → 重症群（グループC）
    if (count >= 3) return { severity: 'dn' as const, label: '重症群（グループC）— I-ROAD 3項目以上', count }

    // 0-2項目 → CRP・胸部X線で軽症/中等症を判定
    if (count <= 2) {
      const hasBoth = crp20 && cxr23
      const hasEither = crp20 || cxr23
      if (hasBoth) return { severity: 'wn' as const, label: '中等症群（グループB）— I-ROAD 0-2項目 + CRP≧20かつ胸部X線陰影≧一側肺2/3', count }
      if (!hasEither) return { severity: 'ok' as const, label: '軽症群（グループA）— I-ROAD 0-2項目、CRP<20かつ胸部X線陰影<一側肺2/3', count }
      // 片方のみ該当
      return { severity: 'ok' as const, label: '軽症群（グループA）— I-ROAD 0-2項目（CRP・胸部X線の両基準を満たさない）', count }
    }

    return { severity: 'ok' as const, label: '軽症群', count }
  }, [checks, crp20, cxr23])

  return (
    <CalculatorLayout slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={<ResultCard label="I-ROAD" value={`${result.count}/5項目`} interpretation={result.label} severity={result.severity} />}
      explanation={<div className="text-sm text-muted space-y-1">
        <p>院内肺炎の重症度分類。I-ROAD 5項目のうち3項目以上で重症群。0-2項目の場合はCRP≧20mg/dL かつ 胸部X線陰影≧一側肺2/3の両方を満たせば中等症群。</p>
        <p className="text-xs">成人肺炎診療GL 2024で「弱く推奨」。CURB-65・PSIと同程度の予測能。</p>
      </div>}
      relatedTools={[{ slug: 'a-drop', name: 'A-DROP' }, { slug: 'curb-65', name: 'CURB-65' }, { slug: 'psi-port', name: 'PSI/PORT' }]}
      references={[
        { text: 'Respirology. 2009 Nov;14 Suppl 2:S4-9' },
        { text: '日本呼吸器学会. 成人肺炎診療ガイドライン 2024' },
      ]}
    >
      <div className="space-y-4">
        <p className="text-xs font-bold text-tx">I-ROAD 5項目</p>
        <div className="space-y-1">
          {iroadItems.map(i => <CheckItem key={i.id} id={i.id} label={i.label} checked={checks[i.id]} onChange={v => setChecks(p => ({ ...p, [i.id]: v }))} />)}
        </div>

        {iroadItems.filter(i => checks[i.id]).length <= 2 && (
          <div className="mt-4 p-3 bg-s0 border border-br rounded-xl">
            <p className="text-xs font-bold text-tx mb-2">追加評価（I-ROAD 0-2項目の場合）</p>
            <p className="text-[10px] text-muted mb-2">両方を満たす場合→中等症群、それ以外→軽症群</p>
            <div className="space-y-1">
              <CheckItem id="crp20" label="CRP ≧ 20 mg/dL" checked={crp20} onChange={setCrp20} />
              <CheckItem id="cxr23" label="胸部X線陰影の拡がりが一側肺の2/3以上" checked={cxr23} onChange={setCxr23} />
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  )
}
