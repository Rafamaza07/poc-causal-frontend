import { useState, useEffect, useRef } from 'react'
import { Cpu, Upload, AlertTriangle, CheckCircle, Clock, BarChart2, RefreshCw, Network } from 'lucide-react'
import API from '../api/client'
import { CausalGraphView } from '../Components/charts'

const OUTCOME_NAMES = ['REINCORP. INMEDIATA', 'REINCORP. CON TERAPIAS', 'CONTINUAR INCAP.', 'CALIFICA PENSIÓN']

function MetricCard({ label, value, sub, color = 'text-brand-600' }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

function ConfusionMatrix({ matrix }) {
  if (!matrix || !matrix.length) return null
  const max = Math.max(...matrix.flat())
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Matriz de confusión</h3>
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-1.5 text-gray-400 font-normal">Real ↓ / Pred →</th>
              {OUTCOME_NAMES.map((n, i) => (
                <th key={i} className="p-1.5 text-gray-500 font-semibold text-center w-24">{n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="p-1.5 text-gray-500 font-semibold whitespace-nowrap pr-3">{OUTCOME_NAMES[i]}</td>
                {row.map((val, j) => {
                  const intensity = max > 0 ? val / max : 0
                  const isDiag = i === j
                  return (
                    <td key={j} className="p-1.5 text-center rounded font-bold" style={{
                      backgroundColor: isDiag
                        ? `rgba(34, 88, 219, ${0.15 + intensity * 0.75})`
                        : val > 0 ? `rgba(239, 68, 68, ${0.1 + intensity * 0.5})` : 'transparent',
                      color: isDiag ? '#1e3fa8' : val > 0 ? '#b91c1c' : '#9ca3af',
                    }}>
                      {val}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-gray-400 mt-2">Diagonal = predicciones correctas. Celdas rojas = errores.</p>
    </div>
  )
}

function UploadModal({ onClose, onSubido }) {
  const [version, setVersion] = useState(`knn_v${new Date().toISOString().slice(0, 10)}`)
  const [notas, setNotas] = useState('')
  const [modelFile, setModelFile] = useState(null)
  const [metricsFile, setMetricsFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const modelRef = useRef()
  const metricsRef = useRef()

  async function handleSubmit() {
    if (!modelFile) { setError('Selecciona el archivo modelo JSON.'); return }
    if (!version.trim()) { setError('Ingresa un nombre de versión.'); return }
    setLoading(true); setError(null)
    try {
      const fd = new FormData()
      fd.append('model_file', modelFile)
      fd.append('version', version.trim())
      if (notas.trim()) fd.append('notas', notas.trim())
      if (metricsFile) fd.append('metrics_file', metricsFile)
      await API.post('/api/v1/modelo/recargar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onSubido()
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al subir el modelo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-scale-in">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Cargar nuevo modelo</h2>
        <p className="text-sm text-gray-500 mb-5">
          Sube el JSON generado por <code className="font-mono bg-gray-100 px-1 rounded text-xs">scripts/train_model.py</code>.
          El modelo se activa en memoria sin reiniciar el servidor.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de versión *</label>
            <input
              value={version}
              onChange={e => setVersion(e.target.value)}
              placeholder="knn_v2026-04-18"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Archivo modelo JSON *</label>
            <div
              onClick={() => modelRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                modelFile ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-5 h-5 mx-auto mb-1 text-gray-400" />
              <p className="text-sm text-gray-600">
                {modelFile ? modelFile.name : 'modelo_knn_{version}.json'}
              </p>
            </div>
            <input ref={modelRef} type="file" accept=".json" className="hidden" onChange={e => setModelFile(e.target.files[0])} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Archivo métricas JSON (opcional)</label>
            <div
              onClick={() => metricsRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                metricsFile ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <BarChart2 className="w-5 h-5 mx-auto mb-1 text-gray-400" />
              <p className="text-sm text-gray-600">
                {metricsFile ? metricsFile.name : 'modelo_knn_{version}_metrics.json'}
              </p>
            </div>
            <input ref={metricsRef} type="file" accept=".json" className="hidden" onChange={e => setMetricsFile(e.target.files[0])} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
            <textarea
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Ej: Entrenado con 720 casos EPS Sura 2026-Q1"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 transition"
          >
            {loading ? 'Subiendo…' : 'Activar modelo'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ModeloPerformance() {
  const [data, setData] = useState(null)
  const [grafo, setGrafo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [recalcLoading, setRecalcLoading] = useState(false)
  const [toast, setToast] = useState(null)

  async function fetchData() {
    setLoading(true)
    try {
      const [perf, graph] = await Promise.all([
        API.get('/api/v1/modelo/performance'),
        API.get('/api/v1/modelo/grafo').catch(() => null),
      ])
      setData(perf.data)
      setGrafo(graph?.data ?? null)
    } catch { setData(null); setGrafo(null) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  async function handleRecalcular() {
    if (!confirm('¿Recalcular el grafo con el dataset sintético? Esto puede tardar ~3 segundos.')) return
    setRecalcLoading(true)
    try {
      await API.post('/api/v1/modelo/recalcular-sintetico')
      setToast({ type: 'success', msg: 'Modelo sintético recalculado.' })
      fetchData()
    } catch (e) {
      setToast({ type: 'error', msg: e.response?.data?.detail || 'Error al recalcular.' })
    } finally { setRecalcLoading(false) }
  }

  function handleSubido() {
    setShowUpload(false)
    setToast({ type: 'success', msg: 'Modelo activado correctamente.' })
    fetchData()
  }

  const modelo = data?.modelo_activo
  const metricas = data?.metricas

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modelo IA</h1>
          <p className="text-sm text-gray-500 mt-1">Rendimiento y versiones del modelo kNN de inferencia causal.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRecalcular}
            disabled={recalcLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${recalcLoading ? 'animate-spin' : ''}`} />
            Recalcular sintético
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition"
          >
            <Upload className="w-4 h-4" />
            Cargar modelo real
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
          toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            : <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          }
          <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{toast.msg}</p>
          <button onClick={() => setToast(null)} className="ml-auto text-gray-400 hover:text-gray-600 text-xs">✕</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : !data ? (
        <div className="bg-white rounded-2xl border p-8 text-center">
          <p className="text-gray-500 text-sm">No se pudo cargar la información del modelo.</p>
        </div>
      ) : (
        <>
          {/* Drift alert */}
          {data.alerta_drift && (
            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Modelo sintético en producción</p>
                <p className="text-xs text-yellow-600 mt-0.5">{data.alerta_drift}</p>
              </div>
            </div>
          )}

          {/* Modelo activo */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">{modelo?.version}</h2>
                <p className="text-xs text-gray-400">
                  {modelo?.fecha ? new Date(modelo.fecha).toLocaleString('es-CO') : ''}
                  {modelo?.es_sintetico && <span className="ml-2 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">SINTÉTICO</span>}
                  {!modelo?.es_sintetico && <span className="ml-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">DATOS REALES</span>}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Casos de entrenamiento</p>
                <p className="text-xl font-bold text-gray-800">{modelo?.n_samples?.toLocaleString('es-CO') ?? '—'}</p>
              </div>
              {modelo?.notas && (
                <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-gray-400">Notas</p>
                  <p className="text-sm text-gray-700">{modelo.notas}</p>
                </div>
              )}
            </div>
          </div>

          {/* Métricas */}
          {metricas && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCard
                  label="AUC macro OvR"
                  value={metricas.auc_macro_ovr != null ? (metricas.auc_macro_ovr * 100).toFixed(1) + '%' : 'N/A'}
                  sub="Umbral recomendado: ≥75%"
                  color={metricas.auc_macro_ovr >= 0.75 ? 'text-green-600' : 'text-red-500'}
                />
                <MetricCard
                  label="Accuracy"
                  value={metricas.accuracy != null ? (metricas.accuracy * 100).toFixed(1) + '%' : 'N/A'}
                  sub={`${metricas.n_test ?? '—'} casos en test set`}
                />
                <MetricCard
                  label="Estado"
                  value={metricas.auc_macro_ovr >= 0.75 ? '✓ Listo' : '⚠ Revisar'}
                  color={metricas.auc_macro_ovr >= 0.75 ? 'text-green-600' : 'text-yellow-600'}
                />
              </div>

              {/* Por clase */}
              {metricas.classification_report && (
                <div className="bg-white rounded-2xl border shadow-sm p-6 overflow-x-auto">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Reporte por clase</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 border-b">
                        <th className="pb-2 font-medium">Clase</th>
                        <th className="pb-2 font-medium text-right">Precisión</th>
                        <th className="pb-2 font-medium text-right">Recall</th>
                        <th className="pb-2 font-medium text-right">F1</th>
                        <th className="pb-2 font-medium text-right">Soporte</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {['0', '1', '2', '3'].map(k => {
                        const row = metricas.classification_report[k]
                        if (!row) return null
                        return (
                          <tr key={k} className="hover:bg-gray-50/50">
                            <td className="py-2 font-medium text-gray-700">{OUTCOME_NAMES[parseInt(k)]}</td>
                            <td className="py-2 text-right font-mono text-gray-600">{(row.precision * 100).toFixed(1)}%</td>
                            <td className="py-2 text-right font-mono text-gray-600">{(row.recall * 100).toFixed(1)}%</td>
                            <td className="py-2 text-right font-mono text-gray-600">{(row['f1-score'] * 100).toFixed(1)}%</td>
                            <td className="py-2 text-right text-gray-500">{row.support}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {metricas.confusion_matrix && (
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                  <ConfusionMatrix matrix={metricas.confusion_matrix} />
                </div>
              )}
            </>
          )}

          {/* Grafo causal */}
          {grafo && grafo.feature_cols?.length > 0 && (
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <div className="flex items-start gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Network className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Grafo causal · PC Algorithm (α={grafo.alpha ?? 0.05})
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {grafo.causal_parents?.length ?? 0} de {grafo.all_features_count} variables detectadas como causales
                    {grafo.model_version && <> · Modelo <span className="font-mono">{grafo.model_version}</span></>}
                    {grafo.built_at && <> · {new Date(grafo.built_at).toLocaleString('es-CO')}</>}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <CausalGraphView
                  feature_cols={grafo.feature_cols}
                  causal_parents={grafo.causal_parents}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4 bg-gray-50 rounded-lg p-3">
                El PC Algorithm identifica qué variables tienen relación causal con el Outcome. Solo estas se usan en el scoring kNN.
              </p>
            </div>
          )}

          {!metricas && (
            <div className="bg-white rounded-2xl border shadow-sm p-6 text-center">
              <BarChart2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Sin métricas disponibles para este modelo.</p>
              <p className="text-xs text-gray-400 mt-1">
                Carga un modelo entrenado con <code className="font-mono bg-gray-100 px-1 rounded">scripts/train_model.py</code> para ver AUC y matriz de confusión.
              </p>
            </div>
          )}

          {/* Historial */}
          {data.historial_versiones?.length > 0 && (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" /> Historial de versiones
                </h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500">
                    <th className="px-6 py-3 font-medium">Versión</th>
                    <th className="px-6 py-3 font-medium">Fecha</th>
                    <th className="px-6 py-3 font-medium">Muestras</th>
                    <th className="px-6 py-3 font-medium">AUC</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.historial_versiones.map(h => (
                    <tr key={h.id} className={`hover:bg-gray-50/50 ${h.activo ? 'bg-brand-50/30' : ''}`}>
                      <td className="px-6 py-3 font-mono font-semibold text-gray-800">{h.version}</td>
                      <td className="px-6 py-3 text-gray-500">{new Date(h.fecha).toLocaleDateString('es-CO')}</td>
                      <td className="px-6 py-3 text-gray-600">{h.n_samples?.toLocaleString('es-CO') ?? '—'}</td>
                      <td className="px-6 py-3 text-gray-600">
                        {h.metricas?.auc_macro_ovr != null
                          ? <span className={h.metricas.auc_macro_ovr >= 0.75 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                              {(h.metricas.auc_macro_ovr * 100).toFixed(1)}%
                            </span>
                          : '—'
                        }
                      </td>
                      <td className="px-6 py-3">
                        {h.activo
                          ? <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">ACTIVO</span>
                          : <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">inactivo</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSubido={handleSubido} />}
    </div>
  )
}
