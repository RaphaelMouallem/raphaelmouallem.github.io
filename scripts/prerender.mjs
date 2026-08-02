// Prerenders static HTML for crawler-facing routes.
//
// This is NOT server-side rendering. The app is React-CSR and stays that way —
// this script just boots the already-built dist/ in a real headless browser,
// lets it mount normally, and saves the resulting DOM as the route's HTML file.
// The original <script> tags stay in place, so the page still hydrates into
// the full interactive app once JS loads for real visitors.
//
// /3d is intentionally skipped: it's a WebGL scene, so headless rendering
// gives no meaningful content, and / (the default 2D route) already carries
// all the crawlable bio/experience/education/project text.

import { preview } from 'vite'
import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import path from 'node:path'

const ROUTES = [{ route: '/', outFile: 'index.html' }]

async function main() {
  const server = await preview({ preview: { port: 4173, strictPort: true } })
  const baseUrl = server.resolvedUrls.local[0]

  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    for (const { route, outFile } of ROUTES) {
      const url = new URL(route, baseUrl).toString()
      await page.goto(url, { waitUntil: 'networkidle' })
      // Let content settle (route-driven fetches, entrance animations, etc.)
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
