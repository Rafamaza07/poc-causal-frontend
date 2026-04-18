import { useState } from 'react'
import { ArrowLeftRight, AlertTriangle } from 'lucide-react'
import API from '../api/client'

const RISK_STYLES = {
  BAJO:     'bg-green-100 text-green-800 border-green-200',
  MODERADO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ALTO:     'bg-orange-100 text-orange-800 border-orange-200',
  CRÍTICO:  'bg-red-100 text-red-800 border-red-200',
}
const EMPTY = { id_caso:'', edad:'', dias_incapacidad_acumulados:'', porcentaje_pcl:'',
                tipo_enfermedad:'comun', en_tratamiento_activo:1, pronostico_medico:'reservado',
                comorbilidades:'', requiere_reubicacion_laboral:0 }

const parse = f => ({
  ...f,
  edad: parseFloat(f.edad),
  dias_incapacidad_acumulados: parseInt(f.dias_incapacidad_acumulados),
  porcentaje_pcl: parseFloat(f.porcentaje_pcl),
  comorbilidades: parseInt(f.comorbilidades),
  en_tratamiento_activo: parseInt(f.en_tratamiento_activo),
  requiere_reubicacion_laboral: parseInt(f.requiere_reubicacion_laboral),
})

function PatientForm({ label, form, onChange }) {
  const s = (k, v) => onChange({ ...form, [k]: v })
  return (
    <div className="card p-5 space-y-3">
      <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2.5">{label}</h3>
      <input type="text" value={form.id_caso} onChange={e => s('id_caso', e.target.value)} className="input" placeholder="ID Caso" required />
      <div className="grid grid-cols-2 gap-2">
        <input type="number" value={form.edad} onChange={e => s('edad', e.target.value)} className="input" placeholder="Edad" min="18" max="100" required />
        <input type="number" value={form.dias_incapacidad_acumulados} onChange={e => s('dias_incapacidad_acumulados', e.target.value)} className="input" placeholder="Días incap." min="0" required />
        <input type="number" value={form.porcentaje_pcl} onChange={e => s('porcentaje_pcl', e.target.value)} className="input" placeholder="PCL %" min="0" max="100" step="0.1" required />
        <input type="number" value={form.comorbilidades} onChange={e => s('comorbilidades', e.target.value)} className="input" placeholder="Comorbilidades" min="0" required />
      </div>
      <select value={form.tipo_enfermedad} onChange={e => s('tipo_enfermedad', e.target.value)} className="input">
        <option value="comun">Enfermedad Común</option>
        <option value="laboral">Enfermedad Laboral</option>
      </select>
      <select value={form.pronostico_medico} onChange={e => s('pronostico_medico', e.target.value)} className="input">
        <option value="favorable">Pronóstico Favorable</option>
        <option value="reservado">Pronóstico Reservado</option>
        <option value="malo">Pronóstico Malo</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <select value={form.en_tratamiento_activo} onChange={e => s('en_tratamiento_activo', e.target.value)} className="input">
          <option value={1}>En tratamiento</option>
          <option value={0}>Sin tratamiento</option>
        </select>
        <select value={form.requiere_reubicacion_laboral} onChange={e => s('requiere_reubicacion_laboral', e.target.value)} className="input">
          <option value={0}>Sin reubicación</option>
          <option value={1}>Requiere reubicación</option>
        </select>
      </div>
    </div>
  )
}

function ResultCard({ data, isCritical }) {
  if (!data) return null
  return (
    <div className={`rounded-xl p-5 border-2 space-y-3 transition-shadow hover:shadow-lifted ${isCritical ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">{data.id_caso}</h4>
        {isCritical && (
          <span className="text-xs bg-red-500 text-white px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Más Crítico
          </span>
        )}
      </div>
      <div className="text-center py-4 bg-white rounded-xl border border-gray-100">
        <div className="text-4xl font-bold text-gray-800">{data.score_riesgo}</div>
        <div className="text-xs text-gray-500 mt-1">Score / 100</div>
        <span className={`mt-2 inline-block text-xs px-2.5 py-0.5 rounded-full border font-medium ${RISK_STYLES[data.nivel_riesgo] || ''}`}>
          {data.nivel_riesgo}
        </span>
      </div>
      <div className="text-sm text-center font-medium text-gray-700">
        {data.recomendacion?.replace(/_/g, ' ')}
      </div>
      <div className="text-xs text-gray-500 text-center">
        Confianza: {data.confianza ? `${(data.confianza*100).toFixed(0)}%` : '100%'}
        {' · '}{data.capa === 'reglas_normativas' ? 'Normativa' : 'Modelo Causal'}
      </div>
      {data.explicacion?.proximos_pasos?.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-600 mb-1.5">Próximos pasos:</p>
          <ul className="space-y-1">
            {data.explicacion.proximos_pasos.slice(0,3).map((p, i) => (
              <li key={i} className="text-xs text-gray-500 flex gap-1.5">
                <span className="text-brand-600 font-bold">{i+1}.</span>{p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function Comparar() {
  const [p1, setP1]           = useState(EMPTY)
  const [p2, setP2]           = useState(EMPTY)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleCompare = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await API.post('/api/comparar', { paciente_1: parse(p1), paciente_2: parse(p2) })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al comparar')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Comparar Pacientes</h1>
        <p className="text-gray-500 text-sm mt-1">Evalúa dos casos y compara resultados lado a lado</p>
      </div>
      <form onSubmit={handleCompare} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PatientForm label="Paciente 1" form={p1} onChange={setP1} />
          <PatientForm label="Paciente 2" form={p2} onChange={setP2} />
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in">{error}</div>}
        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
          <ArrowLeftRight className="w-4 h-4" />
          {loading ? 'Comparando...' : 'Comparar Casos'}
        </button>
      </form>
      {result && (
        <div className="space-y-4 animate-slide-up">
          <div className="bg-gradient-to-r from-sidebar to-slate-800 text-white rounded-xl p-5 text-center shadow-lifted">
            <p className="text-sm text-slate-400 font-medium">Caso más crítico</p>
            <p className="text-xl font-bold mt-1">{result.mas_critico}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultCard data={result.detalle_paciente_1} isCritical={result.mas_critico === result.detalle_paciente_1?.id_caso} />
            <ResultCard data={result.detalle_paciente_2} isCritical={result.mas_critico === result.detalle_paciente_2?.id_caso} />
          </div>
        </div>
      )}
    </div>
  )
}
