'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'iron',
  category: 'その他',
  title: '鉄剤 比較表',
  description: 'クエン酸第一鉄・フマル酸第一鉄・含糖酸化鉄・カルボキシマルトース鉄・デルイソマルトース鉄の5剤を比較。経口 vs 静注・消化器症状・CKD/IBD での選択。',
  columns: ['generic', 'brand', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'クエン酸第一鉄ナトリウム', brand: 'フェロミア', specs: '50mg（鉄として）', indication: '鉄欠乏性貧血', halfLife: '—', metabolism: '腸管吸収 → トランスフェリン結合', renalAdjust: '通常不要', contraindication: '鉄過剰状態（ヘモクロマトーシス）' },
    { generic: 'フマル酸第一鉄', brand: 'フェルム', specs: '100mg（鉄として）カプセル', indication: '鉄欠乏性貧血', halfLife: '—', metabolism: '腸管吸収', renalAdjust: '通常不要', contraindication: '鉄過剰状態' },
    { generic: '含糖酸化鉄', brand: 'フェジン', specs: '注射 40mg/2mL', indication: '経口鉄剤不耐・無効の鉄欠乏性貧血', halfLife: '約6時間', metabolism: '細網内皮系で鉄を放出', renalAdjust: '透析患者に頻用', contraindication: '鉄過剰状態' },
    { generic: 'カルボキシマルトース鉄', brand: 'フェインジェクト', specs: '注射 500mg/10mL', indication: '経口鉄剤不耐・無効の鉄欠乏性貧血', halfLife: '約7-12時間', metabolism: '細網内皮系で鉄を放出', renalAdjust: '通常不要', contraindication: '鉄過剰状態、1st trimester' },
    { generic: 'デルイソマルトース鉄', brand: 'モノヴァー', specs: '注射 100mg/mL', indication: '鉄欠乏性貧血', halfLife: '約1-4日', metabolism: '細網内皮系', renalAdjust: '通常不要', contraindication: '鉄過剰状態、1st trimester' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本鉄バイオサイエンス学会. 鉄剤の適正使用による貧血治療指針 2015',
    'Auerbach M, Adamson JW. How we diagnose and treat iron deficiency anemia. Am J Hematol 2016',
    'Stoffel NU et al. Iron absorption from oral iron supplements given on consecutive versus alternate days. Lancet Haematol 2020'],
  relatedTools: [
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/tools/calc/anc', name: 'ANC' }],
}

export default function IronComparePage() { return <DrugCompareLayout data={data} /> }
