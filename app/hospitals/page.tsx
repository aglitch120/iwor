import type { Metadata } from 'next'
import Link from 'next/link'
import { HOSPITALS, REGIONS } from '@/app/matching/hospitals-data'

export const metadata: Metadata = {
  title: '研修病院一覧 — マッチング対策 | iwor',
  description: '初期臨床研修マッチング対策。全国50病院の倍率・年収・特徴・ER体制を比較。聖路加、亀田、虎の門、手稲渓仁会など人気病院の詳細情報。',
  alternates: { canonical: 'https://iwor.jp/hospitals' },
}

export default function HospitalsIndexPage() {
  const grouped = REGIONS.map(region => ({
    region,
    hospitals: HOSPITALS.filter(h => h.region === region).sort((a, b) => b.matchRate - a.matchRate),
  })).filter(g => g.hospitals.length > 0)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-tx mb-2">研修病院一覧</h1>
      <p className="text-sm text-muted mb-8">全国{HOSPITALS.length}病院の倍率・年収・特徴を比較</p>

      {grouped.map(({ region, hospitals }) => (
        <section key={region} className="mb-8">
          <h2 className="text-base font-bold text-tx mb-3 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full" style={{ background: 'var(--ac)' }} />
            {region}
            <span className="text-xs text-muted font-normal">({hospitals.length}病院)</span>
          </h2>
          <div className="grid gap-2">
            {hospitals.map(h => (
              <Link
                key={h.id}
                href={`/hospitals/${h.id}`}
                className="flex items-center justify-between p-3 bg-s0 border border-br rounded-xl hover:border-ac/30 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-tx truncate">{h.name}</p>
                  <p className="text-[11px] text-muted">{h.prefecture} / {h.type} / {h.beds}床</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: h.matchRate >= 3 ? 'var(--dn)' : h.matchRate >= 2 ? 'var(--wn)' : 'var(--ok)' }}>
                      {h.matchRateLabel}
                    </p>
                    <p className="text-[10px] text-muted">{h.salaryLabel}</p>
                  </div>
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-8 p-4 bg-acl rounded-xl text-center">
        <p className="text-sm text-ac font-medium mb-2">マッチング対策をもっと詳しく</p>
        <Link href="/matching" className="inline-block px-6 py-2 bg-ac text-white rounded-lg text-sm font-medium hover:bg-ac2 transition-colors">
          マッチング対策ツール →
        </Link>
      </div>
    </div>
  )
}
