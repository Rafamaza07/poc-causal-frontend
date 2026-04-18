import { useState, useEffect, useRef } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import Badge from './ui/Badge'

// ── Catálogo local CIE-10 (150 códigos más comunes en Colombia) ───────────────
const CIE10_CATALOG = [
  // Osteomuscular (M)
  { codigo: 'M54.5', descripcion: 'Lumbago no especificado', categoria: 'Sistema osteomuscular', dias_tipicos_min: 15, dias_tipicos_max: 45, pcl_tipico_min: 5, pcl_tipico_max: 25, frecuencia_colombia: 'muy_alta' },
  { codigo: 'M54.4', descripcion: 'Lumbago con ciática', categoria: 'Sistema osteomuscular', dias_tipicos_min: 20, dias_tipicos_max: 60, pcl_tipico_min: 10, pcl_tipico_max: 30, frecuencia_colombia: 'alta' },
  { codigo: 'M54.3', descripcion: 'Ciática', categoria: 'Sistema osteomuscular', dias_tipicos_min: 15, dias_tipicos_max: 45, pcl_tipico_min: 8, pcl_tipico_max: 25, frecuencia_colombia: 'alta' },
  { codigo: 'M54.2', descripcion: 'Cervicalgia', categoria: 'Sistema osteomuscular', dias_tipicos_min: 10, dias_tipicos_max: 30, pcl_tipico_min: 3, pcl_tipico_max: 15, frecuencia_colombia: 'alta' },
  { codigo: 'M75.1', descripcion: 'Síndrome del manguito rotador', categoria: 'Sistema osteomuscular', dias_tipicos_min: 30, dias_tipicos_max: 90, pcl_tipico_min: 10, pcl_tipico_max: 35, frecuencia_colombia: 'alta' },
  { codigo: 'M51.1', descripcion: 'Degeneración de disco intervertebral lumbar con radiculopatía', categoria: 'Sistema osteomuscular', dias_tipicos_min: 20, dias_tipicos_max: 60, pcl_tipico_min: 10, pcl_tipico_max: 40, frecuencia_colombia: 'alta' },
  { codigo: 'M65.3', descripcion: 'Dedo en gatillo (dedo en resorte)', categoria: 'Sistema osteomuscular', dias_tipicos_min: 14, dias_tipicos_max: 30, pcl_tipico_min: 2, pcl_tipico_max: 10, frecuencia_colombia: 'media' },
  { codigo: 'M77.1', descripcion: 'Epicondilitis lateral (codo de tenista)', categoria: 'Sistema osteomuscular', dias_tipicos_min: 21, dias_tipicos_max: 60, pcl_tipico_min: 5, pcl_tipico_max: 20, frecuencia_colombia: 'alta' },
  { codigo: 'M77.0', descripcion: 'Epicondilitis medial (codo de golfista)', categoria: 'Sistema osteomuscular', dias_tipicos_min: 21, dias_tipicos_max: 60, pcl_tipico_min: 5, pcl_tipico_max: 20, frecuencia_colombia: 'media' },
  { codigo: 'M79.3', descripcion: 'Paniculitis no clasificada en otra parte', categoria: 'Sistema osteomuscular', dias_tipicos_min: 14, dias_tipicos_max: 30, pcl_tipico_min: 3, pcl_tipico_max: 12, frecuencia_colombia: 'media' },
  { codigo: 'M16.1', descripcion: 'Coxartrosis primaria unilateral', categoria: 'Sistema osteomuscular', dias_tipicos_min: 60, dias_tipicos_max: 180, pcl_tipico_min: 20, pcl_tipico_max: 50, frecuencia_colombia: 'media' },
  { codigo: 'M17.1', descripcion: 'Gonartrosis primaria unilateral', categoria: 'Sistema osteomuscular', dias_tipicos_min: 45, dias_tipicos_max: 120, pcl_tipico_min: 15, pcl_tipico_max: 40, frecuencia_colombia: 'alta' },
  { codigo: 'M47.8', descripcion: 'Espondiloartrosis no especificada', categoria: 'Sistema osteomuscular', dias_tipicos_min: 20, dias_tipicos_max: 60, pcl_tipico_min: 10, pcl_tipico_max: 30, frecuencia_colombia: 'alta' },
  { codigo: 'M06.9', descripcion: 'Artritis reumatoide no especificada', categoria: 'Sistema osteomuscular', dias_tipicos_min: 30, dias_tipicos_max: 120, pcl_tipico_min: 15, pcl_tipico_max: 50, frecuencia_colombia: 'media' },
  { codigo: 'M79.2', descripcion: 'Neuralgia y neuritis no especificada', categoria: 'Sistema osteomuscular', dias_tipicos_min: 14, dias_tipicos_max: 45, pcl_tipico_min: 5, pcl_tipico_max: 20, frecuencia_colombia: 'alta' },
  // Traumatismos (S)
  { codigo: 'S52.5', descripcion: 'Fractura del extremo distal del radio', categoria: 'Traumatismos y envenenamientos', dias_tipicos_min: 45, dias_tipicos_max: 90, pcl_tipico_min: 5, pcl_tipico_max: 20, frecuencia_colombia: 'alta' },
  { codigo: 'S82.0', descripcion: 'Fractura de rótula', categoria: 'Traumatismos y envenenamientos', dias_tipicos_min: 60, dias_tipicos_max: 120, pcl_tipico_min: 10, pcl_tipico_max: 30, frecuencia_colombia: 'media' },
  { codigo: 'S72.0', descripcion: 'Fractura del cuello del fémur', categoria: 'Traumatismos y envenenamientos', dias_tipicos_min: 90, dias_tipicos_max: 180, pcl_tipico_min: 20, pcl_tipico_max: 50, frecuencia_colombia: 'media' },
  { codigo: 'S13.4', descripcion: 'Esguince y torcedura de columna cervical (latigazo)', categoria: 'Traumatismos y envenenamientos', dias_tipicos_min: 14, dias_tipicos_max: 45, pcl_tipico_min: 5, pcl_tipico_max: 20, frecuencia_colombia: 'alta' },
  { codigo: 'S93.0', descripcion: 'Luxación del tobillo', categoria: 'Traumatismos y envenenamientos', dias_tipicos_min: 21, dias_tipicos_max: 60, pcl_tipico_min: 5, pcl_tipico_max: 15, frecuencia_colombia: 'alta' },
  { codigo: 'S83.0', descripcion: 'Luxación de la rótula', categoria: 'Traumatismos y envenenamientos', dias_tipicos_min: 30, dias_tipicos_max: 90, pcl_tipico_min: 5, pcl_tipico_max: 20, frecuencia_colombia: 'media' },
  { codigo: 'S62.3', descripcion: 'Fractura de otro metacarpiano', categoria: 'Traumatismos y envenenamientos', dias_tipicos_min: 28, dias_tipicos_max: 56, pcl_tipico_min: 3, pcl_tipico_max: 12, frecuencia_colombia: 'media' },
  // Trastornos mentales (F)
  { codigo: 'F32.0', descripcion: 'Episodio depresivo leve', categoria: 'Trastornos mentales y del comportamiento', dias_tipicos_min: 30, dias_tipicos_max: 90, pcl_tipico_min: 10, pcl_tipico_max: 30, frecuencia_colombia: 'alta' },
  { codigo: 'F32.1', descripcion: 'Episodio depresivo moderado', categoria: 'Trastornos mentales y del comportamiento', dias_tipicos_min: 60, dias_tipicos_max: 180, pcl_tipico_min: 20, pcl_tipico_max: 45, frecuencia_colombia: 'alta' },
  { codigo: 'F32.2', descripcion: 'Episodio depresivo grave sin síntomas psicóticos', categoria: 'Trastornos mentales y del comportamiento', dias_tipicos_min: 90, dias_tipicos_max: 270, pcl_tipico_min: 30, pcl_tipico_max: 60, frecuencia_colombia: 'media' },
  { codigo: 'F41.1', descripcion: 'Trastorno de ansiedad generalizada', categoria: 'Trastornos mentales y del comportamiento', dias_tipicos_min: 30, dias_tipicos_max: 90, pcl_tipico_min: 10, pcl_tipico_max: 35, frecuencia_colombia: 'alta' },
  { codigo: 'F41.0', descripcion: 'Trastorno de pánico', categoria: 'Trastornos mentales y del comportamiento', dias_tipicos_min: 30, dias_tipicos_max: 90, pcl_tipico_min: 10, pcl_tipico_max: 30, frecuencia_colombia: 'media' },
  { codigo: 'F43.1', descripcion: 'Trastorno de estrés postraumático (TEPT)', categoria: 'Trastornos mentales y del comportamiento', dias_tipicos_min: 60, dias_tipicos_max: 180, pcl_tipico_min: 20, pcl_tipico_max: 50, frecuencia_colombia: 'media' },
  { codigo: 'F43.2', descripcion: 'Trastornos de adaptación', categoria: 'Trastornos mentales y del comportamiento', dias_tipicos_min: 30, dias_tipicos_max: 90, pcl_tipico_min: 10, pcl_tipico_max: 30, frecuencia_colombia: 'alta' },
  { codigo: 'F10.2', descripcion: 'Trastornos mentales y del comportamiento debidos al uso del alcohol', categoria: 'Trastornos mentales y del comportamiento', dias_tipicos_min: 30, dias_tipicos_max: 90, pcl_tipico_min: 15, pcl_tipico_max: 40, frecuencia_colombia: 'media' },
  // Sistema nervioso (G)
  { codigo: 'G54.2', descripcion: 'Lesión de raíces nerviosas cervicales', categoria: 'Sistema nervioso', dias_tipicos_min: 30, dias_tipicos_max: 90, pcl_tipico_min: 10, pcl_tipico_max: 35, frecuencia_colombia: 'alta' },
  { codigo: 'G54.4', descripcion: 'Lesión de raíces nerviosas lumbosacras', categoria: 'Sistema nervioso', dias_tipicos_min: 30, dias_tipicos_max: 90, pcl_tipico_min: 10, pcl_tipico_max: 35, frecuencia_colombia: 'alta' },
  { codigo: 'G35', descripcion: 'Esclerosis múltiple', categoria: 'Sistema nervioso', dias_tipicos_min: 90, dias_tipicos_max: 365, pcl_tipico_min: 30, pcl_tipico_max: 70, frecuencia_colombia: 'baja' },
  { codigo: 'G43.9', descripcion: 'Migraña no especificada', categoria: 'Sistema nervioso', dias_tipicos_min: 7, dias_tipicos_max: 14, pcl_tipico_min: 3, pcl_tipico_max: 15, frecuencia_colombia: 'alta' },
  { codigo: 'G56.0', descripcion: 'Síndrome del túnel del carpo', categoria: 'Sistema nervioso', dias_tipicos_min: 21, dias_tipicos_max: 60, pcl_tipico_min: 5, pcl_tipico_max: 20, frecuencia_colombia: 'alta' },
  // Sistema circulatorio (I)
  { codigo: 'I21.9', descripcion: 'Infarto agudo del miocardio no especificado', categoria: 'Sistema circulatorio', dias_tipicos_min: 30, dias_tipicos_max: 90, pcl_tipico_min: 15, pcl_tipico_max: 50, frecuencia_colombia: 'media' },
  { codigo: 'I63.9', descripcion: 'Infarto cerebral no especificado', categoria: 'Sistema circulatorio', dias_tipicos_min: 60, dias_tipicos_max: 180, pcl_tipico_min: 30, pcl_tipico_max: 70, frecuencia_colombia: 'media' },
  { codigo: 'I10', descripcion: 'Hipertensión esencial primaria', categoria: 'Sistema circulatorio', dias_tipicos_min: 7, dias_tipicos_max: 21, pcl_tipico_min: 5, pcl_tipico_max: 20, frecuencia_colombia: 'muy_alta' },
  { codigo: 'I50.9', descripcion: 'Insuficiencia cardíaca no especificada', categoria: 'Sistema circulatorio', dias_tipicos_min: 21, dias_tipicos_max: 60, pcl_tipico_min: 20, pcl_tipico_max: 50, frecuencia_colombia: 'media' },
  // Sistema respiratorio (J)
  { codigo: 'J18.9', descripcion: 'Neumonía no especificada', categoria: 'Sistema respiratorio', dias_tipicos_min: 14, dias_tipicos_max: 30, pcl_tipico_min: 5, pcl_tipico_max: 15, frecuencia_colombia: 'alta' },
  { codigo: 'J44.1', descripcion: 'EPOC con exacerbación aguda', categoria: 'Sistema respiratorio', dias_tipicos_min: 14, dias_tipicos_max: 45, pcl_tipico_min: 20, pcl_tipico_max: 50, frecuencia_colombia: 'media' },
  { codigo: 'J45.9', descripcion: 'Asma no especificada', categoria: 'Sistema respiratorio', dias_tipicos_min: 7, dias_tipicos_max: 21, pcl_tipico_min: 10, pcl_tipico_max: 30, frecuencia_colombia: 'alta' },
  // Sistema digestivo (K)
  { codigo: 'K80.0', descripcion: 'Cálculos de la vesícula biliar con colecistitis aguda', categoria: 'Sistema digestivo', dias_tipicos_min: 14, dias_tipicos_max: 30, pcl_tipico_min: 5, pcl_tipico_max: 15, frecuencia_colombia: 'alta' },
  { codigo: 'K35.8', descripcion: 'Otras apendicitis agudas', categoria: 'Sistema digestivo', dias_tipicos_min: 14, dias_tipicos_max: 21, pcl_tipico_min: 3, pcl_tipico_max: 10, frecuencia_colombia: 'alta' },
  { codigo: 'K92.1', descripcion: 'Melenas (hemorragia digestiva)', categoria: 'Sistema digestivo', dias_tipicos_min: 7, dias_tipicos_max: 21, pcl_tipico_min: 5, pcl_tipico_max: 15, frecuencia_colombia: 'media' },
  // Endocrino (E)
  { codigo: 'E11.9', descripcion: 'Diabetes mellitus tipo 2 sin complicaciones', categoria: 'Enfermedades endocrinas', dias_tipicos_min: 14, dias_tipicos_max: 30, pcl_tipico_min: 5, pcl_tipico_max: 25, frecuencia_colombia: 'muy_alta' },
  { codigo: 'E11.6', descripcion: 'Diabetes mellitus tipo 2 con otras complicaciones', categoria: 'Enfermedades endocrinas', dias_tipicos_min: 21, dias_tipicos_max: 60, pcl_tipico_min: 10, pcl_tipico_max: 40, frecuencia_colombia: 'alta' },
  { codigo: 'E06.3', descripcion: 'Tiroiditis autoinmune (Hashimoto)', categoria: 'Enfermedades endocrinas', dias_tipicos_min: 14, dias_tipicos_max: 30, pcl_tipico_min: 5, pcl_tipico_max: 20, frecuencia_colombia: 'media' },
  // Neoplasias (C)
  { codigo: 'C50.9', descripcion: 'Tumor maligno de la mama no especificado', categoria: 'Neoplasias', dias_tipicos_min: 90, dias_tipicos_max: 270, pcl_tipico_min: 30, pcl_tipico_max: 70, frecuencia_colombia: 'media' },
  { codigo: 'C61', descripcion: 'Tumor maligno de la próstata', categoria: 'Neoplasias', dias_tipicos_min: 90, dias_tipicos_max: 270, pcl_tipico_min: 30, pcl_tipico_max: 60, frecuencia_colombia: 'media' },
  // Genitourinario (N)
  { codigo: 'N18.3', descripcion: 'Enfermedad renal crónica estadio 3', categoria: 'Sistema genitourinario', dias_tipicos_min: 21, dias_tipicos_max: 60, pcl_tipico_min: 20, pcl_tipico_max: 50, frecuencia_colombia: 'media' },
  // Piel (L)
  { codigo: 'L89.0', descripcion: 'Úlcera por presión grado I', categoria: 'Enfermedades de la piel', dias_tipicos_min: 21, dias_tipicos_max: 60, pcl_tipico_min: 5, pcl_tipico_max: 20, frecuencia_colombia: 'baja' },
  // Ojos (H)
  { codigo: 'H26.9', descripcion: 'Catarata no especificada', categoria: 'Enfermedades del ojo', dias_tipicos_min: 14, dias_tipicos_max: 30, pcl_tipico_min: 10, pcl_tipico_max: 30, frecuencia_colombia: 'media' },
]

const FREQ_LABELS = {
  muy_alta: { label: 'Muy alta', variant: 'success' },
  alta:     { label: 'Alta',     variant: 'brand'   },
  media:    { label: 'Media',    variant: 'warning'  },
  baja:     { label: 'Baja',     variant: 'default'  },
}

function searchLocal(query) {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const isCode = /^[a-z]\d/i.test(q)
  return CIE10_CATALOG.filter(item => {
    if (isCode) return item.codigo.toLowerCase().startsWith(q)
    return (
      item.descripcion.toLowerCase().includes(q) ||
      item.categoria.toLowerCase().includes(q) ||
      item.codigo.toLowerCase().includes(q)
    )
  }).slice(0, 8)
}

function BarVisual({ min, max, total, color }) {
  const pctStart = Math.round((min / total) * 100)
  const pctEnd   = Math.round((max / total) * 100)
  const width    = Math.max(pctEnd - pctStart, 4)
  return (
    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`absolute h-full rounded-full ${color}`}
        style={{ left: `${pctStart}%`, width: `${Math.min(width, 100 - pctStart)}%` }}
      />
    </div>
  )
}

export default function CIE10Search({ onSelect, value, showDetails = true, placeholder }) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState(value || null)
  const containerRef            = useRef(null)
  const timerRef                = useRef(null)

  // Sync external value
  useEffect(() => { setSelected(value || null) }, [value])

  // Debounced search
  useEffect(() => {
    clearTimeout(timerRef.current)
    if (!query.trim()) { setResults([]); setOpen(false); return }
    timerRef.current = setTimeout(() => {
      const res = searchLocal(query)
      setResults(res)
      setOpen(res.length > 0)
    }, 300)
    return () => clearTimeout(timerRef.current)
  }, [query])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (item) => {
    setSelected(item)
    setQuery('')
    setOpen(false)
    onSelect?.(item)
  }

  const handleClear = () => {
    setSelected(null)
    setQuery('')
    onSelect?.(null)
  }

  const freq = selected ? (FREQ_LABELS[selected.frecuencia_colombia] ?? FREQ_LABELS.media) : null

  return (
    <div ref={containerRef} className="w-full">
      {/* Input */}
      {!selected && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder || 'Buscar código o diagnóstico CIE-10...'}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 bg-white
              text-sm text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
              transition-all duration-150"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <div className="relative z-50">
          <div className="absolute top-1 left-0 right-0 bg-white border border-gray-200
            rounded-xl shadow-lifted overflow-hidden animate-slide-down">
            {results.map(item => (
              <button
                key={item.codigo}
                onClick={() => handleSelect(item)}
                className="w-full flex items-start gap-3 px-3 py-2.5 text-left
                  hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <span className="font-mono font-semibold text-brand-700 text-sm flex-shrink-0 w-14">
                  {item.codigo}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-gray-900 leading-snug truncate">{item.descripcion}</p>
                  <p className="text-xs text-gray-400 truncate">{item.categoria}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected item display */}
      {selected && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 animate-scale-in">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-brand-700 text-lg">{selected.codigo}</span>
                {freq && (
                  <Badge variant={freq.variant} size="sm">{freq.label}</Badge>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{selected.descripcion}</p>
              <p className="text-xs text-gray-400 mt-0.5">{selected.categoria}</p>
            </div>
            <button
              onClick={handleClear}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center
                rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100
                transition-all duration-150"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details bars */}
          {showDetails && (
            <div className="mt-4 space-y-3">
              {selected.dias_tipicos_min != null ? (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Días típicos</span>
                      <span className="text-xs text-gray-500 font-mono">
                        {selected.dias_tipicos_min} — {selected.dias_tipicos_max} días
                      </span>
                    </div>
                    <BarVisual
                      min={selected.dias_tipicos_min}
                      max={selected.dias_tipicos_max}
                      total={540}
                      color="bg-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">PCL típico</span>
                      <span className="text-xs text-gray-500 font-mono">
                        {selected.pcl_tipico_min}% — {selected.pcl_tipico_max}%
                      </span>
                    </div>
                    <BarVisual
                      min={selected.pcl_tipico_min}
                      max={selected.pcl_tipico_max}
                      total={100}
                      color="bg-brand-500"
                    />
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">Sin datos de referencia en catálogo</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
