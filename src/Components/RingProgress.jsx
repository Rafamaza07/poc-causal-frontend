import { useEffect, useState } from 'react'

export default function RingProgress({
  value = 0,
  size = 72,
  strokeWidth = 7,
  color = '#3b76f6',
  trackColor,
  label,
  sublabel,
}) {
  const track = trackColor ?? `${color}20`
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setPct(Math.max(0, Math.min(100, value))), 60)
    return () => clearTimeout(t)
  }, [value])

  const dash = (pct / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size} height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <circle
            cx={size / 2} cy={size / 2} r={r}
            stroke={track} strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            stroke={color} strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circ}
            strokeDashoffset={circ - dash}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.65s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        {label != null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold leading-none" style={{ color }}>{label}</span>
            {sublabel && <span className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{sublabel}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
