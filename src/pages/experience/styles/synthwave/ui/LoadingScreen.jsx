import { useEffect, useState } from 'react'
import { useContent } from '@/hooks/useContent'

const TIPS = [
  'Scroll to fall through the sky',
  'Move your mouse to look around',
  'Keep scrolling past the ocean surface',
  'Each section reveals a new project',
  'Compiling procedural synthwave sky...',
]

export default function LoadingScreen({ progress, fade, ready, showSkip, onSkip, onEnter }) {
  const [enterHover, setEnterHover] = useState(false)
  const { contact } = useContent()
  const [tip, setTip] = useState(0)
  const [tipFade, setTipFade] = useState(true)

  useEffect(() => {
    const i = setInterval(() => {
      setTipFade(false)
      setTimeout(() => {
        setTip((t) => (t + 1) % TIPS.length)
        setTipFade(true)
      }, 250)
    }, 3500)
    return () => clearInterval(i)
  }, [])

  const pct = String(Math.floor(Math.min(progress, 100))).padStart(2, '0')

  return (
    <div
      style={{ ...styles.overlay, opacity: fade ? 0 : 1, pointerEvents: fade ? 'none' : 'auto' }}
    >
      <style>{`
        @keyframes scan { 0% { background-position: 0 0; } 100% { background-position: 0 40px; } }
        @keyframes flicker { 0%, 92%, 100% { opacity: 1; } 94% { opacity: 0.4; } 96% { opacity: 0.85; } }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255,60,142,0.12); }
          50% { box-shadow: 0 0 18px rgba(255,60,142,0.28); }
        }
      `}</style>

      <div style={styles.scanlines} />
      <div style={styles.grid} />

      <a href={contact.github} target="_blank" rel="noreferrer" style={styles.ghLink}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58
            1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
            0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27
            2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82
            1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01
            2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
          />
        </svg>
        github
      </a>

      <div style={styles.stack}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.dot} />
            <span style={styles.domainText}>raphaelmouallem.github.io</span>
            <span style={styles.bootBadge}>boot sequence</span>
          </div>

          <div style={styles.body}>
            {ready ? (
              <div style={styles.enterRow}>
                <button
                  style={{ ...styles.enterBtn, ...(enterHover ? styles.enterBtnHover : {}) }}
                  onMouseEnter={() => setEnterHover(true)}
                  onMouseLeave={() => setEnterHover(false)}
                  onClick={onEnter}
                >
                  enter
                </button>
              </div>
            ) : (
              <div style={styles.loadingBlock}>
                <div style={styles.pctRow}>
                  <span style={styles.pct}>{pct}</span>
                  <span style={styles.pctSign}>%</span>
                </div>

                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>
            )}

            <div style={styles.tipRow}>
              <span style={styles.tipLabel}>{'>'}</span>
              <span style={{ ...styles.tipText, opacity: tipFade ? 1 : 0 }}>{TIPS[tip]}</span>
            </div>
          </div>
        </div>

        <button
          style={{ ...styles.skipBtn, opacity: showSkip ? 1 : 0, pointerEvents: showSkip ? 'auto' : 'none' }}
          onClick={onSkip}
          tabIndex={showSkip ? 0 : -1}
          aria-hidden={!showSkip}
        >
          skip intro — use lightweight version
        </button>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: '#0b0617',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    transition: 'opacity 0.6s ease',
    fontFamily: '"JetBrains Mono", "Space Mono", monospace',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '28px',
  },
  scanlines: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage:
      'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 4px)',
    animation: 'scan 6s linear infinite',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,90,160,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,90,160,0.05) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
    maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)',
  },
  ghLink: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255,255,255,0.4)',
    textDecoration: 'none',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    transition: 'color 0.2s ease',
    zIndex: 2,
  },
  panel: {
    position: 'relative',
    zIndex: 1,
    width: '360px',
    background: 'rgba(20,8,32,0.6)',
    border: '1px solid rgba(255,124,193,0.25)',
    borderRadius: '4px',
    boxShadow: '0 0 24px rgba(255,60,142,0.08), inset 0 0 40px rgba(177,74,255,0.04)',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderBottom: '1px solid rgba(255,124,193,0.15)',
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#ff3c8e',
    animation: 'flicker 3s ease-in-out infinite',
    flexShrink: 0,
  },
  domainText: {
    fontSize: '0.65rem',
    letterSpacing: '0.05em',
    color: 'rgba(255,255,255,0.35)',
    flex: 1,
    minWidth: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  bootBadge: {
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(255,124,193,0.5)',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  body: {
    padding: '24px 20px',
    height: '160px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  loadingBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  pctRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: '14px',
    animation: 'flicker 4s ease-in-out infinite',
  },
  pct: {
    fontSize: '3rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    background: 'linear-gradient(135deg, #ff7a3c 0%, #ff3c8e 55%, #b14aff 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  },
  pctSign: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#b14aff',
    marginLeft: '4px',
  },
  barTrack: {
    height: '3px',
    width: '100%',
    borderRadius: '2px',
    background: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  barFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ff7a3c, #ff3c8e, #b14aff)',
    transition: 'width 0.25s ease',
  },
  tipRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.6,
    marginTop: '16px',
  },
  tipLabel: {
    color: '#ff3c8e',
    flexShrink: 0,
  },
  tipText: {
    transition: 'opacity 0.25s ease',
  },
  skipBtn: {
    position: 'relative',
    zIndex: 1,
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'inherit',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(255,255,255,0.15)',
    transition: 'color 0.2s ease, opacity 0.4s ease',
  },
  enterRow: {
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 0',
  },
  enterBtn: {
    background:
      'linear-gradient(135deg, rgba(255,122,60,0.12), rgba(255,60,142,0.12), rgba(177,74,255,0.12))',
    border: '1px solid rgba(255,124,193,0.4)',
    borderRadius: '4px',
    color: '#fff',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    padding: '10px 28px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    animation: 'glowPulse 2.4s ease-in-out infinite',
  },
  enterBtnHover: {
    background:
      'linear-gradient(135deg, rgba(255,122,60,0.22), rgba(255,60,142,0.22), rgba(177,74,255,0.22))',
    border: '1px solid rgba(255,124,193,0.7)',
    animation: 'none',
    boxShadow: '0 0 16px rgba(255,60,142,0.25)',
  },
}