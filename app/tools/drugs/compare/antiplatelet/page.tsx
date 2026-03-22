'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'antiplatelet',
  category: '循環器',
  title: '抗血小板薬 比較表',
  description: 'アスピリン・クロピドグレル・プラスグレル・チカグレロル・シロスタゾール・サルポグレラートの6剤を比較。DAPT選択・CYP2C19多型・出血リスク。',
  columns: ['generic', 'brand', 'halfLife', 'metabolism', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'アスピリン', brand: 'バイアスピリン', specs: '100mg', indication: '虚血性心疾患・脳血管障害の二次予防、PCI後', halfLife: '約15-20分（不可逆的COX-1阻害で効果は血小板寿命=7-10日持続）', metabolism: 'エステラーゼで加水分解', renalAdjust: '通常不要', contraindication: 'アスピリン喘息、消化性潰瘍、出血傾向、妊娠後期' },
    { generic: 'クロピドグレル', brand: 'プラビックス', specs: '25mg/75mg', indication: '虚血性心疾患・脳血管障害の二次予防、PCI後', halfLife: '約6時間（不可逆的P2Y12阻害で効果は血小板寿命持続）', metabolism: 'CYP2C19（主）→ 活性代謝物。プロドラッグ', renalAdjust: '通常不要', contraindication: '出血（頭蓋内出血・消化管出血等）' },
    { generic: 'プラスグレル', brand: 'エフィエント', specs: '2.5mg/3.75mg/5mg/20mg', indication: 'PCI適応のACS、PCI後', halfLife: '約7時間（不可逆的P2Y12阻害）', metabolism: 'エステラーゼ + CYP3A4/2B6 → 活性代謝物。プロドラッグ', renalAdjust: '通常不要', contraindication: '出血、脳卒中/TIA既往（海外データ）、重度肝障害' },
    { generic: 'チカグレロル', brand: 'ブリリンタ', specs: '60mg/90mg', indication: 'PCI適応のACS、ACS後二次予防', halfLife: '約7-8.5時間（可逆的P2Y12阻害）', metabolism: 'CYP3A4（主）→ 活性代謝物', renalAdjust: '通常不要', contraindication: '出血、重度肝障害、CYP3A4強力阻害薬併用' },
    { generic: 'シロスタゾール', brand: 'プレタール', specs: '50mg/100mg', indication: '慢性動脈閉塞症、脳梗塞再発予防', halfLife: '約11時間', metabolism: 'CYP3A4/2D6/2C19', renalAdjust: '通常不要', contraindication: 'うっ血性心不全、出血（頭蓋内出血等）' },
    { generic: 'サルポグレラート', brand: 'アンプラーグ', specs: '100mg', indication: '慢性動脈閉塞症', halfLife: '約0.8時間', metabolism: '肝代謝', renalAdjust: '通常不要', contraindication: '出血（頭蓋内出血等）' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本循環器学会. 冠動脈疾患患者における抗血栓療法ガイドライン 2020',
    'Wallentin L et al. Ticagrelor versus clopidogrel (PLATO). N Engl J Med 2009;361:1045-1057'],
  relatedTools: [
    { href: '/tools/calc/cha2ds2-vasc', name: 'CHA₂DS₂-VASc' },
    { href: '/tools/calc/has-bled', name: 'HAS-BLED' },
    { href: '/tools/drugs/compare/doac', name: 'DOAC比較' }],
}

export default function AntiplateletComparePage() { return <DrugCompareLayout data={data} /> }
