'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'nsaids',
  category: '鎮痛・抗炎症薬',
  title: 'NSAIDs 比較表',
  description: 'ロキソプロフェン・ジクロフェナク・セレコキシブ・メロキシカム・イブプロフェン・インドメタシン・ナプロキセンの7剤を比較。COX選択性・消化管リスク・心血管リスク。',
  columns: ['generic', 'brand', 'halfLife', 'metabolism', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'ロキソプロフェン', brand: 'ロキソニン', specs: '60mg', indication: '疼痛・炎症・発熱', halfLife: '約1.3時間（活性代謝物 約1.2時間）', metabolism: '肝代謝。プロドラッグ → 活性代謝物', renalAdjust: '腎障害: 慎重投与。NSAIDs共通で腎血流低下リスク', contraindication: '消化性潰瘍、重篤な腎障害・肝障害・心不全、アスピリン喘息' },
    { generic: 'ジクロフェナク', brand: 'ボルタレン', specs: '25mg錠/坐剤/テープ', indication: '疼痛・炎症・術後鎮痛', halfLife: '約1.3時間', metabolism: 'CYP2C9（主）、グルクロン酸抱合', renalAdjust: '腎障害: 慎重投与', contraindication: '消化性潰瘍、重篤な腎障害・肝障害・心不全、アスピリン喘息、妊娠後期' },
    { generic: 'セレコキシブ', brand: 'セレコックス', specs: '100mg/200mg', indication: '関節リウマチ・変形性関節症の疼痛', halfLife: '約6-12時間', metabolism: 'CYP2C9（主）', renalAdjust: '重度腎障害: 一般的でない', contraindication: 'スルホンアミドアレルギー、消化性潰瘍、重篤な肝腎障害・心不全' },
    { generic: 'メロキシカム', brand: 'モービック', specs: '10mg', indication: '関節リウマチ・変形性関節症', halfLife: '約20時間', metabolism: 'CYP2C9/3A4', renalAdjust: '重度腎障害: 慎重投与', contraindication: '消化性潰瘍、重篤な腎障害・肝障害・心不全' },
    { generic: 'イブプロフェン', brand: 'ブルフェン', specs: '100mg/200mg', indication: '疼痛・炎症・発熱', halfLife: '約2時間', metabolism: 'CYP2C9（主）', renalAdjust: '腎障害: 慎重投与', contraindication: '消化性潰瘍、重篤な腎障害・肝障害・心不全、アスピリン喘息' },
    { generic: 'インドメタシン', brand: 'インテバン/インダシン', specs: '25mgカプセル/坐剤', indication: '痛風発作、関節リウマチ、動脈管閉鎖', halfLife: '約4.5時間', metabolism: 'CYP2C9、グルクロン酸抱合。腸肝循環あり', renalAdjust: '腎障害: 慎重投与', contraindication: '消化性潰瘍、重篤な腎障害・肝障害・心不全、アスピリン喘息' },
    { generic: 'ナプロキセン', brand: 'ナイキサン', specs: '100mg', indication: '疼痛・炎症', halfLife: '約14時間', metabolism: 'CYP2C9/1A2、グルクロン酸抱合', renalAdjust: '腎障害: 慎重投与', contraindication: '消化性潰瘍、重篤な腎障害・肝障害・心不全、アスピリン喘息' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    'Nissen SE et al. Cardiovascular safety of celecoxib, naproxen, or ibuprofen (PRECISION). N Engl J Med 2016;375:2519-2529',
    'Coxib and traditional NSAID Trialists Collaboration. Lancet 2013;382:769-779',
    '日本消化器病学会. NSAIDs潰瘍ガイドライン 2020'],
  relatedTools: [
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/tools/calc/rockall', name: 'Rockall' },
    { href: '/tools/calc/gbs', name: 'Glasgow-Blatchford' },
    { href: '/tools/drugs/compare/ppi', name: 'PPI比較' }],
}

export default function NSAIDsComparePage() { return <DrugCompareLayout data={data} /> }
