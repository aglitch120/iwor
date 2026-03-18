'use client'
import InteractiveTutorial, { TutorialStep } from '@/components/InteractiveTutorial'

const TUTORIALS: Record<string, TutorialStep[]> = {
  tools: [
    { emoji: '🧮', title: '臨床計算ツール', desc: '152種の計算ツールを診療科別に検索。eGFR・CHADS₂・SOFAなど。' },
    { emoji: '🚨', title: 'ER・救急対応', desc: '22の主訴別対応フロー。胸痛・意識障害・ショックなど。ACLS/BLSも。' },
    { emoji: '🏥', title: '入院中トラブル', desc: 'ショック・せん妄・転倒・血糖異常など10項目の初期対応フロー。' },
    { emoji: '🔬', title: '検査読影・薬剤ガイド', desc: 'CT・エコー・心電図の系統的読影チェックリスト。抗菌薬・ステロイド・オピオイドガイド。' },
    { emoji: '⭐', title: 'お気に入り登録', desc: 'よく使うツールは★ボタンでお気に入り登録。次回からすぐアクセスできます。' },
  ],
  er: [
    { emoji: '🚨', title: 'ER対応ツリーの使い方', desc: '主訴を選択→ステップに沿って選択肢を選ぶだけ。鑑別疾患と初期対応が表示されます。' },
    { emoji: '🔴', title: '重症度カラー', desc: '🔴緊急（即座に対応）🟠準緊急（速やかに対応）🟡中等度🟢低リスク。色で重症度がわかります。' },
    { emoji: '⚠️', title: 'Pitfall', desc: '各結果には「ピットフォール」が表示されます。見逃しやすいポイントを確認しましょう。' },
  ],
  inpatient: [
    { emoji: '🏥', title: '入院中トラブル対応', desc: 'トラブルの種類を選択→ステップに沿って評価。初期対応・検査・Dispositionが表示されます。' },
    { emoji: '📋', title: '対応フローの見方', desc: '選択肢をタップすると次のステップに進みます。「戻る」で前のステップに戻れます。' },
  ],
  interpret: [
    { emoji: '🔬', title: '検査読影の使い方', desc: 'チェックリストから所見を選択→鑑別疾患と推奨アクションが自動表示されます。' },
    { emoji: '🔒', title: 'FREE / PRO', desc: '所見のチェックと計算はFREE。推奨アクション（解釈部分）はPRO会員限定です。' },
  ],
  procedures: [
    { emoji: '🩺', title: '手技ガイドの使い方', desc: '手技名をタップすると手順・コツ・合併症が展開します。カテゴリフィルタで絞り込めます。' },
    { emoji: '🎬', title: 'YouTube動画', desc: '各手技にYouTube検索リンク付き。動画で手技のイメージを掴んでから実践しましょう。' },
  ],
  presenter: [
    { emoji: '🎤', title: 'プレゼン資料生成', desc: '発表タイプ・対象者・時間・形式を選ぶだけでテンプレートが生成されます。' },
    { emoji: '📋', title: 'コピーして使う', desc: '生成されたテンプレートは「全文コピー」ボタンでクリップボードにコピー。PowerPointなどに貼り付けて使えます。' },
  ],
  medicalEnglish: [
    { emoji: '🃏', title: 'フラッシュカード', desc: 'カードをタップすると日本語/英語が切り替わります。「覚えた」で進捗に反映。' },
    { emoji: '📝', title: '4択クイズ', desc: '英語を見て日本語の意味を4つの選択肢から回答。正答率がリアルタイムで表示されます。' },
    { emoji: '📂', title: 'カテゴリ別学習', desc: '問診・身体診察・検査・手技・プレゼン・略語の6カテゴリから選んで集中学習できます。' },
  ],
}

export function ToolsTutorial() {
  return <InteractiveTutorial storageKey="iwor_tools_tutorial" steps={TUTORIALS.tools} />
}
export function ERTutorial() {
  return <InteractiveTutorial storageKey="iwor_er_tutorial" steps={TUTORIALS.er} />
}
export function InpatientTutorial() {
  return <InteractiveTutorial storageKey="iwor_inpatient_tutorial" steps={TUTORIALS.inpatient} />
}
export function InterpretTutorial() {
  return <InteractiveTutorial storageKey="iwor_interpret_tutorial" steps={TUTORIALS.interpret} />
}
export function ProceduresTutorial() {
  return <InteractiveTutorial storageKey="iwor_procedures_tutorial" steps={TUTORIALS.procedures} />
}
export function PresenterTutorial() {
  return <InteractiveTutorial storageKey="iwor_presenter_tutorial" steps={TUTORIALS.presenter} />
}
export function MedicalEnglishTutorial() {
  return <InteractiveTutorial storageKey="iwor_medenglish_tutorial" steps={TUTORIALS.medicalEnglish} />
}
