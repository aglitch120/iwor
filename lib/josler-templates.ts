// ═══════════════════════════════════════════════════════════════
//  病歴要約テンプレート — 疾患別マスターデータ
//  AI不使用・ブラウザ完結・法務リスクゼロ
//
//  各疾患ごとに「この疾患で記載すべき」項目をテンプレートとして定義
//  ユーザーはフォームに実際の値を入力し、テンプレートが自動整形する
// ═══════════════════════════════════════════════════════════════

export interface DiseaseTemplate {
  /** 疾患名（josler-data.tsのdiseases配列と一致） */
  disease: string
  /** 疾患が属する領域 */
  specialty: string
  /** タイトル例（「〇〇歳 △△ にて入院した □□ の1例」形式） */
  titleTemplate: string
  /** 確定診断名の例 */
  diagnosisTemplate: string
  /** 典型的な主訴の例 */
  chiefComplaintExamples: string[]
  /** この疾患で必須の身体所見項目 */
  requiredPhysicalExam: string[]
  /** この疾患で必須の検査項目 */
  requiredLabFindings: string[]
  /** この疾患で重要な画像検査 */
  requiredImaging: string[]
  /** プロブレムリストの例 */
  problemListTemplate: string[]
  /** 考察で言及すべき鑑別疾患 */
  differentialDiagnosis: string[]
  /** 標準的治療のキーワード（考察の骨格用） */
  standardTreatment: string[]
  /** PubMed検索用クエリ（自動生成） */
  pubmedQuery: string
  /** ガイドライン名（参照用） */
  guidelineRef?: string
  /** 典型的退院時処方の一般名 */
  typicalMedications?: string[]
}

// ── 商品名→一般名 変換テーブル（主要薬剤） ──
export const BRAND_TO_GENERIC: Record<string, string> = {
  // 抗菌薬
  'ロセフィン': 'セフトリアキソンナトリウム', 'メロペン': 'メロペネム水和物',
  'ゾシン': 'タゾバクタム・ピペラシリンナトリウム', 'セフメタゾン': 'セフメタゾールナトリウム',
  'ユナシン': 'スルバクタムナトリウム・アンピシリンナトリウム', 'クラビット': 'レボフロキサシン水和物',
  'ジスロマック': 'アジスロマイシン水和物', 'オーグメンチン': 'クラブラン酸カリウム・アモキシシリン水和物',
  'サワシリン': 'アモキシシリン水和物', 'フロモックス': 'セフカペンピボキシル塩酸塩水和物',
  'バンコマイシン': 'バンコマイシン塩酸塩', 'ダラシン': 'クリンダマイシン塩酸塩',
  // 循環器
  'ワーファリン': 'ワルファリンカリウム', 'プラビックス': 'クロピドグレル硫酸塩',
  'エリキュース': 'アピキサバン', 'イグザレルト': 'リバーロキサバン',
  'リクシアナ': 'エドキサバントシル酸塩水和物', 'バイアスピリン': 'アスピリン',
  'ラシックス': 'フロセミド', 'アルダクトンA': 'スピロノラクトン',
  'メインテート': 'ビソプロロールフマル酸塩', 'アーチスト': 'カルベジロール',
  'エナラプリル': 'エナラプリルマレイン酸塩', 'ブロプレス': 'カンデサルタンシレキセチル',
  'アムロジン': 'アムロジピンベシル酸塩', 'ノルバスク': 'アムロジピンベシル酸塩',
  'ニトロール': 'イソソルビド硝酸エステル', 'ヘルベッサー': 'ジルチアゼム塩酸塩',
  // 消化器
  'ネキシウム': 'エソメプラゾールマグネシウム水和物', 'タケキャブ': 'ボノプラザンフマル酸塩',
  'ガスター': 'ファモチジン', 'ナウゼリン': 'ドンペリドン',
  'プリンペラン': 'メトクロプラミド', 'ラックビー': 'ビフィズス菌製剤',
  'マグミット': '酸化マグネシウム', 'ウルソ': 'ウルソデオキシコール酸',
  // 呼吸器
  'シムビコート': 'ブデソニド・ホルモテロールフマル酸塩水和物',
  'レルベア': 'ビランテロールトリフェニル酢酸塩・フルチカゾンフランカルボン酸エステル',
  'テオドール': 'テオフィリン', 'ムコソルバン': 'アンブロキソール塩酸塩',
  'メプチン': 'プロカテロール塩酸塩水和物',
  // 糖尿病
  'メトグルコ': 'メトホルミン塩酸塩', 'ジャヌビア': 'シタグリプチンリン酸塩水和物',
  'グラクティブ': 'シタグリプチンリン酸塩水和物', 'フォシーガ': 'ダパグリフロジンプロピレングリコール水和物',
  'ジャディアンス': 'エンパグリフロジン', 'トルリシティ': 'デュラグルチド',
  'アマリール': 'グリメピリド', 'アクトス': 'ピオグリタゾン塩酸塩',
  // ステロイド
  'プレドニン': 'プレドニゾロン', 'メドロール': 'メチルプレドニゾロン',
  'ソル・メドロール': 'メチルプレドニゾロンコハク酸エステルナトリウム',
  'デカドロン': 'デキサメタゾン', 'リンデロン': 'ベタメタゾン',
  // 鎮痛・その他
  'カロナール': 'アセトアミノフェン', 'ロキソニン': 'ロキソプロフェンナトリウム水和物',
  'セレコックス': 'セレコキシブ', 'トラマール': 'トラマドール塩酸塩',
  'リリカ': 'プレガバリン', 'デパケン': 'バルプロ酸ナトリウム',
  'フェノバール': 'フェノバルビタール', 'セルシン': 'ジアゼパム',
  'マイスリー': 'ゾルピデム酒石酸塩', 'レンドルミン': 'ブロチゾラム',
  // 抗凝固・抗血小板
  'ヘパリン': 'ヘパリンナトリウム', 'クレキサン': 'エノキサパリンナトリウム',
  'プロタミン': 'プロタミン硫酸塩',
}

/** 商品名→一般名変換（部分一致対応） */
export function convertToGeneric(brandName: string): string {
  const trimmed = brandName.trim()
  // 完全一致
  if (BRAND_TO_GENERIC[trimmed]) return BRAND_TO_GENERIC[trimmed]
  // 部分一致（「ロセフィン注」→「ロセフィン」）
  for (const [brand, generic] of Object.entries(BRAND_TO_GENERIC)) {
    if (trimmed.includes(brand)) return generic
  }
  return trimmed // 変換できなければそのまま返す
}

/** 処方テキストの一般名一括変換 */
export function convertPrescriptionToGeneric(text: string): string {
  let result = text
  // 長い商品名から順に変換（部分一致の誤変換を防ぐ）
  const sorted = Object.entries(BRAND_TO_GENERIC).sort((a, b) => b[0].length - a[0].length)
  for (const [brand, generic] of sorted) {
    result = result.replace(new RegExp(brand, 'g'), generic)
  }
  return result
}

// ═══════════════════════════════════════
//  疾患別テンプレート（主要疾患から段階的に追加）
// ═══════════════════════════════════════

export const DISEASE_TEMPLATES: DiseaseTemplate[] = [
  // ── 感染症 ──
  {
    disease: '肺炎（市中肺炎）', specialty: 'infectious',
    titleTemplate: '〇〇歳 発熱・咳嗽にて入院した市中肺炎の1例',
    diagnosisTemplate: '#1 市中肺炎\n#2 （合併症があれば記載）',
    chiefComplaintExamples: ['発熱, 咳嗽', '呼吸困難, 発熱', '膿性痰, 発熱'],
    requiredPhysicalExam: ['体温', '脈拍', '血圧', 'SpO2', '呼吸数', '呼吸音（副雑音の有無・部位）', '心音', '腹部所見', '下腿浮腫'],
    requiredLabFindings: ['WBC（分画）', 'CRP', 'PCT', 'BUN', 'Cr', 'LDH', 'Alb', '血液ガス（PaO2, PaCO2, P/F比）', '喀痰培養・グラム染色', '血液培養', '尿中肺炎球菌抗原', '尿中レジオネラ抗原'],
    requiredImaging: ['胸部X線', '胸部CT'],
    problemListTemplate: ['#1 市中肺炎', '#2 （呼吸不全があれば）', '#3 （基礎疾患があれば）'],
    differentialDiagnosis: ['誤嚥性肺炎', '結核', '肺癌', '間質性肺炎', '心不全（肺うっ血）'],
    standardTreatment: ['A-DROP/CURB-65重症度評価', '抗菌薬（CTRX, ABPC/SBT等）', '酸素療法'],
    pubmedQuery: 'community-acquired pneumonia treatment guideline',
    guidelineRef: '日本呼吸器学会 成人肺炎診療ガイドライン 2017',
    typicalMedications: ['レボフロキサシン水和物', 'アモキシシリン水和物'],
  },
  {
    disease: '尿路感染症', specialty: 'infectious',
    titleTemplate: '〇〇歳 発熱・排尿時痛にて入院した急性腎盂腎炎の1例',
    diagnosisTemplate: '#1 急性腎盂腎炎\n#2 （基礎疾患）',
    chiefComplaintExamples: ['発熱, 腰背部痛', '排尿時痛, 発熱', '悪寒戦慄, 発熱'],
    requiredPhysicalExam: ['体温', '脈拍', '血圧', 'CVA叩打痛', '腹部所見', '下腿浮腫'],
    requiredLabFindings: ['WBC（分画）', 'CRP', 'BUN', 'Cr', '尿検査（白血球, 細菌, 亜硝酸塩）', '尿培養', '血液培養'],
    requiredImaging: ['腹部CT（尿路閉塞の評価）'],
    problemListTemplate: ['#1 急性腎盂腎炎', '#2 （尿路結石があれば）'],
    differentialDiagnosis: ['腎結石', '腎膿瘍', '前立腺炎', '骨盤内膿瘍'],
    standardTreatment: ['抗菌薬（CTRX, LVFX等）', '補液', '尿路閉塞があればドレナージ'],
    pubmedQuery: 'acute pyelonephritis treatment',
    guidelineRef: 'JAID/JSC感染症治療ガイドライン 2019 — 尿路感染症',
    typicalMedications: ['セフトリアキソンナトリウム', 'レボフロキサシン水和物'],
  },
  {
    disease: '敗血症', specialty: 'infectious',
    titleTemplate: '〇〇歳 〇〇を原因とした敗血症の1例',
    diagnosisTemplate: '#1 敗血症（感染フォーカス: ）\n#2 （臓器障害があれば）',
    chiefComplaintExamples: ['発熱, 意識障害', '悪寒戦慄, ショック', '発熱, 呼吸困難'],
    requiredPhysicalExam: ['体温', '脈拍', '血圧', '呼吸数', 'SpO2', '意識レベル（GCS/JCS）', '心音', '呼吸音', '腹部所見', '皮膚（末梢冷感, 網状皮斑）', '下腿浮腫'],
    requiredLabFindings: ['WBC（分画）', 'CRP', 'PCT', '乳酸値', 'BUN', 'Cr', 'T-Bil', 'AST', 'ALT', 'Plt', 'PT-INR', 'APTT', 'Dダイマー', 'フィブリノゲン', '血液ガス', '血液培養（2セット）'],
    requiredImaging: ['感染フォーカス検索（CT等）'],
    problemListTemplate: ['#1 敗血症', '#2 敗血症性ショック（該当すれば）', '#3 DIC（該当すれば）', '#4 感染フォーカス'],
    differentialDiagnosis: ['感染性心内膜炎', 'TSS', '副腎不全', 'アナフィラキシー'],
    standardTreatment: ['Sepsis-3定義（SOFA≧2）', 'Hour-1 Bundle', '初期輸液（晶質液30mL/kg）', '広域抗菌薬', '血管収縮薬（ノルアドレナリン）', 'ソースコントロール'],
    pubmedQuery: 'sepsis surviving sepsis campaign guidelines',
    guidelineRef: 'Surviving Sepsis Campaign Guidelines 2021 / 日本版敗血症診療ガイドライン 2020',
  },

  // ── 循環器 ──
  {
    disease: '急性心筋梗塞', specialty: 'cardio',
    titleTemplate: '〇〇歳 胸痛にて搬送された急性心筋梗塞の1例',
    diagnosisTemplate: '#1 急性心筋梗塞（ST上昇型/非ST上昇型, 〇〇壁）\n#2 （合併症: 心不全, 不整脈等）',
    chiefComplaintExamples: ['胸痛', '胸部圧迫感', '呼吸困難, 冷汗'],
    requiredPhysicalExam: ['体温', '脈拍', '血圧（両上肢）', 'SpO2', '心音（III音, IV音, 心雑音）', '呼吸音（湿性ラ音）', '頸静脈怒張', '下腿浮腫', 'Killip分類'],
    requiredLabFindings: ['トロポニン（T/I）', 'CK', 'CK-MB', 'BNP/NT-proBNP', 'WBC', 'CRP', 'BUN', 'Cr', 'AST', 'ALT', 'LDH', '血糖', 'HbA1c', 'LDL-C', 'HDL-C', 'TG', 'PT-INR', 'APTT'],
    requiredImaging: ['12誘導心電図（ST変化）', '心エコー（壁運動異常, EF）', '冠動脈造影（責任病変）'],
    problemListTemplate: ['#1 急性心筋梗塞', '#2 急性心不全（該当すれば）', '#3 冠危険因子（高血圧, 糖尿病, 脂質異常症等）'],
    differentialDiagnosis: ['急性大動脈解離', '肺塞栓症', '心筋炎', 'たこつぼ心筋症', '急性心膜炎'],
    standardTreatment: ['緊急PCI（primary PCI）', 'DAPT（アスピリン+P2Y12阻害薬）', 'β遮断薬', 'ACE阻害薬/ARB', 'スタチン', '心臓リハビリテーション'],
    pubmedQuery: 'acute myocardial infarction STEMI treatment guideline',
    guidelineRef: 'JCS/JHFS 2023 急性冠症候群診療ガイドライン',
    typicalMedications: ['アスピリン', 'クロピドグレル硫酸塩', 'アトルバスタチンカルシウム水和物', 'ビソプロロールフマル酸塩', 'エナラプリルマレイン酸塩'],
  },
  {
    disease: '心不全', specialty: 'cardio',
    titleTemplate: '〇〇歳 呼吸困難にて入院した慢性心不全急性増悪の1例',
    diagnosisTemplate: '#1 慢性心不全急性増悪（NYHA III-IV, EF 〇〇%）\n#2 基礎心疾患（〇〇）',
    chiefComplaintExamples: ['呼吸困難', '起座呼吸', '下腿浮腫, 呼吸困難', '労作時息切れの増悪'],
    requiredPhysicalExam: ['体温', '脈拍', '血圧', 'SpO2', '呼吸数', '心音（III音, 心雑音）', '呼吸音（湿性ラ音）', '頸静脈怒張', '肝腫大', '下腿浮腫', '体重'],
    requiredLabFindings: ['BNP/NT-proBNP', 'トロポニン', 'BUN', 'Cr', 'eGFR', 'Na', 'K', 'Hb', 'AST', 'ALT', 'Alb', 'TSH', 'fT4'],
    requiredImaging: ['胸部X線（心胸比, 肺うっ血, 胸水）', '心エコー（EF, 壁運動, 弁膜症, 拡張能）', '12誘導心電図'],
    problemListTemplate: ['#1 慢性心不全急性増悪', '#2 基礎心疾患', '#3 増悪因子（感染, 不整脈, 服薬アドヒアランス等）'],
    differentialDiagnosis: ['肺炎', '肺塞栓症', 'COPD増悪', '心タンポナーデ', '腎不全'],
    standardTreatment: ['利尿薬（フロセミド）', '酸素療法/NPPV', 'ACE阻害薬/ARB/ARNI', 'β遮断薬', 'MRA', 'SGLT2阻害薬', 'Nohria-Stevenson分類に基づく治療'],
    pubmedQuery: 'heart failure guideline-directed medical therapy GDMT',
    guidelineRef: 'JCS/JHFS 2021 急性・慢性心不全診療ガイドライン',
    typicalMedications: ['フロセミド', 'カルベジロール', 'エナラプリルマレイン酸塩', 'スピロノラクトン', 'エンパグリフロジン'],
  },
  {
    disease: '心房細動', specialty: 'cardio',
    titleTemplate: '〇〇歳 動悸にて受診した心房細動の1例',
    diagnosisTemplate: '#1 心房細動（発作性/持続性/永続性）\n#2 （基礎疾患）',
    chiefComplaintExamples: ['動悸', '脈の不整', '息切れ, 動悸'],
    requiredPhysicalExam: ['脈拍（不整の有無）', '血圧', '心音', '呼吸音', '頸静脈怒張', '下腿浮腫', '甲状腺触診'],
    requiredLabFindings: ['TSH', 'fT4', 'BNP', 'Cr', 'eGFR', 'K', 'Mg', 'PT-INR（抗凝固中）'],
    requiredImaging: ['12誘導心電図', '心エコー（左房径, EF, 弁膜症）', 'ホルター心電図'],
    problemListTemplate: ['#1 心房細動', '#2 脳梗塞リスク評価（CHA2DS2-VASc）', '#3 出血リスク評価（HAS-BLED）'],
    differentialDiagnosis: ['心房粗動', '上室性頻拍', '甲状腺機能亢進症', 'WPW症候群'],
    standardTreatment: ['CHA2DS2-VAScスコアに基づく抗凝固療法', 'レートコントロール（β遮断薬, Ca拮抗薬）', 'リズムコントロール（抗不整脈薬, アブレーション）'],
    pubmedQuery: 'atrial fibrillation anticoagulation rate control rhythm control',
    guidelineRef: 'JCS/JHRS 2020 不整脈薬物治療ガイドライン',
    typicalMedications: ['アピキサバン', 'ビソプロロールフマル酸塩'],
  },

  // ── 消化器 ──
  {
    disease: '消化管出血（上部）', specialty: 'gastro',
    titleTemplate: '〇〇歳 吐血にて搬送された上部消化管出血の1例',
    diagnosisTemplate: '#1 上部消化管出血（胃潰瘍/十二指腸潰瘍/食道静脈瘤等）',
    chiefComplaintExamples: ['吐血', '黒色便', '貧血, 吐血'],
    requiredPhysicalExam: ['体温', '脈拍', '血圧（起立性低血圧）', 'SpO2', '腹部所見', '直腸診（黒色便）', '肝脾腫', '蜘蛛状血管腫', '手掌紅斑'],
    requiredLabFindings: ['Hb', 'Plt', 'BUN', 'Cr', 'BUN/Cr比', 'PT-INR', 'Alb', 'AST', 'ALT', 'T-Bil', '血液型・交差適合試験'],
    requiredImaging: ['上部消化管内視鏡（緊急）'],
    problemListTemplate: ['#1 上部消化管出血', '#2 出血性ショック（該当すれば）', '#3 原因疾患'],
    differentialDiagnosis: ['胃潰瘍', '十二指腸潰瘍', '食道静脈瘤', 'Mallory-Weiss症候群', '胃癌'],
    standardTreatment: ['Glasgow-Blatchford Score', '輸液・輸血', '内視鏡的止血術', 'PPI静注', 'H. pylori除菌'],
    pubmedQuery: 'upper gastrointestinal bleeding endoscopic hemostasis guideline',
    guidelineRef: '日本消化器内視鏡学会 消化性潰瘍出血ガイドライン 2020',
  },

  // ── 腎臓 ──
  {
    disease: '急性腎障害', specialty: 'nephro',
    titleTemplate: '〇〇歳 〇〇を契機に発症した急性腎障害の1例',
    diagnosisTemplate: '#1 急性腎障害（KDIGO Stage 〇）\n#2 原因（腎前性/腎性/腎後性）',
    chiefComplaintExamples: ['乏尿', '浮腫', '全身倦怠感'],
    requiredPhysicalExam: ['体温', '脈拍', '血圧', '尿量', '体重', '浮腫', '脱水の評価（皮膚ツルゴール, 口腔乾燥）'],
    requiredLabFindings: ['BUN', 'Cr', 'eGFR', 'Na', 'K', 'Cl', 'Ca', 'P', 'UA', 'Alb', '尿検査', '尿Na', 'FENa', '尿浸透圧', '血液ガス'],
    requiredImaging: ['腹部エコー（腎サイズ, 水腎症）', '腹部CT'],
    problemListTemplate: ['#1 急性腎障害', '#2 原因検索', '#3 電解質異常（該当すれば）'],
    differentialDiagnosis: ['腎前性（脱水, 心不全）', '腎性（ATN, 間質性腎炎, 糸球体腎炎）', '腎後性（尿路閉塞）'],
    standardTreatment: ['原因治療', '輸液/利尿薬', '電解質補正', '腎代替療法（適応あれば）', 'KDIGO AKI基準'],
    pubmedQuery: 'acute kidney injury KDIGO guideline management',
    guidelineRef: 'KDIGO AKI Clinical Practice Guideline 2012',
  },

  // ── 呼吸器 ──
  {
    disease: '気管支喘息発作', specialty: 'respiratory',
    titleTemplate: '〇〇歳 喘鳴・呼吸困難にて搬送された気管支喘息発作の1例',
    diagnosisTemplate: '#1 気管支喘息発作（中等症/重症/重篤）\n#2 （合併症）',
    chiefComplaintExamples: ['呼吸困難', '喘鳴', '咳嗽, 呼吸困難'],
    requiredPhysicalExam: ['体温', '脈拍', '血圧', 'SpO2', '呼吸数', '呼吸音（wheezes, 呼気延長）', '呼吸補助筋使用', '起座呼吸', '会話の可否'],
    requiredLabFindings: ['WBC（好酸球）', 'CRP', 'IgE', '血液ガス', 'ピークフロー'],
    requiredImaging: ['胸部X線'],
    problemListTemplate: ['#1 気管支喘息発作', '#2 発作誘因', '#3 長期管理の見直し'],
    differentialDiagnosis: ['COPD増悪', '心不全', '気胸', '異物誤嚥', '声帯機能不全'],
    standardTreatment: ['SABA吸入', '全身性ステロイド', '酸素療法', 'イプラトロピウム', 'アミノフィリン', '重症度に応じたステップアップ'],
    pubmedQuery: 'asthma exacerbation acute management guideline',
    guidelineRef: 'JGL 2024 喘息予防・管理ガイドライン',
  },

  // ── 神経 ──
  {
    disease: '脳梗塞', specialty: 'neuro',
    titleTemplate: '〇〇歳 〇〇の突然の出現にて搬送された脳梗塞の1例',
    diagnosisTemplate: '#1 脳梗塞（アテローム血栓性/心原性/ラクナ/TOAST分類）\n#2 （原因: 心房細動等）',
    chiefComplaintExamples: ['右片麻痺', '構音障害', '失語', '突然の右上下肢脱力'],
    requiredPhysicalExam: ['意識レベル（GCS/JCS）', 'NIHSS', '血圧', '脈拍（不整）', '瞳孔', '対光反射', '脳神経', '四肢筋力（MMT）', '腱反射', 'Babinski徴候', '感覚', '共同偏視', '失語', '構音障害'],
    requiredLabFindings: ['血糖', 'HbA1c', 'LDL-C', 'Cr', 'PT-INR', 'APTT', 'Dダイマー', 'BNP', 'CRP'],
    requiredImaging: ['頭部CT（出血除外）', '頭部MRI（DWI, FLAIR, MRA）', '頸動脈エコー', '心エコー', '12誘導心電図', 'ホルター心電図'],
    problemListTemplate: ['#1 脳梗塞（TOAST分類）', '#2 原因精査', '#3 リハビリテーション'],
    differentialDiagnosis: ['脳出血', 'TIA', 'Todd麻痺', '低血糖', '解離性障害'],
    standardTreatment: ['rt-PA静注（4.5時間以内）', '血管内治療（機械的血栓回収）', '抗血小板療法/抗凝固療法', 'edaravone', 'リハビリテーション', '二次予防'],
    pubmedQuery: 'acute ischemic stroke thrombolysis thrombectomy guideline',
    guidelineRef: '日本脳卒中学会 脳卒中治療ガイドライン 2021',
    typicalMedications: ['アスピリン', 'クロピドグレル硫酸塩', 'エダラボン'],
  },

  // ── 血液 ──
  {
    disease: '鉄欠乏性貧血', specialty: 'hematology',
    titleTemplate: '〇〇歳 貧血の精査にて診断された鉄欠乏性貧血の1例',
    diagnosisTemplate: '#1 鉄欠乏性貧血\n#2 原因（〇〇）',
    chiefComplaintExamples: ['倦怠感', '動悸, 息切れ', '顔色不良'],
    requiredPhysicalExam: ['眼瞼結膜（貧血）', '口腔粘膜', '爪（スプーン爪）', '心音（収縮期雑音）', '脾腫'],
    requiredLabFindings: ['Hb', 'MCV', 'MCH', 'MCHC', 'RDW', '網赤血球', '血清鉄', 'TIBC', 'フェリチン', 'TSAT', '便潜血'],
    requiredImaging: ['上下部消化管内視鏡（出血源検索）'],
    problemListTemplate: ['#1 鉄欠乏性貧血', '#2 原因検索（消化管出血, 過多月経等）'],
    differentialDiagnosis: ['慢性疾患に伴う貧血', 'サラセミア', '鉄芽球性貧血', 'ビタミンB12/葉酸欠乏'],
    standardTreatment: ['鉄剤（経口/静注）', '原因治療'],
    pubmedQuery: 'iron deficiency anemia diagnosis treatment',
    guidelineRef: '日本鉄バイオサイエンス学会 鉄剤の適正使用による貧血治療指針 改訂第3版',
    typicalMedications: ['クエン酸第一鉄ナトリウム'],
  },

  // ── 内分泌 ──
  {
    disease: '糖尿病ケトアシドーシス', specialty: 'endo',
    titleTemplate: '〇〇歳 意識障害にて搬送された糖尿病ケトアシドーシスの1例',
    diagnosisTemplate: '#1 糖尿病ケトアシドーシス\n#2 誘因（感染症, 服薬中断等）',
    chiefComplaintExamples: ['意識障害', '嘔気, 嘔吐', '腹痛, 口渇'],
    requiredPhysicalExam: ['意識レベル', '体温', '脈拍', '血圧', '呼吸数', 'SpO2', 'Kussmaul呼吸', '脱水所見', '口腔内乾燥', '皮膚ツルゴール低下', 'アセトン臭'],
    requiredLabFindings: ['血糖', 'HbA1c', '血液ガス（pH, HCO3-, AG）', 'Na', 'K（補正K）', 'Cl', 'BUN', 'Cr', '血清ケトン体', '尿ケトン', '乳酸', '血清浸透圧'],
    requiredImaging: [],
    problemListTemplate: ['#1 糖尿病ケトアシドーシス', '#2 誘因検索', '#3 電解質異常'],
    differentialDiagnosis: ['高浸透圧高血糖症候群', '乳酸アシドーシス', 'アルコール性ケトアシドーシス', '飢餓ケトーシス'],
    standardTreatment: ['生理食塩水大量輸液', 'インスリン持続静注', 'カリウム補充', 'アシドーシス補正', '誘因治療'],
    pubmedQuery: 'diabetic ketoacidosis DKA management protocol',
    guidelineRef: '日本糖尿病学会 糖尿病診療ガイドライン 2024',
  },
]

/** 疾患名からテンプレートを検索 */
export function getTemplateByDisease(disease: string): DiseaseTemplate | undefined {
  return DISEASE_TEMPLATES.find(t => t.disease === disease || disease.includes(t.disease.replace(/（.*）/, '')))
}

/** 領域からテンプレート一覧を取得 */
export function getTemplatesBySpecialty(specialty: string): DiseaseTemplate[] {
  return DISEASE_TEMPLATES.filter(t => t.specialty === specialty)
}

/** PubMed検索URLを生成 */
export function getPubmedSearchUrl(query: string): string {
  return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(query)}&sort=date`
}
