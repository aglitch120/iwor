'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { SelectInput } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('child-vital')!

const ageGroups = [
  { value: 'newborn', label: '新生児（0-28日）', hr: '120-160', sbp: '60-76', rr: '30-60', weight: '3-4 kg' },
  { value: 'infant1', label: '乳児（1-6ヶ月）', hr: '100-150', sbp: '70-90', rr: '30-50', weight: '4-8 kg' },
  { value: 'infant2', label: '乳児（6-12ヶ月）', hr: '90-130', sbp: '80-100', rr: '25-40', weight: '8-10 kg' },
  { value: 'toddler', label: '幼児（1-3歳）', hr: '80-120', sbp: '80-100', rr: '20-30', weight: '10-14 kg' },
  { value: 'preschool', label: '学童前期（4-5歳）', hr: '70-110', sbp: '85-110', rr: '20-25', weight: '16-20 kg' },
  { value: 'school', label: '学童（6-12歳）', hr: '65-110', sbp: '90-120', rr: '15-20', weight: '20-40 kg' },
  { value: 'adolescent', label: '思春期（13-17歳）', hr: '60-100', sbp: '100-130', rr: '12-20', weight: '40-70 kg' },
]

export default function ChildVitalPage() {
  const [age, setAge] = useState('newborn')
  const group = useMemo(() => ageGroups.find(g => g.value === age)!, [age])

  return (
    <CalculatorLayout
      slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={
        <ResultCard
          label={group.label}
          value="正常範囲"
          severity={'ok' as const}
          interpretation="下記の年齢別正常値を参照"
          details={[
            { label: '心拍数 (bpm)', value: group.hr },
            { label: '収縮期血圧 (mmHg)', value: group.sbp },
            { label: '呼吸数 (/min)', value: group.rr },
            { label: '体重目安', value: group.weight },
          ]}
        />
      }
      explanation={
        <section className="space-y-4 text-sm text-muted">
          <h2 className="text-base font-bold text-tx">小児バイタルサインの評価</h2>
          <p>小児のバイタルサインは年齢により大きく異なります。成人の基準を当てはめると異常を見落とす危険があるため、年齢別正常値の把握が重要です。</p>
          <h2 className="text-base font-bold text-tx">簡易推定式</h2>
          <p>収縮期血圧下限 = 70 + (年齢 × 2) mmHg（1歳以上）。体重 = (年齢 × 2) + 8 kg（1-8歳の概算）。気管チューブ内径 = (年齢/4) + 3.5 mm（カフなし）。</p>
          <h2 className="text-base font-bold text-tx">PALS（小児二次救命処置）</h2>
          <p>頻脈・徐脈の定義は年齢により異なります。ショックの早期認識には頻脈、CRT延長、意識変容が重要です。低血圧は代償不全の遅発徴候です。</p>
        </section>
      }
      relatedTools={[]}
      references={[
        { text: 'AHA PALS Provider Manual 2020' },
        { text: 'Fleming S et al. Normal ranges of heart rate and respiratory rate in children. Lancet 2011;377:1011-1018' },
      ]}
    >
      <div className="space-y-4">
        <SelectInput
          id="age"
          label="年齢区分を選択"
          value={age}
          onChange={setAge}
          options={ageGroups.map(g => ({ value: g.value, label: g.label }))}
        />
        <div className="bg-bg border border-br rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-br bg-s0">
                <th className="text-left p-2 text-tx font-medium">年齢</th>
                <th className="text-center p-2 text-tx font-medium">HR</th>
                <th className="text-center p-2 text-tx font-medium">SBP</th>
                <th className="text-center p-2 text-tx font-medium">RR</th>
              </tr>
            </thead>
            <tbody>
              {ageGroups.map(g => (
                <tr key={g.value} className={`border-b border-br last:border-0 ${g.value === age ? 'bg-acl' : ''}`}>
                  <td className="p-2 text-tx text-xs">{g.label}</td>
                  <td className="p-2 text-center text-muted text-xs">{g.hr}</td>
                  <td className="p-2 text-center text-muted text-xs">{g.sbp}</td>
                  <td className="p-2 text-center text-muted text-xs">{g.rr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CalculatorLayout>
  )
}
