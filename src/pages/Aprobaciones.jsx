import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import API from '../api/client'

const TABS = [
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'resueltas',  label: 'Historial' },
]

const REC_LABELS = {
  CALIFICA_PENSION_INVALIDEZ:   { label: 'Califica pensión',    color: 'bg-red-100 text-red-700' },
  FORZAR_CALIFICACION_PCL:      { label: 'Forzar calificación', color: 'bg-red-100 text-red-700' },
  CONTINUAR_INCAPACIDAD:        { label: 'Continuar incap.',   color: 'bg-yellow-100 text-yellow-700' },
  REINCORPORACION_CON_TERAPIAS: { label: 'Reincorp. c/ ter.',  color: 'bg-blue-100 text-blue-700' },
  REINCORPORACION_INMEDIATA:    { label: 'Reincorp. inmediata',color: 'bg-green-100 text-green-700' },
}

function ScoreBar({ value }) {
  const color = value >= 75 ? 'bg-red-500' : value >= 50 ? 'bg-orange-400' : value >= 25 ? 'bg-yellow-400' : 'bg-green-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600 w-8 text-right">{value?.toFixed(0)}</span>
    </div>
  )
}

function ModalResolver({ aprobacion, onClose, onResuelto }) {
  const [aprobada, setAprobada] = useState(null)
  const [comentarios, setComentarios] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const rec = REC_LABELS[aprobacion.recomendacion] || { label: aprobacion.recomendacion, color: 'bg-gray-100 text-gray-700' }

  async function handleSubmit() {
    if (aprobada === null) { setError('Selecciona Aprobar o Rechazar.'); return }
    setLoading(true); setError(null)
    try {
      await API.post(`/api/v1/aprobaciones/${aprobacion.id}/resolver`, { aprobada, comentarios })
      onResuelto()
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al resolver.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-scale-in">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Revisar evaluación</h2>
        <p className="text-sm text-gray-500 mb-4">Caso <span className="font-mono font-semibold text-brand-600">{aprobacion.id_caso}</span></p>

        {/* Info del caso */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Recomendación</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rec.color}`}>{rec.label}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Score de riesgo</span>
            <span className="font-semibold text-gray-800">{aprobacion.score_riesgo?.toFixed(1)}/100</span>
          </div>
          {aprobacion.caso && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Diagnóstico</span>
                <span className="font-medium text-gray-700">PCL {aprobacion.caso.porcentaje_pcl}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Días acumulados</span>
                <span className="font-medium text-gray-700">{aprobacion.caso.dias_incapacidad} días</span>
              </div>
              {aprobacion.caso.explicacion_resumen && (
                <p className="text-xs text-gray-600 pt-1 border-t border-gray-200">{aprobacion.caso.explicacion_resumen}</p>
              )}
            </>
          )}
        </div>

        {/* Decisión */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setAprobada(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
              aprobada === true ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-green-300'
            }`}
          >
            <CheckCircle className="w-4 h-4" /> Aprobar
          </button>
          <button
            onClick={() => setAprobada(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
              aprobada === false ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500 hover:border-red-300'
            }`}
          >
            <XCircle className="w-4 h-4" /> Rechazar
          </button>
        </div>

        <textarea
          value={comentarios}
          onChange={e => setComentarios(e.target.value)}
          placeholder="Comentarios clínicos (opcional)..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 mb-4"
        />

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || aprobada === null}
            className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 transition"
          >
            {loading ? 'Guardando…' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CardPendiente({ ap, onResolver }) {
  const navigate = useNavigate()
  const rec = REC_LABELS[ap.recomendacion] || { label: ap.recomendacion, color: 'bg-gray-100 text-gray-700' }
  const fecha = new Date(ap.fecha_creacion).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="bg-white rounded-2xl border border-l-4 border-l-red-400 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Caso</p>
          <p className="font-mono font-bold text-brand-700 text-lg leading-tight">{ap.id_caso}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${rec.color}`}>{rec.label}</span>
      </div>

      <ScoreBar value={ap.score_riesgo} />

      {ap.caso && (
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-400 uppercase">PCL</p>
            <p className="font-bold text-gray-800">{ap.caso.porcentaje_pcl}%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-400 uppercase">Días</p>
            <p className="font-bold text-gray-800">{ap.caso.dias_incapacidad}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-400 uppercase">Eval.</p>
            <p className="font-bold text-gray-800 truncate text-xs">{ap.caso.evaluado_por}</p>
          </div>
        </div>
      )}

      {ap.caso?.explicacion_resumen && (
        <p className="text-xs text-gray-500 line-clamp-2">{ap.caso.explicacion_resumen}</p>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{fecha}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/historial/${ap.id_caso}`)}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium px-3 py-1.5 rounded-lg hover:bg-brand-50 transition"
          >
            Ver caso
          </button>
          <button
            onClick={() => onResolver(ap)}
            className="text-xs bg-brand-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-700 transition"
          >
            Revisar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Aprobaciones() {
  const [tab, setTab] = useState('pendientes')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)

  const limit = 12

  async function fetchData(p = page) {
    setLoading(true)
    try {
      const endpoint = tab === 'pendientes' ? '/api/v1/aprobaciones/pendientes' : '/api/v1/aprobaciones/resueltas'
      const r = await API.get(endpoint, { params: { page: p, limit } })
      setData(r.data)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { setPage(1); fetchData(1) }, [tab])

  function handleResuelto() {
    setModal(null)
    fetchData(page)
  }

  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Aprobaciones médicas</h1>
        <p className="text-sm text-gray-500 mt-1">Evaluaciones críticas pendientes de revisión por médico laboral certificado.</p>
      </div>

      {/* Flag banner */}
      {data?.flag_activo === false && (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">Validación humana desactivada</p>
            <p className="text-xs text-yellow-600 mt-0.5">
              Las evaluaciones críticas se publican sin aprobación manual.
              Activa <code className="font-mono bg-yellow-100 px-1 rounded">VALIDACION_HUMANA_REQUERIDA=true</code> en las variables de entorno para habilitar este flujo.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {t.key === 'pendientes' && total > 0 && tab === 'pendientes' && (
              <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border shadow-sm p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-8 bg-gray-100 rounded w-2/3" />
              <div className="h-1.5 bg-gray-100 rounded" />
              <div className="grid grid-cols-3 gap-2">
                {[0,1,2].map(j => <div key={j} className="h-12 bg-gray-100 rounded-lg" />)}
              </div>
            </div>
          ))}
        </div>
      ) : tab === 'pendientes' ? (
        data?.aprobaciones?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.aprobaciones.map(ap => (
              <CardPendiente key={ap.id} ap={ap} onResolver={setModal} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Sin pendientes</h3>
            <p className="text-sm text-gray-500">No hay evaluaciones críticas esperando revisión.</p>
          </div>
        )
      ) : (
        /* Historial resueltas */
        data?.aprobaciones?.length > 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-left">
                  <th className="px-5 py-3 font-semibold text-gray-600">Caso</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Recomendación</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Score</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Decisión</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Resuelta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.aprobaciones.map(ap => {
                  const rec = REC_LABELS[ap.recomendacion] || { label: ap.recomendacion, color: 'bg-gray-100 text-gray-700' }
                  const fecha = ap.fecha_resolucion ? new Date(ap.fecha_resolucion).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) : '—'
                  return (
                    <tr key={ap.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-mono font-semibold text-brand-600">{ap.id_caso}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rec.color}`}>{rec.label}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-700 font-medium">{ap.score_riesgo?.toFixed(1)}</td>
                      <td className="px-5 py-3">
                        {ap.aprobada
                          ? <span className="flex items-center gap-1 text-green-600 font-medium text-xs"><CheckCircle className="w-4 h-4" /> Aprobada</span>
                          : <span className="flex items-center gap-1 text-red-600 font-medium text-xs"><XCircle className="w-4 h-4" /> Rechazada</span>
                        }
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{fecha}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-gray-500">Sin historial de aprobaciones aún.</p>
          </div>
        )
      )}

      {/* Paginación */}
      {!loading && total > limit && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Mostrando {(page - 1) * limit + 1}–{Math.min(page * limit, total)} de {total}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => { const p = page - 1; setPage(p); fetchData(p) }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => { const p = page + 1; setPage(p); fetchData(p) }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {modal && (
        <ModalResolver aprobacion={modal} onClose={() => setModal(null)} onResuelto={handleResuelto} />
      )}
    </div>
  )
}
