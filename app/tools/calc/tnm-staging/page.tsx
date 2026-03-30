'use client'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('tnm-staging')!
export default function Page() {
  return (
    <CalculatorLayout slug={toolDef.slug} title="TNM分類（提供終了）" titleEn="TNM Staging (Discontinued)"
      description="本ツールの提供は終了しました。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={null}
      explanation={<div className="bg-dnl border border-dnb rounded-xl p-4">
        <p className="font-bold text-dn text-sm mb-2">本ツールは提供を終了しました</p>
        <p className="text-xs text-dn">TNM分類は癌種ごとに改訂頻度が異なり、固定的な表示は最新版との乖離リスクが高く危険です。正式なステージングは担当科専門医・カンファレンスで、UICC/AJCC最新版を参照の上で確定してください。</p>
      </div>}
      relatedTools={[]}
      references={[]}
    ><div /></CalculatorLayout>
  )
}
