'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'glp1ra',
  category: '糖尿病治療薬',
  title: 'GLP-1受容体作動薬 比較表',
  description: 'リラグルチド・セマグルチド（注/経口）・デュラグルチド・リキシセナチド・エキセナチドの6製剤を比較。投与頻度・心血管/腎保護・体重減少効果。',
  columns: ['generic', 'brand', 'halfLife', 'features', 'renalAdjust', 'contraindication', 'evidence'],
  drugs: [
    { generic: 'リラグルチド', brand: 'ビクトーザ', specs: '皮下注', indication: '2型糖尿病', halfLife: '約13時間', metabolism: 'DPP-4による分解＋内因性代謝', renalAdjust: '透析: 経験限られるため慎重', contraindication: '甲状腺髄様癌の既往/家族歴、MEN2型' },
    { generic: 'セマグルチド（注射）', brand: 'オゼンピック', specs: '皮下注', indication: '2型糖尿病', halfLife: '約7日', metabolism: 'タンパク分解＋β酸化', renalAdjust: '重度腎障害: 慎重投与', contraindication: '甲状腺髄様癌の既往/家族歴、MEN2型' },
    { generic: 'セマグルチド（経口）', brand: 'リベルサス', specs: '3mg/7mg/14mg錠', indication: '2型糖尿病', halfLife: '約7日', metabolism: 'タンパク分解＋β酸化', renalAdjust: '重度腎障害: 慎重投与', contraindication: '甲状腺髄様癌の既往/家族歴、MEN2型' },
    { generic: 'デュラグルチド', brand: 'トルリシティ', specs: '皮下注アテオス', indication: '2型糖尿病', halfLife: '約5日', metabolism: '一般的なタンパク分解経路', renalAdjust: '重度腎障害: 慎重投与', contraindication: '甲状腺髄様癌の既往/家族歴、MEN2型' },
    { generic: 'リキシセナチド', brand: 'リキスミア', specs: '皮下注', indication: '2型糖尿病', halfLife: '約2-3時間', metabolism: 'タンパク分解', renalAdjust: '重度腎障害: 慎重投与', contraindication: '甲状腺髄様癌の既往/家族歴' },
    { generic: 'エキセナチド', brand: 'バイエッタ/ビデュリオン', specs: '皮下注', indication: '2型糖尿病', halfLife: '約2.4時間（徐放製剤は数週間）', metabolism: '腎排泄（GFR依存）', renalAdjust: 'CCr < 30: 使用注意', contraindication: '重篤な腎障害、甲状腺髄様癌の既往/家族歴' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本糖尿病学会. 糖尿病治療ガイド 2024-2025',
    'Marso SP et al. Liraglutide (LEADER). N Engl J Med 2016;375:311-322',
    'Gerstein HC et al. Dulaglutide (REWIND). Lancet 2019;394:121-130'],
  relatedTools: [
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/tools/drugs/compare/sglt2i', name: 'SGLT2阻害薬比較' },
    { href: '/tools/drugs/compare/dpp4i', name: 'DPP-4阻害薬比較' }],
}

export default function GLP1RAComparePage() { return <DrugCompareLayout data={data} /> }
