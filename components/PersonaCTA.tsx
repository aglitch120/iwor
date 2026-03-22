'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

/**
 * PersonaCTA — ペルソナ2軸CTA
 *
 * 流入意図(context) × 属性(role) でパーソナライズしたCTAを表示。
 * context: ページのカテゴリ（calc/josler/matching/study/money/journal/blog等）
 * role: localStorage iwor_user_role（student/resident/fellow/attending）
 *
 * 使い方: <PersonaCTA context="calc" />
 */

type Role = 'student' | 'resident' | 'fellow' | 'attending' | ''

interface CTAConfig {
  text: string
  cta: string
  href: string
}

// 2軸マトリクス: context × role
const CTA_MATRIX: Record<string, Record<Role, CTAConfig>> = {
  calc: {
    student: { text: '国試対策もiworで。毎日5分の暗記カード', cta: 'Studyを試す', href: '/study' },
    resident: { text: 'よく使う計算ツールをお気に入りに保存', cta: 'お気に入り', href: '/favorites' },
    fellow: { text: 'J-OSLER管理もiworで一元化', cta: 'JOSLERを開く', href: '/josler' },
    attending: { text: '論文フィードで最新エビデンスをチェック', cta: '論文を読む', href: '/journal' },
    '': { text: 'よく使うツールをお気に入りに保存', cta: 'お気に入り', href: '/favorites' },
  },
  josler: {
    student: { text: '内科専攻を目指すなら、J-OSLERの全体像を把握', cta: 'ブログで学ぶ', href: '/blog/josler-complete-guide' },
    resident: { text: '初期研修の経験をEPOCで記録', cta: 'EPOCを開く', href: '/epoc' },
    fellow: { text: '病歴要約をAIで効率的に作成', cta: 'AI生成を試す', href: '/josler/summary-generator' },
    attending: { text: '専門医単位の取得状況を管理', cta: '単位管理', href: '/credits' },
    '': { text: '病歴要約をAIで効率的に作成', cta: 'AI生成を試す', href: '/josler/summary-generator' },
  },
  matching: {
    student: { text: 'マッチング後は国試対策。毎日5分のStudy', cta: 'Studyを試す', href: '/study' },
    resident: { text: '臨床ツールで当直をサバイブ', cta: 'ツール一覧', href: '/tools' },
    fellow: { text: '転職先の病院を比較検討', cta: '病院を探す', href: '/matching' },
    attending: { text: '転職先の病院を比較検討', cta: '病院を探す', href: '/matching' },
    '': { text: 'マッチング対策を始めよう', cta: '病院を探す', href: '/matching' },
  },
  study: {
    student: { text: 'マッチング対策もiworで', cta: '病院を探す', href: '/matching' },
    resident: { text: '臨床ツールで当直をサバイブ', cta: 'ツール一覧', href: '/tools' },
    fellow: { text: 'J-OSLER管理と並行して効率学習', cta: 'JOSLERを開く', href: '/josler' },
    attending: { text: '論文フィードで最新知見をキャッチ', cta: '論文を読む', href: '/journal' },
    '': { text: '臨床ツールも使ってみましょう', cta: 'ツール一覧', href: '/tools' },
  },
  journal: {
    student: { text: '国試対策にiwor Study', cta: 'Studyを試す', href: '/study' },
    resident: { text: '論文から抄読会資料を即作成', cta: 'プレゼン作成', href: '/presenter' },
    fellow: { text: '論文から抄読会資料を即作成', cta: 'プレゼン作成', href: '/presenter' },
    attending: { text: 'PRO会員で全論文にアクセス', cta: 'PROを見る', href: '/pro' },
    '': { text: '論文から抄読会資料を即作成', cta: 'プレゼン作成', href: '/presenter' },
  },
  blog: {
    student: { text: 'iwor Studyで効率的に暗記', cta: 'Studyを試す', href: '/study' },
    resident: { text: '臨床ツールで当直をサバイブ', cta: 'ツール一覧', href: '/tools' },
    fellow: { text: 'J-OSLER管理をiworで効率化', cta: 'JOSLERを開く', href: '/josler' },
    attending: { text: '論文フィードで最新エビデンス', cta: '論文を読む', href: '/journal' },
    '': { text: '医師のためのワークスペース', cta: 'ホームへ', href: '/' },
  },
}

export default function PersonaCTA({ context }: { context: string }) {
  const [cta, setCta] = useState<CTAConfig | null>(null)

  useEffect(() => {
    const role = (localStorage.getItem('iwor_user_role') || '') as Role
    const matrix = CTA_MATRIX[context] || CTA_MATRIX.blog
    setCta(matrix[role] || matrix[''])
  }, [context])

  if (!cta) return null

  return (
    <div className="my-4">
      <Link href={cta.href}
        className="block bg-acl border border-ac/20 rounded-xl p-3 hover:border-ac/40 transition-all">
        <div className="flex items-center justify-between">
          <p className="text-xs text-ac">{cta.text}</p>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-white bg-ac flex-shrink-0 ml-2">{cta.cta}</span>
        </div>
      </Link>
    </div>
  )
}
