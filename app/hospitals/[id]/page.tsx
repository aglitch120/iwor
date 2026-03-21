import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HOSPITALS } from '@/app/matching/hospitals-data'

export function generateStaticParams() {
  return HOSPITALS.map(h => ({ id: String(h.id) }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const h = HOSPITALS.find(h => String(h.id) === params.id)
  if (!h) return {}
  return {
    title: `${h.name} — 研修医マッチング情報 | iwor`,
    description: `${h.name}（${h.prefecture}）の初期臨床研修マッチング情報。倍率${h.matchRateLabel}、${h.beds}床、年収${h.salaryLabel}。${h.features.join('・')}。`,
    alternates: { canonical: `https://iwor.jp/hospitals/${h.id}` },
    openGraph: {
      title: `${h.name} — 研修医マッチング情報`,
      description: `倍率${h.matchRateLabel} / ${h.beds}床 / ${h.salaryLabel}`,
      url: `https://iwor.jp/hospitals/${h.id}`,
    },
  }
}

const busynessLabel = { high: '忙しい', medium: '普通', low: 'ゆるめ' }
const busynessColor = { high: 'var(--dn)', medium: 'var(--wn)', low: 'var(--ok)' }
const scaleLabel = { S: '小規模', M: '中規模', L: '大規模' }

export default function HospitalPage({ params }: { params: { id: string } }) {
  const h = HOSPITALS.find(h => String(h.id) === params.id)
  if (!h) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hospital',
    name: h.name,
    address: { '@type': 'PostalAddress', addressRegion: h.prefecture, addressCountry: 'JP' },
    numberOfBeds: h.beds,
  }

  return (
    <div className="max-w-2xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* パンくず */}
      <nav className="text-sm text-muted mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-ac">ホーム</Link>
        <span>›</span>
        <Link href="/hospitals" className="hover:text-ac">研修病院一覧</Link>
        <span>›</span>
        <span className="truncate">{h.name}</span>
      </nav>

      {/* ヘッダー */}
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--acl)', color: 'var(--ac)' }}>
            {h.type}
          </span>
          <span className="text-xs text-muted">{h.prefecture} / {h.region}</span>
        </div>
        <h1 className="text-2xl font-bold text-tx">{h.name}</h1>
        {h.philosophy && (
          <p className="text-sm text-muted mt-2 italic">&ldquo;{h.philosophy}&rdquo;</p>
        )}
      </header>

      {/* KPIカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <KpiCard label="マッチング倍率" value={h.matchRateLabel} color={h.matchRate >= 3 ? 'var(--dn)' : h.matchRate >= 2 ? 'var(--wn)' : 'var(--ok)'} />
        <KpiCard label="病床数" value={`${h.beds}床`} color="var(--tx)" />
        <KpiCard label="年間採用数" value={`${h.residents}人`} color="var(--ac)" />
        <KpiCard label="年収" value={h.salaryLabel} color="var(--tx)" />
      </div>

      {/* 倍率推移 */}
      {h.historicalRates.length > 0 && (
        <section className="bg-s0 border border-br rounded-xl p-4 mb-4">
          <h2 className="text-sm font-bold text-tx mb-3">倍率推移</h2>
          <div className="flex items-end gap-3 h-20">
            {h.historicalRates.map(r => {
              const maxRate = Math.max(...h.historicalRates.map(x => x.rate))
              const height = Math.max(20, (r.rate / maxRate) * 100)
              return (
                <div key={r.year} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold" style={{ color: 'var(--ac)' }}>{r.rate}倍</span>
                  <div className="w-full rounded-t" style={{ height: `${height}%`, background: 'var(--acl)' }} />
                  <span className="text-[10px] text-muted">{r.year}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 基本情報 */}
      <section className="bg-s0 border border-br rounded-xl p-4 mb-4">
        <h2 className="text-sm font-bold text-tx mb-3">基本情報</h2>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-muted">ER体制</div>
          <div className="text-tx font-medium">{h.erType}</div>
          <div className="text-muted">忙しさ</div>
          <div className="font-medium" style={{ color: busynessColor[h.busyness] }}>{busynessLabel[h.busyness]}</div>
          <div className="text-muted">強い診療科</div>
          <div className="text-tx">{h.specialties.join('、')}</div>
        </div>
      </section>

      {/* 特徴 */}
      <section className="bg-s0 border border-br rounded-xl p-4 mb-4">
        <h2 className="text-sm font-bold text-tx mb-3">特徴</h2>
        <div className="flex flex-wrap gap-2">
          {h.features.map(f => (
            <span key={f} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--acl)', color: 'var(--ac)' }}>
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* 診療科規模 */}
      {Object.keys(h.deptScale).length > 0 && (
        <section className="bg-s0 border border-br rounded-xl p-4 mb-4">
          <h2 className="text-sm font-bold text-tx mb-3">診療科規模</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(h.deptScale).map(([dept, scale]) => (
              <div key={dept} className="flex items-center justify-between text-sm">
                <span className="text-tx">{dept}</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{
                  background: scale === 'L' ? 'var(--acl)' : scale === 'M' ? 'var(--s1)' : 'var(--s2)',
                  color: scale === 'L' ? 'var(--ac)' : 'var(--m)',
                }}>
                  {scaleLabel[scale]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 穴場 */}
      {h.isAnaba && h.anabaReason && (
        <section className="bg-acl border border-ac/20 rounded-xl p-4 mb-4">
          <h2 className="text-sm font-bold text-ac mb-1">おすすめポイント</h2>
          <p className="text-sm text-tx">{h.anabaReason}</p>
        </section>
      )}

      {/* CTA */}
      <div className="flex gap-3 mt-6">
        <Link href="/matching" className="flex-1 py-3 bg-ac text-white rounded-xl text-sm font-bold text-center hover:bg-ac2 transition-colors">
          マッチング対策ツール
        </Link>
        <Link href="/hospitals" className="flex-1 py-3 border border-br rounded-xl text-sm font-medium text-muted text-center hover:text-ac hover:border-ac/30 transition-colors">
          病院一覧に戻る
        </Link>
      </div>
    </div>
  )
}

function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-s0 border border-br rounded-xl p-3">
      <p className="text-[10px] text-muted mb-1">{label}</p>
      <p className="text-lg font-bold" style={{ color }}>{value}</p>
    </div>
  )
}
