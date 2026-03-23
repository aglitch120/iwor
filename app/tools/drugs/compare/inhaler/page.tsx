'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'inhaler',
  category: '呼吸器',
  title: '吸入薬（ICS/LABA/LAMA）比較表',
  description: '喘息・COPDに使用される主要吸入薬7製剤を比較。ICS+LABA合剤・トリプル製剤・デバイスの種類・吸入手技。',
  columns: ['generic', 'brand', 'features', 'contraindication'],
  drugs: [
    { generic: 'フルティカゾンフランカルボン酸/ビランテロール', brand: 'レルベア', specs: 'エリプタ 100/200', indication: '喘息、COPD', halfLife: 'ICS 24時間、LABA 25時間', metabolism: 'CYP3A4（ICS）', renalAdjust: '通常不要', features: '【成分】ICS+LABA【吸入】1日1回1吸入【デバイス】エリプタ（DPI・カウンター付き）【特徴】操作が最もシンプル。吸入力弱い高齢者にも使いやすい', contraindication: '有効な抗菌薬のない感染症（ICS共通・相対的）' },
    { generic: 'ブデソニド/ホルモテロール', brand: 'シムビコート', specs: 'タービュヘイラー', indication: '喘息、COPD', halfLife: 'ICS 2-3時間、LABA 10時間', metabolism: 'CYP3A4（ICS）', renalAdjust: '通常不要', features: '【成分】ICS+LABA【吸入】1日2回 各1-4吸入（SMART療法: 維持+発作時頓用可）【デバイス】タービュヘイラー（DPI）【特徴】喘息でSMART療法の唯一の適応薬。発作時にも追加吸入可', contraindication: '急性発作時の単独使用は不可' },
    { generic: 'フルティカゾンプロピオン酸/サルメテロール', brand: 'アドエア', specs: 'ディスカス/エアゾール', indication: '喘息、COPD', halfLife: 'ICS 7.8時間、LABA 5.5時間', metabolism: 'CYP3A4（ICS）', renalAdjust: '通常不要', features: '【成分】ICS+LABA【吸入】1日2回 各1吸入【デバイス】ディスカス(DPI)/エアゾール(pMDI)【特徴】長年の使用実績。pMDI選択可で吸入力不要', contraindication: '急性発作には不適' },
    { generic: 'フルティカゾンフランカルボン酸/ウメクリジニウム/ビランテロール', brand: 'テリルジー', specs: 'エリプタ 100/200', indication: '喘息（ICS/LABAで不十分）、COPD', halfLife: 'ICS 24h、LAMA 11h、LABA 25h', metabolism: 'CYP3A4（ICS）', renalAdjust: '通常不要', features: '【成分】ICS+LAMA+LABA（トリプル）【吸入】1日1回1吸入【デバイス】エリプタ【特徴】3成分が1吸入で完結。COPD・重症喘息のstep up', contraindication: '閉塞隅角緑内障、前立腺肥大による排尿障害' },
    { generic: 'チオトロピウム', brand: 'スピリーバ', specs: 'レスピマット/ハンディヘラー', indication: 'COPD、喘息（追加療法）', halfLife: '約25時間', metabolism: '腎排泄 74%', renalAdjust: '重度腎障害: 慎重投与', features: '【成分】LAMA単剤【吸入】1日1回（レスピマット2吸入/ハンディヘラー1カプセル）【デバイス】レスピマット(SMI)/ハンディヘラー(DPI)【特徴】COPD第一選択。喘息にも追加療法で適応あり', contraindication: 'アトロピンアレルギー、閉塞隅角緑内障、前立腺肥大' },
    { generic: 'インダカテロール/グリコピロニウム', brand: 'ウルティブロ', specs: 'ブリーズヘラー', indication: 'COPD', halfLife: 'LABA 40-52h、LAMA 33h', metabolism: 'CYP3A4/UGT1A1（LABA）', renalAdjust: '重度腎障害: 慎重投与', features: '【成分】LABA+LAMA【吸入】1日1回1カプセル【デバイス】ブリーズヘラー（DPI・カプセル装填式）【特徴】ICS不要のCOPDデュアル。吸入音で確認可', contraindication: '閉塞隅角緑内障、前立腺肥大による排尿障害' },
    { generic: 'モメタゾンフランカルボン酸', brand: 'アズマネックス', specs: 'ツイストヘラー', indication: '喘息', halfLife: '約5時間', metabolism: 'CYP3A4', renalAdjust: '通常不要', features: '【成分】ICS単剤【吸入】1日1-2回 各1吸入【デバイス】ツイストヘラー（DPI・キャップ開閉で充填）【特徴】ICS単剤。軽症喘息Step1-2', contraindication: '有効な抗菌薬のない感染症（相対的）' }],
  seoContent: [
  ],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本アレルギー学会. 喘息予防・管理ガイドライン 2024（JGL2024）',
    '日本呼吸器学会. COPD診断と治療のためのガイドライン 2022',
    'GOLD 2024 Report (Global Initiative for Chronic Obstructive Lung Disease)'],
  relatedTools: [
    { href: '/tools/calc/aa-gradient', name: 'A-aDO₂' },
    { href: '/tools/drugs/compare/steroid', name: 'ステロイド比較' }],
}

export default function InhalerComparePage() { return <DrugCompareLayout data={data} /> }
