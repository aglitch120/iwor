'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { activateWithOrderNumber, getProDetails } from '@/lib/pro-activation'
import { useProStatus } from '@/components/pro/useProStatus'

const planLabels: Record<string, string> = {
  pro_1y: '1年パス',
  pro_2y: '2年パス',
  pro_3y: '3年パス',
}

export default function ActivatePage() {
  const { isPro, refresh } = useProStatus()
  const [orderNumber, setOrderNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; plan?: string } | null>(null)

  // PRO済みユーザーの詳細情報
  const [proDetails, setProDetails] = useState<ReturnType<typeof getProDetails>>(null)
  useEffect(() => {
    if (isPro) setProDetails(getProDetails())
  }, [isPro])

  // 入力ハンドラ（数字のみ）
  const handleInput = (value: string) => {
    setOrderNumber(value.replace(/\D/g, '').slice(0, 12))
    if (result) setResult(null)
  }

  // アクティベーション実行
  const handleActivate = async () => {
    setIsSubmitting(true)
    setResult(null)

    const res = await activateWithOrderNumber(orderNumber)
    if (res.success) {
      refresh()
      setResult({
        success: true,
        message: `🎉 ${planLabels[res.plan!] || res.plan}のアクティベーションが完了しました！`,
        plan: res.plan,
      })
    } else {
      setResult({ success: false, message: res.error || '不明なエラーが発生しました。' })
    }

    setIsSubmitting(false)
  }

  const isValid = /^\d{5,12}$/.test(orderNumber)

  // ── 既にPRO会員 ──
  if (isPro && proDetails) {
    const expiresDate = proDetails.expiresAt ? new Date(proDetails.expiresAt) : null
    const daysLeft = expiresDate
      ? Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null

    return (
      <div className="max-w-lg mx-auto -mt-2">
        <nav className="text-sm text-muted mb-8">
          <Link href="/" className="hover:text-ac">ホーム</Link>
          <span className="mx-2">›</span>
          <Link href="/pro" className="hover:text-ac">iwor PRO</Link>
          <span className="mx-2">›</span>
          <span>アクティベーション</span>
        </nav>

        <div className="bg-s0 border border-br rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-okl border border-okb rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-xl font-bold text-tx mb-2">PRO会員です</h1>
          <p className="text-sm text-muted mb-6">現在、iwor PROのすべての機能をご利用いただけます。</p>

          <div className="bg-s1 rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted">プラン</span>
              <span className="font-medium text-tx">{planLabels[proDetails.plan] || proDetails.plan}</span>
            </div>
            {proDetails.activatedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-muted">開始日</span>
                <span className="font-medium text-tx">{new Date(proDetails.activatedAt).toLocaleDateString('ja-JP')}</span>
              </div>
            )}
            {expiresDate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted">有効期限</span>
                <span className="font-medium text-tx">
                  {expiresDate.toLocaleDateString('ja-JP')}
                  {daysLeft !== null && <span className="text-muted ml-1">（残り{daysLeft}日）</span>}
                </span>
              </div>
            )}
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-2 bg-ac text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-ac2 transition-colors"
          >
            ツールを使う →
          </Link>
        </div>
      </div>
    )
  }

  // ── アクティベーション成功 ──
  if (result?.success) {
    return (
      <div className="max-w-lg mx-auto -mt-2">
        <nav className="text-sm text-muted mb-8">
          <Link href="/" className="hover:text-ac">ホーム</Link>
          <span className="mx-2">›</span>
          <Link href="/pro" className="hover:text-ac">iwor PRO</Link>
          <span className="mx-2">›</span>
          <span>アクティベーション</span>
        </nav>

        <div className="bg-s0 border border-br rounded-2xl p-8 text-center">
          <div
            className="w-20 h-20 bg-okl border-2 border-okb rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ animation: 'successPop .4s cubic-bezier(.34,1.56,.64,1)' }}
          >
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="text-xl font-bold text-tx mb-2">アクティベーション完了！</h1>
          <p className="text-sm text-muted mb-6">{result.message}</p>

          <div className="space-y-3">
            <Link
              href="/tools"
              className="block w-full py-3 bg-ac text-white rounded-xl font-bold text-sm hover:bg-ac2 transition-colors"
            >
              臨床ツールを使ってみる
            </Link>
            <Link
              href="/pro"
              className="block w-full py-3 bg-s1 text-tx border border-br rounded-xl font-medium text-sm hover:border-ac/30 transition-colors"
            >
              PRO機能一覧を見る
            </Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes successPop {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  // ── 注文番号入力フォーム ──
  return (
    <div className="max-w-lg mx-auto -mt-2">
      <nav className="text-sm text-muted mb-8">
        <Link href="/" className="hover:text-ac">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href="/pro" className="hover:text-ac">iwor PRO</Link>
        <span className="mx-2">›</span>
        <span>アクティベーション</span>
      </nav>

      <div className="bg-s0 border border-br rounded-2xl p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-ac/10 border border-ac/20 text-ac text-xs font-bold rounded-full mb-4">
            ✦ iwor PRO
          </div>
          <h1 className="text-xl font-bold text-tx mb-2">アクティベーション</h1>
          <p className="text-sm text-muted leading-relaxed">
            BOOTHの注文番号を入力してPROを有効化してください。
          </p>
        </div>

        {/* 注文番号入力 */}
        <div className="mb-6">
          <label htmlFor="orderNumber" className="block text-sm font-medium text-tx mb-2">
            注文番号
          </label>
          <input
            id="orderNumber"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="例: 77836313"
            value={orderNumber}
            onChange={e => handleInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && isValid && !isSubmitting) handleActivate() }}
            className="w-full h-14 px-4 text-lg font-mono tracking-widest bg-bg border-2 border-br rounded-xl focus:border-ac focus:ring-1 focus:ring-ac/30 outline-none transition-all text-center placeholder:text-muted/40 placeholder:tracking-normal placeholder:font-sans placeholder:text-base"
          />
          <p className="text-xs text-muted mt-2">
            BOOTHの注文確認メールに記載されている数字です。
          </p>
        </div>

        {/* エラーメッセージ */}
        {result && !result.success && (
          <div className="bg-dnl border border-dnb rounded-xl p-3 mb-4">
            <p className="text-sm text-dn text-center">{result.message}</p>
          </div>
        )}

        {/* ボタン */}
        <button
          onClick={handleActivate}
          disabled={!isValid || isSubmitting}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
            isValid && !isSubmitting
              ? 'bg-ac text-white hover:bg-ac2 shadow-lg shadow-ac/20'
              : 'bg-s1 text-muted border border-br cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              確認中...
            </span>
          ) : (
            'アクティベーション'
          )}
        </button>

        {/* ヘルプ */}
        <div className="mt-6 pt-6 border-t border-br">
          <h2 className="text-sm font-bold text-tx mb-3">注文番号の確認方法</h2>
          <div className="space-y-2 text-xs text-muted leading-relaxed">
            <p>
              <span className="font-medium text-tx">1.</span>{' '}
              BOOTHで購入後、<span className="font-medium text-tx">noreply@booth.pm</span> から届くメールを開きます。
            </p>
            <p>
              <span className="font-medium text-tx">2.</span>{' '}
              メール件名「商品が購入されました（注文番号 <span className="font-mono text-tx">XXXXXXXX</span>）」の数字が注文番号です。
            </p>
            <p>
              <span className="font-medium text-tx">3.</span>{' '}
              それでも解決しない場合は{' '}
              <Link href="/contact" className="text-ac hover:underline">お問い合わせ</Link>
              {' '}ください。
            </p>
          </div>
        </div>
      </div>

      {/* まだ購入していない人 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted mb-3">まだ購入されていない方</p>
        <Link
          href="/pro"
          className="inline-flex items-center gap-2 text-sm text-ac font-medium hover:underline"
        >
          iwor PROについて詳しく見る →
        </Link>
      </div>
    </div>
  )
}
