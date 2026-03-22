'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'statin',
  category: '脂質異常症治療薬',
  title: 'スタチン比較表',
  description: 'ロスバスタチン・アトルバスタチン・ピタバスタチン等6剤を添付文書情報に基づき比較。強度分類・代謝経路・薬物相互作用を一覧。',
  columns: ['generic', 'brand', 'features', 'halfLife', 'metabolism', 'renalAdjust', 'contraindication', 'evidence'],
  drugs: [
    {
      generic: 'ロスバスタチン',
      brand: 'クレストール',
      specs: '2.5mg/5mg/10mg 錠',
      indication: '高コレステロール血症、家族性高コレステロール血症',
      halfLife: '約20時間',
      metabolism: '肝代謝少（CYP2C9 一部）、主に未変化体で排泄。水溶性',
      renalAdjust: '重度腎障害: 慎重投与（開始量を低めに）',
      contraindication: '活動性肝疾患、妊婦・授乳婦、シクロスポリン併用',
    },
    {
      generic: 'アトルバスタチン',
      brand: 'リピトール',
      specs: '5mg/10mg 錠',
      indication: '高コレステロール血症、家族性高コレステロール血症',
      halfLife: '約14時間（活性代謝物含め20-30時間）',
      metabolism: 'CYP3A4（脂溶性）',
      renalAdjust: '腎機能の影響は少ない',
      contraindication: '活動性肝疾患、妊婦・授乳婦',
    },
    {
      generic: 'ピタバスタチン',
      brand: 'リバロ',
      specs: '1mg/2mg/4mg 錠',
      indication: '高コレステロール血症、家族性高コレステロール血症',
      halfLife: '約11時間',
      metabolism: 'CYP2C9（限定的）。グルクロン酸抱合。CYP3A4関与少',
      renalAdjust: '重度腎障害: 慎重投与',
      contraindication: '活動性肝疾患、妊婦、シクロスポリン併用',
    },
    {
      generic: 'プラバスタチン',
      brand: 'メバロチン',
      specs: '5mg/10mg 錠',
      indication: '高コレステロール血症、家族性高コレステロール血症',
      halfLife: '約1.5-2時間',
      metabolism: '肝で硫酸抱合。CYP関与なし。水溶性',
      renalAdjust: '重度腎障害: 慎重投与',
      contraindication: '活動性肝疾患、妊婦',
    },
    {
      generic: 'シンバスタチン',
      brand: 'リポバス',
      specs: '5mg/10mg/20mg 錠',
      indication: '高コレステロール血症、家族性高コレステロール血症',
      halfLife: '約2時間',
      metabolism: 'CYP3A4（脂溶性）。プロドラッグ（体内で活性化）',
      renalAdjust: '重度腎障害: 慎重投与',
      contraindication: '活動性肝疾患、妊婦、強力CYP3A4阻害薬併用',
    },
    {
      generic: 'フルバスタチン',
      brand: 'ローコール',
      specs: '20mg/30mg 錠',
      indication: '高コレステロール血症、家族性高コレステロール血症',
      halfLife: '約1-3時間',
      metabolism: 'CYP2C9（脂溶性だがCYP3A4非依存）',
      renalAdjust: '腎機能の影響は少ない',
      contraindication: '活動性肝疾患、妊婦',
    }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本動脈硬化学会. 動脈硬化性疾患予防ガイドライン 2022',
    'Nakamura H et al. MEGA Study (primary prevention with pravastatin). Lancet 2006;368:1155-1163',
    'Baigent C et al. CTT meta-analysis. Lancet 2010;376:1670-1681'],
  relatedTools: [
    { href: '/tools/calc/fib4', name: 'FIB-4' },
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/tools/calc/framingham', name: 'Framingham' }],
}

export default function StatinComparePage() {
  return <DrugCompareLayout data={data} />
}
