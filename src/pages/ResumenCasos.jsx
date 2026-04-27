import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, CheckCircle, Clock, Search, FileText,
  ArrowRight, ShieldAlert, Activity, UserCheck, Briefcase,
} from 'lucide-react'
import API from '../api/client'

// ---------------------------------------------------------------------------
// Helpers de visualización
// ---------------------------------------------------------------------------

const ORIGEN_DISPLAY = {
  laboral:            'ACCIDENTE LABORAL',
  accidente_trabajo:  'ACCIDENTE LABORAL',
  accidente_laboral:  'ACCIDENTE LABORAL',
  enfermedad_laboral: 'ENFERMEDAD LABORAL',
  comun:              'ENFERMEDAD COMÚN',
  enfermedad_comun:   'ENFERMEDAD COMÚN',
}

const getOrigen = (tipo) => {
  if (!tipo) return '—'
  return ORIGEN_DISPLAY[tipo.toLowerCase()] ?? tipo.toUpperCase()
}

const getEstado = (c) => {
  if (c.reintegrado) return 'REINTEGRADO'
  if (c.reubicado)   return 'REUBICADO'
  if ((c.dias_incapacidad_acumulados ?? 0) > 0) return 'INCAPACITADO'
  return 'PRODUCTIVO'
}

const SEV_CARD = {
  ROJO:     { bar: 'bg-red-500',    icon: 'bg-red-100 text-red-600',    badge: 'bg-red-50 text-red-700 border-red-200'   },
  AMARILLO: { bar: 'bg-yellow-500', icon: 'bg-yellow-100 text-yellow-600', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  VERDE:    { bar: 'bg-green-500',  icon: 'bg-green-100 text-green-600',  badge: 'bg-green-50 text-green-700 border-green-200'  },
}

const DEFAULT_SEV = { bar: 'bg-gray-300', icon: 'bg-gray-100 text-gray-500', badge: 'bg-gray-50 text-gray-600 border-gray-200' }

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function ResumenCasos() {
  const navigate = useNavigate()
  const [all,     setAll]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('ALL')

  useEffect(() => {
    setLoading(true)
    API.get('/api/casos/resumen?skip=0&limit=100')
      .then(res => setAll(res.data.items ?? []))
      .catch(e  => setError(e.response?.data?.detail ?? e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = all.filter(c => {
    const term = search.toLowerCase()
    const matchSearch =
      (c.nombre_trabajador ?? '').toLowerCase().includes(term) ||
      (c.documento         ?? '').includes(term)               ||
      (c.id_caso           ?? '').toLowerCase().includes(term) ||
      (c.codigo_cie10      ?? '').toLowerCase().includes(term)
    const matchFilter = filter === 'ALL' || c.semaforo === filter
    return matchSearch && matchFilter
  })

  const rojos    = all.filter(c => c.semaforo === 'ROJO').length
  const amarillos = all.filter(c => c.semaforo === 'AMARILLO').length
  const verdes   = all.filter(c => c.semaforo === 'VERDE').length

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6 mb-6 border-t-4 border-indigo-600">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-3 rounded-lg shadow-lg">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold italic">Resumen de Gestión SST</h1>
              <p className="text-slate-500 text-xs">Vista ejecutiva de casos activos por ruta de acción</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
            <Activity className="text-indigo-500" size={18} />
            <span className="text-sm font-black text-indigo-700">{all.length} Casos cargados</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-red-700 text-[10px] font-bold uppercase tracking-wider">Urgente (Hitos Legales)</span>
              <AlertTriangle className="text-red-500" size={16} />
            </div>
            <div className="text-2xl font-black text-red-800">{rojos}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-yellow-700 text-[10px] font-bold uppercase tracking-wider">Seguimiento / Fueros</span>
              <Clock className="text-yellow-500" size={16} />
            </div>
            <div className="text-2xl font-black text-yellow-800">{amarillos}</div>
          </div>
          <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-green-700 text-[10px] font-bold uppercase tracking-wider">Listos para Cierre</span>
              <CheckCircle className="text-green-500" size={16} />
            </div>
            <div className="text-2xl font-black text-green-800">{verdes}</div>
          </div>
        </div>
      </div>

      {/* ── Controls ───────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Filtrar por nombre, cédula, diagnóstico..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm outline-none cursor-pointer"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="ALL">Todos los estados</option>
          <option value="ROJO">Riesgo Alto (Rojo)</option>
          <option value="AMARILLO">Seguimiento (Amarillo)</option>
          <option value="VERDE">Cerrados (Verde)</option>
        </select>
      </div>

      {/* ── Loading / Error ─────────────────────────────────────────────── */}
      {loading && (
        <div className="max-w-6xl mx-auto py-20 text-center text-slate-400 font-bold">Cargando casos...</div>
      )}
      {error && (
        <div className="max-w-6xl mx-auto py-10 text-center text-red-500 font-bold">{error}</div>
      )}

      {/* ── Grid de tarjetas ────────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(c => {
            const sev    = SEV_CARD[c.semaforo] ?? DEFAULT_SEV
            const origen = getOrigen(c.tipo_enfermedad)
            const estado = getEstado(c)
            const cc     = c.documento || c.id_caso

            return (
              <div
                key={c.id}
                onClick={() => navigate(`/historial/${c.id_caso}`)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-indigo-400 transition-all group cursor-pointer"
              >
                <div className={`h-1.5 w-full ${sev.bar}`} />
                <div className="p-4">

                  {/* Nombre + ruta badge */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${sev.icon}`}>
                        <UserCheck size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                          {c.nombre_trabajador || c.id_caso}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">CC: {cc}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase border ${sev.badge}`}>
                      {c.ruta}
                    </span>
                  </div>

                  {/* Diagnóstico + Origen */}
                  <div className="grid grid-cols-2 gap-4 mb-3 text-[10px]">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <p className="text-slate-400 font-bold uppercase mb-0.5">Diagnóstico</p>
                      <p className="font-bold text-slate-700 truncate">{c.codigo_cie10 || '—'}</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <p className="text-slate-400 font-bold uppercase mb-0.5 tracking-tighter">Origen Contingencia</p>
                      <p className={`font-black ${origen.includes('LABORAL') ? 'text-indigo-600' : 'text-slate-600'}`}>
                        {origen}
                      </p>
                    </div>
                  </div>

                  {/* Estado + Días */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Estado</span>
                      <span className="text-[11px] font-bold text-slate-600">{estado}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Incapacidad</span>
                      <span className="text-[11px] font-black text-slate-800">
                        {(c.dias_incapacidad_acumulados ?? 0) > 0 ? `${c.dias_incapacidad_acumulados} Días` : '0'}
                      </span>
                    </div>
                  </div>

                  {/* Faltante */}
                  <div className="border-t border-slate-100 pt-3 mb-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Documento Faltante:</p>
                    <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                      <FileText size={14} className="shrink-0" />
                      <span className="text-[11px] font-black leading-tight">{c.faltante || 'Sin pendientes'}</span>
                    </div>
                  </div>

                  {/* Pregunta orientadora */}
                  <div className="bg-slate-900 p-3 rounded-lg flex items-start gap-2 shadow-inner">
                    <ArrowRight className="text-indigo-400 mt-0.5 shrink-0" size={16} />
                    <div>
                      <p className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest">Pregunta de Gestión:</p>
                      <p className="text-[11px] text-white italic leading-tight">"{c.pregunta}"</p>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Estado vacío ────────────────────────────────────────────────── */}
      {!loading && !error && filtered.length === 0 && (
        <div className="max-w-6xl mx-auto py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic">No se encontraron registros para los filtros aplicados.</p>
        </div>
      )}

      {/* ── Footer legal ────────────────────────────────────────────────── */}
      {!loading && all.length > 0 && (
        <div className="max-w-6xl mx-auto mt-6 text-[10px] text-slate-500 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
          <Briefcase className="text-slate-400 shrink-0" size={18} />
          <div>
            <p className="font-bold mb-1 text-slate-700 uppercase">
              Resumen de Exposición Médico-Legal ({all.length} Casos):
            </p>
            <p>
              {rojos} caso(s) en estado urgente requieren atención inmediata por hitos legales.{' '}
              {amarillos} caso(s) en seguimiento activo con posibles fueros de estabilidad reforzada.{' '}
              {verdes} caso(s) listos para cierre formal. Toda decisión de cierre o terminación debe
              estar motivada legalmente bajo el concepto de Estabilidad Laboral Reforzada.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
