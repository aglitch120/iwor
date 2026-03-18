'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import ProGate from '@/components/pro/ProGate'
import FavoriteButton from '@/components/tools/FavoriteButton'
import ProPulseHint from '@/components/pro/ProPulseHint'
import { trackToolUsage } from '@/components/pro/useProStatus'

type Sev = 'ok' | 'wn' | 'dn' | 'neutral'
type TabId = 'head' | 'chest'

const headCategories = [
  {
    key: 'Parenchyma', title: '脳実質',
    desc: '出血・梗塞・腫瘤・浮腫・萎縮',
    findings: [
      { id: 'brain_normal', label: '脳実質 異常なし', detail: '明らかな出血・梗塞・腫瘤を認めない。灰白質/白質のコントラスト正常。', severity: 'ok' as Sev },
      { id: 'ich', label: '脳内出血（ICH）', detail: '脳実質内の高吸収域。被殻出血（高血圧性、最多）・視床出血・小脳出血・脳幹出血・皮質下出血（CAA、AVM）を部位で鑑別。血腫量（ABC/2法）とヘルニア徴候を評価。', severity: 'dn' as Sev },
      { id: 'sah', label: 'くも膜下出血（SAH）', detail: 'くも膜下腔・脳槽の高吸収。脳動脈瘤破裂が80%。Fisher分類で血管攣縮リスクを評価。緊急3D-CTA→脳外科コンサルト。', severity: 'dn' as Sev },
      { id: 'sdh', label: '硬膜下血腫（SDH）', detail: '硬膜と脳表面の三日月型血腫。急性（高吸収）vs 慢性（低〜等吸収）。正中偏位 > 5mm or 血腫厚 > 10mmは手術適応。', severity: 'dn' as Sev },
      { id: 'edh', label: '硬膜外血腫（EDH）', detail: '凸レンズ型の高吸収域。中硬膜動脈損傷が多い。lucid intervalに注意。正中偏位・血腫拡大は緊急開頭。', severity: 'dn' as Sev },
      { id: 'early_infarct', label: '早期虚血性変化', detail: 'early CT sign: 皮髄境界不明瞭化、島皮質の不鮮明化、レンズ核の不鮮明化、脳溝消失。ASPECTS評価。発症6時間以内→tPA/血栓回収を検討。', severity: 'dn' as Sev },
      { id: 'established_infarct', label: '確立した脳梗塞', detail: '明確な低吸収域。血管支配領域と一致→アテローム血栓性 or 心原性。ラクナ梗塞（< 15mm、基底核・橋）。出血性梗塞転化に注意。', severity: 'dn' as Sev },
      { id: 'mass_lesion', label: '占拠性病変（腫瘤）', detail: '等〜高吸収の腫瘤。周囲浮腫・mass effect・造影パターンで評価。転移性脳腫瘍（多発）・グリオーマ・髄膜腫を鑑別。造影MRIで精査。', severity: 'dn' as Sev },
      { id: 'brain_edema', label: '脳浮腫', detail: '脳実質の低吸収化+脳溝消失+脳室圧排。血管原性（腫瘍周囲）vs 細胞毒性（梗塞）。ヘルニアリスク評価。マンニトール/高張食塩水を検討。', severity: 'dn' as Sev },
      { id: 'atrophy', label: '脳萎縮', detail: '脳溝拡大+脳室拡大。加齢性 vs 神経変性疾患（AD: 海馬萎縮、FTD: 前頭側頭萎縮）。NPH（正常圧水頭症）との鑑別が重要。', severity: 'wn' as Sev },
    ]
  },
  {
    key: 'Ventricle', title: '脳室・脳槽',
    desc: '脳室拡大・水頭症・脳室内出血',
    findings: [
      { id: 'ventricle_normal', label: '脳室 正常', detail: '脳室系の形態・サイズ正常。正中偏位なし。', severity: 'ok' as Sev },
      { id: 'hydrocephalus', label: '水頭症', detail: '脳室拡大: 交通性（くも膜顆粒吸収障害）vs 非交通性（腫瘍・出血による閉塞）。Evans index > 0.3。NPH: 歩行障害+認知症+尿失禁のtriad。', severity: 'wn' as Sev },
      { id: 'ivh', label: '脳室内出血（IVH）', detail: '脳室内の高吸収。被殻/視床出血の脳室穿破が多い。急性水頭症のリスク → 脳室ドレナージを検討。', severity: 'dn' as Sev },
      { id: 'midline_shift', label: '正中偏位', detail: '透明中隔の偏位。5mm以上は有意。テント上ヘルニアのリスク。原因（血腫・腫瘤・浮腫）の治療が急務。', severity: 'dn' as Sev },
    ]
  },
  {
    key: 'Bone', title: '骨・軟部',
    desc: '頭蓋骨骨折・副鼻腔・乳突蜂巣',
    findings: [
      { id: 'skull_normal', label: '頭蓋骨 異常なし', detail: '骨折・溶骨性病変を認めない。正常所見。', severity: 'ok' as Sev },
      { id: 'skull_fracture', label: '頭蓋骨骨折', detail: '線状骨折 vs 陥没骨折。中硬膜動脈走行部の骨折 → EDHリスク。側頭骨骨折 → 髄液漏・顔面神経麻痺。', severity: 'dn' as Sev },
      { id: 'sinusitis', label: '副鼻腔液貯留/肥厚', detail: '副鼻腔の粘膜肥厚・液面形成。急性副鼻腔炎。頭蓋底骨折後の血性貯留の可能性も。', severity: 'wn' as Sev },
      { id: 'scalp_hematoma', label: '頭皮下血腫', detail: '皮下軟部組織の腫脹・高吸収。外傷の受傷部位を示唆。直下の頭蓋骨骨折をチェック。', severity: 'neutral' as Sev },
    ]
  },
]

const chestCategories = [
  {
    key: 'Lung', title: '肺実質',
    desc: '浸潤影・GGO・結節・腫瘤・気腫・線維化',
    findings: [
      { id: 'lung_clear', label: '肺野 異常なし', detail: '両側肺野に明らかな異常陰影なし。正常所見。', severity: 'ok' as Sev },
      { id: 'consolidation', label: '浸潤影（consolidation）', detail: 'air bronchogramを伴う均一な高吸収域。肺炎（細菌性）・器質化肺炎・肺胞出血・肺胞蛋白症を鑑別。分布が区域性→細菌性肺炎の可能性高い。', severity: 'dn' as Sev },
      { id: 'ggo', label: 'すりガラス影（GGO）', detail: '血管影が透見できる淡い濃度上昇。ウイルス性肺炎・PCP・薬剤性肺障害・肺胞出血・初期間質性肺炎を鑑別。分布パターンが鑑別に重要。', severity: 'wn' as Sev },
      { id: 'nodule_solid', label: '充実性結節（≦ 30mm）', detail: '充実性結節: サイズ・辺縁・石灰化で評価。> 8mmはFleischner基準でフォロー。スピキュラ+胸膜陥入は悪性示唆。PET-CT or 生検を検討。', severity: 'wn' as Sev },
      { id: 'mass', label: '腫瘤影（> 30mm）', detail: '3cm超の腫瘤は原発性肺癌の可能性が高い。気管支鏡/CTガイド下生検で組織診断。ステージングCT/PET-CTを併施。', severity: 'dn' as Sev },
      { id: 'ggo_nodule', label: 'GGOを含む結節（part-solid）', detail: 'Part-solid nodule: 充実成分のサイズが予後に相関。充実成分 > 5mmで悪性リスク上昇。腺癌（lepidic predominant）に多い。', severity: 'wn' as Sev },
      { id: 'emphysema', label: '気腫性変化', detail: '肺の過膨張+低吸収域。COPD。centrilobular型（上葉優位）vs panlobular型（全体）。bullae形成に注意。', severity: 'wn' as Sev },
      { id: 'honeycombing', label: '蜂巣肺', detail: '胸膜直下の嚢胞状変化の集積。UIP（通常型間質性肺炎）パターン。IPF・膠原病肺・石綿肺を鑑別。下葉・背側優位。', severity: 'dn' as Sev },
      { id: 'cavity', label: '空洞影', detail: '壁を持つ含気腔。結核（上葉）・肺膿瘍・壊死性肺炎・扁平上皮癌・GPA（Wegener）を鑑別。壁の厚さ > 15mmは悪性示唆。', severity: 'dn' as Sev },
      { id: 'tree_in_bud', label: 'tree-in-bud pattern', detail: '細気管支の粘液栓+周囲の炎症。活動性結核（最重要）・NTM・細菌性気管支炎・DPB・誤嚥を鑑別。抗酸菌検査必須。', severity: 'dn' as Sev },
    ]
  },
  {
    key: 'Pleura', title: '胸膜・胸腔',
    desc: '胸水・気胸・胸膜肥厚',
    findings: [
      { id: 'pleura_normal', label: '胸膜・胸腔 異常なし', detail: '胸水・気胸・胸膜肥厚を認めない。正常所見。', severity: 'ok' as Sev },
      { id: 'effusion', label: '胸水', detail: '胸水: CTで容易に検出。Light基準（蛋白・LDH）で漏出性 vs 滲出性を鑑別。悪性胸水ではCT上の胸膜結節・不整肥厚が手がかり。', severity: 'wn' as Sev },
      { id: 'pneumothorax', label: '気胸', detail: '臓側胸膜ラインの検出。CTは胸部X線より感度高い。少量気胸も検出可能。緊張性気胸の所見（縦隔偏位）を確認。', severity: 'dn' as Sev },
      { id: 'pleural_thickening', label: '胸膜肥厚/石灰化', detail: '胸膜肥厚: アスベスト曝露（胸膜プラーク）・結核後・悪性中皮腫を鑑別。circumferentialな肥厚は悪性示唆。', severity: 'wn' as Sev },
    ]
  },
  {
    key: 'Mediastinum', title: '縦隔・心大血管',
    desc: 'リンパ節・大動脈・肺動脈・心嚢',
    findings: [
      { id: 'mediastinum_normal', label: '縦隔 異常なし', detail: '縦隔リンパ節腫大・大動脈異常を認めない。正常所見。', severity: 'ok' as Sev },
      { id: 'lymphadenopathy', label: 'リンパ節腫大（短径 > 10mm）', detail: '縦隔/肺門リンパ節腫大: 肺癌転移・悪性リンパ腫・サルコイドーシス・結核を鑑別。BHL（両側肺門）はサルコイドーシスに特徴的。', severity: 'wn' as Sev },
      { id: 'aortic_dissection', label: '大動脈解離（フラップ/二腔）', detail: '内膜フラップ+真腔/偽腔の二腔構造。Stanford A型（上行大動脈）は緊急手術。B型は降圧管理が基本。造影CTで確定診断。', severity: 'dn' as Sev },
      { id: 'aortic_aneurysm', label: '大動脈瘤（> 45mm）', detail: '胸部大動脈瘤。55mm以上で手術適応（Marfan症候群は50mm）。年間拡大速度 > 5mmも手術考慮。', severity: 'wn' as Sev },
      { id: 'pe', label: '肺動脈血栓塞栓症', detail: '肺動脈内の造影欠損。中枢型（主幹〜葉動脈）は血行動態への影響大。RV/LV比 > 1は右心負荷を示唆。抗凝固+重症例はtPA。', severity: 'dn' as Sev },
      { id: 'pericardial_effusion', label: '心嚢液貯留', detail: '心嚢内の液体貯留。少量は正常範囲。大量+心房圧排はタンポナーデリスク。原因検索（感染・悪性・自己免疫・尿毒症）。', severity: 'wn' as Sev },
    ]
  },
  {
    key: 'Other', title: '骨・軟部・上腹部',
    desc: '椎体・肋骨・偶発的所見',
    findings: [
      { id: 'other_normal', label: '骨・軟部組織 異常なし', detail: '椎体・肋骨に明らかな異常なし。正常所見。', severity: 'ok' as Sev },
      { id: 'bone_mets', label: '骨転移（溶骨性/造骨性）', detail: '椎体・肋骨の溶骨性/造骨性病変: 肺癌・乳癌・腎癌・前立腺癌からの転移を鑑別。病的骨折のリスク評価。', severity: 'dn' as Sev },
      { id: 'compression_fx', label: '椎体圧迫骨折', detail: '椎体の楔状変形。骨粗鬆症性 vs 病的（悪性浸潤）を鑑別。MRIで評価。', severity: 'wn' as Sev },
      { id: 'adrenal_mass', label: '副腎腫瘤（偶発腫）', detail: '胸部CT下部スライスで副腎腫瘤を偶発的に検出。> 4cmまたは不均一造影はmalignancy考慮。ホルモン検査+フォロー。', severity: 'wn' as Sev },
      { id: 'liver_mass', label: '肝腫瘤（偶発的）', detail: '胸部CT下部で肝臓に腫瘤を偶発検出。嚢胞・血管腫・FNH・HCC・転移を鑑別。腹部造影CT/MRIで精査。', severity: 'wn' as Sev },
    ]
  },
]

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'head', label: '頭部CT', icon: '🧠' },
  { id: 'chest', label: '胸部CT', icon: '🫁' },
]

export default function CTUnifiedPage() {
  const [tab, setTab] = useState<TabId>('head')
  const [selectedHead, setSelectedHead] = useState<Set<string>>(new Set())
  const [selectedChest, setSelectedChest] = useState<Set<string>>(new Set())

  useEffect(() => { trackToolUsage('interpret-ct') }, [])

  const categories = tab === 'head' ? headCategories : chestCategories
  const selected = tab === 'head' ? selectedHead : selectedChest
  const setSelected = tab === 'head' ? setSelectedHead : setSelectedChest

  const toggle = (id: string) => setSelected(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n
  })

  const results = useMemo(() => {
    const r: any[] = []
    categories.forEach(cat => cat.findings.filter(f => selected.has(f.id)).forEach(f =>
      r.push({ title: `${cat.key}: ${f.label}`, severity: f.severity, detail: f.detail })
    ))
    return r
  }, [selected, categories])

  const sty: Record<Sev, string> = {
    ok: 'bg-[#E6F4EA] border-l-4 border-[#34A853]',
    wn: 'bg-[#FFF8E1] border-l-4 border-[#F9A825]',
    dn: 'bg-[#FDECEA] border-l-4 border-[#D93025]',
    neutral: 'bg-[#E8F0FE] border-l-4 border-[#4285F4]',
  }
  const tc: Record<Sev, string> = {
    ok: 'text-[#1B5E20]', wn: 'text-[#E65100]', dn: 'text-[#B71C1C]', neutral: 'text-[#1565C0]',
  }

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span>
        <Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">›</span>
        <Link href="/tools/interpret" className="hover:text-ac">検査読影</Link><span className="mx-2">›</span>
        <span>CT読影</span>
      </nav>
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-block text-sm bg-acl text-ac px-2.5 py-0.5 rounded-full font-medium mb-2">🔬 検査読影</span>
            <h1 className="text-2xl font-bold text-tx mb-1">CT読影 系統的評価チェックリスト</h1>
            <p className="text-sm text-muted">頭部・胸部のCT系統的評価。所見チェック→鑑別疾患と推奨アクションを表示。</p>
          </div>
          <ProPulseHint><FavoriteButton slug="interpret-ct" title="CT読影 系統的評価" /></ProPulseHint>
        </div>
      </header>

      {/* タブ切替 */}
      <div className="flex gap-1 mb-6 bg-s1 rounded-xl p-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-s0 shadow-sm text-ac' : 'text-muted hover:text-tx'
            }`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* チェックリスト */}
      <section className="space-y-4 mb-6">
        {categories.map(cat => (
          <div key={cat.key} className="bg-s0 border border-br rounded-xl p-4">
            <h2 className="text-sm font-bold text-tx mb-1">{cat.title}</h2>
            <p className="text-[11px] text-muted mb-3">{cat.desc}</p>
            <div className="flex flex-wrap gap-2">
              {cat.findings.map(f => (
                <button key={f.id} onClick={() => toggle(f.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    selected.has(f.id)
                      ? f.severity === 'ok' ? 'bg-[#166534] text-white border-[#166534]'
                        : f.severity === 'dn' ? 'bg-[#991B1B] text-white border-[#991B1B]'
                        : f.severity === 'neutral' ? 'bg-ac text-white border-ac'
                        : 'bg-[#92400E] text-white border-[#92400E]'
                      : 'bg-bg text-tx border-br hover:border-ac/30'
                  }`}>
                  {selected.has(f.id) ? '✓ ' : ''}{f.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 推奨アクション */}
      {results.length > 0 && (
        <ProGate feature="interpretation" previewHeight={100}>
          <section className="mb-8">
            <h2 className="text-lg font-bold text-tx mb-3">推奨アクション（{results.length}所見）</h2>
            <div className="space-y-3">
              {results.map((r: any, i: number) => (
                <div key={i} className={`rounded-xl p-4 ${sty[r.severity as Sev]}`}>
                  <p className={`text-sm font-bold mb-1 ${tc[r.severity as Sev]}`}>{r.title}</p>
                  <p className="text-xs text-tx/80">{r.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </ProGate>
      )}

      {selected.size === 0 && (
        <div className="bg-s1 border border-br rounded-xl p-6 text-center text-muted text-sm mb-8">
          上のチェックリストから所見を選択すると、鑑別疾患と解説が表示されます。
        </div>
      )}

      <div className="bg-wnl border border-wnb rounded-lg p-4 mb-8 text-sm text-wn">
        <p className="font-semibold mb-1">⚠️ 医療上の免責事項</p>
        <p>本ツールはCTの系統的評価を補助するチェックリストです。画像の自動判定は行いません。読影・診断の最終判断は必ず担当医が行ってください。</p>
      </div>
    </div>
  )
}
