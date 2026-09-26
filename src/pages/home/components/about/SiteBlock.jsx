import { PILL, SITE_TEXT } from './styles'

export default function SiteBlock({ description, stack, siteHeading, mobile }) {
  const body = (
    <>
      <p className={SITE_TEXT}>{description}</p>
      <div className="flex flex-wrap gap-1.25">
        {stack.map((s, i) => (
          <span key={i} className={PILL}>
            {s}
          </span>
        ))}
      </div>
    </>
  )

  if (mobile) return body

  return (
    <div className="flex flex-row gap-10 items-start">
      <div className="shrink-0 w-40">
        <div className="font-display text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-[1.2] text-accent mt-2 tracking-[-0.01em]">
          {siteHeading[0]}
          <br />
          {siteHeading[1]}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">{body}</div>
    </div>
  )
}
