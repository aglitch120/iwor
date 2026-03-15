'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter, ERResultCaution } from '@/components/tools/ERDisclaimer'

/* ────────── 型定義 ────────── */
interface Choice { label: string; value: string; icon?: string; danger?: boolean }
interface TreeNode {
  id: string; title: string; desc?: string
  choices?: Choice[]
  result?: { severity: 'critical' | 'urgent' | 'moderate' | 'low'; title: string; actions: string[]; workup: string[]; disposition: string; pitfall?: string }
  next?: (selected: string) => string
}

/* ────────── 意思決定ツリー定義 ────────── */
const tree: Record<string, TreeNode> = {
  start: {
    id: 'start', title: 'Step 1: ABCDEアプローチ — 安定性評価',
    desc: 'まず患者の安定性を評価。バイタルサインを確認し、不安定なら蘇生が最優先。',
    choices: [
      { label: '安定（sBP≧90, SpO₂≧94, 意識清明）', value: 'stable', icon: '✅' },
      { label: '不安定（sBP<90 / SpO₂<90 / 意識障害）', value: 'unstable', icon: '🚨', danger: true },
    ],
    next: v => v === 'unstable' ? 'unstable' : 'ecg',
  },

  unstable: {
    id: 'unstable', title: '⚠️ 血行動態不安定 — 蘇生・安定化',
    result: {
      severity: 'critical',
      title: '血行動態不安定の胸痛 → 蘇生最優先',
      actions: [
        '大口径末梢ルート2本確保 + 急速輸液',
        '12誘導心電図（安定化と並行で）',
        'モニター装着（心電図・SpO₂・血圧）',
        '酸素投与（SpO₂≧94%目標）',
        '緊張性気胸の身体所見チェック（頸静脈怒張・気管偏位・片側呼吸音低下）→ 該当すれば即座に脱気',
        '心タンポナーデの身体所見チェック（Beck三徴: 頸静脈怒張・低血圧・心音減弱）→ 心嚢穿刺/心エコー',
        '循環器/救急科コンサルト',
      ],
      workup: ['12誘導心電図', '心エコー（ベッドサイド）', 'トロポニン', '胸部X線（ポータブル）', '血液ガス'],
      disposition: 'ICU/CCU',
      pitfall: 'バイタル不安定でも心電図は可能な限り早期に。STEMI+ショックならPCIが最優先',
    },
  },

  ecg: {
    id: 'ecg', title: 'Step 2: 12誘導心電図の評価',
    desc: '安定した胸痛患者には10分以内に12誘導心電図を。ST変化がkiller diseaseの最初の手がかり。',
    choices: [
      { label: 'ST上昇あり（2誘導以上で≧1mm）', value: 'ste', icon: '📈', danger: true },
      { label: 'ST低下 / T波陰転化 / 非特異的変化', value: 'std', icon: '📉' },
      { label: '右心負荷パターン（S1Q3T3 / 右軸偏位 / V1-3のT波陰転化）', value: 'rv', icon: '🫁' },
      { label: '正常 / 変化なし', value: 'normal', icon: '📋' },
    ],
    next: v => ({ ste: 'stemi', std: 'nsteacs', rv: 'pe_suspect', normal: 'killer5' }[v] || 'killer5'),
  },

  stemi: {
    id: 'stemi', title: '🚨 STEMI疑い → 緊急再灌流療法',
    result: {
      severity: 'critical',
      title: 'STEMI — Door-to-Balloon 90分以内',
      actions: [
        'アスピリン噛砕投与（用量は施設プロトコル参照、禁忌確認）',
        'ヘパリン静注',
        'P2Y12阻害薬（プラスグレル/チカグレロル/クロピドグレル）',
        '循環器コンサルト → 緊急PCI',
        'PCI不可なら t-PA（発症12時間以内）',
        '硝酸薬（右室梗塞・sBP<90・PDE5阻害薬使用中は禁忌）',
        'モルヒネ（NTG無効の疼痛時）',
      ],
      workup: ['トロポニン（結果を待たずPCI）', '胸部X線（ポータブル）', '心エコー', '血液ガス', 'CBC・凝固・腎機能・電解質'],
      disposition: 'CCU（PCI後）',
      pitfall: 'トロポニン結果を待ってはいけない。後壁梗塞（V7-9）・右室梗塞（V4R）の追加誘導を忘れずに。新規LBBBもSTEMI equivalent',
    },
  },

  nsteacs: {
    id: 'nsteacs', title: 'Step 3: NSTE-ACS疑い — リスク層別化',
    desc: 'ST低下/T波陰転化 → まずHEART scoreでリスク評価。高リスクなら早期侵襲的戦略を検討。',
    choices: [
      { label: 'HEART score 高リスク（≧7）or 持続する胸痛/ST変化', value: 'high', icon: '🔴', danger: true },
      { label: 'HEART score 中リスク（4-6）', value: 'mid', icon: '🟡' },
      { label: 'HEART score 低リスク（0-3）+ トロポニン陰性', value: 'low', icon: '🟢' },
    ],
    next: v => ({ high: 'nsteacs_high', mid: 'nsteacs_mid', low: 'nsteacs_low' }[v] || 'nsteacs_mid'),
  },

  nsteacs_high: {
    id: 'nsteacs_high', title: '🔴 NSTE-ACS 高リスク',
    result: {
      severity: 'critical',
      title: 'NSTE-ACS 高リスク — 24時間以内の早期侵襲的戦略',
      actions: [
        'アスピリン + P2Y12阻害薬（DAPT）',
        '抗凝固療法（ヘパリン）',
        '硝酸薬（血圧許容範囲で）',
        'β遮断薬（禁忌なければ）',
        '循環器コンサルト → 24h以内CAG',
      ],
      workup: ['連続トロポニン（0h, 3h）', '心エコー', '胸部X線', 'BNP/NT-proBNP', 'CBC・凝固・肝腎・電解質・HbA1c・脂質'],
      disposition: 'CCU/循環器病棟',
      pitfall: '高齢女性・糖尿病患者は非典型的症状（呼吸困難・嘔気のみ）に注意',
    },
  },

  nsteacs_mid: {
    id: 'nsteacs_mid', title: '🟡 NSTE-ACS 中リスク',
    result: {
      severity: 'urgent',
      title: 'NSTE-ACS 中リスク — 入院経過観察 + 連続トロポニン',
      actions: [
        'アスピリン投与',
        '連続トロポニン（0h, 3h, 必要時6h）',
        '連続心電図モニター',
        'トロポニン陽性化 or 再増悪 → 高リスクへ格上げ',
      ],
      workup: ['連続トロポニン', '心エコー', '胸部X線', '運動負荷試験（退院前/外来）'],
      disposition: '循環器病棟 or 救急観察室',
      pitfall: '「0h/3hトロポニン陰性」でも6h再検が必要な場合あり。高感度トロポニンではカットオフに注意',
    },
  },

  nsteacs_low: {
    id: 'nsteacs_low', title: '🟢 NSTE-ACS 低リスク',
    result: {
      severity: 'low',
      title: 'HEART score 低リスク — 外来フォロー可',
      actions: [
        '2回目トロポニン陰性を確認',
        '他の致死的疾患（PE・解離）の除外を忘れずに',
        'アスピリン処方、循環器外来紹介',
        '再増悪時の受診指示',
      ],
      workup: ['トロポニン 2回陰性確認', '帰宅前胸部X線'],
      disposition: '帰宅（循環器外来フォロー）',
      pitfall: 'HEART 0-3でも2週間以内のMACE 1-2%。再来院の指示を確実に',
    },
  },

  pe_suspect: {
    id: 'pe_suspect', title: 'Step 3: 肺塞栓症（PE）疑い',
    desc: '右心負荷パターン → PE疑い。Wells PE scoreでリスク層別化し、D-dimer or 造影CTを判断。',
    choices: [
      { label: 'Wells PE ≧5（PE likely）or 高度疑い', value: 'likely', icon: '🔴', danger: true },
      { label: 'Wells PE <5（PE unlikely）', value: 'unlikely', icon: '🟡' },
    ],
    next: v => v === 'likely' ? 'pe_likely' : 'pe_unlikely',
  },

  pe_likely: {
    id: 'pe_likely', title: '🔴 PE likely（Wells≧5）→ 造影CT',
    result: {
      severity: 'critical',
      title: 'PE likely — D-dimer不要、直接造影CTへ',
      actions: [
        '造影CT（CTPA）オーダー',
        'ヘパリン（UFH or LMWH）— CTの結果を待たず開始可',
        '血行動態不安定 → t-PA / カテーテル治療 / 外科的血栓除去',
        'sBP<90持続 → massive PE → 線溶療法検討',
        '右心不全徴候 → submassive PE → 循環器コンサルト',
      ],
      workup: ['造影CT（CTPA）', '心エコー（RV拡大・D-shape）', 'トロポニン・BNP', '下肢静脈エコー', '血液ガス', 'D-dimer（不要だが参考値として）'],
      disposition: 'ICU（massive）/ 循環器病棟（submassive）/ 一般病棟',
      pitfall: '妊婦: CTは可だが被曝を説明。腎機能障害: 造影剤リスク評価。GFR<30なら換気血流シンチ考慮',
    },
  },

  pe_unlikely: {
    id: 'pe_unlikely', title: '🟡 PE unlikely（Wells<5）→ D-dimer',
    result: {
      severity: 'moderate',
      title: 'PE unlikely — D-dimerで除外を試みる',
      actions: [
        'D-dimer測定（年齢調整カットオフの適用を検討）',
        'D-dimer陰性 → PE除外（感度95%以上）',
        'D-dimer陽性 → 造影CT（CTPA）へ',
        'PERC criteria全て陰性なら D-dimerすら不要（超低リスク）',
      ],
      workup: ['D-dimer', '陽性なら造影CT'],
      disposition: 'D-dimer陰性 → 帰宅可 / 陽性 → CT結果次第',
      pitfall: 'D-dimerは非特異的（感染・炎症・悪性腫瘍・妊娠・術後で上昇）。臨床的にPE疑いが強ければD-dimer陰性でもCT考慮',
    },
  },

  killer5: {
    id: 'killer5', title: 'Step 3: Killer Chest Pain 5疾患のスクリーニング',
    desc: '心電図が正常/非特異的でも、致死的疾患は除外が必要。病歴・身体所見から疑う疾患を選択。',
    choices: [
      { label: '突然発症の激痛 + 血圧左右差 + 背部痛/移動する痛み → 大動脈解離疑い', value: 'dissection', icon: '🔴', danger: true },
      { label: '呼吸困難 + 片側呼吸音低下 + 皮下気腫 → 気胸疑い', value: 'pneumothorax', icon: '🫁' },
      { label: '頸静脈怒張 + 低血圧 + 心音微弱 → 心タンポナーデ疑い', value: 'tamponade', icon: '❤️', danger: true },
      { label: 'DVTリスク + 呼吸困難 + 頻脈 → PE疑い（心電図非典型）', value: 'pe', icon: '🫁' },
      { label: 'いずれも該当しない → ACS以外の鑑別へ', value: 'other', icon: '📋' },
    ],
    next: v => ({ dissection: 'dissection', pneumothorax: 'pneumothorax', tamponade: 'tamponade', pe: 'pe_suspect', other: 'non_killer' }[v] || 'non_killer'),
  },

  dissection: {
    id: 'dissection', title: '🔴 急性大動脈解離疑い',
    result: {
      severity: 'critical',
      title: '急性大動脈解離 — Stanford A型なら緊急手術',
      actions: [
        '疼痛コントロール（モルヒネ/フェンタニル）',
        '降圧+心拍数管理（β遮断薬IV → 降圧薬追加。目標値は施設プロトコル参照）',
        '造影CT（大動脈全長）',
        'Stanford A型 → 心臓外科緊急コンサルト → 緊急手術',
        'Stanford B型 → 降圧管理でICU',
        '合併症チェック: 冠動脈閉塞（STEMI合併）、心タンポナーデ、腸管虚血、下肢虚血',
      ],
      workup: ['造影CT（大動脈全長）', '心エコー（AR・心嚢液）', '胸部X線（縦隔拡大）', 'D-dimer（高値）', 'CBC・凝固・腎機能・電解質・クロスマッチ'],
      disposition: 'ICU → A型は緊急手術',
      pitfall: '抗凝固/抗血小板薬の投与は解離を確認する前に行わない！ ACSとの鑑別が最重要。解離にヘパリン→致死的',
    },
  },

  pneumothorax: {
    id: 'pneumothorax', title: '🫁 気胸疑い',
    result: {
      severity: 'urgent',
      title: '気胸 — 緊張性なら即座に脱気',
      actions: [
        '緊張性気胸の徴候（低血圧・頸静脈怒張・気管偏位）→ 胸腔穿刺（第2肋間鎖骨中線 or 第5肋間前腋窩線）',
        '酸素投与',
        '胸部X線（確認）',
        '大量 or 症状あり → 胸腔ドレーン（トロッカー/チェストチューブ）',
        '小量 + 症状軽微 → 経過観察 + 6h後X線',
      ],
      workup: ['胸部X線（立位吸気）', '呼吸困難強い場合: 血液ガス', 'エコー（M-mode: lung sliding消失）'],
      disposition: '胸腔ドレーン → 入院 / 小量 → 観察室6h → 帰宅可',
      pitfall: '緊張性気胸はX線を撮る前に脱気。臨床診断で治療開始。COPD患者のブラ vs 気胸の鑑別にCT',
    },
  },

  tamponade: {
    id: 'tamponade', title: '❤️ 心タンポナーデ疑い',
    result: {
      severity: 'critical',
      title: '心タンポナーデ — 心嚢穿刺 or 外科的ドレナージ',
      actions: [
        '急速輸液（前負荷を維持）',
        'ベッドサイド心エコー（心嚢液 + 右室拡張期虚脱 + IVC拡張）',
        '心嚢穿刺（エコーガイド下）',
        '循環器/心臓外科コンサルト',
        '陽圧換気は可能な限り避ける（前負荷↓で急変リスク）',
      ],
      workup: ['心エコー（最重要）', '心電図（低電位・電気的交互脈）', '胸部X線（心拡大）', 'CBC・凝固・腎機能'],
      disposition: 'ICU/CCU',
      pitfall: '外傷性: 開胸術の適応。内科的: 原因検索（悪性腫瘍・尿毒症・結核・SLE・ウイルス性心膜炎）。利尿薬は禁忌',
    },
  },

  non_killer: {
    id: 'non_killer', title: 'Step 4: Killer 5疾患以外の鑑別',
    desc: '致死的疾患を除外したら、他の原因を鑑別。病歴・身体所見から最も疑わしい病態を選択。',
    choices: [
      { label: '食事関連・心窩部痛・制酸薬で改善 → 消化器疾患', value: 'gi', icon: '🍽️' },
      { label: '体動/深呼吸で増悪・圧痛あり → 筋骨格/胸壁痛', value: 'msk', icon: '💪' },
      { label: '吸気時痛 + 前傾位で軽減 + 摩擦音 → 心膜炎', value: 'pericarditis', icon: '❤️' },
      { label: '精神的ストレス + 過換気 + 四肢しびれ → 不安/パニック', value: 'anxiety', icon: '😰' },
    ],
    next: v => `non_killer_${v}`,
  },

  non_killer_gi: {
    id: 'non_killer_gi', title: '🍽️ 消化器疾患の疑い',
    result: {
      severity: 'low',
      title: '消化器疾患（GERD・食道痙攣・胃炎・消化性潰瘍）',
      actions: [
        'ACSの除外を再確認（消化器疾患に似たACSは多い）',
        'PPI試験投与',
        '腹部診察・上腹部圧痛の評価',
        '症状持続 → 消化器内科フォロー',
      ],
      workup: ['トロポニン（必ず）', '腹部X線', '必要時: 上部消化管内視鏡'],
      disposition: '帰宅（消化器外来フォロー）',
      pitfall: '「逆流で説明がつく」で思考停止しない。下壁梗塞は心窩部痛・嘔気が主症状のことがある',
    },
  },

  non_killer_msk: {
    id: 'non_killer_msk', title: '💪 筋骨格系・胸壁痛',
    result: {
      severity: 'low',
      title: '筋骨格系胸痛 — 除外診断',
      actions: [
        'ACS/PEの除外を再確認',
        'NSAIDs処方',
        '再来院の指示（安静時痛・呼吸困難出現時）',
      ],
      workup: ['トロポニン（必ず）', '心電図（異常なし確認）'],
      disposition: '帰宅',
      pitfall: '肋骨の圧痛があってもACSは除外できない。帯状疱疹（皮疹出現前の胸痛）も忘れずに',
    },
  },

  non_killer_pericarditis: {
    id: 'non_killer_pericarditis', title: '❤️ 急性心膜炎',
    result: {
      severity: 'moderate',
      title: '急性心膜炎 — 心筋炎合併に注意',
      actions: [
        'NSAIDs + コルヒチン（用量は添付文書・施設プロトコル参照）',
        '心筋炎合併の除外（トロポニン上昇 + 壁運動異常）',
        '心嚢液貯留 → 心タンポナーデに移行しないか経過観察',
        '原因検索（ウイルス性が最多）',
      ],
      workup: ['心電図（広範なST上昇・PR低下）', '心エコー（心嚢液）', 'トロポニン・CRP・ESR', '胸部X線'],
      disposition: '心筋炎合併 → 入院 / 単純な心膜炎 → 外来フォロー可',
      pitfall: 'びまん性ST上昇をSTEMIと誤認しない。PR低下は心膜炎に比較的特異的。発熱+トロポニン上昇=心筋炎除外必須',
    },
  },

  non_killer_anxiety: {
    id: 'non_killer_anxiety', title: '😰 不安・パニック発作',
    result: {
      severity: 'low',
      title: '不安/パニック発作 — あくまで除外診断',
      actions: [
        'ACS・PE・気胸の除外を完了してから診断',
        '過換気 → ペーパーバッグ法は推奨されない',
        '安静・環境調整',
        '精神科/心療内科フォロー紹介',
      ],
      workup: ['心電図', 'トロポニン', '血液ガス（呼吸性アルカローシス確認）'],
      disposition: '帰宅（フォロー紹介）',
      pitfall: '「若い女性 = パニック」で思考停止しない。PE・気胸・WPW・褐色細胞腫の除外を。初回パニック発作の診断は特に慎重に',
    },
  },
}

/* ────────── UI コンポーネント ────────── */
const severityConfig = {
  critical: { bg: 'bg-[#FDECEA]', border: 'border-[#D93025]', text: 'text-[#B71C1C]', badge: '🔴 緊急' },
  urgent: { bg: 'bg-[#FFF8E1]', border: 'border-[#F9A825]', text: 'text-[#E65100]', badge: '🟡 準緊急' },
  moderate: { bg: 'bg-[#E8F0FE]', border: 'border-[#4285F4]', text: 'text-[#1565C0]', badge: '🔵 中等度' },
  low: { bg: 'bg-[#E8F5E9]', border: 'border-[#2E7D32]', text: 'text-[#1B5E20]', badge: '🟢 低リスク' },
}

export default function ChestPainERPage() {
  const [path, setPath] = useState<{ nodeId: string; selected?: string }[]>([{ nodeId: 'start' }])

  const handleChoice = (nodeId: string, value: string) => {
    const node = tree[nodeId]
    if (!node?.next) return
    const nextId = node.next(value)
    // Find current node in path and truncate + update
    const idx = path.findIndex(p => p.nodeId === nodeId)
    const newPath = path.slice(0, idx + 1)
    newPath[idx] = { nodeId, selected: value }
    newPath.push({ nodeId: nextId })
    setPath(newPath)
  }

  const reset = () => setPath([{ nodeId: 'start' }])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* パンくず */}
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-ac">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href="/tools" className="hover:text-ac">臨床ツール</Link>
        <span className="mx-2">›</span>
        <Link href="/tools/er" className="hover:text-ac">ER対応</Link>
        <span className="mx-2">›</span>
        <span>胸痛</span>
      </nav>

      {/* ヘッダー */}
      <header className="mb-6">
        <span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span>
        <h1 className="text-2xl font-bold text-tx mb-1">胸痛 ER対応ツリー</h1>
        <p className="text-sm text-muted">
          Killer chest pain 5疾患（ACS・PE・大動脈解離・緊張性気胸・心タンポナーデ）を系統的に除外。
          選択肢をクリックして進むインタラクティブフロー。
        </p>
      </header>

      {/* 免責バナー（ページ冒頭） */}
      <ERDisclaimerBanner />

      {/* リセット */}
      {path.length > 1 && (
        <button onClick={reset} className="text-sm text-ac hover:underline mb-4 flex items-center gap-1">
          ↺ 最初からやり直す
        </button>
      )}

      {/* ツリー本体 */}
      <div className="space-y-4">
        {path.map((p, i) => {
          const node = tree[p.nodeId]
          if (!node) return null

          // 結果ノード
          if (node.result) {
            const cfg = severityConfig[node.result.severity]
            return (
              <div key={i} className={`rounded-xl p-5 border-l-4 ${cfg.bg} ${cfg.border}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-sm font-bold ${cfg.text}`}>{cfg.badge}</span>
                </div>
                <h3 className={`text-lg font-bold mb-3 ${cfg.text}`}>{node.result.title}</h3>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-tx mb-1">考慮すべき対応（施設プロトコル優先）</h4>
                    <ol className="text-sm text-tx/90 space-y-1">
                      {node.result.actions.map((a, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-muted font-mono text-xs mt-0.5">{j + 1}.</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-tx mb-1">検査オーダー</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {node.result.workup.map((w, j) => (
                        <span key={j} className="text-xs bg-white/60 text-tx px-2 py-1 rounded-lg">{w}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-tx mb-1">Disposition</h4>
                    <p className="text-sm text-tx/90">{node.result.disposition}</p>
                  </div>

                  {node.result.pitfall && (
                    <div className="bg-wnl border border-wnb rounded-lg p-3 mt-2">
                      <p className="text-sm font-bold text-wn mb-1">⚠️ ピットフォール</p>
                      <p className="text-sm text-wn">{node.result.pitfall}</p>
                    </div>
                  )}
                  <ERResultCaution />
                </div>
              </div>
            )
          }

          // 選択ノード
          const isCompleted = p.selected !== undefined
          return (
            <div key={i} className={`rounded-xl p-5 border ${isCompleted ? 'bg-s1/50 border-br/50' : 'bg-s0 border-br'}`}>
              <h3 className={`text-base font-bold mb-1 ${isCompleted ? 'text-muted' : 'text-tx'}`}>{node.title}</h3>
              {node.desc && <p className={`text-sm mb-3 ${isCompleted ? 'text-muted/70' : 'text-muted'}`}>{node.desc}</p>}

              <div className="space-y-2">
                {node.choices?.map(c => {
                  const isSelected = p.selected === c.value
                  const isOther = isCompleted && !isSelected
                  return (
                    <button key={c.value} onClick={() => !isCompleted && handleChoice(node.id, c.value)}
                      disabled={isCompleted && !isSelected}
                      className={`w-full text-left p-3 rounded-lg text-sm transition-all flex items-start gap-2
                        ${isSelected
                          ? 'bg-ac/10 border-2 border-ac text-ac font-medium'
                          : isOther
                            ? 'bg-s1/30 border border-br/30 text-muted/50 cursor-not-allowed'
                            : c.danger
                              ? 'bg-dnl/50 border border-dnb/50 text-tx hover:bg-dnl hover:border-dnb cursor-pointer'
                              : 'bg-s0 border border-br text-tx hover:bg-acl hover:border-ac/30 cursor-pointer'
                        }`}
                    >
                      {c.icon && <span className="mt-0.5">{c.icon}</span>}
                      <span>{c.label}</span>
                      {isSelected && <span className="ml-auto text-ac">✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* 関連スコア */}
      <section className="mt-8 mb-8">
        <h2 className="text-lg font-bold mb-3">関連スコア・ツール</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { slug: 'heart-score', name: 'HEART score' },
            { slug: 'timi', name: 'TIMI Risk' },
            { slug: 'grace', name: 'GRACE score' },
            { slug: 'wells-pe', name: 'Wells PE' },
            { slug: 'perc', name: 'PERC Rule' },
            { slug: 'wells-dvt', name: 'Wells DVT' },
            { slug: 'qtc', name: 'QTc' },
            { slug: 'aa-gradient', name: 'A-aDO₂' },
          ].map(t => (
            <Link key={t.slug} href={`/tools/calc/${t.slug}`}
              className="text-sm bg-s1 text-tx px-3 py-1.5 rounded-lg hover:bg-acl hover:text-ac transition-colors">
              {t.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 免責（詳細版） */}
      <ERDisclaimerFooter />

      {/* SEO解説 */}
      <section className="space-y-4 text-sm text-muted mb-8">
        <h2 className="text-base font-bold text-tx">胸痛の救急対応について</h2>
        <p>
          胸痛は救急外来で最も頻度の高い主訴の一つです。致死的疾患（killer chest pain）として、
          急性冠症候群（ACS）、肺塞栓症（PE）、急性大動脈解離、緊張性気胸、心タンポナーデの5疾患を
          系統的に除外することが最優先です。
        </p>
        <p>
          ABCDEアプローチで安定化を確認した後、12誘導心電図を10分以内に記録します。
          ST上昇はSTEMIを強く示唆し、Door-to-Balloon time 90分以内の緊急再灌流療法が必要です。
          ST低下・T波陰転化の場合はNSTE-ACSとしてHEART scoreによるリスク層別化が有用です。
        </p>
        <h3 className="font-bold text-tx">HEART scoreの要素</h3>
        <p>History（病歴）、ECG（心電図）、Age（年齢）、Risk factors（リスク因子）、Troponin（トロポニン）の5項目で0-10点。7点以上は高リスク、4-6点は中リスク、0-3点は低リスクに分類されます。</p>
      </section>

      {/* 参考文献 */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">参考文献</h2>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2">
          <li>Amsterdam EA et al. 2014 AHA/ACC Guideline for NSTE-ACS. JACC 2014;64:e139-e228</li>
          <li>Ibanez B et al. 2017 ESC STEMI Guidelines. Eur Heart J 2018;39:119-177</li>
          <li>Konstantinides SV et al. 2019 ESC PE Guidelines. Eur Heart J 2020;41:543-603</li>
          <li>Six AJ et al. The HEART score. Neth Heart J 2008;16:191-196</li>
          <li>Wells PS et al. Derivation of a simple clinical model to categorize PE. Thromb Haemost 2000;83:416-420</li>
        </ol>
      </section>
    </div>
  )
}
