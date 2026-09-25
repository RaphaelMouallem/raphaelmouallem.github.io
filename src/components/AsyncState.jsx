import { ASYNC_STATUS } from '@/lib/asyncStatus'
import LoadingState from './LoadingState'
import StateMessage from './StateMessage'

export default function AsyncState({ status, notFound, error, children }) {
  if (status === ASYNC_STATUS.LOADING) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </main>
    )
  }

  if (status === ASYNC_STATUS.NOT_FOUND) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        {notFound ?? <StateMessage mood="surprised" title="Not found." />}
      </main>
    )
  }

  if (status === ASYNC_STATUS.ERROR) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        {error ?? <StateMessage mood="dead" title="Couldn't load this." message="Try refreshing." />}
      </main>
    )
  }

  return children
}
