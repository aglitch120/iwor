'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'antihistamine',
  category: '抗アレルギー薬',
  title: '抗ヒスタミン薬（第2世代）比較表',
  description: 'フェキソフェナジン・ロラタジン・デスロラタジン・セチリジン・レボセチリジン・ビラスチン・ルパタジン・オロパタジンの8剤を比較。眠気・自動車運転制限・食事の影響。',
  columns: ['generic', 'brand', 'halfLife', 'metabolism', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: 'フェキソフェナジン', brand: 'アレグラ', specs: '30mg/60mg', indication: 'アレルギー性鼻炎、蕁麻疹、皮膚疾患の掻痒', halfLife: '約14時間', metabolism: '肝代謝ほぼなし。胆汁・腎排泄', renalAdjust: '重度腎障害: 慎重投与', features: '【眠気】ほぼなし（脳内H1占拠率≒0%）【運転】制限なし【食事】影響なし【その他】OTC(アレグラFX)あり。1日2回', contraindication: '特になし（過敏症のみ）' },
    { generic: 'ロラタジン', brand: 'クラリチン', specs: '10mg錠/OD錠', indication: 'アレルギー性鼻炎、蕁麻疹', halfLife: '約8時間（活性代謝物14時間）', metabolism: 'CYP3A4/2D6 → デスロラタジン（活性代謝物）', renalAdjust: '肝障害: 隔日投与', features: '【眠気】ほぼなし（脳内H1占拠率≒0%）【運転】制限なし【食事】影響なし【その他】OTC(クラリチンEX)あり。1日1回', contraindication: '特になし（過敏症のみ）' },
    { generic: 'デスロラタジン', brand: 'デザレックス', specs: '5mg', indication: 'アレルギー性鼻炎、蕁麻疹', halfLife: '約19-34時間', metabolism: 'グルクロン酸抱合。CYP関与少', renalAdjust: '通常不要', features: '【眠気】ほぼなし（脳内H1占拠率≒0%）【運転】制限なし【食事】影響なし【その他】ロラタジンの活性代謝物。1日1回。長時間作用', contraindication: '特になし（過敏症のみ）' },
    { generic: 'セチリジン', brand: 'ジルテック', specs: '5mg/10mg錠', indication: 'アレルギー性鼻炎、蕁麻疹、皮膚疾患の掻痒', halfLife: '約7-11時間', metabolism: '肝代謝少。主に腎排泄（未変化体60%）', renalAdjust: 'CCr < 30: 減量。透析: 使用不可', features: '【眠気】やや多い（脳内H1占拠率約26%）【運転】注意（添付文書に運転注意記載）【食事】影響少【その他】効果発現が速い。1日1回', contraindication: '重篤な腎障害（透析）' },
    { generic: 'レボセチリジン', brand: 'ザイザル', specs: '2.5mg/5mg錠', indication: 'アレルギー性鼻炎、蕁麻疹、皮膚疾患の掻痒', halfLife: '約7-10時間', metabolism: '肝代謝少。腎排泄主体', renalAdjust: 'CCr < 30: 減量。透析: 使用不可', features: '【眠気】やや多い（脳内H1占拠率約15%）【運転】注意（運転注意記載）【食事】影響少【その他】セチリジンのR体。少量で同等効果。1日1回就寝前', contraindication: '重篤な腎障害（透析）' },
    { generic: 'ビラスチン', brand: 'ビラノア', specs: '20mg', indication: 'アレルギー性鼻炎、蕁麻疹', halfLife: '約10.5時間', metabolism: '肝代謝ほぼなし。未変化体で排泄', renalAdjust: '通常不要', features: '【眠気】ほぼなし（脳内H1占拠率≒0%）【運転】制限なし【食事】⚠️空腹時服用必須（食後で吸収40-60%↓）【その他】1日1回。食事の1時間前 or 2時間後', contraindication: '特になし（過敏症のみ）' },
    { generic: 'ルパタジン', brand: 'ルパフィン', specs: '10mg', indication: 'アレルギー性鼻炎、蕁麻疹', halfLife: '約6時間（活性代謝物デスロラタジン19時間）', metabolism: 'CYP3A4 → デスロラタジン（活性代謝物）', renalAdjust: '通常不要', features: '【眠気】軽度（脳内H1占拠率約5%）【運転】注意（運転注意記載）【食事】食事で吸収↑(Cmax53%↑)【その他】抗PAF作用もあり。1日1回。蕁麻疹に強い', contraindication: '特になし（過敏症のみ）' },
    { generic: 'オロパタジン', brand: 'アレロック', specs: '2.5mg/5mg', indication: 'アレルギー性鼻炎、蕁麻疹、皮膚疾患の掻痒', halfLife: '約8-12時間', metabolism: '肝代謝少。腎排泄主体', renalAdjust: '重度腎障害: 慎重投与', features: '【眠気】やや多い（脳内H1占拠率約23%）【運転】注意（運転注意記載）【食事】影響少【その他】抗アレルギー効果強い。掻痒に有効。1日2回', contraindication: '特になし（過敏症のみ）' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本アレルギー学会. アレルギー性鼻炎ガイド 2024',
    '鼻アレルギー診療ガイドライン 2024（日本耳鼻咽喉科免疫アレルギー学会）',
    'Yanai K et al. H1 receptor occupancy of antihistamines. Clin Exp Allergy 2017'],
  relatedTools: [
    { href: '/tools/drugs/compare/nsaids', name: 'NSAIDs比較' },
    { href: '/tools/drugs/compare/ppi', name: 'PPI比較' }],
}

export default function AntihistamineComparePage() { return <DrugCompareLayout data={data} /> }
