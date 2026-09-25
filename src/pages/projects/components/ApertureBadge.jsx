export default function ApertureBadge({ index }) {
  return (
    <span className="relative w-10 h-10 shrink-0 flex items-center justify-center">
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full text-accent/35 transition-transform duration-500 ease-out group-hover:rotate-45"
      >
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1="20"
            y1="20"
            x2="20"
            y2="3"
            stroke="currentColor"
            strokeWidth="1"
            transform={`rotate(${deg} 20 20)`}
          />
        ))}
      </svg>
      <span className="relative font-display text-[0.78rem] text-accent">
        {String(index + 1).padStart(2, '0')}
      </span>
    </span>
  )
}
