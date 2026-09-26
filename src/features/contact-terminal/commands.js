import content from '@/i18n/en.json'

export const PAGE_SECTIONS = [
  { name: 'hero', desc: 'Landing — name, title, scroll prompt' },
  { name: 'about', desc: 'Bio, education, skills, this site' },
  { name: 'projects', desc: 'Five projects with stack + links' },
  { name: 'contact', desc: 'You are here — send a message' },
  { name: 'footer', desc: 'Links, socials, hanko stamp' },
]

export const NEOFETCH = [
  '         raphaelmouallem.github.io',
  '  ╭──────────────────────────────╮',
  '  │  OS       raphaelm     1.0   │',
  '  │  Shell    zsh                │',
  '  │  WM       React DOM          │',
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
  '  open <section>     - open targeted section',
]

function catSection(rest) {
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
        v.forEach((it) => (typeof it === 'object' ? flatten(it, indent + '  ') : lines.push(`${indent}  — ${it}`)))
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
    case 'cat':
      return rest ? catSection(rest) : ['usage: cat <section>']
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
      return ['zsh: permission denied — you are not in the sudoers file. this incident will be reported.']
    case 'uname':
      return ['raphaelm Darwin 1.0.0 — React / Vite / GitHub Pages']
    case 'man':
      return rest ? [`man: no manual entry for ${rest}`, '  have you tried: help'] : ['usage: man <command>']
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
