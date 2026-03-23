import type { Metadata } from 'next'
import Link from 'next/link'
import UpdatedAt from '@/components/tools/UpdatedAt'

export const metadata: Metadata = {
  title: '薬剤比較表 — iwor',
  description: '添付文書の公開情報に基づく薬剤一覧比較。循環器・代謝・消化器・感染症・精神神経など25カテゴリ155薬剤。',
}

const compareGroups = [
  { group: '循環器', items: [
    { href: '/tools/drugs/compare/doac', name: 'DOAC' },
    { href: '/tools/drugs/compare/arb', name: 'ARB' },
    { href: '/tools/drugs/compare/statin', name: 'スタチン' },
    { href: '/tools/drugs/compare/ccb', name: 'Ca拮抗薬' },
    { href: '/tools/drugs/compare/beta-blocker', name: 'β遮断薬' },
    { href: '/tools/drugs/compare/diuretic', name: '利尿薬' },
    { href: '/tools/drugs/compare/antiplatelet', name: '抗血小板薬' },
  ]},
  { group: '代謝・内分泌', items: [
    { href: '/tools/drugs/compare/sglt2i', name: 'SGLT2阻害薬' },
    { href: '/tools/drugs/compare/dpp4i', name: 'DPP-4阻害薬' },
    { href: '/tools/drugs/compare/glp1ra', name: 'GLP-1受容体作動薬' },
    { href: '/tools/drugs/compare/urate', name: '尿酸降下薬' },
  ]},
  { group: '消化器', items: [
    { href: '/tools/drugs/compare/ppi', name: 'PPI' },
    { href: '/tools/drugs/compare/laxative', name: '便秘薬' },
  ]},
  { group: '感染症', items: [
    { href: '/tools/drugs/compare/cephalosporin', name: 'セフェム系' },
    { href: '/tools/drugs/compare/quinolone', name: 'キノロン系' },
  ]},
  { group: '精神・神経', items: [
    { href: '/tools/drugs/compare/ssri-snri', name: 'SSRI/SNRI' },
    { href: '/tools/drugs/compare/bzd', name: 'BZD系' },
    { href: '/tools/drugs/compare/hypnotic', name: '睡眠薬' },
    { href: '/tools/drugs/compare/aed', name: '抗てんかん薬' },
  ]},
  { group: 'その他', items: [
    { href: '/tools/drugs/compare/nsaids', name: 'NSAIDs' },
    { href: '/tools/drugs/compare/patch', name: '湿布薬' },
    { href: '/tools/drugs/compare/steroid', name: 'ステロイド' },
    { href: '/tools/drugs/compare/inhaler', name: '吸入薬' },
    { href: '/tools/drugs/compare/antihistamine', name: '抗ヒスタミン薬' },
    { href: '/tools/drugs/compare/iron', name: '鉄剤' },
  ]},
]

export default function DrugComparePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">&rsaquo;</span>
        <Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">&rsaquo;</span>
        <Link href="/tools/drugs" className="hover:text-ac">薬剤ガイド</Link><span className="mx-2">&rsaquo;</span>
        <span>薬剤比較表</span>
      </nav>

      <header className="mb-8">
        <span className="inline-block text-sm bg-acl text-ac px-2.5 py-0.5 rounded-full font-medium mb-2">薬剤比較表</span>
        <h1 className="text-2xl font-bold text-tx mb-2">薬剤比較表</h1>
        <p className="text-sm text-muted">添付文書の公開情報に基づく薬剤一覧比較。25カテゴリ。</p>
        <UpdatedAt />
      </header>

      <div className="space-y-6">
        {compareGroups.map(g => (
          <div key={g.group}>
            <h2 className="text-xs font-bold text-muted mb-2 uppercase tracking-wide">{g.group}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {g.items.map(item => (
                <Link key={item.href} href={item.href}
                  className="bg-s0 border border-ac/15 rounded-xl p-3 text-center hover:border-ac/40 hover:bg-acl transition-all">
                  <span className="text-sm font-bold text-tx">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-wnl border border-wnb rounded-lg p-3 mt-8 mb-8 text-sm text-wn">
        掲載情報は公式文献の転記であり、正確性は保証しません。必ず原典・添付文書をご確認ください。
      </div>
    </div>
  )
}
