'use client'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('anemia-criteria')!
export default function Page() {
  return (
    <CalculatorLayout slug={toolDef.slug} title="貧血の診断基準（提供終了）" titleEn="Anemia Criteria (Discontinued)"
      description="本ツールの提供は終了しました。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={null}
      explanation={<div className="bg-s0 border border-br rounded-xl p-4">
        <p className="text-sm text-muted">WHOの貧血基準値（男性Hb&lt;13, 女性Hb&lt;12, 妊婦Hb&lt;11 g/dL）は一般的な知識であり、独立したツールとしての提供は終了しました。</p>
      </div>}
      relatedTools={[{ slug: 'iron-deficit', name: '必要鉄量' }, { slug: 'rbc-transfusion-hb', name: 'RCC-LR輸血後Hb' }]}
      references={[]}
    ><div /></CalculatorLayout>
  )
}
