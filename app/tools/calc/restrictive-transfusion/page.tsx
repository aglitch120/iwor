'use client'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('restrictive-transfusion')!
export default function Page() {
  return (
    <CalculatorLayout slug={toolDef.slug} title="制限的赤血球輸血の推奨Hb濃度（提供終了）" titleEn="Restrictive Transfusion (Discontinued)"
      description="本ツールの提供は終了しました。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={null}
      explanation={<div className="bg-dnl border border-dnb rounded-xl p-4">
        <p className="font-bold text-dn text-sm mb-2">本ツールは提供を終了しました</p>
        <p className="text-xs text-dn">輸血トリガーのエビデンスは頻繁に更新されており、固定的な数値表示は最新のガイドラインと乖離するリスクがあります。輸血の判断は最新のガイドライン・施設プロトコル・個々の患者の病態に基づき担当医が行ってください。</p>
      </div>}
      relatedTools={[{ slug: 'rbc-transfusion-hb', name: 'RCC-LR輸血後Hb予測' }]}
      references={[]}
    ><div /></CalculatorLayout>
  )
}
