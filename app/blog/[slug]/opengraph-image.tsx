import { ImageResponse } from 'next/og'
import { getPostBySlug, getAllPostSlugs } from '@/lib/mdx'
import { categories } from '@/lib/blog-config'

export const runtime = 'edge'
export const alt = '内科ナビ'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  const title = post?.frontmatter.title || '内科ナビ'
  const categoryName = post
    ? categories[post.frontmatter.category]?.name || 'その他'
    : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(135deg, #F5F4F0 0%, #E8F0EC 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* カテゴリラベル */}
        {categoryName && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#1B4F3A',
                color: '#FFFFFF',
                fontSize: 20,
                fontWeight: 700,
                padding: '8px 20px',
                borderRadius: 8,
              }}
            >
              {categoryName}
            </div>
          </div>
        )}

        {/* タイトル */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: title.length > 30 ? 44 : 52,
              fontWeight: 700,
              color: '#1A1917',
              lineHeight: 1.3,
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: '#1B4F3A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              内
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: '#1B4F3A',
              }}
            >
              内科ナビ
            </div>
          </div>
          <div
            style={{
              fontSize: 18,
              color: '#6B6760',
            }}
          >
            naikanavi.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
