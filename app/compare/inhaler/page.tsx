'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'inhaler',
  category: '呼吸器',
  title: '吸入薬（ICS/LABA/LAMA）比較表',
  description: '喘息・COPDに使用される主要吸入薬7製剤を比較。ICS+LABA合剤・トリプル製剤・デバイスの種類・吸入手技。',
  columns: ['generic', 'brand', 'features', 'contraindication'],
  drugs: [
    { generic: 'フルティカゾンフランカルボン酸/ビランテロール', brand: 'レルベア', specs: 'エリプタ', indication: '喘息、COPD', halfLife: 'ICS 24時間、LABA 25時間', metabolism: 'CYP3A4（ICS）', renalAdjust: '通常不要', contraindication: '有効な抗菌薬のない感染症（ICS共通・相対的）' },
    { generic: 'ブデソニド/ホルモテロール', brand: 'シムビコート', specs: 'タービュヘイラー', indication: '喘息、COPD', halfLife: 'ICS 2-3時間、LABA 10時間', metabolism: 'CYP3A4（ICS）', renalAdjust: '通常不要', contraindication: '急性発作時の単独使用は不可' },
    { generic: 'フルティカゾンプロピオン酸/サルメテロール', brand: 'アドエア', specs: 'ディスカス/エアゾール', indication: '喘息、COPD', halfLife: 'ICS 7.8時間、LABA 5.5時間', metabolism: 'CYP3A4（ICS）', renalAdjust: '通常不要', contraindication: '急性発作には不適' },
    { generic: 'フルティカゾンフランカルボン酸/ウメクリジニウム/ビランテロール', brand: 'テリルジー', specs: 'エリプタ', indication: '喘息（ICS/LABAで不十分な場合）、COPD', halfLife: 'ICS 24h、LAMA 11h、LABA 25h', metabolism: 'CYP3A4（ICS）', renalAdjust: '通常不要', contraindication: '閉塞隅角緑内障、前立腺肥大による排尿障害' },
    { generic: 'チオトロピウム', brand: 'スピリーバ', specs: 'レスピマット/ハンディヘラー', indication: 'COPD、喘息（追加療法）', halfLife: '約25時間', metabolism: '腎排泄 74%', renalAdjust: '重度腎障害: 慎重投与', contraindication: 'アトロピンアレルギー、閉塞隅角緑内障、前立腺肥大による排尿障害' },
    { generic: 'インダカテロール/グリコピロニウム', brand: 'ウルティブロ', specs: 'ブリーズヘラー', indication: 'COPD', halfLife: 'LABA 40-52h、LAMA 33h', metabolism: 'CYP3A4/UGT1A1（LABA）', renalAdjust: '重度腎障害: 慎重投与', contraindication: '閉塞隅角緑内障、前立腺肥大による排尿障害' },
    { generic: 'モメタゾンフランカルボン酸', brand: 'アズマネックス', specs: 'ツイストヘラー', indication: '喘息', halfLife: '約5時間', metabolism: 'CYP3A4', renalAdjust: '通常不要', contraindication: '有効な抗菌薬のない感染症（相対的）' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本アレルギー学会. 喘息予防・管理ガイドライン 2024（JGL2024）',
    '日本呼吸器学会. COPD診断と治療のためのガイドライン 2022',
    'GOLD 2024 Report (Global Initiative for Chronic Obstructive Lung Disease)'],
  relatedTools: [
    { href: '/tools/calc/aa-gradient', name: 'A-aDO₂' },
    { href: '/compare/steroid', name: 'ステロイド比較' }],
}

export default function InhalerComparePage() { return <DrugCompareLayout data={data} /> }
