'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'arb',
  category: '降圧薬',
  title: 'ARB（アンジオテンシンII受容体拮抗薬）比較表',
  description: 'ロサルタン・バルサルタン・カンデサルタン・オルメサルタン・テルミサルタン・アジルサルタン・イルベサルタンの7剤を比較。',
  columns: ['generic', 'brand', 'halfLife', 'metabolism', 'renalAdjust', 'features', 'evidence'],
  drugs: [
    {
      generic: 'ロサルタン',
      brand: 'ニューロタン',
      specs: '25mg/50mg/100mg 錠',
      indication: '高血圧、糖尿病性腎症',
      halfLife: '約2時間（活性代謝物6-9時間）',
      metabolism: 'CYP2C9/3A4 → 活性代謝物（E-3174）',
      renalAdjust: '重度腎障害: 慎重投与',
      contraindication: '妊婦、アリスキレン併用（糖尿病患者）',
    },
    {
      generic: 'バルサルタン',
      brand: 'ディオバン',
      specs: '20mg/40mg/80mg/160mg 錠',
      indication: '高血圧',
      halfLife: '約6時間',
      metabolism: '肝代謝少。CYP関与わずか。主に未変化体で胆汁排泄',
      renalAdjust: '通常不要（胆汁排泄主体）',
      contraindication: '妊婦',
    },
    {
      generic: 'カンデサルタン',
      brand: 'ブロプレス',
      specs: '2mg/4mg/8mg/12mg 錠',
      indication: '高血圧、慢性心不全（ACE阻害薬不耐例）',
      halfLife: '約9-12時間',
      metabolism: 'エステル加水分解 → 活性体。CYP関与少',
      renalAdjust: '重度腎障害: 低用量から',
      contraindication: '妊婦、重篤な肝障害',
    },
    {
      generic: 'オルメサルタン',
      brand: 'オルメテック',
      specs: '5mg/10mg/20mg/40mg 錠',
      indication: '高血圧',
      halfLife: '約13時間',
      metabolism: 'エステル加水分解。CYP関与なし',
      renalAdjust: '重度腎障害: 慎重投与',
      contraindication: '妊婦',
    },
    {
      generic: 'テルミサルタン',
      brand: 'ミカルディス',
      specs: '20mg/40mg/80mg 錠',
      indication: '高血圧',
      halfLife: '約24時間（ARB中最長）',
      metabolism: 'グルクロン酸抱合（胆汁排泄）。CYP関与なし',
      renalAdjust: '通常不要（胆汁排泄主体）',
      contraindication: '妊婦、重篤な肝障害、胆汁分泌障害',
    },
    {
      generic: 'アジルサルタン',
      brand: 'アジルバ',
      specs: '10mg/20mg/40mg 錠',
      indication: '高血圧',
      halfLife: '約11-15時間',
      metabolism: 'CYP2C9（一部）。主に未変化体で排泄',
      renalAdjust: '重度腎障害: 慎重投与',
      contraindication: '妊婦',
    },
    {
      generic: 'イルベサルタン',
      brand: 'アバプロ/イルベタン',
      specs: '50mg/100mg/200mg 錠',
      indication: '高血圧',
      halfLife: '約11-15時間',
      metabolism: 'CYP2C9（一部）。グルクロン酸抱合',
      renalAdjust: '通常不要',
      contraindication: '妊婦',
    }],
  seoContent: [],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本高血圧学会. 高血圧治療ガイドライン 2019（JSH2019）',
    'Yusuf S et al. Telmisartan, ramipril, or both (ONTARGET). N Engl J Med 2008;358:1547-1559',
    'Brenner BM et al. Losartan in type 2 diabetes (RENAAL). N Engl J Med 2001;345:861-869'],
  relatedTools: [
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/tools/calc/cockcroft-gault', name: 'Cockcroft-Gault' },
    { href: '/tools/drugs/compare/statin', name: 'スタチン比較' }],
}

export default function ARBComparePage() {
  return <DrugCompareLayout data={data} />
}
