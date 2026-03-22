declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export const GA_ID = 'G-VTCJT6XFHG'

// GA4カスタムイベント送信
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

// ── コンバージョンイベント ──

// 購入クリック計測
export const trackBoothClick = (location: string) => {
  trackEvent('purchase_click', { location, event_category: 'conversion' })
}

// PRO登録完了
export const trackProRegister = (plan: string) => {
  trackEvent('pro_register', { plan, event_category: 'conversion', value: 1 })
}

// PRO ログイン
export const trackProLogin = () => {
  trackEvent('pro_login', { event_category: 'engagement' })
}

// CTAクリック計測
export const trackCtaClick = (label: string) => {
  trackEvent('cta_click', { label, event_category: 'engagement' })
}

// ── エンゲージメントイベント ──

// ツール閲覧
export const trackToolView = (slug: string, category?: string) => {
  trackEvent('tool_view', { slug, tool_category: category || 'calc', event_category: 'engagement' })
}

// お気に入り追加
export const trackFavoriteAdd = (slug: string) => {
  trackEvent('favorite_add', { slug, event_category: 'engagement' })
}

// タブ切替（PRO系アプリ）
export const trackAppTabChange = (app: string, tab: string) => {
  trackEvent('app_tab_change', { app, tab, event_category: 'engagement' })
}

// ProGate表示（PRO誘導）
export const trackProGateView = (feature: string) => {
  trackEvent('pro_gate_view', { feature, event_category: 'conversion' })
}

// ProModal表示
export const trackProModalView = (feature: string) => {
  trackEvent('pro_modal_view', { feature, event_category: 'conversion' })
}

// ── ファネルイベント（T-7） ──

// ツール使用（計算実行時）
export const trackToolUsage = (slug: string, category?: string) => {
  trackEvent('tool_usage', { slug, tool_category: category || 'calc', event_category: 'funnel' })
  // 累計使用回数をlocalStorageに記録
  if (typeof window !== 'undefined') {
    try {
      const key = 'iwor_tool_usage'
      const data = JSON.parse(localStorage.getItem(key) || '{"_total":0}')
      data[slug] = (data[slug] || 0) + 1
      data._total = (data._total || 0) + 1
      localStorage.setItem(key, JSON.stringify(data))
    } catch {}
  }
}

// Study セッション開始
export const trackStudyStart = (deckId?: string) => {
  trackEvent('study_session_start', { deck_id: deckId || 'default', event_category: 'funnel' })
}

// ストリーク達成
export const trackStreakMilestone = (days: number) => {
  trackEvent(`streak_${days}`, { streak_days: days, event_category: 'funnel' })
}

// PROページ閲覧
export const trackProPageView = () => {
  trackEvent('pro_page_view', { event_category: 'funnel' })
}

// 購入完了
export const trackPurchase = (plan: string, amount: number) => {
  trackEvent('purchase', { plan, value: amount, currency: 'JPY', event_category: 'funnel' })
}

// サインアップ
export const trackSignUp = (method: string) => {
  trackEvent('sign_up', { method, event_category: 'funnel' })
}

// リファラル
export const trackReferral = (action: 'generate' | 'redeem') => {
  trackEvent('referral', { action, event_category: 'funnel' })
}
