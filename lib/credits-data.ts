/**
 * 専門医単位 — 診療科要件データ + 型定義
 *
 * ※ 本情報は参考値です。正確な要件は各学会公式サイトでご確認ください。
 * 各学会の更新要件は年度により変更される場合があります。
 */

// ── 型定義 ──

export interface CreditCategory {
  id: string
  name: string
  maxCredits?: number
}

export interface SpecialtyRequirement {
  id: string
  name: string
  society: string
  requiredCredits: number
  renewalYears: number
  officialUrl: string
  categories: CreditCategory[]
  type: 'basic' | 'subspecialty'
}

export interface CreditEntry {
  id: string
  categoryId: string
  credits: number
  memo: string
  date: string
}

export interface UserCreditsData {
  selectedSpecialty: string | null
  entries: CreditEntry[]
  targetDate?: string
}

// ── 共通カテゴリテンプレート ──

const COMMON_CATEGORIES: CreditCategory[] = [
  { id: 'conference', name: '学会参加' },
  { id: 'presentation', name: '学会発表' },
  { id: 'paper', name: '論文発表' },
  { id: 'lecture', name: '講演・教育活動' },
  { id: 'seminar', name: '研修セミナー' },
  { id: 'self_study', name: '自己学習（e-learning等）' },
  { id: 'other', name: 'その他' },
]

// ── 基本領域19科 ──

const BASIC_SPECIALTIES: SpecialtyRequirement[] = [
  {
    id: 'internal',
    name: '内科専門医',
    society: '日本内科学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.naika.or.jp/',
    categories: [
      { id: 'conference', name: '学会参加', maxCredits: 20 },
      { id: 'presentation', name: '学会発表' },
      { id: 'paper', name: '論文発表' },
      { id: 'lecture', name: '教育講演' },
      { id: 'seminar', name: 'セルフトレーニング' },
      { id: 'other', name: 'その他' },
    ],
    type: 'basic',
  },
  {
    id: 'surgery',
    name: '外科専門医',
    society: '日本外科学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://jp.jssoc.or.jp/',
    categories: [
      { id: 'conference', name: '学会参加' },
      { id: 'presentation', name: '学会発表' },
      { id: 'paper', name: '論文発表' },
      { id: 'lecture', name: '教育セミナー' },
      { id: 'surgery_count', name: '手術症例' },
      { id: 'other', name: 'その他' },
    ],
    type: 'basic',
  },
  {
    id: 'pediatrics',
    name: '小児科専門医',
    society: '日本小児科学会',
    requiredCredits: 30,
    renewalYears: 5,
    officialUrl: 'https://www.jpeds.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'obgyn',
    name: '産婦人科専門医',
    society: '日本産科婦人科学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jsog.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'psychiatry',
    name: '精神科専門医',
    society: '日本精神神経学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jspn.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'dermatology',
    name: '皮膚科専門医',
    society: '日本皮膚科学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.dermatol.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'ophthalmology',
    name: '眼科専門医',
    society: '日本眼科学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.nichigan.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'otolaryngology',
    name: '耳鼻咽喉科専門医',
    society: '日本耳鼻咽喉科頭頸部外科学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jibika.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'urology',
    name: '泌尿器科専門医',
    society: '日本泌尿器科学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.urol.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'orthopedics',
    name: '整形外科専門医',
    society: '日本整形外科学会',
    requiredCredits: 60,
    renewalYears: 5,
    officialUrl: 'https://www.joa.or.jp/',
    categories: [
      { id: 'conference', name: '学会参加' },
      { id: 'presentation', name: '学会発表' },
      { id: 'paper', name: '論文発表' },
      { id: 'lecture', name: '教育研修講演' },
      { id: 'self_study', name: '自己学習' },
      { id: 'other', name: 'その他' },
    ],
    type: 'basic',
  },
  {
    id: 'neurosurgery',
    name: '脳神経外科専門医',
    society: '日本脳神経外科学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://jns.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'plastic_surgery',
    name: '形成外科専門医',
    society: '日本形成外科学会',
    requiredCredits: 30,
    renewalYears: 5,
    officialUrl: 'https://jsprs.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'radiology',
    name: '放射線科専門医',
    society: '日本医学放射線学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.radiology.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'anesthesiology',
    name: '麻酔科専門医',
    society: '日本麻酔科学会',
    requiredCredits: 60,
    renewalYears: 5,
    officialUrl: 'https://anesth.or.jp/',
    categories: [
      { id: 'conference', name: '学会参加' },
      { id: 'presentation', name: '学会発表' },
      { id: 'paper', name: '論文発表' },
      { id: 'lecture', name: '教育活動' },
      { id: 'anesthesia_count', name: '麻酔症例' },
      { id: 'other', name: 'その他' },
    ],
    type: 'basic',
  },
  {
    id: 'pathology',
    name: '病理専門医',
    society: '日本病理学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://pathology.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'clinical_lab',
    name: '臨床検査専門医',
    society: '日本臨床検査医学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jslm.org/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'emergency',
    name: '救急科専門医',
    society: '日本救急医学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jaam.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'rehabilitation',
    name: 'リハビリテーション科専門医',
    society: '日本リハビリテーション医学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jarm.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
  {
    id: 'general_practice',
    name: '総合診療専門医',
    society: '日本専門医機構',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://jmsb.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'basic',
  },
]

// ── サブスペシャリティ ──

const SUBSPECIALTIES: SpecialtyRequirement[] = [
  {
    id: 'cardiology',
    name: '循環器専門医',
    society: '日本循環器学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.j-circ.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'gastroenterology',
    name: '消化器病専門医',
    society: '日本消化器病学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jsge.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'pulmonology',
    name: '呼吸器専門医',
    society: '日本呼吸器学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jrs.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'endocrinology',
    name: '内分泌代謝科専門医',
    society: '日本内分泌学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.j-endo.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'nephrology',
    name: '腎臓専門医',
    society: '日本腎臓学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jsn.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'hematology',
    name: '血液専門医',
    society: '日本血液学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jshem.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'rheumatology',
    name: 'リウマチ専門医',
    society: '日本リウマチ学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.ryumachi-jp.com/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'gastro_surgery',
    name: '消化器外科専門医',
    society: '日本消化器外科学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jsgs.or.jp/',
    categories: [
      { id: 'conference', name: '学会参加' },
      { id: 'presentation', name: '学会発表' },
      { id: 'paper', name: '論文発表' },
      { id: 'surgery_count', name: '手術症例' },
      { id: 'other', name: 'その他' },
    ],
    type: 'subspecialty',
  },
  {
    id: 'thoracic_surgery',
    name: '呼吸器外科専門医',
    society: '日本呼吸器外科学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.chest.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'cardiovascular_surgery',
    name: '心臓血管外科専門医',
    society: '日本心臓血管外科学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jscvs.org/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'breast_surgery',
    name: '乳腺専門医',
    society: '日本乳癌学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jbcs.gr.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'infectious_disease',
    name: '感染症専門医',
    society: '日本感染症学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.kansensho.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'allergy',
    name: 'アレルギー専門医',
    society: '日本アレルギー学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jsaweb.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'geriatrics',
    name: '老年病専門医',
    society: '日本老年医学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jpn-geriat-soc.or.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'intensive_care',
    name: '集中治療専門医',
    society: '日本集中治療医学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jsicm.org/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'pain_clinic',
    name: 'ペインクリニック専門医',
    society: '日本ペインクリニック学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jspc.gr.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
  {
    id: 'palliative_care',
    name: '緩和医療専門医',
    society: '日本緩和医療学会',
    requiredCredits: 50,
    renewalYears: 5,
    officialUrl: 'https://www.jspm.ne.jp/',
    categories: COMMON_CATEGORIES,
    type: 'subspecialty',
  },
]

// ── エクスポート ──

export const ALL_SPECIALTIES: SpecialtyRequirement[] = [
  ...BASIC_SPECIALTIES,
  ...SUBSPECIALTIES,
]

export function getSpecialtyById(id: string): SpecialtyRequirement | undefined {
  return ALL_SPECIALTIES.find(s => s.id === id)
}
