'use client'

import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { NumberInput, RadioGroup, SelectInput } from '@/components/tools/InputFields'
import { getToolBySlug, implementedTools, categoryLabels, categoryIcons } from '@/lib/tools-config'

const toolDef = getToolBySlug('harris-benedict')!

// 活動係数(AF) — 画像準拠
const activityFactors = [
  { value: '1.0', label: 'なし（×1.0）', factor: 1.0 },
  { value: '1.2', label: 'ベッド上安静（×1.2）', factor: 1.2 },
  { value: '1.3', label: 'ベッド外活動（×1.3）', factor: 1.3 },
]

// ストレス係数(SF) — 画像準拠
const stressFactors = [
  { value: '1.0', label: '手術後（合併症なし）（×1.0）', factor: 1.0 },
  { value: '1.1', label: '腹膜炎・敗血症（×1.1〜1.3）', factor: 1.2 },
  { value: '1.15', label: '長管骨骨折（×1.15〜1.3）', factor: 1.2 },
  { value: '1.1c', label: '癌（×1.1〜1.3）', factor: 1.2 },
  { value: '1.3', label: '重症感染症・多発障害（×1.2〜1.4）', factor: 1.3 },
  { value: '1.6', label: '多臓器不全（×1.2〜2.0）', factor: 1.6 },
  { value: '1.6b', label: '熱傷（×1.2〜2.0）', factor: 1.6 },
]

export default function HarrisBenedictPage() {
  const [sex, setSex] = useState('male')
  const [age, setAge] = useState('55')
  const [height, setHeight] = useState('170')
  const [weight, setWeight] = useState('65')
  const [af, setAf] = useState('1.2')
  const [sf, setSf] = useState('1.0')
  const [weightType, setWeightType] = useState<'actual' | 'ibw'>('actual')

  const result = useMemo(() => {
    const a = parseFloat(age); const h = parseFloat(height); const w = parseFloat(weight)
    if (!a || !h || !w) return null
    const ibw = 22 * (h / 100) ** 2
    const useW = weightType === 'ibw' ? ibw : w
    const bee = sex === 'male'
      ? 66.47 + 13.75 * useW + 5.0 * h - 6.76 * a
      : 655.1 + 9.56 * useW + 1.85 * h - 4.68 * a
    const afVal = activityFactors.find(s => s.value === af)?.factor || 1.2
    const sfVal = stressFactors.find(s => s.value === sf)?.factor || 1.0
    const tee = bee * afVal * sfVal
    return { bee: Math.round(bee), tee: Math.round(tee), afVal, sfVal, ibw: Math.round(ibw * 10) / 10, usedWeight: Math.round(useW * 10) / 10 }
  }, [sex, age, height, weight, af, sf, weightType])

  return (
    <CalculatorLayout slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={result && (<ResultCard label="TEE（総エネルギー消費量）" value={result.tee} unit="kcal/日"
        interpretation={`BEE ${result.bee} × AF ${result.afVal} × SF ${result.sfVal}`} severity="neutral"
        details={[
          { label: 'BEE（基礎エネルギー消費量）', value: `${result.bee} kcal/日` },
          { label: '使用体重', value: `${result.usedWeight} kg（${weightType === 'ibw' ? 'IBW' : '実測'}）` },
          ...(weightType === 'ibw' ? [{ label: 'IBW（理想体重）', value: `${result.ibw} kg（BMI 22）` }] : []),
        ]} />)}
      explanation={<div className="text-sm text-muted"><p>TEE = BEE × 活動係数(AF) × ストレス係数(SF)。AF・SFのエビデンスレベルは高くないため、目安として使用。</p></div>}
      relatedTools={toolDef.relatedSlugs.map(s => { const t = implementedTools.has(s) ? getToolBySlug(s) : null; return t ? { slug: t.slug, name: t.name } : null }).filter(Boolean) as { slug: string; name: string }[]}
      references={[{ text: 'Harris JA, Benedict FG. A Biometric Study of Human Basal Metabolism. Proc Natl Acad Sci 1918;4:370-373' }]}
    >
      <div className="space-y-4">
        <RadioGroup label="性別" name="sex" value={sex} onChange={setSex} options={[{ value: 'male', label: '男性' }, { value: 'female', label: '女性' }]} />
        <NumberInput id="age" label="年齢" unit="歳" value={age} onChange={setAge} />
        <NumberInput id="height" label="身長" unit="cm" value={height} onChange={setHeight} />
        <NumberInput id="weight" label="体重（実測）" unit="kg" value={weight} onChange={setWeight} />
        <RadioGroup label="計算に使用する体重" name="weightType" value={weightType} onChange={(v) => setWeightType(v as 'actual' | 'ibw')}
          options={[{ value: 'actual', label: '実測体重' }, { value: 'ibw', label: 'IBW（理想体重 BMI 22）' }]} />
        <p className="text-[10px] text-muted">※肥満患者ではIBWの使用を検討</p>
        <SelectInput id="af" label="活動係数（AF）" value={af} onChange={setAf}
          options={activityFactors.map(s => ({ value: s.value, label: s.label }))} />
        <SelectInput id="sf" label="ストレス係数（SF）" value={sf} onChange={setSf}
          options={stressFactors.map(s => ({ value: s.value, label: s.label }))} />
      </div>
    </CalculatorLayout>
  )
}
