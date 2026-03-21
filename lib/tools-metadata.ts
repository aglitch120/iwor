import type { Metadata } from 'next'
import { getToolBySlug, categoryLabels } from '@/lib/tools-config'

export function generateToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug)
  if (!tool) return {}

  const title = `${tool.name}（${tool.nameEn}）— 無料オンライン計算ツール | iwor`
  const description = `${tool.description} エビデンスに基づく解説・参考文献付き。内科専攻医・研修医向け臨床計算ツール。`
  const url = `https://iwor.jp/tools/calc/${slug}`

  return {
    title,
    description,
    keywords: [...tool.keywords, '計算ツール', '臨床スコア', '内科', '医療', 'オンライン', '無料'],
    openGraph: {
      title,
      description,
      url,
      siteName: 'iwor',
      type: 'website',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} 計算ツール | iwor`,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export function generateToolJsonLd(slug: string) {
  const tool = getToolBySlug(slug)
  if (!tool) return null

  const category = categoryLabels[tool.category]
  const url = `https://iwor.jp/tools/calc/${slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: `${tool.name}（${tool.nameEn}）`,
    description: tool.description,
    url,
    inLanguage: 'ja',
    isPartOf: { '@type': 'WebSite', name: 'iwor', url: 'https://iwor.jp' },
    about: {
      '@type': 'MedicalCondition',
      name: category,
    },
    audience: {
      '@type': 'MedicalAudience',
      audienceType: 'Clinician',
    },
    ...(tool.updatedAt ? { dateModified: `${tool.updatedAt}-01` } : {}),
    ...(tool.sources && tool.sources.length > 0 ? {
      citation: tool.sources.map(s => ({
        '@type': 'ScholarlyArticle',
        name: s.text,
        ...(s.url ? { url: s.url } : {}),
      })),
    } : {}),
  }
}
