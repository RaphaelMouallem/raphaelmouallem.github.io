import { useState, useEffect, useRef } from 'react'
import { parseCommand } from './commands'
import { runEasterEgg } from './easterEggs'

export { parseCommand }

const STEPS = ['name', 'message', 'email', 'confirm']

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function useTerminal({ prompt, bootLines, onSend, onTheme }) {
  const [, setBooted] = useState(false)
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- boot sequence intentionally runs once on mount only

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

    if (runEasterEgg(cmd, val, { prompt, push, pushMany, pushDelayed, cmdHistory })) {
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
