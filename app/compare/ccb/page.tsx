'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'ccb',
  category: '降圧薬',
  title: 'Ca拮抗薬（CCB）比較表',
  description: 'アムロジピン・ニフェジピン・ベニジピン・シルニジピン・アゼルニジピン・ジルチアゼム・ベラパミルの7剤を比較。DHP系 vs 非DHP系・心拍への影響。',
  columns: ['generic', 'brand', 'halfLife', 'features', 'renalAdjust', 'contraindication', 'evidence'],
  drugs: [
    { generic: 'アムロジピン', brand: 'ノルバスク/アムロジン', specs: '2.5mg/5mg/10mg', indication: '高血圧、狭心症', halfLife: '約36時間', metabolism: 'CYP3A4', renalAdjust: '通常不要', contraindication: '妊婦（ジヒドロピリジン系共通）' },
    { generic: 'ニフェジピン CR', brand: 'アダラート CR', specs: '10mg/20mg/40mg', indication: '高血圧、狭心症', halfLife: '約2時間（CR製剤で12-24時間持続）', metabolism: 'CYP3A4', renalAdjust: '通常不要', contraindication: '心原性ショック、急性心筋梗塞' },
    { generic: 'ベニジピン', brand: 'コニール', specs: '2mg/4mg/8mg', indication: '高血圧、狭心症、腎実質性高血圧', halfLife: '約2時間（持続的効果）', metabolism: 'CYP3A4', renalAdjust: '通常不要', contraindication: '妊婦' },
    { generic: 'シルニジピン', brand: 'アテレック', specs: '5mg/10mg/20mg', indication: '高血圧', halfLife: '約2.5時間', metabolism: 'CYP3A4', renalAdjust: '通常不要', contraindication: '妊婦' },
    { generic: 'アゼルニジピン', brand: 'カルブロック', specs: '8mg/16mg', indication: '高血圧', halfLife: '約16-19時間', metabolism: 'CYP3A4', renalAdjust: '通常不要', contraindication: '妊婦' },
    { generic: 'ジルチアゼム', brand: 'ヘルベッサー', specs: '30mg/60mg錠、Rカプセル100mg/200mg', indication: '高血圧、狭心症、上室性不整脈', halfLife: '約4-6時間（R製剤で持続）', metabolism: 'CYP3A4', renalAdjust: '通常不要', contraindication: '2度以上の房室ブロック、SSS、重篤な心不全' },
    { generic: 'ベラパミル', brand: 'ワソラン', specs: '40mg', indication: '上室性不整脈、狭心症、高血圧', halfLife: '約6-8時間', metabolism: 'CYP3A4/1A2/2C', renalAdjust: '通常不要', contraindication: '2度以上の房室ブロック、SSS、重篤な心不全、WPW＋AF' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本高血圧学会. 高血圧治療ガイドライン 2019（JSH2019）',
    'ALLHAT Officers. Major outcomes in high-risk hypertensive patients. JAMA 2002;288:2981-2997'],
  relatedTools: [
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/compare/arb', name: 'ARB比較' },
    { href: '/compare/beta-blocker', name: 'β遮断薬比較' }],
}

export default function CCBComparePage() { return <DrugCompareLayout data={data} /> }
