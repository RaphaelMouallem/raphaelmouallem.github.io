import { useState, useEffect, useRef } from 'react'
import content from '@/i18n/en.json'

const PAGE_SECTIONS = [
  { name: 'hero', desc: 'Landing — name, title, scroll prompt' },
  { name: 'about', desc: 'Bio, education, skills, this site' },
  { name: 'projects', desc: 'Five projects with stack + links' },
  { name: 'contact', desc: 'You are here — send a message' },
  { name: 'footer', desc: 'Links, socials, hanko stamp' },
]

const NEOFETCH = [
  '         raphaelmouallem.github.io',
  '  ╭──────────────────────────────╮',
  '  │  OS       raphaelm     1.0   │',
  '  │  Shell    zsh                │',
  '  │  WM       React Three Fiber  │',
  '  │  Theme    Japandi            │',
  '  │  Font     Shippori Mincho    │',
  '  │  Palette  terracotta + ink   │',
  '  │  Uptime   always             │',
  '  │  Memory   no cookies         │',
  '  ╰──────────────────────────────╯',
]

const HELP_LINES = [
  'available commands:',
  '',
  '  help               — show this list',
  '  ls                 — list page sections',
  '  cat <section>      — describe a section',
  '  clear              — clear the terminal',
  '  theme <light|dark> — switch theme',
  '  whoami             — who are you?',
  '  date               — current date + time',
  '  echo <text>        — echo text back',
  '  neofetch           — system info',
  '  restart            — restart contact form',
  '  pwd                — current path',
  '  sudo               — nice try',
  '  rm -rf /           — nice try x2',
  '  uname              — system one-liner',
  '  ping <host>        — ping a host',
  '  man <cmd>          — manual (good luck)',
  '  history            — shows all previous commands',
]

export function parseCommand(raw, { onClear, onRestart, onTheme } = {}) {
  const trimmed = raw.trim()
  if (!trimmed) return []

  const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/)
  const rest = args.join(' ')

  switch (cmd) {
    case 'help':
      return HELP_LINES
    case 'ls':
      return ['sections:', '', ...PAGE_SECTIONS.map((s) => `  ${s.name.padEnd(12)} ${s.desc}`)]
    case 'cat': {
      if (!rest) return ['usage: cat <section>']
      const found = PAGE_SECTIONS.find((s) => s.name === rest)
      if (!found) return [`cat: ${rest}: no such section`]

      if (rest === 'projects') {
        const lines = ['projects/', '']
        content.projects.forEach((p, i) => {
          lines.push(`  project.${String(i + 1).padStart(2, '0')} — ${p.title}`)
          lines.push(`    ${p.subtitle}`)
          lines.push(`    tags: ${p.tags.join(', ')}`)
          lines.push('')
        })
        return lines
      }

      const data = content[rest] ?? null
      if (!data) return [`${rest} — ${found.desc}`]

      const lines = [`${rest}/`, '']
      const flatten = (obj, indent = '  ') => {
        for (const [k, v] of Object.entries(obj)) {
          if (Array.isArray(v)) {
            lines.push(`${indent}${k}:`)
            v.forEach((item) =>
              typeof item === 'object'
                ? flatten(item, indent + '  ')
                : lines.push(`${indent}  — ${item}`)
            )
          } else if (typeof v === 'object' && v !== null) {
            lines.push(`${indent}${k}:`)
            flatten(v, indent + '  ')
          } else {
            lines.push(`${indent}${k}: ${v}`)
          }
        }
      }
      flatten(data)
      return lines
    }
    case 'clear':
      onClear?.()
      return []
    case 'theme': {
      if (rest !== 'light' && rest !== 'dark') return ['usage: theme <light|dark>']
      onTheme?.(rest)
      return [`theme set to ${rest}`]
    }
    case 'whoami':
      return ['a curious human who scrolled all the way down. respect.']
    case 'date':
      return [new Date().toString()]
    case 'echo':
      return [rest || '']
    case 'restart':
      onRestart?.()
      return []
    case 'pwd':
      return [window.location.href]
    case 'sudo':
      return [
        'zsh: permission denied — you are not in the sudoers file. this incident will be reported.',
      ]
    case 'uname':
      return ['raphaelm Darwin 1.0.0 — React Three Fiber / Vite / GitHub Pages']
    case 'man': {
      if (!rest) return ['usage: man <command>']
      return [`man: no manual entry for ${rest}`, '  have you tried: help']
    }
    case 'open': {
      if (!rest) return ['usage: open <section>']
      const el = document.getElementById(rest)
      if (!el) return [`open: no section '${rest}'`]
      el.scrollIntoView({ behavior: 'smooth' })
      return [`opening ${rest}...`]
    }
    default:
      return [`zsh: command not found: ${cmd} — type help for commands`]
  }
}

const STEPS = ['name', 'message', 'email', 'confirm']

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function useTerminal({ prompt, bootLines, onSend, onTheme }) {
  const [booted, setBooted] = useState(false)
  const [phase, setPhase] = useState('boot')
  const [step, setStep] = useState(0)
  const [values, setValues] = useState({ name: '', message: '', email: '' })
  const [current, setCurrent] = useState('')
  const [history, setHistory] = useState([])
  const [error, setError] = useState(null)
  const [status, setStatus] = useState(null)
  const inputRef = useRef(null)
  const cmdHistory = useRef([])
  const historyIdx = useRef(-1)

  useEffect(() => {
    const t = setTimeout(() => {
      setHistory(bootLines)
      setBooted(true)
      setTimeout(() => setPhase('form'), 100)
    }, 120)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase === 'form' || phase === 'parser') {
      inputRef.current?.focus({ preventScroll: true })
    }
  }, [phase, step])

  const push = (text, t = 'ink') => setHistory((h) => [...h, { text, t }])
  const pushMany = (lines, t = 'ink') =>
    setHistory((h) => [...h, ...lines.map((text) => ({ text, t }))])
  const clearHistory = () => setHistory([])

  const pushDelayed = (lines, delay = 80) => {
    lines.forEach((text, i) => {
      setTimeout(() => {
        setHistory((h) => [...h, typeof text === 'string' ? { text, t: 'ink' } : text])
      }, i * delay)
    })
  }

  const handleSend = async () => {
    setStatus('sending')
    try {
      await onSend({ name: values.name, message: values.message, email: values.email })
      setStatus('sent')
      push('', 'gap')
      push('  [ok] sent. talk soon.', 'ok')
      push('', 'gap')
      push('type help for available commands', 'faint')
    } catch {
      setStatus('error')
      push('zsh: network error -- try again later', 'err')
      push('', 'gap')
      push('type restart to try again, or help for commands', 'faint')
    }
    setPhase('parser')
    setCurrent('')
  }

  const restart = () => {
    setHistory((h) => [
      ...h,
      { text: '', t: 'gap' },
      { text: '---', t: 'faint' },
      { text: '', t: 'gap' },
      ...bootLines,
    ])
    setValues({ name: '', message: '', email: '' })
    setStatus(null)
    setStep(0)
    setCurrent('')
    setPhase('form')
  }

  const advanceForm = () => {
    const val = current.trim()
    setError(null)

    if (STEPS[step] === 'name') {
      if (!val) {
        setError('zsh: name cannot be empty')
        return
      }
      push(`${prompt} name`, 'ink')
      push(`> ${val}`, 'reply')
      setValues((v) => ({ ...v, name: val }))
      setCurrent('')
      setStep(1)
    } else if (STEPS[step] === 'message') {
      if (!val) {
        setError('zsh: message cannot be empty')
        return
      }
      push(`${prompt} message`, 'ink')
      push(`> ${val}`, 'reply')
      setValues((v) => ({ ...v, message: val }))
      setCurrent('')
      setStep(2)
    } else if (STEPS[step] === 'email') {
      if (!validateEmail(val)) {
        setError('zsh: invalid address -- try again')
        return
      }
      push(`${prompt} email`, 'ink')
      push(`> ${val}`, 'reply')
      setValues((v) => ({ ...v, email: val }))
      setCurrent('')
      setStep(3)
    } else if (STEPS[step] === 'confirm') {
      const a = val.toLowerCase()
      if (a === 'y') {
        push(`${prompt} send? (y/n)`, 'ink')
        push('> y', 'reply')
        setCurrent('')
        handleSend()
      } else if (a === 'n') {
        push(`${prompt} send? (y/n)`, 'ink')
        push('> n', 'reply')
        push('', 'gap')
        push(`${prompt} aborted. no hard feelings.`, 'faint')
        push('', 'gap')
        push('type restart to try again, or help for commands', 'faint')
        setStatus('aborted')
        setCurrent('')
        setPhase('parser')
      } else {
        setError('zsh: please enter y or n')
      }
    }
  }

  const advanceParser = () => {
    const val = current.trim()

    if (!val) {
      push(`${prompt}`, 'cmd')
      setCurrent('')
      return
    }
    cmdHistory.current.push(val)
    historyIdx.current = -1

    const [cmd] = val.toLowerCase().split(/\s+/)

    if (cmd === 'history') {
      push(`${prompt} ${val}`, 'cmd')
      const log = cmdHistory.current
      pushMany(
        log.length === 0
          ? ['no commands in history']
          : log.map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`)
      )
      setCurrent('')
      return
    }

    if (cmd === 'neofetch') {
      push(`${prompt} ${val}`, 'cmd')
      pushDelayed(
        NEOFETCH.map((text) => ({ text, t: 'ink' })),
        60
      )
      setCurrent('')
      return
    }

    if (cmd === 'ping') {
      push(`${prompt} ${val}`, 'cmd')
      const target = val.split(/\s+/).slice(1).join(' ') || 'raphaelmouallem.github.io'
      const ms = () => (Math.random() * 12 + 2).toFixed(3)
      pushDelayed(
        [
          { text: `PING ${target}`, t: 'ink' },
          { text: `64 bytes from ${target}: icmp_seq=0 ttl=64 time=${ms()} ms`, t: 'ink' },
          { text: `64 bytes from ${target}: icmp_seq=1 ttl=64 time=${ms()} ms`, t: 'ink' },
          { text: `64 bytes from ${target}: icmp_seq=2 ttl=64 time=${ms()} ms`, t: 'ink' },
          { text: '', t: 'gap' },
          { text: '3 packets transmitted, 3 received, 0% packet loss', t: 'faint' },
        ],
        180
      )
      setCurrent('')
      return
    }

    if (cmd === 'rm') {
      push(`${prompt} ${val}`, 'cmd')
      pushDelayed(
        [
          { text: 'removing everything...', t: 'faint' },
          { text: '', t: 'gap' },
          { text: '  [          ] 0%', t: 'ink' },
          { text: '  [███       ] 30%', t: 'ink' },
          { text: '  [██████    ] 60%', t: 'ink' },
          { text: '  [█████████ ] 90%', t: 'ink' },
          { text: '  [██████████] 100%', t: 'ink' },
          { text: '', t: 'gap' },
          { text: '  just kidding. nice try.', t: 'faint' },
        ],
        120
      )
      setCurrent('')
      return
    }

    setError(null)
    push(`${prompt} ${val}`, 'cmd')

    const out = parseCommand(val, {
      onClear: () => {
        clearHistory()
        setCurrent('')
      },
      onRestart: restart,
      onTheme,
    })
    if (out.length) pushMany(out)
    setCurrent('')
  }

  const onKey = (e) => {
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      push(`^C`, 'faint')
      setCurrent('')
      if (phase === 'form') setPhase('parser')
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (phase !== 'parser' || cmdHistory.current.length === 0) return
      const next = Math.min(historyIdx.current + 1, cmdHistory.current.length - 1)
      historyIdx.current = next
      setCurrent(cmdHistory.current[cmdHistory.current.length - 1 - next])
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (phase !== 'parser') return
      const next = historyIdx.current - 1
      if (next < 0) {
        historyIdx.current = -1
        setCurrent('')
      } else {
        historyIdx.current = next
        setCurrent(cmdHistory.current[cmdHistory.current.length - 1 - next])
      }
      return
    }
    if (e.key !== 'Enter') return
    if (!e.shiftKey) {
      e.preventDefault()
    } else {
      return
    }
    if (phase === 'form') advanceForm()
    else if (phase === 'parser') advanceParser()
  }

  const promptLabel = () => {
    if (STEPS[step] === 'name') return `${prompt} name`
    if (STEPS[step] === 'message') return `${prompt} message`
    if (STEPS[step] === 'email') return `${prompt} email`
    if (STEPS[step] === 'confirm') return `${prompt} send? (y/n)`
    return prompt
  }

  return {
    phase,
    current,
    setCurrent,
    history,
    error,
    status,
    inputRef,
    bootLines,
    showInput: (phase === 'form' && status === null) || phase === 'parser',
    promptLabel,
    onKey,
  }
}
