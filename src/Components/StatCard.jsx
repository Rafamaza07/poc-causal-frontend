import { TrendingUp, TrendingDown } from 'lucide-react'

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
}) {
  const isPositive = change?.startsWith('+')
  const isNegative = change?.startsWith('-')

  return (
    <div
      className={`bg-white border rounded-xl p-6 shadow-card hover:shadow-soft transition-all duration-200 animate-slide-up ${
        critical ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100'
      }`}
    >
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
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : isNegative ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
            {change}
          </span>
        )}
      </div>

      <div className={`text-[32px] font-bold leading-none mt-4 ${critical && Number(value) > 0 ? 'text-red-600' : valueColor}`}>
        {value}
      </div>
      <div className="text-sm font-normal text-gray-500 mt-1.5">{label}</div>
      {changeLabel && <div className="text-xs text-gray-400 mt-0.5">{changeLabel}</div>}
    </div>
  )
}
