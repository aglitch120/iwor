'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'ssri-snri',
  category: '精神・神経',
  title: 'SSRI / SNRI 比較表',
  description: 'エスシタロプラム・セルトラリン・パロキセチン・フルボキサミン・デュロキセチン・ベンラファキシン・ミルナシプランの7剤を比較。CYP相互作用・離脱症状・疼痛適応。',
  columns: ['generic', 'brand', 'halfLife', 'metabolism', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'エスシタロプラム', brand: 'レクサプロ', specs: '10mg/20mg', indication: 'うつ病・うつ状態、社会不安障害', halfLife: '約27-32時間', metabolism: 'CYP2C19（主）/3A4', renalAdjust: '重度腎障害: 慎重投与', contraindication: 'MAO阻害薬併用（14日間の休薬）、ピモジド併用、QT延長' },
    { generic: 'セルトラリン', brand: 'ジェイゾロフト', specs: '25mg/50mg/100mg', indication: 'うつ病・うつ状態、パニック障害、PTSD', halfLife: '約26時間', metabolism: 'CYP2B6/2C19/3A4/2D6', renalAdjust: '通常不要', contraindication: 'MAO阻害薬併用、ピモジド併用' },
    { generic: 'パロキセチン', brand: 'パキシル/パキシルCR', specs: '5mg/10mg/20mg', indication: 'うつ病、パニック障害、社会不安障害、強迫性障害、PTSD', halfLife: '約14時間', metabolism: 'CYP2D6（主）', renalAdjust: '重度腎障害: 減量', contraindication: 'MAO阻害薬併用、ピモジド併用、妊娠（催奇形性の報告）' },
    { generic: 'フルボキサミン', brand: 'ルボックス/デプロメール', specs: '25mg/50mg/75mg', indication: 'うつ病、強迫性障害、社会不安障害', halfLife: '約9-28時間', metabolism: 'CYP2D6', renalAdjust: '重度腎障害: 慎重投与', contraindication: 'MAO阻害薬・チザニジン・ラメルテオン併用' },
    { generic: 'デュロキセチン', brand: 'サインバルタ', specs: '20mg/30mg/60mgカプセル', indication: 'うつ病、糖尿病性神経障害・線維筋痛症・慢性腰痛の疼痛、変形性関節症の疼痛', halfLife: '約12時間', metabolism: 'CYP1A2（主）/2D6', renalAdjust: 'CCr < 30: 一般的でない', contraindication: 'MAO阻害薬併用、高度腎障害、高度肝障害、尿閉' },
    { generic: 'ベンラファキシン', brand: 'イフェクサーSR', specs: '37.5mg/75mgカプセル', indication: 'うつ病・うつ状態', halfLife: '約5時間（活性代謝物11時間）', metabolism: 'CYP2D6 → デスベンラファキシン（活性代謝物）', renalAdjust: 'CCr 30-70: 減量。CCr < 30: さらに減量', contraindication: 'MAO阻害薬併用' },
    { generic: 'ミルナシプラン', brand: 'トレドミン', specs: '12.5mg/25mg/50mg', indication: 'うつ病・うつ状態', halfLife: '約8時間', metabolism: 'グルクロン酸抱合（CYP非依存）', renalAdjust: '腎障害: 減量', contraindication: 'MAO阻害薬併用、尿閉、前立腺疾患' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本うつ病学会. うつ病治療ガイドライン 第2版 2023',
    'Cipriani A et al. Comparative efficacy and acceptability of 21 antidepressant drugs. Lancet 2018;391:1357-1366'],
  relatedTools: [
    { href: '/tools/calc/phq9', name: 'PHQ-9' },
    { href: '/tools/calc/gad7', name: 'GAD-7' },
    { href: '/tools/drugs/compare/hypnotic', name: '睡眠薬比較' }],
}

export default function SSRISNRIComparePage() { return <DrugCompareLayout data={data} /> }
