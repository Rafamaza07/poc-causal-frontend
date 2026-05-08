import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Info,
  Brain, FileText, Scale, Shield, ChevronRight, Loader2,
} from 'lucide-react'
import API from '../../api/client'
import { useToast } from '../../Components/Toast'

// ── Plain-language translations ───────────────────────────────────────────────

const REC_TEXTO = {
  CALIFICA_PENSION_INVALIDEZ:
    'Tu caso puede calificar para una pensión de invalidez. Te recomendamos iniciar el proceso ante la AFP con apoyo de un abogado.',
  CONTINUAR_INCAPACIDAD:
    'Continúa con tu incapacidad. Sigue las indicaciones de tu médico tratante y solicita la prórroga a tiempo.',
  REINCORPORACION_CON_TERAPIAS:
    'Puedes reincorporarte al trabajo con apoyo de terapias de rehabilitación. Coordina con tu empleador los ajustes necesarios.',
  REINCORPORACION_CON_RECOMENDACIONES_MEDICAS:
    'Es posible volver al trabajo con ciertas restricciones médicas. Tu empleador está obligado a respetar las limitaciones indicadas por tu médico.',
  FORZAR_CALIFICACION_PCL:
    'Se recomienda iniciar la calificación de pérdida de capacidad laboral (PCL) ante la ARL o EPS antes de que venzan los plazos legales.',
}

const SCORE_TEXTO = (score) => {
  if (score >= 75) return { titulo: 'Atención urgente requerida', desc: 'Tu caso tiene alta complejidad. Hay trámites importantes que no pueden esperar.', color: '#dc2626', badge: 'bg-red-100 text-red-700' }
  if (score >= 50) return { titulo: 'Situación que requiere gestión', desc: 'Tu caso necesita seguimiento activo. Hay pasos concretos que debes dar pronto.', color: '#f59e0b', badge: 'bg-amber-100 text-amber-700' }
  if (score >= 25) return { titulo: 'Caso en seguimiento', desc: 'Tu incapacidad está siendo gestionada. Mantente al día con los trámites médicos.', color: '#3b82f6', badge: 'bg-blue-100 text-blue-700' }
  return { titulo: 'Situación estable', desc: 'Tu caso está en buen estado. Continúa siguiendo las indicaciones médicas.', color: '#10b981', badge: 'bg-emerald-100 text-emerald-700' }
}

// ── CIE-10 opciones comunes ───────────────────────────────────────────────────

const CIE10_COMUNES = [
  { code: 'M54.5', label: 'M54.5 — Lumbago (dolor lumbar)' },
  { code: 'M54.4', label: 'M54.4 — Ciática' },
  { code: 'F32',   label: 'F32 — Depresión' },
  { code: 'F41.1', label: 'F41.1 — Trastorno de ansiedad generalizada' },
  { code: 'S52',   label: 'S52 — Fractura de antebrazo' },
  { code: 'S72',   label: 'S72 — Fractura de fémur' },
  { code: 'J06',   label: 'J06 — Infección respiratoria aguda' },
  { code: 'M79.3', label: 'M79.3 — Paniculitis (tejido celular)' },
  { code: 'G54.2', label: 'G54.2 — Lesión de raíz nerviosa cervical' },
  { code: 'Otro',  label: 'Otro diagnóstico (escribe el código)' },
]

const CONTINGENCIA_OPTS = [
  { value: 'Enfermedad General',    label: 'Enfermedad general (no laboral)' },
  { value: 'Accidente de Trabajo',  label: 'Accidente de trabajo' },
  { value: 'Enfermedad Laboral',    label: 'Enfermedad por trabajo' },
  { value: 'Maternidad',            label: 'Maternidad / licencia de maternidad' },
]

const CONTRATO_OPTS = [
  { value: 'indefinido',   label: 'Contrato indefinido' },
  { value: 'fijo',         label: 'Contrato a término fijo' },
  { value: 'obra',         label: 'Contrato por obra o labor' },
  { value: 'temporal',     label: 'Contrato temporal' },
  { value: 'prestacion',   label: 'Prestación de servicios' },
]

const TIEMPO_EMPRESA_OPTS = [
  { value: '0',   label: 'Menos de 1 mes' },
  { value: '3',   label: '1 a 6 meses' },
  { value: '9',   label: '6 meses a 1 año' },
  { value: '18',  label: '1 a 2 años' },
  { value: '36',  label: '2 a 5 años' },
  { value: '72',  label: 'Más de 5 años' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2].map(n => (
        <div key={n} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            step > n  ? 'bg-emerald-500 text-white'
            : step === n ? 'bg-violet-600 text-white ring-4 ring-violet-100'
            : 'bg-gray-100 text-gray-400'
          }`}>
            {step > n ? <CheckCircle className="w-3.5 h-3.5" /> : n}
          </div>
          <span className={`text-xs font-medium hidden sm:inline ${step === n ? 'text-gray-700' : 'text-gray-400'}`}>
            {n === 1 ? 'Tu diagnóstico' : 'Tu situación laboral'}
          </span>
          {n < 2 && <div className={`w-8 h-px mx-1 ${step > n ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )
}

function ScoreRing({ score }) {
  const pct   = Math.min(100, Math.max(0, score ?? 0))
  const color = pct >= 75 ? '#dc2626' : pct >= 50 ? '#f59e0b' : pct >= 25 ? '#3b82f6' : '#10b981'
  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
        <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${pct} 100`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold" style={{ color }}>{Math.round(pct)}</span>
        <span className="text-[9px] text-gray-400 font-medium">/ 100</span>
      </span>
    </div>
  )
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EvaluarPortal() {
  const toast = useToast()
  const [step,     setStep]     = useState(1)
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState(null)
  const [error,    setError]    = useState(null)
  const [cie10Mode, setCie10Mode] = useState('select') // 'select' | 'manual'

  const [form, setForm] = useState({
    codigo_cie10:          '',
    tipo_contingencia:     'Enfermedad General',
    dias_incapacidad:      '',
    edad:                  '',
    eps:                   '',
    arl:                   '',
    tiempo_empresa_meses:  '18',
    tipo_contrato:         'indefinido',
    consentimiento:        false,
  })

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const canGoStep2 = form.codigo_cie10.trim() && form.dias_incapacidad && Number(form.dias_incapacidad) > 0
  const canSubmit  = canGoStep2 && form.eps.trim() && form.edad && Number(form.edad) >= 18 && form.consentimiento

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    try {
      const payload = {
        id_caso:             `PORTAL-${Date.now()}`,
        codigo_cie10:        form.codigo_cie10.trim().toUpperCase(),
        tipo_contingencia:   form.tipo_contingencia,
        dias_incapacidad:    Number(form.dias_incapacidad),
        edad:                Number(form.edad),
        eps:                 form.eps.trim(),
        arl:                 form.arl.trim() || null,
        tiempo_empresa_meses: Number(form.tiempo_empresa_meses),
        tipo_contrato:       form.tipo_contrato,
        consentimiento_datos: true,
      }
      const { data } = await API.post('/api/v1/cliente/evaluar', payload)
      setResult(data)
      setStep(3)
    } catch (err) {
      const msg = err.response?.data?.detail || 'No se pudo completar la evaluación. Intenta de nuevo.'
      setError(msg)
      toast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 3: Result ───────────────────────────────────────────────────────

  if (step === 3 && result) {
    const score = result.score_riesgo ?? 0
    const info  = SCORE_TEXTO(score)
    const recTexto = REC_TEXTO[result.recomendacion] ?? result.resumen ?? 'Consulta los detalles con tu EPS o ARL.'

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-page-in">
        <div>
          <Link to="/portal" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Resultado de tu evaluación</h1>
          <p className="text-sm text-gray-500 mt-1">Análisis generado con IA en base a la normativa colombiana vigente.</p>
        </div>

        {/* Score card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-6">
          <ScoreRing score={score} />
          <div className="flex-1 min-w-0">
            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${info.badge}`}>
              {info.titulo}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">{info.desc}</p>
          </div>
        </div>

        {/* Recommendation in plain language */}
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-bold text-violet-800">Qué te recomienda la IA</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{recTexto}</p>
        </div>

        {/* Next steps */}
        {result.proximos_pasos?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Pasos que debes dar ahora
            </h3>
            <ul className="space-y-2">
              {result.proximos_pasos.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Legal basis (simplified) */}
        {result.base_legal?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-500" /> Leyes que protegen tu caso
            </h3>
            <div className="space-y-2">
              {result.base_legal.slice(0, 3).map((l, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <Scale className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-blue-700">{l.norma}</span>
                    {l.titulo && <p className="text-xs text-blue-800 mt-0.5">{l.titulo}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-500" /> ¿Necesitas un documento legal?
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Puedes generar un Derecho de Petición o una Acción de Tutela basado en este resultado.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/portal/documentos"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <FileText className="w-4 h-4" /> Ver mis documentos
            </Link>
            <Link
              to="/portal/historial"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Ver historial de casos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] text-gray-400 pt-1">
          <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          Este análisis es orientativo. Consulta siempre con tu médico tratante o un profesional legal antes de tomar decisiones.
        </div>
      </div>
    )
  }

  // ── Steps 1 & 2 ──────────────────────────────────────────────────────────

  return (
    <div className="max-w-xl mx-auto animate-page-in">
      <div className="mb-6">
        <Link to="/portal" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Evaluar mi caso con IA</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cuéntanos sobre tu incapacidad y en segundos obtendrás un análisis con recomendaciones y respaldo legal.
        </p>
      </div>

      <StepIndicator step={step} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

        {/* ── STEP 1: Diagnóstico ─────────────────────────────── */}
        {step === 1 && (
          <>
            <div>
              <h2 className="text-base font-bold text-gray-800 mb-1">Tu diagnóstico médico</h2>
              <p className="text-xs text-gray-500">Información sobre tu incapacidad actual.</p>
            </div>

            {/* CIE-10 */}
            <div>
              <FieldLabel required>Diagnóstico (código CIE-10)</FieldLabel>
              {cie10Mode === 'select' ? (
                <>
                  <select
                    value={form.codigo_cie10}
                    onChange={e => {
                      if (e.target.value === 'Otro') { setCie10Mode('manual'); set('codigo_cie10', '') }
                      else set('codigo_cie10', e.target.value)
                    }}
                    className="w-full h-10 pl-3 pr-8 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 text-gray-700"
                  >
                    <option value="">Selecciona tu diagnóstico más común…</option>
                    {CIE10_COMUNES.map(o => <option key={o.code} value={o.code}>{o.label}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => setCie10Mode('manual')}
                    className="mt-1.5 text-xs text-violet-600 hover:underline"
                  >
                    Escribir código manualmente
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={form.codigo_cie10}
                    onChange={e => set('codigo_cie10', e.target.value)}
                    placeholder="Ej: M54.5"
                    className="input"
                  />
                  <button
                    type="button"
                    onClick={() => { setCie10Mode('select'); set('codigo_cie10', '') }}
                    className="mt-1.5 text-xs text-violet-600 hover:underline"
                  >
                    Volver a la lista
                  </button>
                </>
              )}
            </div>

            {/* Tipo contingencia */}
            <div>
              <FieldLabel required>¿Cómo ocurrió tu incapacidad?</FieldLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CONTINGENCIA_OPTS.map(o => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => set('tipo_contingencia', o.value)}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                      form.tipo_contingencia === o.value
                        ? 'bg-violet-50 border-violet-400 text-violet-800'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Días */}
            <div>
              <FieldLabel required>¿Cuántos días llevas en incapacidad?</FieldLabel>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="540"
                  value={form.dias_incapacidad}
                  onChange={e => set('dias_incapacidad', e.target.value)}
                  placeholder="Ej: 30"
                  className="input pr-14"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">días</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Suma todos los períodos, incluyendo renovaciones.</p>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canGoStep2}
              className="w-full h-11 flex items-center justify-center gap-2 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* ── STEP 2: Situación laboral ───────────────────────── */}
        {step === 2 && (
          <>
            <div>
              <h2 className="text-base font-bold text-gray-800 mb-1">Tu situación laboral</h2>
              <p className="text-xs text-gray-500">Esta información ayuda a calcular tus derechos exactos.</p>
            </div>

            {/* Edad + EPS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Tu edad</FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    min="18"
                    max="70"
                    value={form.edad}
                    onChange={e => set('edad', e.target.value)}
                    placeholder="Ej: 35"
                    className="input pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">años</span>
                </div>
              </div>
              <div>
                <FieldLabel required>Tu EPS</FieldLabel>
                <input
                  type="text"
                  value={form.eps}
                  onChange={e => set('eps', e.target.value)}
                  placeholder="Ej: Nueva EPS"
                  className="input"
                />
              </div>
            </div>

            {/* ARL */}
            <div>
              <FieldLabel>Tu ARL (si aplica)</FieldLabel>
              <input
                type="text"
                value={form.arl}
                onChange={e => set('arl', e.target.value)}
                placeholder="Ej: Sura, Positiva…"
                className="input"
              />
              <p className="text-xs text-gray-400 mt-1">Solo si tu incapacidad es por accidente o enfermedad laboral.</p>
            </div>

            {/* Tiempo empresa */}
            <div>
              <FieldLabel required>¿Cuánto tiempo llevas en tu empresa?</FieldLabel>
              <select
                value={form.tiempo_empresa_meses}
                onChange={e => set('tiempo_empresa_meses', e.target.value)}
                className="w-full h-10 pl-3 pr-8 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 text-gray-700"
              >
                {TIEMPO_EMPRESA_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Tipo contrato */}
            <div>
              <FieldLabel required>Tipo de contrato</FieldLabel>
              <select
                value={form.tipo_contrato}
                onChange={e => set('tipo_contrato', e.target.value)}
                className="w-full h-10 pl-3 pr-8 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 text-gray-700"
              >
                {CONTRATO_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Consentimiento */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                form.consentimiento ? 'bg-violet-600 border-violet-600' : 'bg-white border-gray-300 group-hover:border-violet-400'
              }`}
                onClick={() => set('consentimiento', !form.consentimiento)}
              >
                {form.consentimiento && <CheckCircle className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-xs text-gray-600 leading-relaxed">
                Autorizo el tratamiento de mis datos personales de acuerdo con la{' '}
                <a href="/politica-tratamiento" target="_blank" className="text-violet-600 hover:underline font-medium">
                  Política de Privacidad
                </a>{' '}
                y la Ley 1581/2012 de Habeas Data.
              </span>
            </label>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="h-11 px-5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1" /> Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Analizando…</>
                  : <><Brain className="w-4 h-4" /> Obtener análisis</>
                }
              </button>
            </div>
          </>
        )}
      </div>

      {/* Privacy note */}
      <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-400">
        <Info className="w-3.5 h-3.5 flex-shrink-0" />
        El análisis se basa en el Decreto 1507, la Ley 776/2002 y la Ley 100/1993. No reemplaza asesoría médica o jurídica profesional.
      </div>
    </div>
  )
}
