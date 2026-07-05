export const ACCENT = ['#ff6ec7', '#ff9900', '#00ffe1', '#bf5fff']
export const ac = (i) => ACCENT[i % ACCENT.length]

export const theme = {
  fontFamily: "'DM Mono', 'Courier New', monospace",
  googleFont: 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap',
  ACCENT,
  ac,
}
