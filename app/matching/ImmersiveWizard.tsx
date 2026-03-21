'use client'
import { useState, useCallback, useEffect } from 'react'
import { CORE_QUESTIONS, generateResumePrompt, type WizardQuestion } from '@/lib/matching-questions'

const MC = '#1B4F3A'
const MCL = '#E8F0EC'
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://iwor-api.mightyaddnine.workers.dev'

interface Answer { choices: string[]; freeText: string }

interface Props {
  onComplete: (answers: Record<string, Answer>) => void
  savedAnswers?: Record<string, Answer>
}

export default function ImmersiveWizard({ onComplete, savedAnswers }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>(savedAnswers || {})
  const [freeText, setFreeText] = useState('')
  const [selectedChoices, setSelectedChoices] = useState<string[]>([])
  const [aiFollowUp, setAiFollowUp] = useState<{ question: string; choices: string[] } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resumePromptCopied, setResumePromptCopied] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  const q = CORE_QUESTIONS[currentIndex]
  const total = CORE_QUESTIONS.length
  const progress = Math.round(((currentIndex + (answers[q?.id] ? 1 : 0)) / total) * 100)

  // 質問が変わったら保存済み回答を復元
  useEffect(() => {
    if (!q) return
    const saved = answers[q.id]
    setSelectedChoices(saved?.choices || [])
    setFreeText(saved?.freeText || '')
    setAiFollowUp(null)
  }, [currentIndex, q])

  const toggleChoice = useCallback((choice: string) => {
    setSelectedChoices(prev => {
      if (prev.includes(choice)) return prev.filter(c => c !== choice)
      if (q.maxChoices > 0 && prev.length >= q.maxChoices) return [...prev.slice(1), choice]
      return [...prev, choice]
    })
  }, [q])

  const saveAndNext = useCallback(() => {
    if (!q) return
    const answer: Answer = { choices: selectedChoices, freeText }
    const newAnswers = { ...answers, [q.id]: answer }
    setAnswers(newAnswers)

    // localStorageに保存
    try {
      const existing = JSON.parse(localStorage.getItem('iwor_matching_profile') || '{}')
      existing._wizardAnswers = newAnswers
      localStorage.setItem('iwor_matching_profile', JSON.stringify(existing))
    } catch {}

    if (currentIndex < total - 1) {
      setDirection('forward')
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowResult(true)
      onComplete(newAnswers)
    }
  }, [q, selectedChoices, freeText, answers, currentIndex, total, onComplete])

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      // 現在の回答を保存
      if (q) {
        setAnswers(prev => ({ ...prev, [q.id]: { choices: selectedChoices, freeText } }))
      }
      setDirection('back')
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex, q, selectedChoices, freeText])

  // AI フォローアップ質問
  const askAI = useCallback(async () => {
    if (aiLoading) return
    setAiLoading(true)
    try {
      const recentAnswers = CORE_QUESTIONS
        .slice(Math.max(0, currentIndex - 2), currentIndex + 1)
        .filter(q2 => answers[q2.id])
        .map(q2 => ({ question: q2.question, answer: `${answers[q2.id].choices.join(', ')}. ${answers[q2.id].freeText}` }))

      if (selectedChoices.length > 0) {
        recentAnswers.push({ question: q.question, answer: `${selectedChoices.join(', ')}. ${freeText}` })
      }

      const res = await fetch(`${API_BASE}/api/self-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: recentAnswers }),
      })
      const data = await res.json()
      if (data.ok && data.followUp) {
        setAiFollowUp(data.followUp)
      }
    } catch {}
    setAiLoading(false)
  }, [aiLoading, currentIndex, answers, q, selectedChoices, freeText])

  // JIS履歴書プロンプト生成
  const copyResumePrompt = useCallback(() => {
    const prompt = generateResumePrompt(answers)
    navigator.clipboard.writeText(prompt).then(() => {
      setResumePromptCopied(true)
      setTimeout(() => setResumePromptCopied(false), 3000)
    })
  }, [answers])

  // ═══ 完了画面 ═══
  if (showResult) {
    const answeredCount = Object.keys(answers).length
    return (
      <div className="max-w-md mx-auto text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-tx mb-2">自己分析完了！</h2>
        <p className="text-sm text-muted mb-6">{answeredCount}/{total} 問に回答しました</p>

        {/* 回答サマリー */}
        <div className="bg-s0 border border-br rounded-xl p-4 mb-4 text-left">
          <h3 className="text-xs font-bold text-tx mb-3">あなたのプロフィール</h3>
          {CORE_QUESTIONS.slice(0, 8).map(q2 => {
            const a = answers[q2.id]
            if (!a) return null
            return (
              <div key={q2.id} className="mb-2">
                <p className="text-[10px] text-muted">{q2.icon} {q2.question}</p>
                <p className="text-xs text-tx font-medium">{a.choices.join(', ')}</p>
                {a.freeText && <p className="text-[10px] text-muted italic">{a.freeText}</p>}
              </div>
            )
          })}
        </div>

        {/* JIS履歴書 志望動機AI生成 */}
        <div className="bg-s0 border border-ac/30 rounded-xl p-4 mb-4">
          <h3 className="text-sm font-bold text-tx mb-2">✨ 履歴書の志望動機をAIで生成</h3>
          <p className="text-[10px] text-muted mb-3">回答データから志望動機文を生成するプロンプトをコピーし、ChatGPT/Claude/Geminiに貼り付けてください</p>
          <button onClick={copyResumePrompt}
            className="w-full py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: resumePromptCopied ? 'var(--ok)' : MC, color: '#fff' }}>
            {resumePromptCopied ? '✓ コピー済み — AIに貼り付けてください' : '📋 志望動機生成プロンプトをコピー'}
          </button>
          {resumePromptCopied && (
            <div className="flex gap-1.5 mt-2">
              <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer"
                className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center" style={{ background: '#10a37f', color: '#fff' }}>ChatGPT</a>
              <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer"
                className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center" style={{ background: '#d97706', color: '#fff' }}>Claude</a>
              <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer"
                className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center" style={{ background: '#4285f4', color: '#fff' }}>Gemini</a>
            </div>
          )}
        </div>

        <button onClick={() => { setShowResult(false); setCurrentIndex(0) }}
          className="text-xs text-muted underline">もう一度やり直す</button>
      </div>
    )
  }

  if (!q) return null

  // ═══ 質問画面（1問1画面・没入型） ═══
  return (
    <div className="max-w-md mx-auto">
      {/* 進捗バー */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--s2)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: MC }} />
        </div>
        <span className="text-[10px] font-mono text-muted">{currentIndex + 1}/{total}</span>
      </div>

      {/* 完了済み質問ピル */}
      {currentIndex > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {CORE_QUESTIONS.slice(0, currentIndex).map((q2, i) => {
            const answered = !!answers[q2.id]
            return (
              <button key={q2.id} onClick={() => { setDirection('back'); setCurrentIndex(i) }}
                className="px-2 py-0.5 rounded-full text-[9px] transition-all"
                style={{
                  background: answered ? MCL : 'var(--s1)',
                  color: answered ? MC : 'var(--m)',
                  opacity: 0.6,
                }}>
                {q2.icon} {answered ? '✓' : ''}
              </button>
            )
          })}
        </div>
      )}

      {/* 質問カード */}
      <div key={q.id} className={`transition-all duration-300 ${direction === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'}`}>
        {/* カテゴリ & 重要度 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{q.icon}</span>
          <div>
            {q.importance >= 4 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                {'★'.repeat(q.importance)} 面接頻出
              </span>
            )}
          </div>
        </div>

        {/* 質問文 */}
        <h2 className="text-lg font-bold text-tx mb-1 leading-tight">{q.question}</h2>
        {q.variants && q.variants.length > 0 && (
          <p className="text-[10px] text-muted mb-4">
            聞かれ方: {q.variants.slice(0, 2).join(' / ')}
          </p>
        )}

        {/* マルチチョイス */}
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {q.choices.map(choice => {
            const selected = selectedChoices.includes(choice)
            return (
              <button key={choice} onClick={() => toggleChoice(choice)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-left transition-all"
                style={{
                  background: selected ? MC : 'var(--s0)',
                  color: selected ? '#fff' : 'var(--tx)',
                  border: `1.5px solid ${selected ? MC : 'var(--br)'}`,
                }}>
                {selected ? '✓ ' : ''}{choice}
              </button>
            )
          })}
        </div>
        {q.maxChoices > 0 && (
          <p className="text-[9px] text-muted mb-3">最大{q.maxChoices}つ選択 / 選択中: {selectedChoices.length}</p>
        )}

        {/* 自由記述（任意） */}
        <div className="mb-4">
          <label className="text-[10px] font-bold text-muted block mb-1">{q.freeTextLabel}（任意）</label>
          <textarea
            value={freeText}
            onChange={e => setFreeText(e.target.value)}
            rows={2}
            placeholder={q.freeTextPlaceholder}
            className="w-full px-3 py-2 bg-s0 border border-br rounded-xl text-xs focus:border-ac outline-none resize-none"
          />
        </div>

        {/* AI深堀りフォローアップ */}
        {selectedChoices.length > 0 && (
          <button onClick={askAI} disabled={aiLoading}
            className="w-full py-2 rounded-xl text-[10px] font-medium mb-3 transition-all"
            style={{ background: MCL, color: MC, border: `1px solid ${MC}30` }}>
            {aiLoading ? '考え中...' : '🤖 AIが深堀り質問を提案'}
          </button>
        )}

        {aiFollowUp && (
          <div className="bg-acl border border-ac/20 rounded-xl p-3 mb-4">
            <p className="text-xs font-bold mb-2" style={{ color: MC }}>🤖 {aiFollowUp.question}</p>
            <div className="flex flex-wrap gap-1">
              {aiFollowUp.choices.map(c => (
                <button key={c} onClick={() => setFreeText(prev => prev ? `${prev}。${c}` : c)}
                  className="px-2 py-1 rounded-lg text-[10px] border transition-all hover:border-ac/40"
                  style={{ borderColor: 'var(--br)', color: 'var(--tx)' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ナビゲーション */}
      <div className="flex gap-3 mt-2">
        {currentIndex > 0 && (
          <button onClick={goBack}
            className="flex-1 py-3 rounded-xl text-xs font-medium border transition-all"
            style={{ borderColor: 'var(--br)', color: 'var(--m)' }}>
            ← 戻る
          </button>
        )}
        <button onClick={saveAndNext} disabled={selectedChoices.length === 0}
          className="flex-[2] py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-30"
          style={{ background: MC }}>
          {currentIndex === total - 1 ? '完了 🎉' : '次へ →'}
        </button>
      </div>

      {/* スキップ */}
      <button onClick={() => { setDirection('forward'); setCurrentIndex(Math.min(currentIndex + 1, total - 1)) }}
        className="w-full text-center text-[10px] text-muted mt-2 py-1">
        スキップ
      </button>

      {/* CSS アニメーション */}
      <style>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.3s ease-out; }
      `}</style>
    </div>
  )
}
