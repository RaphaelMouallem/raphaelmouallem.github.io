import { EDU_PERIOD, EDU_DEGREE, TIMELINE_DOT } from './styles'

export default function EducationBlock({ education, spoken, langLabel }) {
  return (
    <>
      <div className="flex flex-col pt-[1em]">
        {education.map((e, i) => (
          <div key={i} className="flex flex-row gap-4">
            <div className="flex flex-col items-center shrink-0 w-3">
              <div className={`${TIMELINE_DOT} shrink-0 mt-1`} />
              {i < education.length - 1 && <div className="w-px flex-1 bg-accent opacity-20 my-1" />}
            </div>
            <div className="flex flex-col gap-0.5 pb-5">
              <span className={EDU_PERIOD}>{e.period}</span>
              <span className={EDU_DEGREE}>{e.degree}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="h-px bg-border mb-4" />
      <p className="font-body text-[0.68rem] tracking-[0.16em] uppercase text-ink-soft mb-4">{langLabel}</p>
      <div className="flex flex-col gap-1">
        {spoken.map((s, i) => {
          const [lang, ...rest] = s.split(' — ')
          return (
            <div key={i} className="flex gap-2 text-[0.88rem] leading-[1.6]">
              <span className="text-accent font-medium">{lang}</span>
              <span className="text-ink-soft">{rest.join(' — ')}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}
