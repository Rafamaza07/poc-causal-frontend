import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import {
  ClipboardList, AlertTriangle, Bell, Calendar,
  Plus, ChevronRight, Clock,
} from 'lucide-react'
import API from '../api/client'
import StatCard from '../Components/StatCard'
import SeverityTag from '../Components/SeverityTag'
import ScoreBadge from '../Components/ScoreBadge'
import EmptyState from '../Components/EmptyState'
import { SkeletonStatCard, SkeletonChart, SkeletonAlertItem } from '../Components/LoadingSkeleton'

// ── Constants ──────────────────────────────────────────

const REC_LABELS = {
  CALIFICA_PENSION_INVALIDEZ:   'Pensión invalidez',
  CONTINUAR_INCAPACIDAD:        'Continuar',
  REINCORPORACION_CON_TERAPIAS: 'Reincorporación',
  FORZAR_CALIFICACION_PCL:      'Forzar PCL',
}
const REC_COLORS = {
  CALIFICA_PENSION_INVALIDEZ:   '#ef4444',
  CONTINUAR_INCAPACIDAD:        '#f59e0b',
  REINCORPORACION_CON_TERAPIAS: '#22c55e',
  FORZAR_CALIFICACION_PCL:      '#f97316',
}
const RISK_STYLES = {
  BAJO:     'bg-green-100 text-green-800',
  MODERADO: 'bg-yellow-100 text-yellow-800',
  ALTO:     'bg-orange-100 text-orange-800',
  CRÍTICO:  'bg-red-100 text-red-800',
}

// ── Helpers ─────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function formatDate() {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function buildWeeklyData(casos) {
  if (!casos.length) return []
  const weeks = {}
  casos.forEach(c => {
    const d = new Date(c.fecha)
    const monday = new Date(d)
    monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    const key = monday.toISOString().slice(0, 10)
    if (!weeks[key]) weeks[key] = { key, count: 0, totalScore: 0, n: 0 }
    weeks[key].count++
    weeks[key].totalScore += Number(c.score_riesgo) || 0
    weeks[key].n++
  })
  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([key, w]) => ({
      semana: new Date(key + 'T00:00:00').toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
      evaluaciones: w.count,
      scorePromedio: w.n ? Math.round(w.totalScore / w.n) : 0,
    }))
}

// ── Sub-components ──────────────────────────────────────

function AlertRow({ alert }) {
  const dotColors = {
    CRITICAL: 'bg-red-500', HIGH: 'bg-orange-500',
    MEDIUM: 'bg-yellow-500', LOW: 'bg-green-500',
    CRÍTICO: 'bg-red-500', ALTO: 'bg-orange-500',
    MODERADO: 'bg-yellow-500', BAJO: 'bg-green-500',
  }
  const dot = dotColors[alert.severidad] || 'bg-gray-400'
  const severidad = alert.severidad || alert.severity
  const mensaje = alert.mensaje || alert.message || alert.descripcion || ''
  const idCaso = alert.id_caso || alert.caso_id || ''
  const tiempo = alert.created_at
    ? new Date(alert.created_at).toLocaleDateString('es-CO')
    : ''

  return (
    <div className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50/80 transition-colors duration-150 cursor-pointer group border-b border-gray-50 last:border-0">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-brand-700 transition-colors">
          {idCaso && <span className="text-brand-700 mr-1">{idCaso}</span>}
          {mensaje}
        </p>
        {tiempo && <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{tiempo}</p>}
      </div>
      <SeverityTag severity={severidad} />
    </div>
  )
}

function CustomDonutLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ── Main component ──────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()

  const [stats, setStats]             = useState(null)
  const [casos, setCasos]             = useState([])
  const [alertSummary, setAlertSummary] = useState(null)
  const [urgentAlerts, setUrgentAlerts] = useState([])
  const [historial, setHistorial]     = useState([])
  const [loading, setLoading]         = useState(true)

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
  }, [])

  useEffect(() => {
    Promise.allSettled([
      API.get('/api/estadisticas'),
      API.get('/api/historial?limite=5'),
      API.get('/api/v1/alerts/summary'),
      API.get('/api/v1/alerts?limit=5&severity=CRITICAL'),
      API.get('/api/historial?limite=90'),
    ]).then(([statsRes, casosRes, summaryRes, alertsRes, histRes]) => {
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
      if (casosRes.status === 'fulfilled') setCasos(casosRes.value.data.casos || [])
      if (summaryRes.status === 'fulfilled') setAlertSummary(summaryRes.value.data)
      if (alertsRes.status === 'fulfilled') {
        const d = alertsRes.value.data
        setUrgentAlerts(d.alerts || d.alertas || [])
      }
      if (histRes.status === 'fulfilled') setHistorial(histRes.value.data.casos || [])
    }).finally(() => setLoading(false))
  }, [])

  const weeklyData = useMemo(() => buildWeeklyData(historial), [historial])

  const pieData = useMemo(() => {
    if (!stats?.distribucion_recomendaciones) return []
    return Object.entries(stats.distribucion_recomendaciones)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => ({ name: REC_LABELS[k] || k, value: v, key: k }))
  }, [stats])

  const totalEvaluados = stats?.total_casos_evaluados ?? 0
  const casosCriticos  = stats?.casos_criticos ?? 0
  const alertPending   = alertSummary?.total ?? alertSummary?.pending ?? 0
  const diasPromedio   = stats?.dias_promedio ?? stats?.score_riesgo?.promedio ?? 0

  const fechaInicio = useMemo(() => {
    if (!historial.length) return null
    const oldest = historial.reduce((min, c) =>
      new Date(c.fecha) < new Date(min.fecha) ? c : min
    )
    return new Date(oldest.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })
  }, [historial])

  // ── Loading skeleton ──────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-1">
          <div className="h-7 bg-gray-200 rounded-lg w-64 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3"><SkeletonChart height="h-80" /></div>
          <div className="lg:col-span-2"><SkeletonChart height="h-80" /></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart height="h-72" />
          <SkeletonChart height="h-72" />
        </div>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Fila 1: Header ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-semibold text-gray-900">
            {getGreeting()}{user.nombre ? `, ${user.nombre}` : ''}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 capitalize">{formatDate()}</p>
        </div>
        <button
          onClick={() => navigate('/evaluar')}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Evaluar caso
        </button>
      </div>

      {/* ── Fila 2: Stat cards ─────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          value={totalEvaluados}
          label="Casos evaluados"
          icon={ClipboardList}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          valueColor="text-gray-900"
          changeLabel="Total histórico"
        />
        <StatCard
          value={casosCriticos}
          label="Casos críticos activos"
          icon={AlertTriangle}
          iconBg={casosCriticos > 0 ? 'bg-red-100' : 'bg-gray-100'}
          iconColor={casosCriticos > 0 ? 'text-red-600' : 'text-gray-400'}
          critical={casosCriticos > 0}
          changeLabel="Requieren atención"
        />
        <StatCard
          value={alertPending}
          label="Alertas pendientes"
          icon={Bell}
          iconBg={alertPending > 0 ? 'bg-amber-100' : 'bg-gray-100'}
          iconColor={alertPending > 0 ? 'text-amber-600' : 'text-gray-400'}
          changeLabel="Por gestionar"
        />
        <StatCard
          value={`${diasPromedio}`}
          label="Score promedio"
          icon={Calendar}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
          changeLabel="Riesgo promedio /100"
        />
      </div>

      {/* ── Fila 3: Line chart + Alertas recientes ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Line chart — 60% */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-xl shadow-card">
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-[18px] font-semibold text-gray-900">Evaluaciones por semana</h3>
            <p className="text-xs text-gray-500 mt-0.5">Últimas 12 semanas · línea azul = score promedio</p>
          </div>
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={248}>
              <LineChart data={weeklyData} margin={{ top: 8, right: 24, left: -12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="semana" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis yAxisId="left" allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: '#bfdbfe' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12, boxShadow: '0 4px 16px -4px rgba(0,0,0,.10)' }}
                  labelStyle={{ fontWeight: 600, color: '#374151' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={v => v === 'evaluaciones' ? 'Evaluaciones' : 'Score promedio'}
                />
                <Line yAxisId="left" type="monotone" dataKey="evaluaciones" stroke="#3b76f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line yAxisId="right" type="monotone" dataKey="scorePromedio" stroke="#a5b4fc" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="Sin datos de semanas" description="Evalúa casos para ver la evolución semanal" />
          )}
        </div>

        {/* Alertas recientes — 40% */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl shadow-card flex flex-col">
          <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-gray-50">
            <div>
              <h3 className="text-[18px] font-semibold text-gray-900">Alertas recientes</h3>
              <p className="text-xs text-gray-500 mt-0.5">Las más urgentes</p>
            </div>
            <button
              onClick={() => navigate('/historial')}
              className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-0.5 transition-colors"
            >
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {urgentAlerts.length === 0 ? (
              <EmptyState icon={Bell} title="Sin alertas críticas" description="No hay alertas urgentes en este momento" />
            ) : (
              urgentAlerts.map((a, i) => <AlertRow key={a.id || i} alert={a} />)
            )}
          </div>
        </div>
      </div>

      {/* ── Fila 4: Donut + Tabla casos ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Donut chart */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-card p-6">
          <h3 className="text-[18px] font-semibold text-gray-900 mb-1">Distribución de recomendaciones</h3>
          <p className="text-xs text-gray-500 mb-4">Todos los casos evaluados</p>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={<CustomDonutLabel />}
                  >
                    {pieData.map(entry => (
                      <Cell key={entry.key} fill={REC_COLORS[entry.key] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
                    formatter={(v, n) => [v, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {pieData.map(entry => (
                  <div key={entry.key} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: REC_COLORS[entry.key] || '#94a3b8' }} />
                      <span className="text-xs text-gray-600 font-medium">{entry.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800 tabular-nums">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState title="Sin datos" description="Evalúa casos para ver la distribución de recomendaciones" />
          )}
        </div>

        {/* Tabla últimos casos */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden">
          <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-gray-50">
            <div>
              <h3 className="text-[18px] font-semibold text-gray-900">Últimos casos</h3>
              <p className="text-xs text-gray-500 mt-0.5">5 más recientes</p>
            </div>
            <button
              onClick={() => navigate('/historial')}
              className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-0.5 transition-colors"
            >
              Ver historial <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {casos.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Sin casos evaluados"
              description="Los casos aparecerán aquí una vez que evalúes pacientes"
            />
          ) : (
            <>
              <div className="px-4 py-2 grid grid-cols-12 gap-2 border-b border-gray-50">
                <span className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">ID Caso</span>
                <span className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Score</span>
                <span className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Estado</span>
                <span className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Fecha</span>
              </div>
              <div className="divide-y divide-gray-50">
                {casos.map(c => (
                  <div
                    key={c.id}
                    onClick={() => navigate('/historial')}
                    className="px-4 py-3.5 grid grid-cols-12 gap-2 items-center hover:bg-gray-50/80 cursor-pointer transition-colors duration-150 group"
                  >
                    <div className="col-span-4 flex items-center gap-1.5 px-1">
                      {c.es_critico && <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />}
                      <span className="text-sm font-medium text-gray-800 group-hover:text-brand-700 transition-colors truncate">
                        {c.id_caso}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <ScoreBadge score={c.score_riesgo} />
                    </div>
                    <div className="col-span-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RISK_STYLES[c.nivel_riesgo] || 'bg-gray-100 text-gray-700'}`}>
                        {c.nivel_riesgo}
                      </span>
                    </div>
                    <div className="col-span-2 text-xs text-gray-400 tabular-nums">
                      {new Date(c.fecha).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Fila 5: Pie de tendencia ────────────────────── */}
      {totalEvaluados > 0 && (
        <p className="text-xs text-gray-400 text-center pb-2 animate-fade-in">
          Basado en <strong className="text-gray-600">{totalEvaluados}</strong> casos evaluados
          {fechaInicio && <> desde <strong className="text-gray-600">{fechaInicio}</strong></>}.
        </p>
      )}

    </div>
  )
}
