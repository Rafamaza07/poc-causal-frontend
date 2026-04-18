function SkeletonLine({ w = 'w-full', h = 'h-3' }) {
  return <div className={`${w} ${h} bg-gray-100 rounded-full animate-pulse`} />
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-card space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="w-10 h-10 bg-gray-100 rounded-lg" />
        <div className="w-12 h-4 bg-gray-100 rounded-full" />
      </div>
      <div className="w-20 h-8 bg-gray-100 rounded-lg mt-4" />
      <SkeletonLine w="w-32" h="h-3" />
    </div>
  )
}

export function SkeletonChart({ height = 'h-64' }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-xl p-6 shadow-card animate-pulse ${height}`}>
      <SkeletonLine w="w-40" h="h-4" />
      <div className="mt-4 h-full flex items-end gap-3 pb-6">
        {[60, 80, 45, 90, 70, 55, 85, 65, 75, 50, 88, 72].map((h, i) => (
          <div key={i} className="flex-1 bg-gray-100 rounded-t-sm" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonTableRows({ rows = 5 }) {
  return (
    <div className="space-y-3 p-6 animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonLine w="w-24" />
          <SkeletonLine w="w-32" />
          <SkeletonLine w="w-20" />
          <SkeletonLine w="w-16" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonAlertItem() {
  return (
    <div className="flex items-start gap-3 p-4 animate-pulse">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-200 mt-1.5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonLine w="w-full" h="h-3" />
        <SkeletonLine w="w-3/4" h="h-2.5" />
      </div>
      <div className="w-14 h-5 bg-gray-100 rounded-full flex-shrink-0" />
    </div>
  )
}
