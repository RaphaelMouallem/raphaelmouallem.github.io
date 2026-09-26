import { Component } from 'react'
import { Link } from 'react-router-dom'
import en from '@/i18n/en.json'
import StateMessage from '../state/StateMessage'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    const t = en.errorBoundary
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-ink px-6">
        <StateMessage
          mood="dead"
          title={t.title}
          message={t.message}
          action={
            <div className="flex gap-3 mt-1">
              <button
                onClick={() => window.location.reload()}
                className="font-body text-[0.85rem] font-semibold px-6 py-3 rounded-full border border-border bg-paper-raised"
              >
                {t.reload}
              </button>
              <Link
                to="/"
                className="font-body text-[0.85rem] font-semibold px-6 py-3 rounded-full border border-border bg-paper-raised no-underline text-ink"
              >
                {t.backHome}
              </Link>
            </div>
          }
        />
      </div>
    )
  }
}
