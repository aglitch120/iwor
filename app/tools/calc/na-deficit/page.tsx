'use client'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('na-deficit')!

export default function NaDeficitPage() {
  return (
    <CalculatorLayout
      slug={toolDef.slug}
      title="Na欠乏量推定（非推奨）"
      titleEn="Na Deficit Estimation (Not Recommended)"
      description="低ナトリウム血症のNa欠乏量計算は、鑑別診断なしに生食投与を促す誤解につながるため削除しました。"
      category={categoryLabels[toolDef.category]}
      categoryIcon={categoryIcons[toolDef.category]}
      result={null}
      explanation={<div className="space-y-3 text-sm text-muted">
        <div className="bg-dnl border border-dnb rounded-xl p-4">
          <p className="font-bold text-dn text-sm mb-2">このツールは削除されました</p>
          <p className="text-xs text-dn">低ナトリウム血症の治療は、まず原因の鑑別が最も重要です。Na欠乏量の計算式（TBW×ΔNa）は、低Na血症の原因を問わず一律に生食を投与すべきという誤解を招くため、本ツールの提供を中止しました。</p>
        </div>
        <div className="bg-s0 border border-br rounded-xl p-4">
          <p className="font-bold text-tx text-sm mb-2">低Na血症で確認すべきこと</p>
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li>体液量評価（脱水・正常・過剰）</li>
            <li>尿浸透圧・尿中Na測定</li>
            <li>SIADH / 甲状腺機能低下 / 副腎不全の除外</li>
            <li>薬剤性（サイアザイド・SSRI等）の確認</li>
            <li>補正速度の管理（ODS予防: 目標6-8, 最大10 mEq/L/24h）</li>
          </ul>
        </div>
      </div>}
      relatedTools={[
        { slug: 'hyponatremia-flow', name: '低Na血症フロー' },
        { slug: 'na-correction-rate', name: 'Na補正速度' },
        { slug: 'siadh', name: 'SIADH診断基準' },
      ]}
      references={[
        { text: 'Sterns RH. Disorders of Plasma Sodium. N Engl J Med 2015;372:55-65' },
        { text: 'Verbalis JG, et al. Am J Med 2013;126:S1-S42' },
      ]}
    >
      <div className="text-center py-4">
        <a href="/tools/calc/hyponatremia-flow" className="inline-block px-4 py-2 bg-ac text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all">低Na血症フローへ →</a>
      </div>
    </CalculatorLayout>
  )
}
