'use client'

import { useState, useEffect, useCallback } from 'react'

// ── お気に入り管理（localStorage） ──
const STORAGE_KEY = 'iwor_favorites'
const AUTH_KEY = 'iwor_pro_user' // PRO会員フラグ（Phase1: 常にfalse）

function getFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function setFavorites(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
}

function isProUser(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(AUTH_KEY) === 'true'
}

// ── PROモーダル ──
function ProModal({ onClose }: { onClose: () => void }) {
  // ESCキーで閉じる
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose} // グレーエリアクリックで閉じる
    >
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* モーダル本体 */}
      <div
        className="relative bg-bg border border-br rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in"
        onClick={e => e.stopPropagation()} // モーダル内クリックは伝播しない
      >
        {/* ✕ボタン */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-tx hover:bg-s1 transition-colors"
          aria-label="閉じる"
        >
          ✕
        </button>

        {/* コンテンツ */}
        <div className="text-center">
          <div className="text-3xl mb-3">⭐</div>
          <h2 className="text-lg font-bold text-tx mb-2">お気に入り機能</h2>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            よく使うツールをピン留めして、
            <br />すぐにアクセスできるようになります。
          </p>

          <div className="bg-acl/50 border border-ac/20 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-ac mb-1">iwor PRO</p>
            <p className="text-xs text-muted">
              お気に入り・データ保存・進捗管理が使い放題
            </p>
            <p className="text-lg font-bold text-tx mt-2">
              ¥9,800<span className="text-xs font-normal text-muted">/年</span>
            </p>
          </div>

          <a
            href="/pro"
            className="block w-full py-3 bg-ac text-white rounded-xl font-bold text-sm hover:bg-ac/90 transition-colors mb-3"
          >
            PRO会員について詳しく見る
          </a>

          <button
            onClick={onClose}
            className="text-sm text-muted hover:text-tx transition-colors"
          >
            あとで
          </button>
        </div>
      </div>
    </div>
  )
}

// ── お気に入りボタン ──
interface FavoriteButtonProps {
  slug: string
  /** ボタンサイズ */
  size?: 'sm' | 'md'
}

export default function FavoriteButton({ slug, size = 'md' }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setIsFav(getFavorites().includes(slug))
  }, [slug])

  const handleClick = useCallback(() => {
    // PRO会員チェック（Phase1: 常にモーダル表示）
    if (!isProUser()) {
      setShowModal(true)
      return
    }

    // PRO会員 → お気に入りトグル
    const favs = getFavorites()
    if (favs.includes(slug)) {
      setFavorites(favs.filter(s => s !== slug))
      setIsFav(false)
    } else {
      setFavorites([...favs, slug])
      setIsFav(true)
    }

    // 他のコンポーネントに通知
    window.dispatchEvent(new CustomEvent('favorites-changed'))
  }, [slug])

  const sizeClass = size === 'sm'
    ? 'w-7 h-7 text-sm'
    : 'w-9 h-9 text-lg'

  return (
    <>
      <button
        onClick={handleClick}
        className={`${sizeClass} flex items-center justify-center rounded-full border transition-all
          ${isFav
            ? 'bg-[#FFF8E1] border-[#F9A825] text-[#F9A825]'
            : 'bg-s0 border-br text-muted hover:text-amber-400 hover:border-amber-300'
          }`}
        aria-label={isFav ? 'お気に入り解除' : 'お気に入りに追加'}
        title={isFav ? 'お気に入り解除' : 'お気に入りに追加'}
      >
        {isFav ? '★' : '☆'}
      </button>

      {showModal && <ProModal onClose={() => setShowModal(false)} />}
    </>
  )
}

// ── お気に入りバー（ページ上部表示用） ──
export function FavoritesBar() {
  const [favorites, setFavoritesState] = useState<string[]>([])

  useEffect(() => {
    setFavoritesState(getFavorites())

    const handler = () => setFavoritesState(getFavorites())
    window.addEventListener('favorites-changed', handler)
    return () => window.removeEventListener('favorites-changed', handler)
  }, [])

  if (favorites.length === 0) return null

  return (
    <div className="mb-6 p-3 bg-[#FFF8E1] border border-[#F9A825]/50 rounded-xl">
      <p className="text-xs font-medium text-[#E65100] mb-2 flex items-center gap-1">
        ⭐ お気に入り
      </p>
      <div className="flex flex-wrap gap-1.5">
        {favorites.map(slug => (
          <a
            key={slug}
            href={`/tools/calc/${slug}`}
            className="text-xs px-2.5 py-1 bg-white border border-[#F9A825]/40 rounded-lg text-tx hover:bg-[#FFF8E1] transition-colors"
          >
            {slug}
          </a>
        ))}
      </div>
    </div>
  )
}
