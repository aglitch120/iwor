'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'doac',
  category: '抗凝固薬',
  title: 'DOAC（直接経口抗凝固薬）比較表',
  description: 'ダビガトラン・リバーロキサバン・アピキサバン・エドキサバンの4剤を添付文書情報に基づき比較。適応・半減期・腎機能調整・特徴を一覧。',
  columns: ['generic', 'brand', 'indication', 'halfLife', 'metabolism', 'renalAdjust', 'features', 'contraindication'],
  drugs: [
    {
      generic: 'ダビガトラン',
      brand: 'プラザキサ',
      specs: '75mg/110mg カプセル',
      indication: '非弁膜症性AF脳卒中予防、DVT/PE治療・再発予防',
      halfLife: '12-17時間',
      metabolism: '腎排泄 80%（P-gp基質）',
      renalAdjust: 'CCr 30-50: 減量考慮。CCr < 30: 禁忌',
      contraindication: '重度腎障害（CCr < 30）、活動性出血、人工心臓弁',
    },
    {
      generic: 'リバーロキサバン',
      brand: 'イグザレルト',
      specs: '10mg/15mg 錠',
      indication: '非弁膜症性AF脳卒中予防、DVT/PE治療・再発予防、ACS二次予防',
      halfLife: '5-9時間（若年）、11-13時間（高齢）',
      metabolism: '肝代謝 2/3 + 腎排泄 1/3（CYP3A4・P-gp基質）',
      renalAdjust: 'CCr 15-49: 減量考慮。CCr < 15: 禁忌',
      contraindication: '重度肝障害（Child-Pugh C）、重度腎障害',
    },
    {
      generic: 'アピキサバン',
      brand: 'エリキュース',
      specs: '2.5mg/5mg 錠',
      indication: '非弁膜症性AF脳卒中予防、DVT/PE治療・再発予防',
      halfLife: '約12時間',
      metabolism: '肝代謝 75% + 腎排泄 27%（CYP3A4・P-gp基質）',
      renalAdjust: '2項目以上該当で減量: 年齢≧80歳、体重≦60kg、Cr≧1.5。CCr < 15: 慎重投与',
      contraindication: '活動性出血、重度肝障害',
    },
    {
      generic: 'エドキサバン',
      brand: 'リクシアナ',
      specs: '15mg/30mg/60mg 錠',
      indication: '非弁膜症性AF脳卒中予防、DVT/PE治療・再発予防、整形外科術後VTE予防',
      halfLife: '10-14時間',
      metabolism: '腎排泄 50%（P-gp基質）',
      renalAdjust: 'CCr 15-50/体重≦60kg/P-gp阻害薬併用: 減量。CCr < 15: 禁忌',
      contraindication: '重度腎障害、活動性出血',
    }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    'Connolly SJ et al. Dabigatran versus warfarin (RE-LY). N Engl J Med 2009;361:1139-1151',
    'Granger CB et al. Apixaban versus warfarin (ARISTOTLE). N Engl J Med 2011;365:981-992',
    'Giugliano RP et al. Edoxaban versus warfarin (ENGAGE AF-TIMI 48). N Engl J Med 2013;369:2093-2104',
    '日本循環器学会. 不整脈薬物治療ガイドライン 2020'],
  relatedTools: [
    { href: '/tools/calc/cha2ds2-vasc', name: 'CHA₂DS₂-VASc' },
    { href: '/tools/calc/has-bled', name: 'HAS-BLED' },
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/tools/calc/cockcroft-gault', name: 'Cockcroft-Gault' }],
}

export default function DOACComparePage() {
  return <DrugCompareLayout data={data} />
}
