export default function Front({ face = '^_^', glitching = false }) {
  return (
    <>
      <svg
        viewBox="0 0 240 230"
        style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="35,30 205,30 191,10 49,10"
          fill="var(--paper-soft)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <rect
          x="35"
          y="30"
          width="170"
          height="170"
          fill="var(--paper-raised)"
          stroke="var(--border)"
          strokeWidth="1"
          style={{ filter: 'drop-shadow(0 10px 18px var(--shadow))' }}
        />
        <circle cx="52" cy="47" r="4" fill="#e0554a" />
        <circle cx="66" cy="47" r="4" fill="#e0ab4a" />
        <circle cx="80" cy="47" r="4" fill="#5f9e5a" />
        <rect x="53" y="62" width="134" height="118" fill="var(--accent)" />
        <rect x="61" y="70" width="118" height="102" fill="var(--paper-sunken)" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: '25.4%',
          top: '30.4%',
          width: '49.2%',
          height: '44.3%',
          color: 'var(--ink)',
          fontFamily: 'var(--font-body)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}
      >
        {face}
      </div>
      <div
        className={`pet-screen-flicker${glitching ? ' intense' : ''}`}
        style={{ left: '25.4%', top: '30.4%', width: '49.2%', height: '44.3%' }}
      />
    </>
  )
}
