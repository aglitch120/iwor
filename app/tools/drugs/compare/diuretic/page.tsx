'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'diuretic',
  category: '降圧薬・心不全治療薬',
  title: '利尿薬 比較表',
  description: 'フロセミド・トルバプタン・スピロノラクトン・エプレレノン・トリクロルメチアジド・インダパミド・アゾセミドの7剤を比較。添付文書情報の一覧比較。',
  columns: ['generic', 'brand', 'halfLife', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'フロセミド', brand: 'ラシックス', specs: '10mg/20mg/40mg錠/注', indication: '浮腫（心・腎・肝性）、高血圧', halfLife: '約0.5-1時間', metabolism: 'グルクロン酸抱合、腎排泄', renalAdjust: '腎障害でも使用可（高用量必要な場合あり）', contraindication: '無尿、肝性昏睡、体液中のNa/K著明低下' },
    { generic: 'アゾセミド', brand: 'ダイアート', specs: '30mg/60mg', indication: '浮腫', halfLife: '約2.5-3.5時間', metabolism: '肝代謝', renalAdjust: '腎障害でも使用可', contraindication: '無尿、肝性昏睡、体液中のNa/K著明低下' },
    { generic: 'トリクロルメチアジド', brand: 'フルイトラン', specs: '1mg/2mg', indication: '高血圧、浮腫', halfLife: '約3.5時間（作用持続12-24時間）', metabolism: '腎排泄主体', renalAdjust: 'GFR < 30: 効果減弱（ループ利尿薬に変更）', contraindication: '無尿、急性腎不全、体液中のNa/K著明低下' },
    { generic: 'インダパミド', brand: 'ナトリックス/テナキシル', specs: '1mg/2mg', indication: '高血圧', halfLife: '約18時間', metabolism: 'CYP3A4', renalAdjust: '重度腎障害: 効果減弱', contraindication: '無尿、急性腎不全' },
    { generic: 'スピロノラクトン', brand: 'アルダクトンA', specs: '25mg/50mg', indication: '浮腫（心・肝・腎性）、高血圧、原発性アルドステロン症', halfLife: '約1.4時間（活性代謝物16-22時間）', metabolism: '肝代謝 → カンレノン（活性代謝物）', renalAdjust: 'K > 5.0 or GFR < 30: 禁忌に近い', contraindication: '高K血症、無尿、急性腎不全、アジソン病' },
    { generic: 'エプレレノン', brand: 'セララ/インスプラ', specs: '25mg/50mg/100mg', indication: '高血圧、慢性心不全', halfLife: '約4-6時間', metabolism: 'CYP3A4', renalAdjust: 'GFR < 30: 禁忌。K > 5.0: 禁忌', contraindication: '高K血症、重度腎障害、K保持性利尿薬併用' },
    { generic: 'トルバプタン', brand: 'サムスカ', specs: '7.5mg/15mg/30mg', indication: '心不全・肝硬変の体液貯留、SIADH、PKD', halfLife: '約8時間', metabolism: 'CYP3A4', renalAdjust: '通常不要', contraindication: '口渇を感じない/水分摂取困難、高Na血症、CYP3A4強力阻害薬併用' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本循環器学会. 急性・慢性心不全診療ガイドライン 2021',
    'Pitt B et al. Spironolactone (RALES). N Engl J Med 1999;341:709-717',
    'Zannad F et al. Eplerenone (EMPHASIS-HF). N Engl J Med 2011;364:11-21'],
  relatedTools: [
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/tools/calc/na-correction-rate', name: 'Na補正速度' },
    { href: '/tools/drugs/compare/arb', name: 'ARB比較' },
    { href: '/tools/drugs/compare/beta-blocker', name: 'β遮断薬比較' }],
}

export default function DiureticComparePage() { return <DrugCompareLayout data={data} /> }
