export const PROMPT = 'raphaelm ~ %'

export const BOOT_LINES = [
  { text: `Last login: ${new Date().toDateString()} on ttys001`, t: 'faint' },
  { text: '', t: 'gap' },
  { text: `${PROMPT} contact --init`, t: 'ink' },
  { text: '', t: 'gap' },
  { text: '  This will ask for 3 things:', t: 'ink' },
  { text: '  -- your name', t: 'ink' },
  { text: '  -- your message', t: 'ink' },
  { text: '  -- your email (so i can write back)', t: 'ink' },
  { text: '', t: 'gap' },
]
