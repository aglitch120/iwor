'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { NumberInput } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('gnri')!

export default function GNRIPage() {
  const [alb, setAlb] = useState('3.5')
  const [weight, setWeight] = useState('50')
  const [height, setHeight] = useState('160')

  const result = useMemo(() => {
    const a = parseFloat(alb), w = parseFloat(weight), h = parseFloat(height)
    if (!a || !w || !h || h <= 0) return null
    const iw = 22 * (h / 100) ** 2
    const wRatio = Math.min(w / iw, 1)
    const gnri = 14.89 * a + 41.7 * wRatio
    const sev = gnri >= 98 ? 'ok' as const : gnri >= 92 ? 'wn' as const : gnri >= 82 ? 'wn' as const : 'dn' as const
    const label = gnri >= 98 ? 'リスクなし（≧98）' : gnri >= 92 ? '軽度リスク（92-98）' : gnri >= 82 ? '中等度リスク（82-92）' : '重度リスク（<82）'
    return { gnri: gnri.toFixed(1), severity: sev, label, iw: iw.toFixed(1), wRatio: (wRatio * 100).toFixed(0) }
  }, [alb, weight, height])

  return (
    <CalculatorLayout slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={result && <ResultCard label="GNRI" value={result.gnri} interpretation={result.label} severity={result.severity}
        details={[
          { label: '理想体重（IBW, BMI 22）', value: `${result.iw} kg` },
          { label: '現体重/理想体重', value: `${result.wRatio}%（上限100%でキャップ）` },
        ]} />}
      explanation={<div className="text-sm text-muted"><p>GNRI = 14.89×Alb + 41.7×(現体重/理想体重)。現体重が理想体重を超える場合は比を1.0でキャップ。</p></div>}
      relatedTools={[{ slug: 'conut', name: 'CONUT' }, { slug: 'pni', name: 'PNI' }]}
      references={[{ text: 'Bouillanne O, et al. Geriatric Nutritional Risk Index. Am J Clin Nutr 2005;82:777-783' }]}
    >
      <div className="space-y-3">
        <NumberInput id="alb" label="アルブミン" value={alb} onChange={setAlb} unit="g/dL" step={0.1} />
        <NumberInput id="weight" label="現在の体重" value={weight} onChange={setWeight} unit="kg" step={0.1} />
        <NumberInput id="height" label="身長" value={height} onChange={setHeight} unit="cm" step={0.1} />
      </div>
    </CalculatorLayout>
  )
}
