import { useState } from 'react'
import { MILESTONES } from '../../utils/constants'
import { Check } from 'lucide-react'

const MAX_DAYS = MILESTONES[MILESTONES.length - 1].days

export default function MilestoneBar({ diasActuales = 0 }) {
  const [tooltip, setTooltip] = useState(null)
  const pct = (d) => Math.min((d / MAX_DAYS) * 100, 100)
  const currentPct = pct(diasActuales)

  return (
    <div className="relative w-full py-4">
      {/* Track */}
      <div className="relative h-3 bg-gray-100 rounded-full w-full">
        {/* Progress fill */}
        <div
          className="absolute left-0 top-0 h-full bg-brand-500 rounded-full transition-all duration-500"
          style={{ width: `${currentPct}%` }}
        />

        {/* Milestone markers */}
        {MILESTONES.map((m, i) => {
          const pos = pct(m.days)
          const passed = diasActuales >= m.days
          const isNext = !passed && (i === 0 || diasActuales >= MILESTONES[i - 1].days)

          return (
            <div
              key={m.days}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${pos}%` }}
              onMouseEnter={() => setTooltip(i)}
              onMouseLeave={() => setTooltip(null)}
            >
              <div className={[
                'w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold cursor-default',
                passed  ? 'bg-gray-400 border-gray-400 text-white' :
                isNext  ? 'bg-amber-400 border-amber-400 text-white animate-pulse' :
                          'bg-white border-gray-300 text-gray-400',
              ].join(' ')}>
                {passed ? <Check className="w-2.5 h-2.5" /> : i + 1}
              </div>

              {/* Tooltip */}
              {tooltip === i && (
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg pointer-events-none">
                  <div className="font-medium">{m.label}</div>
                  <div className="text-gray-300 text-[10px]">{m.decreto}</div>
                  <div className="text-gray-400 text-[10px]">Día {m.days}</div>
                </div>
              )}
            </div>
          )
        })}

        {/* Current position dot */}
        {diasActuales > 0 && diasActuales < MAX_DAYS && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-600 ring-4 ring-brand-100 transition-all duration-500"
            style={{ left: `${currentPct}%` }}
          />
        )}
      </div>

      {/* Labels below */}
      <div className="relative mt-5 h-9">
        {MILESTONES.map((m) => (
          <div
            key={m.days}
            className="absolute -translate-x-1/2 text-center"
            style={{ left: `${pct(m.days)}%` }}
          >
            <p className="text-[10px] text-gray-500 whitespace-nowrap">{m.label}</p>
            <p className="text-[9px] text-gray-400">d.{m.days}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
