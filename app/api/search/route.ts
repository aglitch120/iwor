import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, type PostListItem } from '@/lib/mdx'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim().toLowerCase()

  if (!query || query.length < 1) {
    return NextResponse.json({ results: [] })
  }

  const posts = getAllPosts()

  // クエリをスペースで分割して複数キーワード対応
  const keywords = query.split(/\s+/).filter(Boolean)

  const results = posts
    .map((post) => {
      const searchTarget = [
        post.title,
        post.description,
        post.categoryName,
        ...post.tags,
      ]
        .join(' ')
        .toLowerCase()

      // 全キーワードが含まれているかチェック
      const matchCount = keywords.filter((kw) => searchTarget.includes(kw)).length
      if (matchCount === 0) return null

      return {
        ...post,
        relevance: matchCount / keywords.length,
      }
    })
    .filter((r): r is PostListItem & { relevance: number } => r !== null)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10)

  return NextResponse.json({ results })
}
