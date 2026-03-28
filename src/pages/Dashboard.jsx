import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import API from '../api/client'
import { SkeletonCard } from '../Components/Skeleton'

function PatronesIA() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const analizar = async () => {
    setLoading(true); setError('')
    try {
      const { data: d } = await API.get('/api/analisis/patrones')
      setData(d)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al analizar patrones')
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Análisis de Patrones IA</h3>
          <p className="text-xs text-gray-400 mt-0.5">Narrativa generada por IA sobre todos los casos</p>
        </div>
        <button onClick={analizar} disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          {loading ? 'Analizando...' : '🤖 Analizar'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {loading && (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-5/6" />
          <div className="h-3 bg-gray-100 rounded w-4/6" />
        </div>
      )}
      {data && !loading && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xl font-bold text-gray-800">{data.estadisticas.total_casos}</div>
              <div className="text-xs text-gray-500">Total casos</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-xl font-bold text-red-700">{data.estadisticas.casos_criticos}</div>
              <div className="text-xs text-red-500">Críticos</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xl font-bold text-blue-700">{data.estadisticas.score_promedio}</div>
              <div className="text-xs text-blue-500">Score promedio</div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-xs font-semibold text-slate-600 mb-2">Análisis narrativo</p>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{data.analisis_ia}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const REC_COLORS = {
  'CALIFICA_PENSION_INVALIDEZ':   '#ef4444',
  'CONTINUAR_INCAPACIDAD':        '#f59e0b',
  'REINCORPORACION_CON_TERAPIAS': '#22c55e',
  'FORZAR_CALIFICACION_PCL':      '#f97316',
}
const REC_LABELS = {
  'CALIFICA_PENSION_INVALIDEZ':   'Pensión',
  'CONTINUAR_INCAPACIDAD':        'Continuar',
  'REINCORPORACION_CON_TERAPIAS': 'Reincorporar',
  'FORZAR_CALIFICACION_PCL':      'Forzar PCL',
}
const RISK_STYLES = {
  BAJO:     'bg-green-100 text-green-800',
  MODERADO: 'bg-yellow-100 text-yellow-800',
  ALTO:     'bg-orange-100 text-orange-800',
  CRÍTICO:  'bg-red-100 text-red-800',
}

const RISK_BAR_DATA = [
  { nivel: 'Bajo',     key: 'BAJO',     color: '#22c55e', rango: '0-25'   },
  { nivel: 'Moderado', key: 'MODERADO', color: '#f59e0b', rango: '25-50'  },
  { nivel: 'Alto',     key: 'ALTO',     color: '#f97316', rango: '50-75'  },
  { nivel: 'Crítico',  key: 'CRÍTICO',  color: '#ef4444', rango: '75-100' },
]

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [casos, setCasos]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([API.get('/api/estadisticas'), API.get('/api/historial?limite=6')])
      .then(([s, c]) => { setStats(s.data); setCasos(c.data.casos || []) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-6">
      <div>
        <div className="h-7 bg-gray-200 rounded w-36 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-56 mt-2 animate-pulse" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} rows={1} />)}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <SkeletonCard rows={4} />
        <SkeletonCard rows={4} />
      </div>
    </div>
  )

  const pieData = stats?.distribucion_recomendaciones
    ? Object.entries(stats.distribucion_recomendaciones).map(([k, v]) => ({ name: REC_LABELS[k] || k, value: v, key: k }))
    : []

  // Distribución por nivel de riesgo para el bar chart
  const riskBarData = RISK_BAR_DATA.map(r => ({
    ...r,
    count: casos.filter(c => c.nivel_riesgo === r.key).length,
  }))
  // Si no hay casos en el historial reciente, usa totales de stats
  const totalCriticos = stats?.casos_criticos ?? 0

  const statCards = [
    { label: 'Total Casos',    value: stats?.total_casos_evaluados ?? 0,             icon: '📋', bg: 'bg-blue-50',   txt: 'text-blue-700' },
    { label: 'Score Promedio', value: `${stats?.score_riesgo?.promedio ?? 0}/100`,   icon: '📊', bg: 'bg-indigo-50', txt: 'text-indigo-700' },
    { label: 'Casos Críticos', value: totalCriticos,                                 icon: '🚨', bg: 'bg-red-50',    txt: 'text-red-700' },
    { label: 'Score Máximo',   value: `${stats?.score_riesgo?.maximo ?? 0}/100`,     icon: '⚠️', bg: 'bg-amber-50',  txt: 'text-amber-700' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-5 border border-transparent shadow-sm`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-2xl font-bold ${s.txt}`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <PatronesIA />

      <div className="grid grid-cols-2 gap-6">
        {/* Pie chart de recomendaciones */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Distribución de Recomendaciones</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {pieData.map(entry => (
                    <Cell key={entry.key} fill={REC_COLORS[entry.key] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Evalúa casos para ver la distribución
            </div>
          )}
        </div>

        {/* Bar chart de nivel de riesgo */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Últimos 6 casos — Nivel de riesgo</h3>
          {casos.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={riskBarData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="nivel" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip
                  formatter={(v) => [v, 'Casos']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {riskBarData.map((r) => (
                    <Cell key={r.key} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No hay casos evaluados aún
            </div>
          )}
        </div>
      </div>

      {/* Casos recientes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Casos Recientes</h3>
        {casos.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {casos.map(c => (
              <div key={c.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {c.es_critico && <span className="mr-1 text-red-500">🚨</span>}{c.id_caso}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(c.fecha).toLocaleDateString('es-CO')} · {c.evaluado_por || '—'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-700">{c.score_riesgo}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RISK_STYLES[c.nivel_riesgo] || ''}`}>
                    {c.nivel_riesgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
            No hay casos evaluados aún
          </div>
        )}
      </div>
    </div>
  )
}
