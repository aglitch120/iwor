'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'beta-blocker',
  category: '降圧薬・心不全治療薬',
  title: 'β遮断薬 比較表',
  description: 'ビソプロロール・カルベジロール・メトプロロール・アテノロール・プロプラノロール・ネビボロール・ランジオロールの7剤を比較。β1選択性・ISA・心不全適応。',
  columns: ['generic', 'brand', 'halfLife', 'metabolism', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'ビソプロロール', brand: 'メインテート', specs: '0.625mg/2.5mg/5mg', indication: '高血圧、狭心症、心不全、AF心拍数コントロール', halfLife: '約9-12時間', metabolism: '肝代謝 50% + 腎排泄 50%', renalAdjust: '重度腎障害: 慎重投与', contraindication: '高度徐脈、2度以上AVB、SSS、心原性ショック、褐色細胞腫（未治療）、喘息' },
    { generic: 'カルベジロール', brand: 'アーチスト', specs: '1.25mg/2.5mg/10mg/20mg', indication: '高血圧、狭心症、心不全', halfLife: '約7-10時間', metabolism: 'CYP2D6/2C9/1A2（肝代謝主体）', renalAdjust: '通常不要（肝代謝主体）', contraindication: '気管支喘息、高度徐脈、2度以上AVB、心原性ショック' },
    { generic: 'メトプロロール', brand: 'セロケン/ロプレソール', specs: '20mg/40mg', indication: '高血圧、狭心症、頻脈性不整脈', halfLife: '約3-4時間', metabolism: 'CYP2D6（肝代謝主体）', renalAdjust: '通常不要（肝代謝主体）', contraindication: '気管支喘息、高度徐脈、2度以上AVB、心原性ショック' },
    { generic: 'アテノロール', brand: 'テノーミン', specs: '25mg/50mg', indication: '高血圧、狭心症、不整脈', halfLife: '約6-7時間', metabolism: '腎排泄主体（肝代謝ほぼなし）', renalAdjust: 'CCr 15-35: 減量。CCr < 15: さらに減量', contraindication: '気管支喘息、高度徐脈、2度以上AVB、心原性ショック' },
    { generic: 'プロプラノロール', brand: 'インデラル', specs: '10mg/20mg', indication: '高血圧、狭心症、不整脈、片頭痛予防、甲状腺中毒症', halfLife: '約3-6時間', metabolism: 'CYP2D6/1A2（肝代謝、初回通過効果大）', renalAdjust: '通常不要（肝代謝主体）', contraindication: '気管支喘息・COPD（β2遮断で気管支収縮）、高度徐脈、2度以上AVB' },
    { generic: 'セリプロロール', brand: 'セレクトール', specs: '100mg/200mg', indication: '高血圧、狭心症', halfLife: '約5時間', metabolism: '肝代謝 + 腎排泄', renalAdjust: '重度腎障害: 慎重投与', contraindication: '高度徐脈、2度以上AVB、重篤な心不全' },
    { generic: 'ランジオロール', brand: 'オノアクト', specs: '注射剤', indication: '周術期頻脈、AF/AFL心拍数コントロール', halfLife: '約4分', metabolism: 'エステラーゼによる加水分解（超短時間作用）', renalAdjust: '不要（血中で分解）', contraindication: '心原性ショック、高度徐脈、2度以上AVB' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本循環器学会. 急性・慢性心不全診療ガイドライン 2021',
    'CIBIS-II Investigators. Lancet 1999;353:9-13',
    'Packer M et al. Carvedilol (COPERNICUS). N Engl J Med 2001;344:1651-1658'],
  relatedTools: [
    { href: '/tools/calc/qtc-calculator', name: 'QTc計算' },
    { href: '/tools/drugs/compare/ccb', name: 'Ca拮抗薬比較' },
    { href: '/tools/drugs/compare/arb', name: 'ARB比較' }],
}

export default function BetaBlockerComparePage() { return <DrugCompareLayout data={data} /> }
