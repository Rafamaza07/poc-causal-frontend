const FEATURE_LABELS = {
  Edad:                  'Edad',
  Dias_Incapacidad:      'Días de incapacidad',
  PCL:                   '% PCL',
  Enfermedad_Laboral:    'Tipo (laboral)',
  En_Tratamiento:        'En tratamiento',
  Comorbilidades:        'Comorbilidades',
  Pronostico:            'Pronóstico',
  Requiere_Reubicacion:  'Requiere reubicación',
}

const BRAND   = '#2258db'
const BRAND_L = '#dbe6ff'
const MUTED   = '#9ca3af'
const MUTED_L = '#f3f4f6'

export default function CausalGraphView({ feature_cols = [], causal_parents = [] }) {
  const W = 600
  const H = Math.max(360, feature_cols.length * 48 + 40)
  const leftX = 150
  const rightX = 480
  const outcomeY = H / 2
  const parentSet = new Set(causal_parents)

  const nodes = feature_cols.map((f, i) => {
    const step = (H - 60) / Math.max(feature_cols.length - 1, 1)
    const y = 30 + i * step
    return { id: f, label: FEATURE_LABELS[f] || f, x: leftX, y, isCausal: parentSet.has(f) }
  })

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Grafo causal">
          <defs>
            <marker id="arrowCausal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill={BRAND} />
            </marker>
          </defs>

          {nodes.filter(n => n.isCausal).map(n => {
            const dx = rightX - n.x
            const cx1 = n.x + dx * 0.55
            const cx2 = rightX - dx * 0.25
            return (
              <path
                key={`edge-${n.id}`}
                d={`M ${n.x + 12} ${n.y} C ${cx1} ${n.y}, ${cx2} ${outcomeY}, ${rightX - 46} ${outcomeY}`}
                stroke={BRAND}
                strokeWidth="1.8"
                fill="none"
                opacity="0.7"
                markerEnd="url(#arrowCausal)"
              />
            )
          })}

          {nodes.map(n => (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r="9"
                fill={n.isCausal ? BRAND : MUTED_L}
                stroke={n.isCausal ? BRAND : MUTED}
                strokeWidth="1.5"
              />
              <text
                x={n.x - 16}
                y={n.y + 4}
                fontSize="12"
                textAnchor="end"
                fill={n.isCausal ? '#111827' : '#6b7280'}
                fontWeight={n.isCausal ? 600 : 400}
              >
                {n.label}
              </text>
            </g>
          ))}

          <g>
            <rect
              x={rightX - 44}
              y={outcomeY - 22}
              width="88"
              height="44"
              rx="10"
              fill={BRAND_L}
              stroke={BRAND}
              strokeWidth="1.8"
            />
            <text
              x={rightX}
              y={outcomeY - 2}
              fontSize="13"
              textAnchor="middle"
              fill={BRAND}
              fontWeight="700"
            >
              Outcome
            </text>
            <text
              x={rightX}
              y={outcomeY + 14}
              fontSize="10"
              textAnchor="middle"
              fill="#4b5563"
            >
              recomendación
            </text>
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: BRAND }} />
          Variable causal detectada por PC Algorithm
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full border" style={{ background: MUTED_L, borderColor: MUTED }} />
          Variable no causal
        </span>
      </div>
    </div>
  )
}
