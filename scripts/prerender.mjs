import { preview } from 'vite'
import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BLOG_INDEX = path.join(ROOT, 'public', 'content', 'blog', 'index.json')

async function getRoutes() {
  const routes = [
    { route: '/', outFile: 'index.html' },
    { route: '/blog', outFile: 'blog/index.html' },
    { route: '/projects', outFile: 'projects/index.html' },
  ]

  let posts = []
  try {
    posts = JSON.parse(await fs.readFile(BLOG_INDEX, 'utf-8'))
  } catch {
    console.warn(`⚠ Could not read ${BLOG_INDEX} — no /blog/:slug routes will be prerendered.`)
  }

  for (const post of posts) {
    routes.push({ route: `/blog/${post.slug}`, outFile: `blog/${post.slug}/index.html` })
  }

  return routes
}

async function main() {
  const routes = await getRoutes()
  const server = await preview({ preview: { port: 4173, strictPort: true } })
  const baseUrl = server.resolvedUrls.local[0]

  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    for (const { route, outFile } of routes) {
      const url = new URL(route, baseUrl).toString()
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)

      const html = await page.content()
      const outPath = path.resolve('dist', outFile)
      await fs.mkdir(path.dirname(outPath), { recursive: true })
      await fs.writeFile(outPath, html)
      console.log(`Prerendered ${route} -> dist/${outFile}`)
    }
  } finally {
    await browser.close()
    await server.close()
  }
}

main().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
