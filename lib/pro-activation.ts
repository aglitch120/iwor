/**
 * PRO アクティベーション（注文番号方式）
 *
 * Phase 1: Worker API で注文番号を検証 → localStorage に保存
 * Phase 2: Supabase Auth に移行（useProStatus.ts のみ差し替え）
 */

// Worker API URL（デプロイ後に設定）
// 開発時は localhost:8787、本番は iwor-api.xxx.workers.dev or api.iwor.jp
const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface ActivationResult {
  success: boolean
  plan?: string
  durationDays?: number
  activatedAt?: string
  expiresAt?: string
  error?: string
}

/**
 * 注文番号でPROをアクティベーション
 */
export async function activateWithOrderNumber(orderNumber: string): Promise<ActivationResult> {
  const cleaned = orderNumber.trim().replace(/\D/g, '')

  if (!cleaned || cleaned.length < 5 || cleaned.length > 12) {
    return { success: false, error: '注文番号を正しく入力してください（数字5〜12桁）' }
  }

  // API未設定時のフォールバック（開発用）
  if (!API_URL) {
    return { success: false, error: 'サーバーに接続できません。しばらく経ってからお試しください。' }
  }

  try {
    const res = await fetch(`${API_URL}/api/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber: cleaned }),
    })

    const data = await res.json()

    if (!res.ok || !data.ok) {
      return { success: false, error: data.error || '不明なエラーが発生しました。' }
    }

    // localStorage に保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('iwor_pro_user', 'true')
      localStorage.setItem('iwor_pro_plan', data.plan || 'pro_1y')
      localStorage.setItem('iwor_pro_activated_at', data.activatedAt || new Date().toISOString())
      localStorage.setItem('iwor_pro_expires_at', data.expiresAt || '')
      localStorage.setItem('iwor_pro_order', cleaned)
    }

    return {
      success: true,
      plan: data.plan,
      durationDays: data.durationDays,
      activatedAt: data.activatedAt,
      expiresAt: data.expiresAt,
    }
  } catch {
    return { success: false, error: 'サーバーに接続できませんでした。インターネット接続を確認してください。' }
  }
}

/** PRO状態の詳細情報を取得 */
export function getProDetails() {
  if (typeof window === 'undefined') return null
  const isPro = localStorage.getItem('iwor_pro_user') === 'true'
  if (!isPro) return null

  return {
    plan: localStorage.getItem('iwor_pro_plan') || 'unknown',
    activatedAt: localStorage.getItem('iwor_pro_activated_at') || '',
    expiresAt: localStorage.getItem('iwor_pro_expires_at') || '',
    orderNumber: localStorage.getItem('iwor_pro_order') || '',
  }
}

/** PRO状態をリセット（デバッグ・退会用） */
export function resetProStatus(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('iwor_pro_user')
  localStorage.removeItem('iwor_pro_plan')
  localStorage.removeItem('iwor_pro_activated_at')
  localStorage.removeItem('iwor_pro_expires_at')
  localStorage.removeItem('iwor_pro_order')
}
