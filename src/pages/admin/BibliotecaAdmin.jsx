import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2, BookOpen, ArrowLeft } from 'lucide-react'
import API from '../../api/client'

const MAX_MB = 20

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function BibliotecaAdmin() {
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const [dragging, setDragging]     = useState(false)
  const [archivo, setArchivo]       = useState(null)   // File object
  const [nombre, setNombre]         = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [uploading, setUploading]   = useState(false)
  const [resultado, setResultado]   = useState(null)   // { ok, message, nombre } | null
  const [error, setError]           = useState('')

  const resetForm = () => {
    setArchivo(null)
    setNombre('')
    setDescripcion('')
    setResultado(null)
    setError('')
  }

  const validarArchivo = (file) => {
    if (!file) return 'Selecciona un archivo.'
    if (file.type !== 'application/pdf') return 'Solo se aceptan archivos PDF.'
    if (file.size > MAX_MB * 1024 * 1024) return `El archivo supera el límite de ${MAX_MB} MB.`
    return null
  }

  const seleccionar = (file) => {
    const err = validarArchivo(file)
    if (err) { setError(err); return }
    setError('')
    setArchivo(file)
    if (!nombre) setNombre(file.name.replace(/\.pdf$/i, ''))
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    seleccionar(file)
  }, [nombre])

  const onFileChange = (e) => {
    seleccionar(e.target.files?.[0])
  }

  const subir = async (e) => {
    e.preventDefault()
    if (!archivo) { setError('Selecciona un PDF primero.'); return }
    if (!nombre.trim()) { setError('El nombre es obligatorio.'); return }

    setUploading(true)
    setError('')
    setResultado(null)

    const form = new FormData()
    form.append('nombre', nombre.trim())
    form.append('descripcion', descripcion.trim())
    form.append('archivo', archivo)

    try {
      const r = await API.post('/api/admin/biblioteca/subir', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResultado({ ok: true, message: r.data.message, nombre: r.data.nombre })
      setArchivo(null)
      setNombre('')
      setDescripcion('')
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Error al subir el documento.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/biblioteca')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subir documento</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Solo admin · PDFs hasta {MAX_MB} MB · la indexación ocurre en segundo plano
          </p>
        </div>
      </div>

      {/* Resultado éxito */}
      {resultado?.ok && (
        <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300 text-sm">{resultado.nombre}</p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-0.5">{resultado.message}</p>
            <button
              onClick={resetForm}
              className="mt-2 text-xs text-green-700 dark:text-green-400 underline hover:no-underline"
            >
              Subir otro documento
            </button>
          </div>
        </div>
      )}

      {/* Formulario */}
      {!resultado?.ok && (
        <form onSubmit={subir} className="space-y-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          {/* Zona drag & drop */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !archivo && inputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${dragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : archivo
                ? 'border-green-400 bg-green-50 dark:bg-green-900/10 cursor-default'
                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10'
              }
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onFileChange}
            />
            {archivo ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-green-500 shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{archivo.name}</p>
                  <p className="text-xs text-gray-500">{formatBytes(archivo.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setArchivo(null); setError('') }}
                  className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Arrastra un PDF aquí o <span className="text-indigo-600 underline">selecciónalo</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Máximo {MAX_MB} MB</p>
              </>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Sentencia T-200/2024 — Estabilidad laboral reforzada"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={2}
              placeholder="Breve descripción del contenido o relevancia del documento"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !archivo}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm
                       hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo…</>
              : <><Upload className="w-4 h-4" /> Subir e indexar</>
            }
          </button>
        </form>
      )}
    </div>
  )
}
