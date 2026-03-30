'use client'
import { useState, useMemo } from 'react'
import CalculatorLayout from '@/components/tools/CalculatorLayout'
import ResultCard from '@/components/tools/ResultCard'
import { RadioGroup } from '@/components/tools/InputFields'
import { getToolBySlug, categoryLabels, categoryIcons } from '@/lib/tools-config'
const toolDef = getToolBySlug('hds-r')!

// 改訂長谷川式簡易知能評価スケール（HDS-R）加藤伸司ら 1991
const items = [
  { id: 'q1', label: '1. 年齢',
    instruction: '「お歳はいくつですか？」（2年までの誤差は正解）',
    options: [{ label: '不正解 (0)', value: '0' }, { label: '正解 (1)', value: '1' }] },
  { id: 'q2', label: '2. 日時の見当識',
    instruction: '「今日は何年何月何日ですか？何曜日ですか？」（年・月・日・曜日が正解でそれぞれ1点ずつ）',
    options: [{ label: '0点', value: '0' }, { label: '1点', value: '1' }, { label: '2点', value: '2' }, { label: '3点', value: '3' }, { label: '4点', value: '4' }] },
  { id: 'q3', label: '3. 場所の見当識',
    instruction: '「私たちがいまいるところはどこですか？」（自発的に正解=2点。5秒おいて「家ですか？病院ですか？施設ですか？」から正しく選択=1点）',
    options: [{ label: '0点', value: '0' }, { label: '1点（ヒントで正解）', value: '1' }, { label: '2点（自発的に正解）', value: '2' }] },
  { id: 'q4', label: '4. 3つの言葉の記銘',
    instruction: '「これから言う3つの言葉を言ってみてください。あとでまた聞きますのでよく覚えておいてください。」\n系列1: a)桜 b)猫 c)電車 ／ 系列2: a)梅 b)犬 c)自動車\n（いずれか1つの系列を使用。各1点）',
    options: [{ label: '0点', value: '0' }, { label: '1点', value: '1' }, { label: '2点', value: '2' }, { label: '3点', value: '3' }] },
  { id: 'q5', label: '5. 計算',
    instruction: '「100から7を順番に引いてください。」（100-7は？ それからまた7を引くと？）\n93…86 各1点。最初の答えが不正解の場合は打ち切り。',
    options: [{ label: '0点', value: '0' }, { label: '1点（93のみ正解）', value: '1' }, { label: '2点（93, 86とも正解）', value: '2' }] },
  { id: 'q6', label: '6. 数字の逆唱',
    instruction: '「私がこれから言う数字を逆から言ってください。」\n3桁: 6-8-2 → 正解は 2-8-6\n4桁: 3-5-2-9 → 正解は 9-2-5-3\n（3桁が不正解の場合は打ち切り）',
    options: [{ label: '0点', value: '0' }, { label: '1点（3桁のみ正解）', value: '1' }, { label: '2点（3桁・4桁とも正解）', value: '2' }] },
  { id: 'q7', label: '7. 3つの言葉の遅延再生',
    instruction: '「先ほど覚えてもらった言葉をもう一度言ってみてください。」\n（自発的に回答=各2点。回答なし→ヒント「a)植物 b)動物 c)乗り物」で正解=各1点）',
    options: [{ label: '0点', value: '0' }, { label: '1点', value: '1' }, { label: '2点', value: '2' }, { label: '3点', value: '3' }, { label: '4点', value: '4' }, { label: '5点', value: '5' }, { label: '6点', value: '6' }] },
  { id: 'q8', label: '8. 5つの物品記銘',
    instruction: '「これから5つの品物を見せます。それを隠しますのでなにがあったか言ってください。」\n（時計・鍵・タバコ・ペン・硬貨など必ず相互に無関係なもの。各1点）',
    options: [{ label: '0点', value: '0' }, { label: '1点', value: '1' }, { label: '2点', value: '2' }, { label: '3点', value: '3' }, { label: '4点', value: '4' }, { label: '5点', value: '5' }] },
  { id: 'q9', label: '9. 言語流暢性',
    instruction: '「知っている野菜の名前をできるだけ多く言ってください。」\n（途中で詰まり約10秒間待っても出ない場合に打ち切り）\n0〜5個=0点, 6個=1点, 7個=2点, 8個=3点, 9個=4点, 10個以上=5点',
    options: [{ label: '0点（0-5個）', value: '0' }, { label: '1点（6個）', value: '1' }, { label: '2点（7個）', value: '2' }, { label: '3点（8個）', value: '3' }, { label: '4点（9個）', value: '4' }, { label: '5点（10個以上）', value: '5' }] },
]

export default function HDSRPage() {
  const [vals, setVals] = useState<Record<string, string>>(Object.fromEntries(items.map(i => [i.id, '0'])))
  const result = useMemo(() => {
    const score = Object.values(vals).reduce((s, v) => s + Number(v), 0)
    if (score >= 21) return { score, severity: 'ok' as const, label: '正常域（21-30点）' }
    return { score, severity: 'wn' as const, label: '認知症の疑い（≦20点）— 詳細評価は担当医が判断' }
  }, [vals])

  return (
    <CalculatorLayout slug={toolDef.slug} title="改訂長谷川式簡易知能評価スケール（HDS-R）" titleEn="Hasegawa Dementia Scale-Revised"
      description="認知症のスクリーニング検査。30点満点中20点以下で認知症の疑い。施行時間は約10分。"
      category={categoryLabels[toolDef.category]} categoryIcon={categoryIcons[toolDef.category]}
      result={<ResultCard label="HDS-R" value={result.score} unit="/30点" interpretation={result.label} severity={result.severity} />}
      explanation={<div className="text-sm text-muted"><p>カットオフ 20/21点。教育歴の影響を受ける。MMSEと併用が推奨される。</p></div>}
      relatedTools={[{ slug: 'mmse', name: 'MMSE' }]}
      references={[{ text: '加藤伸司ほか. 改訂長谷川式簡易知能評価スケール(HDS-R)の作成. 老年精神医学雑誌 1991;2:1339-1347' }]}
    >
      <div className="space-y-5">
        {items.map(item => (
          <div key={item.id}>
            <p className="text-sm font-bold text-tx mb-1">{item.label}</p>
            <div className="bg-s0 border border-br rounded-lg p-2 mb-2">
              <p className="text-xs text-muted whitespace-pre-line">{item.instruction}</p>
            </div>
            <RadioGroup id={item.id} label="" options={item.options} value={vals[item.id]} onChange={v => setVals(p => ({ ...p, [item.id]: v }))} />
          </div>
        ))}
      </div>
    </CalculatorLayout>
  )
}
