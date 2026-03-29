'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { CheckItem } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('drip-score')!
// Webb BJ et al. Antimicrob Agents Chemother 2016;60:3271-3276
// Major risk factors (2点) and Minor risk factors (1点)
const items=[
  // Major (2点)
  {id:'abx',label:'過去60日以内の抗菌薬使用',points:2},
  {id:'nursing',label:'長期療養施設入所中',points:2},
  {id:'tube',label:'経管栄養',points:2},
  {id:'resistant',label:'過去1年以内の薬剤耐性菌感染/保菌',points:2},
  // Minor (1点)
  {id:'hosp',label:'過去60日以内の入院',points:1},
  {id:'copd',label:'慢性肺疾患',points:1},
  {id:'poor_func',label:'PS不良（KPS ≦70 or 寝たきり）',points:1},
  {id:'ppi',label:'H2ブロッカー/PPI使用（過去14日以内）',points:1},
  {id:'wound',label:'創傷ケア中',points:1},
  {id:'mrsa_prev',label:'施設のMRSA有病率 >25%',points:1},
]
export default function DRIPScorePage(){
  const [checks,setChecks]=useState<Record<string,boolean>>(Object.fromEntries(items.map(i=>[i.id,false])))
  const result=useMemo(()=>{
    const score=items.filter(i=>checks[i.id]).reduce((s,i)=>s+i.points,0)
    if(score>=4) return {score,severity:'dn' as const,label:'DRIPリスク高（≧4）: MRSA/緑膿菌等の耐性菌リスクあり'}
    return {score,severity:'ok' as const,label:'DRIPリスク低: 耐性菌リスクが低い'}
  },[checks])
  return(
    <CalculatorLayout slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={<ResultCard label="DRIP" value={result.score} unit="点" interpretation={result.label} severity={result.severity} />}
      explanation={undefined}
      relatedTools={[]} references={[{text:'Webb BJ et al. Derivation and Multicenter Validation of the Drug Resistance in Pneumonia Clinical Prediction Score. Antimicrob Agents Chemother 2016'}]}
    ><div className="space-y-2">{items.map(i=><CheckItem key={i.id} id={i.id} label={i.label+' (+'+String(i.points)+'点)'} checked={checks[i.id]} onChange={v=>setChecks(p=>({...p,[i.id]:v}))} />)}</div></CalculatorLayout>
  )
}