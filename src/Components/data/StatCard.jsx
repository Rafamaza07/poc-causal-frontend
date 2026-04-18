import { useEffect, useRef, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    const num = parseFloat(target)
    if (isNaN(num)) { setValue(target); return }

    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(num * ease))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  critical = false,
  iconBg,
  iconColor,
  change,
  changeLabel,
  valueColor,
}) {
  const animated = useCountUp(value)
  const displayValue = isNaN(parseFloat(value)) ? value : animated

  const COLOR_MAP = {
    blue:   { bg: 'bg-blue-100',    icon: 'text-blue-600' },
    emerald:{ bg: 'bg-emerald-100', icon: 'text-emerald-600' },
    red:    { bg: 'bg-red-100',     icon: 'text-red-600' },
    amber:  { bg: 'bg-amber-100',   icon: 'text-amber-600' },
    orange: { bg: 'bg-orange-100',  icon: 'text-orange-600' },
  }
  const colors = COLOR_MAP[color] || COLOR_MAP.blue
  const bgClass   = iconBg    || colors.bg
  const iconClass = iconColor || colors.icon

  const trendUp   = trend?.direction === 'up'   || change?.startsWith('+')
  const trendDown = trend?.direction === 'down'  || change?.startsWith('-')
  const trendVal  = trend?.value || change

  return (
    <div className={[
      'bg-white border rounded-xl p-6 shadow-card hover:shadow-soft transition-all duration-200 animate-slide-up',
      critical ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100',
    ].join(' ')}>
      <div className="flex items-start justify-between">
        {Icon && (
          <div className={`w-10 h-10 ${bgClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${iconClass}`} />
          </div>
        )}
        {trendVal && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${
            trendUp ? 'text-green-600' : trendDown ? 'text-red-500' : 'text-gray-400'
          }`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : trendDown ? <TrendingDown className="w-3 h-3" /> : null}
            {trendVal}
          </span>
        )}
      </div>
      <div className={`text-[32px] font-bold leading-none mt-4 ${
        critical && Number(value) > 0 ? 'text-red-600' : (valueColor || 'text-gray-900')
      }`}>
        {displayValue}
      </div>
      <div className="text-sm font-normal text-gray-500 mt-1.5">{label}</div>
      {changeLabel && <div className="text-xs text-gray-400 mt-0.5">{changeLabel}</div>}
    </div>
  )
}
