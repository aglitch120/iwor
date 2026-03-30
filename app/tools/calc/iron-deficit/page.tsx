'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { NumberInput } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('iron-deficit')!

export default function Page() {
  const [weight, setWeight] = useState('60')
  const [hb, setHb] = useState('')

  const result = useMemo(() => {
    const w = parseFloat(weight), h = parseFloat(hb)
    if (!w || !h || w <= 0 || h <= 0 || h >= 16) return null
    // 中尾の式: 必要鉄量 = {2.72 × (16 - Hb) + 17} × 体重
    const deficit = (2.72 * (16 - h) + 17) * w
    return { deficit: Math.max(0, deficit) }
  }, [weight, hb])

  return (
    <CalculatorLayout slug={toolDef.slug} title="必要鉄量（中尾の式）" titleEn="Iron Deficit (Nakao Formula)"
      description="鉄欠乏性貧血における必要鉄量の推算。中尾氏らの報告に基づく計算式。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={result && (
        <ResultCard label="必要鉄量" value={`${result.deficit.toFixed(0)} mg`} interpretation="中尾の式による推算値（参考値。原因・病態により異なるため担当医が判断）" severity="ok"
          details={[
            { label: '計算式', value: '{2.72 × (16 - Hb) + 17} × 体重(kg)' },
          ]} />
      )}
      explanation={<div className="text-sm text-muted"><p>原因によっても必要量は異なるため、あくまで参考値として個々の患者の病態に応じて判断すること。</p></div>}
      relatedTools={[{ slug: 'anemia-criteria', name: '貧血基準値' }]}
      references={[
        { text: '中尾喜久ほか. 鉄欠乏性貧血の治療,とくに非経口鉄剤の応用について. 日本臨床 1956;14:843-852' },
      ]}
    >
      <NumberInput id="f1" label="体重 (kg)" value={weight} onChange={setWeight} min={1} />
      <NumberInput id="f2" label="Hb (g/dL)" value={hb} onChange={setHb} min={0} max={16} step={0.1} />
    </CalculatorLayout>
  )
}
