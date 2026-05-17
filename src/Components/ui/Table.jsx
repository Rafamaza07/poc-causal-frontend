/**
 * Table — columnas configurables, sort indicador, skeleton rows (UI-7).
 *
 * Props:
 *   columns: Array<{ key, label, sortable?, render?(value, row) => node, className? }>
 *   data: Array<object>
 *   loading?: boolean
 *   skeletonRows?: number
 *   sortBy?: string
 *   sortDir?: 'asc' | 'desc'
 *   onSort?: (key) => void
 *   onRowClick?: (row) => void
 *   emptyText?: string
 */

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

export default function Table({
  columns = [],
  data = [],
  loading = false,
  skeletonRows = 5,
  sortBy,
  sortDir = 'asc',
  onSort,
  onRowClick,
  emptyText = 'Sin datos para mostrar',
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/80 border-b border-gray-200">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                scope="col"
                className={[
                  'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide select-none',
                  col.sortable && onSort ? 'cursor-pointer hover:text-gray-700' : '',
                  col.className || '',
                ].join(' ')}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && onSort && (
                    sortBy === col.key ? (
                      sortDir === 'asc'
                        ? <ChevronUp className="w-3 h-3 text-violet-600" />
                        : <ChevronDown className="w-3 h-3 text-violet-600" />
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 text-gray-300" />
                    )
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            // Skeleton rows
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-gray-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id ?? i}
                onClick={() => onRowClick && onRowClick(row)}
                className={[
                  'transition-colors duration-100',
                  onRowClick ? 'cursor-pointer hover:bg-violet-50/40' : '',
                ].join(' ')}
              >
                {columns.map(col => (
                  <td key={col.key} className={`px-4 py-3 text-gray-800 ${col.className || ''}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
