'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'quinolone',
  category: '感染症',
  title: 'キノロン系抗菌薬 比較表',
  description: 'レボフロキサシン・モキシフロキサシン・シプロフロキサシン・シタフロキサシン・ガレノキサシン・トスフロキサシンの6剤を比較。抗菌スペクトラム・QT延長・腱障害。',
  columns: ['generic', 'brand', 'halfLife', 'metabolism', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'レボフロキサシン (LVFX)', brand: 'クラビット', specs: '250mg/500mg', indication: '呼吸器・尿路・皮膚軟部組織感染症', halfLife: '約7-8時間', metabolism: '腎排泄 80%以上（未変化体）', renalAdjust: 'CCr < 50: 減量必須。CCr < 20: さらに減量', contraindication: '小児・妊婦・授乳婦、てんかん（痙攣閾値低下）、QT延長' },
    { generic: 'モキシフロキサシン (MFLX)', brand: 'アベロックス', specs: '400mg', indication: '呼吸器感染症', halfLife: '約12時間', metabolism: 'グルクロン酸/硫酸抱合。腎排泄は少ない', renalAdjust: '通常不要（肝代謝主体）', contraindication: '小児・妊婦、QT延長・低K血症、重篤な肝障害' },
    { generic: 'シプロフロキサシン (CPFX)', brand: 'シプロキサン', specs: '100mg/200mg錠、注', indication: '尿路・腸管・骨関節感染症、炭疽', halfLife: '約4時間', metabolism: 'CYP1A2（一部）、腎排泄 40-50%', renalAdjust: 'CCr < 30: 減量', contraindication: '小児・妊婦、テオフィリン併用時注意' },
    { generic: 'シタフロキサシン (STFX)', brand: 'グレースビット', specs: '50mg', indication: '呼吸器・尿路・耳鼻科感染症', halfLife: '約6時間', metabolism: 'グルクロン酸抱合、腎排泄 50%', renalAdjust: '重度腎障害: 減量', contraindication: '小児・妊婦' },
    { generic: 'ガレノキサシン (GRNX)', brand: 'ジェニナック', specs: '200mg', indication: '呼吸器・耳鼻科感染症', halfLife: '約11時間', metabolism: 'グルクロン酸抱合。CYP関与少', renalAdjust: '通常不要', contraindication: '小児・妊婦' },
    { generic: 'トスフロキサシン (TFLX)', brand: 'オゼックス', specs: '75mg/150mg', indication: '呼吸器・尿路・耳鼻科感染症、小児中耳炎', halfLife: '約6時間', metabolism: 'グルクロン酸抱合、腎排泄', renalAdjust: '重度腎障害: 減量', contraindication: '妊婦' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    'JAID/JSC感染症治療ガイド 2023',
    '日本結核・非結核性抗酸菌症学会. 結核診療ガイドライン'],
  relatedTools: [
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/tools/calc/cockcroft-gault', name: 'Cockcroft-Gault' },
    { href: '/tools/calc/curb65', name: 'CURB-65' },
    { href: '/compare/cephalosporin', name: 'セフェム系比較' }],
}

export default function QuinoloneComparePage() { return <DrugCompareLayout data={data} /> }
