const STYLES = {
  CRÍTICO:  'bg-red-100 text-red-700 border-red-200',
  CRITICAL: 'bg-red-100 text-red-700 border-red-200',
  ALTO:     'bg-orange-100 text-orange-700 border-orange-200',
  HIGH:     'bg-orange-100 text-orange-700 border-orange-200',
  MODERADO: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  MEDIUM:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  BAJO:     'bg-green-100 text-green-700 border-green-200',
  LOW:      'bg-green-100 text-green-700 border-green-200',
}
const LABELS = { CRITICAL: 'CRÍTICO', HIGH: 'ALTO', MEDIUM: 'MODERADO', LOW: 'BAJO' }

export default function SeverityTag({ severity }) {
  const label = LABELS[severity] || severity
  const style = STYLES[severity] || 'bg-gray-100 text-gray-700 border-gray-200'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      {label}
    </span>
  )
}
