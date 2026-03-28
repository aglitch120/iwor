'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { NumberInput } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('saag')!

export default function SAAGPage() {
  const [serumAlb, setSerumAlb] = useState('')
  const [ascitesAlb, setAscitesAlb] = useState('')

  const result = useMemo(() => {
    const s = parseFloat(serumAlb)
    const a = parseFloat(ascitesAlb)
    if (isNaN(s) || isNaN(a)) return null

    const saag = s - a
    const isPortalHTN = saag >= 1.1
    return {
      saag: saag.toFixed(2),
      isPortalHTN,
      severity: isPortalHTN ? 'wn' as const : 'ok' as const,
      label: isPortalHTN
        ? `SAAG ${saag.toFixed(2)} g/dL (>= 1.1) — 門脈圧亢進を示唆（肝硬変、心不全、Budd-Chiari症候群、門脈血栓症など）。感度97%、特異度97% (Runyon 1992)。`
        : `SAAG ${saag.toFixed(2)} g/dL (< 1.1) — 非門脈圧亢進性（癌性腹膜炎、結核性腹膜炎、膵性腹水、ネフローゼ症候群など）`,
      ddx: isPortalHTN
        ? ['肝硬変', 'アルコール性肝炎', '心不全', 'Budd-Chiari症候群', '門脈血栓症', '肝転移（大量）', '粘液水腫']
        : ['癌性腹膜炎', '結核性腹膜炎', '膵性腹水', 'ネフローゼ症候群', '胆汁性腹水', '腸管虚血', 'SLE漿膜炎'],
    }
  }, [serumAlb, ascitesAlb])

  return (
    <CalculatorLayout slug={toolDef.slug} title={toolDef.name} titleEn={toolDef.nameEn} description={toolDef.description}
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={
        <ResultCard
          label="SAAG"
          value={result ? result.saag : '—'}
          unit="g/dL"
          interpretation={result?.label || '血清と腹水のアルブミン値を入力してください'}
          severity={result?.severity || 'neutral'}
        />
      }
      explanation={undefined}
      relatedTools={[]}
      references={[{ text: 'Runyon BA, et al. Ann Intern Med 1992;117:215-220' }]}
    >
      <div className="space-y-4">
        <NumberInput id="serum-alb" label="血清アルブミン" unit="g/dL" value={serumAlb} onChange={setSerumAlb} step={0.1} hint="例: 3.0" />
        <NumberInput id="ascites-alb" label="腹水アルブミン" unit="g/dL" value={ascitesAlb} onChange={setAscitesAlb} step={0.1} hint="例: 1.5" />

        {result && (
          <div className="mt-4 rounded-xl border border-br p-4">
            <p className="text-xs font-semibold mb-2" style={{ color: result.isPortalHTN ? '#B45309' : '#047857' }}>
              {result.isPortalHTN ? '門脈圧亢進性（SAAG >= 1.1）' : '非門脈圧亢進性（SAAG < 1.1）'}の鑑別疾患:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.ddx.map(d => (
                <span key={d} className="text-xs px-2 py-1 rounded-lg bg-s1">{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  )
}
