import { useEffect, useState } from 'react'
import API from '../api/client'

const ACCION_STYLES = {
  LOGIN:        'bg-green-100 text-green-700',
  EVALUAR_CASO: 'bg-blue-100 text-blue-700',
  VER_HISTORIAL:'bg-gray-100 text-gray-700',
  VER_DETALLE:  'bg-purple-100 text-purple-700',
  COMPARAR:     'bg-yellow-100 text-yellow-700',
  EDITAR_CASO:  'bg-orange-100 text-orange-700',
}

export default function Logs() {
  const [logs, setLogs]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/api/logs?limite=100')
      .then(r => setLogs(r.data.logs || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Logs de Auditoría</h1>
        <p className="text-gray-500 text-sm mt-1">{logs.length} registros</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Cargando...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Fecha','Usuario','Rol','Acción','ID Caso','Detalle'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(l.timestamp).toLocaleString('es-CO')}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{l.usuario}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">{l.rol}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${ACCION_STYLES[l.accion]||'bg-gray-100 text-gray-600'}`}>
                      {l.accion}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-blue-600">{l.id_caso||'—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{l.detalle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
