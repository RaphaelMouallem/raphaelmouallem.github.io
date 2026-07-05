import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ac, glass, MONO } from '@/pages/experience/styles/synthwave/ui/kit'
import { useTerminal } from '@/ui/components/useTerminal'
import { useStyleStore } from '@/pages/experience/store/useStyleStore'
import { sendMessage } from '@/lib/sendMessage'
import { PROMPT, BOOT_LINES } from '@/ui/components/contactBoot'

const FS = '0.78rem'

const lineColor = (t, accent) => {
  if (t === 'faint') return 'rgba(255,255,255,0.3)'
  if (t === 'ok') return '#28c840'
  if (t === 'err') return '#ff4444'
  if (t === 'reply') return accent
  if (t === 'cmd') return 'rgba(255,255,255,0.9)'
  return 'rgba(255,255,255,0.75)'
}

export default function ContactCard({ visible, isMobile }) {
  const accent = ac(0)
  const accent2 = ac(2)

  const setDark = useStyleStore((s) => s.setDark)

  const {
    phase,
    current,
    setCurrent,
    history,
    error,
    status,
    inputRef,
    showInput,
    promptLabel,
    onKey,
  } = useTerminal({
    prompt: PROMPT,
    bootLines: BOOT_LINES,
    onSend: sendMessage,
    onTheme: (t) => setDark(t === 'dark'),
  })

  const bodyRef = useRef(null)
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [history, error, status])

  const inputEl = (
    <textarea
      ref={inputRef}
      value={current}
      onChange={(e) => setCurrent(e.target.value)}
      onKeyDown={onKey}
      aria-label={promptLabel()}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      rows={1}
      style={{
        fontFamily: MONO,
        fontSize: FS,
        color: accent,
        WebkitTextFillColor: accent,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        caretColor: accent,
        lineHeight: 1.55,
        flex: 1,
        padding: 0,
        minWidth: 0,
        resize: 'none',
        overflow: 'hidden',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        height: 'auto',
        display: 'block',
        width: '100%',
      }}
      onInput={(e) => {
        e.target.style.height = 'auto'
        e.target.style.height = e.target.scrollHeight + 'px'
      }}
    />
  )

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: isMobile ? 'calc(100vw - 32px)' : 'min(900px, calc(100vw - 48px))',
              pointerEvents: 'all',
            }}
          >
            <div
              style={{
                background: 'rgba(20,5,35,0.95)',
                borderRadius: '4px 4px 0 0',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `1px solid rgba(255,255,255,0.08)`,
                borderBottom: `1px solid rgba(255,255,255,0.05)`,
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#ff5f57',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#febc2e',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#28c840',
                    display: 'inline-block',
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.1em',
                }}
              >
                contact -- raphaelm ~ zsh
              </span>
              <div style={{ width: 52 }} />
            </div>

            <div
              ref={bodyRef}
              onClick={() => inputRef.current?.focus()}
              style={{
                ...glass(accent),
                borderRadius: '0 0 4px 4px',
                borderLeft: `1px solid rgba(255,255,255,0.10)`,
                borderTop: `2px solid ${accent}`,
                padding: '12px 16px 16px',
                height: isMobile ? 280 : 420,
                maxHeight: isMobile ? 280 : 420,
                overflowY: 'auto',
                cursor: 'text',
                boxSizing: 'border-box',
                pointerEvents: 'all',
              }}
            >
              {history.map((l, i) =>
                l.t === 'gap' ? (
                  <div key={i} style={{ height: '0.5em' }} />
                ) : l.t === 'reply' ? (
                  <div
                    key={i}
                    style={{
                      fontFamily: MONO,
                      fontSize: FS,
                      lineHeight: 1.55,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{'> '}</span>
                    <span style={{ color: accent }}>{l.text.slice(2)}</span>
                  </div>
                ) : l.t === 'cmd' ? (
                  <div
                    key={i}
                    style={{
                      fontFamily: MONO,
                      fontSize: FS,
                      lineHeight: 1.55,
                      wordBreak: 'break-word',
                    }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{PROMPT} </span>
                    <span style={{ color: accent2 }}>{l.text.slice(PROMPT.length + 1)}</span>
                  </div>
                ) : (
                  <div
                    key={i}
                    style={{
                      fontFamily: MONO,
                      fontSize: FS,
                      lineHeight: 1.55,
                      color: lineColor(l.t, accent),
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {l.text}
                  </div>
                )
              )}

              {error && (
                <div style={{ fontFamily: MONO, fontSize: FS, lineHeight: 1.55, color: '#ff4444' }}>
                  {error}
                </div>
              )}

              {status === 'sending' && (
                <div style={{ fontFamily: MONO, fontSize: FS, color: 'rgba(255,255,255,0.3)' }}>
                  {PROMPT} sending...
                </div>
              )}

              {showInput && phase === 'form' && (
                <>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: FS,
                      lineHeight: 1.55,
                      color: 'rgba(255,255,255,0.75)',
                    }}
                  >
                    {promptLabel()}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: FS,
                        color: 'rgba(255,255,255,0.5)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                        lineHeight: 1.55,
                      }}
                    >
                      &gt;
                    </span>
                    <div style={{ paddingLeft: '1.5ch', fontFamily: MONO }}>{inputEl}</div>
                  </div>
                </>
              )}

              {showInput && phase === 'parser' && (
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: FS,
                      color: 'rgba(255,255,255,0.5)',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                      lineHeight: 1.55,
                    }}
                  >
                    {PROMPT}
                  </span>
                  <div style={{ paddingLeft: `${PROMPT.length + 1}ch`, fontFamily: MONO }}>
                    {inputEl}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
