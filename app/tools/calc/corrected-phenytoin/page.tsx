'use client'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('corrected-phenytoin')!
export default function Page() {
  return (
    <CalculatorLayout slug={toolDef.slug} title="補正フェニトイン濃度（提供終了）" titleEn="Corrected Phenytoin (Discontinued)"
      description="本ツールの提供は終了しました。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={null}
      explanation={<div className="bg-s0 border border-br rounded-xl p-4">
        <p className="text-sm text-muted">Sheiner-Tozer式による補正フェニトイン濃度の計算は臨床的使用頻度が低いため、本ツールの提供を終了しました。フェニトインのTDMが必要な場合は薬剤部にご相談ください。</p>
      </div>}
      relatedTools={[]}
      references={[]}
    ><div /></CalculatorLayout>
  )
}
