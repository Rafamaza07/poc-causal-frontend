/** Tarjeta de carga animada */
export function SkeletonCard({ rows = 2 }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-7 bg-gray-200 rounded w-1/2" />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-2.5 bg-gray-100 rounded w-2/3" />
      ))}
    </div>
  )
}

/** Fila de tabla de carga animada */
export function SkeletonTable({ rows = 6 }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="h-3.5 bg-gray-200 rounded w-1/4" />
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-4 py-3 border-b border-gray-50 flex gap-6 items-center">
          <div className="h-3.5 bg-gray-100 rounded w-28" />
          <div className="h-3.5 bg-gray-100 rounded w-20" />
          <div className="h-3.5 bg-gray-100 rounded w-36" />
          <div className="h-3.5 bg-gray-100 rounded w-14" />
          <div className="h-5 bg-gray-100 rounded-full w-16" />
        </div>
      ))}
    </div>
  )
}
