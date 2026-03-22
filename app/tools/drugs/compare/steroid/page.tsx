'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'steroid',
  category: '抗炎症・免疫抑制',
  title: '経口ステロイド（糖質コルチコイド）比較表',
  description: 'プレドニゾロン・メチルプレドニゾロン・デキサメタゾン・ベタメタゾン・ヒドロコルチゾン・トリアムシノロンの6剤を比較。力価換算・半減期・鉱質コルチコイド作用。',
  columns: ['generic', 'brand', 'halfLife', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'プレドニゾロン (PSL)', brand: 'プレドニン', specs: '1mg/5mg', indication: '各種炎症・免疫疾患・アレルギー・副腎不全補充', halfLife: '生物学的半減期 12-36時間', metabolism: '肝代謝（CYP3A4）', renalAdjust: '通常不要', contraindication: '有効な抗菌薬のない感染症、全身真菌症（相対的）' },
    { generic: 'メチルプレドニゾロン (mPSL)', brand: 'メドロール/ソル・メドロール', specs: '2mg/4mg錠、注40mg/125mg/500mg/1000mg', indication: '各種炎症・免疫疾患、パルス療法', halfLife: '生物学的半減期 12-36時間', metabolism: '肝代謝（CYP3A4）', renalAdjust: '通常不要', contraindication: '有効な抗菌薬のない感染症' },
    { generic: 'デキサメタゾン (DEX)', brand: 'デカドロン', specs: '0.5mg/4mg錠、注', indication: '脳浮腫、悪心・嘔吐、炎症、クッシング症候群診断（DST）', halfLife: '生物学的半減期 36-72時間', metabolism: '肝代謝（CYP3A4）', renalAdjust: '通常不要', contraindication: '有効な抗菌薬のない感染症' },
    { generic: 'ベタメタゾン', brand: 'リンデロン', specs: '0.5mg錠、注', indication: '各種炎症・アレルギー、胎児肺成熟', halfLife: '生物学的半減期 36-72時間', metabolism: '肝代謝', renalAdjust: '通常不要', contraindication: '有効な抗菌薬のない感染症' },
    { generic: 'ヒドロコルチゾン', brand: 'コートリル/ソル・コーテフ', specs: '10mg錠、注100mg/500mg', indication: '副腎不全補充、アジソン病、副腎クリーゼ', halfLife: '生物学的半減期 8-12時間', metabolism: '肝代謝（11β-HSD）', renalAdjust: '通常不要', contraindication: '有効な抗菌薬のない感染症' },
    { generic: 'トリアムシノロン', brand: 'レダコート/ケナコルト', specs: '4mg錠、関節注', indication: '関節内注射、各種炎症', halfLife: '生物学的半減期 12-36時間', metabolism: '肝代謝', renalAdjust: '通常不要', contraindication: '有効な抗菌薬のない感染症' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    'RECOVERY Collaborative Group. Dexamethasone in hospitalized patients with Covid-19. N Engl J Med 2021;384:693-704',
    '日本内分泌学会. 副腎クリーゼを含む副腎皮質機能低下症の診断と治療に関するガイドライン 2014'],
  relatedTools: [
    { href: '/tools/calc/steroid-converter', name: 'ステロイド換算' },
    { href: '/tools/calc/bmi', name: 'BMI' },
    { href: '/tools/drugs/compare/nsaids', name: 'NSAIDs比較' }],
}

export default function SteroidComparePage() { return <DrugCompareLayout data={data} /> }
