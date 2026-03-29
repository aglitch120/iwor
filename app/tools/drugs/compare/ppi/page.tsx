'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'ppi',
  category: '消化器治療薬',
  title: 'PPI（プロトンポンプ阻害薬）比較表',
  description: 'オメプラゾール・ランソプラゾール・ラベプラゾール・エソメプラゾール・ボノプラザンの5剤を比較。代謝経路・相互作用・P-CABとの違い。',
  columns: ['generic', 'brand', 'indication', 'halfLife', 'metabolism', 'features', 'contraindication'],
  drugs: [
    {
      generic: 'オメプラゾール',
      brand: 'オメプラール',
      specs: '10mg/20mg 錠',
      indication: '胃潰瘍、十二指腸潰瘍、GERD、ZES、H.pylori除菌補助',
      halfLife: '約0.5-1時間',
      metabolism: 'CYP2C19（主）、CYP3A4',
      renalAdjust: '通常不要',
      contraindication: 'アタザナビル・リルピビリン併用禁忌',
    },
    {
      generic: 'ランソプラゾール',
      brand: 'タケプロン',
      specs: '15mg/30mg カプセル/OD錠',
      indication: '胃潰瘍、十二指腸潰瘍、GERD、ZES、H.pylori除菌補助、NSAIDs潰瘍予防',
      halfLife: '約1-2時間',
      metabolism: 'CYP2C19（主）、CYP3A4',
      renalAdjust: '通常不要',
      contraindication: 'アタザナビル・リルピビリン併用禁忌',
    },
    {
      generic: 'ラベプラゾール',
      brand: 'パリエット',
      specs: '5mg/10mg/20mg 錠',
      indication: '胃潰瘍、十二指腸潰瘍、GERD、ZES、H.pylori除菌補助',
      halfLife: '約1-2時間',
      metabolism: '非酵素的還元（主）、CYP2C19（一部）、CYP3A4',
      renalAdjust: '通常不要',
      contraindication: 'アタザナビル・リルピビリン併用禁忌',
    },
    {
      generic: 'エソメプラゾール',
      brand: 'ネキシウム',
      specs: '10mg/20mg カプセル',
      indication: '胃潰瘍、十二指腸潰瘍、GERD、ZES、H.pylori除菌補助、NSAIDs潰瘍予防',
      halfLife: '約1-1.5時間',
      metabolism: 'CYP2C19（主）、CYP3A4',
      renalAdjust: '通常不要',
      contraindication: 'アタザナビル・リルピビリン併用禁忌',
    },
    {
      generic: 'ボノプラザン',
      brand: 'タケキャブ',
      specs: '10mg/20mg 錠',
      indication: '胃潰瘍、十二指腸潰瘍、GERD、ZES、H.pylori除菌補助',
      halfLife: '約7-8時間',
      metabolism: 'CYP3A4（主）',
      renalAdjust: '通常不要',
      contraindication: 'アタザナビル・リルピビリン併用禁忌',
    }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本消化器病学会. GERD診療ガイドライン 2021',
    'Murakami K et al. Vonoprazan vs lansoprazole for H. pylori eradication. Gut 2016',
    '日本消化器病学会. H. pylori感染の診断と治療のガイドライン 2016改訂版'],
  relatedTools: [
    { href: '/tools/calc/alvarado', name: 'Alvarado' },
    { href: '/tools/calc/rockall', name: 'Rockall' },
    { href: '/tools/calc/glasgow-blatchford', name: 'Glasgow-Blatchford' },
    { href: '/tools/calc/child-pugh', name: 'Child-Pugh' }],
}

export default function PPIComparePage() {
  return <DrugCompareLayout data={data} />
}
