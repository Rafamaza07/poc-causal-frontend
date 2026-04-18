import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Sparkles, FileText, ArrowRight, ArrowLeft,
  CheckCircle, Activity, Clock, AlertTriangle,
  Briefcase, Heart, Stethoscope, Plus, Minus,
  RotateCcw, Brain, Info, Tag, Paperclip, Loader2, X,
  Scale, ChevronDown, ChevronUp, ShieldCheck,
} from 'lucide-react'
import API from '../api/client'
import { useToast } from '../Components/Toast'
import Stepper from '../Components/ui/Stepper'
import ScoreGauge from '../Components/charts/ScoreGauge'
import MilestoneBar from '../Components/charts/MilestoneBar'
import CIE10Search from '../Components/CIE10Search'
import { RECOMENDACIONES, MILESTONES } from '../utils/constants'

// ── Legal accordion item ──────────────────────────────────────────────────────
function LegalAccordionItem({ article }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-blue-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-blue-50 transition-colors"
      >
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
          bg-brand-50 text-brand-700 border border-brand-100 flex-shrink-0">
          {article.source}
        </span>
        <span className="text-xs font-semibold text-gray-700 flex-shrink-0">{article.article}</span>
        <span className="flex-1 text-xs text-gray-600 truncate">{article.title}</span>
        {open
          ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-4 py-3 bg-blue-50/50 border-t border-blue-100">
          <p className="text-xs text-gray-700 leading-relaxed">{article.content}</p>
        </div>
      )}
    </div>
  )
}

const STEPS = [
  { id: 'datos',    label: 'Datos del paciente' },
  { id: 'clinicos', label: 'Indicadores clínicos' },
  { id: 'notas',    label: 'Notas y confirmación' },
]

const TIPO_OPTIONS = [
  { value: 'laboral',     label: 'Laboral',      Icon: Briefcase },
  { value: 'comun',       label: 'Común',        Icon: Heart },
  { value: 'profesional', label: 'Profesional',  Icon: Stethoscope },
  { value: 'accidente',   label: 'Accidente',    Icon: AlertTriangle },
]

const PRONOSTICO_OPTIONS = [
  { value: 'favorable', label: 'Favorable',    color: 'text-green-500' },
  { value: 'reservado', label: 'Reservado',    color: 'text-amber-500' },
  { value: 'malo',      label: 'Desfavorable', color: 'text-red-500'   },
]

const REC_ICON_MAP = { CheckCircle, Activity, Clock, AlertTriangle }

const REC_STYLES = {
  emerald: { card: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: 'text-emerald-600' },
  blue:    { card: 'bg-blue-50 border-blue-200 text-blue-800',          icon: 'text-blue-600'    },
  amber:   { card: 'bg-amber-50 border-amber-200 text-amber-800',       icon: 'text-amber-600'   },
  red:     { card: 'bg-red-50 border-red-200 text-red-800',             icon: 'text-red-600'     },
}

const INIT = {
  id_caso: '',
  edad: '',
  tipo_enfermedad: 'comun',
  texto_clinico: '',
  codigo_cie10: '',
  dias_incapacidad_acumulados: '',
  porcentaje_pcl: 0,
  pronostico_medico: 'reservado',
  en_tratamiento_activo: true,
  comorbilidades: 0,
  requiere_reubicacion_laboral: false,
  notas_adicionales: '',
}

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${checked ? 'bg-brand-600' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm
          transition-transform duration-200 mt-0.5 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

function SummaryRow({ label, value }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}

function BtnSecondary({ children, onClick, disabled, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium
        text-gray-700 bg-white border border-gray-300 rounded-lg
        hover:bg-gray-50 transition-colors disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

function BtnGhost({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium
        text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {children}
    </button>
  )
}

export default function EvaluarPaciente() {
  const toast    = useToast()
  const navigate = useNavigate()

  const [step, setStep]             = useState(0)
  const [form, setForm]             = useState(INIT)
  const [cie10, setCie10]           = useState(null)
  const [cie10Loading, setCIE10Loading] = useState(false)
  const [result, setResult]         = useState(null)
  const [loading, setLoading]       = useState(false)
  const [confirmed, setConfirmed]   = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileLoading, setFileLoading]   = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [titular, setTitular] = useState({ nombre: '', cedula: '', email: '' })
  const setTit = (k, v) => setTitular(t => ({ ...t, [k]: v }))

  const set  = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const dias = parseInt(form.dias_incapacidad_acumulados) || 0
  const pcl  = parseFloat(form.porcentaje_pcl) || 0

  const nearMilestone = MILESTONES.find(m => {
    const diff = m.days - dias
    return diff > 0 && diff <= 20
  })

  const step1Valid = form.id_caso.trim() !== '' && form.edad !== ''

  const handleFileUpload = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    setUploadedFile(f)
    setFileLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', f)
      const { data } = await API.post('/api/analizar-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const c = data.campos_extraidos
      if (c) {
        setForm(f => ({
          ...f,
          ...(c.id_caso                      ? { id_caso: c.id_caso } : {}),
          ...(c.edad != null                 ? { edad: String(c.edad) } : {}),
          ...(c.dias_incapacidad_acumulados != null ? { dias_incapacidad_acumulados: String(c.dias_incapacidad_acumulados) } : {}),
          ...(c.porcentaje_pcl != null        ? { porcentaje_pcl: parseFloat(c.porcentaje_pcl) } : {}),
          ...(c.tipo_enfermedad              ? { tipo_enfermedad: c.tipo_enfermedad } : {}),
          ...(c.pronostico_medico            ? { pronostico_medico: c.pronostico_medico } : {}),
          ...(c.en_tratamiento_activo != null ? { en_tratamiento_activo: Boolean(c.en_tratamiento_activo) } : {}),
          ...(c.comorbilidades != null        ? { comorbilidades: parseInt(c.comorbilidades) || 0 } : {}),
          ...(c.requiere_reubicacion_laboral != null ? { requiere_reubicacion_laboral: Boolean(c.requiere_reubicacion_laboral) } : {}),
          ...(c.notas_adicionales            ? { notas_adicionales: c.notas_adicionales } : {}),
        }))
        toast('Datos del paciente extraídos del PDF', 'success')
      } else {
        toast('El archivo no contiene información legible', 'warning')
      }
    } catch {
      toast('No se pudo procesar el archivo', 'error')
      setUploadedFile(null)
    } finally {
      setFileLoading(false)
    }
  }

  const autoClasificarCIE10 = async () => {
    if (!form.texto_clinico.trim()) {
      toast('Ingresa una descripción clínica primero', 'warning')
      return
    }
    setCIE10Loading(true)
    try {
      const { data } = await API.post('/api/v1/clasificar-cie10', { texto_clinico: form.texto_clinico })
      const obj = {
        codigo:              data.codigo_cie10,
        descripcion:         data.descripcion_oficial,
        categoria:           data.categoria,
        dias_tipicos_min:    data.cie10_referencia?.dias_tipicos_min,
        dias_tipicos_max:    data.cie10_referencia?.dias_tipicos_max,
        pcl_tipico_min:      data.cie10_referencia?.pcl_tipico_min,
        pcl_tipico_max:      data.cie10_referencia?.pcl_tipico_max,
        frecuencia_colombia: data.cie10_referencia?.frecuencia_colombia,
      }
      setCie10(obj)
      set('codigo_cie10', data.codigo_cie10)
      toast(`CIE-10 clasificado: ${data.codigo_cie10}`, 'success')
    } catch (err) {
      toast(err.response?.data?.detail || 'Error al clasificar', 'error')
    } finally {
      setCIE10Loading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // 1. Registrar consentimiento informado — Ley 1581/2012 Art. 9
      await API.post('/api/v1/consentimientos', {
        caso_id:        form.id_caso,
        titular_nombre: titular.nombre,
        titular_cedula: titular.cedula,
        titular_email:  titular.email || undefined,
        canal:          'digital',
        texto_consentimiento_version: '1.0',
      })

      // 2. Evaluar caso
      const { data } = await API.post('/api/evaluar-caso', {
        id_caso:                      form.id_caso,
        edad:                         parseFloat(form.edad),
        tipo_enfermedad:              form.tipo_enfermedad,
        texto_clinico:                form.texto_clinico || undefined,
        codigo_cie10:                 form.codigo_cie10 || undefined,
        dias_incapacidad_acumulados:  dias,
        porcentaje_pcl:               pcl,
        pronostico_medico:            form.pronostico_medico,
        en_tratamiento_activo:        form.en_tratamiento_activo ? 1 : 0,
        comorbilidades:               form.comorbilidades,
        requiere_reubicacion_laboral: form.requiere_reubicacion_laboral ? 1 : 0,
        notas_adicionales:            form.notas_adicionales || undefined,
      })
      setResult(data)
      if (!localStorage.getItem('disclaimer_accepted')) setShowDisclaimer(true)
      toast(
        data.caso_existente
          ? `Caso existente — Score: ${data.score_riesgo}/100`
          : `Caso evaluado — Score: ${data.score_riesgo}/100`,
        data.es_critico ? 'warning' : 'success',
      )
    } catch (err) {
      toast(err.response?.data?.detail || 'Error al evaluar', 'error')
    } finally {
      setLoading(false)
    }
  }

  const descargarPDF = async () => {
    if (!result) return
    setPdfLoading(true)
    try {
      const res = await API.get(`/api/casos/${result.id_caso}/reporte-pdf`, { responseType: 'blob' })
      const url  = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reporte-${result.id_caso}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast('PDF descargado', 'success')
    } catch {
      toast('Error al generar el reporte', 'error')
    } finally {
      setPdfLoading(false)
    }
  }

  const acceptDisclaimer = async () => {
    localStorage.setItem('disclaimer_accepted', '1')
    setShowDisclaimer(false)
    try { await API.post('/api/me/disclaimer') } catch { /* best-effort */ }
  }

  const resetWizard = () => {
    setStep(0)
    setForm(INIT)
    setCie10(null)
    setResult(null)
    setConfirmed(false)
    setConsentChecked(false)
    setTitular({ nombre: '', cedula: '', email: '' })
  }

  /* ──────────────────────────────────────────────────────── RESULT VIEW */
  if (result) {
    const rec        = RECOMENDACIONES[result.recomendacion]
    const RecIcon    = rec ? REC_ICON_MAP[rec.icon] : null
    const recStyle   = rec ? REC_STYLES[rec.color] : { card: 'bg-gray-50 border-gray-200 text-gray-800', icon: 'text-gray-600' }

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

        {/* ── Disclaimer modal ── */}
        {showDisclaimer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Aviso médico-legal obligatorio</h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Este resultado es generado por el motor de inferencia causal{' '}
                <strong>IncapacidadIA</strong> como <strong>herramienta de apoyo a la decisión</strong>.
              </p>
              <ul className="text-sm text-gray-700 space-y-2 mb-5 list-disc list-inside">
                <li>No sustituye el criterio del <strong>médico laboral certificado</strong>.</li>
                <li>La decisión final es responsabilidad del <strong>profesional tratante</strong>.</li>
                <li>No constituye dictamen oficial ni concepto jurídico vinculante.</li>
                <li>Debe ser validado conforme a la normatividad colombiana vigente
                  (Ley 100/1993, Decreto 2463/2001, Decreto 1333/2021).</li>
              </ul>
              <button
                onClick={acceptDisclaimer}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
              >
                Entiendo y acepto continuar
              </button>
            </div>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-gray-800">Resultado de evaluación</h1>
          <p className="text-gray-500 text-sm mt-1">Caso {result.id_caso}</p>
        </div>

        {/* Score + Recommendation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <ScoreGauge score={result.score_riesgo} size={240} />
          </div>
          <div className={`p-6 rounded-xl border-2 flex flex-col justify-center ${recStyle.card}`}>
            <p className="text-xs font-medium uppercase tracking-wider opacity-70 mb-2">Recomendación</p>
            <div className="flex items-start gap-3">
              {RecIcon && <RecIcon className={`w-8 h-8 flex-shrink-0 mt-0.5 ${recStyle.icon}`} />}
              <div>
                <p className="text-xl font-bold leading-snug">
                  {rec?.label ?? result.recomendacion?.replace(/_/g, ' ')}
                </p>
                {result.confianza && (
                  <p className="text-sm mt-1 opacity-70">
                    Confianza: {(result.confianza * 100).toFixed(0)}%
                    {result.capa ? ` · ${result.capa === 'reglas_normativas' ? 'Capa normativa' : 'Modelo causal'}` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        {(result.analisis_ia || result.explicacion?.resumen) && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-brand-600" />
              <h2 className="text-sm font-semibold text-gray-800">Análisis de IA</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {result.analisis_ia ?? result.explicacion?.resumen}
            </p>
            {result.explicacion?.proximos_pasos?.length > 0 && (
              <ul className="mt-4 space-y-1.5">
                {result.explicacion.proximos_pasos.map((paso, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-brand-600 font-bold flex-shrink-0">{i + 1}.</span>
                    {paso}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Marco legal */}
        {result.fundamentacion_legal?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-5 h-5 text-brand-600" />
              <h2 className="text-sm font-semibold text-gray-800">Marco legal aplicable</h2>
              <span className="ml-auto text-xs text-gray-400">
                {result.fundamentacion_legal.length} artículo{result.fundamentacion_legal.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {result.fundamentacion_legal.map((art, i) => (
                <LegalAccordionItem key={`${art.source}-${art.article}-${i}`} article={art} />
              ))}
            </div>
          </div>
        )}

        {/* Milestone bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Progresión de hitos legales</h2>
          <MilestoneBar diasActuales={dias} />
        </div>

        {/* Caso existente banner */}
        {result.caso_existente && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800 flex-1">
              Este caso ya tiene evaluaciones previas.{' '}
              <button
                onClick={() => navigate('/historial')}
                className="font-medium underline underline-offset-2 hover:no-underline"
              >
                Ver historial
              </button>
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={descargarPDF}
            disabled={pdfLoading}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <FileText className="w-4 h-4" />
            {pdfLoading ? 'Generando...' : 'Descargar PDF'}
          </button>
          <BtnSecondary onClick={() => navigate('/historial')}>
            Ver en historial
          </BtnSecondary>
          <BtnGhost onClick={resetWizard}>
            <RotateCcw className="w-4 h-4" />
            Evaluar otro caso
          </BtnGhost>
        </div>
      </div>
    )
  }

  /* ──────────────────────────────────────────────────────── WIZARD */
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Evaluar caso</h1>

      {/* Stepper header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <Stepper steps={STEPS} currentStep={step} />
      </div>

      {/* ── STEP 1: Datos del paciente ─────────────────────────────────── */}
      {step === 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-base font-semibold text-gray-800">Datos del paciente</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="ID del caso" required>
              <input
                type="text"
                value={form.id_caso}
                onChange={e => set('id_caso', e.target.value)}
                placeholder="CASO-2024-001"
                className="input w-full"
              />
            </Field>

            <Field label="Edad" required>
              <input
                type="number"
                value={form.edad}
                onChange={e => set('edad', e.target.value)}
                placeholder="45"
                min={18}
                max={100}
                className="input w-full"
              />
              <input
                type="range"
                min={18}
                max={100}
                value={form.edad || 18}
                onChange={e => set('edad', e.target.value)}
                className="w-full accent-brand-600 h-2 mt-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>18 años</span><span>100 años</span>
              </div>
            </Field>

            <Field label="Tipo de enfermedad">
              <select
                value={form.tipo_enfermedad}
                onChange={e => set('tipo_enfermedad', e.target.value)}
                className="input w-full"
              >
                {TIPO_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Documento clínico (opcional)">
            <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl
              cursor-pointer transition-all duration-150 ${
                uploadedFile
                  ? 'border-brand-400 bg-brand-50/40'
                  : 'border-gray-200 hover:border-brand-400 hover:bg-brand-50/30'
              }`}>
              <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-sm truncate">
                {uploadedFile
                  ? <span className="font-medium text-gray-800">{uploadedFile.name}</span>
                  : <span className="text-gray-500">Subir PDF, Word o imagen para extraer texto automáticamente</span>
                }
              </span>
              {fileLoading
                ? <Loader2 className="w-4 h-4 animate-spin text-brand-600 flex-shrink-0" />
                : uploadedFile
                  ? <button type="button" onClick={e => { e.preventDefault(); setUploadedFile(null) }}
                      className="p-0.5 rounded text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  : null
              }
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                onChange={handleFileUpload}
              />
            </label>
          </Field>

          <Field label="Descripción clínica">
            <textarea
              value={form.texto_clinico}
              onChange={e => set('texto_clinico', e.target.value)}
              placeholder="Describa el cuadro clínico del paciente..."
              className="input w-full resize-none h-32"
            />
          </Field>

          <button
            type="button"
            onClick={autoClasificarCIE10}
            disabled={cie10Loading || !form.texto_clinico.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
              text-gray-700 bg-white border border-gray-300 rounded-lg
              hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Tag className="w-4 h-4" />
            {cie10Loading ? 'Clasificando...' : 'Auto-clasificar CIE-10'}
          </button>

          <Field label="Código CIE-10">
            <CIE10Search
              value={cie10}
              onSelect={item => {
                setCie10(item)
                set('codigo_cie10', item?.codigo ?? '')
              }}
              showDetails
              placeholder="Buscar código CIE-10..."
            />
          </Field>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={!step1Valid}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-50"
            >
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Indicadores clínicos ───────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-base font-semibold text-gray-800">Indicadores clínicos</h2>

          {/* Días de incapacidad */}
          <Field label="Días de incapacidad acumulados">
            <input
              type="number"
              value={form.dias_incapacidad_acumulados}
              onChange={e => set('dias_incapacidad_acumulados', e.target.value)}
              placeholder="120"
              min={0}
              className="input w-full"
            />
            <div className="mt-3 pb-2">
              <MilestoneBar diasActuales={dias} />
            </div>
            {nearMilestone && (
              <div className="mt-1 p-3 bg-amber-50 border border-amber-200 rounded-lg
                text-sm text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                A {nearMilestone.days - dias} días del milestone de {nearMilestone.days} días ({nearMilestone.decreto})
              </div>
            )}
            {cie10?.dias_tipicos_min && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg
                text-sm text-blue-800 flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                Rango típico para {cie10.codigo}: {cie10.dias_tipicos_min}–{cie10.dias_tipicos_max} días
              </div>
            )}
          </Field>

          {/* PCL */}
          <Field label={`Porcentaje PCL: ${pcl}%`}>
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={form.porcentaje_pcl}
              onChange={e => set('porcentaje_pcl', parseFloat(e.target.value))}
              className="w-full accent-brand-600 h-2"
            />
            {/* Color zones */}
            <div className="relative w-full h-1.5 rounded-full overflow-hidden mt-2">
              <div className="absolute left-0 top-0 h-full bg-emerald-300" style={{ width: '30%' }} />
              <div className="absolute top-0 h-full bg-amber-300"   style={{ left: '30%', width: '20%' }} />
              <div className="absolute top-0 h-full bg-red-300"     style={{ left: '50%', width: '50%' }} />
            </div>
            <div className="flex text-xs text-gray-400 mt-1">
              <span className="w-[30%]">0–30%</span>
              <span className="w-[20%]">30–50%</span>
              <span className="flex-1 text-right">50–100%</span>
            </div>
            {pcl > 50 && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg
                text-sm text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                PCL ≥50% implica posible pensión por invalidez (Ley 100)
              </div>
            )}
          </Field>

          {/* Pronóstico */}
          <Field label="Pronóstico médico">
            <select
              value={form.pronostico_medico}
              onChange={e => set('pronostico_medico', e.target.value)}
              className="input w-full"
            >
              {PRONOSTICO_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          {/* Toggles */}
          <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <ToggleRow
              label="¿En tratamiento activo?"
              checked={form.en_tratamiento_activo}
              onChange={v => set('en_tratamiento_activo', v)}
            />
            <ToggleRow
              label="¿Requiere reubicación laboral?"
              checked={form.requiere_reubicacion_laboral}
              onChange={v => set('requiere_reubicacion_laboral', v)}
            />
          </div>

          {/* Comorbilidades counter */}
          <Field label="Comorbilidades">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => set('comorbilidades', Math.max(0, form.comorbilidades - 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center
                  justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-2xl font-bold text-gray-800 w-8 text-center">
                {form.comorbilidades}
              </span>
              <button
                type="button"
                onClick={() => set('comorbilidades', Math.min(10, form.comorbilidades + 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center
                  justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </Field>

          <div className="flex justify-between pt-2">
            <BtnSecondary onClick={() => setStep(0)}>
              <ArrowLeft className="w-4 h-4" /> Anterior
            </BtnSecondary>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm"
            >
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Notas y confirmación ───────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-base font-semibold text-gray-800">Notas y confirmación</h2>

          <Field label="Notas adicionales (opcional)">
            <textarea
              value={form.notas_adicionales}
              onChange={e => set('notas_adicionales', e.target.value)}
              placeholder="Observaciones adicionales..."
              className="input w-full resize-none h-24"
            />
          </Field>

          {/* Summary card */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Resumen del caso</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-4">
                <SummaryRow label="ID del caso"       value={form.id_caso} />
                <SummaryRow label="Edad"              value={form.edad ? `${form.edad} años` : null} />
                <SummaryRow label="Tipo de enfermedad" value={TIPO_OPTIONS.find(o => o.value === form.tipo_enfermedad)?.label} />
                {cie10 && <SummaryRow label="CIE-10" value={`${cie10.codigo} — ${cie10.descripcion}`} />}
              </div>
              <div className="space-y-4">
                <SummaryRow label="Días acumulados"   value={form.dias_incapacidad_acumulados ? `${form.dias_incapacidad_acumulados} días` : null} />
                <SummaryRow label="PCL"               value={`${form.porcentaje_pcl}%`} />
                <SummaryRow label="Pronóstico"        value={PRONOSTICO_OPTIONS.find(o => o.value === form.pronostico_medico)?.label} />
                <SummaryRow label="Tratamiento activo" value={form.en_tratamiento_activo ? 'Sí' : 'No'} />
                <SummaryRow label="Comorbilidades"    value={form.comorbilidades} />
              </div>
            </div>
          </div>

          {/* Consentimiento informado — Ley 1581/2012 */}
          <div className="border border-blue-200 rounded-xl p-5 bg-blue-50/40 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <h3 className="text-sm font-semibold text-blue-900">
                Consentimiento informado — Ley 1581/2012
              </h3>
            </div>
            <p className="text-xs text-blue-700 leading-relaxed">
              Antes de procesar datos médicos, registre los datos del titular y confirme
              que otorgó consentimiento informado. Obligatorio según la Ley 1581/2012 Art. 9.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nombre del titular" required>
                <input
                  type="text"
                  value={titular.nombre}
                  onChange={e => setTit('nombre', e.target.value)}
                  placeholder="Nombre completo del trabajador"
                  className="input w-full"
                />
              </Field>
              <Field label="Cédula del titular" required>
                <input
                  type="text"
                  value={titular.cedula}
                  onChange={e => setTit('cedula', e.target.value)}
                  placeholder="Número de cédula"
                  className="input w-full"
                />
              </Field>
              <Field label="Correo del titular (opcional)">
                <input
                  type="email"
                  value={titular.email}
                  onChange={e => setTit('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="input w-full"
                />
              </Field>
            </div>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={e => setConsentChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-blue-600 rounded"
              />
              <span className="text-sm text-blue-800">
                El titular <strong>{titular.nombre || '(nombre requerido)'}</strong> ha otorgado
                consentimiento informado para el tratamiento de sus datos de salud.{' '}
                <Link
                  to="/politica-tratamiento"
                  target="_blank"
                  className="underline underline-offset-2 hover:no-underline"
                >
                  Ver política de privacidad
                </Link>
              </span>
            </label>
          </div>

          {/* Confirmation */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-brand-600 rounded"
            />
            <span className="text-sm text-gray-700">
              Confirmo que los datos ingresados son correctos
            </span>
          </label>

          <div className="flex justify-between pt-2">
            <BtnSecondary onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4" /> Anterior
            </BtnSecondary>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!confirmed || !consentChecked || !titular.nombre.trim() || !titular.cedula.trim() || loading}
              className="btn-primary flex items-center gap-2 px-7 py-2.5 text-base font-semibold disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Evaluando...' : 'Evaluar caso'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
