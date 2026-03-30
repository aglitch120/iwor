'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { CheckItem } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('anaphylaxis')!

export default function Page() {
  // 基準1
  const [c1_skin, setC1Skin] = useState(false)
  const [c1_resp, setC1Resp] = useState(false)
  const [c1_circ, setC1Circ] = useState(false)
  // 基準2
  const [c2_skin, setC2Skin] = useState(false)
  const [c2_resp, setC2Resp] = useState(false)
  const [c2_circ, setC2Circ] = useState(false)
  const [c2_gi, setC2Gi] = useState(false)
  // 基準3
  const [c3, setC3] = useState(false)

  const result = useMemo(() => {
    const met1 = c1_skin && (c1_resp || c1_circ)
    const c2count = [c2_skin, c2_resp, c2_circ, c2_gi].filter(Boolean).length
    const met2 = c2count >= 2
    const met3 = c3
    const met = met1 || met2 || met3
    return {
      met,
      label: met
        ? 'アナフィラキシーの診断基準を満たす（3項目のうちいずれかに該当）'
        : '診断基準を満たさない',
      severity: (met ? 'dn' : 'ok') as 'ok' | 'dn',
    }
  }, [c1_skin, c1_resp, c1_circ, c2_skin, c2_resp, c2_circ, c2_gi, c3])

  return (
    <CalculatorLayout slug={toolDef.slug} title="アナフィラキシー診断基準" titleEn="Anaphylaxis Diagnostic Criteria"
      description="以下の3項目のうちいずれかに該当すればアナフィラキシーと診断する。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={<ResultCard label="アナフィラキシー診断基準" value={result.met ? '基準該当' : '基準非該当'} interpretation={result.label} severity={result.severity} />}
      explanation={<div className="text-sm text-muted space-y-1">
        <p className="text-xs">収縮期血圧低下の定義: 平常時血圧の70%未満または下記</p>
        <p className="text-[10px]">生後1-11ヶ月: &lt;70mmHg / 1-10歳: &lt;70mmHg+(2×年齢) / 11歳-成人: &lt;90mmHg</p>
      </div>}
      relatedTools={[]}
      references={[{ text: '日本アレルギー学会. アナフィラキシーガイドライン2022' }]}
    >
      <div className="space-y-5">
        {/* 基準1 */}
        <div className="p-4 bg-s0 border border-br rounded-xl space-y-2">
          <p className="text-sm font-bold text-tx">1. 皮膚・粘膜症状 + 呼吸器 or 循環器症状</p>
          <p className="text-[10px] text-muted">皮膚症状（全身の発疹・瘙痒・紅潮）または粘膜症状（口唇・舌・口蓋垂の腫脹など）のいずれかが存在し、急速に（数分〜数時間以内）発現する症状で、かつ下記a, bの少なくとも1つを伴う</p>
          <CheckItem id="c1s" label="皮膚・粘膜症状あり（全身の発疹/瘙痒/紅潮/口唇舌口蓋垂腫脹）" checked={c1_skin} onChange={setC1Skin} />
          <p className="text-xs text-muted ml-4">さらに、少なくとも右の1つを伴う:</p>
          <CheckItem id="c1r" label="a. 呼吸器症状（呼吸困難・気道狭窄・喘鳴・低酸素血症）" checked={c1_resp} onChange={setC1Resp} />
          <CheckItem id="c1c" label="b. 循環器症状（血圧低下・意識障害）" checked={c1_circ} onChange={setC1Circ} />
        </div>

        {/* 基準2 */}
        <div className="p-4 bg-s0 border border-br rounded-xl space-y-2">
          <p className="text-sm font-bold text-tx">2. 一般的にアレルゲンとなりうるものへの曝露後、急速に（数分〜数時間以内）発現する以下の症状のうち、2つ以上を伴う</p>
          <CheckItem id="c2s" label="a. 皮膚・粘膜症状（全身の発疹/瘙痒/紅潮/浮腫）" checked={c2_skin} onChange={setC2Skin} />
          <CheckItem id="c2r" label="b. 呼吸器症状（呼吸困難/気道狭窄/喘鳴/低酸素血症）" checked={c2_resp} onChange={setC2Resp} />
          <CheckItem id="c2c" label="c. 循環器症状（血圧低下/意識障害）" checked={c2_circ} onChange={setC2Circ} />
          <CheckItem id="c2g" label="d. 持続する消化器症状（腹部疝痛/嘔吐）" checked={c2_gi} onChange={setC2Gi} />
        </div>

        {/* 基準3 */}
        <div className="p-4 bg-s0 border border-br rounded-xl space-y-2">
          <p className="text-sm font-bold text-tx">3. 当該患者におけるアレルゲンへの曝露後の急速な（数分〜数時間以内）血圧低下</p>
          <CheckItem id="c3" label="既知のアレルゲン曝露後の急速な血圧低下" checked={c3} onChange={setC3} />
        </div>
      </div>
    </CalculatorLayout>
  )
}
