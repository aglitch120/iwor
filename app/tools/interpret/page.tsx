import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '検査読影ツール',
  description: '血液ガス分析のインタラクティブ解釈フロー。pH→AG→代償→A-aDO₂をステップバイステップで自動評価。',
}

const tools = [
  { href: '/tools/interpret/blood-gas', name: '血液ガス分析 インタラクティブ解釈', desc: 'pH・PCO₂・HCO₃⁻を入力 → 酸塩基障害を5ステップで自動解釈。AG・代償・A-aDO₂・P/F比まで一括評価。', badge: 'NEW', live: true },
  { href: '#', name: '心電図読影フロー', desc: '調律→心拍数→軸→ST変化→QT のステップ解析', badge: '準備中', live: false },
  { href: '#', name: '胸部X線 系統的読影', desc: 'ABCDE法によるチェックリスト', badge: '準備中', live: false },
  { href: '#', name: '腹部エコー系統的評価', desc: '肝・胆・膵・腎・脾・大動脈', badge: '準備中', live: false },
  { href: '#', name: '体液検査（胸水・腹水・髄液）', desc: 'Light基準・SAAG・髄液細胞数鑑別', badge: '準備中', live: false },
]

export default function InterpretPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-ac">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href="/tools" className="hover:text-ac">臨床ツール</Link>
        <span className="mx-2">›</span>
        <span>検査読影</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-tx mb-2">検査読影ツール</h1>
        <p className="text-muted text-sm">検査データを入力 → ステップバイステップで解釈。見落としを防ぐインタラクティブフロー。</p>
      </header>

      <div className="grid gap-3">
        {tools.map(t => t.live ? (
          <Link key={t.href} href={t.href}
            className="group block p-4 bg-s0 border border-br rounded-xl hover:border-ac/30 hover:bg-acl/30 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-tx group-hover:text-ac transition-colors">{t.name}</h2>
              {t.badge && <span className="text-[10px] px-1.5 py-0.5 rounded bg-ac/10 text-ac font-bold">{t.badge}</span>}
            </div>
            <p className="text-sm text-muted">{t.desc}</p>
          </Link>
        ) : (
          <div key={t.name} className="p-4 bg-s1/50 border border-br/50 rounded-xl opacity-50">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-muted">{t.name}</h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-s2 text-muted font-bold">{t.badge}</span>
            </div>
            <p className="text-sm text-muted/70">{t.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
