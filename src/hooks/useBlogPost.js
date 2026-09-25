import { useEffect, useState } from 'react'
import { ASYNC_STATUS } from '@/lib/asyncStatus'

export function useBlogPost(slug) {
  const [state, setState] = useState({ post: null, status: ASYNC_STATUS.LOADING, slug })

  if (state.slug !== slug) {
    setState({ post: null, status: ASYNC_STATUS.LOADING, slug })
  }

  useEffect(() => {
    let cancelled = false

    fetch(`/content/blog/${slug}.json`)
      .then((res) => {
        if (res.status === 404) return null
        if (!res.ok) throw new Error(`Unexpected status ${res.status}`)
        return res.json()
      })
      .then((post) => {
        if (cancelled) return
        setState({ post, status: post ? ASYNC_STATUS.READY : ASYNC_STATUS.NOT_FOUND, slug })
      })
      .catch((err) => {
        if (cancelled) return
        console.error(`Failed to load blog post "${slug}":`, err)
        setState({ post: null, status: ASYNC_STATUS.ERROR, slug })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return state
}

export function useBlogIndex() {
  const [state, setState] = useState({ posts: [], status: ASYNC_STATUS.LOADING })

  useEffect(() => {
    let cancelled = false
    fetch('/content/blog/index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Unexpected status ${res.status}`)
        return res.json()
      })
      .then((posts) => {
        if (!cancelled) setState({ posts, status: ASYNC_STATUS.READY })
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Failed to load blog index:', err)
        setState({ posts: [], status: ASYNC_STATUS.ERROR })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
