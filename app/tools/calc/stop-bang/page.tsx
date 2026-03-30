'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { CheckItem } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('stop-bang')!
const items=[{id:'snoring',label:'S: 大きないびき'},{id:'tired',label:'T: 昼間の眠気'},{id:'observed',label:'O: 睡眠中の呼吸停止の指摘'},{id:'pressure',label:'P: 高血圧'},{id:'bmi',label:'B: BMI > 35'},{id:'age',label:'A: 50歳以上'},{id:'neck',label:'N: 首周り > 40cm'},{id:'gender',label:'G: 男性'}]
export default function StopBangPage(){
  const [checks,setChecks]=useState<Record<string,boolean>>(Object.fromEntries(items.map(i=>[i.id,false])))
  const result=useMemo(()=>{
    const score=items.filter(i=>checks[i.id]).length
    if(score>=5) return {score,severity:'dn' as const,label:'OSAS高確率（5-8）: 中等度〜重度OSASの可能性が高い。PSG等の精査を検討'}
    if(score>=3) return {score,severity:'wn' as const,label:'OSAS疑い（3-4）: OSASの可能性あり。スクリーニング陽性'}
    return {score,severity:'ok' as const,label:'OSAS低確率（0-2）: スクリーニング陰性'}
  },[checks])
  return(
    <CalculatorLayout slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={<ResultCard label="STOP-Bang" value={result.score} unit="/8" interpretation={result.label} severity={result.severity} />}
      explanation={<div className="text-sm text-muted"><p>※日本人では低BMIでもOSASリスクあり。本スコアはアジア人集団での検証データが限定的であり、結果は参考情報として扱うこと。</p></div>}
      relatedTools={[]} references={[{text:'Chung F et al. Chest 2016;149:631-638'}]}
    ><div className="space-y-2">{items.map(i=><CheckItem key={i.id} id={i.id} label={i.label} checked={checks[i.id]} onChange={v=>setChecks(p=>({...p,[i.id]:v}))} />)}</div></CalculatorLayout>
  )
}