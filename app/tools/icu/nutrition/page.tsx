'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

/* ────────── 型定義 ────────── */
interface Input {
  sex: 'male' | 'female'
  age: string
  heightCm: string
  weightKg: string
  phase: 'acute' | 'stable' | 'recovery'
  bmi: 'normal' | 'obese' | 'underweight'
  renal: 'normal' | 'aki' | 'ckd_no_rrt' | 'rrt'
  hepatic: 'normal' | 'impaired'
  stress: 'low' | 'moderate' | 'high'
}

const defaultInput: Input = {
  sex: 'male', age: '65', heightCm: '170', weightKg: '70',
  phase: 'acute', bmi: 'normal', renal: 'normal', hepatic: 'normal', stress: 'moderate',
}

const enProducts = [
  { name: 'エンシュア・リキッド', kcal: 1.0, protein: 35, fat: 35, carb: 139, osmol: 360, feature: '標準組成。最も汎用' },
  { name: 'エンシュア・H', kcal: 1.5, protein: 53, fat: 53, carb: 204, osmol: 490, feature: '高濃度。水分制限時' },
  { name: 'ラコール NF', kcal: 1.0, protein: 44, fat: 23, carb: 156, osmol: 330, feature: '低脂肪。下痢しにくい' },
  { name: 'エネーボ', kcal: 1.2, protein: 50, fat: 34, carb: 175, osmol: 400, feature: 'セレン・クロム含有' },
  { name: 'ペプタメン AF', kcal: 1.0, protein: 76, fat: 28, carb: 104, osmol: 350, feature: '高蛋白ペプチド。重症向き' },
  { name: 'ペプタメン スタンダード', kcal: 1.0, protein: 40, fat: 37, carb: 127, osmol: 280, feature: 'ペプチドベース。消化吸収◎' },
  { name: 'インパクト', kcal: 1.0, protein: 56, fat: 28, carb: 130, osmol: 300, feature: '免疫栄養（Arg+EPA+核酸）' },
  { name: 'リーナレン LP', kcal: 1.6, protein: 18, fat: 56, carb: 224, osmol: 500, feature: '低蛋白・高カロリー。CKD用' },
  { name: 'ヘパス II', kcal: 1.0, protein: 50, fat: 19, carb: 163, osmol: 370, feature: 'BCAA強化。肝不全用' },
]

function calcIBW(sex: string, h: number) {
  return 22 * ((h / 100) ** 2)
}

export default function NutritionPage() {
  const [input, setInput] = useState<Input>(defaultInput)
  const set = (k: keyof Input, v: string) => setInput(prev => ({ ...prev, [k]: v }))

  const result = useMemo(() => {
    const h = parseFloat(input.heightCm) || 0
    const w = parseFloat(input.weightKg) || 0
    const age = parseFloat(input.age) || 0
    if (!h || !w) return null

    const ibw = calcIBW(input.sex, h)
    const bmi = w / ((h / 100) ** 2)
    const isObese = bmi >= 30

    // 使用体重（肥満ではIBW or 調整体重を使用）
    const adjustedWeight = isObese ? ibw + 0.25 * (w - ibw) : w
    const useWeight = isObese ? adjustedWeight : w

    // カロリー計算（ESPEN/ASPEN ガイドライン）
    let kcalPerKg: number, kcalRange: string
    if (input.phase === 'acute') {
      if (isObese) {
        kcalPerKg = 14; kcalRange = '11-14 kcal/kg 実体重（肥満時）'
      } else {
        kcalPerKg = 20; kcalRange = '15-20 kcal/kg'
      }
    } else if (input.phase === 'stable') {
      if (isObese) {
        kcalPerKg = 22; kcalRange = '22-25 kcal/kg IBW（肥満時）'
      } else {
        kcalPerKg = 25; kcalRange = '25-30 kcal/kg'
      }
    } else {
      kcalPerKg = 30; kcalRange = '30-35 kcal/kg'
    }

    const totalKcal = Math.round(isObese && input.phase === 'acute' ? w * kcalPerKg : useWeight * kcalPerKg)
    const kcalMin = Math.round(isObese && input.phase === 'acute' ? w * 11 : useWeight * (input.phase === 'acute' ? 15 : input.phase === 'stable' ? 25 : 30))
    const kcalMax = Math.round(isObese && input.phase === 'acute' ? w * 14 : useWeight * (input.phase === 'acute' ? 20 : input.phase === 'stable' ? 30 : 35))

    // 蛋白計算
    let proteinPerKg: number, proteinRange: string
    if (input.renal === 'ckd_no_rrt') {
      proteinPerKg = 0.8; proteinRange = '0.6-0.8 g/kg（CKD 非RRT）'
    } else if (input.renal === 'rrt') {
      proteinPerKg = 1.5; proteinRange = '1.5-2.0 g/kg（RRT中 — アミノ酸喪失補填）'
    } else if (input.hepatic === 'impaired') {
      proteinPerKg = 1.2; proteinRange = '1.2-1.5 g/kg（肝不全 — BCAA強化）'
    } else if (input.phase === 'acute' && input.stress === 'high') {
      proteinPerKg = 1.5; proteinRange = '1.2-2.0 g/kg（重症急性期）'
    } else if (input.phase === 'acute') {
      proteinPerKg = 1.3; proteinRange = '1.2-1.5 g/kg（急性期）'
    } else {
      proteinPerKg = 1.3; proteinRange = '1.2-1.5 g/kg'
    }

    const proteinWeight = isObese ? ibw : w
    const totalProtein = Math.round(proteinWeight * proteinPerKg)

    // Refeeding risk
    const refeedingRisk = bmi < 18.5 || input.phase === 'acute'

    // 推奨製剤
    let recommended: string[] = []
    if (input.renal === 'ckd_no_rrt') recommended.push('リーナレン LP（低蛋白）')
    if (input.hepatic === 'impaired') recommended.push('ヘパス II（BCAA強化）')
    if (input.stress === 'high') recommended.push('ペプタメン AF（高蛋白ペプチド）')
    if (input.phase === 'recovery') recommended.push('インパクト（免疫栄養）')
    if (recommended.length === 0) recommended.push('ラコール NF or エンシュア・リキッド（標準）')

    // EN開始タイミング
    const enTiming = input.phase === 'acute' ? '入室24-48時間以内に早期経腸栄養を開始' : '可能な限り経腸栄養を継続'

    return {
      ibw: Math.round(ibw * 10) / 10,
      bmi: Math.round(bmi * 10) / 10,
      useWeight: Math.round(useWeight * 10) / 10,
      isObese,
      totalKcal, kcalMin, kcalMax, kcalRange,
      totalProtein, proteinPerKg, proteinRange,
      refeedingRisk,
      recommended,
      enTiming,
    }
  }, [input])

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6 flex-wrap">
        <Link href="/tools" className="hover:text-ac">ツール</Link>
        <span>/</span>
        <Link href="/tools/icu" className="hover:text-ac">ICU管理</Link>
        <span>/</span>
        <span className="text-tx font-medium">栄養計算</span>
      </nav>

      <h1 className="text-2xl font-bold text-tx mb-2">ICU栄養計算ツール</h1>
      <p className="text-muted mb-6">ESPEN/ASPENガイドラインに基づく必要カロリー・蛋白量の算出。経腸栄養製剤の比較、refeeding syndromeリスク評価を含む。</p>

      <div className="bg-dnl border-2 border-dnb rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-dn mb-1">⚠️ 重要</p>
        <p className="text-sm text-dn/90">栄養処方は間接熱量測定（IC）があればそれを優先してください。本ツールの値は推算式による目安です。</p>
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
            <label className="block text-xs font-medium text-muted mb-1">年齢</label>
            <input type="number" value={input.age} onChange={e => set('age', e.target.value)} className="w-full border border-br rounded-lg px-3 py-2 text-sm bg-bg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">身長 (cm)</label>
            <input type="number" value={input.heightCm} onChange={e => set('heightCm', e.target.value)} className="w-full border border-br rounded-lg px-3 py-2 text-sm bg-bg" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">体重 (kg)</label>
            <input type="number" value={input.weightKg} onChange={e => set('weightKg', e.target.value)} className="w-full border border-br rounded-lg px-3 py-2 text-sm bg-bg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">病期</label>
            <select value={input.phase} onChange={e => set('phase', e.target.value)} className="w-full border border-br rounded-lg px-3 py-2 text-sm bg-bg">
              <option value="acute">急性期（ICU初期 day 1-7）</option>
              <option value="stable">安定期（ICU後期）</option>
              <option value="recovery">回復期</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">侵襲度</label>
            <select value={input.stress} onChange={e => set('stress', e.target.value)} className="w-full border border-br rounded-lg px-3 py-2 text-sm bg-bg">
              <option value="low">低（術後・軽症）</option>
              <option value="moderate">中（一般ICU）</option>
              <option value="high">高（敗血症・外傷・熱傷）</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">腎機能</label>
            <select value={input.renal} onChange={e => set('renal', e.target.value)} className="w-full border border-br rounded-lg px-3 py-2 text-sm bg-bg">
              <option value="normal">正常</option>
              <option value="aki">AKI（RRTなし）</option>
              <option value="ckd_no_rrt">CKD（RRTなし）</option>
              <option value="rrt">RRT中（CRRT/HD）</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">肝機能</label>
            <select value={input.hepatic} onChange={e => set('hepatic', e.target.value)} className="w-full border border-br rounded-lg px-3 py-2 text-sm bg-bg">
              <option value="normal">正常</option>
              <option value="impaired">肝障害 / 肝硬変</option>
            </select>
          </div>
        </div>
      </div>

      {/* 結果 */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-acl border border-ac/30 rounded-xl p-4">
              <p className="text-xs font-medium text-muted">IBW</p>
              <p className="text-xl font-bold text-tx">{result.ibw} kg</p>
              <p className="text-xs text-muted">BMI {result.bmi}</p>
            </div>
            <div className="bg-acl border border-ac/30 rounded-xl p-4">
              <p className="text-xs font-medium text-muted">計算使用体重</p>
              <p className="text-xl font-bold text-tx">{result.useWeight} kg</p>
              {result.isObese && <p className="text-xs text-orange-600 font-medium">肥満 → 調整体重使用</p>}
            </div>
          </div>

          {/* カロリー */}
          <div className="bg-s1 border border-br rounded-xl p-4">
            <p className="text-sm font-bold text-tx mb-2">必要カロリー</p>
            <p className="text-2xl font-bold text-ac">{result.kcalMin} - {result.kcalMax} kcal/日</p>
            <p className="text-xs text-muted mt-1">{result.kcalRange}</p>
          </div>

          {/* 蛋白 */}
          <div className="bg-s1 border border-br rounded-xl p-4">
            <p className="text-sm font-bold text-tx mb-2">必要蛋白量</p>
            <p className="text-2xl font-bold text-ac">{result.totalProtein} g/日</p>
            <p className="text-xs text-muted mt-1">{result.proteinRange}</p>
          </div>

          {/* EN開始タイミング */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-bold text-blue-900 mb-1">⏱ 経腸栄養開始</p>
            <p className="text-sm text-blue-900">{result.enTiming}</p>
            <p className="text-xs text-blue-700 mt-1">急性期は目標カロリーの60-70%から開始 → 48-72時間かけて漸増</p>
          </div>

          {/* Refeeding risk */}
          {result.refeedingRisk && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
              <p className="text-sm font-bold text-red-900 mb-2">🚨 Refeeding Syndrome リスク</p>
              <ul className="text-sm text-red-900 space-y-1">
                <li>• 開始前に電解質（P, K, Mg）を必ず測定・補正</li>
                <li>• 初日は目標カロリーの25%から開始</li>
                <li>• 4-7日かけて漸増</li>
                <li>• チアミン（ビタミンB1）投与を栄養開始前に開始</li>
                <li>• 電解質を毎日モニタリング（特にリン — 低P血症が最も危険）</li>
              </ul>
            </div>
          )}

          {/* 推奨製剤 */}
          <div className="bg-s1 border border-br rounded-xl p-4">
            <p className="text-sm font-bold text-tx mb-2">推奨経腸栄養製剤</p>
            <ul className="text-sm text-muted space-y-1">
              {result.recommended.map((r, i) => <li key={i}>• {r}</li>)}
            </ul>
          </div>

          {/* 製剤比較表 */}
          <details className="border border-br rounded-xl overflow-hidden">
            <summary className="px-4 py-3 bg-s1 cursor-pointer text-sm font-bold text-tx hover:bg-s2 transition-colors">
              📊 経腸栄養製剤 比較表（{enProducts.length}製品）
            </summary>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-s2 border-b border-br">
                    <th className="px-3 py-2 text-left font-bold">製品名</th>
                    <th className="px-2 py-2 text-center font-bold">kcal/mL</th>
                    <th className="px-2 py-2 text-center font-bold">蛋白g/L</th>
                    <th className="px-2 py-2 text-center font-bold">浸透圧</th>
                    <th className="px-3 py-2 text-left font-bold">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {enProducts.map(p => (
                    <tr key={p.name} className="border-b border-br hover:bg-s1">
                      <td className="px-3 py-2 font-medium text-tx whitespace-nowrap">{p.name}</td>
                      <td className="px-2 py-2 text-center">{p.kcal}</td>
                      <td className="px-2 py-2 text-center">{p.protein}</td>
                      <td className="px-2 py-2 text-center">{p.osmol}</td>
                      <td className="px-3 py-2 text-muted">{p.feature}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}

      <div className="mt-8 p-4 bg-s1 rounded-xl border border-br">
        <p className="text-xs font-bold text-tx mb-2">出典・参考文献</p>
        <ul className="text-xs text-muted space-y-1">
          <li>• ESPEN Guidelines on Clinical Nutrition in the ICU (Clinical Nutrition 2019)</li>
          <li>• ASPEN/SCCM Guidelines for Nutrition Support in the Adult Critically Ill Patient (JPEN 2016)</li>
          <li>• NICE CG32: Nutrition support for adults (refeeding syndrome)</li>
          <li>• 日本静脈経腸栄養学会 静脈経腸栄養ガイドライン 第3版</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-dnl border border-dnb rounded-xl">
        <p className="text-xs text-dn">本ツールは栄養処方の目安を提供するものです。間接熱量測定（IC）が可能であればそれを優先してください。実際の栄養管理はNST・担当医の判断に基づき行ってください。</p>
      </div>
    </main>
  )
}
