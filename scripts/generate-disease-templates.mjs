#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
//  疾患別テンプレート一括生成スクリプト
//  J-OSLER 290疾患のテンプレートデータを生成
//  医学的コンセンサスに基づく身体所見・検査項目の選定
// ═══════════════════════════════════════════════════════════════

import fs from 'fs'

// ── 領域別の共通身体所見 ──
const COMMON_PE = {
  base: ['体温', '脈拍', '血圧', 'SpO2'],
  general: ['眼瞼結膜', '眼球結膜', '心音', '呼吸音', '腹部所見', '下腿浮腫'],
  cardio: ['心音（III音, IV音, 心雑音）', '頸静脈怒張', '呼吸音（湿性ラ音）', '下腿浮腫', '末梢冷感'],
  respiratory: ['呼吸数', '呼吸音（副雑音の有無・部位）', '呼吸補助筋使用', '胸郭の動き'],
  gastro: ['腹部所見（圧痛部位, 反跳痛, 筋性防御）', '腸蠕動音', '肝脾腫', '直腸診'],
  nephro: ['浮腫', '体重', '尿量', '脱水所見'],
  hematology: ['眼瞼結膜', 'リンパ節触診', '肝脾腫', '出血傾向（紫斑, 点状出血）'],
  neuro: ['意識レベル（GCS/JCS）', '瞳孔・対光反射', '脳神経', '四肢筋力（MMT）', '腱反射', 'Babinski', '感覚', '共同偏視', '失語', '構音障害', '小脳所見'],
  endo: ['甲状腺触診', '体重', 'BMI', '皮膚所見'],
  infectious: ['体温', '心音', '呼吸音', '腹部所見', '皮膚（発疹）', 'リンパ節'],
  rheumatic: ['関節腫脹・圧痛', '朝のこわばり', '皮膚所見', '爪所見', 'Raynaud現象', '口腔乾燥', '眼乾燥'],
}

// ── 領域別の共通検査項目 ──
const COMMON_LABS = {
  base: ['WBC', 'Hb', 'Plt', 'TP', 'Alb', 'AST', 'ALT', 'BUN', 'Cr', 'Na', 'K', 'CRP'],
  cardio: ['トロポニン', 'BNP/NT-proBNP', 'CK', 'CK-MB', 'LDH', 'D-dimer', 'PT-INR', '12誘導心電図', '心エコー'],
  respiratory: ['血液ガス（PaO2, PaCO2, P/F比）', '喀痰培養・グラム染色', '胸部X線', '胸部CT'],
  gastro: ['T-Bil', 'D-Bil', 'γ-GTP', 'ALP', 'Amy', 'Lipase', 'PT-INR', '腹部CT'],
  nephro: ['eGFR', 'UA', 'Ca', 'P', '尿検査', '尿蛋白定量', '腹部エコー'],
  hematology: ['MCV', 'MCH', 'MCHC', '網赤血球', '血清鉄', 'TIBC', 'フェリチン', 'LDH', 'ハプトグロビン', '直接Coombs', '末梢血塗抹標本'],
  neuro: ['血糖', 'HbA1c', 'PT-INR', 'D-dimer', '頭部CT', '頭部MRI（DWI, FLAIR, MRA）'],
  endo: ['HbA1c', '血糖', 'TSH', 'fT3', 'fT4', 'コルチゾール', 'ACTH'],
  infectious: ['血液培養（2セット）', '尿培養', 'PCT', '胸部X線'],
  rheumatic: ['RF', '抗CCP抗体', 'ANA', '抗dsDNA抗体', '補体（C3, C4, CH50）', 'ESR', 'MMP-3'],
}

// ── 疾患個別データ（290疾患） ──
// specialty, dgName, disease → テンプレートデータ
const DISEASE_DATA = {
  // ═══ 総合内科I（全身性・感染症・救急） ═══
  '不明熱': { chief: ['発熱'], diff: ['感染症', '悪性腫瘍', '膠原病', '薬剤熱'], tx: ['原因検索', '培養提出', '画像検査'], guide: '', query: 'fever of unknown origin FUO diagnosis' },
  '全身性炎症反応症候群': { chief: ['発熱, 頻脈'], diff: ['敗血症', '膵炎', '外傷', '熱傷'], tx: ['SIRS基準', '原因検索', '輸液'], guide: '', query: 'SIRS sepsis criteria' },
  '多臓器不全': { chief: ['意識障害, ショック'], diff: ['敗血症', 'DIC', '急性腎障害'], tx: ['集中治療', 'SOFA評価', '臓器サポート'], guide: '', query: 'multiple organ dysfunction syndrome MODS' },
  '悪液質': { chief: ['体重減少, 食欲不振'], diff: ['悪性腫瘍', '慢性心不全', 'COPD', '慢性腎臓病'], tx: ['栄養療法', '原因治療', '運動療法'], guide: '', query: 'cachexia definition management' },
  '体重減少': { chief: ['体重減少'], diff: ['悪性腫瘍', '甲状腺機能亢進症', '糖尿病', 'うつ病', '吸収不良'], tx: ['原因検索', '栄養評価'], guide: '', query: 'unintentional weight loss differential diagnosis' },

  // 感染症
  '肺炎（市中肺炎）': null, // 既存
  '尿路感染症': null,
  '敗血症': null,
  '感染性心内膜炎': { chief: ['発熱, 心雑音'], diff: ['リウマチ熱', '膠原病', '悪性腫瘍'], tx: ['修正Duke基準', '血液培養', '抗菌薬長期投与', '手術適応評価'], guide: 'JCS 2017 感染性心内膜炎ガイドライン', query: 'infective endocarditis Duke criteria treatment', extraPE: ['新規心雑音', 'Janeway病変', 'Osler結節', '爪下線状出血', '脾腫'], extraLab: ['血液培養（3セット以上）', '経胸壁心エコー', '経食道心エコー', 'RF', '補体'] },
  '結核': { chief: ['咳嗽, 発熱, 盗汗'], diff: ['肺癌', '非結核性抗酸菌症', 'サルコイドーシス'], tx: ['RIPE療法（RFP+INH+PZA+EB）', 'DOT', '接触者検診'], guide: '結核医療の基準 令和3年改正', query: 'pulmonary tuberculosis treatment RIPE', extraLab: ['喀痰抗酸菌塗抹（3連痰）', '喀痰培養', 'QFT/T-SPOT', '胸部CT'] },
  'HIV感染症': { chief: ['発熱, リンパ節腫脹, 体重減少'], diff: ['悪性リンパ腫', '伝染性単核症', '膠原病'], tx: ['ART（抗レトロウイルス療法）', 'CD4フォロー', '日和見感染予防'], guide: 'HIV感染症治療研究会 抗HIV治療ガイドライン', query: 'HIV antiretroviral therapy guideline', extraLab: ['HIV-1/2抗体', 'HIV-RNA定量', 'CD4数', 'HBV/HCV共感染スクリーニング'] },
  '深在性真菌症': { chief: ['発熱（抗菌薬不応）'], diff: ['細菌感染症', '薬剤熱', '悪性腫瘍'], tx: ['抗真菌薬（AMPH-B, MCFG, VRCZ等）', 'ソースコントロール'], guide: '深在性真菌症の診断・治療ガイドライン 2014', query: 'invasive fungal infection diagnosis treatment', extraLab: ['β-D-グルカン', 'アスペルギルス抗原', '血液培養', 'CT'] },
  '寄生虫感染症': { chief: ['発熱, 下痢, 好酸球増多'], diff: ['アレルギー', '好酸球増多症候群', '悪性腫瘍'], tx: ['原虫・蠕虫同定', '駆虫薬'], guide: '', query: 'parasitic infection eosinophilia treatment', extraLab: ['好酸球数', '便虫卵検査', 'IgE', '寄生虫抗体'] },
  '梅毒': { chief: ['皮疹, リンパ節腫脹'], diff: ['薬疹', 'HIV', '悪性リンパ腫'], tx: ['ペニシリン（AMPC, BPG）', '病期分類'], guide: '性感染症診断・治療ガイドライン 2020', query: 'syphilis diagnosis treatment penicillin', extraLab: ['RPR', 'TPHA/FTA-ABS', 'HIV検査'] },

  // ── 循環器 ──
  '急性心筋梗塞': null,
  '心不全': null,
  '心房細動': null,
  '狭心症': { chief: ['労作時胸痛'], diff: ['急性心筋梗塞', '大動脈解離', '肺塞栓症', '逆流性食道炎'], tx: ['冠動脈造影', 'PCI', 'CABG', '薬物療法（硝酸薬, β遮断薬, Ca拮抗薬）'], guide: 'JCS 2022 慢性冠動脈疾患診療ガイドライン', query: 'stable angina coronary artery disease treatment' },
  '大動脈弁疾患': { chief: ['労作時息切れ, 失神'], diff: ['肥大型心筋症', '大動脈解離', '肺高血圧症'], tx: ['弁置換術（SAVR/TAVR）', '内科的管理'], guide: 'JCS 2020 弁膜症ガイドライン', query: 'aortic stenosis TAVR guideline', extraPE: ['心雑音（収縮期駆出性/拡張期灌水様）', '脈圧'], extraLab: ['心エコー（弁口面積, 圧較差, EF）', '心臓カテーテル'] },
  '僧帽弁疾患': { chief: ['労作時息切れ, 動悸'], diff: ['心不全', '肺高血圧症', '心房細動'], tx: ['弁形成術/弁置換術', '利尿薬', '抗凝固療法'], guide: 'JCS 2020 弁膜症ガイドライン', query: 'mitral regurgitation mitral stenosis treatment' },
  '心筋症': { chief: ['呼吸困難, 動悸, 浮腫'], diff: ['虚血性心疾患', '弁膜症', '心筋炎'], tx: ['心不全治療（GDMT）', 'ICD', 'CRT'], guide: 'JCS 2018 心筋症診療ガイドライン', query: 'cardiomyopathy dilated hypertrophic treatment', extraLab: ['心エコー（壁厚, EF, E/e\'）', '心臓MRI', 'BNP', 'ホルター心電図'] },
  '心筋炎': { chief: ['胸痛, 発熱, 呼吸困難'], diff: ['急性心筋梗塞', '心膜炎', '肺塞栓症'], tx: ['循環管理', '補助循環（IABP, ECMO）', '免疫抑制（巨細胞性）'], guide: '', query: 'acute myocarditis diagnosis fulminant management' },
  '心膜炎': { chief: ['胸痛（前傾位で軽減）'], diff: ['急性心筋梗塞', '肺塞栓症', '心筋炎'], tx: ['NSAID', 'コルヒチン', '心タンポナーデ時は心膜穿刺'], guide: '', query: 'acute pericarditis treatment colchicine' },
  '肺高血圧症': { chief: ['労作時呼吸困難'], diff: ['心不全', 'COPD', '肺塞栓症'], tx: ['PDE5阻害薬', 'ERA', 'プロスタサイクリン', '酸素療法'], guide: 'JCS/JRS 2017 肺高血圧症ガイドライン', query: 'pulmonary hypertension classification treatment' },
  '深部静脈血栓症': { chief: ['下肢腫脹, 疼痛'], diff: ['蜂窩織炎', 'Baker嚢腫破裂', '筋肉内出血'], tx: ['抗凝固療法（ヘパリン→DOAC/ワルファリン）', '弾性ストッキング'], guide: 'JCS 2017 肺血栓塞栓症/深部静脈血栓症ガイドライン', query: 'deep vein thrombosis anticoagulation treatment' },
  '肺塞栓症': { chief: ['突然の呼吸困難, 胸痛'], diff: ['急性心筋梗塞', '気胸', '大動脈解離', '肺炎'], tx: ['抗凝固療法', '血栓溶解療法（大量PE）', 'IVCフィルター'], guide: 'JCS 2017 肺血栓塞栓症ガイドライン', query: 'pulmonary embolism diagnosis treatment guideline' },
  '大動脈疾患（大動脈解離）': { chief: ['突然の背部痛, 胸痛'], diff: ['急性心筋梗塞', '肺塞栓症', '気胸'], tx: ['Stanford A型→緊急手術', 'B型→降圧管理', '疼痛管理'], guide: 'JCS 2020 大動脈瘤・大動脈解離ガイドライン', query: 'aortic dissection Stanford classification management', extraPE: ['血圧左右差', '脈拍左右差', '大動脈弁閉鎖不全雑音'], extraLab: ['D-dimer', '造影CT（大動脈）', '心エコー'] },
  '大動脈疾患（大動脈瘤）': { chief: ['偶発的発見, 腹部拍動性腫瘤'], diff: ['大動脈解離', '後腹膜腫瘍'], tx: ['経過観察', 'EVAR/開腹手術（径による）'], guide: 'JCS 2020 大動脈瘤ガイドライン', query: 'abdominal aortic aneurysm screening repair indication' },
  '末梢動脈疾患': { chief: ['間歇性跛行, 安静時疼痛'], diff: ['脊柱管狭窄症', '深部静脈血栓症', '糖尿病性神経障害'], tx: ['抗血小板薬', '運動療法', '血行再建術（PTA/バイパス）'], guide: 'JCS 2022 末梢動脈疾患ガイドライン', query: 'peripheral artery disease claudication treatment', extraPE: ['ABI', '足背動脈触知', '皮膚色調', '潰瘍'] },
  '不整脈（上室性）': { chief: ['動悸, 胸部不快感'], diff: ['心房細動', 'WPW症候群', '心室頻拍'], tx: ['迷走神経刺激', 'ATP急速静注', 'カテーテルアブレーション'], guide: 'JCS/JHRS 2020 不整脈薬物治療ガイドライン', query: 'supraventricular tachycardia SVT treatment ablation' },
  '不整脈（心室性）': { chief: ['動悸, 失神, 心停止'], diff: ['SVT', 'Brugada症候群', 'QT延長症候群'], tx: ['電気的除細動', 'アミオダロン', 'ICD植込み'], guide: 'JCS/JHRS 2020 不整脈非薬物治療ガイドライン', query: 'ventricular tachycardia VT ICD guideline' },
  '徐脈性不整脈': { chief: ['めまい, 失神, 息切れ'], diff: ['迷走神経反射', '甲状腺機能低下症', '薬剤性'], tx: ['ペースメーカー植込み', '原因薬剤中止'], guide: '', query: 'bradycardia pacemaker indication' },
  '高血圧症': { chief: ['頭痛, 無症状（健診指摘）'], diff: ['二次性高血圧（腎血管性, 原発性アルドステロン症, 褐色細胞腫）'], tx: ['生活習慣改善', 'Ca拮抗薬', 'ARB/ACE阻害薬', '利尿薬'], guide: 'JSH 2019 高血圧治療ガイドライン', query: 'hypertension treatment guideline JSH' },
  '動脈硬化': { chief: ['無症状（健診指摘）'], diff: ['冠動脈疾患', '脳血管疾患', '末梢動脈疾患'], tx: ['生活習慣改善', 'スタチン', '抗血小板薬'], guide: '日本動脈硬化学会 動脈硬化性疾患予防ガイドライン 2022', query: 'atherosclerosis prevention statin guideline' },

  // ── 消化器（消化管） ──
  '消化管出血（上部）': null,
  '食道癌': { chief: ['嚥下困難, 体重減少'], diff: ['食道アカラシア', '食道狭窄', '食道裂孔ヘルニア'], tx: ['手術', '化学放射線療法', 'ESD/EMR（早期）'], guide: '食道癌診療ガイドライン 2022', query: 'esophageal cancer treatment guideline' },
  '胃癌': { chief: ['心窩部痛, 体重減少, 貧血'], diff: ['胃潰瘍', 'GIST', '悪性リンパ腫'], tx: ['ESD（早期）', '胃切除+リンパ節郭清', '化学療法'], guide: '胃癌治療ガイドライン 2021', query: 'gastric cancer treatment guideline surgery chemotherapy' },
  '大腸癌': { chief: ['血便, 便通異常, 貧血'], diff: ['大腸ポリープ', '炎症性腸疾患', '虚血性腸炎', '痔疾'], tx: ['内視鏡切除（早期）', '手術', '化学療法'], guide: '大腸癌治療ガイドライン 2024', query: 'colorectal cancer treatment guideline' },
  '炎症性腸疾患（UC）': { chief: ['血性下痢, 腹痛'], diff: ['感染性腸炎', 'Crohn病', '虚血性腸炎'], tx: ['5-ASA', 'ステロイド', '免疫調節薬', '生物学的製剤'], guide: 'IBD診療ガイドライン 2020', query: 'ulcerative colitis treatment biologics guideline' },
  '炎症性腸疾患（CD）': { chief: ['腹痛, 下痢, 体重減少'], diff: ['UC', '腸結核', '虚血性腸炎'], tx: ['栄養療法', '5-ASA', '免疫調節薬', '生物学的製剤'], guide: 'IBD診療ガイドライン 2020', query: 'Crohn disease treatment anti-TNF guideline' },
  '消化性潰瘍': { chief: ['心窩部痛'], diff: ['胃癌', 'GERD', '機能性ディスペプシア'], tx: ['PPI', 'H. pylori除菌', 'NSAIDs中止'], guide: '消化性潰瘍診療ガイドライン 2020', query: 'peptic ulcer H pylori eradication PPI' },
  '逆流性食道炎': { chief: ['胸やけ, 呑酸'], diff: ['狭心症', '食道癌', '好酸球性食道炎'], tx: ['PPI/P-CAB', '生活習慣改善'], guide: 'GERD診療ガイドライン 2021', query: 'GERD treatment PPI guideline' },
  '急性膵炎': { chief: ['上腹部痛（背部放散）, 嘔吐'], diff: ['胆石発作', '消化性潰瘍穿孔', '急性心筋梗塞', '腸間膜虚血'], tx: ['絶食・輸液', '疼痛管理', '重症時はICU管理', 'ERCP（胆石性）'], guide: '急性膵炎診療ガイドライン 2021', query: 'acute pancreatitis management Ranson BISAP', extraLab: ['Amy', 'Lipase', 'CRP', 'Ca', 'LDH', '造影CT（壊死評価）'] },
  '慢性膵炎': { chief: ['上腹部痛（反復）, 脂肪便'], diff: ['膵癌', '自己免疫性膵炎', '機能性ディスペプシア'], tx: ['禁酒', '疼痛管理', '膵酵素補充', 'PERT'], guide: '慢性膵炎診療ガイドライン 2021', query: 'chronic pancreatitis management enzyme replacement' },
  '膵癌': { chief: ['黄疸, 上腹部痛, 体重減少'], diff: ['胆管癌', '慢性膵炎', '自己免疫性膵炎'], tx: ['手術（膵頭十二指腸切除術等）', '化学療法（GEM+nab-PTX, FOLFIRINOX）'], guide: '膵癌診療ガイドライン 2022', query: 'pancreatic cancer FOLFIRINOX gemcitabine guideline' },
  '胆石症': { chief: ['右季肋部痛（食後）'], diff: ['急性胆嚢炎', '胆管炎', '急性膵炎'], tx: ['腹腔鏡下胆嚢摘出術', '内視鏡的結石除去'], guide: '胆石症診療ガイドライン 2021', query: 'cholelithiasis cholecystectomy guideline' },
  '胆嚢炎・胆管炎': { chief: ['右季肋部痛, 発熱, 黄疸'], diff: ['急性膵炎', '肝膿瘍', '胆管癌'], tx: ['抗菌薬', 'ERCP/PTBD（ドレナージ）', '胆嚢摘出術'], guide: 'Tokyo Guidelines 2018 (TG18)', query: 'acute cholecystitis cholangitis Tokyo guideline TG18' },
  '腸閉塞': { chief: ['腹痛, 嘔吐, 排ガス停止'], diff: ['急性膵炎', '消化管穿孔', '虚血性腸炎'], tx: ['絶食・減圧（イレウス管）', '輸液', '手術（絞扼性）'], guide: '', query: 'bowel obstruction ileus management surgery indication' },
  '虚血性腸炎': { chief: ['突然の腹痛, 血性下痢'], diff: ['炎症性腸疾患', '感染性腸炎', '大腸憩室出血'], tx: ['絶食・輸液', '経過観察（多くは自然軽快）'], guide: '', query: 'ischemic colitis management prognosis' },
  '急性虫垂炎': { chief: ['心窩部痛→右下腹部痛'], diff: ['メッケル憩室', '卵巣捻転', '尿管結石'], tx: ['虫垂切除術', '抗菌薬（保存的治療）'], guide: '', query: 'acute appendicitis appendectomy antibiotic treatment' },

  // ── 肝臓 ──
  'ウイルス性肝炎（B型）': { chief: ['全身倦怠感, 黄疸, 肝機能異常'], diff: ['C型肝炎', '自己免疫性肝炎', '薬物性肝障害'], tx: ['核酸アナログ（ETV, TAF）', 'Peg-IFN'], guide: 'B型肝炎治療ガイドライン 2024', query: 'hepatitis B treatment entecavir tenofovir guideline' },
  'ウイルス性肝炎（C型）': { chief: ['肝機能異常（無症状）'], diff: ['B型肝炎', '脂肪肝', 'NASH'], tx: ['DAA（直接作用型抗ウイルス薬）', 'SVR確認'], guide: 'C型肝炎治療ガイドライン 2024', query: 'hepatitis C DAA treatment SVR guideline' },
  '肝硬変': { chief: ['腹水, 黄疸, 浮腫'], diff: ['肝癌', '心不全', 'ネフローゼ症候群'], tx: ['利尿薬', '分岐鎖アミノ酸', '食道静脈瘤対策', '肝移植'], guide: '肝硬変診療ガイドライン 2020', query: 'liver cirrhosis management ascites variceal bleeding', extraPE: ['腹水', '蜘蛛状血管腫', '手掌紅斑', '女性化乳房', '肝性脳症（羽ばたき振戦）'] },
  '肝癌': { chief: ['右季肋部痛, 体重減少, 腹水'], diff: ['転移性肝腫瘍', '肝血管腫', 'FNH'], tx: ['肝切除', 'RFA', 'TACE', '分子標的薬', '肝移植'], guide: '肝癌診療ガイドライン 2021', query: 'hepatocellular carcinoma HCC treatment guideline' },
  'NAFLD/NASH': { chief: ['肝機能異常（無症状）'], diff: ['アルコール性肝疾患', '自己免疫性肝炎', 'ウイルス性肝炎'], tx: ['減量（7%以上）', '運動療法', 'GLP-1RA', 'SGLT2阻害薬'], guide: 'NAFLD/NASH診療ガイドライン 2020', query: 'NAFLD NASH treatment weight loss guideline' },
  '自己免疫性肝炎': { chief: ['肝機能異常, 倦怠感, 黄疸'], diff: ['ウイルス性肝炎', '薬物性肝障害', 'PBC'], tx: ['ステロイド', 'アザチオプリン'], guide: '自己免疫性肝炎診療ガイドライン 2023', query: 'autoimmune hepatitis treatment prednisolone azathioprine' },
  '原発性胆汁性胆管炎': { chief: ['掻痒感, 肝機能異常'], diff: ['PSC', '薬物性胆汁うっ滞', '胆管癌'], tx: ['UDCA', 'ベザフィブラート'], guide: 'PBC診療ガイドライン 2023', query: 'primary biliary cholangitis PBC UDCA treatment' },
  '薬物性肝障害': { chief: ['肝機能異常, 全身倦怠感'], diff: ['ウイルス性肝炎', '自己免疫性肝炎', 'アルコール性肝障害'], tx: ['原因薬剤中止', '対症療法'], guide: '薬物性肝障害診療ガイドライン 2023', query: 'drug-induced liver injury DILI diagnosis management' },
  'アルコール性肝疾患': { chief: ['肝機能異常, 黄疸'], diff: ['NASH', 'ウイルス性肝炎', '自己免疫性肝炎'], tx: ['断酒', '栄養療法', '重症例はステロイド'], guide: '', query: 'alcoholic liver disease hepatitis treatment' },
  '急性肝不全': { chief: ['黄疸, 意識障害, 出血傾向'], diff: ['劇症肝炎', '薬物性肝障害', 'Wilson病', '妊娠性急性脂肪肝'], tx: ['人工肝補助', '血漿交換', '肝移植'], guide: '急性肝不全診療ガイドライン', query: 'acute liver failure fulminant hepatitis transplantation' },

  // ── 腎臓 ──
  '急性腎障害': null,
  '慢性腎臓病': { chief: ['蛋白尿, eGFR低下（健診指摘）'], diff: ['糖尿病性腎症', 'IgA腎症', '高血圧性腎硬化症'], tx: ['原因治療', 'RAS阻害薬', '減塩', 'SGLT2阻害薬', '透析（末期）'], guide: 'CKD診療ガイドライン 2023', query: 'chronic kidney disease CKD management SGLT2 guideline' },
  'ネフローゼ症候群': { chief: ['浮腫, 蛋白尿'], diff: ['微小変化型', '膜性腎症', '巣状分節性糸球体硬化症', '糖尿病性腎症'], tx: ['ステロイド', '免疫抑制薬', '利尿薬', 'ACE阻害薬'], guide: 'ネフローゼ症候群診療ガイドライン 2020', query: 'nephrotic syndrome treatment minimal change membranous' },
  '糸球体腎炎': { chief: ['血尿, 蛋白尿, 浮腫, 高血圧'], diff: ['IgA腎症', 'ANCA関連腎炎', 'ループス腎炎', '膜性増殖性糸球体腎炎'], tx: ['腎生検', 'ステロイド', '免疫抑制薬'], guide: 'エビデンスに基づくIgA腎症診療ガイドライン 2020', query: 'glomerulonephritis IgA nephropathy treatment biopsy' },
  '透析関連': { chief: ['倦怠感, 浮腫, 食欲不振'], diff: ['心不全', '貧血', '電解質異常'], tx: ['血液透析', '腹膜透析', 'バスキュラーアクセス管理'], guide: '', query: 'hemodialysis vascular access management' },
  '電解質異常（Na）': { chief: ['意識障害, けいれん, 倦怠感'], diff: ['SIADH', '心不全', '肝硬変', '腎不全'], tx: ['原因検索', '補正速度管理（ODS予防）', '3%NaCl/水制限'], guide: '', query: 'hyponatremia hypernatremia correction rate ODS' },
  '電解質異常（K）': { chief: ['脱力, 不整脈'], diff: ['腎不全', '副腎不全', '薬剤性', 'RTA'], tx: ['高K：GI療法, Ca, ポリスチレン', '低K：K補充, 原因検索'], guide: '', query: 'hyperkalemia hypokalemia management ECG' },
  '酸塩基平衡異常': { chief: ['呼吸困難, 意識障害'], diff: ['DKA', '乳酸アシドーシス', '腎性', '呼吸性'], tx: ['原因治療', 'AG計算', 'Winter式', 'Delta-Delta'], guide: '', query: 'metabolic acidosis anion gap differential diagnosis' },

  // ── 呼吸器 ──
  '気管支喘息発作': null,
  'COPD': { chief: ['労作時呼吸困難, 慢性咳嗽'], diff: ['喘息', '心不全', '間質性肺炎', '肺癌'], tx: ['禁煙', 'LAMA', 'LABA', 'ICS（ACO）', '呼吸リハビリ'], guide: 'GOLD 2024 / JRS COPD診療ガイドライン 2022', query: 'COPD GOLD guideline LAMA LABA treatment' },
  '間質性肺炎': { chief: ['乾性咳嗽, 労作時呼吸困難'], diff: ['心不全', 'COPD', '肺癌', '過敏性肺炎'], tx: ['抗線維化薬（ニンテダニブ, ピルフェニドン）', '酸素療法', '肺移植'], guide: '特発性間質性肺炎診断と治療の手引き 2022', query: 'idiopathic pulmonary fibrosis IPF antifibrotic treatment' },
  '肺癌': { chief: ['咳嗽, 血痰, 体重減少'], diff: ['肺結核', '肺膿瘍', '転移性肺腫瘍'], tx: ['手術', '化学療法', '免疫チェックポイント阻害薬', '放射線療法'], guide: '肺癌診療ガイドライン 2024', query: 'lung cancer NSCLC immunotherapy guideline' },
  '気胸': { chief: ['突然の胸痛, 呼吸困難'], diff: ['肺塞栓症', '急性心筋梗塞', '肋骨骨折'], tx: ['安静経過観察', '胸腔ドレーン', '手術（再発時）'], guide: '気胸に関するガイドライン', query: 'pneumothorax chest tube management' },
  '胸水': { chief: ['呼吸困難, 咳嗽'], diff: ['心不全', '肝硬変', '悪性胸水', '膿胸', '結核性胸膜炎'], tx: ['Light基準', '胸腔穿刺・ドレナージ', '原因治療'], guide: '', query: 'pleural effusion Light criteria thoracentesis' },
  '肺炎（院内肺炎・人工呼吸器関連）': { chief: ['発熱, 膿性痰, 酸素化悪化'], diff: ['心不全', 'ARDS', '肺塞栓症'], tx: ['広域抗菌薬', 'MRSA/緑膿菌カバー', 'de-escalation'], guide: '成人院内肺炎・医療介護関連肺炎診療ガイドライン 2017', query: 'hospital-acquired pneumonia VAP treatment guideline' },
  '誤嚥性肺炎': { chief: ['発熱, 咳嗽, 嚥下障害'], diff: ['市中肺炎', '肺結核', '肺癌'], tx: ['抗菌薬', '嚥下リハビリ', '口腔ケア', '禁食/食形態調整'], guide: '', query: 'aspiration pneumonia dysphagia management prevention' },

  // ── 血液 ──
  '鉄欠乏性貧血': null,
  '巨赤芽球性貧血': { chief: ['倦怠感, 舌炎, 四肢しびれ'], diff: ['鉄欠乏性貧血', 'MDS', 'AA'], tx: ['VB12筋注', '葉酸補充'], guide: '', query: 'megaloblastic anemia vitamin B12 folate deficiency' },
  '溶血性貧血': { chief: ['貧血, 黄疸'], diff: ['肝疾患', 'Gilbert症候群', 'MDS'], tx: ['ステロイド（AIHA）', '脾摘', '原因治療'], guide: '', query: 'hemolytic anemia autoimmune warm cold AIHA treatment' },
  '再生不良性貧血': { chief: ['汎血球減少, 出血傾向, 感染'], diff: ['MDS', '白血病', 'PNH'], tx: ['免疫抑制療法（ATG+CsA）', '造血幹細胞移植', 'エルトロンボパグ'], guide: '再生不良性貧血診療の参照ガイド 2023', query: 'aplastic anemia ATG cyclosporine eltrombopag treatment' },
  '白血病（急性）': { chief: ['発熱, 出血傾向, 貧血'], diff: ['MDS', '悪性リンパ腫', '伝染性単核症'], tx: ['化学療法', '造血幹細胞移植', 'ATRA（APL）'], guide: '造血器腫瘍診療ガイドライン', query: 'acute leukemia AML ALL treatment guideline' },
  '白血病（慢性）': { chief: ['無症状（WBC増多）, 脾腫'], diff: ['類白血病反応', 'MPN', '悪性リンパ腫'], tx: ['CML：TKI（イマチニブ等）', 'CLL：FCR, イブルチニブ'], guide: '', query: 'chronic myeloid leukemia CML TKI imatinib treatment' },
  '悪性リンパ腫': { chief: ['リンパ節腫脹, 発熱, 盗汗, 体重減少'], diff: ['反応性リンパ節腫脹', '結核', '悪性腫瘍転移'], tx: ['化学療法（R-CHOP等）', '放射線療法', '造血幹細胞移植'], guide: '造血器腫瘍診療ガイドライン', query: 'non-Hodgkin lymphoma DLBCL R-CHOP treatment' },
  '多発性骨髄腫': { chief: ['腰痛, 貧血, 腎障害'], diff: ['骨転移', 'MGUS', 'WM'], tx: ['VRd（ボルテゾミブ+レナリドミド+デキサメタゾン）', '自家移植'], guide: '造血器腫瘍診療ガイドライン', query: 'multiple myeloma bortezomib lenalidomide treatment' },
  'DIC': { chief: ['出血傾向, 臓器障害'], diff: ['TTP', 'HUS', 'HELLP症候群'], tx: ['原因治療', 'トロンボモジュリン', 'AT III', 'ヘパリン'], guide: '日本血栓止血学会 DIC診断基準 2017', query: 'disseminated intravascular coagulation DIC treatment' },
  'ITP': { chief: ['紫斑, 点状出血, 出血傾向'], diff: ['DIC', 'TTP', '薬剤性血小板減少症', '偽性血小板減少症'], tx: ['ステロイド', '脾摘', 'TPO受容体作動薬', 'IVIG'], guide: '成人ITP治療の参照ガイド 2019', query: 'immune thrombocytopenia ITP treatment thrombopoietin' },

  // ── 内分泌 ──
  '糖尿病ケトアシドーシス': null,
  '糖尿病（2型）': { chief: ['口渇, 多飲, 多尿, 体重減少'], diff: ['1型糖尿病', '二次性糖尿病', '甲状腺機能亢進症'], tx: ['生活習慣改善', 'メトホルミン', 'SGLT2阻害薬', 'GLP-1RA', 'インスリン'], guide: '糖尿病診療ガイドライン 2024', query: 'type 2 diabetes treatment metformin SGLT2 GLP1 guideline' },
  '糖尿病（1型）': { chief: ['急性発症の口渇, 多飲, 体重減少'], diff: ['2型糖尿病', 'DKA', '劇症1型'], tx: ['インスリン強化療法', 'CSII', 'CGM'], guide: '', query: 'type 1 diabetes insulin therapy intensive management' },
  '甲状腺機能亢進症': { chief: ['動悸, 体重減少, 手指振戦, 発汗'], diff: ['甲状腺クリーゼ', '不安障害', '褐色細胞腫'], tx: ['チアマゾール/PTU', 'RI治療', '手術'], guide: '甲状腺疾患診断ガイドライン 2021', query: 'Graves disease hyperthyroidism antithyroid drug treatment' },
  '甲状腺機能低下症': { chief: ['倦怠感, 体重増加, 浮腫, 便秘'], diff: ['うつ病', '貧血', '心不全'], tx: ['レボチロキシン補充'], guide: '', query: 'hypothyroidism levothyroxine replacement therapy' },
  '副腎不全': { chief: ['倦怠感, 体重減少, 低血圧, 色素沈着'], diff: ['敗血症', '甲状腺機能低下症', '脱水'], tx: ['ヒドロコルチゾン補充', 'ストレス時増量', 'シックデイルール'], guide: '', query: 'adrenal insufficiency Addison disease cortisol replacement' },
  '原発性アルドステロン症': { chief: ['高血圧（治療抵抗性）, 低K血症'], diff: ['本態性高血圧', '腎血管性高血圧', 'Cushing症候群'], tx: ['MR拮抗薬（スピロノラクトン）', '腹腔鏡下副腎摘出（腺腫）'], guide: '', query: 'primary aldosteronism screening diagnosis treatment' },
  '褐色細胞腫': { chief: ['発作性高血圧, 頭痛, 発汗, 動悸'], diff: ['本態性高血圧', '甲状腺機能亢進症', '不安障害'], tx: ['α遮断薬→β遮断薬→手術'], guide: '', query: 'pheochromocytoma diagnosis catecholamine alpha blockade surgery' },
  '下垂体疾患': { chief: ['視野障害, 乳汁分泌, 無月経, 成長障害'], diff: ['頭蓋咽頭腫', '転移性腫瘍', 'サルコイドーシス'], tx: ['手術（経蝶形骨洞）', '薬物療法', 'ホルモン補充'], guide: '', query: 'pituitary adenoma prolactinoma acromegaly treatment' },
  '脂質異常症': { chief: ['無症状（健診指摘）'], diff: ['家族性高コレステロール血症', '二次性'], tx: ['生活習慣改善', 'スタチン', 'エゼチミブ', 'PCSK9阻害薬'], guide: '動脈硬化性疾患予防ガイドライン 2022', query: 'dyslipidemia statin treatment LDL cholesterol guideline' },
  '高尿酸血症・痛風': { chief: ['関節痛（足趾MTP）, 腎結石'], diff: ['偽痛風', '化膿性関節炎', '反応性関節炎'], tx: ['急性期: コルヒチン, NSAID', '慢性期: フェブキソスタット, アロプリノール'], guide: '高尿酸血症・痛風の治療ガイドライン 2022', query: 'gout hyperuricemia urate-lowering therapy guideline' },
  '骨粗鬆症': { chief: ['腰背部痛, 脆弱性骨折'], diff: ['骨転移', '多発性骨髄腫', '原発性副甲状腺機能亢進症'], tx: ['ビスホスホネート', 'デノスマブ', 'テリパラチド', 'ビタミンD/Ca'], guide: '骨粗鬆症の予防と治療ガイドライン 2024', query: 'osteoporosis bisphosphonate denosumab treatment guideline' },
  '肥満症': { chief: ['体重増加, 健康障害'], diff: ['甲状腺機能低下症', 'Cushing症候群', '薬剤性'], tx: ['生活習慣改善', 'GLP-1RA', '肥満外科手術'], guide: '肥満症診療ガイドライン 2022', query: 'obesity management GLP1 bariatric surgery guideline' },

  // ── 膠原病 ──
  '関節リウマチ': { chief: ['多関節痛, 朝のこわばり'], diff: ['変形性関節症', 'SLE', 'RS3PE症候群'], tx: ['MTX', '生物学的製剤', 'JAK阻害薬'], guide: '関節リウマチ診療ガイドライン 2020', query: 'rheumatoid arthritis methotrexate biologics treatment guideline' },
  'SLE': { chief: ['発熱, 関節痛, 皮疹, 蛋白尿'], diff: ['関節リウマチ', '薬剤性ループス', '感染性心内膜炎'], tx: ['ヒドロキシクロロキン', 'ステロイド', '免疫抑制薬'], guide: 'SLE診療ガイドライン 2019', query: 'systemic lupus erythematosus SLE treatment hydroxychloroquine' },
  '血管炎': { chief: ['発熱, 体重減少, 多臓器障害'], diff: ['感染症', '悪性腫瘍', 'SLE'], tx: ['ステロイド', 'シクロホスファミド', 'リツキシマブ'], guide: 'ANCA関連血管炎診療ガイドライン 2023', query: 'ANCA vasculitis GPA MPA treatment rituximab guideline' },
  '多発性筋炎・皮膚筋炎': { chief: ['近位筋力低下, 皮疹'], diff: ['甲状腺機能低下症', '薬剤性ミオパチー', '悪性腫瘍'], tx: ['ステロイド', '免疫抑制薬', '悪性腫瘍スクリーニング'], guide: '', query: 'polymyositis dermatomyositis treatment prognosis' },
  '強皮症': { chief: ['Raynaud現象, 皮膚硬化, 嚥下障害'], diff: ['好酸球性筋膜炎', '混合性結合組織病'], tx: ['臓器別対症療法', 'PDE5阻害薬（Raynaud）', 'PPI（GERD）'], guide: '', query: 'systemic sclerosis scleroderma Raynaud treatment' },
  'シェーグレン症候群': { chief: ['口腔乾燥, 眼乾燥, 関節痛'], diff: ['IgG4関連疾患', 'サルコイドーシス', '薬剤性'], tx: ['対症療法（人工唾液, 点眼）', 'ステロイド（臓器病変）'], guide: '', query: 'Sjogren syndrome dry eye dry mouth treatment' },

  // ── 神経 ──
  '脳梗塞': null,
  '脳出血': { chief: ['突然の頭痛, 意識障害, 片麻痺'], diff: ['脳梗塞', 'くも膜下出血', '脳腫瘍'], tx: ['血圧管理', '外科的血腫除去（適応あれば）', 'リハビリ'], guide: '脳卒中治療ガイドライン 2021', query: 'intracerebral hemorrhage blood pressure management surgery' },
  'くも膜下出血': { chief: ['突然の激しい頭痛'], diff: ['片頭痛', '髄膜炎', '脳出血'], tx: ['脳動脈瘤クリッピング/コイリング', '脳血管攣縮予防（ファスジル）', '水頭症管理'], guide: '脳卒中治療ガイドライン 2021', query: 'subarachnoid hemorrhage aneurysm clipping coiling vasospasm' },
  'てんかん': { chief: ['けいれん, 意識消失'], diff: ['失神', '心因性非てんかん発作', '低血糖'], tx: ['抗てんかん薬（レベチラセタム, バルプロ酸等）', '発作型に応じた薬剤選択'], guide: 'てんかん診療ガイドライン 2018', query: 'epilepsy antiseizure medication levetiracetam guideline' },
  'パーキンソン病': { chief: ['安静時振戦, 筋強剛, 動作緩慢'], diff: ['パーキンソン症候群', '本態性振戦', 'レビー小体型認知症'], tx: ['L-DOPA', 'ドパミンアゴニスト', 'MAO-B阻害薬'], guide: 'パーキンソン病診療ガイドライン 2018', query: 'Parkinson disease levodopa dopamine agonist guideline' },
  '認知症': { chief: ['物忘れ, 生活機能低下'], diff: ['Alzheimer病', '血管性認知症', 'レビー小体型認知症', '前頭側頭型認知症', '正常圧水頭症'], tx: ['コリンエステラーゼ阻害薬', 'メマンチン', '非薬物療法'], guide: '認知症疾患診療ガイドライン 2017', query: 'dementia Alzheimer donepezil memantine treatment guideline' },
  '髄膜炎': { chief: ['発熱, 頭痛, 項部硬直'], diff: ['くも膜下出血', '脳膿瘍', '脳炎'], tx: ['抗菌薬（CTRX+VCM+ABPC）', 'デキサメタゾン', '髄液検査'], guide: '細菌性髄膜炎診療ガイドライン 2014', query: 'bacterial meningitis empirical antibiotic dexamethasone' },
  '脳炎': { chief: ['発熱, 意識障害, けいれん'], diff: ['髄膜炎', '代謝性脳症', 'NMOSD'], tx: ['アシクロビル（HSV脳炎）', 'ステロイドパルス（自己免疫性）'], guide: '', query: 'encephalitis herpes simplex autoimmune treatment' },
  '多発性硬化症': { chief: ['視力障害, 四肢脱力, しびれ（再発寛解）'], diff: ['NMOSD', '脊髄炎', '脳腫瘍'], tx: ['ステロイドパルス（急性期）', 'DMD（IFN-β, フィンゴリモド等）'], guide: '多発性硬化症・視神経脊髄炎スペクトラム障害診療ガイドライン 2023', query: 'multiple sclerosis disease-modifying therapy fingolimod' },
  '重症筋無力症': { chief: ['眼瞼下垂, 複視, 筋力低下（夕方増悪）'], diff: ['Lambert-Eaton症候群', '眼窩腫瘍', '甲状腺眼症'], tx: ['コリンエステラーゼ阻害薬', 'ステロイド', '免疫抑制薬', '胸腺摘出術', 'IVIG/血漿交換（クリーゼ）'], guide: '重症筋無力症診療ガイドライン 2022', query: 'myasthenia gravis treatment thymectomy pyridostigmine' },
  'ギラン・バレー症候群': { chief: ['四肢脱力（上行性）, 腱反射消失'], diff: ['CIDP', '横断性脊髄炎', '多発性硬化症'], tx: ['IVIG', '血漿交換', '呼吸管理'], guide: '', query: 'Guillain-Barre syndrome IVIG plasmapheresis treatment' },
  '頭痛（片頭痛・緊張型）': { chief: ['頭痛'], diff: ['くも膜下出血', '髄膜炎', '脳腫瘍', '緑内障'], tx: ['トリプタン（急性期）', '予防薬（バルプロ酸, β遮断薬, CGRP抗体）'], guide: '頭痛の診療ガイドライン 2021', query: 'migraine tension headache triptan CGRP prevention' },
  '末梢神経障害': { chief: ['四肢しびれ, 筋力低下'], diff: ['糖尿病性', 'VB12欠乏', 'CIDP', '圧迫性'], tx: ['原因治療', '疼痛管理（プレガバリン等）'], guide: '', query: 'peripheral neuropathy diabetic treatment pregabalin' },
}

// ── メインのテンプレート生成ロジック ──
function getSpecialtyPE(spId) {
  const cardioSps = ['cardio', 'cardio2']
  const gastroSps = ['gastro', 'gastroSub']
  const nephroSps = ['nephro']
  const hematoSps = ['hematology']
  const neuroSps = ['neuro']
  const endoSps = ['endo', 'metabolic']
  const infectSps = ['infectious']
  const rheuSps = ['rheumatic', 'allergy']
  const respSps = ['respiratory']

  if (cardioSps.some(s => spId.includes(s) || spId === 'cardio')) return 'cardio'
  if (gastroSps.some(s => spId.includes(s) || spId === 'gastro')) return 'gastro'
  if (nephroSps.some(s => spId.includes(s) || spId === 'nephro')) return 'nephro'
  if (hematoSps.some(s => spId.includes(s) || spId === 'hematology')) return 'hematology'
  if (neuroSps.some(s => spId.includes(s) || spId === 'neuro')) return 'neuro'
  if (endoSps.some(s => spId.includes(s) || spId === 'endo')) return 'endo'
  if (infectSps.some(s => spId.includes(s) || spId === 'infectious')) return 'infectious'
  if (rheuSps.some(s => spId.includes(s) || spId === 'rheumatic')) return 'rheumatic'
  if (respSps.some(s => spId.includes(s) || spId === 'respiratory')) return 'respiratory'
  return 'general'
}

function generateTemplate(disease, spId) {
  const data = DISEASE_DATA[disease]
  if (data === null) return null // Already in existing templates
  if (!data) {
    // Generate a generic template based on specialty
    const peKey = getSpecialtyPE(spId)
    return {
      disease,
      specialty: spId,
      titleTemplate: `〇〇歳 〇〇にて入院した${disease}の1例`,
      diagnosisTemplate: `#1 ${disease}`,
      chiefComplaintExamples: [],
      requiredPhysicalExam: [...COMMON_PE.base, ...(COMMON_PE[peKey] || COMMON_PE.general)],
      requiredLabFindings: [...COMMON_LABS.base, ...(COMMON_LABS[peKey] || [])],
      requiredImaging: [],
      problemListTemplate: [`#1 ${disease}`],
      differentialDiagnosis: [],
      standardTreatment: [],
      pubmedQuery: `${disease} treatment guideline`.replace(/（.*?）/g, ''),
    }
  }

  const peKey = getSpecialtyPE(spId)
  const basePE = [...COMMON_PE.base, ...(COMMON_PE[peKey] || COMMON_PE.general)]
  const baseLab = [...COMMON_LABS.base, ...(COMMON_LABS[peKey] || [])]

  return {
    disease,
    specialty: spId,
    titleTemplate: `〇〇歳 ${(data.chief || ['〇〇'])[0]}にて入院した${disease}の1例`,
    diagnosisTemplate: `#1 ${disease}`,
    chiefComplaintExamples: data.chief || [],
    requiredPhysicalExam: data.extraPE ? [...basePE, ...data.extraPE] : basePE,
    requiredLabFindings: data.extraLab ? [...baseLab, ...data.extraLab] : baseLab,
    requiredImaging: [],
    problemListTemplate: [`#1 ${disease}`],
    differentialDiagnosis: data.diff || [],
    standardTreatment: data.tx || [],
    pubmedQuery: data.query || `${disease} treatment`,
    guidelineRef: data.guide || undefined,
    typicalMedications: undefined,
  }
}

// ── josler-data.ts からの全疾患抽出 ──
const joslerContent = fs.readFileSync('lib/josler-data.ts', 'utf8')
const allLines = joslerContent.split('\n')
let currentSp = ''
const allDiseases = []
const dgLineRegex = /\{ id: "(\w+)", name: "([^"]+)"(?:,\s*gc: "[^"]*")?,\s*diseases: \[([^\]]+)\]/

for (const line of allLines) {
  const spMatch = line.match(/^\s+(\w+):\s*\[$/)
  if (spMatch) currentSp = spMatch[1]
  const dgMatch = line.match(dgLineRegex)
  if (dgMatch && currentSp) {
    const disNames = dgMatch[3].match(/"([^"]+)"/g)?.map(d => d.replace(/"/g, '')) || []
    disNames.forEach(d => allDiseases.push({ sp: currentSp, disease: d }))
  }
}

// ── テンプレート生成 ──
const templates = []
const existing = new Set(['肺炎（市中肺炎）', '尿路感染症', '敗血症', '急性心筋梗塞', '心不全', '心房細動', '消化管出血（上部）', '急性腎障害', '気管支喘息発作', '脳梗塞', '鉄欠乏性貧血', '糖尿病ケトアシドーシス'])

for (const { sp, disease } of allDiseases) {
  if (existing.has(disease)) continue
  const tmpl = generateTemplate(disease, sp)
  if (tmpl) templates.push(tmpl)
}

// ── TypeScript出力 ──
let output = `// ═══════════════════════════════════════════════════════════════
//  疾患別テンプレート — 自動生成分（${templates.length}疾患）
//  generate-disease-templates.mjs で生成
//  最終生成: ${new Date().toISOString().split('T')[0]}
// ═══════════════════════════════════════════════════════════════

import type { DiseaseTemplate } from './josler-templates'

export const GENERATED_TEMPLATES: DiseaseTemplate[] = [\n`

for (const t of templates) {
  output += `  {\n`
  output += `    disease: ${JSON.stringify(t.disease)}, specialty: ${JSON.stringify(t.specialty)},\n`
  output += `    titleTemplate: ${JSON.stringify(t.titleTemplate)},\n`
  output += `    diagnosisTemplate: ${JSON.stringify(t.diagnosisTemplate)},\n`
  output += `    chiefComplaintExamples: ${JSON.stringify(t.chiefComplaintExamples)},\n`
  output += `    requiredPhysicalExam: ${JSON.stringify(t.requiredPhysicalExam)},\n`
  output += `    requiredLabFindings: ${JSON.stringify(t.requiredLabFindings)},\n`
  output += `    requiredImaging: ${JSON.stringify(t.requiredImaging)},\n`
  output += `    problemListTemplate: ${JSON.stringify(t.problemListTemplate)},\n`
  output += `    differentialDiagnosis: ${JSON.stringify(t.differentialDiagnosis)},\n`
  output += `    standardTreatment: ${JSON.stringify(t.standardTreatment)},\n`
  output += `    pubmedQuery: ${JSON.stringify(t.pubmedQuery)},\n`
  if (t.guidelineRef) output += `    guidelineRef: ${JSON.stringify(t.guidelineRef)},\n`
  if (t.typicalMedications) output += `    typicalMedications: ${JSON.stringify(t.typicalMedications)},\n`
  output += `  },\n`
}

output += `]\n`

fs.writeFileSync('lib/josler-templates-generated.ts', output)
console.log(`Generated ${templates.length} disease templates`)
console.log(`Existing (hand-crafted): ${existing.size}`)
console.log(`Total: ${templates.length + existing.size}`)
