import { useEffect, useRef, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import API from '../api/client'
import Gauge from '../Components/Gauge'
import { SkeletonTable } from '../Components/Skeleton'
import { useToast } from '../Components/Toast'

const RISK_STYLES = {
  BAJO:     'bg-green-100 text-green-800',
  MODERADO: 'bg-yellow-100 text-yellow-800',
  ALTO:     'bg-orange-100 text-orange-800',
  CRÍTICO:  'bg-red-100 text-red-800',
}
const REC_LABELS = {
  'CALIFICA_PENSION_INVALIDEZ':   'Pensión',
  'CONTINUAR_INCAPACIDAD':        'Continuar',
  'REINCORPORACION_CON_TERAPIAS': 'Reincorporar',
  'FORZAR_CALIFICACION_PCL':      'Forzar PCL',
}
const INP = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

// ─── Timeline del caso ──────────────────────────────────────────────────────
function TimelinePanel({ idCaso }) {
  const [data, setData]     = useState(null)
  const [loading, setLoad]  = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    setLoad(true)
    API.get(`/api/casos/${idCaso}/timeline`)
      .then(r => setData(r.data))
      .catch(() => setError('No hay historial de evaluaciones anteriores para este caso.'))
      .finally(() => setLoad(false))
  }, [idCaso])

  if (loading) return (
    <div className="space-y-2 animate-pulse py-2">
      <div className="h-3 bg-gray-100 rounded w-1/3" />
      <div className="h-24 bg-gray-100 rounded" />
    </div>
  )
  if (error || !data || data.total_evaluaciones < 2) return null

  const chartData = data.evolucion_score.map(e => ({ ...e, score: e.score }))
  const hitos = data.timeline
    .filter(t => t.hito_alcanzado)
    .reduce((acc, t) => {
      if (!acc.find(h => h.hito === t.hito_alcanzado))
        acc.push({ fecha: t.fecha.slice(0, 10), hito: t.hito_alcanzado, dias: t.dias_incapacidad })
      return acc
    }, [])

  return (
    <div className="border-t border-gray-100 pt-4 space-y-3">
      <p className="text-xs font-semibold text-gray-600">
        📈 Timeline — {data.total_evaluaciones} evaluaciones
      </p>
      <ResponsiveContainer width="100%" height={130}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="fecha" tick={{ fontSize: 9, fill: '#9ca3af' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 11 }}
            formatter={v => [`${v}/100`, 'Score']}
          />
          <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 2"
            label={{ value: 'Crítico', position: 'insideTopRight', fontSize: 8, fill: '#ef4444' }} />
          <ReferenceLine y={50} stroke="#f97316" strokeDasharray="4 2"
            label={{ value: 'Alto', position: 'insideTopRight', fontSize: 8, fill: '#f97316' }} />
          <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2}
            dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
      {hitos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hitos.map((h, i) => (
            <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              ⚑ {h.hito}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Comparar desde historial ────────────────────────────────────────────────
function CompararDesdeHistorial({ idCasoActual, onClose }) {
  const toast = useToast()
  const [idOtro, setIdOtro]     = useState('')
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const comparar = async () => {
    if (!idOtro.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await API.post('/api/comparar-por-id', {
        id_caso_1: idCasoActual,
        id_caso_2: idOtro.trim(),
      })
      setResult(data)
      toast('Comparación completada', 'info')
    } catch (e) {
      const msg = e.response?.data?.detail || 'Error al comparar'
      setError(msg)
      toast(msg, 'error')
    } finally { setLoading(false) }
  }

  const scoreColor = (s) =>
    s >= 75 ? 'text-red-600' : s >= 50 ? 'text-orange-500' : s >= 25 ? 'text-amber-500' : 'text-green-600'

  return (
    <div className="border-t border-gray-100 pt-3 space-y-3">
      <p className="text-xs font-semibold text-gray-600">⚖️ Comparar con otro caso</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={idOtro}
          onChange={e => setIdOtro(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') comparar() }}
          placeholder="ID del otro caso..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={comparar} disabled={loading || !idOtro.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
          {loading ? '...' : 'Comparar'}
        </button>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xs px-2">✕</button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {result && (
        <div className="space-y-2">
          <div className="bg-slate-800 text-white rounded-lg px-3 py-2 text-xs text-center font-medium">
            Caso más crítico: <span className="text-yellow-300">{result.mas_critico}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[result.detalle_paciente_1, result.detalle_paciente_2].map((p, i) => p && (
              <div key={i} className={`rounded-lg border p-3 text-center ${
                result.mas_critico === p.id_caso ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <p className="text-xs font-semibold text-gray-700 mb-1">{p.id_caso}</p>
                <p className={`text-xl font-bold ${scoreColor(p.score_riesgo)}`}>{p.score_riesgo}</p>
                <p className="text-xs text-gray-500">{p.nivel_riesgo}</p>
                <p className="text-xs text-gray-600 mt-1 leading-tight">{p.recomendacion?.replace(/_/g,' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Descargar Reporte PDF ────────────────────────────────────────────────────
function DescargarReporte({ idCaso }) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const descargar = async () => {
    setLoading(true)
    try {
      const res = await API.get(`/api/casos/${idCaso}/reporte-pdf`, { responseType: 'blob' })
      const url  = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reporte-${idCaso}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast('Reporte PDF descargado', 'success')
    } catch {
      toast('Error al generar el reporte', 'error')
    } finally { setLoading(false) }
  }

  return (
    <button onClick={descargar} disabled={loading}
      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
      {loading ? 'Generando...' : '📄 Reporte PDF'}
      {loading && <span className="text-slate-300 text-xs">IA redactando...</span>}
    </button>
  )
}

// ─── Chat IA ──────────────────────────────────────────────────────────────────
function ChatIA({ idCaso }) {
  const [msgs, setMsgs]           = useState([])
  const [pregunta, setPregunta]   = useState('')
  const [loading, setLoading]     = useState(false)
  const bottomRef                 = useRef()

  const enviar = async () => {
    const q = pregunta.trim()
    if (!q || loading) return
    setMsgs(m => [...m, { role: 'user', text: q }])
    setPregunta(''); setLoading(true)
    try {
      const { data } = await API.post(`/api/casos/${idCaso}/chat`, { pregunta: q })
      setMsgs(m => [...m, { role: 'ia', text: data.respuesta }])
    } catch (err) {
      setMsgs(m => [...m, { role: 'ia', text: `Error: ${err.response?.data?.detail || 'No disponible'}` }])
    } finally {
      setLoading(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  return (
    <div className="border-t border-gray-100 pt-3 space-y-2">
      <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">🤖 Chat IA sobre este caso</p>
      <div className="bg-gray-50 rounded-lg p-2 h-36 overflow-y-auto space-y-2 text-xs">
        {msgs.length === 0 && (
          <p className="text-gray-400 text-center mt-4">Hazle una pregunta sobre el caso...</p>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-2 py-1.5 rounded-lg leading-relaxed ${
              m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-400 px-2 py-1.5 rounded-lg">Pensando...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input type="text" value={pregunta} onChange={e => setPregunta(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar() } }}
          placeholder="Escribe una pregunta..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={enviar} disabled={loading || !pregunta.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
          Enviar
        </button>
      </div>
    </div>
  )
}

// ─── Editar Notas ─────────────────────────────────────────────────────────────
function EditarNotas({ idCaso, notasIniciales, onGuardado }) {
  const toast = useToast()
  const [notas, setNotas]   = useState(notasIniciales || '')
  const [saving, setSaving] = useState(false)

  const guardar = async () => {
    setSaving(true)
    try {
      await API.patch(`/api/historial/${idCaso}`, { notas_adicionales: notas })
      onGuardado(notas)
      toast('Notas guardadas', 'success')
    } catch {
      toast('Error al guardar', 'error')
    } finally { setSaving(false) }
  }

  return (
    <div className="border-t border-gray-100 pt-3 space-y-2">
      <p className="text-xs font-semibold text-gray-600">✏️ Editar notas (Admin)</p>
      <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Notas adicionales..." />
      <button onClick={guardar} disabled={saving}
        className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs px-4 py-1.5 rounded-lg transition-colors">
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Historial() {
  const toast = useToast()
  const [casos, setCasos]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [busqueda, setBusqueda]         = useState('')
  const [filtroRiesgo, setFiltroRiesgo] = useState('')
  const [filtroRec, setFiltroRec]       = useState('')
  const [detalle, setDetalle]           = useState(null)
  const [showComparar, setShowComparar] = useState(false)
  const [exportando, setExportando]     = useState(false)

  const user = (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
  const puedeEditar   = user?.permisos?.includes('editar_caso')
  const puedeExportar = user?.permisos?.includes('exportar')

  const cargar = () => {
    setLoading(true)
    const params = new URLSearchParams({ limite: 50 })
    if (busqueda)     params.append('busqueda',     busqueda)
    if (filtroRiesgo) params.append('nivel_riesgo', filtroRiesgo)
    if (filtroRec)    params.append('recomendacion', filtroRec)
    API.get(`/api/historial?${params}`)
      .then(r => setCasos(r.data.casos || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const verDetalle = async (id_caso) => {
    setShowComparar(false)
    try {
      const { data } = await API.get(`/api/historial/${id_caso}`)
      setDetalle(data)
    } catch {}
  }

  const exportarCSV = async () => {
    setExportando(true)
    try {
      const params = new URLSearchParams()
      if (filtroRiesgo) params.append('nivel_riesgo', filtroRiesgo)
      if (filtroRec)    params.append('recomendacion', filtroRec)
      const res = await API.get(`/api/historial/export-csv?${params}`, { responseType: 'blob' })
      const url  = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }))
      const link = document.createElement('a')
      link.href  = url
      link.setAttribute('download', `historial-${new Date().toISOString().slice(0,10)}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast('CSV exportado', 'success')
    } catch {
      toast('Error al exportar CSV', 'error')
    } finally { setExportando(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Historial de Casos</h1>
          <p className="text-gray-500 text-sm mt-1">{casos.length} casos</p>
        </div>
        <div className="flex gap-2">
          {puedeExportar && (
            <button onClick={exportarCSV} disabled={exportando}
              className="bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
              {exportando ? 'Exportando...' : '⬇ CSV'}
            </button>
          )}
          <button onClick={cargar} className="bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3 flex-wrap">
        <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por ID..." className={INP}
          onKeyDown={e => { if (e.key === 'Enter') cargar() }} />
        <select value={filtroRiesgo} onChange={e => setFiltroRiesgo(e.target.value)} className={INP}>
          <option value="">Todos los niveles</option>
          <option value="BAJO">Bajo</option>
          <option value="MODERADO">Moderado</option>
          <option value="ALTO">Alto</option>
          <option value="CRÍTICO">Crítico</option>
        </select>
        <select value={filtroRec} onChange={e => setFiltroRec(e.target.value)} className={INP}>
          <option value="">Todas las recomendaciones</option>
          <option value="CALIFICA_PENSION_INVALIDEZ">Pensión</option>
          <option value="CONTINUAR_INCAPACIDAD">Continuar</option>
          <option value="REINCORPORACION_CON_TERAPIAS">Reincorporar</option>
          <option value="FORZAR_CALIFICACION_PCL">Forzar PCL</option>
        </select>
        <button onClick={cargar} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
          Filtrar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: detalle ? '1fr 1fr' : '1fr' }}>
        {/* Tabla */}
        {loading ? (
          <SkeletonTable rows={7} />
        ) : casos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 flex items-center justify-center h-48 text-gray-400">
            No hay casos
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['ID', 'Fecha', 'Recomendación', 'Score', 'Riesgo', 'Evaluado por'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {casos.map(c => (
                  <tr key={c.id} onClick={() => verDetalle(c.id_caso)}
                    className={`cursor-pointer transition-colors hover:bg-blue-50 ${c.es_critico ? 'bg-red-50' : ''} ${detalle?.id_caso === c.id_caso ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      {c.es_critico && <span className="mr-1">🚨</span>}{c.id_caso}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(c.fecha).toLocaleDateString('es-CO')}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{REC_LABELS[c.recomendacion] || c.recomendacion}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-800">{c.score_riesgo}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RISK_STYLES[c.nivel_riesgo] || ''}`}>
                        {c.nivel_riesgo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{c.evaluado_por || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Panel de detalle */}
        {detalle && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Detalle — {detalle.id_caso}</h3>
              <button onClick={() => { setDetalle(null); setShowComparar(false) }}
                className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>

            {/* Gauge + recomendación */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <Gauge score={detalle.score_riesgo} />
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium mb-1">Recomendación</p>
                <p className="text-sm font-bold text-blue-800 leading-snug">{detalle.recomendacion?.replace(/_/g, ' ')}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Confianza: {detalle.confianza ? `${(detalle.confianza * 100).toFixed(0)}%` : '100%'}
                </p>
              </div>
            </div>

            {/* Tiempo de recuperación */}
            {detalle.tiempo_recuperacion?.estimado_dias && (
              <div className="p-3 bg-indigo-50 rounded-lg flex items-center gap-3">
                <div className="text-2xl font-bold text-indigo-700">{detalle.tiempo_recuperacion.estimado_dias}d</div>
                <div>
                  <p className="text-xs font-medium text-indigo-800">Estimado recuperación</p>
                  <p className="text-xs text-indigo-500">{detalle.tiempo_recuperacion.rango}</p>
                </div>
              </div>
            )}

            {detalle.explicacion && (
              <>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-1">Explicación</p>
                  <p className="text-xs text-gray-600">{detalle.explicacion.resumen}</p>
                </div>
                {detalle.explicacion.proximos_pasos?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Próximos pasos</p>
                    <ul className="space-y-1">
                      {detalle.explicacion.proximos_pasos.map((p, i) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-1">
                          <span className="text-blue-500 font-bold">{i + 1}.</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {detalle.notas_adicionales && !puedeEditar && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs font-medium text-yellow-700 mb-1">Notas</p>
                <p className="text-xs text-yellow-700">{detalle.notas_adicionales}</p>
              </div>
            )}

            {puedeEditar && (
              <EditarNotas
                idCaso={detalle.id_caso}
                notasIniciales={detalle.notas_adicionales}
                onGuardado={n => setDetalle(d => ({ ...d, notas_adicionales: n }))}
              />
            )}

            {/* Timeline */}
            <TimelinePanel idCaso={detalle.id_caso} />

            {/* Acciones: reporte + comparar */}
            <div className="border-t border-gray-100 pt-3 flex items-center gap-2 flex-wrap">
              <DescargarReporte idCaso={detalle.id_caso} />
              <button onClick={() => setShowComparar(v => !v)}
                className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg transition-colors border border-blue-200">
                ⚖️ Comparar
              </button>
            </div>

            {showComparar && (
              <CompararDesdeHistorial
                idCasoActual={detalle.id_caso}
                onClose={() => setShowComparar(false)}
              />
            )}

            {/* Chat IA */}
            <ChatIA idCaso={detalle.id_caso} />
          </div>
        )}
      </div>
    </div>
  )
}
