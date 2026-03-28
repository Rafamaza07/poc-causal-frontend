/**
 * Gauge — semicírculo animado de riesgo.
 * score: 0-100
 */
export default function Gauge({ score }) {
  const pct   = Math.min(Math.max(score ?? 0, 0), 100) / 100
  const cx    = 100, cy = 100, r = 76
  const endX  = cx + r * Math.cos(Math.PI - pct * Math.PI)
  const endY  = cy - r * Math.sin(Math.PI - pct * Math.PI)
  const large = pct > 0.5 ? 1 : 0

  const color =
    score >= 75 ? '#ef4444' :
    score >= 50 ? '#f97316' :
    score >= 25 ? '#f59e0b' : '#22c55e'

  const nivel =
    score >= 75 ? 'CRÍTICO' :
    score >= 50 ? 'ALTO'    :
    score >= 25 ? 'MODERADO': 'BAJO'

  const nivelColor =
    score >= 75 ? 'text-red-600'    :
    score >= 50 ? 'text-orange-500' :
    score >= 25 ? 'text-amber-500'  : 'text-green-600'

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-full max-w-[220px]">
        {/* pista fondo */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none" stroke="#e5e7eb" strokeWidth="15" strokeLinecap="round" />
        {/* arco de progreso */}
        {pct > 0 && (
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${large} 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`}
                fill="none" stroke={color} strokeWidth="15" strokeLinecap="round"
                style={{ transition: 'all 0.6s ease' }} />
        )}
        {/* score */}
        <text x="100" y="87" textAnchor="middle" fontSize="30" fontWeight="bold" fill="#111827">
          {score}
        </text>
        <text x="100" y="103" textAnchor="middle" fontSize="8.5" fill="#6b7280" letterSpacing="1">
          SCORE / 100
        </text>
        {/* etiquetas min/max */}
        <text x={cx - r} y="116" textAnchor="middle" fontSize="8" fill="#9ca3af">0</text>
        <text x={cx + r} y="116" textAnchor="middle" fontSize="8" fill="#9ca3af">100</text>
      </svg>
      <span className={`text-xs font-bold tracking-widest mt-0.5 ${nivelColor}`}>{nivel}</span>
    </div>
  )
}
