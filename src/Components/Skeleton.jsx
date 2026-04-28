/** Tarjeta de carga animada */
export function SkeletonCard({ rows = 2 }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse space-y-3">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
      ))}
    </div>
  )
}

/** Fila de tabla de carga animada */
export function SkeletonTable({ rows = 6 }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-4 py-3 border-b border-gray-50 dark:border-gray-800/60 flex gap-6 items-center">
          <div className="h-3.5 bg-gray-100 dark:bg-gray-700/60 rounded w-28" />
          <div className="h-3.5 bg-gray-100 dark:bg-gray-700/60 rounded w-20" />
          <div className="h-3.5 bg-gray-100 dark:bg-gray-700/60 rounded w-36" />
          <div className="h-3.5 bg-gray-100 dark:bg-gray-700/60 rounded w-14" />
          <div className="h-5 bg-gray-100 dark:bg-gray-700/60 rounded-full w-16" />
        </div>
      ))}
    </div>
  )
}

/** Tarjeta de resumen de caso (para ResumenCasos) */
export function SkeletonResumenCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden animate-pulse">
      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700" />
            <div className="space-y-1.5">
              <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              <div className="h-2.5 bg-gray-100 dark:bg-gray-700/60 rounded w-20" />
            </div>
          </div>
          <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded-full w-20" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 bg-gray-50 dark:bg-gray-800 rounded-lg" />
          <div className="h-12 bg-gray-50 dark:bg-gray-800 rounded-lg" />
        </div>
        <div className="h-8 bg-gray-100 dark:bg-gray-700/60 rounded-lg" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  )
}
