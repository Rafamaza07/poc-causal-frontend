import { useState, useEffect, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Line,
} from 'recharts'
import {
  Activity, TrendingUp, Calendar, AlertTriangle,
  CheckCircle, Users,
} from 'lucide-react'
import API from '../api/client'
import StatCard from '../Components/StatCard'
import DistributionPie from '../Components/charts/DistributionPie'
import DataTable from '../Components/DataTable'
import CIE10Search from '../Components/CIE10Search'
import EmptyState from '../Components/EmptyState'
import { RECOMENDACIONES } from '../utils/constants'

// ── Constants ─────────────────────────────────────────────────────────────────

const PERIODOS = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
]

const REC_COLORS = {
  REINCORPORACION_INMEDIATA:    '#10b981',
  REINCORPORACION_CON_TERAPIAS: '#3b76f6',
  CONTINUAR_INCAPACIDAD:        '#f59e0b',
  CALIFICA_PENSION_INVALIDEZ:   '#ef4444',
  FORZAR_CALIFICACION_PCL:      '#f97316',
}

const PROD_COLS = [
  {
    key: 'nombre',
    label: 'Evaluador',
    render: (v) => <span className="font-medium text-gray-900">{v}</span>,
  },
  {
    key: 'casos',
    label: 'Casos',
    render: (v) => <span className="font-bold text-brand-600">{v}</span>,
  },
  {
    key: 'score_promedio',
    label: 'Score promedio',
    render: (v) => (
      <span className={`font-semibold tabular-nums ${
        v >= 75 ? 'text-red-600' : v >= 50 ? 'text-orange-500' : v >= 25 ? 'text-amber-500' : 'text-emerald-600'
      }`}>
        {v} <span className="text-xs font-normal text-gray-400">/100</span>
      </span>
    ),
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function CardSkeleton({ height = 64 }) {
  return <div className={`bg-gray-100 rounded-xl animate-pulse`} style={{ height }} />
}

function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
  )
}

function SectionCard({ title, subtitle, loading, children, action }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {loading && <Spinner />}
        {action}
      </div>
      {children}
    </div>
  )
}

// ── Comparativo CIE-10 card ───────────────────────────────────────────────────

function ComparativoCard({ c }) {
  const refMin = c.dias_referencia?.min
  const refMax = c.dias_referencia?.max
  const hasRef = refMax != null

  const excede = hasRef && c.dias_promedio_tenant > refMax
  const scale  = hasRef ? refMax * 1.6 : c.dias_promedio_tenant * 1.5 || 1

  const barTenant = Math.min((c.dias_promedio_tenant / scale) * 100, 100)
  const barRefMin = hasRef ? Math.min((refMin / scale) * 100, 100) : 0
  const barRefMax = hasRef ? Math.min((refMax / scale) * 100, 100) : 0

  return (
    <div className={`mt-4 rounded-xl border-2 p-5 ${
      excede ? 'border-red-200 bg-red-50/30' : 'border-emerald-200 bg-emerald-50/30'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{c.codigo}</span>
          <p className="text-base font-bold text-gray-800 mt-0.5 leading-snug">{c.descripcion}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          excede ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {excede
            ? <AlertTriangle className="w-3.5 h-3.5" />
            : <CheckCircle className="w-3.5 h-3.5" />}
          {excede ? 'Excede referencia' : 'Dentro del rango'}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Casos en tu org.',    val: c.casos_en_tenant,         color: 'text-gray-800' },
          { label: 'Días promedio',        val: c.dias_promedio_tenant,    color: excede ? 'text-red-600' : 'text-emerald-600' },
          { label: 'Referencia (días)',    val: hasRef ? `${refMin}–${refMax}` : '—', color: 'text-gray-800' },
          { label: 'Exceden referencia',   val: `${c.casos_exceden_referencia} (${c.porcentaje_exceden}%)`, color: excede ? 'text-red-600' : 'text-gray-500' },
        ].map(({ label, val, color }) => (
          <div key={label}>
            <p className="text-xs text-gray-400 leading-snug">{label}</p>
            <p className={`text-xl font-bold mt-0.5 ${color}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Dual bar */}
      {hasRef && (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500 font-medium">Tu organización</span>
              <span className={`font-bold ${excede ? 'text-red-600' : 'text-emerald-600'}`}>
                {c.dias_promedio_tenant} días
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${excede ? 'bg-red-400' : 'bg-emerald-400'}`}
                style={{ width: `${barTenant}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500 font-medium">Rango de referencia</span>
              <span className="text-gray-600 font-semibold">{refMin}–{refMax} días</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
              <div
                className="absolute h-full bg-blue-300 rounded-full"
                style={{ left: `${barRefMin}%`, width: `${Math.max(barRefMax - barRefMin, 2)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Alert banner */}
      {excede && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            {c.casos_exceden_referencia} de {c.casos_en_tenant} casos ({c.porcentaje_exceden}%)
            superan el máximo de {refMax} días para este diagnóstico.
          </span>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Analytics() {
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
  }, [])
  const isAdmin = user.rol === 'admin' || !!user.superadmin

  const [periodo, setPeriodo] = useState('30d')

  const [overview,    setOverview]   = useState(null)
  const [ovLoading,   setOvLoading]  = useState(true)

  const [tendencias,  setTendencias] = useState(null)
  const [tLoading,    setTLoading]   = useState(true)

  const [cie10Sel,    setCie10Sel]   = useState(null)
  const [comparativo, setComp]       = useState(null)
  const [cLoading,    setCLoading]   = useState(false)

  const [evaluadores, setEvals]      = useState([])
  const [pLoading,    setPLoading]   = useState(false)

  // Overview (sin periodo)
  useEffect(() => {
    setOvLoading(true)
    API.get('/api/v1/analytics/overview')
      .then(({ data }) => setOverview(data))
      .catch(() => setOverview(null))
      .finally(() => setOvLoading(false))
  }, [])

  // Tendencias (cambia con periodo)
  useEffect(() => {
    setTLoading(true)
    API.get(`/api/v1/analytics/tendencias?periodo=${periodo}`)
      .then(({ data }) => setTendencias(data))
      .catch(() => setTendencias(null))
      .finally(() => setTLoading(false))
  }, [periodo])

  // Productividad (solo admin, una vez)
  useEffect(() => {
    if (!isAdmin) return
    setPLoading(true)
    API.get('/api/v1/analytics/productividad')
      .then(({ data }) => setEvals(data.evaluadores ?? []))
      .catch(() => setEvals([]))
      .finally(() => setPLoading(false))
  }, [isAdmin])

  // Comparativo CIE-10
  useEffect(() => {
    if (!cie10Sel) { setComp(null); return }
    setCLoading(true)
    API.get(`/api/v1/analytics/comparativo-cie10?codigo=${encodeURIComponent(cie10Sel.codigo)}`)
      .then(({ data }) => setComp(data))
      .catch(() => setComp(null))
      .finally(() => setCLoading(false))
  }, [cie10Sel])

  // ── Derived data ───────────────────────────────────────────────────────────

  const pieData = useMemo(() => {
    const dist = overview?.distribucion_recomendaciones ?? {}
    return Object.entries(dist)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => ({
        name:  RECOMENDACIONES[k]?.label ?? k.replace(/_/g, ' '),
        value: v,
        color: REC_COLORS[k] ?? '#6b7280',
      }))
  }, [overview])

  const cie10Data = useMemo(() => (
    (overview?.top_diagnosticos_cie10 ?? []).map(d => {
      const desc = d.descripcion ?? d.codigo
      const label = desc.length > 20 ? desc.slice(0, 20) + '…' : desc
      return { label: `${d.codigo} · ${label}`, count: d.count }
    })
  ), [overview])

  // Merge daily evaluaciones + weekly scores into weekly chart points
  const tendenciasChart = useMemo(() => {
    if (!tendencias) return []
    const scoreByWeek = {}
    for (const w of tendencias.score_promedio_por_semana ?? []) {
      scoreByWeek[w.semana] = w.score
    }
    const weekCount = {}
    for (const d of tendencias.evaluaciones_por_dia ?? []) {
      const dt = new Date(d.fecha + 'T12:00:00')
      const yr = dt.getFullYear()
      const jan1 = new Date(yr, 0, 1)
      const wk = Math.floor((dt.getTime() - jan1.getTime()) / (7 * 86400000))
      const key = `${yr}-W${String(wk).padStart(2, '0')}`
      weekCount[key] = (weekCount[key] ?? 0) + d.count
    }
    return Object.keys(scoreByWeek).sort().map(k => ({
      label: 'S' + k.replace(/\d{4}-W0?/, ''),
      count: weekCount[k] ?? 0,
      score: scoreByWeek[k] ?? null,
    }))
  }, [tendencias])

  const varPct = overview?.variacion_mensual
  const varStr = varPct != null
    ? (varPct > 0 ? `+${varPct}%` : `${varPct}%`)
    : null
  const casosCriticos = overview?.distribucion_riesgo?.CRITICO ?? 0

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!ovLoading && (overview?.total_casos ?? 0) < 5) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4 animate-fade-in">
        <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 shadow-soft">
          <Activity className="w-10 h-10 text-brand-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Se necesitan al menos 5 casos</h2>
        <p className="text-gray-500 mt-2 max-w-sm text-sm leading-relaxed">
          Analytics requiere un mínimo de 5 evaluaciones para generar métricas y tendencias significativas.
          {overview?.total_casos > 0 && ` Tienes ${overview.total_casos} caso${overview.total_casos !== 1 ? 's' : ''} — ¡casi listo!`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header + periodo pills ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Métricas y tendencias de tu organización</p>
        </div>
        <div className="flex flex-wrap items-center gap-0.5 p-1 bg-gray-100 rounded-xl">
          {PERIODOS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                periodo === p.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── ROW 1: Stat cards ───────────────────────────────────────────── */}
      {ovLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mb-4" />
              <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-3.5 bg-gray-100 rounded w-28" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            value={overview?.total_casos ?? 0}
            label="Casos evaluados"
            icon={Activity}
            iconBg="bg-blue-100" iconColor="text-blue-600"
            change={varStr}
            changeLabel="vs mes anterior"
          />
          <StatCard
            value={overview?.score_promedio ?? '—'}
            label="Score promedio"
            icon={TrendingUp}
            iconBg="bg-violet-100" iconColor="text-violet-600"
            changeLabel="Riesgo promedio /100"
          />
          <StatCard
            value={casosCriticos}
            label="Casos críticos"
            icon={AlertTriangle}
            iconBg={casosCriticos > 0 ? 'bg-red-100' : 'bg-gray-100'}
            iconColor={casosCriticos > 0 ? 'text-red-600' : 'text-gray-400'}
            critical={casosCriticos > 0}
            changeLabel="Score ≥ 75/100"
          />
          <StatCard
            value={overview?.dias_promedio ?? '—'}
            label="Días promedio"
            icon={Calendar}
            iconBg="bg-amber-100" iconColor="text-amber-600"
            changeLabel="Incapacidad acumulada"
          />
        </div>
      )}

      {/* ── ROW 2: Tendencias ───────────────────────────────────────────── */}
      <SectionCard
        title="Tendencias"
        subtitle="Evaluaciones por semana y score promedio"
        loading={tLoading}
      >
        {tLoading ? (
          <CardSkeleton height={300} />
        ) : tendenciasChart.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-gray-400">
            Sin datos para este período
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={tendenciasChart} margin={{ top: 4, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false} tickLine={false}
                unit=" pts"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10, border: 'none',
                  boxShadow: '0 4px 16px -4px rgba(0,0,0,0.12)', fontSize: 12,
                }}
                formatter={(val, name) => [
                  name === 'Evaluaciones' ? `${val} casos` : `${val} pts`,
                  name,
                ]}
              />
              <Bar
                yAxisId="left"
                dataKey="count"
                name="Evaluaciones"
                fill="#bfdbfe"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="score"
                name="Score"
                stroke="#3b76f6"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#3b76f6', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </SectionCard>

      {/* ── ROW 3: Distribuciones ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pie recomendaciones */}
        <SectionCard
          title="Distribución de recomendaciones"
          subtitle="Proporción histórica total"
          loading={ovLoading}
        >
          {ovLoading ? (
            <CardSkeleton height={260} />
          ) : pieData.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
              Sin datos disponibles
            </div>
          ) : (
            <DistributionPie
              data={pieData}
              nameKey="name"
              valueKey="value"
              colors={pieData.map(d => d.color)}
              height={260}
              innerRadius={55}
            />
          )}
        </SectionCard>

        {/* Top CIE-10 horizontal bar */}
        <SectionCard
          title="Top 10 diagnósticos CIE-10"
          subtitle="Casos con código asignado"
          loading={ovLoading}
        >
          {ovLoading ? (
            <CardSkeleton height={260} />
          ) : cie10Data.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-sm text-gray-400">
              Sin diagnósticos CIE-10 registrados
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={cie10Data}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false} tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={false} tickLine={false}
                  width={148}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10, border: 'none',
                    boxShadow: '0 4px 16px -4px rgba(0,0,0,0.12)', fontSize: 12,
                  }}
                  formatter={(v) => [`${v} casos`, 'Frecuencia']}
                />
                <Bar
                  dataKey="count"
                  name="Casos"
                  fill="#3b76f6"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      {/* ── ROW 4: Comparativo CIE-10 ───────────────────────────────────── */}
      <SectionCard
        title="Comparativo CIE-10"
        subtitle="Compara tu organización con los rangos de referencia nacionales"
        loading={cLoading}
      >
        <CIE10Search
          value={cie10Sel}
          onSelect={item => { setCie10Sel(item); setComp(null) }}
          showDetails={false}
          placeholder="Buscar diagnóstico para comparar..."
        />

        {cLoading && <CardSkeleton height={140} />}

        {!cLoading && comparativo && <ComparativoCard c={comparativo} />}

        {!cLoading && !comparativo && !cie10Sel && (
          <p className="mt-6 text-center text-sm text-gray-400 py-8">
            Selecciona un diagnóstico CIE-10 para ver el comparativo
          </p>
        )}

        {!cLoading && !comparativo && cie10Sel && (
          <p className="mt-4 text-sm text-gray-400 text-center py-4">
            Sin datos para {cie10Sel.codigo} en tu organización
          </p>
        )}
      </SectionCard>

      {/* ── ROW 5: Productividad (solo admin) ───────────────────────────── */}
      {isAdmin && (
        <SectionCard
          title="Productividad de evaluadores"
          subtitle="Casos evaluados y score promedio por profesional"
          loading={pLoading}
          action={<Users className="w-4 h-4 text-brand-600" />}
        >
          {pLoading ? (
            <div className="space-y-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <DataTable
              columns={PROD_COLS}
              data={evaluadores}
              emptyTitle="Sin evaluadores registrados"
              emptyDescription="Los evaluadores aparecerán aquí una vez que evalúen casos"
            />
          )}
        </SectionCard>
      )}

    </div>
  )
}
