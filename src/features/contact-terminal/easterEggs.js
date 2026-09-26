import { NEOFETCH } from './commands'

// Handles the parser-only easter-egg commands that need staggered output
// (history/neofetch/ping/rm). Returns true if it handled `cmd`, else false.
export function runEasterEgg(cmd, val, { prompt, push, pushMany, pushDelayed, cmdHistory }) {
  if (cmd === 'history') {
    push(`${prompt} ${val}`, 'cmd')
    const log = cmdHistory.current
    pushMany(log.length === 0 ? ['no commands in history'] : log.map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`))
    return true
  }

  if (cmd === 'neofetch') {
    push(`${prompt} ${val}`, 'cmd')
    pushDelayed(
      NEOFETCH.map((text) => ({ text, t: 'ink' })),
      60
    )
    return true
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
    return true
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
    return true
  }

  return false
}
