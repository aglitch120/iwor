'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'bzd',
  category: '精神・神経',
  title: 'ベンゾジアゼピン系薬 比較表',
  description: 'ロラゼパム・アルプラゾラム・ジアゼパム・クロナゼパム・ニトラゼパム・エチゾラムの6剤を比較。半減期による分類・等価換算・高齢者での注意。',
  columns: ['generic', 'brand', 'halfLife', 'metabolism', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'ロラゼパム', brand: 'ワイパックス', specs: '0.5mg/1mg', indication: '不安障害、不眠、てんかん重積（注射）', halfLife: '約12時間', metabolism: 'グルクロン酸抱合（CYP非依存）', renalAdjust: '通常不要', contraindication: '急性閉塞隅角緑内障、重症筋無力症' },
    { generic: 'アルプラゾラム', brand: 'コンスタン/ソラナックス', specs: '0.4mg/0.8mg', indication: '不安障害、パニック障害', halfLife: '約14時間', metabolism: 'CYP3A4', renalAdjust: '通常不要', contraindication: '急性閉塞隅角緑内障、重症筋無力症' },
    { generic: 'ジアゼパム', brand: 'セルシン/ホリゾン', specs: '2mg/5mg/10mg錠、注', indication: '不安・緊張、けいれん、筋弛緩', halfLife: '約20-70時間（活性代謝物含め200時間超）', metabolism: 'CYP3A4/2C19 → 活性代謝物（デスメチルジアゼパム）', renalAdjust: '通常不要', contraindication: '急性閉塞隅角緑内障、重症筋無力症' },
    { generic: 'クロナゼパム', brand: 'リボトリール/ランドセン', specs: '0.5mg/1mg/2mg', indication: 'てんかん、パニック障害', halfLife: '約18-50時間', metabolism: 'CYP3A4', renalAdjust: '通常不要', contraindication: '急性閉塞隅角緑内障、重症筋無力症' },
    { generic: 'ニトラゼパム', brand: 'ベンザリン/ネルボン', specs: '5mg/10mg', indication: '不眠症、てんかん', halfLife: '約27時間', metabolism: 'ニトロ還元 → アセチル化', renalAdjust: '通常不要', contraindication: '急性閉塞隅角緑内障、重症筋無力症' },
    { generic: 'エチゾラム', brand: 'デパス', specs: '0.25mg/0.5mg/1mg', indication: '不安・緊張、抑うつ、不眠、筋緊張', halfLife: '約6時間', metabolism: '肝代謝（CYP2C/3A）', renalAdjust: '通常不要', contraindication: '急性閉塞隅角緑内障、重症筋無力症' }],
  seoContent: [],
  references: [
    '各薬剤の添付文書（最新版）',
    '厚生労働科学研究班. 高齢者の安全な薬物療法ガイドライン 2015',
    '日本睡眠学会. 睡眠薬の適正使用・休薬ガイドライン 2014'],
  relatedTools: [
    { href: '/tools/calc/cam-icu', name: 'CAM-ICU' },
    { href: '/tools/calc/gad7', name: 'GAD-7' },
    { href: '/tools/drugs/compare/hypnotic', name: '睡眠薬比較' },
    { href: '/tools/drugs/compare/ssri-snri', name: 'SSRI/SNRI比較' }],
}

export default function BZDComparePage() { return <DrugCompareLayout data={data} /> }
