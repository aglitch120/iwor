'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'hypnotic',
  category: '精神・神経',
  title: '睡眠薬 比較表',
  description: 'ゾルピデム・エスゾピクロン・スボレキサント・レンボレキサント・ラメルテオン・トリアゾラム・ニトラゼパムの7剤を比較。作用機序別分類・依存性・高齢者での使い方。',
  columns: ['generic', 'brand', 'halfLife', 'metabolism', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'ゾルピデム', brand: 'マイスリー', specs: '5mg/10mg', indication: '不眠症（入眠障害）', halfLife: '約2時間', metabolism: 'CYP3A4（主）/2C9/1A2', renalAdjust: '肝障害: 減量', contraindication: '重篤な肝障害、重症筋無力症、急性閉塞隅角緑内障' },
    { generic: 'エスゾピクロン', brand: 'ルネスタ', specs: '1mg/2mg/3mg', indication: '不眠症', halfLife: '約5時間', metabolism: 'CYP3A4/2E1', renalAdjust: '重度肝障害: 減量。高齢者: 減量', contraindication: '重篤な肝障害、重症筋無力症' },
    { generic: 'スボレキサント', brand: 'ベルソムラ', specs: '10mg/15mg/20mg', indication: '不眠症', halfLife: '約12時間', metabolism: 'CYP3A4', renalAdjust: '通常不要', contraindication: 'CYP3A4強力阻害薬（イトラコナゾール等）併用' },
    { generic: 'レンボレキサント', brand: 'デエビゴ', specs: '2.5mg/5mg/10mg', indication: '不眠症', halfLife: '約31-50時間', metabolism: 'CYP3A4（主）', renalAdjust: '重度肝障害: 注意', contraindication: '重度肝障害' },
    { generic: 'ラメルテオン', brand: 'ロゼレム', specs: '8mg', indication: '不眠症（入眠困難）', halfLife: '約1-2時間', metabolism: 'CYP1A2（主）/2C/3A4', renalAdjust: '通常不要', contraindication: 'フルボキサミン併用、重篤な肝障害' },
    { generic: 'トリアゾラム', brand: 'ハルシオン', specs: '0.125mg/0.25mg', indication: '不眠症（入眠障害）', halfLife: '約2-4時間', metabolism: 'CYP3A4', renalAdjust: '肝障害: 減量', contraindication: 'アゾール系抗真菌薬・HIV-PI併用、重症筋無力症、急性閉塞隅角緑内障' },
    { generic: 'ニトラゼパム', brand: 'ベンザリン/ネルボン', specs: '5mg/10mg', indication: '不眠症、てんかん', halfLife: '約27時間', metabolism: 'ニトロ還元 → アセチル化', renalAdjust: '通常不要', contraindication: '重症筋無力症、急性閉塞隅角緑内障' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本睡眠学会. 睡眠薬の適正使用・休薬ガイドライン 2014',
    '厚生労働科学研究班. 高齢者の安全な薬物療法ガイドライン 2015',
    'Hatta K et al. Suvorexant for prevention of delirium. J Clin Psychiatry 2017'],
  relatedTools: [
    { href: '/tools/calc/cam-icu', name: 'CAM-ICU' },
    { href: '/tools/calc/rass', name: 'RASS' },
    { href: '/compare/bzd', name: 'ベンゾジアゼピン比較' }],
}

export default function HypnoticComparePage() { return <DrugCompareLayout data={data} /> }
