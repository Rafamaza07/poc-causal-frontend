import { useState, useEffect, useCallback } from 'react'
import { BookOpen, Search, FileText, ExternalLink, X, Loader2, AlertCircle } from 'lucide-react'
import API from '../api/client'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default function Biblioteca() {
  const [docs, setDocs]           = useState([])
  const [loadingDocs, setLoadingDocs] = useState(true)
  const [errorDocs, setErrorDocs] = useState('')

  const [query, setQuery]         = useState('')
  const [searching, setSearching] = useState(false)
  const [resultados, setResultados] = useState(null)
  const [errorBuscar, setErrorBuscar] = useState('')

  const [visorDoc, setVisorDoc]   = useState(null)  // { id, nombre }

  const loadDocs = useCallback(() => {
    setLoadingDocs(true)
    setErrorDocs('')
    API.get('/api/v1/biblioteca/documentos')
      .then(r => setDocs(Array.isArray(r.data) ? r.data : []))
      .catch(() => setErrorDocs('No se pudieron cargar los documentos.'))
      .finally(() => setLoadingDocs(false))
  }, [])

  useEffect(() => { loadDocs() }, [loadDocs])

  const buscar = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setResultados(null)
    setErrorBuscar('')
    API.get('/api/v1/biblioteca/buscar', { params: { q: query.trim(), top_k: 5 } })
      .then(r => setResultados(r.data))
      .catch(() => setErrorBuscar('Error al realizar la búsqueda.'))
      .finally(() => setSearching(false))
  }

  const limpiarBusqueda = () => {
    setQuery('')
    setResultados(null)
    setErrorBuscar('')
  }

  const [blobUrl, setBlobUrl]   = useState(null)
  const [loadingPdf, setLoadingPdf] = useState(false)

  const abrirVisor = useCallback(async (doc) => {
    setVisorDoc(doc)
    setBlobUrl(null)
    setLoadingPdf(true)
    try {
      const r = await API.get(`/api/v1/biblioteca/documentos/${doc.id}/file`, { responseType: 'blob' })
      setBlobUrl(URL.createObjectURL(r.data))
    } catch {
      setBlobUrl(null)
    } finally {
      setLoadingPdf(false)
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Biblioteca Legal</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Busca semánticamente en el corpus legal indexado o consulta los documentos disponibles.
          </p>
        </div>
      </div>

      {/* Búsqueda semántica */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4" /> Búsqueda semántica
        </h2>
        <form onSubmit={buscar} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ej: estabilidad laboral reforzada, pensión de invalidez…"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium
                       hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Buscar
          </button>
          {(resultados || errorBuscar) && (
            <button
              type="button"
              onClick={limpiarBusqueda}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                         text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {errorBuscar && (
          <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {errorBuscar}
          </p>
        )}

        {resultados && (
          <div className="mt-4 space-y-3">
            {resultados.resultados.length === 0 ? (
              <p className="text-sm text-gray-500">No se encontraron resultados. Verifica que haya documentos indexados.</p>
            ) : (
              resultados.resultados.map((r, i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-750"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {r.source} — chunk #{r.chunk_id}
                    </span>
                    <span className="text-xs text-gray-400">relevancia: {(r.score * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">{r.text}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Lista de documentos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Documentos ({docs.length})
          </h2>
        </div>

        {loadingDocs && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        )}

        {errorDocs && (
          <div className="p-5 text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {errorDocs}
          </div>
        )}

        {!loadingDocs && !errorDocs && docs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No hay documentos en la biblioteca.</p>
            <p className="text-gray-400 text-xs mt-1">Un administrador puede subir PDFs desde la sección Admin.</p>
          </div>
        )}

        {!loadingDocs && docs.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-5 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Nombre</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Tamaño</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Subido</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Estado</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {docs.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">{doc.nombre}</div>
                    {doc.descripcion && (
                      <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{doc.descripcion}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{formatBytes(doc.size_bytes)}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{formatDate(doc.uploaded_at)}</td>
                  <td className="px-4 py-3">
                    {doc.indexado ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                        Indexado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => abrirVisor(doc)}
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Ver PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal visor PDF */}
      {visorDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{visorDoc.nombre}</span>
              </div>
              <button
                onClick={() => { setVisorDoc(null); if (blobUrl) { URL.revokeObjectURL(blobUrl); setBlobUrl(null) } }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {loadingPdf ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
            ) : blobUrl ? (
              <iframe src={blobUrl} title={visorDoc.nombre} className="flex-1 rounded-b-xl" />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                No se pudo cargar el PDF.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
