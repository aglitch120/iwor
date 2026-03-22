'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'aed',
  category: '精神・神経',
  title: '抗てんかん薬 比較表',
  description: 'レベチラセタム・バルプロ酸・カルバマゼピン・ラモトリギン・ラコサミド・フェニトインの6剤を比較。発作型別選択・TDM・催奇形性・薬物相互作用。',
  columns: ['generic', 'brand', 'halfLife', 'metabolism', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'レベチラセタム (LEV)', brand: 'イーケプラ', specs: '250mg/500mg錠、DS、注', indication: '部分発作、全般発作（ミオクロニー・強直間代）、てんかん重積（注射）', halfLife: '約7時間', metabolism: '血中加水分解（CYP非依存）、腎排泄 66%', renalAdjust: 'CCr < 50: 減量。透析: 補充投与', contraindication: '特になし（過敏症のみ）' },
    { generic: 'バルプロ酸 (VPA)', brand: 'デパケン/セレニカ', specs: '100mg/200mg錠、R錠、シロップ', indication: '全般てんかん（欠神・ミオクロニー・強直間代）、部分発作、躁状態、片頭痛予防', halfLife: '約8-15時間', metabolism: 'グルクロン酸抱合、β酸化、CYP2C9', renalAdjust: '通常不要（肝代謝主体）', contraindication: '重篤な肝障害、尿素サイクル異常症、妊婦（特に第1三半期）' },
    { generic: 'カルバマゼピン (CBZ)', brand: 'テグレトール', specs: '100mg/200mg錠', indication: '部分発作、全般強直間代発作、三叉神経痛、躁状態', halfLife: '約12-17時間（自己誘導後短縮）', metabolism: 'CYP3A4 → エポキシド（活性代謝物）。強力なCYP誘導薬', renalAdjust: '通常不要', contraindication: '房室ブロック、急性間欠性ポルフィリア' },
    { generic: 'ラモトリギン (LTG)', brand: 'ラミクタール', specs: '2mg/5mg/25mg/100mg', indication: '部分発作、全般発作、双極性障害（うつ相の維持療法）', halfLife: '約25-33時間（VPA併用で70時間に延長）', metabolism: 'グルクロン酸抱合（UGT1A4）', renalAdjust: '重度腎障害: 減量', contraindication: '特になし（過敏症のみ）' },
    { generic: 'ラコサミド (LCM)', brand: 'ビムパット', specs: '50mg/100mg錠、注', indication: '部分発作', halfLife: '約13時間', metabolism: 'CYP2C19（一部）、腎排泄 40%', renalAdjust: '重度腎障害・透析: 減量', contraindication: '2度以上の房室ブロック' },
    { generic: 'フェニトイン (PHT)', brand: 'アレビアチン/ヒダントール', specs: '25mg/100mg錠、散、注', indication: '部分発作、全般強直間代発作、てんかん重積', halfLife: '約7-42時間（非線形動態: 用量依存で延長）', metabolism: 'CYP2C9/2C19（飽和動態）', renalAdjust: '低Alb: 遊離型上昇 → 実効濃度に注意', contraindication: '洞性徐脈、房室ブロック、Adams-Stokes症候群' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本神経学会. てんかん診療ガイドライン 2018',
    'Tomson T et al. Antiepileptic drugs and pregnancy outcomes. Lancet Neurol 2019'],
  relatedTools: [
    { href: '/tools/calc/gcs', name: 'GCS' },
    { href: '/compare/bzd', name: 'ベンゾジアゼピン比較' }],
}

export default function AEDComparePage() { return <DrugCompareLayout data={data} /> }
