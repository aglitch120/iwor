'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { CheckItem } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('itp-criteria')!

// 厚労省 特発性血小板減少性紫斑病 診断基準
const clinicalItems = [
  { id: 'bleeding', label: '出血症状がある（紫斑・歯肉出血・鼻出血・下血・血尿・月経過多等）', sublabel: '出血症状を自覚していないが血小板減少を指摘された場合も含む' },
]
const labItems = [
  { id: 'plt', label: '①血小板数 10万/μL以下', sublabel: '自動血球計数時は偽血小板減少（EDTA依存性等）に留意' },
  { id: 'rbc_wbc', label: '②赤血球・白血球は数・形態ともに正常', sublabel: 'ときに失血性/鉄欠乏性貧血・軽度の白血球増減を伴うことあり' },
  { id: 'megakaryo', label: '③骨髄巨核球数は正常ないし増加', sublabel: '血小板付着像を欠くものが多い。赤芽球・顆粒球は正常' },
  { id: 'paigG', label: '④PAIgG増量（参考所見）', sublabel: 'ときに増量を認めないことあり。ITP以外でも増加しうる' },
]
// 除外すべき疾患
const exclusions = [
  '薬剤または放射線障害',
  '再生不良性貧血',
  '骨髄異形成症候群 (MDS)',
  '発作性夜間血色素尿症 (PNH)',
  '全身性エリテマトーデス (SLE)',
  '白血病・悪性リンパ腫・骨髄癌転移',
  '播種性血管内凝固症候群 (DIC)',
  '血栓性血小板減少性紫斑病 (TTP)',
  '脾機能亢進症',
  '巨赤芽球性貧血',
  '敗血症・結核症・サルコイドーシス',
  '血管腫',
  '肝硬変',
  '先天性血小板減少症（BSS・WAS・MHA・KMS等）',
]

export default function ItpCriteriaPage() {
  const [clinical, setClinical] = useState<Record<string, boolean>>(Object.fromEntries(clinicalItems.map(i => [i.id, false])))
  const [lab, setLab] = useState<Record<string, boolean>>(Object.fromEntries(labItems.map(i => [i.id, false])))
  const [excl, setExcl] = useState<boolean[]>(exclusions.map(() => false))

  const result = useMemo(() => {
    const hasClinical = clinical['bleeding']
    const hasPlt = lab['plt']
    const hasLab = lab['rbc_wbc'] && lab['megakaryo']
    const allExcluded = excl.every(Boolean)
    const met = hasClinical && hasPlt && hasLab && allExcluded
    return {
      met,
      label: met ? 'ITP診断基準を満たす（1+2の特徴を備え、3の条件を満たす）' : '診断基準を満たさない',
      severity: (met ? 'wn' : 'ok') as 'ok' | 'wn',
    }
  }, [clinical, lab, excl])

  return (
    <CalculatorLayout slug={toolDef.slug} title="特発性血小板減少性紫斑病（ITP）診断基準" titleEn="ITP Diagnostic Criteria (MHLW Japan)"
      description="厚労省指定難病63番。ITPは除外診断が主体。血小板減少をもたらす基礎疾患・薬剤を除外する必要がある。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={<ResultCard severity={result.severity} value={result.met ? 'ITP基準充足' : '基準非充足'} interpretation={result.label} />}
      explanation={<div className="text-sm text-muted"><p>1（自覚症状・理学的所見）及び2（検査所見）の特徴を備え、さらに3（除外診断）の条件を満たせばITPの診断を下す。</p></div>}
      relatedTools={[{ slug: '4t-score', name: '4T\'s(HIT)' }, { slug: 'plt-transfusion', name: 'PLT輸血' }, { slug: 'dic-comprehensive', name: 'DIC診断基準' }]}
      references={[{ text: '厚生労働省 指定難病63 特発性血小板減少性紫斑病 診断基準' }]}
    >
      <div className="space-y-4">
        <p className="text-xs font-bold text-ac">1. 自覚症状・理学的所見</p>
        {clinicalItems.map(i => <CheckItem key={i.id} id={i.id} label={i.label} sublabel={i.sublabel} checked={clinical[i.id]} onChange={v => setClinical(p => ({ ...p, [i.id]: v }))} />)}

        <p className="text-xs font-bold text-ac mt-3">2. 検査所見</p>
        {labItems.map(i => <CheckItem key={i.id} id={i.id} label={i.label} sublabel={i.sublabel} checked={lab[i.id]} onChange={v => setLab(p => ({ ...p, [i.id]: v }))} />)}

        <p className="text-xs font-bold text-ac mt-3">3. 血小板減少を来しうる各種疾患の除外（すべて除外=チェック）</p>
        <p className="text-[10px] text-muted">小児のウイルス性感染症やウイルス生ワクチン接種後の血小板減少はITPに含める</p>
        <div className="space-y-1">
          {exclusions.map((ex, i) => (
            <label key={i} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${excl[i] ? 'bg-okl border border-okb' : 'bg-s0 border border-br'}`}>
              <input type="checkbox" checked={excl[i]} onChange={() => { const n = [...excl]; n[i] = !n[i]; setExcl(n) }} className="accent-[var(--ac)]" />
              <span className="text-xs text-tx">{ex}</span>
            </label>
          ))}
        </div>
      </div>
    </CalculatorLayout>
  )
}
