import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SITE_URL = 'https://raphaelmouallem.github.io'
const BLOG_INDEX = path.join(ROOT, 'public', 'content', 'blog', 'index.json')
const OUT_FILE = path.join(ROOT, 'public', 'sitemap.xml')

const STATIC_ROUTES = [
  { loc: '/', changefreq: 'monthly', priority: '1.0' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
  { loc: '/projects', changefreq: 'monthly', priority: '0.8' },
]

function urlEntry({ loc, changefreq, priority, lastmod }) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n')
}

async function main() {
  let posts = []
  try {
    posts = JSON.parse(await readFile(BLOG_INDEX, 'utf-8'))
  } catch {
    console.warn(`⚠ Could not read ${BLOG_INDEX} — sitemap will list 0 blog posts.`)
  }

  const postRoutes = posts.map((post) => ({
    loc: `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: post.frontmatter?.date,
  }))

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...STATIC_ROUTES, ...postRoutes].map(urlEntry),
    '</urlset>',
  ].join('\n')

  await writeFile(OUT_FILE, xml + '\n')
  console.log(`✓ Wrote sitemap.xml (${STATIC_ROUTES.length} static + ${postRoutes.length} post route(s))`)
}

main().catch((err) => {
  console.error('Sitemap generation failed:', err)
  process.exit(1)
})
