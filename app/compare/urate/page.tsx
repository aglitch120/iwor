'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'urate',
  category: '代謝・内分泌',
  title: '尿酸降下薬 比較表',
  description: 'フェブキソスタット・アロプリノール・トピロキソスタット・ベンズブロマロン・ドチヌラドの5剤を比較。XOR阻害薬 vs 尿酸排泄促進薬・腎機能別選択。',
  columns: ['generic', 'brand', 'halfLife', 'metabolism', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'フェブキソスタット', brand: 'フェブリク', specs: '10mg/20mg/40mg', indication: '痛風、高尿酸血症', halfLife: '約5-8時間', metabolism: '肝代謝（グルクロン酸抱合・CYP1A2/2C8/2C9）', renalAdjust: '軽〜中等度腎障害: 用量調整不要', contraindication: 'メルカプトプリン・アザチオプリン併用' },
    { generic: 'アロプリノール', brand: 'ザイロリック', specs: '50mg/100mg', indication: '痛風、高尿酸血症', halfLife: '約1-2時間（活性代謝物オキシプリノール18-30時間）', metabolism: 'XOR → オキシプリノール（活性代謝物）→ 腎排泄', renalAdjust: 'CCr < 60: 減量必要。CCr < 30: さらに減量', contraindication: 'メルカプトプリン・アザチオプリン併用' },
    { generic: 'トピロキソスタット', brand: 'トピロリック/ウリアデック', specs: '20mg/40mg/60mg/80mg', indication: '痛風、高尿酸血症', halfLife: '約3-5時間', metabolism: '肝代謝（グルクロン酸抱合）', renalAdjust: '腎機能低下例にも使用可', contraindication: 'メルカプトプリン・アザチオプリン併用' },
    { generic: 'ベンズブロマロン', brand: 'ユリノーム', specs: '25mg/50mg', indication: '痛風、高尿酸血症', halfLife: '約3時間', metabolism: 'CYP2C9', renalAdjust: '尿路結石リスク上昇。尿酸結石予防にクエン酸K併用', contraindication: '尿路結石、重篤な腎障害、肝障害' },
    { generic: 'ドチヌラド', brand: 'ユリス', specs: '0.5mg/1mg/2mg', indication: '痛風、高尿酸血症', halfLife: '約10時間', metabolism: 'グルクロン酸抱合（BCRP・MRP4阻害で腎尿細管からの尿酸再吸収を阻害）', renalAdjust: '重度腎障害: 慎重投与', contraindication: '重篤な腎障害' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本痛風・尿酸核酸学会. 高尿酸血症・痛風の治療ガイドライン 第3版 2022',
    'FitzGerald JD et al. 2020 ACR Guideline for Management of Gout. Arthritis Care Res 2020'],
  relatedTools: [
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/compare/nsaids', name: 'NSAIDs比較' }],
}

export default function UrateComparePage() { return <DrugCompareLayout data={data} /> }
