'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import ProGate from '@/components/pro/ProGate'
import FavoriteButton from '@/components/tools/FavoriteButton'
import ProPulseHint from '@/components/pro/ProPulseHint'
import { trackToolUsage } from '@/components/pro/useProStatus'

type Sev = 'ok' | 'wn' | 'dn' | 'neutral'
type TabId = 'cardiac' | 'abdominal' | 'carotid'

interface Finding { id: string; label: string; detail: string; severity: Sev }
interface Category { key: string; title: string; icon?: string; desc: string; findings: Finding[] }

const cardiacCategories: Category[] = [
  {
    key: 'LV', title: '左室機能',
    desc: 'LVEF・壁運動・LVDd/Ds・拡張能',
    findings: [
      { id: 'ef_normal', label: 'LVEF ≧ 50%（正常）', detail: '左室駆出率正常。HFpEFの可能性は否定しないが、収縮機能は保たれている。', severity: 'ok' as Sev },
      { id: 'ef_mild', label: 'LVEF 40-49%（軽度低下）', detail: '左室駆出率軽度低下（HFmrEF）。虚血性心疾患・弁膜症・初期心筋症を鑑別。負荷心エコーや心臓MRIを検討。', severity: 'wn' as Sev },
      { id: 'ef_reduced', label: 'LVEF < 40%（低下）', detail: '左室駆出率低下（HFrEF）。DCM・ICM・心筋炎を鑑別。ARNI/BB/MRA/SGLT2iの4剤導入を検討。ICD/CRT適応も評価。', severity: 'dn' as Sev },
      { id: 'wma_regional', label: '局所壁運動異常あり', detail: '虚血性心疾患を強く示唆。冠動脈支配領域との対応を確認。LAD→前壁・中隔、RCA→下壁、LCx→側壁・後壁。心臓カテーテル検査を検討。', severity: 'dn' as Sev },
      { id: 'lvdd_dilated', label: 'LVDd拡大（> 55mm）', detail: '左室拡張末期径拡大。DCM・陳旧性MI・AR・MRなど容量負荷を鑑別。', severity: 'wn' as Sev },
      { id: 'dd_impaired', label: '拡張障害（E/A<1, DcT延長）', detail: '左室弛緩障害。高血圧性心疾患・肥大型心筋症・加齢性変化を鑑別。E/e\' > 14でLV充満圧上昇を示唆。', severity: 'wn' as Sev },
      { id: 'ee_elevated', label: 'E/e\' > 14（充満圧上昇）', detail: 'E/e\' > 14は左室充満圧上昇を示唆。HFpEFの診断根拠の一つ。利尿薬による前負荷軽減を検討。', severity: 'wn' as Sev },
    ]
  },
  {
    key: 'RV', title: '右室・肺高血圧',
    desc: 'TAPSE・RV拡大・TR-PG・IVC',
    findings: [
      { id: 'rv_normal', label: '右室サイズ・機能 正常', detail: '右室拡大なし、TAPSE > 17mm。右心機能は保たれている。', severity: 'ok' as Sev },
      { id: 'rv_dilated', label: '右室拡大', detail: '右室拡大: 肺高血圧・右室梗塞・PE・ARDS・先天性心疾患を鑑別。D-shapeの有無を確認。', severity: 'wn' as Sev },
      { id: 'tapse_low', label: 'TAPSE < 17mm', detail: 'TAPSE低下は右室収縮障害を示唆。肺高血圧・右室梗塞・心臓手術後を鑑別。', severity: 'dn' as Sev },
      { id: 'trpg_high', label: 'TR-PG > 35mmHg', detail: '肺高血圧の存在を示唆。Group 1-5の鑑別が必要。右心カテーテルでの確認を検討。', severity: 'wn' as Sev },
      { id: 'ivc_dilated', label: 'IVC拡大（> 21mm）/呼吸性変動低下', detail: 'IVC拡大+呼吸性変動低下は右房圧上昇を示唆。RAP 10-15mmHg相当。右心不全・心タンポナーデ・収縮性心膜炎を鑑別。', severity: 'wn' as Sev },
    ]
  },
  {
    key: 'Valve', title: '弁膜症',
    desc: 'AS/AR/MS/MR/TR',
    findings: [
      { id: 'valve_normal', label: '弁膜症なし', detail: '有意な弁膜症を認めない。正常所見。', severity: 'ok' as Sev },
      { id: 'as_severe', label: '重症AS（AVA < 1.0cm², Vmax > 4m/s）', detail: '重症大動脈弁狭窄症。症候性（心不全・失神・狭心症）であればTAVR/SAVRの適応。無症候でもEF低下やBNP上昇は手術考慮。', severity: 'dn' as Sev },
      { id: 'ar_moderate', label: '中等度以上AR', detail: '大動脈弁閉鎖不全症。Vena contracta > 6mm、逆流ジェット面積/LVOT面積 > 25%で重症。LV拡大の進行をフォロー。', severity: 'wn' as Sev },
      { id: 'mr_severe', label: '重症MR', detail: '重症僧帽弁閉鎖不全症。器質性（弁逸脱・リウマチ性）vs 機能性（テザリング）の鑑別が治療方針を左右。外科修復術 or MitraClipを検討。', severity: 'dn' as Sev },
      { id: 'ms_moderate', label: '中等度以上MS（MVA < 1.5cm²）', detail: '僧帽弁狭窄症。リウマチ性が最多。MVA < 1.0cm²で重症。症候性なら弁置換またはPTMC（弁形態良好な場合）。', severity: 'wn' as Sev },
      { id: 'tr_severe', label: '重症TR', detail: '重症三尖弁閉鎖不全症。二次性（肺高血圧・RV拡大による弁輪拡大）が多い。原因治療が基本。', severity: 'wn' as Sev },
      { id: 'ie_vegetation', label: '疣贅（vegetation）', detail: '弁に付着する可動性エコー輝度: 感染性心内膜炎を示唆。血液培養3セット+抗菌薬開始。Duke基準で評価。TEEが感度高い。', severity: 'dn' as Sev },
    ]
  },
  {
    key: 'Peri', title: '心膜・その他',
    desc: '心嚢液・LVH・心腔内血栓・心臓腫瘍',
    findings: [
      { id: 'peri_normal', label: '心嚢液なし', detail: '心嚢液貯留を認めない。正常所見。', severity: 'ok' as Sev },
      { id: 'pe_small', label: '少量心嚢液', detail: '少量心嚢液（拡張期エコーフリースペース < 10mm）。心膜炎・心不全・甲状腺機能低下症・悪性腫瘍を鑑別。経過観察可能なことが多い。', severity: 'wn' as Sev },
      { id: 'pe_large', label: '大量心嚢液 / タンポナーデ所見', detail: '大量心嚢液+右房・右室虚脱+IVC拡大=心タンポナーデ。緊急心嚢穿刺の適応。奇脈（> 10mmHg）、心拍出量低下を確認。', severity: 'dn' as Sev },
      { id: 'lvh', label: '左室肥大（IVSd > 11mm）', detail: '左室壁肥厚: 高血圧性心肥大・HCM・Fabry病・アミロイドーシス・AS後負荷を鑑別。非対称性中隔肥厚(ASH)はHCMを示唆。', severity: 'wn' as Sev },
      { id: 'la_thrombus', label: '心腔内血栓', detail: '左房内血栓（特にLAA）: 心房細動での塞栓リスク。左室内血栓: 前壁MI後に好発。抗凝固療法の適応。', severity: 'dn' as Sev },
    ]
  },
]

const abdominalCategories: Category[] = [
  {
    key: 'liver', title: '肝臓', icon: '🫘', desc: 'サイズ・実質エコー・腫瘤・脈管系',
    findings: [
      { id: 'liver_normal', label: '正常', detail: '肝臓のサイズ・形態・エコーパターン正常。肝内脈管に異常なし。', severity: 'ok' },
      { id: 'hepatomegaly', label: '肝腫大', detail: '肝腫大: うっ血肝（右心不全）・脂肪肝・肝炎・浸潤性疾患（リンパ腫・アミロイドーシス）・Budd-Chiari症候群を鑑別。MCL上で > 15cmが目安。', severity: 'wn' },
      { id: 'fatty_liver', label: '脂肪肝（bright liver）', detail: '肝実質のエコー輝度上昇 + 深部減衰 + 肝内血管の不明瞭化: 脂肪肝。NAFLD/NASHの評価として肝線維化マーカー（FIB-4）・エラストグラフィを検討。', severity: 'wn' },
      { id: 'liver_cirrhosis', label: '肝硬変所見', detail: '肝表面の凹凸不整 + 肝右葉萎縮/尾状葉腫大 + 粗い実質エコー: 肝硬変を示唆。脾腫・腹水・側副血行路の有無を確認。Child-Pugh分類で重症度評価。', severity: 'dn' },
      { id: 'liver_mass', label: '肝腫瘤', detail: '肝腫瘤: 肝細胞癌（肝硬変背景 + モザイクパターン）・転移性肝腫瘍（多発・bull\'s eye）・肝血管腫（高エコー・均一）・肝嚢胞（無エコー）を鑑別。造影CTまたはMRIで精査。', severity: 'dn' },
      { id: 'liver_cyst', label: '肝嚢胞', detail: '単純性肝嚢胞: 薄壁・無エコー・後方エコー増強。通常は良性で経過観察。隔壁・壁肥厚・内部エコーがあれば嚢胞腺腫・膿瘍・包虫嚢胞を鑑別。', severity: 'ok' },
      { id: 'dilated_ihd', label: '肝内胆管拡張', detail: '肝内胆管の拡張（> 2-3mm or 門脈の40%以上）: 閉塞性黄疸。肝門部〜下部胆管の閉塞原因（胆管癌・膵頭部癌・総胆管結石）を検索。', severity: 'dn' },
    ]
  },
  {
    key: 'gb', title: '胆嚢・胆管', icon: '💚', desc: '壁肥厚・結石・ポリープ・総胆管径',
    findings: [
      { id: 'gb_normal', label: '正常', detail: '胆嚢壁は薄く（< 3mm）、内部に結石・ポリープなし。総胆管径正常（< 6mm、胆摘後は < 10mm）。', severity: 'ok' },
      { id: 'gallstones', label: '胆石', detail: '胆嚢内の高エコー結節 + 音響陰影（acoustic shadow）: 胆石。Murphy sign（プローブ圧迫で疼痛）陽性なら急性胆嚢炎を示唆。', severity: 'wn' },
      { id: 'acute_cholecystitis', label: '急性胆嚢炎所見', detail: '胆石 + 胆嚢壁肥厚（> 4mm）+ 胆嚢腫大 + 周囲液体貯留 + Murphy sign陽性: 急性胆嚢炎。東京ガイドライン（TG18）で重症度分類し、早期胆嚢摘出術を検討。', severity: 'dn' },
      { id: 'gb_polyp', label: '胆嚢ポリープ', detail: '胆嚢壁から突出する隆起性病変。10mm以上・広基性・増大傾向は悪性（胆嚢癌）リスク → 胆嚢摘出術。10mm未満は6-12ヶ月毎にフォロー。', severity: 'wn' },
      { id: 'cbd_dilated', label: '総胆管拡張（> 6mm）', detail: '総胆管拡張: 総胆管結石・膵頭部腫瘍・胆管癌・乳頭部腫瘍を鑑別。拡張 + 黄疸 → MRCP or EUSで閉塞部位と原因を精査。', severity: 'dn' },
      { id: 'cbd_stone', label: '総胆管結石', detail: '総胆管内の高エコー + 音響陰影: 総胆管結石。ERCPによる砕石・除石を検討。急性胆管炎（Charcot三徴: 発熱・黄疸・右季肋部痛）の合併に注意。', severity: 'dn' },
    ]
  },
  {
    key: 'pancreas', title: '膵臓', icon: '🟡', desc: '腫大・腫瘤・膵管拡張・石灰化',
    findings: [
      { id: 'pancreas_normal', label: '正常', detail: '膵臓のサイズ・実質エコー正常。主膵管 < 3mm。腫瘤なし。', severity: 'ok' },
      { id: 'pancreas_swelling', label: '膵腫大（びまん性）', detail: 'びまん性膵腫大: 急性膵炎（腹痛 + アミラーゼ/リパーゼ上昇）・自己免疫性膵炎（IgG4上昇・ソーセージ様腫大）を鑑別。', severity: 'dn' },
      { id: 'pancreas_mass', label: '膵腫瘤', detail: '膵臓の限局性低エコー腫瘤: 膵癌（膵頭部に好発・60-70%）・膵管内乳頭粘液性腫瘍（IPMN）・神経内分泌腫瘍・転移性腫瘍を鑑別。造影CT + EUSで精査。', severity: 'dn' },
      { id: 'mpd_dilated', label: '主膵管拡張（> 3mm）', detail: '主膵管拡張: 膵頭部癌による閉塞（double duct sign: 膵管＋胆管の同時拡張）・IPMN・慢性膵炎を鑑別。', severity: 'dn' },
      { id: 'pancreas_calcification', label: '膵石灰化', detail: '膵内の高エコー点状影 + 音響陰影: 慢性膵炎（アルコール性が最多）。膵石による膵管閉塞・膵外分泌機能低下の評価を。', severity: 'wn' },
      { id: 'pancreas_cyst', label: '膵嚢胞性病変', detail: '膵嚢胞: 仮性嚢胞（膵炎後）・IPMN（分枝型: 低リスク、主膵管型: 高リスク）・MCN・SCN・SPN を鑑別。MRI/EUS + 嚢胞液分析で評価。', severity: 'wn' },
    ]
  },
  {
    key: 'kidney', title: '腎臓', icon: '🫘', desc: 'サイズ・水腎症・結石・腫瘤・皮髄境界',
    findings: [
      { id: 'kidney_normal', label: '正常', detail: '両腎のサイズ正常（長径 10-12cm）。皮髄境界明瞭。腎盂拡張なし。', severity: 'ok' },
      { id: 'hydronephrosis', label: '水腎症', detail: '腎盂・腎杯の拡張: 尿管結石（最多）・前立腺肥大・腫瘍による閉塞・VUR を鑑別。Grade I（軽度腎盂拡張）〜 IV（皮質菲薄化）で評価。', severity: 'dn' },
      { id: 'kidney_stone', label: '腎結石', detail: '腎杯・腎盂内の高エコー + 音響陰影: 腎結石。尿管結石では直接描出困難なこともある（水腎症の有無で間接的に判断）。', severity: 'wn' },
      { id: 'kidney_cyst', label: '腎嚢胞', detail: '単純性腎嚢胞（Bosniak I）: 薄壁・無エコー・後方エコー増強。良性。隔壁・石灰化・造影効果があればBosniak分類で悪性リスク評価。', severity: 'ok' },
      { id: 'kidney_mass', label: '腎腫瘤', detail: '腎実質の充実性腫瘤: 腎細胞癌（RCC、エコーパターンは多様）・腎血管筋脂肪腫（AML、高エコー）・オンコサイトーマを鑑別。造影CTで精査。', severity: 'dn' },
      { id: 'kidney_atrophy', label: '腎萎縮', detail: '腎臓の萎縮（< 9cm）+ 皮質菲薄化 + 皮髄境界不明瞭: 慢性腎臓病（CKD）の進行を示唆。片側性なら腎動脈狭窄・先天性低形成も鑑別。', severity: 'wn' },
      { id: 'kidney_size_asymmetry', label: '左右差（> 1.5cm）', detail: '腎臓の左右差: 片側腎動脈狭窄（萎縮側）・先天性低形成・VUR後の瘢痕腎・片側閉塞を鑑別。', severity: 'wn' },
    ]
  },
  {
    key: 'spleen', title: '脾臓', icon: '🟤', desc: '脾腫・腫瘤・副脾',
    findings: [
      { id: 'spleen_normal', label: '正常', detail: '脾臓サイズ正常（長径 < 12cm）。実質エコー均一。', severity: 'ok' },
      { id: 'splenomegaly', label: '脾腫（> 12cm）', detail: '脾腫: 肝硬変（門脈圧亢進）・血液疾患（リンパ腫・白血病・溶血性貧血・骨髄線維症）・感染症（EBV・マラリア・リーシュマニア）・うっ血性（右心不全）を鑑別。', severity: 'wn' },
      { id: 'spleen_mass', label: '脾腫瘤', detail: '脾腫瘤: リンパ腫浸潤（最多）・転移性腫瘍（稀）・血管腫・脾膿瘍・脾梗塞を鑑別。', severity: 'dn' },
    ]
  },
  {
    key: 'aorta', title: '大動脈', icon: '🔴', desc: '径・瘤・解離',
    findings: [
      { id: 'aorta_normal', label: '正常（< 3cm）', detail: '腹部大動脈径 < 3cm。正常。', severity: 'ok' },
      { id: 'aaa', label: '腹部大動脈瘤（≧ 3cm）', detail: '腹部大動脈径 ≧ 3cm: AAA。5.5cm以上（女性5.0cm）は破裂リスク高く、待機的手術の適応。5.5cm未満は6-12ヶ月毎のサーベイランス。急性腹痛＋AAA = 破裂を疑い緊急対応。', severity: 'dn' },
      { id: 'aorta_thrombus', label: '壁在血栓', detail: '大動脈壁在血栓: 塞栓症のリスク。抗凝固療法の適応を検討。', severity: 'wn' },
    ]
  },
  {
    key: 'others', title: 'その他', icon: '📋', desc: '腹水・リンパ節腫大・膀胱',
    findings: [
      { id: 'ascites', label: '腹水', detail: '腹水: 肝硬変（SAAG ≧ 1.1）・癌性腹膜炎（SAAG < 1.1）・心不全・ネフローゼ・結核性を鑑別。腹水穿刺でSAAG・細胞数・蛋白を評価。', severity: 'wn' },
      { id: 'lymphadenopathy', label: '傍大動脈リンパ節腫大', detail: 'リンパ節腫大（短径 > 10mm）: リンパ腫・転移性腫瘍・結核・サルコイドーシスを鑑別。CTで全体的なリンパ節分布を評価。', severity: 'dn' },
      { id: 'bladder_mass', label: '膀胱内腫瘤', detail: '膀胱壁の隆起性病変: 膀胱癌（肉眼的血尿が初発症状のことが多い）・膀胱ポリープを鑑別。膀胱鏡で生検。', severity: 'dn' },
      { id: 'pleural_effusion_e', label: '胸水（右横隔膜上）', detail: '右横隔膜上に液体貯留: 胸水。肝硬変に伴う肝性胸水（右側に好発）・心不全・肺炎随伴性を鑑別。', severity: 'wn' },
    ]
  },
]

const carotidCategories: Category[] = [
  {
    key: 'IMT', title: 'IMT（内膜中膜複合体厚）',
    desc: '動脈硬化の早期評価。総頸動脈遠位壁後壁で計測',
    findings: [
      { id: 'imt_normal', label: 'IMT < 1.0mm（正常）', detail: 'IMT正常。動脈硬化の所見を認めない。ただし危険因子（高血圧・DM・脂質異常・喫煙）が複数ある場合は定期フォロー。', severity: 'ok' as Sev },
      { id: 'imt_thick', label: 'IMT 1.0-1.5mm（肥厚）', detail: 'IMT肥厚: 動脈硬化の初期変化。心血管リスクの上昇を示唆。生活習慣改善+危険因子の治療強化。脂質管理目標の厳格化を検討。', severity: 'wn' as Sev },
      { id: 'imt_plaque', label: 'IMT ≧ 1.5mm or プラーク', detail: 'プラーク: 限局性のIMT肥厚（≧ 1.5mm）。形態評価（表面不整・潰瘍・低輝度→不安定プラーク）が重要。心血管イベントリスク高い。スタチン+抗血小板薬を検討。', severity: 'wn' as Sev },
    ]
  },
  {
    key: 'Plaque', title: 'プラーク性状',
    desc: '安定性・脆弱性の評価（エコー輝度・表面・内部構造）',
    findings: [
      { id: 'plaque_none', label: 'プラークなし', detail: '総頸動脈・内頸動脈・外頸動脈にプラークを認めない。正常所見。', severity: 'ok' as Sev },
      { id: 'plaque_stable', label: '安定プラーク（高輝度・均一・平滑）', detail: '線維性/石灰化プラーク。高輝度で均一な内部構造、表面平滑。塞栓リスクは比較的低い。スタチン継続+定期フォロー。', severity: 'wn' as Sev },
      { id: 'plaque_vulnerable', label: '不安定プラーク（低輝度・不均一・潰瘍）', detail: '脂質コアが豊富な脆弱プラーク。低輝度・不均一な内部構造・表面不整/潰瘍。脳梗塞の塞栓源として高リスク。頸動脈MRI(黒い血)で確認。CEA/CASの適応を評価。', severity: 'dn' as Sev },
      { id: 'plaque_calcified', label: '石灰化プラーク', detail: '後方に音響陰影を伴う高輝度。安定だが高度石灰化は狭窄率の評価を困難にすることがある。CTAやMRAで補完。', severity: 'neutral' as Sev },
    ]
  },
  {
    key: 'Stenosis', title: '狭窄評価',
    desc: 'PSV/EDV・狭窄率・血流パターン',
    findings: [
      { id: 'stenosis_none', label: '有意狭窄なし（< 50%）', detail: '内頸動脈の有意狭窄を認めない。PSV < 125 cm/s。定期フォロー+危険因子管理。', severity: 'ok' as Sev },
      { id: 'stenosis_moderate', label: '中等度狭窄（50-69%）', detail: 'NASCET 50-69%相当。PSV 125-230 cm/s。症候性の場合、CEAの適応あり（NNT約15）。無症候性は薬物治療が基本+フォロー。', severity: 'wn' as Sev },
      { id: 'stenosis_severe', label: '高度狭窄（70-99%）', detail: 'NASCET 70-99%相当。PSV > 230 cm/s、EDV > 100 cm/s。症候性: CEA強く推奨（NNT約6）。無症候性: 薬物治療 or CEA/CAS（施設の手技成績による）。', severity: 'dn' as Sev },
      { id: 'stenosis_occluded', label: '閉塞（100%）', detail: '内頸動脈完全閉塞: 血流シグナルなし。CEAの適応なし。対側の狭窄評価が重要。側副血行路の発達度を評価。脳循環予備能の評価（SPECT等）。', severity: 'dn' as Sev },
      { id: 'ica_eca_ratio', label: 'ICA/CCA PSV比 > 4.0', detail: 'ICA/CCA比の上昇は高度狭窄を示唆。全身的に血流速度が変動する場合（高心拍出量・対側閉塞による代償）にも比が有用。', severity: 'dn' as Sev },
    ]
  },
  {
    key: 'Other', title: 'その他の所見',
    desc: '椎骨動脈・血流方向・解離',
    findings: [
      { id: 'va_normal', label: '椎骨動脈 正常', detail: '両側椎骨動脈の血流正常。左右差なし。', severity: 'ok' as Sev },
      { id: 'va_hypoplasia', label: '椎骨動脈低形成', detail: '一側の椎骨動脈が細い（diameter < 2mm）。先天的変異で比較的多い。対側の椎骨動脈で代償されていれば臨床的意義は低い。', severity: 'neutral' as Sev },
      { id: 'va_reversal', label: '椎骨動脈逆流', detail: '鎖骨下動脈盗血症候群: 鎖骨下動脈の近位部狭窄/閉塞により、同側椎骨動脈の血流が逆転。患側上肢の運動時にめまい・ふらつきが出現。', severity: 'wn' as Sev },
      { id: 'dissection', label: '内膜フラップ/解離所見', detail: '頸動脈解離: 内膜フラップ・偽腔・内膜下血腫を認める。若年〜中年の脳卒中の重要な原因。抗凝固 or 抗血小板療法。MRIで確認。', severity: 'dn' as Sev },
    ]
  },
]

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'cardiac', label: '心臓', icon: '❤️' },
  { id: 'abdominal', label: '腹部', icon: '🫁' },
  { id: 'carotid', label: '頸動脈', icon: '🩸' },
]

const catMap: Record<TabId, Category[]> = {
  cardiac: cardiacCategories,
  abdominal: abdominalCategories,
  carotid: carotidCategories,
}

export default function EchoUnifiedPage() {
  const [tab, setTab] = useState<TabId>('cardiac')
  const [selections, setSelections] = useState<Record<TabId, Set<string>>>({
    cardiac: new Set(), abdominal: new Set(), carotid: new Set(),
  })

  useEffect(() => { trackToolUsage('interpret-echo') }, [])

  const categories = catMap[tab]
  const selected = selections[tab]

  const toggle = (id: string) => setSelections(prev => {
    const n = new Set(prev[tab])
    n.has(id) ? n.delete(id) : n.add(id)
    return { ...prev, [tab]: n }
  })

  const results = useMemo(() => {
    const r: any[] = []
    categories.forEach(cat => cat.findings.filter(f => selected.has(f.id)).forEach(f =>
      r.push({ title: `${cat.title}: ${f.label}`, severity: f.severity, detail: f.detail })
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
        <span>エコー読影</span>
      </nav>
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-block text-sm bg-acl text-ac px-2.5 py-0.5 rounded-full font-medium mb-2">🔬 検査読影</span>
            <h1 className="text-2xl font-bold text-tx mb-1">エコー読影 系統的評価チェックリスト</h1>
            <p className="text-sm text-muted">心臓・腹部・頸動脈エコーの系統的評価。所見チェック→鑑別疾患と推奨アクションを表示。</p>
          </div>
          <ProPulseHint><FavoriteButton slug="interpret-echo" title="エコー読影 系統的評価" /></ProPulseHint>
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
            <h2 className="text-sm font-bold text-tx mb-1">
              {cat.icon && <span className="mr-1">{cat.icon}</span>}{cat.title}
            </h2>
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
        <p>本ツールはエコーの系統的評価を補助するチェックリストです。画像の自動判定は行いません。読影・診断の最終判断は必ず担当医が行ってください。</p>
      </div>
    </div>
  )
}
