import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import API from '../api/client'

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

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [casos, setCasos]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([API.get('/api/estadisticas'), API.get('/api/historial?limite=6')])
      .then(([s, c]) => { setStats(s.data); setCasos(c.data.casos || []) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Cargando...</div>

  const pieData = stats?.distribucion_recomendaciones
    ? Object.entries(stats.distribucion_recomendaciones).map(([k, v]) => ({ name: REC_LABELS[k] || k, value: v, key: k }))
    : []

  const statCards = [
    { label: 'Total Casos',    value: stats?.total_casos_evaluados ?? 0,             icon: '📋' },
    { label: 'Score Promedio', value: `${stats?.score_riesgo?.promedio ?? 0}/100`,   icon: '📊' },
    { label: 'Casos Críticos', value: stats?.casos_criticos ?? 0,                    icon: '🚨' },
    { label: 'Score Máximo',   value: `${stats?.score_riesgo?.maximo ?? 0}/100`,     icon: '⚠️' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
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

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Casos Recientes</h3>
          {casos.length > 0 ? (
            <div className="space-y-3">
              {casos.map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.id_caso}</p>
                    <p className="text-xs text-gray-400">{new Date(c.fecha).toLocaleDateString('es-CO')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">{c.score_riesgo}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RISK_STYLES[c.nivel_riesgo] || ''}`}>
                      {c.nivel_riesgo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No hay casos evaluados aún
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
