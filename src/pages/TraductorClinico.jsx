import { useState } from 'react'
import {
  Stethoscope, Briefcase, Sparkles, CheckCircle, XCircle,
  AlertTriangle, ArrowRight, ChevronDown, ChevronUp,
  Clipboard, Scale, Info, Loader2, RotateCcw, Download,
} from 'lucide-react'
import API from '../api/client'
import { useToast } from '../Components/Toast'

const COMPATIBILIDAD_CONFIG = {
  compatible: {
    label: 'Compatible',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: CheckCircle,
    iconColor: 'text-emerald-600',
    border: 'border-emerald-400',
  },
  parcialmente_compatible: {
    label: 'Parcialmente compatible',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    border: 'border-amber-400',
  },
  incompatible: {
    label: 'Incompatible',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: XCircle,
    iconColor: 'text-red-600',
    border: 'border-red-400',
  },
}

const RIESGO_CONFIG = {
  bajo:  { label: 'Riesgo bajo',   color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  medio: { label: 'Riesgo medio',  color: 'bg-amber-50 text-amber-700 border-amber-200' },
  alto:  { label: 'Riesgo alto',   color: 'bg-red-50 text-red-700 border-red-200' },
}

const URGENCIA_CONFIG = {
  inmediata:    { label: 'Inmediata',    color: 'bg-red-100 text-red-700' },
  corto_plazo:  { label: 'Corto plazo',  color: 'bg-amber-100 text-amber-700' },
  largo_plazo:  { label: 'Largo plazo',  color: 'bg-blue-100 text-blue-700' },
}

const TIPO_ICON = {
  ergonómico:     '🪑',
  organizacional: '🗂️',
  técnico:        '🔧',
  temporal:       '⏱️',
}

function Field({ label, hint, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

function ExpandableList({ title, items, colorClass, icon: Icon }) {
  const [open, setOpen] = useState(true)
  if (!items || items.length === 0) return null
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {Icon && <Icon size={15} className={colorClass} />}
          {title}
          <span className="ml-1 text-xs bg-white border border-gray-200 rounded-full px-1.5 py-0.5 text-gray-500">{items.length}</span>
        </span>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && (
        <ul className="divide-y divide-gray-100">
          {items.map((item, i) => (
            <li key={i} className="px-4 py-2.5 text-sm text-gray-700 flex gap-2">
              <ArrowRight size={14} className={`mt-0.5 shrink-0 ${colorClass}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function TraductorClinico() {
  const { showToast } = useToast()
  const [form, setForm] = useState({
    restricciones_medicas: '',
    profesiograma: '',
    cargo: '',
    case_id: '',
  })
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const canSubmit = form.restricciones_medicas.trim().length > 20 &&
                    form.profesiograma.trim().length > 20

  async function handleGenerar() {
    setLoading(true)
    setResultado(null)
    try {
      const payload = {
        restricciones_medicas: form.restricciones_medicas,
        profesiograma: form.profesiograma,
        cargo: form.cargo || undefined,
        case_id: form.case_id || undefined,
      }
      const { data } = await API.post('/api/v1/traductor/ajustes-razonables', payload)
      setResultado(data)
    } catch (err) {
      showToast(err.response?.data?.detail || 'Error al generar el mapa. Intenta de nuevo.', 'error')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setResultado(null)
    setForm({ restricciones_medicas: '', profesiograma: '', cargo: '', case_id: '' })
  }

  const compatCfg = resultado ? (COMPATIBILIDAD_CONFIG[resultado.resumen_compatibilidad] || COMPATIBILIDAD_CONFIG.parcialmente_compatible) : null
  const riesgoCfg = resultado ? (RIESGO_CONFIG[resultado.nivel_riesgo_reintegro] || RIESGO_CONFIG.medio) : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Stethoscope size={24} className="text-brand-600" />
          Traductor Clínico-Ocupacional
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Cruza las restricciones médicas del trabajador con el profesiograma del cargo para generar el <strong>Mapa de Ajustes Razonables</strong>.
        </p>
      </div>

      {!resultado ? (
        /* ── Formulario ── */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Columna restricciones */}
          <div className="card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Stethoscope size={16} className="text-brand-600" />
              <h2 className="font-semibold text-gray-800 text-sm">Restricciones médicas</h2>
            </div>

            <Field label="ID del caso (opcional)" hint="Para vincular el resultado al historial">
              <input
                value={form.case_id}
                onChange={e => set('case_id', e.target.value)}
                placeholder="CASO-2024-001"
                className="input w-full"
              />
            </Field>

            <Field
              label="Texto de restricciones médicas"
              required
              hint="Copia aquí el concepto médico, restricciones funcionales, limitaciones por cargo"
            >
              <textarea
                value={form.restricciones_medicas}
                onChange={e => set('restricciones_medicas', e.target.value)}
                rows={10}
                placeholder={"Ejemplo:\n– No levantar cargas > 5 kg\n– No permanecer de pie > 2 horas continuas\n– Evitar exposición a vibraciones en miembros superiores\n– Restricción para trabajo en altura > 1.5 m\n– Sin movimientos repetitivos de columna lumbar"}
                className="input w-full resize-none text-sm"
              />
            </Field>
          </div>

          {/* Columna profesiograma */}
          <div className="card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Briefcase size={16} className="text-brand-600" />
              <h2 className="font-semibold text-gray-800 text-sm">Profesiograma del cargo</h2>
              <div className="ml-auto group relative">
                <Info size={14} className="text-gray-400 cursor-help" />
                <div className="absolute right-0 top-5 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover:block z-10 shadow-lg">
                  Describe las demandas físicas, cognitivas y ambientales del cargo: postura predominante, esfuerzo físico, manipulación de cargas, exposición a factores de riesgo, horario, responsabilidades esenciales.
                </div>
              </div>
            </div>

            <Field label="Cargo" hint="Nombre exacto del cargo según la empresa">
              <input
                value={form.cargo}
                onChange={e => set('cargo', e.target.value)}
                placeholder="Operario de ensamble / Auxiliar de bodega / Analista..."
                className="input w-full"
              />
            </Field>

            <Field
              label="Profesiograma / Descripción del cargo"
              required
              hint="Demandas físicas, cognitivas, ambientales y condiciones de trabajo"
            >
              <textarea
                value={form.profesiograma}
                onChange={e => set('profesiograma', e.target.value)}
                rows={10}
                placeholder={"Ejemplo:\n– Postura: bipedestación 6-8 horas/día\n– Levantamiento: cargas de 15-20 kg frecuentemente\n– Movimientos repetitivos de hombros y columna\n– Trabajo en plataformas elevadas (2-4 m)\n– Exposición a vibraciones de maquinaria\n– Turnos rotativos 8 horas\n– Funciones esenciales: cargue/descargue, operación de montacargas manual"}
                className="input w-full resize-none text-sm"
              />
            </Field>
          </div>

          {/* Botón generar — full width */}
          <div className="lg:col-span-2 flex justify-center">
            <button
              onClick={handleGenerar}
              disabled={!canSubmit || loading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Analizando con IA…</>
                : <><Sparkles size={18} /> Generar Mapa de Ajustes Razonables</>
              }
            </button>
          </div>
        </div>

      ) : (
        /* ── Resultado ── */
        <div className="space-y-5">

          {/* Cabecera resultado */}
          <div className={`card border-l-4 ${compatCfg.border}`}>
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {compatCfg.icon && <compatCfg.icon size={32} className={compatCfg.iconColor} />}
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-semibold ${compatCfg.color}`}>
                    {compatCfg.label}
                  </span>
                  {form.cargo && (
                    <p className="mt-1 text-sm text-gray-600">
                      <Briefcase size={13} className="inline mr-1 text-gray-400" />
                      {form.cargo}
                    </p>
                  )}
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${riesgoCfg.color}`}>
                {riesgoCfg.label}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <RotateCcw size={14} /> Nueva consulta
                </button>
              </div>
            </div>
          </div>

          {/* Recomendación final */}
          {resultado.recomendacion_final && (
            <div className="card bg-brand-50 border border-brand-200">
              <div className="flex gap-3">
                <Clipboard size={18} className="text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide mb-1">Recomendación para SST</p>
                  <p className="text-sm text-brand-900">{resultado.recomendacion_final}</p>
                </div>
              </div>
            </div>
          )}

          {/* Ajustes recomendados */}
          {resultado.ajustes_recomendados?.length > 0 && (
            <div className="card space-y-3">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600" />
                Ajustes razonables recomendados
              </h3>
              <div className="space-y-2">
                {resultado.ajustes_recomendados.map((item, i) => {
                  const urg = URGENCIA_CONFIG[item.urgencia] || URGENCIA_CONFIG.corto_plazo
                  const emoji = TIPO_ICON[item.tipo] || '📋'
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-lg shrink-0">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">{item.ajuste}</p>
                        <div className="flex gap-2 mt-1.5">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize">{item.tipo}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${urg.color}`}>{urg.label}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Funciones preservadas / comprometidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExpandableList
              title="Funciones preservadas"
              items={resultado.funciones_preservadas}
              colorClass="text-emerald-600"
              icon={CheckCircle}
            />
            <ExpandableList
              title="Funciones comprometidas"
              items={resultado.funciones_comprometidas}
              colorClass="text-red-500"
              icon={XCircle}
            />
          </div>

          {/* Restricciones críticas */}
          {resultado.restricciones_criticas?.length > 0 && (
            <ExpandableList
              title="Restricciones críticas (incompatibles con funciones esenciales)"
              items={resultado.restricciones_criticas}
              colorClass="text-red-500"
              icon={AlertTriangle}
            />
          )}

          {/* Justificación legal */}
          {resultado.justificacion_legal && (
            <div className="card bg-gray-50 border border-gray-200">
              <div className="flex gap-3">
                <Scale size={16} className="text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Marco normativo aplicable</p>
                  <p className="text-sm text-gray-700">{resultado.justificacion_legal}</p>
                </div>
              </div>
            </div>
          )}

          {resultado.proveedor_llm && (
            <p className="text-xs text-gray-400 text-right">Generado con {resultado.proveedor_llm}</p>
          )}
        </div>
      )}
    </div>
  )
}
