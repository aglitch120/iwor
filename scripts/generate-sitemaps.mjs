#!/usr/bin/env node
/**
 * Generate sitemap.xml and image-sitemap.xml as static files in public/
 * This avoids dynamic route generation which conflicts with edge runtime requirements.
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BASE_URL = 'https://iwor.jp'
const ROOT = path.resolve(import.meta.dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content/blog')

// ── helpers ──
function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function getAllPostSlugs() {
  return fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx')).map(f => f.replace('.mdx', ''))
}

function getPostFrontmatter(slug) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  return matter(raw).data
}

// ── Import tools config (extract implemented tools) ──
const toolsConfigPath = path.join(ROOT, 'lib/tools-config.ts')
const toolsConfigRaw = fs.readFileSync(toolsConfigPath, 'utf-8')
// Extract slug list from implementedTools Set
const implementedMatch = toolsConfigRaw.match(/export const implementedTools = new Set\(\[([\s\S]*?)\]\)/)
const implementedSlugs = implementedMatch ? implementedMatch[1].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [] : []

// Extract tool objects for tier info
const toolObjects = []
const toolRegex = /\{ slug: '([^']+)'[^}]*tier: (\d)/g
let m
while ((m = toolRegex.exec(toolsConfigRaw)) !== null) {
  toolObjects.push({ slug: m[1], tier: parseInt(m[2]) })
}

// ── Import blog categories ──
const blogConfigPath = path.join(ROOT, 'lib/blog-config.ts')
const blogConfigRaw = fs.readFileSync(blogConfigPath, 'utf-8')
const categoryRegex = /'([a-z0-9-]+)':\s*\{/g
const categorySlugs = []
let cm
while ((cm = categoryRegex.exec(blogConfigRaw)) !== null) {
  categorySlugs.push(cm[1])
}

// ── Import hospital count ──
const hospitalsPath = path.join(ROOT, 'app/matching/hospitals-data.ts')
const hospitalsRaw = fs.readFileSync(hospitalsPath, 'utf-8')
const hospitalIdRegex = /id: (\d+)/g
let maxId = 0
let hm
while ((hm = hospitalIdRegex.exec(hospitalsRaw)) !== null) {
  maxId = Math.max(maxId, parseInt(hm[1]))
}

// ═══ Generate sitemap.xml ═══
function generateSitemap() {
  const entries = []
  const add = (url, lastmod, freq, priority) => {
    entries.push(`  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`)
  }

  // Static pages
  add(BASE_URL, '2026-03-20', 'daily', 1)
  add(`${BASE_URL}/blog`, '2026-03-20', 'daily', 0.9)
  add(`${BASE_URL}/tools`, '2026-03-20', 'weekly', 0.9)
  add(`${BASE_URL}/tools/calc`, '2026-03-20', 'weekly', 0.85)
  add(`${BASE_URL}/study`, '2026-03-20', 'weekly', 0.8)
  add(`${BASE_URL}/matching`, '2026-03-20', 'weekly', 0.7)
  add(`${BASE_URL}/josler`, '2026-03-20', 'weekly', 0.7)
  add(`${BASE_URL}/journal`, '2026-03-20', 'daily', 0.7)
  add(`${BASE_URL}/presenter`, '2026-03-20', 'weekly', 0.7)
  add(`${BASE_URL}/shift`, '2026-03-20', 'weekly', 0.7)
  add(`${BASE_URL}/money`, '2026-03-20', 'weekly', 0.7)
  add(`${BASE_URL}/learning`, '2026-03-20', 'weekly', 0.7)
  add(`${BASE_URL}/pro`, '2026-03-20', 'weekly', 0.8)
  add(`${BASE_URL}/app`, '2026-03-20', 'weekly', 0.8)
  add(`${BASE_URL}/about`, '2026-03-20', 'yearly', 0.4)
  add(`${BASE_URL}/compare`, '2026-03-20', 'monthly', 0.5)
  add(`${BASE_URL}/furusato-nozei`, '2026-03-20', 'monthly', 0.5)
  add(`${BASE_URL}/privacy`, '2026-03-09', 'yearly', 0.3)
  add(`${BASE_URL}/terms`, '2026-03-09', 'yearly', 0.3)
  add(`${BASE_URL}/tokushoho`, '2026-03-09', 'yearly', 0.3)
  add(`${BASE_URL}/contact`, '2026-03-09', 'yearly', 0.3)
  add(`${BASE_URL}/record`, '2026-03-21', 'weekly', 0.7)
  add(`${BASE_URL}/study/lp`, '2026-03-21', 'monthly', 0.7)

  // Drug pages
  for (const p of ['drugs', 'drugs/antibiotics', 'drugs/combination', 'drugs/steroid-cover']) {
    add(`${BASE_URL}/tools/${p}`, '2026-03-20', 'monthly', 0.75)
  }

  // Tool pages
  for (const p of ['antibiotics', 'procedures', 'interpret/lab-values', 'calc/gamma']) {
    add(`${BASE_URL}/tools/${p}`, '2026-03-20', 'monthly', 0.75)
  }

  // Calculator pages
  for (const slug of implementedSlugs) {
    const tool = toolObjects.find(t => t.slug === slug)
    const priority = tool?.tier === 1 ? 0.85 : tool?.tier === 2 ? 0.8 : 0.75
    add(`${BASE_URL}/tools/calc/${slug}`, '2026-03-20', 'monthly', priority)
  }

  // Blog categories
  for (const slug of categorySlugs) {
    add(`${BASE_URL}/blog/category/${slug}`, '2026-03-20', 'weekly', 0.7)
  }

  // Blog posts
  for (const slug of getAllPostSlugs()) {
    const fm = getPostFrontmatter(slug)
    const lastmod = fm?.updated || fm?.date || '2026-03-20'
    add(`${BASE_URL}/blog/${slug}`, lastmod, 'monthly', 0.6)
  }

  // Hospital pages
  add(`${BASE_URL}/hospitals`, '2026-03-21', 'weekly', 0.7)
  for (let i = 1; i <= maxId; i++) {
    add(`${BASE_URL}/hospitals/${i}`, '2026-03-21', 'monthly', 0.6)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`
  fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), xml, 'utf-8')
  console.log(`Generated sitemap.xml: ${entries.length} URLs`)
}

// ═══ Generate image-sitemap.xml ═══
function generateImageSitemap() {
  const slugs = getAllPostSlugs()
  const urlEntries = []

  for (const slug of slugs) {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) continue
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { content } = matter(raw)

    const images = []
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    let im
    while ((im = imageRegex.exec(content)) !== null) {
      if (im[2].startsWith('/images/')) {
        images.push({ loc: `${BASE_URL}${im[2]}`, title: im[1] || slug })
      }
    }
    if (images.length === 0) continue

    const imageXml = images.map(img =>
      `\n    <image:image>\n      <image:loc>${escapeXml(img.loc)}</image:loc>\n      <image:title>${escapeXml(img.title)}</image:title>\n    </image:image>`
    ).join('')

    urlEntries.push(`  <url>\n    <loc>${BASE_URL}/blog/${slug}</loc>${imageXml}\n  </url>`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset\n  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n>\n${urlEntries.join('\n')}\n</urlset>`
  fs.writeFileSync(path.join(ROOT, 'public/image-sitemap.xml'), xml, 'utf-8')
  console.log(`Generated image-sitemap.xml: ${urlEntries.length} URLs with images`)
}

generateSitemap()
generateImageSitemap()
