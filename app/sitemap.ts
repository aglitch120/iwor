import { MetadataRoute } from 'next'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { categories } from '@/lib/blog-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://naikanavi.com'
  const posts = getAllPosts()
  
  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/tokushoho`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-03-09'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
  
  // カテゴリページ
  const categoryPages: MetadataRoute.Sitemap = Object.keys(categories).map((slug) => ({
    url: `${baseUrl}/blog/category/${slug}`,
    lastModified: new Date('2026-03-09'),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  // 記事ページ（updatedがあればそちらを使用）
  const postPages: MetadataRoute.Sitemap = posts.map((post) => {
    const fullPost = getPostBySlug(post.slug)
    const lastMod = fullPost?.frontmatter.updated || post.date
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(lastMod),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }
  })
  
  return [...staticPages, ...categoryPages, ...postPages]
}
