import { useState, useEffect, useRef } from 'react'
import {
  FileText, BarChart3, FileSpreadsheet, Shield,
  Download, Search, X, Loader2, Calendar,
} from 'lucide-react'
import API from '../api/client'
import { useToast } from '../Components/Toast'
import { useDebounce } from '../hooks/useDebounce'
import { getScoreRange } from '../utils/constants'
import { formatDate } from '../utils/formatters'

const REC_LABELS = {
  REINCORPORACION_INMEDIATA:    'Reincorporación inmediata',
  REINCORPORACION_CON_TERAPIAS: 'Reincorporación con terapias',
  CONTINUAR_INCAPACIDAD:        'Continuar incapacidad',
  CALIFICA_PENSION_INVALIDEZ:   'Pensión por invalidez',
  FORZAR_CALIFICACION_PCL:      'Forzar calificación PCL',
}

const today = new Date().toISOString().slice(0, 10)

// ─── Descarga de blob genérica ────────────────────────────────────────────────
async function fetchBlob(url, params = {}) {
  const res = await API.get(url, { responseType: 'blob', params })
  return res.data
}

function triggerDownload(blob, filename) {
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(href)
}

// ─── Score pill inline ────────────────────────────────────────────────────────
function ScoreChip({ score }) {
  const r = getScoreRange(score ?? 0)
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold flex-shrink-0 ${r.bg} ${r.text}`}>
      {Math.round(score ?? 0)}
    </span>
  )
}

// ─── Label de sección ─────────────────────────────────────────────────────────
function SectionLabel({ icon: Icon, children }) {
  return (
    <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
      <Icon className="w-4 h-4 text-brand-500" />
      {children}
    </h2>
  )
}

// ─── Date range picker (par de inputs) ────────────────────────────────────────
function DateRange({ desde, setDesde, hasta, setHasta }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { label: 'Desde', val: desde, set: setDesde },
        { label: 'Hasta', val: hasta, set: setHasta },
      ].map(({ label, val, set }) => (
        <div key={label}>
          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={val}
              onChange={e => set(e.target.value)}
              className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-lg text-xs text-gray-700
                focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 bg-gray-50/50"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Botón de descarga ────────────────────────────────────────────────────────
function DlButton({ loading, onClick, icon: Icon, label, variant = 'primary', className = '' }) {
  const base = 'flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60'
  const styles = {
    primary:   'bg-brand-600 hover:bg-brand-700 text-white',
    secondary: 'border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700',
  }
  return (
    <button onClick={onClick} disabled={loading}
      className={`${base} ${styles[variant]} ${className}`}>
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function Reportes() {
  const user        = JSON.parse(localStorage.getItem('user') || '{}')
  const esPriv      = ['admin', 'legal', 'superadmin'].includes(user.rol)
  const toast       = useToast()
  const [busy, setBusy] = useState({})   // key → boolean

  // ── Descarga centralizada ────────────────────────────────────────────────
  const download = async (key, url, filename, params = {}) => {
    setBusy(p => ({ ...p, [key]: true }))
    try {
      const blob = await fetchBlob(url, params)
      triggerDownload(blob, filename)
      toast('Archivo descargado exitosamente', 'success')
    } catch (err) {
      const status = err.response?.status
      if (status === 403) toast('Sin permisos para esta exportación', 'error')
      else if (status === 404) toast('No hay datos disponibles', 'warning')
      else toast('Error al generar el archivo', 'error')
    } finally {
      setBusy(p => ({ ...p, [key]: false }))
    }
  }

  // ── SECCIÓN 1: búsqueda de caso ─────────────────────────────────────────
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [looking, setLooking] = useState(false)
  const [showDd,  setShowDd]  = useState(false)
  const [selCase, setSelCase] = useState(null)
  const searchRef             = useRef(null)
  const debQ                  = useDebounce(query, 350)

  useEffect(() => {
    if (!debQ || debQ.length < 2) { setResults([]); setShowDd(false); return }
    setLooking(true)
    API.get('/api/historial', { params: { busqueda: debQ, limite: 6 } })
      .then(r => {
        const items = r.data.casos ?? r.data ?? []
        setResults(items)
        setShowDd(items.length > 0)
      })
      .catch(() => {})
      .finally(() => setLooking(false))
  }, [debQ])

  useEffect(() => {
    const close = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDd(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const pickCase = c => { setSelCase(c); setQuery(c.id_caso); setShowDd(false) }
  const clearSel = () => { setSelCase(null); setQuery('') }

  // ── SECCIÓN 2: portafolio ────────────────────────────────────────────────
  const [periodo, setPeriodo] = useState('todo')

  // ── SECCIÓN 3: filtros historial ─────────────────────────────────────────
  const [hDesde, setHDesde]   = useState('')
  const [hHasta, setHHasta]   = useState('')
  const [hNivel, setHNivel]   = useState('')

  // ── SECCIÓN 3: filtros logs ──────────────────────────────────────────────
  const [lDesde, setLDesde]   = useState('')
  const [lHasta, setLHasta]   = useState('')

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-3xl mx-auto space-y-10">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportes y exportaciones</h1>
        <p className="text-gray-500 text-sm mt-1">
          Genera reportes PDF detallados y exporta datos en Excel o CSV
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECCIÓN 1 — Reporte por caso
      ══════════════════════════════════════════════════════════════════ */}
      <section>
        <SectionLabel icon={FileText}>Reporte por caso</SectionLabel>

        <div className="card p-5 space-y-4">
          {/* Input de búsqueda */}
          <div ref={searchRef} className="relative">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Buscar caso por ID o evaluador
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setSelCase(null) }}
                onFocus={() => results.length > 0 && setShowDd(true)}
                placeholder="Ej. CASO-001, paciente-123..."
                className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400
                  bg-gray-50/50 placeholder-gray-400"
              />
              {query && (
                <button onClick={clearSel}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown resultados */}
            {(showDd || looking) && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lifted overflow-hidden animate-fade-in">
                {looking ? (
                  <div className="px-4 py-3 flex items-center gap-2 text-xs text-gray-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Buscando...
                  </div>
                ) : (
                  results.map(c => (
                    <button key={c.id_caso} onClick={() => pickCase(c)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 text-left transition-colors">
                      <ScoreChip score={c.score_riesgo} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{c.id_caso}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(c.fecha ?? c.fecha_evaluacion)} · {c.evaluado_por || '—'}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Card preview caso seleccionado */}
          {selCase ? (() => {
            const r   = getScoreRange(selCase.score_riesgo ?? 0)
            const rec = REC_LABELS[selCase.recomendacion]
              ?? (selCase.recomendacion ?? '—').replace(/_/g, ' ')
            const key = `pdf-${selCase.id_caso}`
            return (
              <div className={`flex items-center gap-4 p-4 rounded-xl border ${r.border} ${r.bg}`}>
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border ${r.border}`}>
                  <span className={`text-xl font-bold leading-none ${r.text}`}>
                    {Math.round(selCase.score_riesgo ?? 0)}
                  </span>
                  <span className={`text-[9px] font-medium uppercase tracking-wide ${r.text} opacity-60`}>
                    score
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${r.text}`}>{selCase.id_caso}</p>
                  <p className="text-xs text-gray-600 mt-0.5 truncate">{rec}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(selCase.fecha ?? selCase.fecha_evaluacion)}</p>
                </div>
                <button
                  onClick={() => download(key, `/api/casos/${selCase.id_caso}/reporte-pdf`,
                    `reporte-${selCase.id_caso}.pdf`)}
                  disabled={busy[key]}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700
                    disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors flex-shrink-0"
                >
                  {busy[key]
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Generando...</>
                    : <><FileText className="w-4 h-4" /> Generar PDF</>
                  }
                </button>
              </div>
            )
          })() : (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-3">
                <FileText className="w-7 h-7 text-brand-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Genera tu primer reporte</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
                Busca un caso por ID o evaluador para previsualizar y descargar su reporte PDF detallado.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECCIÓN 2 — Reporte de portafolio (solo admin / legal)
      ══════════════════════════════════════════════════════════════════ */}
      {esPriv && (
        <section>
          <SectionLabel icon={BarChart3}>Reporte de portafolio</SectionLabel>

          <div className="card p-6 border-brand-100 shadow-lifted">
            <div className="flex items-start gap-5">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">Reporte consolidado del portafolio</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  PDF de 3 páginas con estadísticas generales del tenant, distribución por
                  recomendación, top 10 diagnósticos CIE-10, casos críticos y anomalías detectadas.
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <select
                    value={periodo}
                    onChange={e => setPeriodo(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700
                      focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400
                      bg-gray-50/50 min-w-[160px]"
                  >
                    <option value="mes">Último mes</option>
                    <option value="tres_meses">Últimos 3 meses</option>
                    <option value="anio">Este año</option>
                    <option value="todo">Todo el historial</option>
                  </select>

                  <button
                    onClick={() => download('portafolio', '/api/v1/reportes/portafolio',
                      `portafolio-${today}.pdf`, { periodo })}
                    disabled={busy['portafolio']}
                    className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700
                      disabled:opacity-60 text-white font-medium rounded-xl transition-colors text-sm"
                  >
                    {busy['portafolio']
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Generando...</>
                      : <><Download className="w-4 h-4" /> Generar reporte</>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SECCIÓN 3 — Exportaciones (grid 2 columnas)
      ══════════════════════════════════════════════════════════════════ */}
      <section>
        <SectionLabel icon={Download}>Exportaciones</SectionLabel>

        <div className={`grid gap-4 ${esPriv ? 'md:grid-cols-2' : 'grid-cols-1 max-w-sm'}`}>

          {/* ── Card historial ──────────────────────────────────────── */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Exportar historial</h3>
                <p className="text-xs text-gray-400">Casos evaluados con todos sus indicadores</p>
              </div>
            </div>

            <DateRange desde={hDesde} setDesde={setHDesde} hasta={hHasta} setHasta={setHHasta} />

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Filtrar por nivel de riesgo</label>
              <select value={hNivel} onChange={e => setHNivel(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 bg-gray-50/50">
                <option value="">Todos los niveles</option>
                <option value="BAJO">Bajo</option>
                <option value="MODERADO">Moderado</option>
                <option value="ALTO">Alto</option>
                <option value="CRÍTICO">Crítico</option>
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <DlButton
                loading={busy['excel']}
                onClick={() => download('excel', '/api/v1/exportar/excel', `historial-${today}.xlsx`, {
                  fecha_desde:  hDesde || undefined,
                  fecha_hasta:  hHasta || undefined,
                  nivel_riesgo: hNivel || undefined,
                })}
                icon={FileSpreadsheet}
                label="Excel"
                variant="primary"
                className="flex-1"
              />
              <DlButton
                loading={busy['csv']}
                onClick={() => download('csv', '/api/historial/export-csv', `historial-${today}.csv`, {
                  nivel_riesgo: hNivel || undefined,
                })}
                icon={Download}
                label="CSV"
                variant="secondary"
                className="flex-1"
              />
            </div>
          </div>

          {/* ── Card logs (solo admin / legal) ─────────────────────── */}
          {esPriv && (
            <div className="card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Exportar logs de auditoría</h3>
                  <p className="text-xs text-gray-400">Trazabilidad completa de acciones</p>
                </div>
              </div>

              <DateRange desde={lDesde} setDesde={setLDesde} hasta={lHasta} setHasta={setLHasta} />

              <p className="text-xs text-gray-400 leading-relaxed">
                Incluye: logins, evaluaciones, ediciones y todas las acciones del período.
              </p>

              <DlButton
                loading={busy['logs']}
                onClick={() => download('logs', '/api/logs/export-csv', `logs-${today}.csv`, {
                  fecha_desde: lDesde || undefined,
                  fecha_hasta: lHasta || undefined,
                })}
                icon={Download}
                label="Exportar CSV"
                variant="secondary"
                className="w-full"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
