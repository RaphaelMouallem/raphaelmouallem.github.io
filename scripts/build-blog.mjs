import { readFile, writeFile, mkdir, readdir, copyFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import { toString as hastToString } from 'hast-util-to-string'
import { visit, SKIP } from 'unist-util-visit'
import { createHighlighter } from 'shiki'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content', 'blog')
const GENERATED_DIR = path.join(ROOT, 'public', 'content', 'blog')
const PUBLIC_BLOG_DIR = path.join(ROOT, 'public', 'blog')
const DOWNLOADS_DIR = path.join(ROOT, 'public', 'downloads')

const SITE_URL = 'https://raphaelmouallem.github.io'

const SHIKI_LANGS = [
  'cpp',
  'python',
  'javascript',
  'jsx',
  'typescript',
  'tsx',
  'bash',
  'json',
  'glsl',
]
const SHIKI_THEMES = { light: 'github-light', dark: 'github-dark' }

const NON_CONTENT_FILES = new Set(['index.md'])

function extractToc(tree) {
  const flat = []
  visit(tree, 'element', (node) => {
    if (node.tagName === 'h2' || node.tagName === 'h3') {
      flat.push({
        id: node.properties?.id ?? '',
        text: hastToString(node),
        depth: node.tagName === 'h2' ? 2 : 3,
        children: [],
      })
    }
  })

  const nested = []
  for (const heading of flat) {
    if (heading.depth === 2) {
      nested.push(heading)
    } else if (nested.length > 0) {
      nested[nested.length - 1].children.push(heading)
    } else {
      nested.push(heading)
    }
  }
  return nested
}

function rewriteAssetPaths(tree, slug) {
  const referenced = new Set()
  visit(tree, 'element', (node) => {
    const attr = node.tagName === 'img' || node.tagName === 'source' ? 'src' : null
    if (!attr) return
    const src = node.properties?.[attr]
    if (!src || /^([a-z]+:)?\/\//i.test(src) || src.startsWith('/')) return
    const relative = src.replace(/^\.\//, '')
    referenced.add(relative)
    node.properties[attr] = `/blog/${slug}/${relative}`
  })
  return referenced
}

function highlightCodeBlocks(tree, highlighter) {
  visit(tree, 'element', (node, index, parent) => {
    if (node.tagName !== 'pre' || node.children.length !== 1) return
    const codeNode = node.children[0]
    if (codeNode.tagName !== 'code') return

    const langClass = (codeNode.properties?.className ?? []).find((c) => c.startsWith('language-'))
    const lang = langClass ? langClass.replace('language-', '') : 'text'

    if (lang === 'math') return
    const code = hastToString(codeNode)

    const highlighted = highlighter.codeToHast(code, {
      lang: highlighter.getLoadedLanguages().includes(lang) ? lang : 'text',
      themes: SHIKI_THEMES,
      defaultColor: false,
    })
    const shikiPre = highlighted.children[0]
    node.properties = { ...node.properties, ...shikiPre.properties, dataLang: lang }
    node.children = shikiPre.children
    if (parent && typeof index === 'number') parent.children[index] = node
    return SKIP
  })
}

const MARKDOWN_ASSET_RE = /(!\[[^\]]*\]\(|<(?:img|source)[^>]*\ssrc=["'])(\.{0,2}\/?[^)"'\s]+)/g

function toDownloadableMarkdown(raw, slug) {
  return raw.replace(MARKDOWN_ASSET_RE, (match, prefix, relPath) => {
    if (/^([a-z]+:)?\/\//i.test(relPath) || relPath.startsWith('/')) return match
    const clean = relPath.replace(/^\.\//, '')
    return `${prefix}${SITE_URL}/blog/${slug}/${clean}`
  })
}

async function processPost(slug, highlighter) {
  const dir = path.join(CONTENT_DIR, slug)
  const raw = await readFile(path.join(dir, 'index.md'), 'utf-8')
  const { data: frontmatter, content } = matter(raw)

  for (const field of ['title', 'date', 'description']) {
    if (!frontmatter[field]) {
      throw new Error(
        `content/blog/${slug}/index.md is missing required frontmatter field "${field}"`
      )
    }
  }

  let toc = []
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(() => (tree) => {
      toc = extractToc(tree)
      rewriteAssetPaths(tree, slug)
      highlightCodeBlocks(tree, highlighter)
    })
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(content)

  const stats = readingTime(content)

  // Copy every co-located file except index.md itself.
  const entries = await readdir(dir).catch(() => [])
  const assetFiles = entries.filter((f) => !NON_CONTENT_FILES.has(f))
  const outAssetDir = path.join(PUBLIC_BLOG_DIR, slug)
  if (assetFiles.length > 0) {
    await mkdir(outAssetDir, { recursive: true })
    await Promise.all(assetFiles.map((f) => copyFile(path.join(dir, f), path.join(outAssetDir, f))))
  }
  if (frontmatter.cover && !assetFiles.includes(frontmatter.cover)) {
    console.warn(
      `⚠ ${slug}: frontmatter.cover "${frontmatter.cover}" has no matching file in content/blog/${slug}/`
    )
  }

  await mkdir(DOWNLOADS_DIR, { recursive: true })
  await writeFile(path.join(DOWNLOADS_DIR, `${slug}.md`), toDownloadableMarkdown(raw, slug))

  return {
    slug,
    frontmatter,
    html: String(file),
    toc,
    readingTime: { text: stats.text, minutes: Math.ceil(stats.minutes), words: stats.words },
  }
}

async function main() {
  await rm(GENERATED_DIR, { recursive: true, force: true })
  await rm(PUBLIC_BLOG_DIR, { recursive: true, force: true })
  await rm(DOWNLOADS_DIR, { recursive: true, force: true })
  await mkdir(GENERATED_DIR, { recursive: true })

  const slugs = (await readdir(CONTENT_DIR, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)

  if (slugs.length === 0) {
    console.warn('No posts found in content/blog/ — writing an empty index.')
    await writeFile(path.join(GENERATED_DIR, 'index.json'), '[]')
    return
  }

  const highlighter = await createHighlighter({
    themes: Object.values(SHIKI_THEMES),
    langs: SHIKI_LANGS,
  })

  const posts = []
  for (const slug of slugs) {
    try {
      posts.push(await processPost(slug, highlighter))
    } catch (err) {
      console.error(`✗ Failed to build content/blog/${slug}:`, err.message)
      process.exitCode = 1
    }
  }
  await highlighter.dispose()

  posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))

  for (const post of posts) {
    await writeFile(path.join(GENERATED_DIR, `${post.slug}.json`), JSON.stringify(post))
    console.log(
      `✓ Built content/blog/${post.slug} (${post.toc.length} top-level sections, ${post.readingTime.text})`
    )
  }

  const index = posts.map(({ slug, frontmatter, readingTime: rt }) => ({
    slug,
    frontmatter,
    readingTime: rt,
  }))
  await writeFile(path.join(GENERATED_DIR, 'index.json'), JSON.stringify(index))

  console.log(`\nBuilt ${posts.length} post(s) -> public/content/blog/`)
}

main().catch((err) => {
  console.error('Blog build failed:', err)
  process.exit(1)
})
