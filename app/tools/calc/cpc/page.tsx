'use client'
import { useState } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { RadioGroup } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('cpc')!

const cpcLevels = [
  { label: 'CPC 1: 機能良好 — 正常な脳機能。意識清明で正常な生活を営む。軽度の神経学的・心理学的障害はあってもよい', value: '1' },
  { label: 'CPC 2: 中等度障害 — 意識あり。介助なしに着替え・旅行・炊事等の日常生活可能。保護的環境でパートタイム就労可能だが厳しい仕事はできない', value: '2' },
  { label: 'CPC 3: 重度障害 — 意識あり。日常生活に他者の介助が必要。認知障害を含む高度の記憶障害や不全麻痺等', value: '3' },
  { label: 'CPC 4: 昏睡・植物状態 — 意識なし。周囲との会話や精神的交流の欠如。認知力欠如', value: '4' },
  { label: 'CPC 5: 死亡または脳死', value: '5' },
]

const opcLevels = [
  { label: 'OPC 1: 機能良好 — 健康で意識清明。CPC 1であるとともに脳以外の原因による軽度の障害', value: '1' },
  { label: 'OPC 2: 中等度障害 — 意識あり。CPC 2の状態、あるいは脳以外の原因による中等度の障害、もしくは両者の合併。介助なしに日常生活可能', value: '2' },
  { label: 'OPC 3: 高度障害 — 意識あり。CPC 3の状態、あるいは脳以外の原因による高度の障害、もしくは両者の合併。日常生活に介助が必要', value: '3' },
  { label: 'OPC 4: 昏睡・植物状態 — CPC 4と同様', value: '4' },
  { label: 'OPC 5: 死亡または脳死', value: '5' },
]

export default function CPCPage() {
  const [cpc, setCpc] = useState('1')
  const [opc, setOpc] = useState('1')
  const cpcV = Number(cpc)
  const opcV = Number(opc)
  const cpcSev = cpcV <= 2 ? 'ok' as const : cpcV <= 3 ? 'wn' as const : 'dn' as const
  const opcSev = opcV <= 2 ? 'ok' as const : opcV <= 3 ? 'wn' as const : 'dn' as const

  return (
    <CalculatorLayout slug={toolDef.slug} title="グラスゴー・ピッツバーグ CPC/OPC" titleEn="Glasgow-Pittsburgh CPC/OPC"
      description="心肺蘇生後患者の機能的評価。CPC（脳機能カテゴリー）とOPC（全身機能カテゴリー）の2つで評価。ウツタイン様式で使用推奨。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={
        <div className="space-y-2">
          <ResultCard label="CPC（脳機能カテゴリー）" value={`CPC ${cpc}`}
            interpretation={cpcV <= 2 ? '予後良好（CPC 1-2）' : cpcV === 3 ? '予後不良（重度障害）' : cpcV === 4 ? '予後不良（昏睡・植物状態）' : '死亡/脳死'}
            severity={cpcSev} />
          <ResultCard label="OPC（全身機能カテゴリー）" value={`OPC ${opc}`}
            interpretation={opcV <= 2 ? '全身機能良好〜中等度' : opcV === 3 ? '全身機能高度障害' : opcV === 4 ? '昏睡・植物状態' : '死亡/脳死'}
            severity={opcSev} />
        </div>
      }
      explanation={<div className="text-sm text-muted"><p>CPCは脳機能のみ、OPCは脳+全身の機能を評価。CPC 1-2を予後良好、CPC 3-5を予後不良と分類することが多い。</p></div>}
      relatedTools={[{ slug: 'gcs', name: 'GCS' }]}
      references={[{ text: 'Jennett B, Bond M. Assessment of outcome after severe brain damage. Lancet 1975;1:480-484' }, { text: 'ウツタイン様式 日本語版' }]}
    >
      <div className="space-y-5">
        <RadioGroup id="cpc" label="CPC（脳機能カテゴリー）" options={cpcLevels} value={cpc} onChange={setCpc} />
        <RadioGroup id="opc" label="OPC（全身機能カテゴリー）" options={opcLevels} value={opc} onChange={setOpc} />
      </div>
    </CalculatorLayout>
  )
}
