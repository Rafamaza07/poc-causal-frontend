import { useState } from 'react'
import API from '../api/client'

const RISK_STYLES = {
  BAJO:     'bg-green-100 text-green-800 border-green-200',
  MODERADO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ALTO:     'bg-orange-100 text-orange-800 border-orange-200',
  CRÍTICO:  'bg-red-100 text-red-800 border-red-200',
}
const REC_STYLES = {
  'CALIFICA_PENSION_INVALIDEZ':   'bg-red-50 border-red-400 text-red-800',
  'CONTINUAR_INCAPACIDAD':        'bg-yellow-50 border-yellow-400 text-yellow-800',
  'REINCORPORACION_CON_TERAPIAS': 'bg-green-50 border-green-400 text-green-800',
  'FORZAR_CALIFICACION_PCL':      'bg-orange-50 border-orange-400 text-orange-800',
}
const INP = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const INIT = { id_caso:'', edad:'', dias_incapacidad_acumulados:'', porcentaje_pcl:'',
               tipo_enfermedad:'comun', en_tratamiento_activo:1, pronostico_medico:'reservado',
               comorbilidades:'', requiere_reubicacion_laboral:0 }

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

export default function EvaluarPaciente() {
  const [form, setForm]       = useState(INIT)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await API.post('/api/evaluar-caso', {
        ...form,
        edad: parseFloat(form.edad),
        dias_incapacidad_acumulados: parseInt(form.dias_incapacidad_acumulados),
        porcentaje_pcl: parseFloat(form.porcentaje_pcl),
        comorbilidades: parseInt(form.comorbilidades),
        en_tratamiento_activo: parseInt(form.en_tratamiento_activo),
        requiere_reubicacion_laboral: parseInt(form.requiere_reubicacion_laboral),
      })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al evaluar el caso')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Evaluar Paciente</h1>
        <p className="text-gray-500 text-sm mt-1">Ingresa los datos clínicos para obtener una recomendación</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="ID del Caso" required>
              <input type="text" value={form.id_caso} onChange={e => set('id_caso', e.target.value)}
                className={INP} placeholder="CASO-2024-001" required />
            </Field>
            <Field label="Edad (años)" required>
              <input type="number" value={form.edad} onChange={e => set('edad', e.target.value)}
                className={INP} placeholder="45" min="18" max="100" required />
            </Field>
            <Field label="Días de Incapacidad Acumulados" required>
              <input type="number" value={form.dias_incapacidad_acumulados}
                onChange={e => set('dias_incapacidad_acumulados', e.target.value)}
                className={INP} placeholder="120" min="0" required />
            </Field>
            <Field label="Porcentaje PCL (%)" required>
              <input type="number" value={form.porcentaje_pcl}
                onChange={e => set('porcentaje_pcl', e.target.value)}
                className={INP} placeholder="38.5" min="0" max="100" step="0.1" required />
            </Field>
            <Field label="Comorbilidades" required>
              <input type="number" value={form.comorbilidades}
                onChange={e => set('comorbilidades', e.target.value)}
                className={INP} placeholder="2" min="0" required />
            </Field>
            <Field label="Tipo de Enfermedad">
              <select value={form.tipo_enfermedad} onChange={e => set('tipo_enfermedad', e.target.value)} className={INP}>
                <option value="comun">Común</option>
                <option value="laboral">Laboral</option>
              </select>
            </Field>
            <Field label="Pronóstico Médico">
              <select value={form.pronostico_medico} onChange={e => set('pronostico_medico', e.target.value)} className={INP}>
                <option value="favorable">Favorable</option>
                <option value="reservado">Reservado</option>
                <option value="malo">Malo</option>
              </select>
            </Field>
            <Field label="En Tratamiento Activo">
              <select value={form.en_tratamiento_activo} onChange={e => set('en_tratamiento_activo', e.target.value)} className={INP}>
                <option value={1}>Sí</option>
                <option value={0}>No</option>
              </select>
            </Field>
            <Field label="Requiere Reubicación Laboral">
              <select value={form.requiere_reubicacion_laboral} onChange={e => set('requiere_reubicacion_laboral', e.target.value)} className={INP}>
                <option value={0}>No</option>
                <option value={1}>Sí</option>
              </select>
            </Field>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <button type="submit" disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-8 py-2.5 rounded-lg transition-colors">
            {loading ? 'Evaluando...' : 'Evaluar Caso'}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Resultado — {result.id_caso}</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-800">{result.score_riesgo}</div>
              <div className="text-sm text-gray-500 mt-1">Score de Riesgo / 100</div>
              <span className={`mt-2 inline-block text-xs px-3 py-1 rounded-full border font-medium ${RISK_STYLES[result.nivel_riesgo] || ''}`}>
                {result.nivel_riesgo}
              </span>
            </div>
            <div className={`col-span-2 p-4 rounded-xl border-2 ${REC_STYLES[result.recomendacion] || ''}`}>
              <p className="text-xs font-medium uppercase tracking-wide opacity-70 mb-1">Recomendación</p>
              <p className="font-bold text-lg">{result.recomendacion?.replace(/_/g, ' ')}</p>
              <p className="text-xs mt-2 opacity-80">
                Confianza: {result.confianza ? `${(result.confianza*100).toFixed(0)}%` : '100%'}
                {' · '}Capa: {result.capa === 'reglas_normativas' ? 'Normativa' : 'Modelo Causal'}
              </p>
            </div>
          </div>
          {result.explicacion && (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">Explicación</p>
                <p className="text-sm text-blue-700">{result.explicacion.resumen}</p>
              </div>
              {result.explicacion.proximos_pasos?.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Próximos Pasos</p>
                  <ul className="space-y-1">
                    {result.explicacion.proximos_pasos.map((p, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-blue-500 font-bold">{i+1}.</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.variables_causales_detectadas?.length > 0 && (
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-xs text-gray-500">Variables causales:</span>
                  {result.variables_causales_detectadas.map(v => (
                    <span key={v} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{v}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
