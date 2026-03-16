'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

/* ────────── 型定義 ────────── */
interface PatientInput {
  sex: 'male' | 'female'
  heightCm: string
  actualWeight: string
  indication: 'general' | 'ards' | 'copd' | 'asthma' | 'neuro'
  fio2Current: string
  peepCurrent: string
}

const defaultInput: PatientInput = {
  sex: 'male', heightCm: '170', actualWeight: '70',
  indication: 'general', fio2Current: '40', peepCurrent: '5',
}

/* FiO2/PEEP 対応表 (ARDSNet) */
const fio2PeepLow = [
  { fio2: 30, peep: 5 }, { fio2: 40, peep: 5 }, { fio2: 40, peep: 8 },
  { fio2: 50, peep: 8 }, { fio2: 50, peep: 10 }, { fio2: 60, peep: 10 },
  { fio2: 70, peep: 10 }, { fio2: 70, peep: 12 }, { fio2: 70, peep: 14 },
  { fio2: 80, peep: 14 }, { fio2: 90, peep: 14 }, { fio2: 90, peep: 16 },
  { fio2: 90, peep: 18 }, { fio2: 100, peep: 18 }, { fio2: 100, peep: 24 },
]
const fio2PeepHigh = [
  { fio2: 30, peep: 5 }, { fio2: 30, peep: 8 }, { fio2: 30, peep: 10 },
  { fio2: 30, peep: 12 }, { fio2: 30, peep: 14 }, { fio2: 40, peep: 14 },
  { fio2: 40, peep: 16 }, { fio2: 50, peep: 16 }, { fio2: 50, peep: 18 },
  { fio2: 50, peep: 20 }, { fio2: 60, peep: 20 }, { fio2: 70, peep: 20 },
  { fio2: 80, peep: 20 }, { fio2: 80, peep: 22 }, { fio2: 90, peep: 22 },
  { fio2: 100, peep: 22 }, { fio2: 100, peep: 24 },
]

const indicationLabels: Record<string, string> = {
  general: '一般（術後・呼吸不全等）',
  ards: 'ARDS（肺保護換気）',
  copd: 'COPD急性増悪',
  asthma: '重症喘息',
  neuro: '脳神経疾患（頭蓋内圧亢進）',
}

function calcIBW(sex: string, heightCm: number) {
  return sex === 'male' ? 50 + 0.91 * (heightCm - 152.4) : 45.5 + 0.91 * (heightCm - 152.4)
}

export default function VentilatorPage() {
  const [input, setInput] = useState<PatientInput>(defaultInput)
  const set = (k: keyof PatientInput, v: string) => setInput(prev => ({ ...prev, [k]: v }))

  const result = useMemo(() => {
    const h = parseFloat(input.heightCm) || 0
    const w = parseFloat(input.actualWeight) || 0
    if (!h) return null
    const ibw = calcIBW(input.sex, h)
    const ind = input.indication

    // TV
    let tvMlKg = ind === 'ards' ? 6 : ind === 'copd' ? 6 : ind === 'asthma' ? 6 : ind === 'neuro' ? 8 : 8
    let tvMlKgRange = ind === 'ards' ? '4-6' : ind === 'copd' ? '6-8' : ind === 'asthma' ? '6-8' : ind === 'neuro' ? '6-8' : '6-8'
    const tvMl = Math.round(ibw * tvMlKg)
    const tvMin = Math.round(ibw * parseFloat(tvMlKgRange.split('-')[0]))
    const tvMax = Math.round(ibw * parseFloat(tvMlKgRange.split('-')[1]))

    // RR
    let rr = ind === 'ards' ? 20 : ind === 'copd' ? 12 : ind === 'asthma' ? 10 : ind === 'neuro' ? 16 : 14
    let rrRange = ind === 'ards' ? '16-24' : ind === 'copd' ? '10-14' : ind === 'asthma' ? '8-12' : ind === 'neuro' ? '14-20' : '12-16'

    // FiO2
    let fio2 = ind === 'ards' ? 40 : 40
    let fio2Note = 'SpO₂ 92-96%目標で漸減'

    // PEEP
    let peep = ind === 'ards' ? 10 : ind === 'copd' ? 5 : ind === 'asthma' ? 0 : 5
    let peepRange = ind === 'ards' ? '10-15' : ind === 'copd' ? '3-8（auto-PEEP考慮）' : ind === 'asthma' ? '0-5（auto-PEEP考慮）' : '5-8'

    // Pplat target
    let pplatTarget = ind === 'ards' ? '≦30 cmH₂O' : ind === 'asthma' ? '≦30 cmH₂O' : '≦30 cmH₂O'

    // Mode suggestion
    let mode = ind === 'ards' ? 'A/C 量規定（VCV）' : ind === 'copd' ? 'A/C 圧規定（PCV）or PSV' : ind === 'asthma' ? 'A/C 量規定（VCV）' : ind === 'neuro' ? 'A/C 量規定（VCV）' : 'A/C 量規定（VCV）or 圧規定（PCV）'

    // Special notes
    const notes: string[] = []
    if (ind === 'ards') {
      notes.push('ARDSNet 低容量換気: TV 6mL/kg IBW → Pplat ≦30 を優先')
      notes.push('Pplat > 30 なら TV を 1mL/kg ずつ減量（最小 4mL/kg）')
      notes.push('Driving pressure（Pplat - PEEP）≦15 cmH₂O 目標')
      notes.push('permissive hypercapnia: pH ≧ 7.20 なら許容')
      notes.push('腹臥位: P/F < 150 なら16時間/日の腹臥位を検討')
      notes.push('筋弛緩薬: 重症ARDS（P/F < 150）で48時間を検討')
    }
    if (ind === 'copd') {
      notes.push('auto-PEEP に注意: I:E比を1:3-4に設定（呼気時間を確保）')
      notes.push('外因性PEEPはauto-PEEPの80%程度を設定')
      notes.push('minute ventilation過多による hyperinflation を避ける')
    }
    if (ind === 'asthma') {
      notes.push('最重要: 呼気時間の確保。I:E比 1:4-5')
      notes.push('吸気流量を上げて（60-80L/min）吸気時間を短縮')
      notes.push('auto-PEEPモニタリング: 呼気ホールドで測定')
      notes.push('permissive hypercapnia: pH ≧ 7.20 なら許容')
    }
    if (ind === 'neuro') {
      notes.push('PaCO₂ 35-40 mmHg 目標（過換気は推奨されない）')
      notes.push('ICP亢進時の一時的過換気: PaCO₂ 30-35（短時間のみ）')
      notes.push('SpO₂ ≧ 94%（脳低酸素を避ける）')
    }

    return { ibw: Math.round(ibw * 10) / 10, tvMl, tvMin, tvMax, tvMlKg, tvMlKgRange, rr, rrRange, fio2, fio2Note, peep, peepRange, pplatTarget, mode, notes }
  }, [input])

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6 flex-wrap">
        <Link href="/tools" className="hover:text-ac">ツール</Link>
        <span>/</span>
        <Link href="/tools/icu" className="hover:text-ac">ICU管理</Link>
        <span>/</span>
        <span className="text-tx font-medium">人工呼吸器設定</span>
      </nav>

      <h1 className="text-2xl font-bold text-tx mb-2">人工呼吸器 初期設定ガイド</h1>
      <p className="text-muted mb-6">身長からIBWを算出し、病態別の推奨設定を提示。ARDSNet低容量換気・COPD/喘息のauto-PEEP対策を含む。</p>

      {/* 免責 */}
      <div className="bg-dnl border-2 border-dnb rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-dn mb-1">⚠️ 重要</p>
        <p className="text-sm text-dn/90">人工呼吸器の設定は患者の状態・呼吸メカニクス・血液ガスに基づき個別に調整してください。本ツールの値は初期設定の目安です。</p>
      </div>

      {/* 入力 */}
      <div className="bg-s1 border border-br rounded-xl p-5 mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">性別</label>
            <select value={input.sex} onChange={e => set('sex', e.target.value)} className="w-full border border-br rounded-lg px-3 py-2 text-sm bg-bg">
              <option value="male">男性</option>
              <option value="female">女性</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">身長 (cm)</label>
            <input type="number" value={input.heightCm} onChange={e => set('heightCm', e.target.value)} className="w-full border border-br rounded-lg px-3 py-2 text-sm bg-bg" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">体重 (kg) — 実測</label>
          <input type="number" value={input.actualWeight} onChange={e => set('actualWeight', e.target.value)} className="w-full border border-br rounded-lg px-3 py-2 text-sm bg-bg" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">病態・適応</label>
          <select value={input.indication} onChange={e => set('indication', e.target.value)} className="w-full border border-br rounded-lg px-3 py-2 text-sm bg-bg">
            {Object.entries(indicationLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 結果 */}
      {result && (
        <div className="space-y-4">
          {/* IBW */}
          <div className="bg-acl border border-ac/30 rounded-xl p-4">
            <p className="text-sm font-bold text-ac mb-1">理想体重（IBW）</p>
            <p className="text-2xl font-bold text-tx">{result.ibw} kg</p>
            <p className="text-xs text-muted mt-1">Devine式: {input.sex === 'male' ? '50' : '45.5'} + 0.91 × (身長cm − 152.4)</p>
          </div>

          {/* 推奨モード */}
          <div className="bg-s1 border border-br rounded-xl p-4">
            <p className="text-sm font-bold text-tx mb-1">推奨モード</p>
            <p className="text-base font-medium text-ac">{result.mode}</p>
          </div>

          {/* 設定値テーブル */}
          <div className="bg-s1 border border-br rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-br bg-s2">
              <p className="text-sm font-bold text-tx">推奨初期設定 — {indicationLabels[input.indication]}</p>
            </div>
            <div className="divide-y divide-br">
              {[
                { label: '1回換気量（TV）', value: `${result.tvMl} mL`, sub: `${result.tvMlKgRange} mL/kg IBW（${result.tvMin}-${result.tvMax} mL）` },
                { label: '呼吸回数（RR）', value: `${result.rr} /min`, sub: `目安 ${result.rrRange} /min` },
                { label: 'FiO₂', value: `${result.fio2}%`, sub: result.fio2Note },
                { label: 'PEEP', value: `${result.peep} cmH₂O`, sub: `目安 ${result.peepRange}` },
                { label: 'Pplat目標', value: result.pplatTarget, sub: 'プラトー圧。毎回確認' },
                { label: '分時換気量（MV）', value: `${Math.round(result.tvMl * result.rr / 1000 * 10) / 10} L/min`, sub: `TV × RR` },
              ].map(r => (
                <div key={r.label} className="flex items-start px-4 py-3">
                  <span className="w-36 shrink-0 text-sm font-medium text-tx">{r.label}</span>
                  <div>
                    <span className="text-sm font-bold text-ac">{r.value}</span>
                    <p className="text-xs text-muted mt-0.5">{r.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 病態別ノート */}
          {result.notes.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
              <p className="text-sm font-bold text-yellow-900 mb-2">📋 {indicationLabels[input.indication]} — 管理ポイント</p>
              <ul className="text-sm text-yellow-900 space-y-1.5">
                {result.notes.map((n, i) => <li key={i}>• {n}</li>)}
              </ul>
            </div>
          )}

          {/* FiO2/PEEP対応表 */}
          <details className="border border-br rounded-xl overflow-hidden">
            <summary className="px-4 py-3 bg-s1 cursor-pointer text-sm font-bold text-tx hover:bg-s2 transition-colors">
              📊 ARDSNet FiO₂/PEEP 対応表
            </summary>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-bold text-tx mb-2">Lower PEEP Table</p>
                <div className="overflow-x-auto">
                  <div className="flex gap-1">
                    {fio2PeepLow.map((r, i) => (
                      <div key={i} className="text-center min-w-[3rem]">
                        <div className="text-xs font-medium text-ac bg-acl rounded-t px-1 py-0.5">FiO₂ {r.fio2}%</div>
                        <div className="text-xs bg-s1 border border-br rounded-b px-1 py-0.5">PEEP {r.peep}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-tx mb-2">Higher PEEP Table</p>
                <div className="overflow-x-auto">
                  <div className="flex gap-1">
                    {fio2PeepHigh.map((r, i) => (
                      <div key={i} className="text-center min-w-[3rem]">
                        <div className="text-xs font-medium text-ac bg-acl rounded-t px-1 py-0.5">FiO₂ {r.fio2}%</div>
                        <div className="text-xs bg-s1 border border-br rounded-b px-1 py-0.5">PEEP {r.peep}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}

      {/* 出典 */}
      <div className="mt-8 p-4 bg-s1 rounded-xl border border-br">
        <p className="text-xs font-bold text-tx mb-2">出典・参考文献</p>
        <ul className="text-xs text-muted space-y-1">
          <li>• ARDSNet Protocol (ARMA trial, NEJM 2000)</li>
          <li>• Brower RG et al. Higher versus Lower PEEP (ALVEOLI trial, NEJM 2004)</li>
          <li>• Guérin C et al. Prone positioning in ARDS (PROSEVA trial, NEJM 2013)</li>
          <li>• 日本呼吸療法医学会 人工呼吸器離脱ガイドライン</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-dnl border border-dnb rounded-xl">
        <p className="text-xs text-dn">本ツールは人工呼吸器管理の初期設定の目安を提供するものです。実際の設定は血液ガス・呼吸メカニクス・画像所見・患者の臨床経過に基づき、担当医が個別に調整してください。</p>
      </div>
    </main>
  )
}
