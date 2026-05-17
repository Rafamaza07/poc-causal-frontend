import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, RefreshCw, ChevronRight, FileCheck, Eye, AlertCircle } from 'lucide-react'
import API from '../../api/client'
import { SkeletonTable } from '../../Components/Skeleton'
import { timeAgo } from '../../utils/formatters'

// ── Widget Governance (UI-5) ─────────────────────────────────────────────────
// Datos mock con indicador visual (sin nueva DB)
const GOVERNANCE_MOCK = [
  { label: 'Consentimientos pendientes', value: 3,  icon: FileCheck, tone: 'amber',  hint: 'mock' },
  { label: 'Accesos sensibles hoy',      value: 12, icon: Eye,       tone: 'violet', hint: 'mock' },
  { label: 'Incidentes abiertos',        value: 1,  icon: AlertCircle, tone: 'red',  hint: 'mock' },
]

const TONE_STYLES = {
  amber:  { card: 'bg-amber-50 border-amber-200',   value: 'text-amber-700',  label: 'text-amber-600'  },
  violet: { card: 'bg-violet-50 border-violet-200', value: 'text-violet-700', label: 'text-violet-600' },
  red:    { card: 'bg-red-50 border-red-200',       value: 'text-red-700',    label: 'text-red-600'    },
}

function GovernanceWidget() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Governance</h3>
        <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
          datos indicativos
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {GOVERNANCE_MOCK.map(({ label, value, icon: Icon, tone }) => {
          const s = TONE_STYLES[tone]
          return (
            <div key={label} className={`rounded-xl border ${s.card} p-3 text-center space-y-1`}>
              <Icon className={`w-4 h-4 mx-auto ${s.value}`} />
              <p className={`text-2xl font-bold ${s.value}`}>{value}</p>
              <p className={`text-[10px] font-medium leading-tight ${s.label}`}>{label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ROL_LABEL = {
  medico:     'Médico',
  empresa:    'Empresa',
  legal:      'Legal',
  admin:      'Admin',
  superadmin: 'Superadmin',
}

const ROL_COLOR = {
  medico:     'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  empresa:    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  legal:      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  admin:      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  superadmin: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
}

export default function AdminAlertasPendientes() {
  const [rows, setRows]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const navigate = useNavigate()

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    API.get('/api/admin/alertas-pendientes')
      .then(r => setRows(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError('No se pudieron cargar las alertas pendientes.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const totalCritical = rows.reduce((s, r) => s + (r.count_critical || 0), 0)
  const totalWarning  = rows.reduce((s, r) => s + (r.count_warning  || 0), 0)

  return (
    <div className="space-y-6">
      {/* Governance widget (UI-5) */}
      <GovernanceWidget />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Alertas pendientes por usuario
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vista admin — alertas no reconocidas agrupadas por usuario del tenant
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Resumen de totales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{totalCritical}</div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1">
            CRITICAL pendientes
          </div>
        </div>
        <div className="card p-4">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{totalWarning}</div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1">
            WARNING pendientes
          </div>
        </div>
        <div className="card p-4">
          <div className="text-3xl font-bold text-gray-700 dark:text-gray-200">{rows.length}</div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1">
            Usuarios con alertas
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <SkeletonTable rows={6} />
      ) : rows.length === 0 ? (
        <div className="card p-12 text-center">
          <ShieldAlert className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No hay alertas pendientes en el tenant
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['Usuario', 'Rol', 'CRITICAL', 'WARNING', 'Última alerta', ''].map(h => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.map(row => (
                <tr
                  key={row.user_id}
                  onClick={() => navigate('/alertas')}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                      {row.nombre}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ROL_COLOR[row.rol] || ROL_COLOR.admin}`}>
                      {ROL_LABEL[row.rol] || row.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.count_critical > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400">
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        {row.count_critical}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.count_warning > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                        {row.count_warning}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {row.ultima_alerta ? timeAgo(row.ultima_alerta) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
