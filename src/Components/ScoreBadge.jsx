function scoreStyle(score) {
  if (score >= 75) return 'bg-red-100 text-red-700 border-red-200'
  if (score >= 50) return 'bg-orange-100 text-orange-700 border-orange-200'
  if (score >= 25) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
  return 'bg-green-100 text-green-700 border-green-200'
}

export default function ScoreBadge({ score }) {
  const s = Number(score) || 0
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold tabular-nums border ${scoreStyle(s)}`}>
      {s}
    </span>
  )
}
