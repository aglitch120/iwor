'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'laxative',
  category: '消化器治療薬',
  title: '便秘薬（下剤）比較表',
  description: '酸化マグネシウム・センノシド・ルビプロストン・リナクロチド・エロビキシバット・ナルデメジン・ラクツロースの7剤を比較。作用機序・腎機能・オピオイド誘発性便秘。',
  columns: ['generic', 'brand', 'halfLife', 'features', 'renalAdjust', 'contraindication'],
  drugs: [
    { generic: '酸化マグネシウム', brand: 'マグミット/マグラックス', specs: '250mg/330mg/500mg', indication: '便秘、制酸', halfLife: '—（腸管内で作用）', metabolism: '吸収されたMgは腎排泄', renalAdjust: 'GFR < 30: 高Mg血症リスク → 禁忌に近い。定期的にMg値測定', contraindication: '高Mg血症、重篤な腎障害、心ブロック' },
    { generic: 'センノシド', brand: 'プルゼニド', specs: '12mg', indication: '便秘', halfLife: '—（腸管内で活性化）', metabolism: '大腸細菌でレインアンスロンに変換', renalAdjust: '通常不要', contraindication: '急性腹症、重症の硬結便、痙攣性便秘' },
    { generic: 'ルビプロストン', brand: 'アミティーザ', specs: '24μgカプセル', indication: '慢性便秘', halfLife: '約0.9-1.4時間', metabolism: '胃酸・脂肪酸レダクターゼによる還元', renalAdjust: '通常不要', contraindication: '妊婦（動物実験で流産）、腸閉塞' },
    { generic: 'リナクロチド', brand: 'リンゼス', specs: '0.25mg', indication: '便秘型IBS、慢性便秘', halfLife: '—（腸管内で作用）', metabolism: '腸管内でペプチダーゼにより分解', renalAdjust: '通常不要', contraindication: '腸閉塞（確認済み or 疑い）' },
    { generic: 'エロビキシバット', brand: 'グーフィス', specs: '5mg', indication: '慢性便秘', halfLife: '—（腸管内で作用、全身吸収わずか）', metabolism: '全身吸収はわずか', renalAdjust: '通常不要', contraindication: '腸閉塞（確認済み or 疑い）' },
    { generic: 'ナルデメジン', brand: 'スインプロイク', specs: '0.2mg', indication: 'オピオイド誘発性便秘（OIC）', halfLife: '約11時間', metabolism: 'CYP3A4（主）', renalAdjust: '通常不要', contraindication: '消化管閉塞（既知/疑い）、消化管穿孔リスクのある消化管壁の器質的障害' },
    { generic: 'ラクツロース', brand: 'モニラック/ラグノス', specs: 'シロップ', indication: '慢性便秘、高アンモニア血症（肝性脳症）', halfLife: '—（腸管内で作用）', metabolism: '大腸細菌で乳酸・酢酸に分解', renalAdjust: '通常不要', contraindication: 'ガラクトース血症' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本消化器病学会. 便通異常症診療ガイドライン 2023 — 慢性便秘症',
    'Katakami N et al. Naldemedine (COMPOSE-4/5). Lancet Oncol 2017'],
  relatedTools: [
    { href: '/tools/drugs/compare/ppi', name: 'PPI比較' },
    { href: '/tools/calc/egfr', name: 'eGFR' },
    { href: '/tools/calc/child-pugh', name: 'Child-Pugh' }],
}

export default function LaxativeComparePage() { return <DrugCompareLayout data={data} /> }
