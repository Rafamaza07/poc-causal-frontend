import ScoreBadge from './ScoreBadge'
import SeverityTag from './SeverityTag'
import { formatDate } from '../../utils/formatters'
import { ChevronRight } from 'lucide-react'

const RECOM_LABEL = {
  REINCORPORACION_INMEDIATA:    'Reincorporación',
  REINCORPORACION_CON_TERAPIAS: 'Con terapias',
  CONTINUAR_INCAPACIDAD:        'Continuar inc.',
  PENSION_INVALIDEZ:            'Pensión',
}

export default function CaseRow({ caso, onClick }) {
  return (
    <div
      onClick={() => onClick?.(caso)}
      className={`flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {caso.paciente_id || caso.id}
        </p>
        {caso.fecha_evaluacion && (
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDate(caso.fecha_evaluacion)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {caso.score != null && <ScoreBadge score={caso.score} />}
        {(caso.nivel_riesgo || caso.severity) && (
          <SeverityTag severity={caso.nivel_riesgo || caso.severity} />
        )}
        {caso.recomendacion && (
          <span className="text-xs text-gray-500 hidden sm:block">
            {RECOM_LABEL[caso.recomendacion] || caso.recomendacion}
          </span>
        )}
      </div>
      {onClick && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
    </div>
  )
}
