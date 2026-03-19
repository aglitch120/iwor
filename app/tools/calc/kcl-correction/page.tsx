'use client'

import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { NumberInput, RadioGroup } from '@/components/tools/InputFields'
import { getToolBySlug, implementedTools, categoryLabels, categoryIcons } from '@/lib/tools-config'

const toolDef = getToolBySlug('kcl-correction')!

export default function KclCorrectionPage() {
  const [kLevel, setKLevel] = useState('3.0')
  const [weight, setWeight] = useState('60')
  const [route, setRoute] = useState('peripheral')
  const [symptoms, setSymptoms] = useState('none')

  const result = useMemo(() => {
    const k = parseFloat(kLevel) || 3.5
    const w = parseFloat(weight) || 60

    // K欠乏量の概算（血清K 1 mEq/L低下 ≈ 体内K 200-400 mEq不足）
    const deficit = k < 3.5 ? Math.round((3.5 - k) * 300) : 0

    // 投与量の目安
    let dosePerHour = 0
    let maxConcentration = ''
    let safetyNote = ''

    if (route === 'peripheral') {
      dosePerHour = 20 // mEq/h（末梢は最大20 mEq/h）
      maxConcentration = '40 mEq/L以下'
      safetyNote = '末梢静脈: 20 mEq/hを超えない'
    } else {
      dosePerHour = 40 // mEq/h（中心は最大40 mEq/h、モニター下）
      maxConcentration = '200 mEq/L以下'
      safetyNote = '中心静脈: 40 mEq/hを超えない（心電図モニター必須）'
    }

    // 症状による緊急度
    const isUrgent = symptoms === 'severe' || k < 2.5

    let severity: 'ok' | 'wn' | 'dn' = 'ok'
    let label = ''
    let recommendation = ''

    if (k >= 3.5) {
      severity = 'ok'
      label = '正常範囲 — KCl補正不要'
      recommendation = '経過観察'
    } else if (k >= 3.0) {
      severity = 'wn'
      label = '軽度低K血症'
      recommendation = '経口KCl 20-40 mEq/日を検討（内服可能なら）'
    } else if (k >= 2.5) {
      severity = 'wn'
      label = '中等度低K血症'
      recommendation = `KCl ${dosePerHour} mEq/hで点滴静注、2-4時間ごとに再検`
    } else {
      severity = 'dn'
      label = '重度低K血症 — 緊急補正が必要'
      recommendation = `KCl ${dosePerHour} mEq/hで点滴静注（心電図モニター必須）、1-2時間ごとに再検`
    }

    return {
      deficit,
      dosePerHour,
      maxConcentration,
      safetyNote,
      severity,
      label,
      recommendation,
      isUrgent,
    }
  }, [kLevel, weight, route, symptoms])

  return (
    <CalculatorLayout
      slug={toolDef.slug}
      title={toolDef.name}
      titleEn={toolDef.nameEn}
      description={toolDef.description}
      category={categoryLabels[toolDef.category]}
      categoryIcon={categoryIcons[toolDef.category]}
      result={
        <ResultCard
          label="K欠乏量（概算）"
          value={result.deficit}
          unit="mEq"
          interpretation={result.label}
          severity={result.severity}
          details={[
            { label: '参考', value: result.recommendation },
            { label: '最大投与速度', value: `${result.dosePerHour} mEq/h` },
            { label: '最大濃度', value: result.maxConcentration },
            { label: '安全上の注意', value: result.safetyNote },
          ]}
        />
      }
      explanation={
        <section className="space-y-4 text-sm text-muted">
          <h2 className="text-base font-bold text-tx">KCl補正の基本</h2>
          <p>低カリウム血症は不整脈・筋力低下・イレウスの原因となります。血清Kが1 mEq/L低下するごとに体内K総量は約200〜400 mEq不足していると推定されます。</p>
          <h3 className="font-bold text-tx">投与ルール</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>末梢静脈: 最大20 mEq/h、濃度40 mEq/L以下</li>
            <li>中心静脈: 最大40 mEq/h、濃度200 mEq/L以下（心電図モニター必須）</li>
            <li>経口可能なら内服KCl（20〜40 mEq/回）を優先</li>
            <li>Mg欠乏の合併が多い — 低Mg血症があればMgも補正</li>
          </ul>
          <h3 className="font-bold text-tx">モニタリング</h3>
          <p>K &lt; 3.0 mEq/Lでは2〜4時間ごと、K &lt; 2.5 mEq/Lでは1〜2時間ごとに再検。心電図モニターでT波平坦化・U波・QT延長を観察。</p>
        </section>
      }
      relatedTools={toolDef.relatedSlugs
        .map(s => {
          const t = implementedTools.has(s) ? getToolBySlug(s) : null
          return t ? { slug: t.slug, name: t.name } : null
        })
        .filter(Boolean) as { slug: string; name: string }[]}
      references={[
        { text: 'Crop MJ, et al. Kidney Int 2011;80:268-278' },
        { text: 'Gennari FJ. N Engl J Med 1998;339:451-458' },
      ]}
    >
      <div className="space-y-4">
        <NumberInput id="k-level" label="血清K" unit="mEq/L" value={kLevel} onChange={setKLevel} step={0.1} />
        <NumberInput id="weight" label="体重" unit="kg" value={weight} onChange={setWeight} step={1} />
        <RadioGroup
          label="投与経路"
          name="route"
          value={route}
          onChange={setRoute}
          options={[
            { value: 'peripheral', label: '末梢' },
            { value: 'central', label: '中心' },
          ]}
        />
        <RadioGroup
          label="症状"
          name="symptoms"
          value={symptoms}
          onChange={setSymptoms}
          options={[
            { value: 'none', label: 'なし' },
            { value: 'mild', label: '軽度' },
            { value: 'severe', label: '重度' },
          ]}
        />
        <p className="text-xs text-muted">重度: 不整脈、筋力低下、呼吸筋麻痺</p>
      </div>
    </CalculatorLayout>
  )
}
