import { useEffect, useRef, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

function useCountUp(target, duration = 600) {
  const num = parseFloat(String(target).replace(/[^0-9.]/g, ''))
  const isNum = !isNaN(num) && String(target).trim() !== ''
  const [displayed, setDisplayed] = useState(isNum ? 0 : target)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!isNum) { setDisplayed(target); return }
    const start = performance.now()
    const tick = (now) => {
      const pct = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 3)
      const current = Math.round(eased * num)
      setDisplayed(String(target).replace(/\d+(\.\d+)?/, current))
      if (pct < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target])

  return displayed
}

export default function StatCard({
  value,
  label,
  icon: Icon,
  iconBg = 'bg-blue-100',
  iconColor = 'text-blue-600',
  valueColor = 'text-gray-900',
  change,
  changeLabel,
  critical = false,
  sparklineData,
  sparklineColor = '#3b76f6',
}) {
  const isPositive = change?.startsWith('+')
  const isNegative = change?.startsWith('-')
  const animated = useCountUp(value)

  return (
    <div
      className={[
        'bg-gradient-to-br from-white to-gray-50/60 dark:from-gray-900 dark:to-gray-800/50',
        'border rounded-xl shadow-card hover:shadow-lifted hover:-translate-y-0.5',
        'transition-all duration-200 animate-slide-up overflow-hidden',
        critical ? 'border-red-200 ring-1 ring-red-100 dark:border-red-900 dark:ring-red-900/40' : 'border-gray-100 dark:border-gray-800',
      ].join(' ')}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          {change && (
            <span
              className={`flex items-center gap-0.5 text-xs font-semibold ${
                isPositive ? 'text-green-600' : isNegative ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : null}
              {change}
            </span>
          )}
        </div>

        <div className={`text-[32px] font-bold leading-none mt-4 tabular-nums ${critical && Number(value) > 0 ? 'text-red-600' : valueColor}`}>
          {animated}
        </div>
        <div className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1.5">{label}</div>
        {changeLabel && <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{changeLabel}</div>}
      </div>

      {sparklineData?.length > 1 && (
        <div className="h-12 -mt-2 opacity-50">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sparklineColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={sparklineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={sparklineColor}
                fill={`url(#spark-grad-${label})`}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
