'use client'
import UpdatedAt from '@/components/tools/UpdatedAt'

import { useState } from 'react'
import Link from 'next/link'
import ErrorReportButton from '@/components/tools/ErrorReportButton'
import FavoriteButton from '@/components/tools/FavoriteButton'
import ProPulseHint from '@/components/pro/ProPulseHint'

type Status = 'ok' | 'warn' | 'ng'

interface Drug {
  name: string
  generic: string
  status: Status
  method: string
  note: string
}

const STATUS_MAP: Record<Status, { label: string; bg: string; text: string }> = {
  ok: { label: '○ 可', bg: 'bg-acl', text: 'text-ac' },
  warn: { label: '△ 条件付', bg: 'bg-wnl', text: 'text-wn' },
  ng: { label: '× 不可', bg: 'bg-dnl', text: 'text-dn' },
}

const CATEGORIES: { title: string; drugs: Drug[] }[] = [
  {
    title: '循環器',
    drugs: [
      { name: 'アムロジピンOD錠', generic: 'アムロジピン', status: 'ok', method: '55℃温湯で崩壊', note: '' },
      { name: 'アダラートCR錠', generic: 'ニフェジピン', status: 'ng', method: '徐放製剤 — 粉砕不可', note: 'アダラートL錠（脱カプセル可）に変更検討' },
      { name: 'ワルファリン錠', generic: 'ワルファリン', status: 'ok', method: '55℃温湯で崩壊', note: '細粒もあり' },
      { name: 'エリキュース錠', generic: 'アピキサバン', status: 'ok', method: '粉砕+55℃温湯', note: '経鼻胃管投与可（添付文書記載）' },
      { name: 'イグザレルト錠', generic: 'リバーロキサバン', status: 'ok', method: '粉砕+水懸濁', note: '胃管からの投与可' },
      { name: 'プラビックス錠', generic: 'クロピドグレル', status: 'ok', method: '粉砕+55℃温湯', note: '' },
      { name: 'ビソプロロール錠', generic: 'ビソプロロール', status: 'ok', method: '55℃温湯で崩壊', note: 'テープ剤への変更も検討' },
      { name: 'カルベジロール錠', generic: 'カルベジロール', status: 'ok', method: '55℃温湯で崩壊', note: '' },
    ],
  },
  {
    title: '消化器',
    drugs: [
      { name: 'タケキャブ錠', generic: 'ボノプラザン', status: 'ok', method: '55℃温湯で崩壊', note: 'OD錠あり。水に崩壊しやすい' },
      { name: 'ネキシウムカプセル', generic: 'エソメプラゾール', status: 'warn', method: '脱カプセル+水懸濁', note: '腸溶顆粒を粉砕しない。顆粒のまま懸濁' },
      { name: 'タケプロンOD錠', generic: 'ランソプラゾール', status: 'warn', method: 'OD錠を水で崩壊', note: '腸溶顆粒あり。粉砕は避ける。注射剤への変更も検討' },
      { name: 'マグミット錠', generic: '酸化マグネシウム', status: 'ok', method: '55℃温湯で崩壊', note: '細粒もあり。チューブ詰まりに注意（量が多い場合）' },
      { name: 'ラキソベロン', generic: 'ピコスルファート', status: 'ok', method: '内用液あり', note: '液剤を優先使用' },
      { name: 'アミティーザ', generic: 'ルビプロストン', status: 'ng', method: 'ソフトカプセル — 経管不適', note: '他の緩下薬に変更' },
    ],
  },
  {
    title: '抗菌薬',
    drugs: [
      { name: 'クラビット錠', generic: 'レボフロキサシン', status: 'ok', method: '粉砕+55℃温湯', note: '注射剤への変更も検討。経管時はMg/Fe含有製剤との同時投与回避' },
      { name: 'オーグメンチン配合錠', generic: 'AMPC/CVA', status: 'ok', method: '粉砕+55℃温湯', note: 'ドライシロップへの変更も検討' },
      { name: 'ST合剤', generic: 'スルファメトキサゾール/トリメトプリム', status: 'ok', method: '粉砕+55℃温湯', note: '顆粒・注射剤あり' },
      { name: 'フロモックス錠', generic: 'セフカペン', status: 'ok', method: '粉砕+55℃温湯', note: '細粒あり' },
    ],
  },
  {
    title: '糖尿病薬',
    drugs: [
      { name: 'メトグルコ錠', generic: 'メトホルミン', status: 'ok', method: '粉砕+55℃温湯', note: '' },
      { name: 'ジャヌビア錠', generic: 'シタグリプチン', status: 'ok', method: '55℃温湯で崩壊', note: '' },
      { name: 'フォシーガ錠', generic: 'ダパグリフロジン', status: 'ok', method: '粉砕+水懸濁', note: '' },
      { name: 'アマリール錠', generic: 'グリメピリド', status: 'ok', method: '55℃温湯で崩壊', note: 'OD錠あり' },
    ],
  },
  {
    title: '精神・神経',
    drugs: [
      { name: 'デパケンR錠', generic: 'バルプロ酸', status: 'ng', method: '徐放製剤 — 粉砕不可', note: 'デパケンシロップ or 細粒に変更。注射剤もあり' },
      { name: 'セレニカR顆粒', generic: 'バルプロ酸', status: 'ng', method: '徐放製剤', note: '通常製剤（デパケン細粒/シロップ）に変更' },
      { name: 'テグレトール錠', generic: 'カルバマゼピン', status: 'ok', method: '粉砕+55℃温湯', note: '細粒あり' },
      { name: 'リスパダール錠', generic: 'リスペリドン', status: 'ok', method: 'OD錠/内用液あり', note: '内用液を優先使用' },
      { name: 'クエチアピン錠', generic: 'クエチアピン', status: 'ok', method: '粉砕+55℃温湯', note: '細粒あり' },
      { name: 'マイスリー錠', generic: 'ゾルピデム', status: 'ok', method: '55℃温湯で崩壊', note: 'OD錠が望ましい' },
      { name: 'デパス錠', generic: 'エチゾラム', status: 'ok', method: '粉砕+55℃温湯', note: '細粒あり' },
    ],
  },
  {
    title: 'ステロイド・免疫',
    drugs: [
      { name: 'プレドニン錠', generic: 'プレドニゾロン', status: 'ok', method: '55℃温湯で崩壊', note: '散剤もあり' },
      { name: 'メドロール錠', generic: 'メチルプレドニゾロン', status: 'ok', method: '粉砕+55℃温湯', note: '' },
      { name: 'デカドロン錠', generic: 'デキサメタゾン', status: 'ok', method: '55℃温湯で崩壊', note: 'エリキシルもあり' },
      { name: 'プログラフカプセル', generic: 'タクロリムス', status: 'warn', method: '脱カプセル+水懸濁', note: 'チューブ吸着あり。投与後フラッシュ十分に。顆粒もあり' },
    ],
  },
]

export default function TubeAdminPage() {
  const [search, setSearch] = useState('')
  const [openCat, setOpenCat] = useState<string | null>(null)

  const q = search.toLowerCase()
  const filtered = search.length >= 1
    ? CATEGORIES.map(c => ({ ...c, drugs: c.drugs.filter(d => d.name.toLowerCase().includes(q) || d.generic.toLowerCase().includes(q)) })).filter(c => c.drugs.length > 0)
    : CATEGORIES

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-muted mb-6">
        <Link href="/" className="hover:text-ac">ホーム</Link><span className="mx-2">›</span>
        <Link href="/tools" className="hover:text-ac">臨床ツール</Link><span className="mx-2">›</span>
        <Link href="/tools/drugs" className="hover:text-ac">薬剤ガイド</Link><span className="mx-2">›</span>
        <span>簡易懸濁可否リスト</span>
      </nav>

      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-block text-sm bg-acl text-ac px-2.5 py-0.5 rounded-full font-medium mb-2">💊 薬剤ガイド</span>
            <h1 className="text-2xl font-bold text-tx mb-1">簡易懸濁可否リスト</h1>
            <p className="text-sm text-muted">経管投与時の簡易懸濁法 可否一覧。55℃温湯による崩壊・懸濁方法。</p>
          </div>
          <ProPulseHint>
            <FavoriteButton slug="drugs-tube-admin" title="簡易懸濁可否リスト" href="/tools/drugs/tube-admin" type="drugs" />
          </ProPulseHint>
        </div>
        <UpdatedAt />
      </header>

      {/* 検索 */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="薬剤名で検索（例: アムロジピン）"
          className="w-full px-4 py-3 bg-s0 border border-br rounded-xl text-sm text-tx placeholder:text-muted focus:outline-none focus:border-ac/40"
        />
      </div>

      {/* 凡例 */}
      <div className="flex gap-3 mb-4 text-xs">
        {Object.entries(STATUS_MAP).map(([k, v]) => (
          <span key={k} className={`px-2 py-1 rounded-lg font-bold ${v.bg} ${v.text}`}>{v.label}</span>
        ))}
      </div>

      {/* カテゴリ別リスト */}
      <div className="space-y-3">
        {filtered.map(cat => {
          const isOpen = openCat === cat.title || search.length >= 1
          return (
            <div key={cat.title} className="bg-s0 border border-br rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenCat(isOpen && !search ? null : cat.title)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-acl/50 transition-colors"
              >
                <h2 className="flex-1 text-sm font-bold text-tx">{cat.title}</h2>
                <span className="text-[11px] text-muted bg-s1 px-2 py-0.5 rounded-full">{cat.drugs.length}</span>
                <span className="text-muted text-xs">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="border-t border-br">
                  {cat.drugs.map((d, i) => {
                    const st = STATUS_MAP[d.status]
                    return (
                      <div key={i} className={`p-3 ${i > 0 ? 'border-t border-br/50' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${st.bg} ${st.text}`}>{st.label}</span>
                          <span className="text-sm font-bold text-tx">{d.name}</span>
                          <span className="text-[11px] text-muted">({d.generic})</span>
                        </div>
                        <p className="text-xs text-tx ml-10">{d.method}</p>
                        {d.note && <p className="text-[11px] text-muted ml-10 mt-0.5">💡 {d.note}</p>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-sm text-muted">該当する薬剤が見つかりません</div>
      )}

      {/* 免責 */}
      <div className="bg-wnl border border-wnb rounded-lg p-3 mt-8 mb-8 text-sm text-wn">
        ⚠️ 本リストは参考情報です。簡易懸濁法の可否は各施設の薬剤部に確認してください。チューブ径・材質によっても可否が異なります。
        <div className="mt-2 pt-2 border-t border-wnb/30"><ErrorReportButton toolName="簡易懸濁法一覧" /></div>
      </div>

      <section className="text-xs text-muted space-y-1 mb-8">
        <h3 className="font-bold text-tx text-sm mb-2">参考文献</h3>
        <p>• 藤島一郎 監修「内服薬 経管投与ハンドブック」第4版. じほう. 2020.</p>
        <p>• 各薬剤添付文書・インタビューフォーム</p>
      </section>
    </main>
  )
}
