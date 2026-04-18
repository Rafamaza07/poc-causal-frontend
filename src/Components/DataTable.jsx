import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import EmptyState from './EmptyState'

export default function DataTable({
  columns,
  data = [],
  onRowClick,
  emptyIcon,
  emptyTitle = 'Sin registros',
  emptyDescription = '',
  className = '',
}) {
  const [sortKey, setSortKey]   = useState(null)
  const [sortDir, setSortDir]   = useState('asc')

  const handleSort = (key) => {
    if (!key) return
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const av = a[sortKey] ?? ''
    const bv = b[sortKey] ?? ''
    const cmp = String(av).localeCompare(String(bv), 'es', { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  return (
    <div className={`overflow-hidden ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                className={`text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide select-none ${
                  col.sortable !== false ? 'cursor-pointer hover:text-gray-800 transition-colors' : ''
                } ${col.className || ''}`}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable !== false && (
                    sortKey === col.key
                      ? sortDir === 'asc'
                        ? <ChevronUp className="w-3 h-3 text-brand-600" />
                        : <ChevronDown className="w-3 h-3 text-brand-600" />
                      : <ChevronsUpDown className="w-3 h-3 text-gray-300" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-gray-50 last:border-0 transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer hover:bg-gray-50/80' : ''
                }`}
              >
                {columns.map(col => (
                  <td key={col.key} className={`py-3.5 px-4 ${col.cellClassName || ''}`}>
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
