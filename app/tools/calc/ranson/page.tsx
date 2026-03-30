'use client'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('ranson')!
export default function Page() {
  return (
    <CalculatorLayout slug={toolDef.slug} title="Ranson基準（提供終了）" titleEn="Ranson Criteria (Discontinued)"
      description="本ツールの提供は終了しました。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={null}
      explanation={<div className="bg-s0 border border-br rounded-xl p-4">
        <p className="text-sm text-muted">Ranson基準は臨床的使用頻度が低下しており、本ツールの提供を終了しました。急性膵炎の重症度評価には日本の厚労省重症度判定基準・造影CT Gradeをご利用ください。</p>
      </div>}
      relatedTools={[{ slug: 'pancreatitis-prognostic', name: '膵炎予後因子' }, { slug: 'pancreatitis-ct', name: '膵炎CT Grade' }]}
      references={[]}
    ><div /></CalculatorLayout>
  )
}
