import Section from '@/components/Section'
import { useTerminal } from '@/features/terminal-pet/useTerminal'
import { useRef, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { sendMessage } from '@/lib/sendMessage'
import { PROMPT, BOOT_LINES } from '@/features/terminal-pet/contactBoot'

const LINE = 'font-mono text-[0.82rem] leading-[1.55] whitespace-pre-wrap break-words'

const lineColorClass = (t) => {
  if (t === 'faint') return 'text-ink-soft'
  if (t === 'ok') return 'text-[#28c840]'
  if (t === 'err') return 'text-[#c0392b]'
  return 'text-ink'
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
      style={{ WebkitTextFillColor: 'var(--accent)' }}
      className={`${LINE} caret-accent text-accent bg-transparent border-none outline-none flex-1 p-0 min-w-0 resize-none overflow-hidden h-auto block`}
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
    <Section id="contact" className="max-w-[900px] mx-auto py-[12vh] px-6" data-cursor-label="contact">
      <div className="flex items-center gap-2.5 mb-10">
        <span className="font-display text-2xl font-extrabold tracking-[0.12em] uppercase text-accent shrink-0">
          Contact
        </span>
        <div className="w-[1.5px] h-[1.4rem] bg-accent opacity-40 shrink-0" />
        <span className="font-body text-[0.85rem] text-ink-soft tracking-[0.04em]">Get in touch</span>
      </div>

      <div className="border border-border overflow-hidden">
        <div className="bg-paper-soft border-b border-border px-3.5 py-[9px] flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="w-[11px] h-[11px] rounded-full inline-block bg-[#ff5f57]" />
            <span className="w-[11px] h-[11px] rounded-full inline-block bg-[#febc2e]" />
            <span className="w-[11px] h-[11px] rounded-full inline-block bg-[#28c840]" />
          </div>
          <span className="font-mono text-[0.72rem] text-ink-soft">contact -- raphaelm ~ zsh</span>
          <div className="w-[52px]" />
        </div>

        <div
          ref={bodyRef}
          className="bg-paper cursor-text h-[420px] overflow-y-auto pt-3.5 px-[18px] pb-5 terminal-body"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((l, i) =>
            l.t === 'gap' ? (
              <div key={i} className="h-[0.55em]" />
            ) : l.t === 'reply' ? (
              <div key={i} className={LINE}>
                <span className="text-ink">{'> '}</span>
                <span className="text-accent">{l.text.slice(2)}</span>
              </div>
            ) : l.t === 'cmd' ? (
              <div key={i} className={LINE}>
                <span className="text-ink">{PROMPT} </span>
                <span className="text-accent">{l.text.slice(PROMPT.length + 1)}</span>
              </div>
            ) : (
              <div key={i} className={`${LINE} ${lineColorClass(l.t)}`}>
                {l.text}
              </div>
            )
          )}

          {error && <div className={`${LINE} text-[#c0392b]`}>{error}</div>}

          {status === 'sending' && (
            <div className={`${LINE} text-ink-soft`}>{PROMPT} sending...</div>
          )}

          {showInput && phase === 'form' && (
            <>
              <div className={LINE}>{promptLabel()}</div>
              <div className="flex items-start gap-[1ch] font-mono">
                <span className={LINE}>&gt;</span>
                {inputEl}
              </div>
            </>
          )}

          {showInput && phase === 'parser' && (
            <div className="flex items-start gap-[1ch] font-mono">
              <span className={LINE}>{PROMPT}</span>
              {inputEl}
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}