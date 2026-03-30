'use client'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('sjs-ten-dihs')!
export default function Page() {
  return (
    <CalculatorLayout slug={toolDef.slug} title="薬疹診断基準 SJS/TEN/DIHS（提供終了）" titleEn="SJS/TEN/DIHS (Discontinued)"
      description="本ツールの提供は終了しました。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={null}
      explanation={<div className="bg-s0 border border-br rounded-xl p-4">
        <p className="text-sm text-muted">薬疹の診断基準は専門性が高く、最新のガイドラインを参照した上で皮膚科専門医が判断すべき領域です。本ツールの提供を終了しました。</p>
      </div>}
      relatedTools={[{ slug: 'naranjo', name: 'Naranjo' }]}
      references={[]}
    ><div /></CalculatorLayout>
  )
}
