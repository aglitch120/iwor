'use client'
import { useState } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('asa-ps')!

const levels = [
  { value: '1', title: 'ASA I — 健康な患者', examples: '併存疾患なし、非喫煙者、飲酒なし〜少量、正常BMI' },
  { value: '2', title: 'ASA II — 軽度の全身疾患', examples: '喫煙者、社会的飲酒、妊婦、肥満(BMI 30-40)、コントロール良好なDM/HT、軽度肺疾患' },
  { value: '3', title: 'ASA III — 重度の全身疾患', examples: 'コントロール不良のDM/HT、COPD、高度肥満(BMI≧40)、活動性肝炎、アルコール依存、PM/ICD、定期透析(ESRD)、MI/CVA/TIA/CAD既往(3ヶ月以上経過)' },
  { value: '4', title: 'ASA IV — 生命を脅かす重度の全身疾患', examples: '直近3ヶ月未満のMI/CVA/TIA、進行中の心虚血、重症弁膜症、重症EF低下、敗血症、DIC、ARDS、ショック' },
  { value: '5', title: 'ASA V — 手術なしでは生存が期待できない瀕死状態', examples: '破裂AAA、重症外傷、頭蓋内出血(mass effect)、多臓器不全、腸管虚血(心血管病変併存)' },
  { value: '6', title: 'ASA VI — 脳死と判定された臓器提供ドナー', examples: '' },
]

export default function ASAPSPage() {
  const [val, setVal] = useState('1')
  const v = Number(val)
  const sev = v <= 2 ? 'ok' as const : v <= 3 ? 'wn' as const : 'dn' as const

  return (
    <CalculatorLayout slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={<ResultCard label="ASA-PS" value={`Class ${val}`} interpretation={v <= 2 ? '低リスク' : v <= 3 ? '中リスク' : '高リスク'} severity={sev} />}
      explanation={<div className="text-sm text-muted"><p className="text-xs">緊急手術の場合は分類の後にE（Emergency）を付記する（例: ASA III-E）。</p></div>}
      relatedTools={[{ slug: 'rcri', name: 'RCRI' }]}
      references={[{ text: 'ASA Physical Status Classification System. American Society of Anesthesiologists, 2020 update' }]}
    >
      <div className="space-y-2">
        {levels.map(level => (
          <button key={level.value} onClick={() => setVal(level.value)}
            className={`w-full text-left p-3 rounded-xl border transition-all ${val === level.value ? 'bg-acl border-ac/30' : 'bg-s0 border-br hover:border-ac/20'}`}>
            <p className={`text-sm font-bold ${val === level.value ? 'text-ac' : 'text-tx'}`}>{level.title}</p>
            {level.examples && <p className="text-[11px] text-muted mt-1 leading-relaxed">{level.examples}</p>}
          </button>
        ))}
      </div>
    </CalculatorLayout>
  )
}
