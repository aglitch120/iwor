'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { CheckItem } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('ibs-rome')!

const painItem = { id: 'pain', label: '反復する腹痛（最近3ヶ月で週1日以上）※必須' }
const associatedItems = [
  { id: 'defecation', label: '排便に関連する' },
  { id: 'frequency', label: '排便頻度の変化に関連する' },
  { id: 'form', label: '便形状の変化に関連する' },
]
const durationItem = { id: 'duration', label: '症状発現から6ヶ月以上経過している' }

export default function Page() {
  const [checks, setChecks] = useState<Record<string, boolean>>(
    Object.fromEntries([painItem, ...associatedItems, durationItem].map(i => [i.id, false]))
  )
  const result = useMemo(() => {
    const hasPain = checks[painItem.id]
    const assocCount = associatedItems.filter(i => checks[i.id]).length
    const hasDuration = checks[durationItem.id]
    // Rome IV: 腹痛（必須）+ 関連項目2/3以上 + 6ヶ月以上
    const met = hasPain && assocCount >= 2 && hasDuration
    const partial = hasPain && assocCount >= 2 && !hasDuration
    let interpretation = ''
    let severity: 'ok' | 'wn' | 'dn' = 'ok'
    if (met) {
      interpretation = 'Rome IV IBS診断基準を満たす可能性あり'
      severity = 'wn'
    } else if (partial) {
      interpretation = '腹痛+関連症状は満たすが、6ヶ月以上の経過が未確認'
      severity = 'wn'
    } else if (!hasPain && assocCount >= 2) {
      interpretation = '腹痛（必須条件）が満たされていません'
      severity = 'ok'
    } else {
      interpretation = 'IBS診断基準を満たさない'
      severity = 'ok'
    }
    return { met, interpretation, severity, count: (hasPain ? 1 : 0) + assocCount + (hasDuration ? 1 : 0) }
  }, [checks])

  return (
    <CalculatorLayout slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={<ResultCard label="IBS診断基準 (Rome IV)" value={result.count + '/5項目'}
        interpretation={result.interpretation} severity={result.severity}
        details={[
          { label: '必須', value: '腹痛（週1日以上×3ヶ月）' },
          { label: '関連症状', value: '排便関連/頻度変化/形状変化の2つ以上' },
          { label: '経過', value: '症状発現から6ヶ月以上' },
        ]} />}
      references={[{ text: 'Lacy BE, et al. Rome IV criteria. Gastroenterology 2016;150:1393-1407' }]}
    >
      <div className="space-y-2">
        <p className="text-xs font-bold text-ac">必須条件</p>
        <CheckItem id={painItem.id} label={painItem.label} checked={checks[painItem.id]}
          onChange={v => setChecks(p => ({ ...p, [painItem.id]: v }))} />
        <p className="text-xs font-bold text-muted mt-3">関連症状（2つ以上）</p>
        {associatedItems.map(i => (
          <CheckItem key={i.id} id={i.id} label={i.label} checked={checks[i.id]}
            onChange={v => setChecks(p => ({ ...p, [i.id]: v }))} />
        ))}
        <p className="text-xs font-bold text-muted mt-3">経過</p>
        <CheckItem id={durationItem.id} label={durationItem.label} checked={checks[durationItem.id]}
          onChange={v => setChecks(p => ({ ...p, [durationItem.id]: v }))} />
      </div>
    </CalculatorLayout>
  )
}
