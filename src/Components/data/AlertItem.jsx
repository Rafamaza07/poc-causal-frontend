import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react'
import { timeAgo } from '../../utils/formatters'

const SEVERITY_STYLES = {
  CRÍTICO:  { bg: 'bg-red-50',    border: 'border-red-100',   text: 'text-red-600',    Icon: AlertTriangle },
  CRITICO:  { bg: 'bg-red-50',    border: 'border-red-100',   text: 'text-red-600',    Icon: AlertTriangle },
  CRITICAL: { bg: 'bg-red-50',    border: 'border-red-100',   text: 'text-red-600',    Icon: AlertTriangle },
  WARNING:  { bg: 'bg-amber-50',  border: 'border-amber-100', text: 'text-amber-600',  Icon: AlertCircle },
  ALTO:     { bg: 'bg-orange-50', border: 'border-orange-100',text: 'text-orange-600', Icon: AlertCircle },
  INFO:     { bg: 'bg-blue-50',   border: 'border-blue-100',  text: 'text-blue-600',   Icon: Info },
  SUCCESS:  { bg: 'bg-emerald-50',border: 'border-emerald-100',text:'text-emerald-600',Icon: CheckCircle },
}

export default function AlertItem({ alert, onAcknowledge }) {
  const key = (alert.severity || alert.nivel_alerta || 'INFO').toUpperCase()
  const { bg, border, text, Icon } = SEVERITY_STYLES[key] || SEVERITY_STYLES.INFO

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${bg} ${border} animate-slide-up`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${text}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {alert.mensaje || alert.message || alert.title}
        </p>
        {(alert.paciente_id || alert.case_id) && (
          <p className="text-xs text-gray-500 mt-0.5">
            Caso: {alert.paciente_id || alert.case_id}
          </p>
        )}
        {(alert.created_at || alert.timestamp) && (
          <p className="text-xs text-gray-400 mt-0.5">
            {timeAgo(alert.created_at || alert.timestamp)}
          </p>
        )}
      </div>
      {onAcknowledge && (
        <button
          onClick={() => onAcknowledge(alert.id)}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
