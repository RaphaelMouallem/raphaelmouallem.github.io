import StatePet from './StatePet'

export default function StateMessage({ mood, title, message, action }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <StatePet mood={mood} />
      {title && <p className="font-display text-xl font-bold text-ink">{title}</p>}
      {message && <p className="font-body text-sm text-ink-soft max-w-90">{message}</p>}
      {action}
    </div>
  )
}