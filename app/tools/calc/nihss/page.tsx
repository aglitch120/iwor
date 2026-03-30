'use client'

import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { getToolBySlug, implementedTools, categoryLabels, categoryIcons } from '@/lib/tools-config'

const toolDef = getToolBySlug('nihss')!

interface NihssItem {
  id: string
  name: string
  options: { label: string; points: number }[]
}

const items: NihssItem[] = [
  {
    id: '1a', name: '1a. 意識水準',
    options: [
      { label: '完全覚醒', points: 0 },
      { label: '簡単な刺激で覚醒', points: 1 },
      { label: '繰り返し刺激・強い刺激で覚醒', points: 2 },
      { label: '反射的運動のみ／無反応', points: 3 },
    ],
  },
  {
    id: '1b', name: '1b. 意識障害−質問（月・年齢）',
    options: [
      { label: '両方正答', points: 0 },
      { label: '1つ正答', points: 1 },
      { label: '両方不正答', points: 2 },
    ],
  },
  {
    id: '1c', name: '1c. 意識障害−従命（開閉眼・「手を握る・開く」）',
    options: [
      { label: '両方可能', points: 0 },
      { label: '1つ可能', points: 1 },
      { label: '両方不可能', points: 2 },
    ],
  },
  {
    id: '2', name: '2. 最良の注視',
    options: [
      { label: '正常', points: 0 },
      { label: '部分的注視麻痺', points: 1 },
      { label: '完全注視麻痺（共同偏視）', points: 2 },
    ],
  },
  {
    id: '3', name: '3. 視野',
    options: [
      { label: '視野欠損なし', points: 0 },
      { label: '部分的半盲', points: 1 },
      { label: '完全半盲', points: 2 },
      { label: '両側性半盲（皮質盲を含む）', points: 3 },
    ],
  },
  {
    id: '4', name: '4. 顔面麻痺',
    options: [
      { label: '正常', points: 0 },
      { label: '軽度の麻痺（鼻唇溝の平坦化等）', points: 1 },
      { label: '部分的麻痺（下半分の麻痺）', points: 2 },
      { label: '完全麻痺（片側または両側）', points: 3 },
    ],
  },
  {
    id: '5a', name: '5a. 上肢の運動（左）※仰臥位は45°',
    options: [
      { label: '90°を10秒保持可能（下垂なし）', points: 0 },
      { label: '90°を保持できるが10秒以内に下垂', points: 1 },
      { label: '90°の挙上または保持ができない', points: 2 },
      { label: '重力に抗して動かない', points: 3 },
      { label: '全く動きがみられない', points: 4 },
    ],
  },
  {
    id: '5b', name: '5b. 上肢の運動（右）※仰臥位は45°',
    options: [
      { label: '90°を10秒保持可能（下垂なし）', points: 0 },
      { label: '90°を保持できるが10秒以内に下垂', points: 1 },
      { label: '90°の挙上または保持ができない', points: 2 },
      { label: '重力に抗して動かない', points: 3 },
      { label: '全く動きがみられない', points: 4 },
    ],
  },
  {
    id: '6a', name: '6a. 下肢の運動（左）',
    options: [
      { label: '30°を5秒保持できる（下垂なし）', points: 0 },
      { label: '30°を保持できるが5秒以内に下垂', points: 1 },
      { label: '重力に抗して動きがみられる', points: 2 },
      { label: '重力に抗して動かない', points: 3 },
      { label: '全く動きがみられない', points: 4 },
    ],
  },
  {
    id: '6b', name: '6b. 下肢の運動（右）',
    options: [
      { label: '30°を5秒保持できる（下垂なし）', points: 0 },
      { label: '30°を保持できるが5秒以内に下垂', points: 1 },
      { label: '重力に抗して動きがみられる', points: 2 },
      { label: '重力に抗して動かない', points: 3 },
      { label: '全く動きがみられない', points: 4 },
    ],
  },
  {
    id: '7', name: '7. 運動失調',
    options: [
      { label: 'なし', points: 0 },
      { label: '1肢', points: 1 },
      { label: '2肢', points: 2 },
    ],
  },
  {
    id: '8', name: '8. 感覚',
    options: [
      { label: '正常', points: 0 },
      { label: '軽度〜中等度の障害', points: 1 },
      { label: '重度〜完全な感覚脱失', points: 2 },
    ],
  },
  {
    id: '9', name: '9. 最良の言語',
    options: [
      { label: '正常、失語なし', points: 0 },
      { label: '軽度〜中等度の失語', points: 1 },
      { label: '重度の失語', points: 2 },
      { label: '完全失語・無言', points: 3 },
    ],
  },
  {
    id: '10', name: '10. 構音障害',
    options: [
      { label: '正常', points: 0 },
      { label: '軽度〜中等度', points: 1 },
      { label: '重度（聞き取れない）', points: 2 },
    ],
  },
  {
    id: '11', name: '11. 消去現象と注意障害',
    options: [
      { label: '異常なし', points: 0 },
      { label: '視覚・触覚・聴覚・視空間・自己身体に対する不注意、あるいは1つの感覚様式で2点同時刺激に対する消去現象', points: 1 },
      { label: '重度の半側不注意あるいは2つ以上の感覚様式に対する半側不注意', points: 2 },
    ],
  },
]

function getSeverity(score: number): 'ok' | 'wn' | 'dn' {
  if (score <= 4) return 'ok'
  if (score <= 15) return 'wn'
  return 'dn'
}

function getLabel(score: number): string {
  if (score === 0) return '正常'
  if (score <= 4) return '軽症脳卒中'
  if (score <= 15) return '中等症脳卒中'
  if (score <= 24) return '重症脳卒中'
  return '最重症脳卒中'
}

function getTpaNote(_score: number): string {
  return 'rt-PA適応はNIHSSスコアのみでは判断しない。発症時刻・禁忌事項を含め神経内科専門医が総合判断'
}

export default function NihssPage() {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(items.map(item => [item.id, 0]))
  )

  const result = useMemo(() => {
    const total = Object.values(scores).reduce((a, b) => a + b, 0)
    return {
      total,
      label: getLabel(total),
      severity: getSeverity(total),
      tpaNote: getTpaNote(total),
    }
  }, [scores])

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
          label="NIHSS"
          value={result.total}
          unit="/ 42点"
          interpretation={result.label}
          severity={result.severity}
          details={[
            { label: 'rt-PA参考情報', value: result.tpaNote },
          ]}
        />
      }
      explanation={undefined}
      relatedTools={toolDef.relatedSlugs
        .map(s => {
          const t = implementedTools.has(s) ? getToolBySlug(s) : null
          return t ? { slug: t.slug, name: t.name } : null
        })
        .filter(Boolean) as { slug: string; name: string }[]}
      references={[
        { text: 'Brott T, et al. Stroke 1989;20:864-870' },
        { text: '日本脳卒中学会 脳卒中治療ガイドライン2021' },
      ]}
    >
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id}>
            <label className="block text-sm font-medium text-tx mb-1">{item.name}</label>
            <select
              value={scores[item.id]}
              onChange={e => setScores(prev => ({ ...prev, [item.id]: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-bg border border-br rounded-lg text-tx
                         focus:outline-none focus:ring-2 focus:ring-ac/30 focus:border-ac text-sm"
            >
              {item.options.map(opt => (
                <option key={opt.points} value={opt.points}>
                  {opt.points}点 — {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </CalculatorLayout>
  )
}
