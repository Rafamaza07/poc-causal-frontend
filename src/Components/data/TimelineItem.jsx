import ScoreBadge from './ScoreBadge'
import { formatDate } from '../../utils/formatters'

export default function TimelineItem({ item, isLast = false }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-brand-500 mt-1 ring-4 ring-brand-50" />
        {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1" />}
      </div>
      <div className="pb-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {item.score != null && <ScoreBadge score={item.score} size="sm" />}
          <span className="text-xs text-gray-400">
            {item.fecha ? formatDate(item.fecha) : '—'}
          </span>
        </div>
        {item.notas && (
          <p className="text-sm text-gray-600 mt-1">{item.notas}</p>
        )}
        {item.recomendacion && (
          <p className="text-xs text-gray-500 mt-0.5">{item.recomendacion}</p>
        )}
      </div>
    </div>
  )
}
