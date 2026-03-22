'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'cephalosporin',
  category: '感染症',
  title: 'セフェム系抗菌薬 比較表',
  description: 'セファゾリン・セフメタゾール・セフトリアキソン・セフェピム・セフタジジム・セフォタキシムの6剤（注射剤中心）を比較。世代別スペクトラム・胆泥・偽膜性腸炎。',
  columns: ['generic', 'brand', 'halfLife', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'セファゾリン (CEZ)', brand: 'セファメジン', specs: '注射 0.5g/1g/2g', indication: '術後感染予防、皮膚軟部組織、MSSA菌血症', halfLife: '約1.8時間', metabolism: '腎排泄 80%以上', renalAdjust: 'CCr < 30: 減量・投与間隔延長', contraindication: 'セフェム系アレルギー' },
    { generic: 'セフメタゾール (CMZ)', brand: 'セフメタゾン', specs: '注射 0.5g/1g/2g', indication: '腹腔内感染、尿路感染、嫌気性菌混合感染', halfLife: '約1.2時間', metabolism: '腎排泄 80%以上', renalAdjust: 'CCr < 30: 減量', contraindication: 'セフェム系アレルギー' },
    { generic: 'セフトリアキソン (CTRX)', brand: 'ロセフィン', specs: '注射 0.5g/1g', indication: '市中肺炎、尿路感染、髄膜炎、菌血症', halfLife: '約8時間', metabolism: '胆汁排泄 40% + 腎排泄 60%', renalAdjust: '腎障害のみでは調整不要（胆汁排泄あり）。透析で除去されにくい', contraindication: 'セフェム系アレルギー、新生児の高ビリルビン血症（Ca製剤同時投与禁忌）' },
    { generic: 'セフォタキシム (CTX)', brand: 'クラフォラン/セフォタックス', specs: '注射 0.5g/1g', indication: '髄膜炎、市中肺炎、尿路感染', halfLife: '約1時間（活性代謝物2時間）', metabolism: '肝で脱アセチル化 → 活性代謝物。腎排泄', renalAdjust: 'CCr < 30: 減量', contraindication: 'セフェム系アレルギー' },
    { generic: 'セフタジジム (CAZ)', brand: 'モダシン', specs: '注射 0.5g/1g/2g', indication: '緑膿菌感染症、発熱性好中球減少症', halfLife: '約1.8時間', metabolism: '腎排泄 80%以上', renalAdjust: 'CCr < 30: 減量・間隔延長', contraindication: 'セフェム系アレルギー' },
    { generic: 'セフェピム (CFPM)', brand: 'マキシピーム', specs: '注射 0.5g/1g/2g', indication: '発熱性好中球減少症、院内肺炎、緑膿菌感染', halfLife: '約2時間', metabolism: '腎排泄 85%', renalAdjust: 'CCr < 50: 減量。特に腎障害で脳症リスク上昇', contraindication: 'セフェム系アレルギー' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    'JAID/JSC感染症治療ガイド 2023',
    '日本化学療法学会. 抗菌薬TDMガイドライン 2022'],
  relatedTools: [
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/tools/calc/cockcroft-gault', name: 'Cockcroft-Gault' },
    { href: '/tools/calc/qsofa', name: 'qSOFA' },
    { href: '/compare/quinolone', name: 'キノロン系比較' }],
}

export default function CephalosporinComparePage() { return <DrugCompareLayout data={data} /> }
