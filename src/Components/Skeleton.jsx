/** Bloque genérico */
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
}

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

// ── Portal skeletons ────────────────────────────────────────────────────────

export function SkeletonPortalDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-40 bg-gray-100 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded-lg" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-5">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 bg-gray-100 rounded-lg" />
          <div className="h-4 w-48 bg-gray-100 rounded-lg" />
          <div className="h-4 w-56 bg-gray-100 rounded-lg" />
          <div className="h-4 w-24 bg-gray-100 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
            <div className="h-3 w-16 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
          <div className="w-4 h-4 bg-amber-100 rounded-full flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-48 bg-amber-100 rounded-lg" />
            <div className="h-3 w-64 bg-amber-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonCaseList({ count = 4 }) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="space-y-1 mb-2">
        <div className="h-7 w-32 bg-gray-100 rounded-lg" />
        <div className="h-4 w-56 bg-gray-100 rounded-lg" />
      </div>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="h-4 w-24 bg-gray-100 rounded-lg" />
              <div className="h-3 w-36 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full" />
            <div className="w-8 h-3 bg-gray-100 rounded-lg" />
          </div>
          <div className="h-3 w-48 bg-gray-100 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCaseDetail() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-28 bg-gray-100 rounded-lg" />
        <div className="h-7 w-36 bg-gray-100 rounded-lg" />
        <div className="h-4 w-48 bg-gray-100 rounded-lg" />
      </div>
      <div className="rounded-2xl border border-gray-100 p-5 flex items-center gap-5 bg-gray-50">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-24 bg-gray-200 rounded-lg" />
          <div className="h-4 w-48 bg-gray-200 rounded-lg" />
          <div className="h-3 w-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-10 bg-gray-50" />
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-4 space-y-1.5">
              <div className="h-2.5 w-20 bg-gray-100 rounded-lg" />
              <div className="h-4 w-28 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="h-4 w-40 bg-gray-100 rounded-lg" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-5 h-5 bg-gray-100 rounded-full flex-shrink-0" />
            <div className="h-3 flex-1 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonAlertList({ count = 3 }) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="space-y-1 mb-2">
        <div className="h-7 w-32 bg-gray-100 rounded-lg" />
        <div className="h-4 w-56 bg-gray-100 rounded-lg" />
      </div>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 p-4 flex gap-3 bg-white">
          <div className="w-4 h-4 bg-gray-100 rounded-full flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-40 bg-gray-100 rounded-lg" />
              <div className="h-4 w-16 bg-gray-100 rounded-full" />
            </div>
            <div className="h-3 w-56 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonDocList({ count = 2 }) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="space-y-1 mb-2">
        <div className="h-7 w-36 bg-gray-100 rounded-lg" />
        <div className="h-4 w-56 bg-gray-100 rounded-lg" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="h-4 w-40 bg-gray-100 rounded-lg" />
        <div className="h-3 w-64 bg-gray-100 rounded-lg" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <div className="h-4 w-28 bg-gray-100 rounded-lg" />
            <div className="flex gap-2">
              <div className="h-7 w-16 bg-gray-100 rounded-lg" />
              <div className="h-7 w-12 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex gap-3">
            <div className="w-2 h-2 bg-gray-100 rounded-full mt-1.5 flex-shrink-0" />
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <div className="h-4 w-28 bg-gray-100 rounded-full" />
                <div className="h-4 w-16 bg-gray-100 rounded-full" />
              </div>
              <div className="h-3 w-40 bg-gray-100 rounded-lg" />
            </div>
          </div>
          <div className="h-3 w-16 bg-gray-100 rounded-lg" />
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
