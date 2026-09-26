import { useEffect } from 'react'

export const SITE_URL = 'https://raphaelmouallem.github.io'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`
const DEFAULT_IMAGE_WIDTH = '1200'
const DEFAULT_IMAGE_HEIGHT = '630'
const DYNAMIC_TAG_ATTR = 'data-page-meta-dynamic'

export default function PageMeta({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  imageWidth,
  imageHeight,
  imageAlt,
  type = 'website',
  publishedTime,
  tags,
  jsonLd,
}) {
  useEffect(() => {
    const url = new URL(path, SITE_URL).toString()
    document.title = title

    set('meta-description', 'content', description)
    set('meta-canonical', 'href', url)

    set('og-title', 'content', title)
    set('og-description', 'content', description)
    set('og-url', 'content', url)
    set('og-image', 'content', image)
    set('og-type', 'content', type)

    set('twitter-title', 'content', title)
    set('twitter-description', 'content', description)
    set('twitter-image', 'content', image)

    const usingDefaultImage = image === DEFAULT_IMAGE
    setOrClear('og-image-width', imageWidth ?? (usingDefaultImage ? DEFAULT_IMAGE_WIDTH : null))
    setOrClear('og-image-height', imageHeight ?? (usingDefaultImage ? DEFAULT_IMAGE_HEIGHT : null))

    if (imageAlt) {
      set('og-image-alt', 'content', imageAlt)
      set('twitter-image-alt', 'content', imageAlt)
    }

    clearDynamicTags()
    if (type === 'article') {
      if (publishedTime) addMeta('article:published_time', publishedTime)
      for (const tag of tags ?? []) addMeta('article:tag', tag)
    }
    if (jsonLd) addJsonLd(jsonLd)

    return clearDynamicTags
  }, [
    title,
    description,
    path,
    image,
    imageWidth,
    imageHeight,
    imageAlt,
    type,
    publishedTime,
    tags,
    jsonLd,
  ])

  return null
}

function set(id, attr, value) {
  document.getElementById(id)?.setAttribute(attr, value)
}

function setOrClear(id, value) {
  const el = document.getElementById(id)
  if (!el) return
  if (value) el.setAttribute('content', value)
  else el.removeAttribute('content')
}

function addMeta(property, content) {
  const meta = document.createElement('meta')
  meta.setAttribute('property', property)
  meta.setAttribute('content', content)
  meta.setAttribute(DYNAMIC_TAG_ATTR, '')
  document.head.appendChild(meta)
}

function addJsonLd(data) {
  const script = document.createElement('script')
  script.setAttribute('type', 'application/ld+json')
  script.setAttribute(DYNAMIC_TAG_ATTR, '')
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

function clearDynamicTags() {
  document.head.querySelectorAll(`[${DYNAMIC_TAG_ATTR}]`).forEach((el) => el.remove())
}
