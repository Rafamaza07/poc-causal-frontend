import { useEffect, useRef, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

function useCountUp(target, duration = 700) {
  const num = parseFloat(String(target).replace(/[^0-9.]/g, ''))
  const isNum = !isNaN(num) && String(target).trim() !== ''
  const [displayed, setDisplayed] = useState(isNum ? 0 : target)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!isNum) { setDisplayed(target); return }
    const start = performance.now()
    const tick = (now) => {
      const pct = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 4)
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
  iconBg = 'icon-gradient-blue',
  iconColor = 'text-blue-600',
  valueColor = 'text-gray-900 dark:text-white',
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
        'relative bg-white dark:bg-gray-900 overflow-hidden',
        'border rounded-2xl transition-all duration-300',
        'hover:shadow-elevated hover:-translate-y-1 animate-slide-up',
        critical
          ? 'border-red-200 dark:border-red-900 shadow-sm shadow-red-100 dark:shadow-red-900/20'
          : 'border-gray-100 dark:border-gray-800 shadow-sm hover:border-gray-200',
      ].join(' ')}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(59,118,246,0.04) 0%, transparent 60%)' }}
      />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          {change && (
            <span
              className={[
                'flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg',
                isPositive
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : isNegative
                    ? 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500',
              ].join(' ')}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : null}
              {change}
            </span>
          )}
        </div>

        <div className={[
          'text-[34px] font-extrabold leading-none tabular-nums tracking-tight',
          critical && Number(value) > 0 ? 'text-red-600 dark:text-red-400' : valueColor,
        ].join(' ')}>
          {animated}
        </div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1.5">{label}</div>
        {changeLabel && <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{changeLabel}</div>}
      </div>

      {sparklineData?.length > 1 && (
        <div className="h-14 -mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={sparklineColor}
                fill={`url(#spark-${label})`}
                strokeWidth={2}
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
