'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ────────── 型定義 ────────── */
interface Choice { label: string; value: string; icon?: string; danger?: boolean }
interface TreeNode {
  id: string; title: string; desc?: string
  choices?: Choice[]
  result?: { severity: 'critical' | 'urgent' | 'moderate' | 'low'; title: string; actions: string[]; pitfall?: string }
  next?: (selected: string) => string
}

/* ────────── 昇圧剤比較データ ────────── */
const vasopressors = [
  { name: 'ノルアドレナリン（NE）', receptor: 'α1 > β1', effect: '血管収縮 +++, 心拍出 +', indication: '敗血症性ショック第一選択', caution: '末梢壊死（末梢ルートでも短時間なら可）', hr: '→/↑', map: '↑↑↑', co: '↑', svr: '↑↑↑' },
  { name: 'バソプレシン', receptor: 'V1', effect: '血管収縮 ++', indication: 'NE併用（0.03-0.04 U/min固定）', caution: '腸管虚血・末梢壊死。用量固定', hr: '→', map: '↑↑', co: '→', svr: '↑↑' },
  { name: 'アドレナリン', receptor: 'α1, β1, β2', effect: '血管収縮 ++, 心拍出 +++, 気管支拡張', indication: 'アナフィラキシー、心停止、NE不応性', caution: '頻脈・不整脈・乳酸上昇（β2刺激）', hr: '↑↑↑', map: '↑↑', co: '↑↑↑', svr: '↑' },
  { name: 'ドブタミン', receptor: 'β1 > β2', effect: '心拍出 +++, 血管拡張 +', indication: '低心拍出量（心原性ショック）', caution: '低血圧悪化（血管拡張作用）、頻脈・不整脈', hr: '↑↑', map: '→/↓', co: '↑↑↑', svr: '↓' },
  { name: 'ドパミン', receptor: 'D > β1 > α1（用量依存）', effect: '低用量:腎血流↑, 中用量:心拍出↑, 高用量:血管収縮', indication: '徐脈+低血圧（NE代替）', caution: '頻脈・不整脈（NEより多い）。renal dose(低用量)の有効性は否定', hr: '↑↑', map: '↑', co: '↑↑', svr: '↑' },
  { name: 'フェニレフリン', receptor: 'α1 純粋', effect: '血管収縮 ++', indication: 'SVTで頻脈を悪化させたくない時', caution: '心拍出量低下（後負荷↑）。徐脈', hr: '↓', map: '↑↑', co: '↓', svr: '↑↑↑' },
  { name: 'ミルリノン', receptor: 'PDE3阻害', effect: '心拍出 ++, 血管拡張 ++', indication: '心原性ショック（特に右心不全・肺高血圧）', caution: '低血圧（血管拡張）。腎排泄 → 腎障害時減量', hr: '↑', map: '↓', co: '↑↑', svr: '↓↓' },
]

/* ────────── ショック種類別フロー ────────── */
const tree: Record<string, TreeNode> = {
  start: {
    id: 'start', title: 'Step 1: ショックの種類を評価',
    desc: 'ショックの4分類: 循環血液量減少性・心原性・血液分布異常性（敗血症・アナフィラキシー等）・閉塞性。輸液反応性の評価 + 心エコーが鍵。',
    choices: [
      { label: '敗血症性ショック', value: 'septic', icon: '🦠', danger: true },
      { label: '心原性ショック', value: 'cardiogenic', icon: '🫀', danger: true },
      { label: 'アナフィラキシーショック', value: 'anaphylaxis', icon: '⚡', danger: true },
      { label: '出血性ショック / 循環血液量減少', value: 'hemorrhagic', icon: '🩸', danger: true },
      { label: '閉塞性ショック（PE・タンポナーデ・緊張性気胸）', value: 'obstructive', icon: '🫁', danger: true },
    ],
    next: v => v,
  },

  septic: {
    id: 'septic', title: '🦠 敗血症性ショック',
    result: {
      severity: 'critical',
      title: '敗血症性ショック — SSCGガイドライン',
      actions: [
        '【輸液】晶質液 30 mL/kg を最初の3時間で投与（SSCGバンドル）',
        '【第一選択】ノルアドレナリン（NE）→ MAP ≧ 65 mmHg 目標',
        '【第二選択】NE max量でもMAP不十分 → バソプレシン追加（用量は施設プロトコル参照）',
        '【心機能低下合併】心エコーでEF低下 → ドブタミン追加',
        '【NE不応】アドレナリンへの変更 or 追加を検討',
        '【抗菌薬】1時間以内に広域抗菌薬投与',
        '【乳酸】初回高値なら乳酸クリアランスを指標に治療',
        '【ステロイド】NE高用量でも血圧維持困難 → ヒドロコルチゾン（用量は施設プロトコル参照）',
      ],
      pitfall: '輸液過多に注意。動的指標（PLR・SVV・IVC変動）で輸液反応性を評価。盲目的な輸液ボーラス反復は避ける',
    },
  },

  cardiogenic: {
    id: 'cardiogenic', title: '🫀 心原性ショック',
    result: {
      severity: 'critical',
      title: '心原性ショック',
      actions: [
        '【原因治療】AMI → 緊急PCI / 弁膜症 → 外科介入',
        '【輸液】慎重に（肺うっ血を悪化させうる）→ 心エコー・CVP・肺動脈カテーテルで評価',
        '【第一選択】ドブタミン（心拍出量↑）± ノルアドレナリン（MAP維持）',
        '【右心不全/肺高血圧】ミルリノン（肺血管拡張+強心）',
        '【機械的補助】IABP・Impella・VA-ECMOの適応を検討',
        '【利尿薬】うっ血が主体ならフロセミド',
        '避けるべき: 過度の後負荷増加（フェニレフリン・高用量NE単独）',
      ],
      pitfall: 'NEだけでMAPを上げようとすると後負荷↑ → 心拍出量↓ → 悪循環。ドブタミン併用が基本。RV不全ではvolume loadingも慎重に',
    },
  },

  anaphylaxis: {
    id: 'anaphylaxis', title: '⚡ アナフィラキシーショック',
    result: {
      severity: 'critical',
      title: 'アナフィラキシーショック',
      actions: [
        '【第一選択】アドレナリン筋注（大腿外側 — 用量は施設プロトコル参照）',
        '改善不十分 → 5-15分ごとに反復可',
        '【輸液】大量晶質液（血管拡張+血管透過性↑で循環血液量↓）',
        '【重症持続】アドレナリン持続点滴',
        '【気道】喉頭浮腫 → 早期気管挿管（遅らせない）',
        '【補助薬】抗ヒスタミン薬（H1 + H2）、ステロイド（二相性反応予防）',
        '【β遮断薬内服中】グルカゴン静注（用量は施設プロトコル参照）',
        'アドレナリン皮下注ではなく筋注（吸収が速い）',
      ],
      pitfall: '治療のdelayが致死的。アドレナリン筋注を躊躇しない。二相性反応（4-12時間後の再燃）があるため経過観察入院を検討',
    },
  },

  hemorrhagic: {
    id: 'hemorrhagic', title: '🩸 出血性ショック',
    result: {
      severity: 'critical',
      title: '出血性ショック / 循環血液量減少性ショック',
      actions: [
        '【最優先】出血源の同定と止血（外科的・IVR・内視鏡）',
        '【輸液】晶質液で初期蘇生 → 早期に輸血',
        '【大量輸血プロトコル（MTP）】RBC:FFP:PC = 1:1:1 を目標',
        '【トラネキサム酸】受傷3時間以内に投与（CRASH-2）',
        '【昇圧剤】輸液・輸血で補正しきれない場合のブリッジとしてNE',
        '【目標】sBP 80-90（permissive hypotension — 止血前は過度な昇圧を避ける）',
        '【Ca補正】大量輸血時は低Ca血症に注意',
        '【凝固】PT/APTT/Fib/TEG(ROTEM)で凝固障害を評価・補正',
      ],
      pitfall: '昇圧剤は出血性ショックの根本治療ではない。止血+volume replacementが最優先。Permissive hypotensionは脳外傷合併時は適用しない',
    },
  },

  obstructive: {
    id: 'obstructive', title: '🫁 閉塞性ショック',
    result: {
      severity: 'critical',
      title: '閉塞性ショック（PE・タンポナーデ・緊張性気胸）',
      actions: [
        '【緊張性気胸】針脱気 → 胸腔ドレーン',
        '【心タンポナーデ】心嚢穿刺（エコーガイド）→ 外科的ドレナージ',
        '【大量PE】',
        '  - 血行動態不安定 → t-PA（全身血栓溶解療法）',
        '  - 溶解療法禁忌 → 外科的血栓除去 or カテーテル治療',
        '  - 昇圧剤ブリッジ: NE（右心後負荷↑に注意）',
        '  - 輸液: 少量（250-500mL）のみ → 過度な輸液はRV拡大→LV圧排',
        '【共通】原因の除去が唯一の根本治療。昇圧剤はブリッジ',
      ],
      pitfall: 'PE: 右心不全に過度の輸液は有害。タンポナーデ: 脈圧低下・奇脈・Beck三徴。緊張性気胸は臨床診断 → 画像確認を待たない',
    },
  },
}

/* ────────── 描画 ────────── */
const severityColors: Record<string, string> = {
  critical: 'bg-red-50 border-red-300 text-red-900',
  urgent: 'bg-orange-50 border-orange-300 text-orange-900',
  moderate: 'bg-yellow-50 border-yellow-300 text-yellow-900',
  low: 'bg-green-50 border-green-300 text-green-900',
}

export default function VasopressorPage() {
  const [current, setCurrent] = useState('start')
  const [history, setHistory] = useState<string[]>([])
  const [showTable, setShowTable] = useState(false)

  const node = tree[current]
  if (!node) return null

  const go = (next: string) => { setHistory(h => [...h, current]); setCurrent(next) }
  const back = () => { const prev = history[history.length - 1]; if (prev) { setHistory(h => h.slice(0, -1)); setCurrent(prev) } }
  const reset = () => { setCurrent('start'); setHistory([]) }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6 flex-wrap">
        <Link href="/tools" className="hover:text-ac">ツール</Link>
        <span>/</span>
        <Link href="/tools/icu" className="hover:text-ac">ICU管理</Link>
        <span>/</span>
        <span className="text-tx font-medium">昇圧剤ガイド</span>
      </nav>

      <h1 className="text-2xl font-bold text-tx mb-2">昇圧剤・強心薬 選択ガイド</h1>
      <p className="text-muted mb-6">ショックの種類別に最適な昇圧剤/強心薬を選択。薬剤別の受容体プロファイル・血行動態への影響を一覧比較。</p>

      {/* 免責 */}
      <div className="bg-dnl border-2 border-dnb rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-dn mb-1">⚠️ 重要</p>
        <p className="text-sm text-dn/90">薬剤の選択・用量は患者の状態に基づき担当医が判断してください。具体的用量は施設プロトコルに従ってください。</p>
      </div>

      {/* 薬剤比較表 */}
      <button onClick={() => setShowTable(!showTable)} className="w-full mb-6 px-4 py-3 bg-s1 border border-br rounded-xl text-sm font-bold text-tx hover:bg-s2 transition-colors text-left">
        {showTable ? '▼' : '▶'} 昇圧剤・強心薬 比較表（7薬剤）
      </button>
      {showTable && (
        <div className="mb-6 overflow-x-auto border border-br rounded-xl">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-s2 border-b border-br">
                <th className="px-3 py-2 text-left font-bold text-tx">薬剤</th>
                <th className="px-3 py-2 text-left font-bold text-tx">受容体</th>
                <th className="px-2 py-2 text-center font-bold text-tx">HR</th>
                <th className="px-2 py-2 text-center font-bold text-tx">MAP</th>
                <th className="px-2 py-2 text-center font-bold text-tx">CO</th>
                <th className="px-2 py-2 text-center font-bold text-tx">SVR</th>
              </tr>
            </thead>
            <tbody>
              {vasopressors.map(v => (
                <tr key={v.name} className="border-b border-br hover:bg-s1">
                  <td className="px-3 py-2 font-medium text-tx">{v.name}</td>
                  <td className="px-3 py-2 text-muted">{v.receptor}</td>
                  <td className="px-2 py-2 text-center">{v.hr}</td>
                  <td className="px-2 py-2 text-center">{v.map}</td>
                  <td className="px-2 py-2 text-center">{v.co}</td>
                  <td className="px-2 py-2 text-center">{v.svr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ショック種類別フロー */}
      {history.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted">ステップ {history.length + 1}</span>
        </div>
      )}

      <div className="border-2 border-ac/30 rounded-2xl p-6 bg-s1 mb-4">
        <h2 className="text-lg font-bold text-tx mb-2">{node.title}</h2>
        {node.desc && <p className="text-sm text-muted mb-4 leading-relaxed">{node.desc}</p>}

        {node.choices && (
          <div className="space-y-2">
            {node.choices.map(c => (
              <button
                key={c.value}
                onClick={() => node.next && go(node.next(c.value))}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  c.danger
                    ? 'border-red-200 bg-red-50 hover:border-red-400 hover:bg-red-100'
                    : 'border-br bg-bg hover:border-ac/40 hover:bg-acl'
                }`}
              >
                <span className="flex items-center gap-2">
                  {c.icon && <span>{c.icon}</span>}
                  <span className="text-sm font-medium text-tx">{c.label}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {node.result && (
          <div className={`rounded-xl border-2 p-5 ${severityColors[node.result.severity]}`}>
            <h3 className="font-bold text-base mb-3">{node.result.title}</h3>
            <div className="space-y-3 text-sm">
              <ul className="space-y-1.5">
                {node.result.actions.map((a, i) => <li key={i}>{a.startsWith('  ') ? <span className="ml-4">{a.trim()}</span> : <>• {a}</>}</li>)}
              </ul>
              {node.result.pitfall && (
                <div className="mt-3 p-3 bg-white/50 rounded-lg border border-current/20">
                  <p className="font-semibold mb-1">⚠️ Pitfall</p>
                  <p>{node.result.pitfall}</p>
                </div>
              )}
            </div>
            <div className="bg-white/30 border border-current/20 rounded-lg p-3 mt-3">
              <p className="text-xs">💡 上記は一般的なアプローチの一例です。実際の対応は患者の状態・施設の体制・上級医の判断を優先してください。</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {history.length > 0 && (
          <button onClick={back} className="px-4 py-2 rounded-lg border border-br text-sm text-muted hover:bg-s2 transition-colors">← 戻る</button>
        )}
        {(history.length > 0 || node.result) && (
          <button onClick={reset} className="px-4 py-2 rounded-lg border border-br text-sm text-muted hover:bg-s2 transition-colors">最初から</button>
        )}
      </div>

      <div className="mt-8 p-4 bg-s1 rounded-xl border border-br">
        <p className="text-xs font-bold text-tx mb-2">出典・参考文献</p>
        <ul className="text-xs text-muted space-y-1">
          <li>• Surviving Sepsis Campaign Guidelines 2021 (Intensive Care Med 2021)</li>
          <li>• De Backer D et al. NE vs Dopamine (NEJM 2010 SOAP II trial)</li>
          <li>• Levy B et al. Vasopressors in septic shock (Intensive Care Med 2018)</li>
          <li>• van Diepen S et al. Cardiogenic Shock (JACC 2017)</li>
        </ul>
      </div>
    </main>
  )
}
