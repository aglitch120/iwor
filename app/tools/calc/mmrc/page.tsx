'use client'
import { useState } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('mmrc')!
const grades = [
  { value: 0, label: '激しい運動時のみ息切れ' },
  { value: 1, label: '平地を急ぎ足 or 緩やかな坂を歩くときに息切れ' },
  { value: 2, label: '息切れのために同年齢の人より平地を歩くのが遅い、or 平地で自分のペースで歩いていても息切れのため立ち止まる' },
  { value: 3, label: '平地を約100m or 数分歩くと息切れのため立ち止まる' },
  { value: 4, label: '息切れがひどくて外出できない or 着替えで息切れ' },
]
export default function MMRCPage() {
  const [val, setVal] = useState(0)
  const sev = val <= 1 ? 'ok' as const : val <= 2 ? 'wn' as const : 'dn' as const
  return (
    <CalculatorLayout slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={<ResultCard label="mMRC" value={`Grade ${val}`} interpretation={val <= 1 ? '軽度の息切れ' : val <= 2 ? '中等度' : val <= 3 ? '高度' : '最重度'} severity={sev} />}
      explanation={undefined}
      relatedTools={[]} references={[{ text: 'Bestall JC et al. Usefulness of the Medical Research Council (MRC) dyspnoea scale. Thorax 1999;54:581-586' }]}
    >
      <fieldset>
        <legend className="block text-sm font-medium text-tx mb-2">息切れの程度</legend>
        <div className="space-y-1.5">
          {grades.map(g => (
            <button key={g.value} onClick={() => setVal(g.value)}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${val === g.value ? 'border-ac bg-ac/10 text-ac font-semibold' : 'border-br bg-s0 text-tx hover:border-ac/30'}`}>
              <span className="font-bold mr-1.5">Grade {g.value}:</span>{g.label}
            </button>
          ))}
        </div>
      </fieldset>
    </CalculatorLayout>
  )
}
