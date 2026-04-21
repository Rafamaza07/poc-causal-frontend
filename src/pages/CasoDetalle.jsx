import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronRight, Download, RefreshCw, Brain, Send, Loader2,
  ArrowUpRight, ArrowDownRight, Minus, CheckCircle,
  FileText, Plus, Calendar, Building2, X, Clock,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea,
} from 'recharts'
import API from '../api/client'
import Tabs from '../Components/ui/Tabs'
import RutaTerminalCard from '../Components/data/RutaTerminalCard'
import ScoreBloques from '../Components/data/ScoreBloques'
import ScoreGauge from '../Components/charts/ScoreGauge'
import MilestoneBar from '../Components/charts/MilestoneBar'
import ScoreBadge from '../Components/data/ScoreBadge'
import SeverityTag from '../Components/data/SeverityTag'
import AlertItem from '../Components/data/AlertItem'
import { useToast } from '../Components/Toast'
import { formatDate } from '../utils/formatters'
import { RECOMENDACIONES } from '../utils/constants'

const TABS = [
  { id: 'resumen',        label: 'Resumen' },
  { id: 'evaluaciones',   label: 'Evaluaciones' },
  { id: 'alertas',        label: 'Alertas' },
  { id: 'documentacion',  label: 'Documentación' },
  { id: 'ruta_decision',  label: 'Ruta de decisión' },
  { id: 'chat',           label: 'Chat' },
]

const CHECKLIST_GROUPS = [
  {
    label: 'Clínico',
    items: [
      { key: 'historia_clinica_completa',   label: 'Historia clínica completa' },
      { key: 'epicrisis',                   label: 'Epicrisis' },
      { key: 'imagenes_y_laboratorios',     label: 'Imágenes y laboratorios' },
      { key: 'terapias_y_rehabilitacion',   label: 'Terapias y rehabilitación' },
      { key: 'incapacidades_completas',     label: 'Incapacidades completas' },
    ],
  },
  {
    label: 'Entidades y trámites',
    items: [
      { key: 'radicaciones_eps',            label: 'Radicaciones EPS' },
      { key: 'radicaciones_afp',            label: 'Radicaciones AFP' },
      { key: 'radicaciones_arl',            label: 'Radicaciones ARL' },
      { key: 'concepto_rehabilitacion',     label: 'Concepto de rehabilitación' },
      { key: 'dictamen_pcl',                label: 'Dictamen PCL' },
      { key: 'recurso_o_impugnacion',       label: 'Recurso o impugnación' },
    ],
  },
  {
    label: 'Ocupacional / SST',
    items: [
      { key: 'perfil_del_cargo',            label: 'Perfil del cargo' },
      { key: 'evaluacion_del_puesto',       label: 'Evaluación del puesto' },
      { key: 'acta_reintegro_o_reubicacion', label: 'Acta de reintegro o reubicación' },
      { key: 'seguimiento_posterior',       label: 'Seguimiento posterior' },
    ],
  },
]

const CANALES = ['email', 'portal', 'telefónico', 'personal', 'otro']

const DEFAULT_GESTION = {
  fecha_gestion: new Date().toISOString().split('T')[0],
  entidad_contactada: '',
  canal_usado: '',
  respuesta_recibida: '',
  pendiente_generado: '',
  responsable_interno: '',
  fecha_proxima_gestion: '',
}

const REC_STYLES = {
  REINCORPORACION_INMEDIATA:    'bg-emerald-50 text-emerald-800 border-emerald-200',
  REINCORPORACION_CON_TERAPIAS: 'bg-blue-50 text-blue-800 border-blue-200',
  CONTINUAR_INCAPACIDAD:        'bg-amber-50 text-amber-800 border-amber-200',
  PENSION_INVALIDEZ:            'bg-red-50 text-red-800 border-red-200',
  CALIFICA_PENSION_INVALIDEZ:   'bg-red-50 text-red-800 border-red-200',
  FORZAR_CALIFICACION_PCL:      'bg-orange-50 text-orange-800 border-orange-200',
}

// ─── Barra dual comparativa CIE-10 ───────────────────────────────────────────
function BarDual({ label, casoVal, refMin, refMax, unit = 'días' }) {
  const maxVal = Math.max(casoVal, refMax, 1) * 1.1
  const casoPct = (casoVal / maxVal) * 100
  const refMinPct = (refMin / maxVal) * 100
  const refMaxPct = (refMax / maxVal) * 100

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span className="font-medium text-gray-800">{casoVal} {unit}</span>
      </div>
      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute top-0 h-full bg-emerald-100 rounded-full"
          style={{ left: `${refMinPct}%`, width: `${Math.max(refMaxPct - refMinPct, 2)}%` }}
        />
        <div
          className="absolute top-1 h-2 bg-brand-500 rounded-full transition-all duration-500"
          style={{ width: `${casoPct}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-400">Rango típico: {refMin}–{refMax} {unit}</p>
    </div>
  )
}

// ─── Chat embebido con case_id pre-cargado ────────────────────────────────────
function ChatEmbebido({ caseId }) {
  const [msgs, setMsgs]     = useState([])
  const [input, setInput]   = useState('')
  const [sending, setSend]  = useState(false)
  const bottomRef           = useRef()

  const send = async () => {
    const q = input.trim()
    if (!q || sending) return
    setMsgs(m => [...m, { role: 'user', content: q }])
    setInput('')
    setSend(true)
    try {
      const { data } = await API.post('/api/v1/chat', {
        pregunta: q,
        case_id: caseId,
        session_id: crypto.randomUUID(),
      })
      setMsgs(m => [...m, {
        role: 'assistant',
        content: data.respuesta ?? data.response ?? 'Sin respuesta del servidor.',
      }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: 'Error al procesar la pregunta.' }])
    } finally {
      setSend(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 460 }}>
      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
        <div className="flex justify-start">
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 max-w-[85%] animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-3.5 h-3.5 text-brand-600" />
              <span className="text-xs font-semibold text-brand-700">Asistente IA</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Estoy listo para responder preguntas sobre el caso{' '}
              <span className="font-semibold text-brand-700">{caseId}</span>.
              Los datos del caso ya están en mi contexto.
            </p>
          </div>
        </div>

        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={[
              'px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap',
              m.role === 'user'
                ? 'bg-brand-600 text-white rounded-br-sm'
                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm',
            ].join(' ')}>
              {m.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Pregunta sobre el caso..."
          className="input flex-1"
        />
        <button
          onClick={send}
          disabled={!input.trim() || sending}
          className="w-10 h-10 flex-shrink-0 rounded-full bg-brand-600 text-white flex items-center
            justify-center hover:bg-brand-700 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {sending
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Send className="w-4 h-4" />
          }
        </button>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function CasoDetalle() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const toast     = useToast()

  const [caso,      setCaso]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [timeline,  setTimeline]  = useState(null)
  const [alertas,   setAlertas]   = useState([])
  const [activeTab, setActiveTab] = useState('resumen')
  const [reeval,    setReeval]    = useState(false)
  const [descarga,  setDescarga]  = useState(false)

  // ── Checklist + Bitácora (6.2) ──────────────────────────────────────────
  const [checklist,     setChecklist]     = useState(null)
  const [bitacora,      setBitacora]      = useState([])
  const [savingCheck,   setSavingCheck]   = useState(false)
  const [modalBitacora, setModalBitacora] = useState(false)
  const [nuevaGestion,  setNuevaGestion]  = useState({ ...DEFAULT_GESTION })
  const [savingGestion, setSavingGestion] = useState(false)

  useEffect(() => {
    setLoading(true)
    API.get(`/api/historial/${id}`)
      .then(r => setCaso(r.data))
      .catch(() => toast('No se pudo cargar el caso', 'error'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    API.get(`/api/casos/${id}/timeline`)
      .then(r => setTimeline(r.data))
      .catch(() => {})
  }, [id])

  useEffect(() => {
    API.get(`/api/v1/alerts?case_id=${id}`)
      .then(r => {
        const d = r.data
        setAlertas(Array.isArray(d) ? d : (d.alerts ?? d.items ?? []))
      })
      .catch(() => {})
  }, [id])

  useEffect(() => {
    API.get(`/api/v1/casos/${id}/checklist`)
      .then(r => setChecklist(r.data))
      .catch(() => {})
  }, [id])

  useEffect(() => {
    API.get(`/api/v1/casos/${id}/bitacora`)
      .then(r => setBitacora(r.data?.entradas ?? []))
      .catch(() => {})
  }, [id])

  const reevaluar = async () => {
    setReeval(true)
    try {
      const { data } = await API.put(`/api/historial/${id}/reevaluar`)
      setCaso(data)
      toast('Caso re-evaluado exitosamente', 'success')
    } catch {
      toast('Error al re-evaluar', 'error')
    } finally { setReeval(false) }
  }

  const descargarPDF = async () => {
    setDescarga(true)
    try {
      const res = await API.get(`/api/casos/${id}/reporte-pdf`, { responseType: 'blob' })
      const url  = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reporte-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast('Reporte descargado', 'success')
    } catch {
      toast('Error al generar el reporte', 'error')
    } finally { setDescarga(false) }
  }

  const acknowledgeAlerta = async (alertId) => {
    try {
      await API.patch(`/api/v1/alerts/${alertId}/acknowledge`)
      setAlertas(prev => prev.filter(a => a.id !== alertId))
      toast('Alerta reconocida', 'success')
    } catch {
      toast('Error al reconocer la alerta', 'error')
    }
  }

  const handleChecklistToggle = async (field, value) => {
    setSavingCheck(true)
    try {
      const { data } = await API.put(`/api/v1/casos/${id}/checklist`, { [field]: value })
      setChecklist(data)
    } catch {
      toast('Error al actualizar checklist', 'error')
    } finally { setSavingCheck(false) }
  }

  const handleAgregarGestion = async () => {
    if (!nuevaGestion.entidad_contactada.trim() || !nuevaGestion.fecha_gestion) {
      toast('Entidad contactada y fecha son obligatorios', 'error')
      return
    }
    setSavingGestion(true)
    try {
      const payload = {
        fecha_gestion: nuevaGestion.fecha_gestion,
        entidad_contactada: nuevaGestion.entidad_contactada,
        canal_usado: nuevaGestion.canal_usado || null,
        respuesta_recibida: nuevaGestion.respuesta_recibida || null,
        pendiente_generado: nuevaGestion.pendiente_generado || null,
        responsable_interno: nuevaGestion.responsable_interno || null,
        fecha_proxima_gestion: nuevaGestion.fecha_proxima_gestion || null,
      }
      const { data } = await API.post(`/api/v1/casos/${id}/bitacora`, payload)
      setBitacora(prev =>
        [...prev, data].sort((a, b) =>
          new Date(a.fecha_gestion) - new Date(b.fecha_gestion)
        )
      )
      setModalBitacora(false)
      setNuevaGestion({ ...DEFAULT_GESTION })
      toast('Gestión registrada', 'success')
    } catch {
      toast('Error al registrar gestión', 'error')
    } finally { setSavingGestion(false) }
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
      <div className="h-5 bg-gray-200 rounded w-48" />
      <div className="h-32 bg-gray-100 rounded-2xl" />
      <div className="h-64 bg-gray-100 rounded-2xl" />
    </div>
  )

  if (!caso) return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <p className="text-gray-500 mb-4">No se encontró el caso {id}</p>
      <button onClick={() => navigate('/historial')} className="btn-primary text-sm px-4 py-2">
        Volver al historial
      </button>
    </div>
  )

  const rec      = caso.recomendacion ?? ''
  const recStyle = REC_STYLES[rec] || 'bg-gray-50 text-gray-700 border-gray-200'
  const recLabel = RECOMENDACIONES[rec]?.label || rec.replace(/_/g, ' ')

  const scoreHistory  = timeline?.evolucion_score ?? []
  const timelineItems = timeline?.timeline ?? []

  const comorbilidades = Array.isArray(caso.comorbilidades)
    ? caso.comorbilidades.join(', ')
    : caso.comorbilidades

  const metaFields = [
    { label: 'Edad',             val: caso.edad != null ? `${caso.edad} años` : null },
    { label: 'CIE-10',           val: caso.diagnostico_principal || caso.cie10 },
    { label: 'Días incapacidad', val: caso.dias_incapacidad != null ? `${caso.dias_incapacidad} días` : null },
    { label: 'PCL',              val: caso.pcl != null ? `${caso.pcl}%` : null },
    { label: 'Pronóstico',       val: caso.pronostico },
    { label: 'Tratamiento',      val: caso.tratamiento },
    { label: 'Comorbilidades',   val: comorbilidades },
    { label: 'Modelo',           val: caso.model_version },
  ].filter(f => f.val)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <button
          onClick={() => navigate('/historial')}
          className="hover:text-brand-600 transition-colors"
        >
          Historial
        </button>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-gray-800 font-medium truncate">{caso.id_caso}</span>
      </nav>

      {/* ── Header card ────────────────────────────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{caso.id_caso}</h1>
              <ScoreBadge score={caso.score_riesgo} size="lg" />
              <SeverityTag severity={caso.nivel_riesgo} size="md" />
              {checklist != null && (
                <span className={[
                  'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                  checklist.completitud_pct >= 75
                    ? 'bg-emerald-100 text-emerald-700'
                    : checklist.completitud_pct >= 40
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-600',
                ].join(' ')}>
                  <FileText className="w-3 h-3" />
                  {checklist.completitud_pct}% docs
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {[
                caso.evaluado_por && `Evaluado por ${caso.evaluado_por}`,
                caso.fecha && formatDate(caso.fecha),
                caso.eps,
                caso.arl,
              ].filter(Boolean).join(' · ')}
            </p>
            {rec && (
              <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full border ${recStyle}`}>
                {recLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={descargarPDF}
              disabled={descarga}
              className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              {descarga ? 'Generando...' : 'Descargar PDF'}
            </button>
            <button
              onClick={reevaluar}
              disabled={reeval}
              className="btn-secondary text-sm px-4 py-2 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${reeval ? 'animate-spin' : ''}`} />
              {reeval ? 'Evaluando...' : 'Re-evaluar'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB: RESUMEN                                                        */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'resumen' && (
        <div className="space-y-6 animate-fade-in">

          {/* 2 columnas: Gauge + datos paciente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Izquierda: Gauge + recomendación */}
            <div className="card p-5 flex flex-col items-center gap-4">
              <ScoreGauge score={caso.score_riesgo} size={220} />
              <div className={`w-full p-4 rounded-xl border ${recStyle}`}>
                <p className="text-xs font-medium opacity-70 mb-1">Recomendación</p>
                <p className="font-bold text-base leading-snug">{recLabel}</p>
                {caso.confianza != null && (
                  <p className="text-xs mt-1.5 opacity-70">
                    Confianza: {(caso.confianza * 100).toFixed(0)}%
                  </p>
                )}
              </div>
            </div>

            {/* Derecha: grid de datos del caso */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Datos del caso</h3>
              {metaFields.length === 0 ? (
                <p className="text-sm text-gray-400">Sin datos adicionales registrados.</p>
              ) : (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {metaFields.map(({ label, val }) => (
                    <div key={label} className="min-w-0">
                      <dt className="text-xs text-gray-400 mb-0.5">{label}</dt>
                      <dd className="text-sm font-medium text-gray-800 truncate" title={val}>{val}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>

          {/* Análisis de IA */}
          {caso.explicacion?.resumen && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-semibold text-gray-700">Análisis de IA</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{caso.explicacion.resumen}</p>
              {caso.explicacion.proximos_pasos?.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {caso.explicacion.proximos_pasos.map((paso, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-brand-600 font-bold flex-shrink-0">{i + 1}.</span>
                      {paso}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Scoring por bloques */}
          {caso?.scoring_bloques && (
            <ScoreBloques scoring={caso.scoring_bloques} />
          )}

          {/* MilestoneBar */}
          {caso.dias_incapacidad != null && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-5">
                Posición en hitos normativos
              </h3>
              <MilestoneBar diasActuales={caso.dias_incapacidad} />
            </div>
          )}

          {/* Comparativa CIE-10 */}
          {caso.cie10_referencia && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Tu caso vs referencia CIE-10
                {(caso.diagnostico_principal || caso.cie10) && (
                  <span className="ml-2 text-xs font-mono text-gray-400">
                    {caso.diagnostico_principal || caso.cie10}
                  </span>
                )}
              </h3>
              <div className="space-y-4">
                {caso.cie10_referencia.dias_tipico_min != null && (
                  <BarDual
                    label="Días de incapacidad"
                    casoVal={caso.dias_incapacidad ?? 0}
                    refMin={caso.cie10_referencia.dias_tipico_min}
                    refMax={caso.cie10_referencia.dias_tipico_max}
                  />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Franja verde = rango típico para este diagnóstico según CIE-10
              </p>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB: EVALUACIONES                                                   */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'evaluaciones' && (
        <div className="space-y-6 animate-fade-in">

          {/* Gráfico de evolución */}
          {scoreHistory.length >= 2 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Evolución del score</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={scoreHistory} margin={{ top: 8, right: 16, bottom: 4, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
                    formatter={v => [`${v}/100`, 'Score']}
                  />
                  {/* Zonas de color por rango */}
                  <ReferenceArea y1={0}  y2={25}  fill="#d1fae5" fillOpacity={0.35} />
                  <ReferenceArea y1={25} y2={50}  fill="#fef3c7" fillOpacity={0.35} />
                  <ReferenceArea y1={50} y2={75}  fill="#ffedd5" fillOpacity={0.35} />
                  <ReferenceArea y1={75} y2={100} fill="#fee2e2" fillOpacity={0.35} />
                  <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 2"
                    label={{ value: 'Crítico', position: 'insideTopRight', fontSize: 9, fill: '#ef4444' }} />
                  <ReferenceLine y={50} stroke="#f97316" strokeDasharray="4 2"
                    label={{ value: 'Alto', position: 'insideTopRight', fontSize: 9, fill: '#f97316' }} />
                  <ReferenceLine y={25} stroke="#f59e0b" strokeDasharray="4 2"
                    label={{ value: 'Moderado', position: 'insideTopRight', fontSize: 9, fill: '#f59e0b' }} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: '#3b82f6', cursor: 'pointer' }}
                    activeDot={{ r: 7, fill: '#1d4ed8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Timeline vertical */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Historial de evaluaciones
              {timeline?.total_evaluaciones != null && (
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  {timeline.total_evaluaciones} en total
                </span>
              )}
            </h3>

            {timelineItems.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">
                Solo hay una evaluación registrada para este caso.
              </p>
            ) : (
              <div>
                {timelineItems.map((item, i) => {
                  const prev  = timelineItems[i - 1]
                  const delta = prev?.score != null && item.score != null
                    ? item.score - prev.score
                    : null

                  return (
                    <div key={i} className="flex gap-3">
                      {/* Dot + línea vertical */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-brand-500 mt-1.5 ring-4 ring-brand-50 flex-shrink-0" />
                        {i < timelineItems.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 mt-1 min-h-[2rem]" />
                        )}
                      </div>

                      {/* Contenido */}
                      <div className="pb-5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.score != null && <ScoreBadge score={item.score} size="sm" />}
                          <span className="text-xs text-gray-400">
                            {item.fecha ? formatDate(item.fecha) : '—'}
                          </span>
                          {item.evaluador && (
                            <span className="text-xs text-gray-500">· {item.evaluador}</span>
                          )}
                          {/* Delta respecto a evaluación anterior */}
                          {delta !== null && (
                            <span className={`text-xs font-semibold flex items-center gap-0.5 ${
                              delta > 0 ? 'text-red-600' : delta < 0 ? 'text-emerald-600' : 'text-gray-400'
                            }`}>
                              {delta > 0
                                ? <ArrowUpRight className="w-3 h-3" />
                                : delta < 0
                                  ? <ArrowDownRight className="w-3 h-3" />
                                  : <Minus className="w-3 h-3" />}
                              {delta > 0 ? '+' : ''}{Math.round(delta)}
                            </span>
                          )}
                        </div>
                        {item.recomendacion && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.recomendacion.replace(/_/g, ' ')}
                          </p>
                        )}
                        {item.notas && (
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.notas}</p>
                        )}
                        {item.hito_alcanzado && (
                          <span className="inline-block mt-1.5 text-xs bg-amber-100 text-amber-800
                            px-2 py-0.5 rounded-full font-medium">
                            Hito: {item.hito_alcanzado}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB: ALERTAS                                                        */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'alertas' && (
        <div className="card p-5 animate-fade-in">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Alertas del caso
            {alertas.length > 0 && (
              <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                {alertas.length}
              </span>
            )}
          </h3>
          {alertas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <CheckCircle className="w-10 h-10 mb-3 text-emerald-300" />
              <p className="text-sm">No hay alertas activas para este caso</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alertas.map(a => (
                <AlertItem key={a.id} alert={a} onAcknowledge={acknowledgeAlerta} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB: DOCUMENTACIÓN                                                  */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'documentacion' && (
        <div className="space-y-6 animate-fade-in">

          {/* ── Checklist ─────────────────────────────────────────────────── */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-semibold text-gray-700">Checklist documental</h3>
              </div>
              {checklist != null && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {checklist.completitud_pct}% completado
                  </span>
                  {savingCheck && <Loader2 className="w-4 h-4 animate-spin text-brand-500" />}
                </div>
              )}
            </div>

            {/* Barra de progreso */}
            {checklist != null && (
              <div className="mb-5">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={[
                      'h-full rounded-full transition-all duration-500',
                      checklist.completitud_pct >= 75
                        ? 'bg-emerald-500'
                        : checklist.completitud_pct >= 40
                          ? 'bg-amber-400'
                          : 'bg-red-400',
                    ].join(' ')}
                    style={{ width: `${checklist.completitud_pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {checklist.completitud_pct < 60
                    ? 'Expediente incompleto — riesgo de demora en calificación'
                    : checklist.completitud_pct < 100
                      ? 'Expediente en progreso'
                      : 'Expediente completo'}
                </p>
              </div>
            )}

            {/* Grupos de ítems */}
            <div className="space-y-5">
              {CHECKLIST_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.items.map(item => {
                      const checked = checklist?.[item.key] ?? false
                      return (
                        <label
                          key={item.key}
                          className={[
                            'flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer',
                            'transition-colors hover:bg-gray-50 select-none',
                            checked
                              ? 'border-emerald-200 bg-emerald-50'
                              : 'border-gray-200 bg-white',
                            savingCheck ? 'pointer-events-none opacity-60' : '',
                          ].join(' ')}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={e => handleChecklistToggle(item.key, e.target.checked)}
                            className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                          />
                          <span className={[
                            'text-sm leading-snug',
                            checked ? 'text-emerald-800 font-medium' : 'text-gray-600',
                          ].join(' ')}>
                            {item.label}
                          </span>
                          {checked && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto flex-shrink-0" />}
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bitácora de gestión ────────────────────────────────────────── */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-semibold text-gray-700">
                  Bitácora de gestión
                  {bitacora.length > 0 && (
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      {bitacora.length} {bitacora.length === 1 ? 'entrada' : 'entradas'}
                    </span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => setModalBitacora(true)}
                className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700
                  font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Añadir gestión
              </button>
            </div>

            {bitacora.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Clock className="w-8 h-8 mb-2 text-gray-200" />
                <p className="text-sm">Aún no hay gestiones registradas</p>
                <button
                  onClick={() => setModalBitacora(true)}
                  className="mt-3 text-sm text-brand-600 hover:underline"
                >
                  Registrar primera gestión →
                </button>
              </div>
            ) : (
              <div>
                {bitacora.map((entry, i) => (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-brand-400 mt-1.5 ring-4 ring-brand-50 flex-shrink-0" />
                      {i < bitacora.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200 mt-1 min-h-[2rem]" />
                      )}
                    </div>
                    <div className="pb-5 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-gray-400" />
                            {entry.entidad_contactada}
                          </span>
                          {entry.canal_usado && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {entry.canal_usado}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                          <Calendar className="w-3 h-3" />
                          {entry.fecha_gestion}
                        </span>
                      </div>
                      {entry.respuesta_recibida && (
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          <span className="font-medium text-gray-500">Respuesta: </span>
                          {entry.respuesta_recibida}
                        </p>
                      )}
                      {entry.pendiente_generado && (
                        <p className="text-sm text-amber-700 mt-1 bg-amber-50 px-2 py-1 rounded">
                          <span className="font-medium">Pendiente: </span>
                          {entry.pendiente_generado}
                        </p>
                      )}
                      {entry.fecha_proxima_gestion && (
                        <p className="text-xs text-gray-400 mt-1">
                          Próxima gestión: {entry.fecha_proxima_gestion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL: Añadir gestión                                               */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {modalBitacora && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalBitacora(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg animate-scale-in overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Registrar gestión</h3>
              <button
                onClick={() => setModalBitacora(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full
                  hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Fecha de gestión *
                  </label>
                  <input
                    type="date"
                    value={nuevaGestion.fecha_gestion}
                    onChange={e => setNuevaGestion(p => ({ ...p, fecha_gestion: e.target.value }))}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Canal
                  </label>
                  <select
                    value={nuevaGestion.canal_usado}
                    onChange={e => setNuevaGestion(p => ({ ...p, canal_usado: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">Seleccionar</option>
                    {CANALES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Entidad contactada *
                </label>
                <input
                  type="text"
                  value={nuevaGestion.entidad_contactada}
                  onChange={e => setNuevaGestion(p => ({ ...p, entidad_contactada: e.target.value }))}
                  placeholder="EPS, AFP, ARL, Junta, Empleador..."
                  className="input w-full"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Respuesta recibida
                </label>
                <textarea
                  value={nuevaGestion.respuesta_recibida}
                  onChange={e => setNuevaGestion(p => ({ ...p, respuesta_recibida: e.target.value }))}
                  placeholder="Describe la respuesta o resultado..."
                  rows={3}
                  className="input w-full resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Pendiente generado
                </label>
                <textarea
                  value={nuevaGestion.pendiente_generado}
                  onChange={e => setNuevaGestion(p => ({ ...p, pendiente_generado: e.target.value }))}
                  placeholder="Acciones pendientes resultado de esta gestión..."
                  rows={2}
                  className="input w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Responsable interno
                  </label>
                  <input
                    type="text"
                    value={nuevaGestion.responsable_interno}
                    onChange={e => setNuevaGestion(p => ({ ...p, responsable_interno: e.target.value }))}
                    placeholder="Nombre o cargo"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Próxima gestión
                  </label>
                  <input
                    type="date"
                    value={nuevaGestion.fecha_proxima_gestion}
                    onChange={e => setNuevaGestion(p => ({ ...p, fecha_proxima_gestion: e.target.value }))}
                    className="input w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 pb-5">
              <button
                onClick={() => setModalBitacora(false)}
                className="btn-secondary text-sm px-4 py-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleAgregarGestion}
                disabled={savingGestion}
                className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
              >
                {savingGestion
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                  : <><Plus className="w-4 h-4" /> Registrar gestión</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB: RUTA DE DECISIÓN                                              */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ruta_decision' && (
        <div className="space-y-6 animate-fade-in">

          {/* Ruta actual */}
          {caso?.ruta_terminal ? (
            <RutaTerminalCard resultado={caso} />
          ) : (
            <div className="card p-8 text-center">
              <p className="text-sm text-gray-400">
                Este caso aún no tiene una ruta de decisión calculada.
                Re-evalúa el caso para generar la ruta según el marco clínico-jurídico.
              </p>
            </div>
          )}

          {/* Historial de rutas asignadas */}
          {timelineItems.filter(t => t.ruta_terminal).length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Historial de rutas asignadas
              </h3>
              <div className="space-y-3">
                {[...timelineItems].reverse().filter(t => t.ruta_terminal).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-400 flex-shrink-0 w-24">
                      {item.fecha ? formatDate(item.fecha) : '—'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                      bg-gray-100 text-gray-700 border border-gray-200">
                      {item.ruta_terminal?.replace(/_/g, ' ')}
                    </span>
                    {item.evaluado_por && (
                      <span className="text-xs text-gray-400 ml-auto">por {item.evaluado_por}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB: CHAT                                                           */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'chat' && (
        <div className="card p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Chat IA — contexto: {caso.id_caso}
            </h3>
          </div>
          <ChatEmbebido caseId={id} />
        </div>
      )}
    </div>
  )
}
