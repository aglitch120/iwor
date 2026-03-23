'use client'
import DrugCompareLayout, { CompareData } from '@/components/compare/DrugCompareLayout'

const data: CompareData = {
  slug: 'patch',
  category: '外用鎮痛',
  title: '湿布薬（外用鎮痛消炎薬）使い分け',
  description: 'ロキソプロフェン・ジクロフェナク・フェルビナク・インドメタシン・フルルビプロフェン・ケトプロフェン・サリチル酸メチル。NSAIDs貼付薬の力価・光線過敏・枚数制限。',
  columns: ['generic', 'brand', 'features', 'contraindication'],
  drugs: [
    { generic: 'ロキソプロフェンナトリウム', brand: 'ロキソニンテープ/パップ', specs: 'テープ50mg/100mg, パップ100mg', indication: '変形性関節症・筋肉痛・腱鞘炎等', halfLife: '経皮吸収後 約1.2時間', metabolism: '肝代謝（経皮吸収は全身移行少）', renalAdjust: '通常不要', features: '鎮痛効果が高くテープは薄型で剥がれにくい。パップは冷感。1日1回貼付。処方枚数制限: 63枚/回(テープ100mg), 56枚/回(パップ)', contraindication: 'アスピリン喘息、妊娠後期。光線過敏症リスク低い' },
    { generic: 'ジクロフェナクナトリウム', brand: 'ボルタレンテープ/ゲル', specs: 'テープ15mg/30mg', indication: '変形性関節症・筋肉痛・腱鞘炎等', halfLife: '全身T1/2 約1.2時間', metabolism: '肝代謝', renalAdjust: '通常不要', features: '鎮痛力はNSAIDsテープ中最強クラス。テープ30mgは1日1回。15mgは1日2回まで。処方枚数制限: 70枚/回(15mg)', contraindication: 'アスピリン喘息、妊娠後期。光線過敏症の報告あり（少ない）' },
    { generic: 'フェルビナク', brand: 'セルタッチパップ/スミルテープ', specs: 'パップ70mg, テープ35mg/70mg', indication: '変形性関節症・筋肉痛等', halfLife: '全身移行少', metabolism: '肝代謝', renalAdjust: '通常不要', features: '中等度の鎮痛力。スミルテープは薄型で密着性良好。1日2回まで。光線過敏リスク低い', contraindication: 'アスピリン喘息' },
    { generic: 'インドメタシン', brand: 'カトレップパップ/イドメシンコーワ', specs: 'パップ70mg', indication: '変形性関節症・筋肉痛等', halfLife: '全身T1/2 約4.5時間', metabolism: '肝代謝(CYP2C9)', renalAdjust: '通常不要', features: '鎮痛力は高め。1日2回まで。古典的NSAIDsで副作用プロファイルの知見豊富', contraindication: 'アスピリン喘息、妊娠後期。消化管リスクはやや高い（全身移行時）' },
    { generic: 'フルルビプロフェン', brand: 'アドフィードパップ/ゼポラスパップ', specs: 'パップ40mg', indication: '変形性関節症・筋肉痛等', halfLife: '全身T1/2 約5.8時間', metabolism: '肝代謝(CYP2C9)', renalAdjust: '通常不要', features: '経皮吸収率高め。鎮痛力はジクロフェナクに次ぐ。1日2回。光線過敏リスク低い', contraindication: 'アスピリン喘息、妊娠後期' },
    { generic: 'ケトプロフェン', brand: 'モーラステープ/パップ', specs: 'テープ20mg/40mg, パップ30mg', indication: '変形性関節症・筋肉痛・腱鞘炎等', halfLife: '全身T1/2 約1.6時間', metabolism: '肝グルクロン酸抱合', renalAdjust: '通常不要', features: '最も処方量の多い湿布薬。テープは薄型。1日1回(テープ)〜2回(パップ)。⚠️光線過敏症リスクが高い（剥がした後も4週間は遮光必要）', contraindication: 'アスピリン喘息、妊娠後期、光線過敏症の既往。チアプロフェン酸・スプロフェン・フェノフィブラート使用中（交差過敏）' },
    { generic: 'サリチル酸メチル/メントール', brand: 'MS温シップ/MS冷シップ/サロンパス', specs: 'OTC多数', indication: '筋肉痛・打撲・捻挫', halfLife: '全身移行は少ない', metabolism: '局所作用主体', renalAdjust: '不要', features: '鎮痛力は弱い（NSAIDsではない）。OTCで入手容易。冷感/温感タイプあり。枚数制限なし。安全性高い', contraindication: '特に重大なものなし（過敏症のみ）' },
  ],
  seoContent: [],
  references: [
    '各薬剤の添付文書（最新版）',
    '日本整形外科学会/日本腰痛学会 腰痛診療ガイドライン 2019',
    '日本ペインクリニック学会 NSAIDs外用薬に関する提言',
    '厚生労働省 処方箋医薬品の処方制限（外用鎮痛消炎薬）2022改定',
  ],
  relatedTools: [
    { href: '/tools/drugs/compare/nsaids', name: 'NSAIDs比較' },
    { href: '/tools/calc/low-back-red-flags', name: '腰痛レッドフラッグ' },
  ],
}

export default function PatchComparePage() { return <DrugCompareLayout data={data} /> }
