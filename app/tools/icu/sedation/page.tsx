'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ────────── RASS ────────── */
const rassLevels = [
  { score: 4, label: '好戦的', desc: '明らかに好戦的・暴力的、スタッフに直接危険', color: 'bg-red-100 border-red-400 text-red-900' },
  { score: 3, label: '非常に興奮', desc: '攻撃的、チューブ・カテーテルを引き抜く', color: 'bg-red-50 border-red-300 text-red-900' },
  { score: 2, label: '興奮', desc: '頻繁に目的のない動き、人工呼吸器とファイティング', color: 'bg-orange-50 border-orange-300 text-orange-900' },
  { score: 1, label: '落ち着かない', desc: '不安で落ち着かないが、動きは攻撃的でない', color: 'bg-yellow-50 border-yellow-300 text-yellow-900' },
  { score: 0, label: '覚醒・穏やか', desc: '自発的に覚醒', color: 'bg-green-50 border-green-400 text-green-900' },
  { score: -1, label: '傾眠', desc: '完全に覚醒ではないが、呼びかけで10秒以上アイコンタクト保持', color: 'bg-blue-50 border-blue-200 text-blue-900' },
  { score: -2, label: '浅い鎮静', desc: '呼びかけで短時間（<10秒）アイコンタクト', color: 'bg-blue-50 border-blue-300 text-blue-900' },
  { score: -3, label: '中等度鎮静', desc: '呼びかけで動き or 開眼するがアイコンタクトなし', color: 'bg-indigo-50 border-indigo-300 text-indigo-900' },
  { score: -4, label: '深い鎮静', desc: '呼びかけに反応なし。身体刺激で動き or 開眼', color: 'bg-purple-50 border-purple-300 text-purple-900' },
  { score: -5, label: '覚醒不能', desc: '呼びかけにも身体刺激にも反応なし', color: 'bg-gray-100 border-gray-400 text-gray-900' },
]

/* ────────── CAM-ICU ────────── */
const camSteps = [
  { id: 'feature1', label: '所見1: 精神状態の急性変化 or 変動性', question: '過去24時間以内に精神状態の変化があるか？ or GCSやRASSが変動するか？', yesNext: 'feature2', noResult: 'negative' },
  { id: 'feature2', label: '所見2: 注意力障害', question: 'ASEAM (Attention Screening Exam): 聴覚ASEAM — \"SAVEAHAART\" の \"A\" で握手してもらう。10文字中≧2回のエラーで陽性。', yesNext: 'feature3', noResult: 'negative' },
  { id: 'feature3', label: '所見3: 意識レベルの変容', question: 'RASS ≠ 0 か？（0以外なら陽性）', yesResult: 'positive', noNext: 'feature4' },
  { id: 'feature4', label: '所見4: 無秩序な思考', question: '4つの質問に回答させる:①石は水に浮くか②海に魚はいるか③1kgは2kgより重いか④ハンマーで釘を打てるか。≧2回のエラーで陽性。', yesResult: 'positive', noResult: 'negative' },
]

/* ────────── BPS ────────── */
const bpsItems = [
  { category: '表情', options: [
    { score: 1, label: 'リラックス' },
    { score: 2, label: '部分的に緊張（例: 眉をひそめる）' },
    { score: 3, label: '全体的に緊張（例: 閉眼）' },
    { score: 4, label: 'しかめっ面' },
  ]},
  { category: '上肢の動き', options: [
    { score: 1, label: '動きなし' },
    { score: 2, label: '部分的屈曲' },
    { score: 3, label: '指を曲げて完全屈曲' },
    { score: 4, label: '持続的引き戻し（retraction）' },
  ]},
  { category: '人工呼吸器との同調性', options: [
    { score: 1, label: '同調' },
    { score: 2, label: '大部分は同調（時に咳）' },
    { score: 3, label: 'ファイティング' },
    { score: 4, label: '換気不能' },
  ]},
]

/* ────────── CPOT ────────── */
const cpotItems = [
  { category: '表情', options: [
    { score: 0, label: 'リラックス・中性' },
    { score: 1, label: '緊張（眉をひそめる・眼瞼を強く閉じる）' },
    { score: 2, label: 'しかめっ面（上記+歯を食いしばる）' },
  ]},
  { category: '体動', options: [
    { score: 0, label: '体動なし or 正常な姿勢' },
    { score: 1, label: '防御的動き（痛み部位に手を持っていく）' },
    { score: 2, label: '落ち着かない / 興奮（チューブを引っ張る等）' },
  ]},
  { category: '筋緊張（上肢の他動屈曲/伸展）', options: [
    { score: 0, label: '抵抗なし' },
    { score: 1, label: '抵抗あり' },
    { score: 2, label: '強い抵抗（他動困難）' },
  ]},
  { category: '人工呼吸器同調性（挿管時）or 発声（非挿管時）', options: [
    { score: 0, label: '同調（挿管時）/ 普通の声（非挿管時）' },
    { score: 1, label: 'アラーム時にも同調（挿管）/ うめき（非挿管）' },
    { score: 2, label: 'ファイティング（挿管）/ 泣く（非挿管）' },
  ]},
]

/* ────────── メインコンポーネント ────────── */
type Tab = 'rass' | 'cam' | 'bps' | 'cpot'

export default function SedationPage() {
  const [tab, setTab] = useState<Tab>('rass')
  const [selectedRass, setSelectedRass] = useState<number | null>(null)

  // CAM-ICU
  const [camStep, setCamStep] = useState(0)
  const [camResult, setCamResult] = useState<'positive' | 'negative' | null>(null)
  const resetCam = () => { setCamStep(0); setCamResult(null) }

  // BPS
  const [bpsScores, setBpsScores] = useState<number[]>([0, 0, 0])
  const bpsTotal = bpsScores.reduce((a, b) => a + b, 0)

  // CPOT
  const [cpotScores, setCpotScores] = useState<number[]>([0, 0, 0, 0])
  const cpotTotal = cpotScores.reduce((a, b) => a + b, 0)

  const tabs: { key: Tab; label: string }[] = [
    { key: 'rass', label: 'RASS' },
    { key: 'cam', label: 'CAM-ICU' },
    { key: 'bps', label: 'BPS' },
    { key: 'cpot', label: 'CPOT' },
  ]

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6 flex-wrap">
        <Link href="/tools" className="hover:text-ac">ツール</Link>
        <span>/</span>
        <Link href="/tools/icu" className="hover:text-ac">ICU管理</Link>
        <span>/</span>
        <span className="text-tx font-medium">鎮静・鎮痛・せん妄</span>
      </nav>

      <h1 className="text-2xl font-bold text-tx mb-2">鎮静・鎮痛・せん妄評価ツール</h1>
      <p className="text-muted mb-6">RASS（鎮静深度）、CAM-ICU（せん妄）、BPS/CPOT（疼痛）の4スケールをインタラクティブに評価。PADISガイドライン準拠。</p>

      <div className="bg-dnl border-2 border-dnb rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-dn mb-1">⚠️ 重要</p>
        <p className="text-sm text-dn/90">本ツールはスケール評価の補助です。鎮静・鎮痛薬の調整は担当医・施設プロトコルに従ってください。</p>
      </div>

      {/* タブ */}
      <div className="flex gap-1 mb-6 bg-s2 rounded-xl p-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
              tab === t.key ? 'bg-bg text-ac shadow-sm' : 'text-muted hover:text-tx'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── RASS ── */}
      {tab === 'rass' && (
        <div className="space-y-2">
          <p className="text-sm font-bold text-tx mb-3">Richmond Agitation-Sedation Scale（RASS）</p>
          <p className="text-xs text-muted mb-4">目標RASS: 通常 -2 〜 0（浅い鎮静）。ARDS/人工呼吸器ファイティング時は -3 〜 -4 も許容。</p>
          {rassLevels.map(r => (
            <button
              key={r.score}
              onClick={() => setSelectedRass(r.score)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                selectedRass === r.score ? r.color + ' ring-2 ring-ac' : 'border-br bg-bg hover:bg-s1'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-10 text-center font-bold text-lg">{r.score > 0 ? `+${r.score}` : r.score}</span>
                <div>
                  <p className="text-sm font-bold">{r.label}</p>
                  <p className="text-xs text-muted">{r.desc}</p>
                </div>
              </div>
            </button>
          ))}
          {selectedRass !== null && (
            <div className="mt-4 p-4 bg-acl border border-ac/30 rounded-xl">
              <p className="text-sm font-bold text-tx">選択: RASS {selectedRass > 0 ? `+${selectedRass}` : selectedRass}</p>
              <p className="text-sm text-muted mt-1">
                {selectedRass >= 1 && '→ 鎮静薬の増量 or ボーラス投与を検討。原因検索（疼痛・せん妄・不安・低酸素等）'}
                {selectedRass === 0 && '→ 目標範囲内。鎮静薬のweaning/中断を検討（SAT: 自発覚醒試験）'}
                {selectedRass === -1 && '→ 多くの場合目標範囲内。SAT/SBT施行可能か評価'}
                {selectedRass === -2 && '→ 目標範囲内（浅い鎮静）。人工呼吸器離脱の評価を'}
                {selectedRass <= -3 && selectedRass >= -4 && '→ 必要以上に深い可能性。鎮静薬減量 or SAT（自発覚醒試験）を検討'}
                {selectedRass === -5 && '→ 覚醒不能。鎮静薬の減量・中断を検討。脳障害の除外も'}
              </p>
              {selectedRass >= -3 && selectedRass !== 0 && (
                <p className="text-xs text-ac mt-2 font-medium">→ CAM-ICU でせん妄評価を（RASS -3 以上で施行可能）</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── CAM-ICU ── */}
      {tab === 'cam' && (
        <div>
          <p className="text-sm font-bold text-tx mb-2">CAM-ICU（せん妄評価）</p>
          <p className="text-xs text-muted mb-4">RASS -3 以上で施行可能。所見1+2が陽性の場合、所見3 or 4のいずれかが陽性ならせん妄と診断。</p>

          {camResult === null ? (
            <div className="border-2 border-ac/30 rounded-2xl p-6 bg-s1">
              <p className="text-xs text-muted mb-1">ステップ {camStep + 1} / 4</p>
              <h3 className="text-base font-bold text-tx mb-2">{camSteps[camStep].label}</h3>
              <p className="text-sm text-muted mb-4">{camSteps[camStep].question}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const step = camSteps[camStep]
                    if ('yesResult' in step && step.yesResult) setCamResult(step.yesResult as 'positive')
                    else if ('yesNext' in step && step.yesNext) setCamStep(camSteps.findIndex(s => s.id === step.yesNext))
                  }}
                  className="flex-1 p-3 rounded-xl border-2 border-red-200 bg-red-50 hover:border-red-400 text-sm font-bold text-red-900 transition-colors"
                >
                  はい（陽性）
                </button>
                <button
                  onClick={() => {
                    const step = camSteps[camStep]
                    if ('noResult' in step && step.noResult) setCamResult(step.noResult as 'negative')
                    else if ('noNext' in step && step.noNext) setCamStep(camSteps.findIndex(s => s.id === step.noNext))
                  }}
                  className="flex-1 p-3 rounded-xl border-2 border-br bg-bg hover:border-ac/40 text-sm font-bold text-tx transition-colors"
                >
                  いいえ（陰性）
                </button>
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border-2 p-5 ${camResult === 'positive' ? 'bg-red-50 border-red-300 text-red-900' : 'bg-green-50 border-green-300 text-green-900'}`}>
              <h3 className="font-bold text-lg mb-2">CAM-ICU: {camResult === 'positive' ? '陽性（せん妄あり）' : '陰性（せん妄なし）'}</h3>
              {camResult === 'positive' ? (
                <ul className="text-sm space-y-1">
                  <li>• 原因検索: 感染・薬剤（ベンゾジアゼピン・オピオイド）・電解質・低酸素・疼痛・便秘・尿閉</li>
                  <li>• 非薬物的介入: 早期離床・日中覚醒・夜間睡眠確保・見当識支援</li>
                  <li>• 薬物的介入: ベンゾジアゼピン系の中止/減量、デクスメデトミジンへの変更を検討</li>
                  <li>• 身体抑制は最小限に（せん妄を悪化させる）</li>
                </ul>
              ) : (
                <p className="text-sm">せん妄は認められません。引き続き定期的な評価を（少なくとも8時間ごと）。</p>
              )}
              <button onClick={resetCam} className="mt-3 px-4 py-2 rounded-lg border border-current/30 text-sm hover:bg-white/50 transition-colors">再評価</button>
            </div>
          )}
        </div>
      )}

      {/* ── BPS ── */}
      {tab === 'bps' && (
        <div>
          <p className="text-sm font-bold text-tx mb-2">Behavioral Pain Scale（BPS）— 挿管患者用</p>
          <p className="text-xs text-muted mb-4">3-12点。≧5点 で「疼痛あり」→ 鎮痛薬投与を検討。</p>
          <div className="space-y-4">
            {bpsItems.map((item, idx) => (
              <div key={item.category} className="bg-s1 border border-br rounded-xl p-4">
                <p className="text-sm font-bold text-tx mb-2">{item.category}</p>
                <div className="space-y-1">
                  {item.options.map(opt => (
                    <button
                      key={opt.score}
                      onClick={() => { const n = [...bpsScores]; n[idx] = opt.score; setBpsScores(n) }}
                      className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                        bpsScores[idx] === opt.score ? 'bg-ac/10 border border-ac/40 text-ac font-medium' : 'hover:bg-s2'
                      }`}
                    >
                      <span className="font-bold mr-2">{opt.score}</span>{opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={`mt-4 p-4 rounded-xl border-2 ${bpsTotal >= 5 ? 'bg-red-50 border-red-300 text-red-900' : 'bg-green-50 border-green-300 text-green-900'}`}>
            <p className="text-lg font-bold">BPS: {bpsTotal} / 12</p>
            <p className="text-sm mt-1">{bpsTotal >= 5 ? '→ 疼痛あり。鎮痛薬の投与/増量を検討（analgesia-first approach）' : '→ 疼痛コントロール良好'}</p>
          </div>
        </div>
      )}

      {/* ── CPOT ── */}
      {tab === 'cpot' && (
        <div>
          <p className="text-sm font-bold text-tx mb-2">Critical-Care Pain Observation Tool（CPOT）</p>
          <p className="text-xs text-muted mb-4">0-8点。≧3点 で「疼痛あり」→ 鎮痛薬投与を検討。挿管・非挿管どちらにも使用可。</p>
          <div className="space-y-4">
            {cpotItems.map((item, idx) => (
              <div key={item.category} className="bg-s1 border border-br rounded-xl p-4">
                <p className="text-sm font-bold text-tx mb-2">{item.category}</p>
                <div className="space-y-1">
                  {item.options.map(opt => (
                    <button
                      key={opt.score}
                      onClick={() => { const n = [...cpotScores]; n[idx] = opt.score; setCpotScores(n) }}
                      className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                        cpotScores[idx] === opt.score ? 'bg-ac/10 border border-ac/40 text-ac font-medium' : 'hover:bg-s2'
                      }`}
                    >
                      <span className="font-bold mr-2">{opt.score}</span>{opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={`mt-4 p-4 rounded-xl border-2 ${cpotTotal >= 3 ? 'bg-red-50 border-red-300 text-red-900' : 'bg-green-50 border-green-300 text-green-900'}`}>
            <p className="text-lg font-bold">CPOT: {cpotTotal} / 8</p>
            <p className="text-sm mt-1">{cpotTotal >= 3 ? '→ 疼痛あり。鎮痛薬の投与/増量を検討（analgesia-first approach）' : '→ 疼痛コントロール良好'}</p>
          </div>
        </div>
      )}

      {/* 出典 */}
      <div className="mt-8 p-4 bg-s1 rounded-xl border border-br">
        <p className="text-xs font-bold text-tx mb-2">出典・参考文献</p>
        <ul className="text-xs text-muted space-y-1">
          <li>• PADIS Guidelines (Critical Care Medicine 2018)</li>
          <li>• Sessler CN et al. The Richmond Agitation-Sedation Scale (Am J Respir Crit Care Med 2002)</li>
          <li>• Ely EW et al. CAM-ICU (JAMA 2001)</li>
          <li>• Payen JF et al. Behavioral Pain Scale (Crit Care Med 2001)</li>
          <li>• Gélinas C et al. CPOT (Am J Crit Care 2006)</li>
        </ul>
      </div>
    </main>
  )
}
