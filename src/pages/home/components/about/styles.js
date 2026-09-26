export const PILL =
  'font-body text-[0.82rem] text-ink-soft bg-paper border border-border rounded-[2px] px-2.5 py-[3px]'
export const EDU_PERIOD = 'font-body text-[0.75rem] text-accent tracking-[0.06em]'
export const EDU_DEGREE = 'font-body text-[0.92rem] text-ink leading-[1.4]'
export const SITE_TEXT = 'font-body text-[0.95rem] leading-[1.75] text-ink-soft m-0'
export const TIMELINE_DOT = 'w-2 h-2 rounded-full border-[1.5px] border-accent bg-paper-soft'

export const hAlignClass = (i, last) =>
  i === 0 ? 'items-start text-left' : i === last ? 'items-end text-right' : 'items-center text-center'
