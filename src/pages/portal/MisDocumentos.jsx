import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, FileSearch, CheckCircle, Clock, ChevronRight, Plus } from 'lucide-react'
import API from '../../api/client'
import { SkeletonDocList } from '../../Components/Skeleton'
import EmptyState, { ErrorState } from '../../Components/EmptyState'

const TIPO_LABEL = {
  derecho_peticion: 'Derecho de Petición',
  tutela:           'Acción de Tutela',
}

const TIPO_COLOR = {
  derecho_peticion: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  tutela:           { bg: 'bg-rose-100',   text: 'text-rose-700',   dot: 'bg-rose-500'   },
}

const ESTADO_CFG = {
  generado: { icon: Clock,       cls: 'text-amber-500',   badge: 'bg-amber-100 text-amber-700' },
  enviado:  { icon: CheckCircle, cls: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
}

export default function MisDocumentos() {
  const [docs,    setDocs]    = useState([])
  const [casos,   setCasos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    Promise.allSettled([
      API.get('/api/v1/cliente/documentos'),
      API.get('/api/v1/cliente/mis-casos'),
    ]).then(([docsR, casosR]) => {
      if (docsR.status  === 'fulfilled') setDocs(docsR.value.data ?? [])
      else setError('No se pudieron cargar tus documentos.')
      if (casosR.status === 'fulfilled') setCasos(casosR.value.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <SkeletonDocList />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-500" /> Mis documentos
        </h1>
        <p className="text-gray-500 text-sm">Derechos de petición y tutelas generados desde tus casos.</p>
      </div>

      {error && <ErrorState message={error} />}

      {/* Generar nuevo — solo si hay casos disponibles */}
      {casos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" /> Generar nuevo documento
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Selecciona el caso para el que quieres generar un documento legal.
          </p>
          <div className="space-y-2">
            {casos.slice(0, 5).map(c => (
              <div key={c.id_caso} className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <div>
                  <span className="text-sm font-semibold text-gray-800">Caso #{c.id_caso}</span>
                  <span className="text-xs text-gray-400 ml-2">{c.dias_incapacidad} días</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/portal/documentos/${c.id_caso}?tipo=derecho_peticion`}
                    className="text-xs font-bold bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Petición
                  </Link>
                  <Link
                    to={`/portal/documentos/${c.id_caso}?tipo=tutela`}
                    className="text-xs font-bold bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Tutela
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de documentos existentes */}
      {docs.length === 0 && !error ? (
        <EmptyState
          icon={FileSearch}
          title="Sin documentos generados"
          description={casos.length > 0
            ? 'Usa el panel de arriba para crear tu primer documento legal.'
            : 'Aquí aparecerán tus derechos de petición y tutelas generadas.'
          }
        />
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Documentos generados ({docs.length})
          </h2>
          {docs.map(d => {
            const tipoColor  = TIPO_COLOR[d.tipo]  ?? TIPO_COLOR.derecho_peticion
            const estadoCfg  = ESTADO_CFG[d.estado] ?? ESTADO_CFG.generado
            const EstadoIcon = estadoCfg.icon
            return (
              <div key={d.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${tipoColor.dot}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tipoColor.bg} ${tipoColor.text}`}>
                          {TIPO_LABEL[d.tipo] ?? d.tipo}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${estadoCfg.badge}`}>
                          {d.estado}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <EstadoIcon className={`w-3 h-3 ${estadoCfg.cls}`} />
                        {new Date(d.generado_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {d.enviado_at && (
                          <span className="text-emerald-600">
                            · Enviado {new Date(d.enviado_at).toLocaleDateString('es-CO')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/portal/historial/${d.id_caso}`}
                    className="text-xs text-gray-400 hover:text-emerald-600 flex items-center gap-1 transition-colors flex-shrink-0"
                  >
                    Caso #{d.id_caso} <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
