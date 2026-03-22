import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/mdx'
import { categories, clusterColors } from '@/lib/blog-config'

const BLOG_DIR = 'content/blog'

export const dynamic = 'force-dynamic'

function readArticle(slug: string) {
  return fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf-8')
}

export async function GET() {
  const posts = getAllPosts()
  const existing = new Set(posts.map(p => p.slug))

  // Content analysis
  const statusCount = { published: 0, draft: 0, needs_review: 0 }
  const clusterCount: Record<string, number> = {}
  const qualityIssues: { slug: string; issues: string[] }[] = []

  const articleData = posts.map(post => {
    const content = readArticle(post.slug)

    if (content.includes('status: published')) statusCount.published++
    else if (content.includes('status: draft')) statusCount.draft++
    else if (content.includes('status: needs_review')) statusCount.needs_review++

    const cat = categories[post.category as keyof typeof categories]
    if (cat) clusterCount[cat.cluster] = (clusterCount[cat.cluster] || 0) + 1

    const title = (content.match(/^title:\s*["']?(.+?)["']?\s*$/m) || [])[1]?.replace(/^["']|["']$/g, '') || ''
    const desc = (content.match(/^description:\s*["']?(.+?)["']?\s*$/m) || [])[1]?.replace(/^["']|["']$/g, '') || ''
    const outlinks = (content.match(/\(\/blog\/([^)#\s"]+)\)/g) || [])
      .map(m => m.slice(7, -1))
      .filter(s => existing.has(s) && s !== post.slug)
    const hasFaq = /^## (よくある質問|FAQ)/m.test(content)
    const svgCount = (content.match(/<svg/g) || []).length
    const ctaCount = (content.match(/\/pro/g) || []).length
    const size = content.length

    const issues: string[] = []
    if (size < 12000) issues.push(`サイズ不足(${(size / 1000).toFixed(1)}KB)`)
    if (svgCount < 2) issues.push('SVG不足')
    if (ctaCount < 2) issues.push('CTA不足')
    if (outlinks.length < 3) issues.push(`内部リンク${outlinks.length}本`)
    if (!hasFaq) issues.push('FAQ欠如')
    if (issues.length > 0) qualityIssues.push({ slug: post.slug, issues })

    return {
      slug: post.slug, title, desc, category: post.category,
      outlinks: outlinks.length, hasFaq, svgCount, ctaCount, size,
      date: post.date, readingTime: post.readingTime,
    }
  })

  // Inlink count
  const inlinkCount: Record<string, number> = {}
  for (const post of posts) inlinkCount[post.slug] = 0
  for (const a of articleData) {
    const content = readArticle(a.slug)
    for (const m of content.match(/\(\/blog\/([^)#\s"]+)\)/g) || []) {
      const target = m.slice(7, -1)
      if (target in inlinkCount && target !== a.slug) inlinkCount[target]++
    }
  }

  // SEO scores
  const scored = articleData.map(a => {
    let score = 100
    if (a.size < 12000) score -= 20
    if (a.svgCount < 2) score -= 20
    if (a.ctaCount < 2) score -= 15
    if (a.outlinks < 3) score -= 15
    if (!a.hasFaq) score -= 15
    if (inlinkCount[a.slug] === 0) score -= 15
    return { ...a, score, inlinks: inlinkCount[a.slug] }
  })
  const avgScore = Math.round(scored.reduce((s, a) => s + a.score, 0) / scored.length)
  const orphans = scored.filter(a => a.inlinks === 0)
  const lowScore = scored.filter(a => a.score < 70).sort((a, b) => a.score - b.score)

  const metaIssues = articleData.flatMap(a => {
    const issues: string[] = []
    if (a.title.length > 60) issues.push(`title長すぎ(${a.title.length}字)`)
    if (a.title.length < 15) issues.push(`title短すぎ(${a.title.length}字)`)
    if (a.desc.length > 160) issues.push(`desc長すぎ(${a.desc.length}字)`)
    if (a.desc.length < 50) issues.push(`desc短すぎ(${a.desc.length}字)`)
    return issues.length ? [{ slug: a.slug, title: a.title, issues }] : []
  })

  const topLinked = [...scored].sort((a, b) => b.inlinks - a.inlinks).slice(0, 10)
  const bottomLinked = [...scored].sort((a, b) => a.inlinks - b.inlinks).slice(0, 10)
  const recentPosts = [...articleData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

  // Cluster info
  const clusters = Object.entries(clusterColors).map(([cluster, info]) => ({
    cluster, name: info.name, bg: info.bg, count: clusterCount[cluster] || 0,
  })).sort((a, b) => b.count - a.count)

  return NextResponse.json({
    total: posts.length,
    statusCount,
    qualityIssues: qualityIssues.slice(0, 30),
    clusters,
    seo: { avgScore, orphanCount: orphans.length, metaIssueCount: metaIssues.length, lowScoreCount: lowScore.length },
    orphans: orphans.slice(0, 20).map(a => ({ slug: a.slug, score: a.score })),
    metaIssues: metaIssues.slice(0, 20),
    topLinked: topLinked.map(a => ({ slug: a.slug, inlinks: a.inlinks })),
    bottomLinked: bottomLinked.map(a => ({ slug: a.slug, inlinks: a.inlinks })),
    lowScore: lowScore.slice(0, 20).map(a => ({ slug: a.slug, score: a.score, size: a.size, svgCount: a.svgCount, ctaCount: a.ctaCount, outlinks: a.outlinks, hasFaq: a.hasFaq, inlinks: a.inlinks })),
    recentPosts: recentPosts.map(p => ({ slug: p.slug, title: p.title, date: p.date, readingTime: p.readingTime, category: p.category })),
  })
}
