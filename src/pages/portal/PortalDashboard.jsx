import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Clock, Bell, FileText, ChevronRight,
  AlertCircle, CheckCircle, TrendingUp, Loader2,
} from 'lucide-react'
import API from '../../api/client'
import { normalizeAlerts } from '../../api/adapters'

function ScoreRing({ score }) {
  const pct    = Math.min(100, Math.max(0, score ?? 0))
  const stroke = pct
  const color  = pct >= 75 ? '#dc2626' : pct >= 50 ? '#f59e0b' : pct >= 25 ? '#3b82f6' : '#10b981'
  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
        <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={`${stroke} 100`} strokeLinecap="round" style={{ transition: 'stroke-dasharray .6s ease' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-base font-extrabold" style={{ color }}>
        {Math.round(pct)}
      </span>
    </div>
  )
}

function NivelBadge({ nivel }) {
  const cfg = {
    CRÍTICO:    'bg-red-100 text-red-700',
    ALTO:       'bg-amber-100 text-amber-700',
    MODERADO:   'bg-blue-100 text-blue-700',
    BAJO:       'bg-emerald-100 text-emerald-700',
    DESCONOCIDO:'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg[nivel] ?? cfg.DESCONOCIDO}`}>
      {nivel}
    </span>
  )
}

export default function PortalDashboard() {
  const [casos,   setCasos]   = useState([])
  const [alertas, setAlertas] = useState([])
  const [docs,    setDocs]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      API.get('/api/v1/cliente/mis-casos'),
      API.get('/api/v1/cliente/mis-alertas'),
      API.get('/api/v1/cliente/documentos'),
    ]).then(([casosR, alertasR, docsR]) => {
      if (casosR.status   === 'fulfilled') setCasos(casosR.value.data ?? [])
      if (alertasR.status === 'fulfilled') setAlertas(normalizeAlerts(alertasR.value.data))
      if (docsR.status    === 'fulfilled') setDocs(docsR.value.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const casoPrincipal = casos[0]
  const alertasUrgentes = alertas.filter(a => a.severidad === 'urgente' || a.severidad === 'importante')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ── Welcome header ─────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Mi resumen</h1>
        <p className="text-gray-500 text-sm">Aquí tienes el estado actual de tu incapacidad y las acciones pendientes.</p>
      </div>

      {/* ── Caso principal ─────────────────────────────────────── */}
      {casoPrincipal ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-sm">Mi caso activo</span>
            <NivelBadge nivel={casoPrincipal.nivel_riesgo} />
          </div>
          <div className="p-5 flex items-start gap-5">
            <ScoreRing score={casoPrincipal.score_riesgo} />
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold text-gray-900 mb-1 truncate">
                Caso #{casoPrincipal.id_caso}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                {casoPrincipal.dias_incapacidad} días acumulados
                {casoPrincipal.codigo_cie10 && ` · ${casoPrincipal.codigo_cie10}`}
              </div>
              <div className="text-sm text-gray-700 font-medium mb-3">{casoPrincipal.recomendacion}</div>
              <Link
                to={`/portal/historial/${casoPrincipal.id_caso}`}
                className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Ver detalles completos <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8 text-center">
          <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No tienes casos registrados aún.</p>
        </div>
      )}

      {/* ── Acciones rápidas ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/portal/historial', icon: Clock,    label: 'Mis casos',      color: 'text-blue-600 bg-blue-50' },
          { to: '/portal/alertas',   icon: Bell,     label: 'Mis alertas',    color: 'text-amber-600 bg-amber-50', badge: alertasUrgentes.length || null },
          { to: '/portal/documentos',icon: FileText, label: 'Mis documentos', color: 'text-purple-600 bg-purple-50', badge: docs.length || null },
          casoPrincipal
            ? { to: `/portal/historial/${casoPrincipal.id_caso}`, icon: LayoutDashboard, label: 'Ver mi caso', color: 'text-emerald-600 bg-emerald-50' }
            : { to: '/portal', icon: LayoutDashboard, label: 'Inicio', color: 'text-gray-400 bg-gray-50' },
        ].map(({ to, icon: Icon, label, color, badge }) => (
          <Link
            key={to + label}
            to={to}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative"
          >
            {badge ? (
              <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {badge}
              </span>
            ) : null}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center">{label}</span>
          </Link>
        ))}
      </div>

      {/* ── Alertas urgentes ───────────────────────────────────── */}
      {alertasUrgentes.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Acciones pendientes
          </h2>
          <div className="space-y-2">
            {alertasUrgentes.slice(0, 3).map(a => (
              <div key={a.id} className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-amber-900">{a.titulo}</div>
                  <div className="text-xs text-amber-700 mt-0.5">{a.cta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Documentos recientes ──────────────────────────────── */}
      {docs.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Documentos generados
          </h2>
          <div className="space-y-2">
            {docs.slice(0, 3).map(d => (
              <div key={d.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 capitalize">{d.tipo.replace('_', ' ')}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(d.generado_at).toLocaleDateString('es-CO')} · {d.estado}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.estado === 'enviado' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {d.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
