import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ChevronRight, Loader2, FileSearch } from 'lucide-react'
import API from '../../api/client'

const NIVEL_CFG = {
  CRÍTICO:     { cls: 'bg-red-100 text-red-700',     bar: 'bg-red-500' },
  ALTO:        { cls: 'bg-amber-100 text-amber-700',  bar: 'bg-amber-400' },
  MODERADO:    { cls: 'bg-blue-100 text-blue-700',    bar: 'bg-blue-400' },
  BAJO:        { cls: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-400' },
  DESCONOCIDO: { cls: 'bg-gray-100 text-gray-500',   bar: 'bg-gray-200' },
}

export default function MiHistorial() {
  const [casos,   setCasos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    API.get('/api/v1/cliente/mis-casos')
      .then(r => setCasos(r.data ?? []))
      .catch(() => setError('No se pudo cargar el historial. Inténtalo de nuevo.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
          <Clock className="w-6 h-6 text-emerald-600" /> Mis casos
        </h1>
        <p className="text-gray-500 text-sm">Historial completo de tus evaluaciones de incapacidad.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {!loading && casos.length === 0 && !error && (
        <div className="text-center py-16">
          <FileSearch className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No tienes casos registrados todavía.</p>
        </div>
      )}

      <div className="space-y-3">
        {casos.map(c => {
          const nivel = c.nivel_riesgo ?? 'DESCONOCIDO'
          const cfg   = NIVEL_CFG[nivel] ?? NIVEL_CFG.DESCONOCIDO
          const pct   = Math.min(100, Math.max(0, c.score_riesgo ?? 0))
          return (
            <Link
              key={c.id_caso}
              to={`/portal/historial/${c.id_caso}`}
              className="block bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm mb-0.5 truncate">Caso #{c.id_caso}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(c.fecha_evaluacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.cls}`}>{nivel}</span>
              </div>

              {/* Score bar */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${cfg.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-bold text-gray-500 w-8 text-right tabular-nums">{Math.round(pct)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {c.dias_incapacidad} días
                  {c.codigo_cie10 && ` · ${c.codigo_cie10}`}
                  {c.empresa && ` · ${c.empresa}`}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
