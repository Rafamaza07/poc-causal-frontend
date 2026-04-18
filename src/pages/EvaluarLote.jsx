import { useRef, useState } from 'react'
import { Upload, FileText, Download, CheckCircle, AlertTriangle, X, Layers } from 'lucide-react'
import API from '../api/client'
import { useToast } from '../Components/Toast'

const NIVEL_STYLES = {
  BAJO:     'bg-green-100 text-green-800',
  MODERADO: 'bg-yellow-100 text-yellow-800',
  ALTO:     'bg-orange-100 text-orange-800',
  CRÍTICO:  'bg-red-100 text-red-800',
}

export default function EvaluarLote() {
  const [file, setFile]           = useState(null)
  const [dragging, setDragging]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [preview, setPreview]     = useState(null)   // { ok: [], errors: [], total }
  const [excelBlob, setExcelBlob] = useState(null)
  const inputRef = useRef()
  const { showToast } = useToast()

  const handleFile = (f) => {
    if (!f) return
    if (!f.name.endsWith('.csv')) { showToast('Solo se aceptan archivos .csv', 'error'); return }
    setFile(f)
    setPreview(null)
    setExcelBlob(null)
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const descargarPlantilla = () => {
    API.get('/api/v1/evaluar/lote/plantilla', { responseType: 'blob' })
      .then(r => {
        const url = URL.createObjectURL(r.data)
        const a = document.createElement('a')
        a.href = url; a.download = 'plantilla_lote.csv'; a.click()
        URL.revokeObjectURL(url)
      })
      .catch(() => showToast('No se pudo descargar la plantilla', 'error'))
  }

  const evaluar = async () => {
    if (!file) return
    setLoading(true)
    setPreview(null)
    setExcelBlob(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const resp = await API.post('/api/v1/evaluar/lote', form, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setExcelBlob(resp.data)

      // Parsear hoja Resultados del Excel para preview
      // Leemos las primeras filas del blob como texto para la preview
      // En vez de parsear Excel en browser, guardamos contadores del header HTTP si vienen
      // Como el backend no retorna JSON preview, usamos una estrategia sencilla:
      showToast('Lote evaluado correctamente', 'success')
      setPreview({ done: true })
    } catch (err) {
      const msg = err.response?.data
        ? await err.response.data.text?.().then(t => { try { return JSON.parse(t).detail } catch { return 'Error al evaluar el lote' } })
        : 'Error al evaluar el lote'
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const descargarExcel = () => {
    if (!excelBlob) return
    const url = URL.createObjectURL(excelBlob)
    const a = document.createElement('a')
    a.href = url; a.download = 'evaluacion_lote.xlsx'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-brand-600" />
          <h1 className="text-xl font-bold text-gray-900">Evaluación en lote</h1>
        </div>
        <p className="text-sm text-gray-500">
          Sube un CSV con múltiples casos y descarga los resultados en Excel. Máximo 500 casos por archivo.
        </p>
      </div>

      {/* Plantilla */}
      <div className="flex items-center justify-between bg-brand-50 border border-brand-200 rounded-xl p-4">
        <div>
          <p className="text-sm font-semibold text-brand-800">¿Primera vez?</p>
          <p className="text-xs text-brand-600 mt-0.5">Descarga la plantilla CSV con los campos requeridos y un ejemplo.</p>
        </div>
        <button onClick={descargarPlantilla}
          className="flex items-center gap-1.5 text-sm bg-white text-brand-700 border border-brand-300 hover:bg-brand-50 px-3 py-2 rounded-lg transition-colors font-medium">
          <Download className="w-4 h-4" /> Plantilla
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
          dragging ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
        }`}>
        <input ref={inputRef} type="file" accept=".csv" className="hidden"
          onChange={e => handleFile(e.target.files[0])} />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-10 h-10 text-brand-500" />
            <p className="font-semibold text-gray-800">{file.name}</p>
            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
            <button
              onClick={e => { e.stopPropagation(); setFile(null); setPreview(null); setExcelBlob(null) }}
              className="mt-1 flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
              <X className="w-3 h-3" /> Quitar archivo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload className="w-10 h-10" />
            <p className="font-medium text-gray-600">Arrastra tu CSV aquí o haz clic</p>
            <p className="text-xs">Solo archivos .csv — máx. 500 filas</p>
          </div>
        )}
      </div>

      {/* Botón evaluar */}
      {file && !preview && (
        <button
          onClick={evaluar}
          disabled={loading}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Procesando casos...</>
            : <><Layers className="w-4 h-4" /> Evaluar lote</>}
        </button>
      )}

      {/* Resultado */}
      {preview?.done && excelBlob && (
        <div className="card p-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900">Lote evaluado correctamente</h3>
          </div>
          <p className="text-sm text-gray-500">
            El Excel contiene dos hojas: <strong>Resultados</strong> (con colores por nivel de riesgo) y <strong>Errores</strong> (filas inválidas con motivo).
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={descargarExcel}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
              <Download className="w-4 h-4" /> Descargar Excel
            </button>
            <button
              onClick={() => { setFile(null); setPreview(null); setExcelBlob(null) }}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition-colors">
              Evaluar otro lote
            </button>
          </div>
        </div>
      )}

      {/* Info columnas */}
      <details className="card p-4 cursor-pointer">
        <summary className="text-sm font-semibold text-gray-700 select-none flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Columnas requeridas en el CSV
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-2 pr-4 font-semibold text-gray-600">Columna</th>
                <th className="py-2 pr-4 font-semibold text-gray-600">Tipo</th>
                <th className="py-2 font-semibold text-gray-600">Valores válidos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                ['id_caso',                     'texto',  'cualquier identificador'],
                ['edad',                         'número', '18 – 100'],
                ['dias_incapacidad_acumulados',  'entero', '0 en adelante'],
                ['porcentaje_pcl',              'número', '0 – 100'],
                ['tipo_enfermedad',             'texto',  'laboral | comun | profesional | accidente'],
                ['en_tratamiento_activo',       'entero', '0 o 1'],
                ['pronostico_medico',           'texto',  'favorable | reservado | malo'],
                ['comorbilidades',              'entero', '0 – 10'],
                ['requiere_reubicacion_laboral','entero', '0 o 1'],
                ['notas_adicionales',           'texto',  'opcional'],
                ['codigo_cie10',               'texto',  'opcional (ej. M54.5)'],
                ['oficio',                     'texto',  'opcional (ej. Conductor)'],
              ].map(([col, tipo, vals]) => (
                <tr key={col}>
                  <td className="py-1.5 pr-4 font-mono text-brand-700">{col}</td>
                  <td className="py-1.5 pr-4 text-gray-500">{tipo}</td>
                  <td className="py-1.5 text-gray-500">{vals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
