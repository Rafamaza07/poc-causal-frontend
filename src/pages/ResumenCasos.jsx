import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, FileWarning } from 'lucide-react'
import API from '../api/client'
import { formatDate } from '../utils/formatters'

const PAGE_SIZE = 20

const SEMAFORO = {
  ROJO:     { dot: 'bg-red-500',    label: 'Crítico'   },
  AMARILLO: { dot: 'bg-yellow-400', label: 'Atención'  },
  VERDE:    { dot: 'bg-green-500',  label: 'Al día'    },
}

function SemaforoDot({ semaforo }) {
  const cfg = SEMAFORO[semaforo] ?? { dot: 'bg-gray-300', label: semaforo }
  return (
    <span
      className={`inline-block w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${cfg.dot}`}
      title={cfg.label}
    />
  )
}

export default function ResumenCasos() {
  const navigate  = useNavigate()
  const [items,   setItems]   = useState([])
  const [total,   setTotal]   = useState(0)
  const [skip,    setSkip]    = useState(0)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    API.get(`/api/casos/resumen?skip=${skip}&limit=${PAGE_SIZE}`)
      .then(res => {
        setItems(res.data.items ?? [])
        setTotal(res.data.total ?? 0)
      })
      .catch(e => setError(e.response?.data?.detail ?? e.message))
      .finally(() => setLoading(false))
  }, [skip])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">
          Resumen de casos
          {total > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">{total} total</span>
          )}
        </h1>
      </div>

      {loading && (
        <div className="text-sm text-gray-400 py-8 text-center">Cargando...</div>
      )}

      {error && (
        <div className="text-sm text-red-500 py-4 text-center">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-sm text-gray-400 py-8 text-center flex flex-col items-center gap-2">
          <FileWarning className="w-8 h-8 text-gray-300" />
          No hay casos registrados.
        </div>
      )}

      {!loading && !error && items.map(caso => (
        <div
          key={caso.id}
          onClick={() => navigate(`/historial/${caso.id_caso}`)}
          className="flex items-start gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
        >
          <SemaforoDot semaforo={caso.semaforo} />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{caso.id_caso}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              <span className="font-medium">{caso.ruta}</span>
              {caso.faltante && (
                <span className="ml-2 text-gray-400">· Faltante: {caso.faltante}</span>
              )}
            </p>
            <p className="text-xs text-gray-400 mt-1 italic">{caso.pregunta}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {caso.dias_incapacidad_acumulados != null && (
              <span className="text-xs text-gray-400 hidden sm:block">
                {caso.dias_incapacidad_acumulados}d
              </span>
            )}
            {caso.fecha_evaluacion && (
              <span className="text-xs text-gray-400 hidden sm:block">
                {formatDate(caso.fecha_evaluacion)}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      ))}

      {total > PAGE_SIZE && (
        <div className="flex justify-between items-center pt-2">
          <button
            disabled={skip === 0}
            onClick={() => setSkip(Math.max(0, skip - PAGE_SIZE))}
            className="text-sm text-gray-500 disabled:text-gray-300 hover:text-gray-800 transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-xs text-gray-400">
            {skip + 1}–{Math.min(skip + PAGE_SIZE, total)} de {total}
          </span>
          <button
            disabled={skip + PAGE_SIZE >= total}
            onClick={() => setSkip(skip + PAGE_SIZE)}
            className="text-sm text-gray-500 disabled:text-gray-300 hover:text-gray-800 transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
