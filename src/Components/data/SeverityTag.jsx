const MAP = {
  CRÍTICO:  'bg-red-50 text-red-700 border border-red-200',
  CRITICO:  'bg-red-50 text-red-700 border border-red-200',
  CRITICAL: 'bg-red-50 text-red-700 border border-red-200',
  ALTO:     'bg-orange-50 text-orange-700 border border-orange-200',
  HIGH:     'bg-orange-50 text-orange-700 border border-orange-200',
  MODERADO: 'bg-amber-50 text-amber-700 border border-amber-200',
  MEDIUM:   'bg-amber-50 text-amber-700 border border-amber-200',
  BAJO:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  LOW:      'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

const LABELS = {
  CRITICAL: 'CRÍTICO', HIGH: 'ALTO', MEDIUM: 'MODERADO', LOW: 'BAJO',
}

const SIZE = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
}

export default function SeverityTag({ severity, size = 'md' }) {
  const key = (severity ?? '').toUpperCase()
  const style = MAP[key] || 'bg-gray-100 text-gray-600'
  const label = LABELS[key] || key
  return (
    <span className={`inline-flex items-center font-semibold rounded-full tracking-wide ${style} ${SIZE[size]}`}>
      {label}
    </span>
  )
}
