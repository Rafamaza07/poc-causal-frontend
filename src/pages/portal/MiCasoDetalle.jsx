import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, AlertCircle, Info,
  FileText, Scale, ChevronRight, Shield,
} from 'lucide-react'
import API from '../../api/client'
import { SkeletonCaseDetail } from '../../Components/Skeleton'

const NIVEL_CFG = {
  CRÍTICO:     { cls: 'bg-red-100 text-red-700 border-red-200',     icon: AlertCircle,    iconCls: 'text-red-500' },
  ALTO:        { cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle,   iconCls: 'text-amber-500' },
  MODERADO:    { cls: 'bg-blue-100 text-blue-700 border-blue-200',    icon: Info,          iconCls: 'text-blue-500' },
  BAJO:        { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle, iconCls: 'text-emerald-500' },
  DESCONOCIDO: { cls: 'bg-gray-100 text-gray-500 border-gray-200',   icon: Info,          iconCls: 'text-gray-400' },
}

function ScoreRing({ score }) {
  const pct   = Math.min(100, Math.max(0, score ?? 0))
  const color = pct >= 75 ? '#dc2626' : pct >= 50 ? '#f59e0b' : pct >= 25 ? '#3b82f6' : '#10b981'
  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
        <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${pct} 100`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold" style={{ color }}>{Math.round(pct)}</span>
        <span className="text-[9px] text-gray-400 font-medium">/ 100</span>
      </span>
    </div>
  )
}

export default function MiCasoDetalle() {
  const { id_caso } = useParams()
  const [caso,       setCaso]       = useState(null)
  const [elegib,     setElegib]     = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    Promise.allSettled([
      API.get(`/api/v1/cliente/mis-casos/${id_caso}`),
      API.get(`/api/v1/cliente/elegibilidad/${id_caso}`),
    ]).then(([casoR, eligR]) => {
      if (casoR.status  === 'fulfilled') setCaso(casoR.value.data)
      else setError('No se pudo cargar el caso.')
      if (eligR.status  === 'fulfilled') setElegib(eligR.value.data)
    }).finally(() => setLoading(false))
  }, [id_caso])

  if (loading) return <SkeletonCaseDetail />
  if (error || !caso) return (
    <div className="text-center py-16">
      <AlertCircle className="w-8 h-8 text-red-300 mx-auto mb-3" />
      <p className="text-gray-500">{error ?? 'Caso no encontrado.'}</p>
      <Link to="/portal/historial" className="text-emerald-600 text-sm mt-2 inline-block">← Volver</Link>
    </div>
  )

  const nivel  = caso.nivel_riesgo ?? 'DESCONOCIDO'
  const cfg    = NIVEL_CFG[nivel] ?? NIVEL_CFG.DESCONOCIDO
  const IconN  = cfg.icon

  return (
    <div className="space-y-6">
      {/* ── Back + title ─────────────────────────────────────── */}
      <div>
        <Link to="/portal/historial" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a mis casos
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Caso #{caso.id_caso}</h1>
        <p className="text-sm text-gray-400 mt-1">
          Evaluado el {new Date(caso.fecha_evaluacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── Score + nivel ────────────────────────────────────── */}
      <div className={`rounded-2xl border p-5 flex items-center gap-5 ${cfg.cls}`}>
        <ScoreRing score={caso.score_riesgo} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <IconN className={`w-5 h-5 flex-shrink-0 ${cfg.iconCls}`} />
            <span className="font-bold text-base">{nivel}</span>
          </div>
          <div className="text-sm font-semibold mb-1">{caso.recomendacion}</div>
          {caso.resumen && <p className="text-xs opacity-80 leading-relaxed">{caso.resumen}</p>}
        </div>
      </div>

      {/* ── Datos del caso ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Datos de tu caso</span>
        </div>
        <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-gray-100">
          {[
            { label: 'Días de incapacidad', value: `${caso.dias_incapacidad} días` },
            { label: 'Diagnóstico',          value: caso.codigo_cie10 ?? '—' },
            { label: 'Tipo de enfermedad',   value: caso.tipo_enfermedad ?? '—' },
            { label: 'Pronóstico',           value: caso.pronostico_medico ?? '—' },
            { label: 'EPS',                  value: caso.eps ?? '—' },
            { label: 'ARL',                  value: caso.arl ?? '—' },
            { label: 'AFP',                  value: caso.afp ?? '—' },
            { label: 'Empresa',              value: caso.empresa ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</div>
              <div className="text-sm font-semibold text-gray-800 truncate">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Próximos pasos ───────────────────────────────────── */}
      {caso.proximos_pasos?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Qué debes hacer ahora
          </h3>
          <ul className="space-y-2">
            {caso.proximos_pasos.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-5 h-5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Base legal ───────────────────────────────────────── */}
      {caso.base_legal?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-500" /> Normativa que respalda tu caso
          </h3>
          <div className="space-y-3">
            {caso.base_legal.slice(0, 3).map((l, i) => (
              <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <div className="text-xs font-bold text-blue-700 mb-1">{l.norma}</div>
                <div className="text-xs text-blue-800 font-medium mb-1">{l.titulo}</div>
                <p className="text-[11px] text-blue-700 opacity-80 leading-relaxed line-clamp-2">{l.extracto}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Elegibilidad documentos ──────────────────────────── */}
      {elegib && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-500" /> Documentos legales disponibles
          </h3>
          <div className="space-y-3">
            {/* Derecho de petición */}
            <div className={`rounded-xl p-4 border ${elegib.derecho_peticion?.elegible ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-0.5">Derecho de Petición</div>
                  <p className="text-xs text-gray-600">{elegib.derecho_peticion?.mensaje}</p>
                </div>
                {elegib.derecho_peticion?.elegible && (
                  <Link
                    to={`/portal/documentos/${caso.id_caso}?tipo=derecho_peticion`}
                    className="inline-flex items-center gap-1 text-xs font-bold bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0"
                  >
                    Generar <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>

            {/* Tutela */}
            <div className={`rounded-xl p-4 border ${elegib.tutela?.elegible ? 'bg-rose-50 border-rose-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-0.5">Acción de Tutela</div>
                  <p className="text-xs text-gray-600">{elegib.tutela?.mensaje}</p>
                  {!elegib.tutela?.elegible && elegib.tutela?.dias_faltantes > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-300 rounded-full"
                          style={{ width: `${Math.min(100, ((elegib.dias_incapacidad ?? 0) / 90) * 100)}%` }}
                        />
                      </div>
                      <span className="tabular-nums">{elegib.dias_incapacidad ?? 0}/90 días</span>
                    </div>
                  )}
                </div>
                {elegib.tutela?.elegible && (
                  <Link
                    to={`/portal/documentos/${caso.id_caso}?tipo=tutela`}
                    className="inline-flex items-center gap-1 text-xs font-bold bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors flex-shrink-0"
                  >
                    Generar <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 text-[11px] text-gray-400">
            <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            Los documentos son generados con base en la normativa colombiana vigente. Consúltalos con un abogado antes de radicar.
          </div>
        </div>
      )}
    </div>
  )
}
