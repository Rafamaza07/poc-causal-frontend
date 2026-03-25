import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/client'

const RISK_STYLES = {
  BAJO:     'bg-green-100 text-green-800',
  MODERADO: 'bg-yellow-100 text-yellow-800',
  ALTO:     'bg-orange-100 text-orange-800',
  CRÍTICO:  'bg-red-100 text-red-800',
}
const REC_LABELS = {
  'CALIFICA_PENSION_INVALIDEZ':   'Pensión',
  'CONTINUAR_INCAPACIDAD':        'Continuar',
  'REINCORPORACION_CON_TERAPIAS': 'Reincorporar',
  'FORZAR_CALIFICACION_PCL':      'Forzar PCL',
}
const INP = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

export default function Historial() {
  const [casos, setCasos]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [busqueda, setBusqueda]     = useState('')
  const [filtroRiesgo, setFiltroRiesgo] = useState('')
  const [filtroRec, setFiltroRec]   = useState('')
  const [detalle, setDetalle]       = useState(null)
  const [loadingDet, setLoadingDet] = useState(false)
  const navigate = useNavigate()

  const cargar = () => {
    setLoading(true)
    const params = new URLSearchParams({ limite: 50 })
    if (busqueda) params.append('busqueda', busqueda)
    if (filtroRiesgo) params.append('nivel_riesgo', filtroRiesgo)
    if (filtroRec) params.append('recomendacion', filtroRec)
    API.get(`/api/historial?${params}`).then(r => setCasos(r.data.casos||[])).finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const verDetalle = async (id_caso) => {
    setLoadingDet(true)
    try {
      const { data } = await API.get(`/api/historial/${id_caso}`)
      setDetalle(data)
    } catch {}
    setLoadingDet(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Historial de Casos</h1>
          <p className="text-gray-500 text-sm mt-1">{casos.length} casos</p>
        </div>
        <button onClick={cargar} className="bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
          🔄 Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3 flex-wrap">
        <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por ID..." className={INP} />
        <select value={filtroRiesgo} onChange={e => setFiltroRiesgo(e.target.value)} className={INP}>
          <option value="">Todos los niveles</option>
          <option value="BAJO">Bajo</option>
          <option value="MODERADO">Moderado</option>
          <option value="ALTO">Alto</option>
          <option value="CRÍTICO">Crítico</option>
        </select>
        <select value={filtroRec} onChange={e => setFiltroRec(e.target.value)} className={INP}>
          <option value="">Todas las recomendaciones</option>
          <option value="CALIFICA_PENSION_INVALIDEZ">Pensión</option>
          <option value="CONTINUAR_INCAPACIDAD">Continuar</option>
          <option value="REINCORPORACION_CON_TERAPIAS">Reincorporar</option>
          <option value="FORZAR_CALIFICACION_PCL">Forzar PCL</option>
        </select>
        <button onClick={cargar} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
          Filtrar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: detalle ? '1fr 1fr' : '1fr' }}>
        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400">Cargando...</div>
          ) : casos.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400">No hay casos</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['ID','Fecha','Recomendación','Score','Riesgo','Evaluado por'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {casos.map(c => (
                  <tr key={c.id} onClick={() => verDetalle(c.id_caso)}
                    className={`cursor-pointer transition-colors hover:bg-blue-50 ${c.es_critico ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      {c.es_critico && <span className="mr-1">🚨</span>}{c.id_caso}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(c.fecha).toLocaleDateString('es-CO')}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{REC_LABELS[c.recomendacion]||c.recomendacion}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-800">{c.score_riesgo}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RISK_STYLES[c.nivel_riesgo]||''}`}>
                        {c.nivel_riesgo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{c.evaluado_por||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Panel de detalle */}
        {detalle && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Detalle — {detalle.id_caso}</h3>
              <button onClick={() => setDetalle(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-800">{detalle.score_riesgo}</div>
                <div className="text-xs text-gray-500">Score / 100</div>
                <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                  {BAJO:'bg-green-100 text-green-800',MODERADO:'bg-yellow-100 text-yellow-800',
                   ALTO:'bg-orange-100 text-orange-800','CRÍTICO':'bg-red-100 text-red-800'}[detalle.nivel_riesgo]||''}`}>
                  {detalle.nivel_riesgo}
                </span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium mb-1">Recomendación</p>
                <p className="text-sm font-bold text-blue-800">{detalle.recomendacion?.replace(/_/g,' ')}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Confianza: {detalle.confianza ? `${(detalle.confianza*100).toFixed(0)}%` : '100%'}
                </p>
              </div>
            </div>
            {detalle.explicacion && (
              <>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-1">Explicación</p>
                  <p className="text-xs text-gray-600">{detalle.explicacion.resumen}</p>
                </div>
                {detalle.explicacion.proximos_pasos?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Próximos pasos</p>
                    <ul className="space-y-1">
                      {detalle.explicacion.proximos_pasos.map((p,i) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-1">
                          <span className="text-blue-500 font-bold">{i+1}.</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            {detalle.notas_adicionales && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs font-medium text-yellow-700 mb-1">Notas</p>
                <p className="text-xs text-yellow-700">{detalle.notas_adicionales}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
