import { getScoreRange } from '../../utils/constants'

const SIZE = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
}

export default function ScoreBadge({ score, size = 'md' }) {
  const range = getScoreRange(score ?? 0)
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${range.bg} ${range.text} ${SIZE[size]}`}>
      {Math.round(score ?? 0)}
    </span>
  )
}
