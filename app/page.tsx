import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import ArticleCard from '@/components/blog/ArticleCard'

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
      <section className="pt-16 pb-20 md:pt-24 md:pb-28">
        <p className="text-xs tracking-[0.2em] uppercase text-muted font-mono mb-6">
          iwor（イウォル）
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-tx leading-[1.15] tracking-tight mb-6 max-w-2xl">
          医学生から医師まで、
          <br />
          ずっと臨床のそばに。
        </h1>
        <p className="text-base md:text-lg text-muted leading-relaxed max-w-lg mb-10">
          臨床ツール、病棟管理、学習、キャリア支援。
          <br className="hidden md:inline" />
          必要なものが、すべてひとつの場所に。
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/tools"
            className="inline-flex items-center justify-center bg-tx text-white px-7 py-3.5 rounded-lg font-medium text-sm hover:bg-tx/85 transition-colors"
          >
            ツールを使ってみる
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/pro"
            className="inline-flex items-center justify-center text-tx border border-br2 px-7 py-3.5 rounded-lg font-medium text-sm hover:bg-s1 transition-colors"
          >
            PRO会員について
          </Link>
        </div>
      </section>

      {/* ═══ Numbers ═══ */}
      <section className="border-y border-br py-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { num: '123', label: '臨床ツール', sub: 'すべて無料' },
            { num: '173', label: '記事', sub: 'ブログ' },
            { num: '155', label: '薬剤', sub: '比較データベース' },
            { num: '7', label: 'サービス', sub: 'ひとつのプラン' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-3xl md:text-4xl font-bold text-tx tracking-tight">{item.num}</p>
              <p className="text-sm font-medium text-tx mt-0.5">{item.label}</p>
              <p className="text-xs text-muted">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Services ═══ */}
      <section className="mb-24">
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-muted font-mono mb-3">Services</p>
          <h2 className="text-2xl md:text-3xl font-bold text-tx tracking-tight">
            ひとつのプラットフォームで、すべてを。
          </h2>
        </div>

        {/* メインカード: 臨床ツール */}
        <Link
          href="/tools"
          className="group block mb-4 rounded-xl border border-br bg-s0 hover:border-br2 transition-all overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-tx group-hover:text-ac transition-colors mb-1">
                  臨床ツール
                </h3>
                <p className="text-sm text-muted">計算・ER対応・ACLS/BLS・ICU管理・検査読影・薬剤比較</p>
              </div>
              <span className="text-xs font-medium text-ac bg-acl px-2.5 py-1 rounded-md flex-shrink-0">
                FREE
              </span>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
              {[
                { name: '臨床計算', count: '79' },
                { name: 'ER対応', count: '6' },
                { name: 'ACLS/BLS', count: '4' },
                { name: 'ICU管理', count: '4' },
                { name: '検査読影', count: '5' },
                { name: '薬剤比較', count: '25' },
              ].map(t => (
                <div key={t.name} className="bg-s1 rounded-lg p-3 text-center group-hover:bg-bg transition-colors">
                  <p className="text-xl font-bold text-tx leading-none mb-0.5">{t.count}</p>
                  <p className="text-[10px] text-muted font-medium">{t.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 md:px-8 py-3 border-t border-br flex items-center justify-between">
            <p className="text-xs text-muted truncate mr-4">CHA₂DS₂-VASc, eGFR, SOFA, Wells PE, A-DROP, qSOFA, FIB-4 ...</p>
            <span className="text-xs text-muted group-hover:text-tx transition-colors whitespace-nowrap flex items-center gap-1">
              すべて見る
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>

        {/* 6サービスグリッド */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* 病棟TODO */}
          <Link href="/dashboard" className="group block rounded-xl border border-br bg-s0 overflow-hidden hover:border-br2 transition-all">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-tx group-hover:text-ac transition-colors">病棟TODO & 症例ログ</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md text-tx bg-s1">PRO</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {[
                  { done: true, text: '田中さん — 採血結果確認' },
                  { done: true, text: '佐藤さん — 退院サマリ' },
                  { done: false, text: '山田さん — 循環器コンサルト' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 text-xs ${item.done ? 'opacity-40' : ''}`}>
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-tx border-tx' : 'border-br2'}`}>
                      {item.done && <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" strokeWidth={3}><path d="M2 5l3 3 5-5" /></svg>}
                    </div>
                    <span className={item.done ? 'line-through text-muted' : 'text-tx'}>{item.text}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted leading-relaxed">タスク管理 → 完了で症例ログ → 退院でアーカイブ。</p>
            </div>
          </Link>

          {/* 学習 */}
          <Link href="/learning" className="group block rounded-xl border border-br bg-s0 overflow-hidden hover:border-br2 transition-all">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-tx group-hover:text-ac transition-colors">学習</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md text-tx bg-s1">PRO</span>
              </div>
              <div className="mb-3">
                <p className="text-[10px] text-muted mb-1.5">内科専門医試験 · 問題演習</p>
                <p className="text-xs text-tx mb-2 leading-relaxed">IgA腎症の腎生検所見として正しいのは？</p>
                <div className="space-y-1">
                  {['メサンギウム増殖', '半月体形成', '糸球体基底膜の二重化'].map((opt, i) => (
                    <div key={i} className={`text-[10px] px-2 py-1 rounded border ${i === 0 ? 'bg-acl border-ac/20 text-ac font-medium' : 'bg-s1 border-transparent text-muted'}`}>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">内科専門医試験から開始。講座を順次追加。</p>
            </div>
          </Link>

          {/* J-OSLER */}
          <Link href="/josler" className="group block rounded-xl border border-br bg-s0 overflow-hidden hover:border-br2 transition-all">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-tx group-hover:text-ac transition-colors">J-OSLER管理</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md text-tx bg-s1">PRO</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-11 h-11">
                  <svg viewBox="0 0 36 36" className="w-11 h-11 -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#F0EDE7" strokeWidth="2.5" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#1A1917" strokeWidth="2.5" strokeDasharray="66 88" strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-tx">75%</span>
                </div>
                <div className="text-[10px] text-muted space-y-0.5">
                  <p>症例 <span className="font-medium text-tx">120/160</span></p>
                  <p>疾患群 <span className="font-medium text-tx">42/56</span></p>
                  <p>病歴要約 <span className="font-medium text-tx">22/29</span></p>
                </div>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">症例登録・進捗トラッカー・病歴要約AI生成。</p>
            </div>
          </Link>

          {/* マッチング */}
          <Link href="/matching" className="group block rounded-xl border border-br bg-s0 overflow-hidden hover:border-br2 transition-all">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-tx group-hover:text-ac transition-colors">マッチング対策</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md text-tx bg-s1">PRO</span>
              </div>
              <div className="bg-s1 rounded-lg p-2.5 mb-3 space-y-1">
                <div className="h-1.5 w-16 bg-tx/15 rounded" />
                <div className="h-1 w-full bg-tx/8 rounded" />
                <div className="h-1 w-4/5 bg-tx/8 rounded" />
                <div className="h-1 w-full bg-tx/8 rounded" />
                <div className="mt-1.5 flex gap-1">
                  <span className="text-[8px] px-1.5 py-0.5 bg-s0 text-muted rounded border border-br">AI面接</span>
                  <span className="text-[8px] px-1.5 py-0.5 bg-s0 text-muted rounded border border-br">病院DB</span>
                </div>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">履歴書生成・病院データベース・AI面接練習。</p>
            </div>
          </Link>

          {/* 論文フィード */}
          <Link href="/journal" className="group block rounded-xl border border-br bg-s0 overflow-hidden hover:border-br2 transition-all">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-tx group-hover:text-ac transition-colors">論文フィード</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md text-muted bg-s1">FREEMIUM</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {[
                  'SGLT2阻害薬の心不全における...',
                  'GLP-1RAの腎保護効果に関する...',
                ].map((t, i) => (
                  <div key={i} className="bg-s1 rounded-lg px-2.5 py-2">
                    <p className="text-[10px] font-medium text-tx truncate">{t}</p>
                    <p className="text-[9px] text-muted mt-0.5">NEJM · 2026 · 日本語要約</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted leading-relaxed">最新論文の日本語要約・ブックマーク。</p>
            </div>
          </Link>

          {/* ブログ */}
          <Link href="/blog" className="group block rounded-xl border border-br bg-s0 overflow-hidden hover:border-br2 transition-all">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-tx group-hover:text-ac transition-colors">ブログ</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md text-ac bg-acl">FREE</span>
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="bg-s1 rounded-lg px-2.5 py-2">
                  <p className="text-[10px] font-medium text-tx">J-OSLER完全攻略ガイド</p>
                  <p className="text-[9px] text-muted mt-0.5">J-OSLER基礎 · 15分</p>
                </div>
                <div className="bg-s1 rounded-lg px-2.5 py-2">
                  <p className="text-[10px] font-medium text-tx">内科専門医試験の勉強法</p>
                  <p className="text-[9px] text-muted mt-0.5">試験対策 · 12分</p>
                </div>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">J-OSLER、キャリア、試験対策。173記事。</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══ Blog ═══ */}
      <section className="mb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-muted font-mono mb-3">Content</p>
            <h2 className="text-2xl md:text-3xl font-bold text-tx tracking-tight">最新の記事</h2>
          </div>
          <Link
            href="/blog"
            className="text-sm text-muted hover:text-tx transition-colors flex items-center gap-1"
          >
            すべて見る
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
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
      <section className="mb-12">
        <div className="rounded-xl border border-br bg-s0 p-8 md:p-12">
          <div className="max-w-lg">
            <p className="text-xs tracking-[0.2em] uppercase text-muted font-mono mb-4">iwor PRO</p>
            <h2 className="text-2xl md:text-3xl font-bold text-tx tracking-tight mb-4">
              すべての機能を、<br />ひとつのプランで。
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-8">
              解釈・アクションプラン・病棟管理・学習・J-OSLER・マッチング・論文フィード。
              月額換算 約817円で、臨床とキャリアのすべてにアクセス。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/pro"
                className="inline-flex items-center justify-center bg-tx text-white px-7 py-3.5 rounded-lg font-medium text-sm hover:bg-tx/85 transition-colors"
              >
                プランを見る
              </Link>
              <Link
                href="/pro/activate"
                className="inline-flex items-center justify-center text-tx border border-br2 px-7 py-3.5 rounded-lg font-medium text-sm hover:bg-s1 transition-colors"
              >
                ログイン / 会員登録
              </Link>
            </div>
            <p className="text-xs text-muted mt-4">¥9,800/年〜 · クレジットカード・PayPay・コンビニ払い</p>
          </div>
        </div>
      </section>
    </div>
  )
}
