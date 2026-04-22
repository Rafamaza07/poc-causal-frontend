import { useEffect, useRef, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { RefreshCw, Download, X, Scale, Send, Save, MessageSquare, FileText, TrendingUp, Filter, Activity, RotateCcw, Zap } from 'lucide-react'
import API from '../api/client'
import Gauge from '../Components/Gauge'
import { SkeletonTable } from '../Components/Skeleton'
import { useToast } from '../Components/Toast'
import EmptyState from '../Components/EmptyState'

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

// ─── Score de retorno al trabajo ─────────────────────────────────────────────
function RetornoPanel({ idCaso }) {
  const [data, setData]    = useState(null)
  const [loading, setLoad] = useState(false)
  const [error, setError]  = useState('')

  const cargar = () => {
    setLoad(true); setError('')
    API.get(`/api/casos/${idCaso}/retorno`)
      .then(r => setData(r.data))
      .catch(() => setError('No se pudo calcular el score de retorno.'))
      .finally(() => setLoad(false))
  }

  const INTERP_STYLES = {
    FAVORABLE:    'text-green-700 bg-green-50 border-green-200',
    MODERADO:     'text-amber-700 bg-amber-50 border-amber-200',
    DESFAVORABLE: 'text-red-700 bg-red-50 border-red-200',
  }

  return (
    <div className="border-t border-gray-100 pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-gray-500" />
          <p className="text-xs font-semibold text-gray-600">Score de Retorno al Trabajo</p>
        </div>
        {!data && (
          <button onClick={cargar} disabled={loading}
            className="text-xs bg-brand-50 hover:bg-brand-100 text-brand-700 px-2.5 py-1 rounded-lg border border-brand-200 transition-colors">
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {loading && <div className="h-2 bg-gray-100 rounded-full animate-pulse w-full" />}
      {data && !loading && (
        <div className="space-y-3 animate-fade-in">
          <div className={`rounded-xl border px-4 py-3 flex items-center justify-between ${INTERP_STYLES[data.interpretacion] || ''}`}>
            <div>
              <p className="text-xs font-medium opacity-70">Score de retorno</p>
              <p className="text-2xl font-bold">{data.score_retorno_trabajo}<span className="text-sm font-normal">/100</span></p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/60 border border-current/20">
              {data.interpretacion}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Retorno', val: data.probabilidades.retorno_exitoso, color: 'text-green-700' },
              { label: 'Invalidez', val: data.probabilidades.hacia_invalidez, color: 'text-red-600' },
              { label: 'Reincidencia', val: data.probabilidades.riesgo_reincidencia, color: 'text-amber-600' },
            ].map(p => (
              <div key={p.label} className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                <p className={`text-sm font-bold ${p.color}`}>{(p.val * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-500">{p.label}</p>
              </div>
            ))}
          </div>
          {data.acciones_recomendadas?.length > 0 && (
            <ul className="space-y-1">
              {data.acciones_recomendadas.map((a, i) => (
                <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                  <span className="text-brand-500 font-bold">→</span>{a}
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-gray-500 leading-relaxed italic">{data.analisis_ia}</p>
        </div>
      )}
    </div>
  )
}

// ─── Predictor de reincidencia ────────────────────────────────────────────────
function ReincidenciaPanel({ idCaso }) {
  const [data, setData]    = useState(null)
  const [loading, setLoad] = useState(false)
  const [error, setError]  = useState('')

  const cargar = () => {
    setLoad(true); setError('')
    API.get(`/api/casos/${idCaso}/reincidencia`)
      .then(r => setData(r.data))
      .catch(() => setError('No se pudo calcular el predictor.'))
      .finally(() => setLoad(false))
  }

  const NIVEL_STYLES = {
    ALTO:     'text-red-700 bg-red-50 border-red-200',
    MODERADO: 'text-amber-700 bg-amber-50 border-amber-200',
    BAJO:     'text-green-700 bg-green-50 border-green-200',
  }

  return (
    <div className="border-t border-gray-100 pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
          <p className="text-xs font-semibold text-gray-600">Predictor de Reincidencia</p>
        </div>
        {!data && (
          <button onClick={cargar} disabled={loading}
            className="text-xs bg-brand-50 hover:bg-brand-100 text-brand-700 px-2.5 py-1 rounded-lg border border-brand-200 transition-colors">
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {loading && <div className="h-2 bg-gray-100 rounded-full animate-pulse w-full" />}
      {data && !loading && (
        <div className="space-y-3 animate-fade-in">
          {data.alerta && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-medium">
              Alerta: riesgo ALTO de reincidencia
            </div>
          )}
          <div className={`rounded-xl border px-4 py-2 text-center ${NIVEL_STYLES[data.nivel_riesgo_reincidencia] || ''}`}>
            <p className="text-xs opacity-70">Nivel de riesgo</p>
            <p className="text-lg font-bold">{data.nivel_riesgo_reincidencia}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: '30 días', val: data.probabilidades?.en_30_dias ?? 0 },
              { label: '60 días', val: data.probabilidades?.en_60_dias ?? 0 },
              { label: '90 días', val: data.probabilidades?.en_90_dias ?? 0 },
            ].map(p => (
              <div key={p.label} className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                <p className="text-sm font-bold text-gray-800">{(p.val * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-500">{p.label}</p>
              </div>
            ))}
          </div>
          {data.factores_riesgo?.length > 0 && (
            <ul className="space-y-1">
              {data.factores_riesgo.map((f, i) => (
                <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                  <span className="text-amber-500 font-bold">!</span>{f}
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-gray-500 leading-relaxed italic">{data.analisis_ia}</p>
        </div>
      )}
    </div>
  )
}

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
      <div className="flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
        <p className="text-xs font-semibold text-gray-600">Timeline — {data.total_evaluaciones} evaluaciones</p>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="fecha" tick={{ fontSize: 9, fill: '#9ca3af' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 11 }}
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
            <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
              {h.hito}
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
      <div className="flex items-center gap-2">
        <Scale className="w-3.5 h-3.5 text-gray-500" />
        <p className="text-xs font-semibold text-gray-600">Comparar con otro caso</p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={idOtro}
          onChange={e => setIdOtro(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') comparar() }}
          placeholder="ID del otro caso..."
          className="input flex-1 !py-1.5 text-xs"
        />
        <button onClick={comparar} disabled={loading || !idOtro.trim()}
          className="btn-primary text-xs px-3 py-1.5">
          {loading ? '...' : 'Comparar'}
        </button>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 px-2 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {result && (
        <div className="space-y-2 animate-fade-in">
          <div className="bg-sidebar text-white rounded-lg px-3 py-2 text-xs text-center font-medium">
            Caso más crítico: <span className="text-yellow-300">{result.mas_critico}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[result.detalle_paciente_1, result.detalle_paciente_2].map((p, i) => p && (
              <div key={i} className={`rounded-xl border p-3 text-center transition-shadow hover:shadow-soft ${
                result.mas_critico === p.id_caso ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
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
      className="btn-dark text-xs px-3 py-1.5 flex items-center gap-1.5">
      <FileText className="w-3.5 h-3.5" />
      {loading ? 'Generando...' : 'Reporte PDF'}
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
      <div className="flex items-center gap-2">
        <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
        <p className="text-xs font-semibold text-gray-600">Chat IA sobre este caso</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 h-36 overflow-y-auto space-y-2 text-xs border border-gray-100">
        {msgs.length === 0 && (
          <p className="text-gray-400 text-center mt-8">Hazle una pregunta sobre el caso...</p>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl leading-relaxed ${
              m.role === 'user'
                ? 'bg-brand-600 text-white rounded-br-sm'
                : 'bg-white border border-gray-200 text-gray-700 rounded-bl-sm shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-gray-200 text-gray-400 px-3 py-2 rounded-xl rounded-bl-sm shadow-sm">
              <span className="animate-pulse">Pensando...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input type="text" value={pregunta} onChange={e => setPregunta(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar() } }}
          placeholder="Escribe una pregunta..."
          className="input flex-1 !py-1.5 text-xs" />
        <button onClick={enviar} disabled={loading || !pregunta.trim()}
          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" />
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
      <p className="text-xs font-semibold text-gray-600">Editar notas (Admin)</p>
      <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={3}
        className="input resize-none text-xs"
        placeholder="Notas adicionales..." />
      <button onClick={guardar} disabled={saving}
        className="btn-dark text-xs px-4 py-1.5 flex items-center gap-1.5">
        <Save className="w-3.5 h-3.5" />
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
  const [reevaluando, setReevaluando]   = useState(false)

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
      .catch(() => toast('Error al cargar el historial', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const verDetalle = async (id_caso) => {
    setShowComparar(false)
    try {
      const { data } = await API.get(`/api/historial/${id_caso}`)
      setDetalle(data)
    } catch {
      toast('No se pudo cargar el detalle del caso', 'error')
    }
  }

  const reevaluar = async () => {
    setReevaluando(true)
    try {
      const { data } = await API.put(`/api/historial/${detalle.id_caso}/reevaluar`)
      setDetalle(data)
      cargar()
      toast('Caso existente actualizado con el modelo vigente', 'success')
    } catch {
      toast('Error al re-evaluar el caso', 'error')
    } finally { setReevaluando(false) }
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
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md">
              <Download className="w-4 h-4" />
              {exportando ? 'Exportando...' : 'CSV'}
            </button>
          )}
          <button onClick={cargar} className="btn-secondary text-sm px-4 py-2 flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card p-4 flex gap-3 flex-wrap items-center">
        <Filter className="w-4 h-4 text-gray-400" />
        <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por ID..." className="input !w-auto"
          onKeyDown={e => { if (e.key === 'Enter') cargar() }} />
        <select value={filtroRiesgo} onChange={e => setFiltroRiesgo(e.target.value)} className="input !w-auto">
          <option value="">Todos los niveles</option>
          <option value="BAJO">Bajo</option>
          <option value="MODERADO">Moderado</option>
          <option value="ALTO">Alto</option>
          <option value="CRÍTICO">Crítico</option>
        </select>
        <select value={filtroRec} onChange={e => setFiltroRec(e.target.value)} className="input !w-auto">
          <option value="">Todas las recomendaciones</option>
          <option value="CALIFICA_PENSION_INVALIDEZ">Pensión</option>
          <option value="CONTINUAR_INCAPACIDAD">Continuar</option>
          <option value="REINCORPORACION_CON_TERAPIAS">Reincorporar</option>
          <option value="FORZAR_CALIFICACION_PCL">Forzar PCL</option>
        </select>
        <button onClick={cargar} className="btn-primary text-sm px-4 py-2">
          Filtrar
        </button>
      </div>

      <div className={`grid gap-6 ${detalle ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Tabla */}
        {loading ? (
          <SkeletonTable rows={7} />
        ) : casos.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={FileText}
              title="No hay casos evaluados aún"
              description="Prueba cambiando los filtros o evalúa un nuevo caso para verlo aquí."
            />
          </div>
        ) : (
          <div className="card overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  {['ID', 'Fecha', 'Recomendación', 'Score', 'Riesgo', 'Evaluado por'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {casos.map(c => (
                  <tr key={c.id} onClick={() => verDetalle(c.id_caso)}
                    className={`cursor-pointer transition-colors duration-150 hover:bg-brand-50/50 ${c.es_critico ? 'bg-red-50/50' : ''} ${detalle?.id_caso === c.id_caso ? 'bg-brand-50' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium text-brand-600">
                      {c.es_critico && <span className="mr-1 text-red-500 text-xs">!</span>}{c.id_caso}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(c.fecha).toLocaleDateString('es-CO')}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{REC_LABELS[c.recomendacion] || c.recomendacion}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-800">{c.score_riesgo}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${RISK_STYLES[c.nivel_riesgo] || ''}`}>
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
          <div className="card p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)] animate-slide-up">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-800">Detalle — {detalle.id_caso}</h3>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">Caso existente</span>
                {detalle.es_reevaluacion && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Reevaluado</span>
                )}
              </div>
              <button onClick={() => { setDetalle(null); setShowComparar(false) }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Gauge + recomendación */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <Gauge score={detalle.score_riesgo} />
              <div className="p-3.5 bg-brand-50 rounded-xl border border-brand-100">
                <p className="text-xs text-brand-600 font-medium mb-1">Recomendación</p>
                <p className="text-sm font-bold text-brand-800 leading-snug">{detalle.recomendacion?.replace(/_/g, ' ')}</p>
                <p className="text-xs text-brand-600 mt-1.5">
                  Confianza: {detalle.confianza ? `${(detalle.confianza * 100).toFixed(0)}%` : '100%'}
                </p>
                {detalle.model_version && (
                  <span className="inline-block mt-1.5 text-[10px] font-mono bg-white/60 border border-brand-200 text-brand-500 px-2 py-0.5 rounded-md">
                    Modelo: {detalle.model_version}
                  </span>
                )}
              </div>
            </div>

            {/* Tiempo de recuperación */}
            {detalle.tiempo_recuperacion?.estimado_dias && (
              <div className="p-3.5 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-indigo-100 dark:border-gray-700 flex items-center gap-3">
                <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{detalle.tiempo_recuperacion.estimado_dias}d</div>
                <div>
                  <p className="text-xs font-medium text-indigo-800 dark:text-indigo-200">Estimado recuperación</p>
                  <p className="text-xs text-indigo-500 dark:text-indigo-400">{detalle.tiempo_recuperacion.rango}</p>
                </div>
              </div>
            )}

            {detalle.explicacion && (
              <>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-600 mb-1">Explicación</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{detalle.explicacion.resumen}</p>
                </div>
                {detalle.explicacion.proximos_pasos?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Próximos pasos</p>
                    <ul className="space-y-1">
                      {detalle.explicacion.proximos_pasos.map((p, i) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                          <span className="text-brand-600 font-bold">{i + 1}.</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {detalle.notas_adicionales && !puedeEditar && (
              <div className="p-3.5 bg-yellow-50 rounded-xl border border-yellow-100">
                <p className="text-xs font-medium text-yellow-700 mb-1">Notas</p>
                <p className="text-xs text-yellow-700 leading-relaxed">{detalle.notas_adicionales}</p>
              </div>
            )}

            {puedeEditar && (
              <EditarNotas
                idCaso={detalle.id_caso}
                notasIniciales={detalle.notas_adicionales}
                onGuardado={n => setDetalle(d => ({ ...d, notas_adicionales: n }))}
              />
            )}

            <TimelinePanel idCaso={detalle.id_caso} />
            <RetornoPanel idCaso={detalle.id_caso} />
            <ReincidenciaPanel idCaso={detalle.id_caso} />

            {/* Acciones */}
            <div className="border-t border-gray-100 pt-3 flex items-center gap-2 flex-wrap">
              <DescargarReporte idCaso={detalle.id_caso} />
              <button onClick={() => setShowComparar(v => !v)}
                className="flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs px-3 py-1.5 rounded-lg transition-colors border border-brand-200">
                <Scale className="w-3.5 h-3.5" />
                Comparar
              </button>
              <button onClick={reevaluar} disabled={reevaluando}
                className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 text-amber-700 text-xs px-3 py-1.5 rounded-lg transition-colors border border-amber-200">
                <Zap className="w-3.5 h-3.5" />
                {reevaluando ? 'Evaluando...' : 'Re-evaluar'}
              </button>
            </div>

            {showComparar && (
              <CompararDesdeHistorial
                idCasoActual={detalle.id_caso}
                onClose={() => setShowComparar(false)}
              />
            )}

            <ChatIA idCaso={detalle.id_caso} />
          </div>
        )}
      </div>
    </div>
  )
}
