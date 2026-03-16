import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import ArticleCard from '@/components/blog/ArticleCard'
import { AppMockup } from '@/components/AppMockup'

export const metadata: Metadata = {
  title: 'iwor（イウォル）— 医学生から医師まで、ずっと臨床のそばに',
  description: '臨床計算ツール79種、ER対応、ACLS/BLS、ICU管理、検査読影、薬剤比較155種。病棟TODO、J-OSLER管理、マッチング対策、論文フィード。医学生から医師まで、すべてがここに。',
  alternates: { canonical: 'https://iwor.jp' },
}

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 4)

  return (
    <div className="max-w-5xl mx-auto">

      {/* ═══ Hero ═══ */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="flex flex-col md:flex-row md:items-center md:gap-12">
          <div className="flex-1 mb-10 md:mb-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-acl border border-ac/20 rounded-full text-xs font-medium text-ac mb-6">
              <span className="w-1.5 h-1.5 bg-ac rounded-full animate-pulse" />
              123個の臨床ツール + 173記事、すべて無料
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-tx leading-[1.15] tracking-tight mb-5">
              医学生から医師まで、
              <br />
              ずっと臨床のそばに。
            </h1>
            <p className="text-base text-muted leading-relaxed max-w-md mb-8">
              臨床ツール、病棟管理、学習、キャリア支援。
              必要なものが、すべてひとつの場所に。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 bg-ac text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-ac2 transition-colors shadow-lg shadow-ac/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                ツールを使ってみる
              </Link>
              <Link
                href="/pro"
                className="inline-flex items-center justify-center gap-2 bg-s0 text-tx border border-br px-7 py-3.5 rounded-xl font-medium text-sm hover:border-ac/40 hover:bg-acl transition-colors"
              >
                PRO会員について
              </Link>
            </div>
          </div>

          <div className="flex-1 relative max-w-[480px] md:max-w-none">
            <AppMockup className="w-full" />
          </div>
        </div>
      </section>

      {/* ═══ Numbers ═══ */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { num: '123', label: '臨床ツール', sub: 'すべて無料' },
            { num: '173', label: '記事', sub: 'ブログ' },
            { num: '155', label: '薬剤', sub: '比較データベース' },
            { num: '7', label: 'サービス', sub: 'ひとつのプラン' },
          ].map(item => (
            <div key={item.label} className="bg-s0 border border-br rounded-xl p-5">
              <p className="text-3xl font-bold text-ac tracking-tight">{item.num}</p>
              <p className="text-sm font-medium text-tx mt-1">{item.label}</p>
              <p className="text-xs text-muted">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Services ═══ */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-0.5 bg-ac rounded-full" />
          <h2 className="text-xl md:text-2xl font-bold text-tx">
            ひとつのプラットフォームで、すべてを。
          </h2>
        </div>

        {/* ── メインカード: 臨床ツール ── */}
        <Link
          href="/tools"
          className="group block mb-4 rounded-2xl border-2 border-ac/20 bg-gradient-to-br from-acl/60 via-s0 to-bg overflow-hidden hover:border-ac/40 transition-all"
        >
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ac rounded-xl flex items-center justify-center shadow-lg shadow-ac/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-tx group-hover:text-ac transition-colors">臨床ツール</h3>
                  <p className="text-xs text-muted">計算と操作は完全無料 — ER/ICUを含む緊急系もすべて公開</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { name: '臨床計算', count: '79' },
                { name: 'ER対応', count: '6' },
                { name: 'ACLS/BLS', count: '4' },
                { name: 'ICU管理', count: '4' },
                { name: '検査読影', count: '5' },
                { name: '薬剤比較', count: '25' },
              ].map(t => (
                <div key={t.name} className="bg-ac/10 text-ac border border-ac/20 rounded-lg px-3 py-2.5 text-center">
                  <p className="text-lg font-bold leading-none mb-0.5">{t.count}</p>
                  <p className="text-[10px] font-medium">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 md:px-8 py-3 bg-ac/5 border-t border-ac/10 flex items-center justify-between">
            <p className="text-xs text-muted">CHA₂DS₂-VASc, eGFR, SOFA, Wells PE, A-DROP, qSOFA, FIB-4 ...</p>
            <span className="text-xs text-ac font-medium group-hover:translate-x-1 transition-transform">使ってみる →</span>
          </div>
        </Link>

        {/* ── 6サービス: ミニマルカード ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {
              href: '/dashboard',
              title: '病棟TODO & 症例ログ',
              sub: 'タスク管理 & 症例ログ',
              tag: 'PRO',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 12l2.5 2.5L16 9" />
                </svg>
              ),
            },
            {
              href: '/learning',
              title: '学習',
              sub: '内科専門医試験対策',
              tag: 'PRO',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" strokeLinecap="round">
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                </svg>
              ),
            },
            {
              href: '/josler',
              title: 'J-OSLER管理',
              sub: '症例登録 & 進捗管理',
              tag: 'PRO',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" strokeLinecap="round">
                  <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
                </svg>
              ),
            },
            {
              href: '/matching',
              title: 'マッチング対策',
              sub: '履歴書 & AI面接',
              tag: 'PRO',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" strokeLinecap="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
                </svg>
              ),
            },
            {
              href: '/journal',
              title: '論文フィード',
              sub: '日本語要約 & ブックマーク',
              tag: 'FREEMIUM',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" strokeLinecap="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
                </svg>
              ),
            },
            {
              href: '/blog',
              title: 'ブログ',
              sub: 'J-OSLER & キャリア 173記事',
              tag: 'FREE',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" strokeLinecap="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
                </svg>
              ),
            },
          ].map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col items-center text-center rounded-xl border border-br bg-s0 p-6 hover:border-ac/40 hover:bg-acl transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-acl flex items-center justify-center mb-3 text-ac group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="text-sm font-bold text-tx mb-1 group-hover:text-ac transition-colors">{s.title}</h3>
              <p className="text-[11px] text-muted mb-2">{s.sub}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                s.tag === 'FREE'
                  ? 'text-ac bg-acl'
                  : s.tag === 'FREEMIUM'
                    ? 'text-muted bg-s1'
                    : 'text-wn bg-wnl'
              }`}>
                {s.tag}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ Blog ═══ */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-0.5 bg-muted rounded-full" />
            <h2 className="text-lg font-bold text-tx">最新の記事</h2>
            <span className="text-xs text-muted bg-s1 px-2.5 py-0.5 rounded-full">173記事</span>
          </div>
          <Link href="/blog" className="text-xs text-ac font-medium hover:underline">すべて見る →</Link>
        </div>

        {latestPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {latestPosts.map(post => (
              <ArticleCard key={post.slug} post={post} compact />
            ))}
          </div>
        )}
      </section>

      {/* ═══ PRO CTA ═══ */}
      <section className="mb-8">
        <div className="bg-ac rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <svg className="absolute top-0 right-0 w-64 h-64 text-white/[0.03]" viewBox="0 0 200 200">
              {[30, 55, 80, 105].map(r => (
                <circle key={r} cx="170" cy="30" r={r} fill="none" stroke="currentColor" strokeWidth="0.8" />
              ))}
            </svg>
          </div>
          <div className="relative z-10">
            <p className="text-white/50 text-xs mb-2 tracking-widest uppercase font-mono">iwor PRO</p>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              すべての機能を、ひとつのプランで。
            </h2>
            <p className="text-white/60 text-sm mb-6 max-w-lg mx-auto leading-relaxed">
              解釈・アクションプラン・病棟管理・学習・J-OSLER・マッチング・論文フィード。
              月額換算 約817円で、臨床とキャリアのすべてにアクセス。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pro"
                className="inline-flex items-center justify-center bg-white text-ac px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors shadow-lg"
              >
                プランを見る
              </Link>
              <Link
                href="/pro/activate"
                className="inline-flex items-center justify-center bg-white/10 text-white border border-white/20 px-7 py-3.5 rounded-xl font-medium text-sm hover:bg-white/20 transition-colors"
              >
                ログイン / 会員登録
              </Link>
            </div>
            <p className="text-white/30 text-xs mt-4">¥9,800/年〜 · クレジットカード・PayPay・コンビニ払い</p>
          </div>
        </div>
      </section>
    </div>
  )
}
