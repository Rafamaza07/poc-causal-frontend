import { useState, useEffect } from 'react'
import { Bell, Loader2, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react'
import API from '../../api/client'
import { normalizeAlerts } from '../../api/adapters'

const SEV_CFG = {
  urgente:    { cls: 'bg-red-50 border-red-200',    badge: 'bg-red-100 text-red-700',    icon: AlertCircle, iconCls: 'text-red-500' },
  importante: { cls: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: AlertCircle, iconCls: 'text-amber-500' },
  info:       { cls: 'bg-blue-50 border-blue-100',   badge: 'bg-blue-100 text-blue-700',   icon: Info,        iconCls: 'text-blue-400' },
}

export default function MisAlertas() {
  const [alertas,  setAlertas]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [marking,  setMarking]  = useState(null)

  useEffect(() => {
    API.get('/api/v1/cliente/mis-alertas')
      .then(r => setAlertas(normalizeAlerts(r.data)))
      .catch(() => setError('No se pudieron cargar las alertas.'))
      .finally(() => setLoading(false))
  }, [])

  const marcarLeida = async (id) => {
    setMarking(id)
    try {
      await API.post(`/api/v1/cliente/mis-alertas/${id}/leer`)
      setAlertas(prev => prev.map(a => a.id === id ? { ...a, leida: true } : a))
    } catch {
      // silently fail — UI stays coherent
    } finally {
      setMarking(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
    </div>
  )

  const pendientes = alertas.filter(a => !a.leida)
  const leidas     = alertas.filter(a => a.leida)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-500" /> Mis alertas
        </h1>
        <p className="text-gray-500 text-sm">Acciones importantes y recordatorios sobre tu caso.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {!loading && alertas.length === 0 && !error && (
        <div className="text-center py-16">
          <CheckCircle className="w-10 h-10 text-emerald-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No tienes alertas pendientes. ¡Todo al día!</p>
        </div>
      )}

      {pendientes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Pendientes ({pendientes.length})
          </h2>
          {pendientes.map(a => {
            const sev = SEV_CFG[a.severidad] ?? SEV_CFG.info
            const Icon = sev.icon
            return (
              <div key={a.id} className={`rounded-2xl border p-4 ${sev.cls}`}>
                <div className="flex items-start gap-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${sev.iconCls}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <span className="text-sm font-bold text-gray-900">{a.titulo}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${sev.badge}`}>
                        {a.severidad}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{a.mensaje ?? a.cta}</p>
                    {a.fecha && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                        <Clock className="w-3 h-3" />
                        {new Date(a.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    )}
                    <button
                      onClick={() => marcarLeida(a.id)}
                      disabled={marking === a.id}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50"
                    >
                      {marking === a.id ? 'Marcando…' : 'Marcar como leída'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {leidas.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide">
            Leídas ({leidas.length})
          </h2>
          {leidas.map(a => (
            <div key={a.id} className="bg-white border border-gray-100 rounded-xl p-4 opacity-60">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-600">{a.titulo}</div>
                  <p className="text-xs text-gray-400 mt-0.5">{a.mensaje ?? a.cta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
