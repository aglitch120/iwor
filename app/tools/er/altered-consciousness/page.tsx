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
    id: 'start', title: 'Step 1: ABCDEアプローチ — 生命の危機を回避',
    desc: '意識障害患者は気道確保が最優先。GCSを評価し、GCS≦8は気管挿管を考慮。',
    choices: [
      { label: '気道開通・呼吸安定・循環維持（sBP≧90）', value: 'stable', icon: '✅' },
      { label: '気道閉塞 / 呼吸不全 / ショック', value: 'unstable', icon: '🚨', danger: true },
    ],
    next: v => v === 'unstable' ? 'unstable' : 'rapid_check',
  },

  unstable: {
    id: 'unstable', title: '⚠️ ABCが不安定 → 蘇生最優先',
    result: {
      severity: 'critical',
      title: '生命危機 — ABC安定化が最優先',
      actions: [
        'A: 気道確保（下顎挙上→経口エアウェイ→気管挿管。GCS≦8は挿管考慮）',
        'B: 酸素投与 → SpO₂≧94%。呼吸不全→BVM換気→挿管',
        'C: 大口径ルート2本 → 急速輸液。昇圧薬準備',
        '頸椎保護（外傷が否定できない場合）',
        'モニター装着（心電図・SpO₂・血圧・体温）',
        '簡易血糖測定（低血糖は即座にブドウ糖液IVで補正）',
        'ABC安定したら → Step 2へ',
      ],
      workup: ['血糖', '血液ガス', '12誘導心電図', 'SpO₂モニター'],
      disposition: 'ICU',
      pitfall: '意識障害の原因検索はABC安定化の後。ただし低血糖の補正は並行で。外傷の可能性があれば頸椎保護を忘れない',
    },
  },

  rapid_check: {
    id: 'rapid_check', title: 'Step 2: 即座に鑑別すべき緊急疾患',
    desc: '簡易血糖・体温・瞳孔・項部硬直・外傷痕を30秒でチェック。「治療可能な意識障害」を見逃さない。',
    choices: [
      { label: '血糖 <70mg/dL → 低血糖', value: 'hypoglycemia', icon: '🍬', danger: true },
      { label: '体温 ≧38.5℃ + 項部硬直/Kernig陽性 → 髄膜炎疑い', value: 'meningitis', icon: '🌡️', danger: true },
      { label: '瞳孔不同（片側散大）/ 片麻痺 → 脳ヘルニア/脳卒中疑い', value: 'stroke', icon: '🧠', danger: true },
      { label: '外傷痕（頭部打撲・Battle sign・パンダの目）→ 頭部外傷', value: 'trauma', icon: '🤕', danger: true },
      { label: 'いずれも明確でない → 系統的鑑別へ（AIUEOTIPS）', value: 'systematic', icon: '📋' },
    ],
    next: v => ({ hypoglycemia: 'hypoglycemia', meningitis: 'meningitis', stroke: 'stroke', trauma: 'trauma', systematic: 'aiueotips' }[v] || 'aiueotips'),
  },

  hypoglycemia: {
    id: 'hypoglycemia', title: '🍬 低血糖 — 最も治療可能な意識障害',
    result: {
      severity: 'critical',
      title: '低血糖 — 即座に補正',
      actions: [
        'ブドウ糖液 IV（用量は施設プロトコル参照）→ 数分で意識回復',
        '回復しなければ追加投与',
        '意識回復後: 原因検索（インスリン過量・SU薬・飲酒・副腎不全・敗血症・肝不全）',
        'SU薬による低血糖 → 遷延するため持続ブドウ糖点滴 + 入院',
        'アルコール多飲歴 → ブドウ糖投与前にチアミンIV（Wernicke予防）',
        '栄養不良/アルコール依存 → チアミンIV',
      ],
      workup: ['血糖再検（補正後）', 'インスリン・Cペプチド（インスリノーマ疑い時）', '肝機能・腎機能', 'コルチゾール（副腎不全疑い時）', '薬物歴の詳細確認'],
      disposition: 'SU薬 → 入院（24-72h低血糖遷延リスク）/ 単回 → 観察後帰宅',
      pitfall: 'ブドウ糖で改善してもSU薬なら再発必至。アルコール+栄養不良にブドウ糖→Wernicke脳症誘発のリスク',
    },
  },

  meningitis: {
    id: 'meningitis', title: '🌡️ 髄膜炎疑い — 抗菌薬は検査の前に',
    result: {
      severity: 'critical',
      title: '細菌性髄膜炎疑い — 1時間以内に抗菌薬投与',
      actions: [
        '血液培養2セット → 直ちに抗菌薬開始（培養結果を待たない）',
        'Empiric therapy: CTRX + VCM（MRSA/PRSPカバー）+ デキサメタゾン（用量は施設プロトコル参照）',
        '50歳以上/免疫不全 → ABPC追加（リステリアカバー）',
        '腰椎穿刺（LP）: 頭蓋内圧亢進の徴候がなければ速やかに',
        '乳頭浮腫・片麻痺・GCS低下 → LP前に頭部CT',
        'ヘルペス脳炎の可能性 → アシクロビルIV追加',
      ],
      workup: ['血液培養', '髄液検査（細胞数・蛋白・糖・グラム染色・培養）', '頭部CT（LP前に必要な場合）', 'CBC・CRP・PCT', '電解質（SIADHの合併）'],
      disposition: 'ICU',
      pitfall: 'LP前のCTで時間を浪費しない。「CT→LP→抗菌薬」ではなく「血培→抗菌薬→CT→LP」の順。Jolt accentuationは感度高くない',
    },
  },

  stroke: {
    id: 'stroke', title: '🧠 脳卒中/脳ヘルニア疑い',
    desc: '瞳孔不同・片麻痺 → 脳出血 or 脳梗塞。発症時間の確認が治療方針を決定する。',
    choices: [
      { label: '発症4.5時間以内 + 出血除外 → t-PA候補', value: 'tpa', icon: '⏰', danger: true },
      { label: '発症4.5時間超 or 時間不明', value: 'late', icon: '🕐' },
      { label: '瞳孔不同 + 意識急速悪化 → 脳ヘルニア進行', value: 'herniation', icon: '🚨', danger: true },
    ],
    next: v => `stroke_${v}`,
  },

  stroke_tpa: {
    id: 'stroke_tpa', title: '⏰ 発症4.5h以内 → t-PA検討',
    result: {
      severity: 'critical',
      title: '急性期脳梗塞 — rt-PA静注療法（用量は施設プロトコル参照）',
      actions: [
        '頭部CT（出血除外）→ 出血なし確認',
        'NIHSS評価',
        'rt-PA適応・禁忌チェック（出血傾向・最近の手術・重症高血圧等）',
        '血圧管理: rt-PA投与基準の血圧閾値以下に降圧',
        'rt-PA IV（用量・投与方法は施設プロトコル参照）',
        '脳神経外科/脳卒中科コンサルト',
        '大血管閉塞 → 血管内治療（発症6-24h以内でも適応あり）',
      ],
      workup: ['頭部CT（非造影）', 'CT angiography（大血管閉塞評価）', 'NIHSS', 'CBC・凝固（PT-INR）・血糖・腎機能', '12誘導心電図（Af→心原性塞栓）'],
      disposition: 'SCU/ICU',
      pitfall: 'Door-to-Needle 60分以内が目標。「CT待ち」で遅延しがち。血糖<50 or >400は補正してから再評価。起床時発症は最終健常確認時刻で判断',
    },
  },

  stroke_late: {
    id: 'stroke_late', title: '🕐 発症4.5h超/時間不明',
    result: {
      severity: 'urgent',
      title: '急性期脳卒中（t-PA時間外）— 血管内治療の適応評価',
      actions: [
        '頭部CT → 出血 vs 梗塞の鑑別',
        '脳出血 → 降圧（目標値は施設プロトコル参照）+ 脳外科コンサルト',
        '脳梗塞 → 大血管閉塞ならCT灌流画像で血管内治療適応評価（発症6-24hでもDWI-FLAIR mismatch等で適応あり）',
        '抗血小板薬（t-PA非適応の梗塞: 用量は施設プロトコル参照）',
        '嚥下評価（誤嚥性肺炎予防）',
      ],
      workup: ['頭部CT（非造影+造影）', 'MRI DWI/FLAIR', 'CT perfusion（大血管閉塞時）', 'NIHSS', '心電図（Af確認）'],
      disposition: 'SCU/脳卒中ユニット',
      pitfall: '発症時刻不明でもDWI-FLAIR mismatchがあれば4.5h以内の可能性→t-PA検討。Wake-up strokeは画像で判断',
    },
  },

  stroke_herniation: {
    id: 'stroke_herniation', title: '🚨 脳ヘルニア進行',
    result: {
      severity: 'critical',
      title: '脳ヘルニア — 緊急減圧',
      actions: [
        '頭部挙上30°',
        '浸透圧利尿薬（マンニトール or 高張食塩水）IV — 用量は施設プロトコル参照',
        '過換気（一時的な頭蓋内圧低下目的）— 効果は一時的',
        '脳外科緊急コンサルト → 外減圧術/血腫除去',
        '瞳孔所見・GCSを頻回に再評価',
      ],
      workup: ['頭部CT（緊急）', 'CBC・凝固・電解質', 'クロスマッチ'],
      disposition: '手術室 or ICU',
      pitfall: 'マンニトールの反復投与は血清浸透圧に注意。ステロイドは脳卒中によるヘルニアには無効（腫瘍性浮腫には有効）',
    },
  },

  trauma: {
    id: 'trauma', title: '🤕 頭部外傷',
    result: {
      severity: 'urgent',
      title: '頭部外傷による意識障害 — 頭蓋内出血の除外',
      actions: [
        '頸椎保護（頸椎カラー）',
        '頭部CT（非造影）→ 硬膜外血腫・硬膜下血腫・くも膜下出血・脳挫傷',
        'GCS≦8 → 気管挿管 + 脳外科コンサルト',
        '硬膜外血腫（lucid interval）→ 緊急開頭',
        '抗凝固薬内服中 → 拮抗（ワルファリン→ビタミンK+FFP/PCC、DOAC→拮抗薬）',
        '全身外傷の検索（FAST・胸腹部CT・骨盤X線）',
      ],
      workup: ['頭部CT', '頸椎CT', 'FAST', 'CBC・凝固', 'アルコール濃度・薬物スクリーニング'],
      disposition: '脳外科的適応 → 手術室 / 経過観察 → ICU/HCU',
      pitfall: '高齢者の慢性硬膜下血腫は軽微な外傷・数週間後に発症。抗凝固薬内服は出血リスクが大きい。「酔っているだけ」で帰さない',
    },
  },

  aiueotips: {
    id: 'aiueotips', title: 'Step 3: AIUEOTIPS — 系統的鑑別',
    desc: '明確な緊急所見がない場合、AIUEOTIPS（意識障害の鑑別語呂合わせ）で系統的に原因を検索。',
    choices: [
      { label: 'A: Alcohol / Acidosis（飲酒・代謝性アシドーシス・DKA）', value: 'alcohol', icon: '🍺' },
      { label: 'I: Insulin（低血糖・高血糖: 再確認）', value: 'insulin', icon: '💉' },
      { label: 'U: Uremia / Underdose（尿毒症・薬物中断: 抗てんかん薬等）', value: 'uremia', icon: '🫘' },
      { label: 'E: Endocrine / Encephalopathy（甲状腺クリーゼ・粘液水腫昏睡・肝性脳症・Wernicke）', value: 'endocrine', icon: '🦋' },
      { label: 'O: Overdose / O₂（薬物中毒・CO中毒・低酸素血症）', value: 'overdose', icon: '💊' },
      { label: 'T: Trauma / Temperature（外傷再確認・低体温・熱中症）', value: 'temperature', icon: '🌡️' },
      { label: 'I: Infection（髄膜炎・脳炎・敗血症: 再確認）', value: 'infection', icon: '🦠' },
      { label: 'P: Psychiatric / Porphyria（精神疾患・ポルフィリア）', value: 'psychiatric', icon: '🧠' },
      { label: 'S: Seizure / SAH / Stroke（けいれん後・くも膜下出血・脳卒中）', value: 'seizure', icon: '⚡' },
    ],
    next: v => `aiueotips_${v}`,
  },

  aiueotips_alcohol: {
    id: 'aiueotips_alcohol', title: '🍺 アルコール関連 / 代謝性アシドーシス',
    result: {
      severity: 'urgent',
      title: 'アルコール関連意識障害の鑑別',
      actions: [
        '急性アルコール中毒: 経過観察（気道確保+側臥位）',
        'DKA: インスリン持続静注 + 生食 + K補正（DKAプロトコル）',
        'アルコール性ケトアシドーシス: ブドウ糖入り生食 + チアミン',
        'メタノール/エチレングリコール中毒: エタノール or フォメピゾール + 透析',
        '離脱せん妄（DT）: ベンゾジアゼピン',
        '必ずチアミン投与（Wernicke脳症予防）',
      ],
      workup: ['血液ガス（AG開大?）', '血糖', '浸透圧Gap', '乳酸', '血中アルコール', 'ケトン体', '電解質・腎機能・肝機能'],
      disposition: '状態に応じてICU/一般病棟/観察室',
      pitfall: '「酔っぱらいだから」で思考停止しない。硬膜下血腫・低血糖・低体温の合併を必ず除外',
    },
  },

  aiueotips_insulin: {
    id: 'aiueotips_insulin', title: '💉 血糖異常（再確認）',
    result: {
      severity: 'urgent',
      title: '高血糖緊急症（DKA / HHS）',
      actions: [
        'DKA: pH<7.3 + AG開大 + ケトン体陽性 → インスリン + 生食 + K補正',
        'HHS: 血糖>600 + 浸透圧>320 + 著明な脱水 → 大量輸液 + インスリン',
        'K < 3.3ならインスリン前にK補正（低Kでインスリン→致死的不整脈）',
        '補液: 大量輸液で脱水補正（速度は施設プロトコル参照）',
      ],
      workup: ['血糖', '血液ガス', 'ケトン体', '電解質（K!）', '血清浸透圧', 'CBC・腎機能'],
      disposition: 'ICU',
      pitfall: 'HHSはDKAより死亡率が高い（浸透圧変化による脳浮腫リスク）。急速な血糖降下は脳浮腫のリスク — 緩徐な補正が重要',
    },
  },

  aiueotips_uremia: {
    id: 'aiueotips_uremia', title: '🫘 尿毒症 / 薬物中断',
    result: {
      severity: 'urgent',
      title: '尿毒症性脳症 / 抗てんかん薬中断',
      actions: [
        '尿毒症: BUN著明高値で意識障害 → 緊急透析を検討',
        '抗てんかん薬中断 → てんかん重積のリスク → 薬剤再開 + ベンゾジアゼピン準備',
        'その他の薬物中断: 甲状腺ホルモン・ステロイド → 補充',
      ],
      workup: ['BUN・Cr・電解質', '薬物血中濃度（バルプロ酸・フェニトイン等）', '血液ガス', '頭部CT（けいれん後の除外）'],
      disposition: '透析 → ICU / 薬剤再開 → 一般病棟',
      pitfall: '高齢者の腎不全は緩徐に進行し意識障害が軽微なことがある。Na・Ca・Mg異常も忘れずに',
    },
  },

  aiueotips_endocrine: {
    id: 'aiueotips_endocrine', title: '🦋 内分泌・代謝性脳症',
    result: {
      severity: 'urgent',
      title: '甲状腺クリーゼ / 粘液水腫昏睡 / 肝性脳症 / Wernicke脳症',
      actions: [
        '甲状腺クリーゼ: β遮断薬 + ヨウ素 + ステロイド + 抗甲状腺薬',
        '粘液水腫昏睡: L-T4 IV + ヒドロコルチゾン + 保温',
        '肝性脳症: ラクツロース + リファキシミン + 誘因検索（感染・出血・便秘）',
        'Wernicke脳症（眼球運動障害・失調・意識障害の三徴）: チアミン大量IV（用量は施設プロトコル参照）',
        '副腎不全: ヒドロコルチゾンIV（ストレスドーズ。用量は施設プロトコル参照）',
      ],
      workup: ['TSH・FT3・FT4', 'NH3', '肝機能', 'コルチゾール・ACTH', 'ビタミンB1', '血糖・電解質'],
      disposition: 'ICU',
      pitfall: '甲状腺クリーゼのBaines-Wartofsky score ≧45で確実。粘液水腫昏睡は低体温+CO₂ナルコーシスの合併が多い',
    },
  },

  aiueotips_overdose: {
    id: 'aiueotips_overdose', title: '💊 薬物中毒 / CO中毒',
    result: {
      severity: 'urgent',
      title: '薬物過量内服 / 一酸化炭素（CO）中毒',
      actions: [
        '薬物中毒: トキシドローム（症候群）の同定',
        '縮瞳→オピオイド: ナロキソンIV（反復投与可。用量は施設プロトコル参照）',
        '散瞳+頻脈→交感神経刺激薬/抗コリン薬',
        'ベンゾジアゼピン: フルマゼニルは慎重に（けいれん誘発リスク）',
        'CO中毒: 100%酸素 + 重症時は高圧酸素療法',
        '活性炭（摂取1h以内）、全腸洗浄（徐放錠・パケット）',
      ],
      workup: ['薬物スクリーニング（尿・血中）', 'アセトアミノフェン・サリチル酸（必ず測定）', 'CO-Hb', '血液ガス', '心電図（QT延長・不整脈）', '浸透圧Gap'],
      disposition: 'ICU（重症）/ 観察室 → 精神科評価',
      pitfall: 'アセトアミノフェンは初期無症状で24-72h後に肝不全。必ず血中濃度を測定。CO中毒はSpO₂正常に見える（CO-Hbを測定）',
    },
  },

  aiueotips_temperature: {
    id: 'aiueotips_temperature', title: '🌡️ 体温異常',
    result: {
      severity: 'urgent',
      title: '低体温 / 熱中症（熱射病）',
      actions: [
        '低体温（<35℃）: 復温（受動的→能動的外部→能動的内部復温）、不整脈モニター',
        '高体温/熱射病（>40℃）: 積極的冷却（氷嚢・冷却ブランケット・冷水膀胱洗浄）',
        '悪性症候群（抗精神病薬使用中）: 原因薬中止 + ダントロレン',
        'セロトニン症候群: 原因薬中止 + シプロヘプタジン',
        '甲状腺クリーゼ: 高体温+頻脈+意識障害',
      ],
      workup: ['深部体温', 'CK（横紋筋融解症）', '凝固（DIC）', '電解質・腎機能・肝機能', '血液ガス'],
      disposition: 'ICU',
      pitfall: '低体温では心室細動リスクが高い。32℃以下では薬物・除細動の効果が低下。「冷たい死体は死んではいない」— 復温まで死亡宣告しない',
    },
  },

  aiueotips_infection: {
    id: 'aiueotips_infection', title: '🦠 感染症（髄膜炎・脳炎・敗血症）',
    result: {
      severity: 'critical',
      title: '中枢神経感染症 / 敗血症性脳症',
      actions: [
        '発熱+意識障害 → 髄膜炎/脳炎を疑い → 早期に抗菌薬/抗ウイルス薬',
        '血液培養2セット → empiric抗菌薬（施設プロトコル参照）± アシクロビル',
        '敗血症性脳症: 感染源検索 + 1hバンドル（培養→抗菌薬→輸液）',
        'qSOFA ≧2 → 敗血症を疑い集中治療',
        '痙攣を伴う → 脳炎（特にヘルペス脳炎: 側頭葉病変）',
      ],
      workup: ['血液培養', '髄液検査（可能なら）', '頭部CT/MRI', 'CBC・CRP・PCT', '尿検査・胸部X線（感染源検索）'],
      disposition: 'ICU',
      pitfall: '高齢者・免疫不全では発熱がないことがある。ヘルペス脳炎は「疑った時点で」アシクロビル開始',
    },
  },

  aiueotips_psychiatric: {
    id: 'aiueotips_psychiatric', title: '🧠 精神疾患',
    result: {
      severity: 'moderate',
      title: '精神疾患による無反応 — 除外診断',
      actions: [
        '器質的疾患の除外が大前提（全検査正常を確認）',
        '解離性障害/転換性障害: Bell現象（閉眼を開けようとすると眼球上転）',
        '緊張病（カタトニア）: ロラゼパムIV で改善することがある',
        '精神科コンサルト',
      ],
      workup: ['頭部CT/MRI正常', '脳波（NCSE除外: 非けいれん性てんかん重積）', '全血液検査正常確認'],
      disposition: '精神科',
      pitfall: '精神疾患の診断は「全ての器質的疾患を除外した後」。NCSE（非けいれん性てんかん重積）は意識障害の原因として過小評価されている',
    },
  },

  aiueotips_seizure: {
    id: 'aiueotips_seizure', title: '⚡ けいれん後 / くも膜下出血',
    result: {
      severity: 'critical',
      title: 'てんかん重積 / くも膜下出血（SAH）',
      actions: [
        'けいれん持続（≧5分）→ てんかん重積: ベンゾジアゼピン系薬IV/IM（施設プロトコル参照）',
        '5分で止まらない → 二次薬（ホスフェニトイン or レベチラセタム等。用量は施設プロトコル参照）',
        'Post-ictal state（けいれん後）: 30分以上続けば他の原因検索',
        'SAH: 突然の激しい頭痛 + 意識障害 → 頭部CT → LP（CT陰性でも疑い強い場合）',
        'SAH確認 → 脳外科コンサルト → 脳血管撮影（動脈瘤検索）',
        'NCSE: 脳波で確認 → 抗てんかん薬',
      ],
      workup: ['頭部CT（SAH/出血/腫瘍）', '脳波（NCSE疑い）', '血糖・電解質（Ca・Mg・Na）', '薬物血中濃度', 'SAH疑い: LP（キサントクロミー）'],
      disposition: 'ICU（重積/SAH）/ 観察室（post-ictal）',
      pitfall: '「けいれん後の意識障害」で安心せず30分以上続けば再評価。NCSEは見た目にけいれんがなく見逃されやすい。SAHの頭部CT感度は発症6h以内で95%だが100%ではない',
    },
  },
}

const severityConfig = {
  critical: { bg: 'bg-[#FDECEA]', border: 'border-[#D93025]', text: 'text-[#B71C1C]', badge: '🔴 緊急' },
  urgent: { bg: 'bg-[#FFF8E1]', border: 'border-[#F9A825]', text: 'text-[#E65100]', badge: '🟡 準緊急' },
  moderate: { bg: 'bg-[#E8F0FE]', border: 'border-[#4285F4]', text: 'text-[#1565C0]', badge: '🔵 中等度' },
  low: { bg: 'bg-[#E8F5E9]', border: 'border-[#2E7D32]', text: 'text-[#1B5E20]', badge: '🟢 低リスク' },
}

export default function AlteredConsciousnessPage() {
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
        <span>意識障害</span>
      </nav>

      <header className="mb-6">
        <span className="inline-block text-sm bg-dnl text-dn px-2.5 py-0.5 rounded-full font-medium mb-2">🚨 ER対応</span>
        <h1 className="text-2xl font-bold text-tx mb-1">意識障害 ER対応ツリー</h1>
        <p className="text-sm text-muted">
          AIUEOTIPS + ABCDEアプローチで意識障害を系統的に鑑別。治療可能な原因（低血糖・髄膜炎・脳卒中）を見逃さない。
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
            { slug: 'gcs', name: 'GCS' }, { slug: 'jcs', name: 'JCS' },
            { slug: 'nihss', name: 'NIHSS' }, { slug: 'qsofa', name: 'qSOFA' },
            { slug: 'sofa', name: 'SOFA' }, { slug: 'anion-gap', name: 'アニオンギャップ' },
            { slug: 'osmolality-gap', name: '浸透圧Gap' }, { slug: 'na-correction-rate', name: 'Na補正速度' },
          ].map(t => (
            <Link key={t.slug} href={`/tools/calc/${t.slug}`}
              className="text-sm bg-s1 text-tx px-3 py-1.5 rounded-lg hover:bg-acl hover:text-ac transition-colors">{t.name}</Link>
          ))}
        </div>
      </section>

      <ERDisclaimerFooter />

      <section className="space-y-4 text-sm text-muted mb-8">
        <h2 className="text-base font-bold text-tx">意識障害の系統的アプローチ</h2>
        <p>
          意識障害は救急外来で頻度が高く、原因は多岐にわたります。ABCDEアプローチで安定化を図りながら、
          「治療可能な原因」（低血糖・髄膜炎・オピオイド中毒など）を最初に除外することが重要です。
        </p>
        <h3 className="font-bold text-tx">AIUEOTIPS</h3>
        <p>
          A（Alcohol/Acidosis）、I（Insulin）、U（Uremia/Underdose）、E（Endocrine/Encephalopathy）、
          O（Overdose/O₂）、T（Trauma/Temperature）、I（Infection）、P（Psychiatric/Porphyria）、S（Seizure/SAH/Stroke）。
          この語呂合わせで系統的に鑑別を進めることで、見落としを減らすことができます。
        </p>
        <h3 className="font-bold text-tx">GCSとJCSの使い分け</h3>
        <p>
          GCS（Glasgow Coma Scale）は国際的に広く使用され、気管挿管の目安（GCS≦8）として重要です。
          JCS（Japan Coma Scale）は日本で普及しており、特に脳卒中の評価で使用されます。両方を評価しておくのが理想です。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">参考文献</h2>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2">
          <li>Teasdale G, Jennett B. Assessment of coma and impaired consciousness. Lancet 1974;2:81-84</li>
          <li>日本救急医学会. 標準救急医学 第5版</li>
          <li>van de Beek D et al. ESCMID Guideline: diagnosis and treatment of acute bacterial meningitis. Clin Microbiol Infect 2016;22:S37-62</li>
          <li>Powers WJ et al. 2019 AHA/ASA Guidelines for Early Management of Acute Ischemic Stroke. Stroke 2019;50:e344-e418</li>
        </ol>
      </section>
    </div>
  )
}
