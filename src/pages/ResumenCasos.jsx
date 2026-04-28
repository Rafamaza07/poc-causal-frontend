import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, CheckCircle, Clock, Search, FileText,
  ArrowRight, Activity, UserCheck, Briefcase, ChevronRight,
  Filter, TrendingUp, Calendar,
} from 'lucide-react'
import API from '../api/client'
import { SkeletonResumenCard } from '../Components/Skeleton'
import EmptyState from '../Components/EmptyState'

/* ── Lookups ────────────────────────────────────────────────────────────── */

const ORIGEN_DISPLAY = {
  laboral:            'Accidente laboral',
  accidente_trabajo:  'Accidente laboral',
  accidente_laboral:  'Accidente laboral',
  enfermedad_laboral: 'Enfermedad laboral',
  comun:              'Enfermedad común',
  enfermedad_comun:   'Enfermedad común',
}

const getOrigen = (tipo) => {
  if (!tipo) return '—'
  return ORIGEN_DISPLAY[tipo.toLowerCase()] ?? tipo
}

const getEstado = (c) => {
  if (c.reintegrado) return 'Reintegrado'
  if (c.reubicado)   return 'Reubicado'
  if ((c.dias_incapacidad_acumulados ?? 0) > 0) return 'Incapacitado'
  return 'Productivo'
}

const SEV = {
  ROJO: {
    border:    '#ef4444',
    iconBg:    'bg-red-50',
    iconColor: 'text-red-500',
    badge:     'bg-red-50 text-red-700 border-red-200',
    dot:       'bg-red-400',
    label:     'Urgente',
  },
  AMARILLO: {
    border:    '#f59e0b',
    iconBg:    'bg-amber-50',
    iconColor: 'text-amber-500',
    badge:     'bg-amber-50 text-amber-700 border-amber-200',
    dot:       'bg-amber-400',
    label:     'Seguimiento',
  },
  VERDE: {
    border:    '#10b981',
    iconBg:    'bg-emerald-50',
    iconColor: 'text-emerald-600',
    badge:     'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot:       'bg-emerald-400',
    label:     'Listo',
  },
}

const DEFAULT_SEV = {
  border:    '#d1d5db',
  iconBg:    'bg-gray-100',
  iconColor: 'text-gray-400',
  badge:     'bg-gray-50 text-gray-600 border-gray-200',
  dot:       'bg-gray-300',
  label:     '—',
}

const FILTERS = [
  { value: 'ALL',      label: 'Todos' },
  { value: 'ROJO',     label: 'Urgentes' },
  { value: 'AMARILLO', label: 'Seguimiento' },
  { value: 'VERDE',    label: 'Listos' },
]

/* ── Case card ──────────────────────────────────────────────────────────── */

function CaseCard({ c, onClick }) {
  const sev    = SEV[c.semaforo] ?? DEFAULT_SEV
  const origen = getOrigen(c.tipo_enfermedad)
  const estado = getEstado(c)
  const esLaboral = origen.toLowerCase().includes('laboral')

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group overflow-hidden"
      style={{ borderLeft: `3px solid ${sev.border}` }}
    >
      <div className="p-5">

        {/* ── Row 1: Avatar + Nombre + Badge ── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${sev.iconBg}`}>
              <UserCheck className={`w-4.5 h-4.5 ${sev.iconColor}`} size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-sm leading-tight truncate group-hover:text-brand-600 transition-colors">
                {c.nombre_trabajador || c.id_caso}
              </h3>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                CC {c.documento || c.id_caso}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full border flex-shrink-0 uppercase tracking-wide ${sev.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
            {sev.label}
          </span>
        </div>

        {/* ── Row 2: Metadata chips ── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-1">Diagnóstico</p>
            <p className="text-[11px] font-bold text-gray-800 truncate">{c.codigo_cie10 || '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-1">Origen</p>
            <p className={`text-[11px] font-bold truncate ${esLaboral ? 'text-brand-600' : 'text-gray-700'}`}>
              {origen}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-1">Estado</p>
            <p className="text-[11px] font-bold text-gray-700 truncate">{estado}</p>
          </div>
        </div>

        {/* ── Row 3: Días + Pendiente ── */}
        <div className="flex items-center gap-3 mb-4">
          {(c.dias_incapacidad_acumulados ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-bold text-gray-700">{c.dias_incapacidad_acumulados}</span>
              <span>días acum.</span>
            </div>
          )}
          {c.faltante && c.faltante !== 'Sin pendientes' && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 min-w-0">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-medium truncate">{c.faltante}</span>
            </div>
          )}
        </div>

        {/* ── Row 4: Pregunta orientadora ── */}
        {c.pregunta && (
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 flex items-start gap-2 mb-4">
            <ArrowRight className="w-3.5 h-3.5 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest mb-0.5">Acción sugerida</p>
              <p className="text-[11px] text-brand-800 font-medium leading-snug">{c.pregunta}</p>
            </div>
          </div>
        )}

        {/* ── Row 5: Ruta + Ver detalle ── */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide truncate max-w-[60%]">
            {c.ruta || '—'}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-600 group-hover:gap-2 transition-all">
            Ver detalle <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>
    </div>
  )
}

/* ── Main ───────────────────────────────────────────────────────────────── */

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

  const rojos    = all.filter(c => c.semaforo === 'ROJO').length
  const amarillos = all.filter(c => c.semaforo === 'AMARILLO').length
  const verdes   = all.filter(c => c.semaforo === 'VERDE').length

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

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #3b76f6 0%, #8b5cf6 50%, #10b981 100%)' }} />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Resumen ejecutivo</h1>
              <p className="text-sm text-gray-500 mt-0.5">Vista consolidada de casos activos por ruta de gestión</p>
            </div>
            <div className="flex items-center gap-2 bg-brand-50 border border-brand-100 px-4 py-2 rounded-xl">
              <Activity className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-bold text-brand-700">
                {loading ? '…' : all.length} casos
              </span>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Urgentes */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-red-700 tabular-nums leading-none mb-0.5">{rojos}</div>
                <div className="text-xs text-red-500 font-semibold">Urgente · hitos legales</div>
              </div>
            </div>
            {/* Seguimiento */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-amber-700 tabular-nums leading-none mb-0.5">{amarillos}</div>
                <div className="text-xs text-amber-500 font-semibold">Seguimiento · fueros</div>
              </div>
            </div>
            {/* Listos */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-emerald-700 tabular-nums leading-none mb-0.5">{verdes}</div>
                <div className="text-xs text-emerald-500 font-semibold">Listos para cierre</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o diagnóstico CIE-10..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-0.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl flex-shrink-0">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                filter === f.value
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {f.label}
              {f.value !== 'ALL' && !loading && (
                <span className="ml-1.5 text-[10px] tabular-nums font-bold opacity-60">
                  {f.value === 'ROJO' ? rojos : f.value === 'AMARILLO' ? amarillos : verdes}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonResumenCard key={i} />)}
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* ── Grid de tarjetas ────────────────────────────────────────── */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(c => (
            <CaseCard
              key={c.id}
              c={c}
              onClick={() => navigate(`/historial/${c.id_caso}`)}
            />
          ))}
        </div>
      )}

      {/* ── Estado vacío ────────────────────────────────────────────── */}
      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 py-4">
          <EmptyState
            icon={Activity}
            title={all.length === 0 ? 'Sin casos registrados' : 'Sin resultados'}
            description={
              all.length === 0
                ? 'Evalúa un caso para verlo aquí con su ruta de gestión.'
                : 'Prueba ajustando los filtros o el término de búsqueda.'
            }
          />
        </div>
      )}

      {/* ── Footer legal ────────────────────────────────────────────── */}
      {!loading && all.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <Briefcase className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Exposición médico-legal · {all.length} casos
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-red-600">{rojos}</span> caso(s) urgente(s) con hitos legales inminentes.{' '}
              <span className="font-semibold text-amber-600">{amarillos}</span> en seguimiento con posibles fueros de estabilidad reforzada.{' '}
              <span className="font-semibold text-emerald-600">{verdes}</span> listos para cierre formal.
              Toda decisión debe estar motivada bajo el concepto de Estabilidad Laboral Reforzada.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
