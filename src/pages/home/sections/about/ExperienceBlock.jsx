import { EDU_PERIOD, EDU_DEGREE, TIMELINE_DOT, hAlignClass } from './styles'

export default function ExperienceBlock({ experience, mobile }) {
  if (mobile) {
    return (
      <div className="flex flex-col pt-[1em]">
        {experience.map((e, i) => (
          <div key={i} className="flex flex-row gap-4">
            <div className="flex flex-col items-center shrink-0 w-3">
              <div className={`${TIMELINE_DOT} shrink-0 mt-1`} />
              {i < experience.length - 1 && <div className="w-px flex-1 bg-accent opacity-20 my-1" />}
            </div>
            <div className="flex flex-col gap-0.5 pb-5">
              <span className={EDU_PERIOD}>{e.period}</span>
              <span className={EDU_DEGREE}>{e.role}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const last = experience.length - 1
  return (
    <div className="pt-[0.5em]">
      <div className="relative flex justify-between items-center h-2">
        <div className="absolute left-1 right-1 top-1/2 h-px bg-accent opacity-20 -translate-y-1/2" />
        {experience.map((_, i) => (
          <div key={i} className={`${TIMELINE_DOT} relative z-1`} />
        ))}
      </div>
      <div className="flex justify-between mt-2.5 gap-3">
        {experience.map((e, i) => (
          <div key={i} className={`flex flex-col gap-0.5 max-w-[45%] ${hAlignClass(i, last)}`}>
            <span className={EDU_PERIOD}>{e.period}</span>
            <span className={EDU_DEGREE}>{e.role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
