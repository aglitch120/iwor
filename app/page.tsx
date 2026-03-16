import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import ArticleCard from '@/components/blog/ArticleCard'

export const metadata: Metadata = {
  title: 'iwor — 医師の臨床とキャリアを支える恵みの地',
  description: '臨床計算ツール79種、ER対応、ACLS/BLS、ICU管理、検査読影、薬剤比較155種。病棟TODO、J-OSLER管理、マッチング対策、論文フィード。医師・研修医・医学生のすべてがここに。',
  alternates: {
    canonical: 'https://iwor.jp',
  },
}

// ── 7つのサービス定義 ──
const services = {
  clinical: [
    {
      slug: 'tools',
      href: '/tools',
      icon: 'stethoscope',
      color: 'bg-acl',
      strokeColor: 'stroke-ac',
      name: '臨床ツール',
      desc: '計算ツール、ER対応、ACLS/BLS、ICU管理、検査読影、薬剤比較。計算と操作は完全無料。',
      badge: 'free' as const,
      tags: ['計算 79種', 'ER 6本', 'ACLS 4本', 'ICU 4本', '読影 5本', '薬剤比較 25'],
      featured: true,
    },
    {
      slug: 'dashboard',
      href: '/dashboard',
      icon: 'check',
      color: 'bg-[#E6F1FB]',
      strokeColor: 'stroke-[#185FA5]',
      name: '病棟TODO & 症例ログ',
      desc: '患者ごとのタスク管理。チェックで完了→症例として記録。退院で自動アーカイブ。',
      badge: 'pro' as const,
      tags: ['Stat tracker', 'EPOC連携'],
    },
    {
      slug: 'learning',
      href: '/learning',
      icon: 'book',
      color: 'bg-[#EEEDFE]',
      strokeColor: 'stroke-[#534AB7]',
      name: '学習',
      desc: '内科専門医試験対策から始まり、エコー・輸液など講座を順次追加。',
      badge: 'pro' as const,
      tags: ['問題演習', '講座（順次追加）'],
    },
  ],
  career: [
    {
      slug: 'josler',
      href: '/josler',
      icon: 'chart',
      color: 'bg-[#FAEEDA]',
      strokeColor: 'stroke-[#854F0B]',
      name: 'J-OSLER管理',
      desc: '症例登録・進捗トラッカー・病歴要約AI生成',
    },
    {
      slug: 'matching',
      href: '/matching',
      icon: 'graduation',
      color: 'bg-[#FBEAF0]',
      strokeColor: 'stroke-[#993556]',
      name: 'マッチング対策',
      desc: '履歴書生成・病院DB・AI面接練習',
    },
    {
      slug: 'journal',
      href: '/journal',
      icon: 'journal',
      color: 'bg-[#E1F5EE]',
      strokeColor: 'stroke-[#0F6E56]',
      name: '論文フィード',
      desc: '最新論文の日本語要約・ブックマーク',
    },
  ],
}

// ── アイコン SVG ──
function ServiceIcon({ type, className }: { type: string; className?: string }) {
  const cls = `w-[18px] h-[18px] ${className || ''}`
  switch (type) {
    case 'stethoscope':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
    case 'check':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l2.5 2.5L16 9"/></svg>
    case 'book':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
    case 'chart':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
    case 'graduation':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>
    case 'journal':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/></svg>
    case 'pen':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
    default:
      return null
  }
}

function Badge({ type }: { type: 'free' | 'pro' }) {
  if (type === 'free') {
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-okl text-ok">Free</span>
  }
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-wnl text-wn">PRO</span>
}

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 4)

  return (
    <div className="max-w-3xl mx-auto">
      {/* ═══ ヒーロー ═══ */}
      <section className="text-center py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-tx leading-tight mb-3">
          医師の臨床とキャリアを支える、<br className="hidden sm:inline" />恵みの地
        </h1>
        <p className="text-sm md:text-base text-muted max-w-lg mx-auto leading-relaxed">
          臨床ツール、病棟管理、学習、キャリア支援 — すべてひとつの場所で
        </p>
      </section>

      {/* ═══ Clinical ═══ */}
      <section className="mb-10">
        <p className="text-[11px] font-bold text-muted/60 tracking-wide mb-3 pl-0.5">CLINICAL</p>

        {/* 臨床ツール — フルワイド featured カード */}
        <Link
          href={services.clinical[0].href}
          className="block bg-s0 border border-br rounded-xl p-5 mb-3 hover:border-ac/30 transition-colors"
        >
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 ${services.clinical[0].color} rounded-[9px] flex items-center justify-center`}>
                  <ServiceIcon type={services.clinical[0].icon} className={services.clinical[0].strokeColor} />
                </div>
                <Badge type="free" />
              </div>
              <h2 className="text-[15px] font-bold text-tx mb-1">{services.clinical[0].name}</h2>
              <p className="text-xs text-muted leading-relaxed">{services.clinical[0].desc}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3 md:mt-0 md:items-center md:justify-end">
              {services.clinical[0].tags?.map(tag => (
                <span key={tag} className="text-[11px] px-2.5 py-1 rounded-md bg-s1 border border-br text-tx">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>

        {/* 病棟TODO + 学習 — 2カラム */}
        <div className="grid grid-cols-2 gap-3">
          {services.clinical.slice(1).map(s => (
            <Link
              key={s.slug}
              href={s.href}
              className="block bg-s0 border border-br rounded-xl p-4 hover:border-ac/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center`}>
                  <ServiceIcon type={s.icon} className={s.strokeColor} />
                </div>
                {s.badge && <Badge type={s.badge} />}
              </div>
              <h2 className="text-sm font-bold text-tx mb-1">{s.name}</h2>
              <p className="text-[11px] text-muted leading-relaxed">{s.desc}</p>
              {s.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {s.tags.map(tag => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-s1 text-muted">{tag}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ Career ═══ */}
      <section className="mb-10">
        <p className="text-[11px] font-bold text-muted/60 tracking-wide mb-3 pl-0.5">CAREER</p>

        {/* デスクトップ: 3カラム / モバイル: リスト */}
        <div className="hidden md:grid md:grid-cols-3 gap-3">
          {services.career.map(s => (
            <Link
              key={s.slug}
              href={s.href}
              className="block bg-s0 border border-br rounded-xl p-4 hover:border-ac/30 transition-colors"
            >
              <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center mb-2.5`}>
                <ServiceIcon type={s.icon} className={s.strokeColor} />
              </div>
              <h2 className="text-[13px] font-bold text-tx mb-1">{s.name}</h2>
              <p className="text-[11px] text-muted leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>

        {/* モバイル: 横並びリスト */}
        <div className="md:hidden space-y-2">
          {services.career.map(s => (
            <Link
              key={s.slug}
              href={s.href}
              className="flex items-center gap-3 bg-s0 border border-br rounded-xl px-4 py-3 hover:border-ac/30 transition-colors"
            >
              <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <ServiceIcon type={s.icon} className={s.strokeColor} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-tx">{s.name}</h2>
                <p className="text-[11px] text-muted leading-relaxed">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ Content — ブログ ═══ */}
      <section className="mb-10">
        <p className="text-[11px] font-bold text-muted/60 tracking-wide mb-3 pl-0.5">CONTENT</p>

        <Link
          href="/blog"
          className="flex items-center gap-4 bg-s0 border border-br rounded-xl px-5 py-4 hover:border-ac/30 transition-colors mb-6"
        >
          <div className="w-8 h-8 bg-s1 rounded-lg flex items-center justify-center flex-shrink-0">
            <ServiceIcon type="pen" className="stroke-muted" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-tx">ブログ</h2>
            <p className="text-[11px] text-muted">173記事 — J-OSLER対策、キャリア、試験勉強法、医師の生活</p>
          </div>
        </Link>

        {/* 最新記事 */}
        {latestPosts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted">最新記事</p>
              <Link href="/blog" className="text-xs text-ac hover:underline">すべて見る →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {latestPosts.map(post => (
                <ArticleCard key={post.slug} post={post} compact />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ═══ PRO CTA ═══ */}
      <section className="mb-8">
        <div className="bg-ac rounded-2xl p-6 md:p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <svg className="absolute top-0 right-0 w-48 h-48 text-white/[0.03]" viewBox="0 0 200 200">
              {[30, 55, 80, 105].map(r => (
                <circle key={r} cx="170" cy="30" r={r} fill="none" stroke="currentColor" strokeWidth="0.8" />
              ))}
            </svg>
          </div>
          <div className="relative z-10">
            <p className="text-white/60 text-xs mb-1">iwor PRO</p>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              すべての機能を、ひとつのプランで。
            </h2>
            <p className="text-white/60 text-xs mb-5 max-w-md mx-auto">
              臨床ツールの解釈、病棟管理、学習、J-OSLER、マッチング、論文フィード。¥9,800/年〜
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pro"
                className="inline-flex items-center justify-center bg-white text-ac px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors"
              >
                プランを見る
              </Link>
              <Link
                href="/pro/activate"
                className="inline-flex items-center justify-center bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-medium text-sm hover:bg-white/20 transition-colors"
              >
                ログイン / 会員登録
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
