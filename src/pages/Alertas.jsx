import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, AlertCircle, Info, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import API from '../api/client'
import Button from '../Components/ui/Button'
import Modal from '../Components/ui/Modal'
import Badge from '../Components/ui/Badge'
import { timeAgo, formatDate } from '../utils/formatters'

const PAGE_SIZE = 10

// ── Severity config ───────────────────────────────────────────────────────────
const SEV = {
  CRITICAL: { border: 'border-red-400',   Icon: AlertTriangle, iconColor: 'text-red-500',   badge: 'danger',   label: 'Crítica'      },
  CRITICO:  { border: 'border-red-400',   Icon: AlertTriangle, iconColor: 'text-red-500',   badge: 'danger',   label: 'Crítica'      },
  WARNING:  { border: 'border-amber-400', Icon: AlertCircle,   iconColor: 'text-amber-500', badge: 'warning',  label: 'Advertencia'  },
  INFO:     { border: 'border-blue-400',  Icon: Info,          iconColor: 'text-blue-500',  badge: 'info',     label: 'Informativa'  },
}

const SEV_FILTER_PILLS = [
  { label: 'Todas',        value: '' },
  { label: 'Críticas',     value: 'CRITICAL' },
  { label: 'Advertencias', value: 'WARNING' },
  { label: 'Informativas', value: 'INFO' },
]

const STATUS_OPTIONS = [
  { label: 'Todas',        value: '' },
  { label: 'No leídas',    value: 'unread' },
  { label: 'Reconocidas',  value: 'acknowledged' },
]

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 border-l-4 border-l-gray-200 rounded-xl shadow-card p-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-5 h-5 rounded bg-gray-200 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="h-3 bg-gray-100 rounded w-72" />
          <div className="h-3 bg-gray-100 rounded w-40" />
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <div className="h-8 w-28 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// ── Alert card ────────────────────────────────────────────────────────────────
function AlertCard({ alert, onRead, onAcknowledge }) {
  const sev = (alert.severity || alert.nivel_alerta || 'INFO').toUpperCase()
  const { border, Icon, iconColor, badge } = SEV[sev] ?? SEV.INFO
  const caseId = alert.case_id || alert.id_caso || alert.paciente_id

  return (
    <div className={`bg-white border border-gray-100 border-l-4 ${border} rounded-xl shadow-card p-4 animate-fade-in`}>
      <div className="flex items-start gap-4">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm">
            {alert.title || alert.mensaje || alert.message}
          </p>
          {alert.description && (
            <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{alert.description}</p>
          )}

          {/* Metadata row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {alert.dias_restantes != null && (
              <Badge variant={badge} size="sm">
                Faltan {alert.dias_restantes} días
              </Badge>
            )}
            {caseId && (
              <span className="text-xs font-medium text-brand-600">{caseId}</span>
            )}
            <span className="text-xs text-gray-400">
              {timeAgo(alert.created_at || alert.timestamp)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0 items-end">
          {!alert.is_read && (
            <Button variant="ghost" size="sm" onClick={() => onRead(alert.id)}>
              Marcar como leída
            </Button>
          )}
          {alert.is_read && !alert.acknowledged_at && (
            <Button variant="secondary" size="sm" onClick={() => onAcknowledge(alert)}>
              Reconocer
            </Button>
          )}
          {alert.acknowledged_at && (
            <span className="text-xs text-emerald-600 font-medium text-right leading-snug">
              Reconocida por {alert.acknowledged_by ?? 'usuario'}<br />
              el {formatDate(alert.acknowledged_at)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Alertas() {
  const userName = (() => {
    try { return JSON.parse(localStorage.getItem('user'))?.nombre ?? 'usted' } catch { return 'usted' }
  })()

  const [alerts, setAlerts]         = useState([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(1)
  const [sevFilter, setSevFilter]   = useState('')
  const [statusFilter, setStatus]   = useState('')

  // Acknowledge modal
  const [toAck, setToAck]           = useState(null)
  const [acking, setAcking]         = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE })
      if (sevFilter)    params.set('severity', sevFilter)
      if (statusFilter) params.set('status', statusFilter)
      const { data } = await API.get(`/api/v1/alerts?${params}`)
      setAlerts(data.alerts ?? data ?? [])
      setTotal(data.total ?? 0)
    } catch {
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }, [page, sevFilter, statusFilter])

  useEffect(() => { fetch() }, [fetch])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [sevFilter, statusFilter])

  const handleRead = async (id) => {
    await API.post(`/api/v1/alerts/${id}/read`).catch(() => {})
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a))
  }

  const handleConfirmAck = async () => {
    if (!toAck) return
    setAcking(true)
    try {
      await API.post(`/api/v1/alerts/${toAck.id}/acknowledge`)
      setAlerts(prev => prev.map(a =>
        a.id === toAck.id
          ? { ...a, acknowledged_at: new Date().toISOString(), acknowledged_by: toAck._userName }
          : a
      ))
      setToAck(null)
    } catch {
    } finally {
      setAcking(false)
    }
  }

  const pendingCount = alerts.filter(a => !a.acknowledged_at).length
  const totalPages   = Math.ceil(total / PAGE_SIZE)
  const startItem    = (page - 1) * PAGE_SIZE + 1
  const endItem      = Math.min(page * PAGE_SIZE, total)

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Alertas{' '}
          {pendingCount > 0 && (
            <span className="text-lg font-normal text-gray-400">({pendingCount} pendientes)</span>
          )}
        </h1>

        {/* Filters */}
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          {/* Severity pills */}
          <div className="flex items-center gap-1.5">
            {SEV_FILTER_PILLS.map(p => (
              <button
                key={p.value}
                onClick={() => setSevFilter(p.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  sevFilter === p.value
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Status select */}
          <select
            value={statusFilter}
            onChange={e => setStatus(e.target.value)}
            className="h-8 pl-3 pr-8 text-xs bg-white border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-gray-700 cursor-pointer"
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading && Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)}

        {!loading && alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mb-4" />
            <p className="text-lg font-semibold text-gray-700">Sin alertas pendientes</p>
            <p className="text-sm text-gray-400 mt-1">Todo está en orden</p>
          </div>
        )}

        {!loading && alerts.map(a => (
          <AlertCard
            key={a.id}
            alert={a}
            onRead={handleRead}
            onAcknowledge={(alert) => setToAck({ ...alert, _userName: userName })}
          />
        ))}
      </div>

      {/* Pagination */}
      {!loading && total > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            Mostrando {startItem}–{endItem} de {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-white border
                border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <span className="text-sm text-gray-500">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-white border
                border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Acknowledge confirmation modal */}
      <Modal
        isOpen={!!toAck}
        onClose={() => setToAck(null)}
        title="Confirmar reconocimiento"
        footer={
          <>
            <Button variant="secondary" onClick={() => setToAck(null)}>Cancelar</Button>
            <Button variant="primary" loading={acking} onClick={handleConfirmAck}>Confirmar</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600 leading-relaxed">
          Al reconocer esta alerta queda registrado que{' '}
          <span className="font-medium text-gray-900">{toAck?._userName ?? 'usted'}</span>{' '}
          tomó conocimiento el{' '}
          <span className="font-medium text-gray-900">{formatDate(new Date().toISOString())}</span>.
          Esta acción no se puede deshacer. ¿Confirmar?
        </p>
      </Modal>
    </div>
  )
}
