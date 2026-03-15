'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ERDisclaimerBanner, ERDisclaimerFooter, ERResultCaution } from '@/components/tools/ERDisclaimer'

interface Choice { label: string; value: string; icon?: string; danger?: boolean }
interface TreeNode {
  id: string; title: string; desc?: string
  choices?: Choice[]
  result?: { severity: 'critical' | 'urgent' | 'moderate' | 'low'; title: string; actions: string[]; workup: string[]; disposition: string; pitfall?: string }
  next?: (selected: string) => string
}

const tree: Record<string, TreeNode> = {
  start: {
    id: 'start', title: 'Step 1: ABCDEアプローチ + 緊急手術適応の判断',
    desc: 'バイタルサイン確認 + 腹膜刺激徴候（筋性防御・反跳痛・板状硬）の有無を最初に評価。',
    choices: [
      { label: '血行動態不安定（sBP<90 / HR>120 / 冷汗）', value: 'unstable', icon: '🚨', danger: true },
      { label: '腹膜刺激徴候あり（板状硬 / 広範な筋性防御）', value: 'peritonitis', icon: '🔴', danger: true },
      { label: '安定 + 腹膜刺激徴候なし → 系統的鑑別へ', value: 'stable', icon: '✅' },
    ],
    next: v => ({ unstable: 'unstable', peritonitis: 'peritonitis', stable: 'special_check' }[v] || 'special_check'),
  },

  unstable: {
    id: 'unstable', title: '🚨 血行動態不安定の腹痛 — 蘇生 + 緊急手術評価',
    result: {
      severity: 'critical',
      title: '血行動態不安定 — 腹腔内出血 or 敗血症性ショック',
      actions: [
        '大口径ルート2本確保 → 急速輸液（生食 or 乳酸リンゲル）',
        'クロスマッチ・緊急輸血準備（O型RhD陰性）',
        'FAST（腹腔内液体貯留の確認）',
        '外科コンサルト（腹腔内出血疑い → 緊急開腹）',
        '腹部大動脈瘤破裂（AAA）: 高齢 + 突然の腹痛/背部痛 + ショック → 血管外科緊急',
        '子宮外妊娠破裂（妊娠可能年齢女性）: 尿妊娠反応 → 産婦人科緊急',
        '上腸間膜動脈閉塞（SMA）: Af + 激痛 + 身体所見に乏しい → 造影CT',
      ],
      workup: ['FAST', 'CBC・凝固・クロスマッチ', '尿妊娠反応（女性）', '乳酸', '血液ガス', '造影CT（安定化できたら）'],
      disposition: '手術室 or ICU',
      pitfall: 'AAA破裂は後腹膜に被覆されると一時的に安定するが再破裂する（contained rupture）。「安定した」と思って安心しない',
    },
  },

  peritonitis: {
    id: 'peritonitis', title: '🔴 腹膜刺激徴候あり — 外科緊急評価',
    desc: '汎発性腹膜炎の所見がある場合、消化管穿孔・絞扼性腸閉塞・虫垂炎穿孔などを想定。',
    choices: [
      { label: '上腹部主体 + free air疑い → 消化管穿孔', value: 'perforation', icon: '💨', danger: true },
      { label: '嘔吐 + 腸蠕動音消失 + 腹部膨満 → 絞扼性イレウス', value: 'strangulation', icon: '🔄', danger: true },
      { label: '右下腹部 + 発熱 → 虫垂炎穿孔/膿瘍', value: 'appendicitis', icon: '📍' },
      { label: '部位が不明確/びまん性 → 造影CTで評価', value: 'ct_first', icon: '🔍' },
    ],
    next: v => `peritonitis_${v}`,
  },

  peritonitis_perforation: {
    id: 'peritonitis_perforation', title: '💨 消化管穿孔疑い',
    result: {
      severity: 'critical',
      title: '消化管穿孔 — 緊急手術',
      actions: [
        '絶飲食 + 経鼻胃管',
        '広域抗菌薬（CTRX + MNZ or TAZ/PIPC or MEPM）',
        '腹部X線（立位: 横隔膜下free air）+ 腹部CT',
        '外科コンサルト → 緊急手術',
        '上部消化管穿孔: 大網被覆が間に合っている場合は保存的治療の余地あり',
      ],
      workup: ['腹部X線（立位 + 臥位）', '腹部CT（free air・穿孔部位同定）', 'CBC・CRP・血液ガス・乳酸'],
      disposition: '手術室',
      pitfall: '腹部X線でfree airが見えない穿孔もある（後腹膜穿孔、被覆穿孔）。CTの感度は高い。NSAIDs+ステロイド併用でリスク↑',
    },
  },

  peritonitis_strangulation: {
    id: 'peritonitis_strangulation', title: '🔄 絞扼性イレウス疑い',
    result: {
      severity: 'critical',
      title: '絞扼性腸閉塞 — 6時間以内に手術',
      actions: [
        '絶飲食 + 経鼻胃管（減圧）',
        '急速輸液（脱水補正）',
        '造影CT（closed loop・腸管壁造影不良・腸間膜脂肪織混濁）',
        '外科緊急コンサルト',
        '広域抗菌薬（bacterial translocation予防）',
      ],
      workup: ['造影CT（最重要）', 'CBC・CRP・乳酸', '血液ガス（代謝性アシドーシス）', '電解質（嘔吐によるアルカローシスもあり）'],
      disposition: '手術室',
      pitfall: '絞扼性の所見: ①持続痛（間欠痛→持続痛に変化）②腸蠕動音消失 ③腹膜刺激徴候 ④乳酸上昇 ⑤造影不良。5つ揃わなくても疑いがあれば外科相談',
    },
  },

  peritonitis_appendicitis: {
    id: 'peritonitis_appendicitis', title: '📍 虫垂炎穿孔/膿瘍',
    result: {
      severity: 'urgent',
      title: '虫垂炎穿孔 — 手術 or 膿瘍ドレナージ',
      actions: [
        '造影CT（穿孔・膿瘍の有無、範囲評価）',
        '抗菌薬（CTRX + MNZ or TAZ/PIPC）',
        '穿孔 + 汎発性腹膜炎 → 緊急手術（虫垂切除 + 腹腔洗浄）',
        '限局性膿瘍 → CTガイド下ドレナージ + 抗菌薬 → 待機的虫垂切除（interval appendectomy）',
      ],
      workup: ['造影CT', 'CBC・CRP', '尿検査（尿路結石との鑑別）', '尿妊娠反応（女性）'],
      disposition: '手術室 or 外科病棟',
      pitfall: 'Alvarado score ≧7 → 虫垂炎の可能性高い。ただしscore低くても高齢者・妊婦は非典型的。妊婦の虫垂は上方へ偏位',
    },
  },

  peritonitis_ct_first: {
    id: 'peritonitis_ct_first', title: '🔍 造影CTで精査',
    result: {
      severity: 'urgent',
      title: '広範な腹膜刺激徴候 — 造影CTで原因検索',
      actions: [
        '造影CT（動脈相+門脈相+平衡相）',
        '外科コンサルト（手術適応の判断）',
        '広域抗菌薬先行投与',
        '輸液・疼痛管理（鎮痛は診断を遅らせない: モルヒネ/フェンタニル可）',
      ],
      workup: ['造影CT', 'CBC・CRP・乳酸', '血液ガス', '凝固', '尿検査'],
      disposition: 'CT結果次第 → 手術 or ICU or 外科病棟',
      pitfall: '「鎮痛薬を使うと所見がマスクされる」は過去の迷信。適切な鎮痛はむしろ診察精度を上げる',
    },
  },

  special_check: {
    id: 'special_check', title: 'Step 2: 見逃し厳禁の特殊状況チェック',
    desc: '系統的鑑別の前に、特殊な患者背景を確認。妊娠可能年齢の女性・高齢者・免疫不全は別の鑑別を。',
    choices: [
      { label: '妊娠可能年齢の女性（月経歴・性交歴あり）', value: 'female', icon: '♀️' },
      { label: '高齢者（65歳以上）/ 抗凝固薬内服中', value: 'elderly', icon: '👴' },
      { label: '該当しない → 部位別鑑別へ', value: 'location', icon: '📋' },
    ],
    next: v => ({ female: 'female', elderly: 'elderly', location: 'location' }[v] || 'location'),
  },

  female: {
    id: 'female', title: '♀️ 妊娠可能年齢の女性 — 必ず妊娠反応を確認',
    desc: '子宮外妊娠・卵巣茎捻転・卵巣出血は見逃すと致命的。尿妊娠反応は全例で実施。',
    choices: [
      { label: '妊娠反応 陽性 → 異所性妊娠（子宮外妊娠）疑い', value: 'ectopic', icon: '🚨', danger: true },
      { label: '妊娠反応 陰性 + 片側下腹部痛 → 卵巣茎捻転/卵巣出血', value: 'ovarian', icon: '🔴' },
      { label: '妊娠反応 陰性 + 骨盤内に異常なし → 部位別鑑別へ', value: 'location', icon: '📋' },
    ],
    next: v => ({ ectopic: 'ectopic', ovarian: 'ovarian', location: 'location' }[v] || 'location'),
  },

  ectopic: {
    id: 'ectopic', title: '🚨 異所性妊娠（子宮外妊娠）',
    result: {
      severity: 'critical',
      title: '異所性妊娠 — 破裂リスク → 産婦人科緊急',
      actions: [
        '経腟エコー（子宮内に胎嚢なし + 付属器腫瘤 + Douglas窩液体貯留）',
        'β-hCG定量',
        '産婦人科緊急コンサルト',
        '破裂 + ショック → 緊急手術（卵管切除）',
        '未破裂 + β-hCG低値 → MTX（メトトレキサート）保存的治療の余地',
        '大量輸液 + クロスマッチ準備',
      ],
      workup: ['経腟エコー', 'β-hCG', 'CBC・Hb', 'Rh型（Rh陰性なら抗D免疫グロブリン）', '凝固'],
      disposition: '手術室（破裂）/ 産婦人科病棟（未破裂）',
      pitfall: 'β-hCG<1500-2000でエコーで見えないことがある（too early）→ 48h後にβ-hCG再検。Rh陰性には必ず抗D免疫グロブリン投与',
    },
  },

  ovarian: {
    id: 'ovarian', title: '🔴 卵巣茎捻転 / 卵巣出血',
    result: {
      severity: 'urgent',
      title: '卵巣茎捻転 or 卵巣出血',
      actions: [
        '経腟/経腹エコー（卵巣腫大・Doppler血流途絶→捻転、Douglas窩液体貯留→出血）',
        '造影CT（卵巣の造影不良→捻転の間接所見）',
        '茎捻転: 産婦人科コンサルト → 緊急腹腔鏡（6h以内に捻転解除で卵巣温存率↑）',
        '卵巣出血: 軽症→保存的（輸液+経過観察）、重症→手術',
      ],
      workup: ['経腟/経腹エコー', '造影CT', 'CBC・Hb', '尿妊娠反応（再確認）'],
      disposition: '手術室（捻転）/ 産婦人科病棟（出血）',
      pitfall: '卵巣茎捻転は嘔吐を伴うことが多い（迷走神経反射）。若年女性の急性腹症で嘔吐→捻転を疑う',
    },
  },

  elderly: {
    id: 'elderly', title: '👴 高齢者の腹痛 — 典型的所見が乏しい',
    result: {
      severity: 'urgent',
      title: '高齢者の急性腹症 — 閾値を下げて画像検査',
      actions: [
        '造影CT（閾値を低く: 高齢者は身体所見が乏しい）',
        '腹部大動脈瘤（AAA）: 拍動性腫瘤の触診、エコー',
        '腸間膜虚血（SMA閉塞/NOMI）: Af + 激痛 + 理学所見乏しい → 造影CT動脈相',
        '急性胆嚢炎/胆管炎: 高齢者は Murphy陰性でも否定できない',
        '大腸憩室穿孔: 左下腹部痛 + 発熱',
        '抗凝固薬内服中 → 腸腰筋血腫・腹壁血腫・腹腔内出血',
      ],
      workup: ['造影CT', 'CBC・CRP', '乳酸（腸管虚血）', '心電図（Af→SMA塞栓）', '凝固・PT-INR'],
      disposition: 'CT結果次第',
      pitfall: '高齢者は痛みの訴えが弱く、発熱も乏しく、白血球も上がりにくい。「大したことなさそう」が最も危険。造影CTの閾値を下げる',
    },
  },

  location: {
    id: 'location', title: 'Step 3: 痛みの部位から鑑別',
    desc: '最も痛い部位をクリック。部位別の鑑別疾患と検査プランを表示。',
    choices: [
      { label: '右上腹部（RUQ）→ 胆石・胆嚢炎・胆管炎・肝膿瘍', value: 'ruq', icon: '↗️' },
      { label: '心窩部（上腹部正中）→ 胃十二指腸・膵炎・ACS', value: 'epigastric', icon: '⬆️' },
      { label: '左上腹部（LUQ）→ 脾梗塞・膵尾部・腎結石', value: 'luq', icon: '↖️' },
      { label: '右下腹部（RLQ）→ 虫垂炎・卵巣・尿管結石', value: 'rlq', icon: '↘️' },
      { label: '下腹部正中 → 膀胱・子宮・直腸', value: 'suprapubic', icon: '⬇️' },
      { label: '左下腹部（LLQ）→ 憩室炎・卵巣・尿管結石', value: 'llq', icon: '↙️' },
      { label: 'びまん性 / 部位不明確', value: 'diffuse', icon: '🔘' },
    ],
    next: v => `loc_${v}`,
  },

  loc_ruq: {
    id: 'loc_ruq', title: '↗️ 右上腹部（RUQ）の鑑別',
    result: {
      severity: 'moderate',
      title: '右上腹部痛 — 胆道疾患が最多',
      actions: [
        '腹部エコー（胆石・胆嚢壁肥厚・総胆管拡張・Murphy sign）',
        '急性胆嚢炎（TG18基準: Murphy+発熱+白血球↑+エコー所見）→ 外科コンサルト + 抗菌薬',
        '急性胆管炎（Charcot三徴: 腹痛+発熱+黄疸）→ 緊急ERCP/ドレナージ',
        'Reynolds五徴（+ショック+意識障害）→ 重症胆管炎 → ICU + 緊急ドレナージ',
        '肝膿瘍: 持続する発熱+RUQ痛 → 造影CT + ドレナージ',
      ],
      workup: ['腹部エコー（第一選択）', 'CBC・CRP', '肝機能（AST/ALT/ALP/γ-GT/T-Bil）', '膵酵素（リパーゼ）', '血液培養（胆管炎疑い）'],
      disposition: '胆嚢炎 → 外科病棟 / 胆管炎 → ERCP後入院 / 胆石発作のみ → 帰宅+消化器外来',
      pitfall: 'Fitz-Hugh-Curtis症候群（クラミジア肝周囲炎）は若年女性のRUQ痛。右下葉肺炎もRUQ痛に見える。心窩部〜RUQの痛み→ACS除外を忘れずに',
    },
  },

  loc_epigastric: {
    id: 'loc_epigastric', title: '⬆️ 心窩部（上腹部正中）の鑑別',
    result: {
      severity: 'moderate',
      title: '心窩部痛 — 消化管+膵臓+ACS除外',
      actions: [
        '12誘導心電図（ACS除外が最優先: 下壁梗塞は心窩部痛として受診）',
        'トロポニン',
        'リパーゼ（膵炎: 正常上限の3倍以上で診断）',
        '腹部エコー（胆石性膵炎の除外）',
        '消化性潰瘍: PPI + H. pylori検査',
        '急性膵炎: 絶飲食 + 輸液 + 疼痛管理 + 重症度判定（厚生労働省基準/Ranson/BISAP）',
      ],
      workup: ['12誘導心電図', 'トロポニン', 'リパーゼ（アミラーゼより特異度↑）', '腹部エコー', 'CBC・CRP・肝機能', '造影CT（重症膵炎疑い時）'],
      disposition: '膵炎 → 入院 / ACS疑い → 循環器 / 軽症 → 帰宅+消化器外来',
      pitfall: '心窩部痛でACSを見逃すのは最も多いピットフォールの一つ。高齢者・糖尿病は特に非典型的。必ず心電図を',
    },
  },

  loc_luq: {
    id: 'loc_luq', title: '↖️ 左上腹部（LUQ）の鑑別',
    result: {
      severity: 'moderate',
      title: '左上腹部痛 — 頻度は低いが重篤な原因あり',
      actions: [
        '脾梗塞/脾破裂: 造影CT（外傷歴・血液疾患・感染性心内膜炎がリスク）',
        '膵尾部病変: リパーゼ + 造影CT',
        '左尿管結石: 尿検査（血尿）+ CT',
        '左下葉肺炎: 胸部X線',
        '胃潰瘍: 内視鏡',
      ],
      workup: ['造影CT', 'CBC・CRP', 'リパーゼ', '尿検査', '胸部X線'],
      disposition: '原因に応じて',
      pitfall: 'LUQ痛は頻度が低い分、「何も見つからない」ことがある。造影CTのハードルを下げて',
    },
  },

  loc_rlq: {
    id: 'loc_rlq', title: '↘️ 右下腹部（RLQ）の鑑別',
    result: {
      severity: 'moderate',
      title: '右下腹部痛 — 虫垂炎が最多',
      actions: [
        'Alvarado score（虫垂炎スコア）で評価',
        '造影CT（虫垂腫大>6mm・壁肥厚・周囲脂肪織混濁・糞石）',
        '虫垂炎 → 外科コンサルト（腹腔鏡下虫垂切除）',
        '尿管結石: 片側腰背部〜下腹部の放散痛 + 血尿 → 単純CT',
        '回盲部憩室炎: CTで鑑別',
        'Meckel憩室: 若年者の下血+腹痛',
        '女性: 卵巣疾患・PIDを鑑別（経腟エコー）',
      ],
      workup: ['造影CT', 'CBC・CRP', '尿検査', '尿妊娠反応（女性）', 'エコー（卵巣評価: 女性）'],
      disposition: '虫垂炎 → 手術 / 結石 → 疼痛管理+帰宅',
      pitfall: '虫垂の位置は個人差が大きい（後腹膜・骨盤内・肝下面）。妊婦は虫垂が上方偏位。Crohn病の初発がRLQ痛のことも',
    },
  },

  loc_suprapubic: {
    id: 'loc_suprapubic', title: '⬇️ 下腹部正中の鑑別',
    result: {
      severity: 'moderate',
      title: '下腹部正中痛',
      actions: [
        '尿検査（膀胱炎・尿閉）',
        '腹部エコー（残尿測定・子宮/卵巣評価）',
        '尿閉: 導尿 → 原因検索（前立腺肥大・薬剤性・神経因性）',
        '膀胱炎: 抗菌薬（女性: セファレキシン or ST合剤、男性: 精査必要）',
        '女性: 子宮・卵巣疾患の除外（PID・子宮内膜症・卵巣捻転）',
      ],
      workup: ['尿検査', '腹部/経腟エコー', '尿妊娠反応（女性）', 'CBC・CRP'],
      disposition: '膀胱炎 → 帰宅 / 尿閉 → 導尿+原因検索',
      pitfall: '高齢男性の尿閉は直腸診を忘れずに。若年女性の下腹部痛+発熱→PID（骨盤内炎症性疾患）を疑い内診',
    },
  },

  loc_llq: {
    id: 'loc_llq', title: '↙️ 左下腹部（LLQ）の鑑別',
    result: {
      severity: 'moderate',
      title: '左下腹部痛 — 憩室炎が最多',
      actions: [
        '造影CT（大腸憩室炎: 壁肥厚+脂肪織混濁+膿瘍の有無）',
        '単純性憩室炎: 抗菌薬（LVFX or AMPC/CVA）+ 食事指導',
        '複雑性憩室炎（膿瘍・穿孔・瘻孔）: 外科コンサルト',
        '左尿管結石: 血尿 + 単純CT',
        '虚血性大腸炎: 高齢者 + 突然の腹痛 + 血性下痢',
        '女性: 卵巣茎捻転・卵巣出血',
      ],
      workup: ['造影CT', 'CBC・CRP', '尿検査', '便潜血（虚血性腸炎疑い時）'],
      disposition: '単純性憩室炎 → 外来/入院 / 複雑性 → 外科',
      pitfall: '若年者（<50歳）のLLQ痛で憩室炎と安易に診断しない（大腸癌の除外が必要 → 寛解後に大腸内視鏡）',
    },
  },

  loc_diffuse: {
    id: 'loc_diffuse', title: '🔘 びまん性腹痛',
    result: {
      severity: 'urgent',
      title: 'びまん性腹痛 — 重症疾患の可能性',
      actions: [
        '造影CT（全腹部: 穿孔・イレウス・腸管虚血・AAA・膵炎）',
        '腸閉塞（イレウス）: 腹部X線（鏡面像）→ CT → 保存的 vs 手術判断',
        'SMA閉塞（腸管虚血）: Af + 激痛 + 所見乏しい + 乳酸↑ → 造影CT動脈相',
        '急性膵炎: リパーゼ + CT',
        'DKA: 血糖+血液ガス+ケトン',
        '急性副腎不全: 低血圧+低Na+高K → コルチゾール測定',
        '腹部片頭痛/機能性腹痛: 全検査正常後に考慮',
      ],
      workup: ['造影CT', 'CBC・CRP・乳酸', '血液ガス', 'リパーゼ', '電解質', '血糖', '心電図（ACS除外）'],
      disposition: 'CT結果次第',
      pitfall: 'SMA閉塞は「痛みと所見の乖離」が特徴（激痛なのに腹部所見が乏しい）。DKAの腹痛は急性腹症に酷似する',
    },
  },
}

const severityConfig = {
  critical: { bg: 'bg-[#FDECEA]', border: 'border-[#D93025]', text: 'text-[#B71C1C]', badge: '🔴 緊急' },
  urgent: { bg: 'bg-[#FFF8E1]', border: 'border-[#F9A825]', text: 'text-[#E65100]', badge: '🟡 準緊急' },
  moderate: { bg: 'bg-[#E8F0FE]', border: 'border-[#4285F4]', text: 'text-[#1565C0]', badge: '🔵 中等度' },
  low: { bg: 'bg-[#E8F5E9]', border: 'border-[#2E7D32]', text: 'text-[#1B5E20]', badge: '🟢 低リスク' },
}

export default function AbdominalPainPage() {
  const [path, setPath] = useState<{ nodeId: string; selected?: string }[]>([{ nodeId: 'start' }])

  const handleChoice = (nodeId: string, value: string) => {
    const node = tree[nodeId]
    if (!node?.next) return
    const nextId = node.next(value)
    const idx = path.findIndex(p => p.nodeId === nodeId)
    const newPath = path.slice(0, idx + 1)
    newPath[idx] = { nodeId, selected: value }
    newPath.push({ nodeId: nextId })
    setPath(newPath)
  }

  const reset = () => setPath([{ nodeId: 'start' }])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-ac">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href="/tools" className="hover:text-ac">臨床ツール</Link>
        <span className="mx-2">›</span>
        <Link href="/tools/er" className="hover:text-ac">ER対応</Link>
        <span className="mx-2">›</span>
        <span>腹痛</span>
      </nav>

      <header className="mb-6">
        <span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span>
        <h1 className="text-2xl font-bold text-tx mb-1">腹痛 ER対応ツリー</h1>
        <p className="text-sm text-muted">
          緊急手術適応の判断 → 特殊状況チェック → 部位別鑑別のステップフロー。
          妊娠可能年齢女性・高齢者の見逃しやすい疾患をカバー。
        </p>
      </header>

      <ERDisclaimerBanner />

      {path.length > 1 && (
        <button onClick={reset} className="text-sm text-ac hover:underline mb-4 flex items-center gap-1">↺ 最初からやり直す</button>
      )}

      <div className="space-y-4">
        {path.map((p, i) => {
          const node = tree[p.nodeId]
          if (!node) return null

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
                        <li key={j} className="flex gap-2"><span className="text-muted font-mono text-xs mt-0.5">{j + 1}.</span><span>{a}</span></li>
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
                        ${isSelected ? 'bg-ac/10 border-2 border-ac text-ac font-medium'
                          : isOther ? 'bg-s1/30 border border-br/30 text-muted/50 cursor-not-allowed'
                          : c.danger ? 'bg-dnl/50 border border-dnb/50 text-tx hover:bg-dnl hover:border-dnb cursor-pointer'
                          : 'bg-s0 border border-br text-tx hover:bg-acl hover:border-ac/30 cursor-pointer'}`}
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

      <section className="mt-8 mb-8">
        <h2 className="text-lg font-bold mb-3">関連スコア・ツール</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { slug: 'alvarado', name: 'Alvarado score' },
            { slug: 'ranson', name: 'Ranson criteria' },
            { slug: 'bisap', name: 'BISAP' },
            { slug: 'glasgow-blatchford', name: 'Glasgow-Blatchford' },
            { slug: 'rockall', name: 'Rockall score' },
            { slug: 'sofa', name: 'SOFA' },
            { slug: 'qsofa', name: 'qSOFA' },
          ].map(t => (
            <Link key={t.slug} href={`/tools/calc/${t.slug}`}
              className="text-sm bg-s1 text-tx px-3 py-1.5 rounded-lg hover:bg-acl hover:text-ac transition-colors">{t.name}</Link>
          ))}
        </div>
      </section>

      <ERDisclaimerFooter />

      <section className="space-y-4 text-sm text-muted mb-8">
        <h2 className="text-base font-bold text-tx">腹痛の救急対応について</h2>
        <p>
          急性腹症は救急外来で最も頻度の高い主訴の一つです。
          「外科的緊急の判断」と「致死的疾患の除外」を最初に行い、その後で部位別の鑑別を進めます。
        </p>
        <p>
          特に注意すべきは、腹部大動脈瘤破裂（高齢者・突然の腹痛/背部痛+ショック）、
          腸間膜虚血（Af患者・痛みと所見の乖離）、異所性妊娠（妊娠可能年齢女性の腹痛には全例で尿妊娠反応）の3つです。
        </p>
        <h3 className="font-bold text-tx">心窩部痛とACSの関係</h3>
        <p>
          下壁心筋梗塞は心窩部痛・嘔気として受診することがあります。心窩部痛の鑑別にはリパーゼだけでなく、
          12誘導心電図とトロポニンを必ず含めてください。特に糖尿病患者や高齢者では非典型的な症状を呈します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">参考文献</h2>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2">
          <li>Cartwright SL, Knudson MP. Evaluation of Acute Abdominal Pain in Adults. Am Fam Physician 2008;77:971-978</li>
          <li>Yokoe M et al. TG18: Tokyo Guidelines 2018 diagnostic criteria and severity grading of acute cholecystitis. J Hepatobiliary Pancreat Sci 2018;25:41-54</li>
          <li>Banks PA et al. Classification of acute pancreatitis—2012. Gut 2013;62:102-111</li>
          <li>Di Saverio S et al. Diagnosis and treatment of acute appendicitis. Br J Surg 2020;107:e8-e22</li>
        </ol>
      </section>
    </div>
  )
}
