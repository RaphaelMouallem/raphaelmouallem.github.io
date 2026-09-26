import { PILL } from './styles'

export default function SkillsBlock({ skills }) {
  return (
    <div className="pt-[1em] flex flex-col gap-3.5">
      {Object.entries(skills).map(([group, items]) => (
        <div key={group} className="flex flex-col gap-1.5">
          <span className="font-body text-[0.65rem] tracking-[0.14em] uppercase text-accent">{group}</span>
          <div className="flex flex-wrap gap-1.25">
            {items.map((item, i) => (
              <span key={i} className={PILL}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
