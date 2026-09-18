import Section from '../components/Section'
import { useTerminal } from '@/ui/components/useTerminal'
import { useRef, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { sendMessage } from '@/lib/sendMessage'
import { PROMPT, BOOT_LINES } from '@/ui/components/contactBoot'

const MONO = "'Menlo', 'Monaco', 'Courier New', monospace"
const FS = '0.82rem'

const lineColor = (t) => {
  if (t === 'faint') return 'var(--ink-soft)'
  if (t === 'ok') return '#28c840'
  if (t === 'err') return '#c0392b'
  return 'var(--ink)'
}

export default function Contact() {
  const { toggle, theme } = useTheme()

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
    onTheme: (t) => {
      if (t !== theme) toggle()
    },
  })

  const inputEl = (
    <textarea
      ref={inputRef}
      value={current}
      onChange={(e) => setCurrent(e.target.value)}
      onKeyDown={onKey}
      aria-label={promptLabel()}
      style={s.input}
      className="terminal-input"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      rows={1}
      onInput={(e) => {
        e.target.style.height = 'auto'
        e.target.style.height = e.target.scrollHeight + 'px'
      }}
    />
  )

  const bodyRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [history, error, status])

  return (
    <Section id="contact" style={s.section} data-cursor-label="contact">
      <div style={s.headRow}>
        <span style={s.eyebrow}>Contact</span>
        <div style={s.sep} />
        <span style={s.sub}>Get in touch</span>
      </div>

      <div style={s.window}>
        <div style={s.bar}>
          <div style={s.dots}>
            <span style={{ ...s.dot, background: '#ff5f57' }} />
            <span style={{ ...s.dot, background: '#febc2e' }} />
            <span style={{ ...s.dot, background: '#28c840' }} />
          </div>
          <span style={s.barTitle}>contact -- raphaelm ~ zsh</span>
          <div style={{ width: 52 }} />
        </div>

        <div
          ref={bodyRef}
          style={s.body}
          className="terminal-body"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((l, i) =>
            l.t === 'gap' ? (
              <div key={i} style={s.gap} />
            ) : l.t === 'reply' ? (
              <div key={i} style={s.line}>
                <span style={{ color: 'var(--ink)' }}>{'> '}</span>
                <span style={{ color: 'var(--accent)' }}>{l.text.slice(2)}</span>
              </div>
            ) : l.t === 'cmd' ? (
              <div key={i} style={s.line}>
                <span style={{ color: 'var(--ink)' }}>{PROMPT} </span>
                <span style={{ color: 'var(--accent)' }}>{l.text.slice(PROMPT.length + 1)}</span>
              </div>
            ) : (
              <div key={i} style={{ ...s.line, color: lineColor(l.t) }}>
                {l.text}
              </div>
            )
          )}

          {error && <div style={{ ...s.line, color: '#c0392b' }}>{error}</div>}

          {status === 'sending' && (
            <div style={{ ...s.line, color: 'var(--ink-soft)' }}>{PROMPT} sending...</div>
          )}

          {showInput && phase === 'form' && (
            <>
              <div style={s.line}>{promptLabel()}</div>
              <div style={s.inputRow}>
                <span style={s.line}>&gt;</span>
                {inputEl}
              </div>
            </>
          )}

          {showInput && phase === 'parser' && (
            <div style={s.inputRow}>
              <span style={s.line}>{PROMPT}</span>
              {inputEl}
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}

const s = {
  section: { maxWidth: 900, margin: '0 auto', padding: '12vh 24px' },
  headRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 },
  eyebrow: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    flexShrink: 0,
  },
  sep: { width: 1.5, height: '1.4rem', background: 'var(--accent)', opacity: 0.4, flexShrink: 0 },
  sub: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.85rem',
    color: 'var(--ink-soft)',
    letterSpacing: '0.04em',
  },
  window: { border: '1px solid var(--border)', overflow: 'hidden' },
  bar: {
    background: 'var(--paper-soft)',
    borderBottom: '1px solid var(--border)',
    padding: '9px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: { display: 'flex', gap: 6 },
  dot: { width: 11, height: 11, borderRadius: '50%', display: 'inline-block' },
  barTitle: { fontFamily: MONO, fontSize: '0.72rem', color: 'var(--ink-soft)' },
  body: {
    background: 'var(--paper)',
    padding: '14px 18px 20px',
    cursor: 'text',
    height: 420,
    overflowY: 'auto',
  },
  line: {
    fontFamily: MONO,
    fontSize: FS,
    lineHeight: 1.55,
    color: 'var(--ink)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  gap: { height: '0.55em' },
  inputRow: { display: 'flex', alignItems: 'flex-start', gap: '1ch', fontFamily: MONO },
  input: {
    fontFamily: MONO,
    fontSize: FS,
    color: 'var(--accent)',
    WebkitTextFillColor: 'var(--accent)',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    caretColor: 'var(--accent)',
    lineHeight: 1.55,
    flex: 1,
    padding: 0,
    minWidth: 0,
    resize: 'none',
    overflow: 'hidden',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    height: 'auto',
    display: 'block',
  },
}
