'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { CheckItem } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('duke-criteria')!

const major = [
  { id: 'bc_typical', label: '血液培養陽性（典型的微生物）', sublabel: '2セット以上から: S.viridans群, S.gallolyticus(旧bovis), HACEK, S.aureus, 市中獲得の腸球菌（原発巣なし）' },
  { id: 'bc_persist', label: '血液培養陽性（持続性の菌血症）', sublabel: '12時間以上間隔の2セット陽性 or 3セット中全て陽性 or 4セット以上中過半数陽性' },
  { id: 'bc_coxiella', label: '血液培養陽性（Coxiella burnetii）', sublabel: '1回の血培陽性 or 抗phase I IgG抗体価 >1:800' },
  { id: 'echo_positive', label: '心エコー陽性所見', sublabel: '疣贅（振動性腫瘤）/ 弁膿瘍 / 人工弁の新規弁周囲逆流（既存の雑音の増悪のみは除外）' },
]

const minor = [
  { id: 'predispose', label: '素因', sublabel: '僧帽弁逸脱、大動脈二尖弁、リウマチ性弁膜症、先天性心疾患、人工弁、静注薬の使用など' },
  { id: 'fever', label: '発熱 ≧ 38.0°C', sublabel: '' },
  { id: 'vascular', label: '血管現象', sublabel: '主要血管塞栓、敗血症性肺塞栓、感染性動脈瘤、頭蓋内出血、Janeway病変、結膜出血' },
  { id: 'immune', label: '免疫学的現象', sublabel: '糸球体腎炎、Osler結節、Roth斑、リウマチ因子' },
  { id: 'micro', label: '微生物学的所見', sublabel: '血液培養陽性だが大基準を満たさない場合、またはIEとして矛盾のない活動性炎症の血清学的証拠' },
]

export default function DukeCriteriaPage() {
  const [mChecks, setM] = useState<Record<string, boolean>>(Object.fromEntries(major.map(i => [i.id, false])))
  const [nChecks, setN] = useState<Record<string, boolean>>(Object.fromEntries(minor.map(i => [i.id, false])))

  const result = useMemo(() => {
    // 血液培養大基準: bc_typical OR bc_persist OR bc_coxiella で最大1個の「微生物学的大基準」
    const bcMajor = (mChecks['bc_typical'] || mChecks['bc_persist'] || mChecks['bc_coxiella']) ? 1 : 0
    const echoMajor = mChecks['echo_positive'] ? 1 : 0
    const mj = bcMajor + echoMajor
    const mn = minor.filter(i => nChecks[i.id]).length

    // Definite: 大基準2 or 大基準1+小基準3 or 小基準5
    if (mj >= 2 || (mj >= 1 && mn >= 3) || (mn >= 5))
      return { severity: 'dn' as const, label: 'Definite IE（確診）', detail: `大基準${mj}個 + 小基準${mn}個` }
    // Possible: 大基準1+小基準1 or 小基準3
    if ((mj >= 1 && mn >= 1) || (mn >= 3))
      return { severity: 'wn' as const, label: 'Possible IE（疑い）', detail: `大基準${mj}個 + 小基準${mn}個` }
    return { severity: 'ok' as const, label: 'Rejected（否定的）', detail: '基準を満たさない or 別の確定診断あり' }
  }, [mChecks, nChecks])

  return (
    <CalculatorLayout slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={<ResultCard label="Modified Duke基準" value={result.label} severity={result.severity}
        details={[
          { label: '判定内訳', value: result.detail },
          { label: '確定基準', value: '大基準2 / 大基準1+小基準3 / 小基準5 → Definite' },
        ]} />}
      explanation={<div className="text-sm text-muted"><p>感染性心内膜炎（IE）の臨床診断基準。病理学的基準（手術・剖検での疣贅の組織所見）があればそれだけで確定診断。本ツールは臨床的基準のみ。</p></div>}
      relatedTools={[]}
      references={[{ text: 'Li JS, et al. Proposed modifications to the Duke criteria for the diagnosis of infective endocarditis. Clin Infect Dis 2000;30:633-638' }]}
    >
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-ac mb-2">大基準（Major criteria）</p>
          <div className="space-y-1">{major.map(i => <CheckItem key={i.id} id={i.id} label={i.label} sublabel={i.sublabel} checked={mChecks[i.id]} onChange={v => setM(p => ({ ...p, [i.id]: v }))} />)}</div>
        </div>
        <div>
          <p className="text-xs font-bold text-muted mb-2">小基準（Minor criteria）全5項目</p>
          <div className="space-y-1">{minor.map(i => <CheckItem key={i.id} id={i.id} label={i.label} sublabel={i.sublabel} checked={nChecks[i.id]} onChange={v => setN(p => ({ ...p, [i.id]: v }))} />)}</div>
        </div>
      </div>
    </CalculatorLayout>
  )
}
