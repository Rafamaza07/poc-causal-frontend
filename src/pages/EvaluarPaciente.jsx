import { useState, useRef, useMemo } from 'react'
import { FileUp, Send, ArrowRight, Download, SlidersHorizontal, Tag } from 'lucide-react'
import API from '../api/client'
import Gauge from '../Components/Gauge'
import { useToast } from '../Components/Toast'

const REC_STYLES = {
  'CALIFICA_PENSION_INVALIDEZ':   'bg-red-50 border-red-300 text-red-800',
  'CONTINUAR_INCAPACIDAD':        'bg-yellow-50 border-yellow-300 text-yellow-800',
  'REINCORPORACION_CON_TERAPIAS': 'bg-green-50 border-green-300 text-green-800',
  'FORZAR_CALIFICACION_PCL':      'bg-orange-50 border-orange-300 text-orange-800',
}
const INIT = {
  id_caso:'', edad:'', dias_incapacidad_acumulados:'', porcentaje_pcl:'',
  tipo_enfermedad:'comun', en_tratamiento_activo:1, pronostico_medico:'reservado',
  comorbilidades:'', requiere_reubicacion_laboral:0, notas_adicionales:''
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function calcularScoreLocal({ porcentaje_pcl, dias_incapacidad_acumulados, pronostico_medico, comorbilidades, en_tratamiento_activo }) {
  const pcl   = parseFloat(porcentaje_pcl)  || 0
  const dias  = parseInt(dias_incapacidad_acumulados) || 0
  const comor = parseInt(comorbilidades)    || 0
  const trat  = parseInt(en_tratamiento_activo)

  let score = 0
  score += pcl * 0.40
  score += Math.min(dias / 540, 1.0) * 25
  score += { malo: 20, reservado: 10, favorable: 0 }[pronostico_medico] ?? 10
  score += Math.min(comor * 3, 10)
  if (!trat) score += 5
  return Math.round(Math.min(score, 100) * 10) / 10
}

function WhatIf({ base }) {
  const [pcl,    setPcl]    = useState(parseFloat(base.porcentaje_pcl)              || 0)
  const [dias,   setDias]   = useState(parseInt(base.dias_incapacidad_acumulados)   || 0)

  const scoreBase = useMemo(() => calcularScoreLocal(base), [base])
  const scoreWhatIf = useMemo(() => calcularScoreLocal({
    ...base, porcentaje_pcl: pcl, dias_incapacidad_acumulados: dias,
  }), [base, pcl, dias])

  const delta = Math.round((scoreWhatIf - scoreBase) * 10) / 10
  const deltaColor = delta > 0 ? 'text-red-600' : delta < 0 ? 'text-green-600' : 'text-gray-500'

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-200/60 p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
          <SlidersHorizontal className="w-4.5 h-4.5 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-indigo-800">Predictor "What-If"</p>
          <p className="text-xs text-indigo-500 mt-0.5">Ajusta valores y ve cómo cambia el score en tiempo real</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-medium text-indigo-700 mb-1.5 block">PCL: {pcl}%</label>
          <input type="range" min={0} max={100} step={0.5} value={pcl}
            onChange={e => setPcl(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 h-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-indigo-700 mb-1.5 block">Días incapacidad: {dias}</label>
          <input type="range" min={0} max={600} step={5} value={dias}
            onChange={e => setDias(parseInt(e.target.value))}
            className="w-full accent-indigo-600 h-2" />
        </div>
      </div>
      <div className="flex items-center gap-6 bg-white/60 rounded-xl p-4 border border-indigo-100">
        <div className="text-center flex-1">
          <p className="text-xs text-indigo-500 font-medium">Score base</p>
          <p className="text-2xl font-bold text-indigo-800 mt-0.5">{scoreBase}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-indigo-300 flex-shrink-0" />
        <div className="text-center flex-1">
          <p className="text-xs text-indigo-500 font-medium">Score proyectado</p>
          <p className="text-2xl font-bold text-indigo-800 mt-0.5">{scoreWhatIf}</p>
        </div>
        <div className="text-center flex-1 border-l border-indigo-200 pl-4">
          <p className="text-xs text-indigo-500 font-medium">Cambio</p>
          <p className={`text-xl font-bold mt-0.5 ${deltaColor}`}>{delta > 0 ? '+' : ''}{delta}</p>
        </div>
      </div>
    </div>
  )
}

function ClasificadorCIE10() {
  const toast = useToast()
  const [texto, setTexto]   = useState('')
  const [data, setData]     = useState(null)
  const [loading, setLoad]  = useState(false)
  const [open, setOpen]     = useState(false)

  const clasificar = async () => {
    if (!texto.trim()) return
    setLoad(true); setData(null)
    try {
      const { data: d } = await API.post('/api/clasificar-cie10', { texto_clinico: texto })
      setData(d)
    } catch (err) {
      toast(err.response?.data?.detail || 'Error al clasificar', 'error')
    } finally { setLoad(false) }
  }

  const conf = data ? Math.round(data.confianza * 100) : 0
  const confColor = conf >= 80 ? 'text-green-700' : conf >= 50 ? 'text-amber-700' : 'text-red-600'

  return (
    <div className="card p-5 space-y-3">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
          <Tag className="w-5 h-5 text-teal-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Clasificador CIE-10</p>
          <p className="text-xs text-gray-400 mt-0.5">Convierte texto clínico libre a código CIE-10</p>
        </div>
        <span className="text-xs text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="space-y-3 animate-fade-in">
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            rows={3}
            placeholder="Ej: Lumbalgia crónica por hernia discal L4-L5 con radiculopatía derecha..."
            className="input resize-none text-sm w-full"
          />
          <button onClick={clasificar} disabled={loading || !texto.trim()}
            className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            {loading ? 'Clasificando...' : 'Clasificar'}
          </button>

          {data && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-xl border border-teal-200">
                <div className="text-center px-4 border-r border-teal-200">
                  <p className="text-2xl font-bold text-teal-800">{data.codigo_cie10}</p>
                  <p className={`text-xs font-medium mt-0.5 ${confColor}`}>{conf}% confianza</p>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-teal-800 leading-snug">{data.descripcion_oficial}</p>
                  <p className="text-xs text-teal-600 mt-0.5">{data.categoria}</p>
                </div>
              </div>
              {data.codigos_alternativos?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">Alternativos</p>
                  {data.codigos_alternativos.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      <span className="font-bold text-gray-800 shrink-0">{c.codigo}</span>
                      <span>{c.descripcion} — <span className="text-gray-400">{c.razon}</span></span>
                    </div>
                  ))}
                </div>
              )}
              {data.notas_codificacion && (
                <p className="text-xs text-gray-500 italic">{data.notas_codificacion}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function EvaluarPaciente() {
  const toast = useToast()
  const [form, setForm]                 = useState(INIT)
  const [result, setResult]             = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [pdfLoading, setPdfLoading]     = useState(false)
  const [pdfMsg, setPdfMsg]             = useState('')
  const [reporteLoading, setReporteLoading] = useState(false)
  const fileRef                         = useRef()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const descargarReporte = async (id_caso) => {
    setReporteLoading(true)
    try {
      const res = await API.get(`/api/casos/${id_caso}/reporte-pdf`, { responseType: 'blob' })
      const url  = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reporte-${id_caso}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast('Reporte PDF descargado', 'success')
    } catch {
      toast('Error al generar el reporte', 'error')
    } finally { setReporteLoading(false) }
  }

  const handlePdf = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfLoading(true); setPdfMsg('')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const { data } = await API.post('/api/analizar-pdf', fd)
      const c = data.campos_extraidos
      setForm(f => ({
        ...f,
        id_caso:                      c.id_caso                     ?? f.id_caso,
        edad:                         c.edad                        ?? f.edad,
        dias_incapacidad_acumulados:  c.dias_incapacidad_acumulados ?? f.dias_incapacidad_acumulados,
        porcentaje_pcl:               c.porcentaje_pcl              ?? f.porcentaje_pcl,
        tipo_enfermedad:              c.tipo_enfermedad             ?? f.tipo_enfermedad,
        en_tratamiento_activo:        c.en_tratamiento_activo       ?? f.en_tratamiento_activo,
        pronostico_medico:            c.pronostico_medico           ?? f.pronostico_medico,
        comorbilidades:               c.comorbilidades              ?? f.comorbilidades,
        requiere_reubicacion_laboral: c.requiere_reubicacion_laboral ?? f.requiere_reubicacion_laboral,
        notas_adicionales:            c.notas_adicionales           ?? f.notas_adicionales,
      }))
      setPdfMsg(`PDF analizado: ${data.archivo} (${data.texto_extraido_chars} chars)`)
      toast('PDF analizado — formulario prellenado', 'success')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al analizar el PDF'
      setPdfMsg(msg)
      toast(msg, 'error')
    } finally {
      setPdfLoading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await API.post('/api/evaluar-caso', {
        ...form,
        edad:                         parseFloat(form.edad),
        dias_incapacidad_acumulados:  parseInt(form.dias_incapacidad_acumulados),
        porcentaje_pcl:               parseFloat(form.porcentaje_pcl),
        comorbilidades:               parseInt(form.comorbilidades),
        en_tratamiento_activo:        parseInt(form.en_tratamiento_activo),
        requiere_reubicacion_laboral: parseInt(form.requiere_reubicacion_laboral),
      })
      setResult(data)
      const msg = data.caso_existente
        ? `ID ya existente — nueva evaluación guardada · Score: ${data.score_riesgo}/100`
        : `Caso evaluado — Score: ${data.score_riesgo}/100`
      toast(msg, data.es_critico ? 'warning' : 'success')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al evaluar el caso'
      setError(msg)
      toast(msg, 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Evaluar Paciente</h1>
        <p className="text-gray-500 text-sm mt-1">Ingresa los datos clínicos para obtener una recomendación</p>
      </div>

      {/* Analizar PDF */}
      <div className="card p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <FileUp className="w-5 h-5 text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700">Prellenar desde historia clínica (PDF)</p>
          <p className="text-xs text-gray-400 mt-0.5">La IA extraerá los campos automáticamente</p>
        </div>
        <input ref={fileRef} type="file" accept=".pdf" onChange={handlePdf}
          className="hidden" id="pdf-input" />
        <label htmlFor="pdf-input"
          className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            pdfLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'btn-dark'
          }`}>
          <FileUp className="w-4 h-4" />
          {pdfLoading ? 'Analizando...' : 'Subir PDF'}
        </label>
        {pdfMsg && (
          <span className={`text-xs flex-shrink-0 ${pdfMsg.startsWith('PDF analizado') ? 'text-green-600' : 'text-red-500'}`}>
            {pdfMsg}
          </span>
        )}
      </div>

      <ClasificadorCIE10 />

      {/* Formulario */}
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="ID del Caso" required>
              <input type="text" value={form.id_caso} onChange={e => set('id_caso', e.target.value)}
                className="input" placeholder="CASO-2024-001" required />
            </Field>
            <Field label="Edad (años)" required>
              <input type="number" value={form.edad} onChange={e => set('edad', e.target.value)}
                className="input" placeholder="45" min="18" max="100" required />
            </Field>
            <Field label="Días de Incapacidad Acumulados" required>
              <input type="number" value={form.dias_incapacidad_acumulados}
                onChange={e => set('dias_incapacidad_acumulados', e.target.value)}
                className="input" placeholder="120" min="0" required />
            </Field>
            <Field label="Porcentaje PCL (%)" required>
              <input type="number" value={form.porcentaje_pcl}
                onChange={e => set('porcentaje_pcl', e.target.value)}
                className="input" placeholder="38.5" min="0" max="100" step="0.1" required />
            </Field>
            <Field label="Comorbilidades" required>
              <input type="number" value={form.comorbilidades}
                onChange={e => set('comorbilidades', e.target.value)}
                className="input" placeholder="2" min="0" required />
            </Field>
            <Field label="Tipo de Enfermedad">
              <select value={form.tipo_enfermedad} onChange={e => set('tipo_enfermedad', e.target.value)} className="input">
                <option value="comun">Común</option>
                <option value="laboral">Laboral</option>
              </select>
            </Field>
            <Field label="Pronóstico Médico">
              <select value={form.pronostico_medico} onChange={e => set('pronostico_medico', e.target.value)} className="input">
                <option value="favorable">Favorable</option>
                <option value="reservado">Reservado</option>
                <option value="malo">Malo</option>
              </select>
            </Field>
            <Field label="En Tratamiento Activo">
              <select value={form.en_tratamiento_activo} onChange={e => set('en_tratamiento_activo', e.target.value)} className="input">
                <option value={1}>Sí</option>
                <option value={0}>No</option>
              </select>
            </Field>
            <Field label="Requiere Reubicación Laboral">
              <select value={form.requiere_reubicacion_laboral} onChange={e => set('requiere_reubicacion_laboral', e.target.value)} className="input">
                <option value={0}>No</option>
                <option value={1}>Sí</option>
              </select>
            </Field>
            <Field label="Notas Adicionales">
              <input type="text" value={form.notas_adicionales}
                onChange={e => set('notas_adicionales', e.target.value)}
                className="input" placeholder="Observaciones clínicas..." />
            </Field>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in">{error}</div>}
          <button type="submit" disabled={loading}
            className="btn-primary px-8 py-2.5 text-sm flex items-center gap-2">
            <Send className="w-4 h-4" />
            {loading ? 'Evaluando...' : 'Evaluar Caso'}
          </button>
        </form>
      </div>

      {/* Resultado */}
      {result && (
        <div className="card p-6 space-y-5 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold text-gray-800">Resultado — {result.id_caso}</h2>
              {result.caso_existente && (
                <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                  ID ya existía
                </span>
              )}
            </div>
            <button onClick={() => descargarReporte(result.id_caso)} disabled={reporteLoading}
              className="btn-dark text-sm px-4 py-2 flex items-center gap-2">
              <Download className="w-4 h-4" />
              {reporteLoading ? 'Generando...' : 'Descargar Reporte PDF'}
            </button>
          </div>

          {/* Gauge + Recomendación */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="flex justify-center">
              <Gauge score={result.score_riesgo} />
            </div>
            <div className={`col-span-2 p-5 rounded-xl border-2 ${REC_STYLES[result.recomendacion] || ''}`}>
              <p className="text-xs font-medium uppercase tracking-wider opacity-70 mb-1">Recomendación</p>
              <p className="font-bold text-lg">{result.recomendacion?.replace(/_/g, ' ')}</p>
              <p className="text-xs mt-2 opacity-80">
                Confianza: {result.confianza ? `${(result.confianza*100).toFixed(0)}%` : '100%'}
                {' · '}Capa: {result.capa === 'reglas_normativas' ? 'Normativa' : 'Modelo Causal'}
              </p>
            </div>
          </div>

          {/* Tiempo de recuperación */}
          {result.tiempo_recuperacion?.estimado_dias && (
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-200/60 flex items-center gap-4">
              <div className="text-3xl font-bold text-indigo-700">{result.tiempo_recuperacion.estimado_dias}</div>
              <div>
                <p className="text-sm font-medium text-indigo-800">días estimados de recuperación</p>
                <p className="text-xs text-indigo-600">Rango: {result.tiempo_recuperacion.rango}</p>
              </div>
            </div>
          )}

          {result.explicacion && (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm font-medium text-blue-800 mb-1">Explicación</p>
                <p className="text-sm text-blue-700 leading-relaxed">{result.explicacion.resumen}</p>
              </div>
              {result.explicacion.proximos_pasos?.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">Próximos Pasos</p>
                  <ul className="space-y-1.5">
                    {result.explicacion.proximos_pasos.map((p, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-brand-600 font-bold">{i+1}.</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.variables_causales_detectadas?.length > 0 && (
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-xs text-gray-500 font-medium">Variables causales:</span>
                  {result.variables_causales_detectadas.map(v => (
                    <span key={v} className="text-xs bg-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full font-medium">{v}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          <WhatIf base={form} />
        </div>
      )}
    </div>
  )
}
