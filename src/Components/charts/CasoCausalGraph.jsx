/**
 * Grafo causal por caso clínico individual.
 * 4 nodos en rombo (CIE10/RMN/ORIGEN/PUESTO) + vacíos críticos + tarjetas resumen.
 * SVG puro. Tooltips sin librerías. Accesible por teclado.
 */
import { useState } from 'react'

// ─── Colores por estado de nodo ────────────────────────────────────────────
const ESTADO_NODO = {
  confirmado:         { fill: '#2258db', stroke: '#1d47b8', text: '#ffffff' },
  presente:           { fill: '#2258db', stroke: '#1d47b8', text: '#ffffff' },
  analizado:          { fill: '#2258db', stroke: '#1d47b8', text: '#ffffff' },
  calificado_laboral: { fill: '#2258db', stroke: '#1d47b8', text: '#ffffff' },
  calificado_comun:   { fill: '#2258db', stroke: '#1d47b8', text: '#ffffff' },
  faltante:           { fill: '#ef4444', stroke: '#dc2626', text: '#ffffff' },
  no_codificado:      { fill: '#ef4444', stroke: '#dc2626', text: '#ffffff' },
  parcial:            { fill: '#fef9c3', stroke: '#eab308', text: '#374151' },
  pendiente:          { fill: '#fef9c3', stroke: '#eab308', text: '#374151' },
  sin_calificar:      { fill: '#fef9c3', stroke: '#eab308', text: '#374151' },
  sin_analisis:       { fill: '#fef9c3', stroke: '#eab308', text: '#374151' },
}
const DEFAULT_NODO = { fill: '#f3f4f6', stroke: '#9ca3af', text: '#374151' }

// ─── Colores y estilo por estado de arista ─────────────────────────────────
const ESTADO_ARISTA = {
  confirmada:  { stroke: '#22c55e', strokeWidth: 2, dashArray: null },
  faltante:    { stroke: '#ef4444', strokeWidth: 2, dashArray: '6,4' },
  informativa: { stroke: '#d1d5db', strokeWidth: 1, dashArray: null },
}

// ─── Posiciones fijas (centro SVG x, y) ────────────────────────────────────
const NODE_POS = {
  cie10:  { cx: 300, cy: 72 },
  rmn:    { cx: 110, cy: 210 },
  origen: { cx: 490, cy: 210 },
  puesto: { cx: 300, cy: 348 },
}
const W = 70
const H = 28

// ─── Puntos de conexión por arista ─────────────────────────────────────────
const EDGE_POINTS = {
  'cie10-rmn':     { x1: 261, y1: 100, x2: 149, y2: 182 },
  'cie10-origen':  { x1: 339, y1: 100, x2: 451, y2: 182 },
  'puesto-origen': { x1: 370, y1: 348, x2: 490, y2: 238 },
  'rmn-puesto':    { x1: 110, y1: 238, x2: 230, y2: 348 },
  'rmn-cie10':     { x1: 149, y1: 182, x2: 261, y2: 100 },
  'origen-cie10':  { x1: 451, y1: 182, x2: 339, y2: 100 },
  'origen-puesto': { x1: 490, y1: 238, x2: 370, y2: 348 },
  'puesto-rmn':    { x1: 230, y1: 348, x2: 110, y2: 238 },
}

// ─── Mapeo vacío → campo del checklist ────────────────────────────────────
const VACIO_TO_CHECKLIST = {
  rmn_columna_lumbar:  'imagenes_y_laboratorios',
  estudio_puesto:      'evaluacion_del_puesto',
  historia_ocupacional:'historia_clinica_completa',
  concepto_rehab:      'concepto_rehabilitacion',
}

// ─── Conversión SVG coords → % del contenedor para posicionar tooltip ──────
function tipPct(svgX, svgY) {
  return { left: `${(svgX / 600) * 100}%`, top: `${(svgY / 420) * 100}%` }
}

// ─── Nodo SVG ──────────────────────────────────────────────────────────────
function NodoSVG({ id, label, detalle, estado, onEnter, onLeave, onToggle }) {
  const { cx, cy } = NODE_POS[id]
  const style = ESTADO_NODO[estado] || DEFAULT_NODO
  const lines = label.split(' ')
  const firstLine = lines.slice(0, 2).join(' ')
  const overflow  = lines.length > 2 ? '…' : ''
  const ariaLabel = `Nodo ${label}: ${detalle} (estado: ${estado})`
  const tipPos    = { svgX: cx, svgY: cy - H - 8 }
  const tipText   = `${label} — ${detalle}`

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onEnter(tipPos.svgX, tipPos.svgY, tipText)}
      onMouseLeave={onLeave}
      onFocus={() => onEnter(tipPos.svgX, tipPos.svgY, tipText)}
      onBlur={onLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle(tipPos.svgX, tipPos.svgY, tipText)
        }
      }}
    >
      <rect
        x={cx - W} y={cy - H}
        width={W * 2} height={H * 2}
        rx={10}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={1.5}
      />
      <text x={cx} y={cy - 4} fontSize={11} fontWeight="700"
        textAnchor="middle" fill={style.text} style={{ userSelect: 'none' }}>
        {firstLine}{overflow}
      </text>
      <text x={cx} y={cy + 12} fontSize={9.5}
        textAnchor="middle" fill={style.text} opacity={0.85} style={{ userSelect: 'none' }}>
        {detalle}
      </text>
    </g>
  )
}

// ─── Arista SVG ────────────────────────────────────────────────────────────
function AristaSVG({ from, to, estado, explicacion, onEnter, onLeave, onToggle }) {
  const key  = `${from}-${to}`
  const pts  = EDGE_POINTS[key] || EDGE_POINTS[`${to}-${from}`]
  if (!pts) return null

  const style   = ESTADO_ARISTA[estado] || ESTADO_ARISTA.informativa
  const midX    = (pts.x1 + pts.x2) / 2
  const midY    = (pts.y1 + pts.y2) / 2
  const tipText = explicacion || `Relación ${from} ↔ ${to}`
  const ariaLbl = `Arista ${from} a ${to} (${estado})${explicacion ? ': ' + explicacion : ''}`

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={ariaLbl}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onEnter(midX, midY - 14, tipText)}
      onMouseLeave={onLeave}
      onFocus={() => onEnter(midX, midY - 14, tipText)}
      onBlur={onLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle(midX, midY - 14, tipText)
        }
      }}
    >
      {/* Área de hit amplia */}
      <line x1={pts.x1} y1={pts.y1} x2={pts.x2} y2={pts.y2}
        stroke="transparent" strokeWidth={14} />
      {/* Línea visible */}
      <line x1={pts.x1} y1={pts.y1} x2={pts.x2} y2={pts.y2}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        strokeDasharray={style.dashArray || undefined}
        strokeLinecap="round"
      />
    </g>
  )
}

// ─── Tooltip SVG (dentro del SVG, en coordenadas viewBox) ──────────────────
function TooltipSVG({ svgX, svgY, texto }) {
  const maxLen = 48
  const display = texto.length > maxLen ? texto.slice(0, maxLen) + '…' : texto
  const rectW   = Math.min(display.length * 5.8 + 16, 280)
  const rx = 6

  return (
    <g pointerEvents="none">
      <rect
        x={svgX - rectW / 2} y={svgY - 20}
        width={rectW} height={22}
        rx={rx}
        fill="rgba(17,24,39,0.88)"
      />
      <text
        x={svgX} y={svgY - 5}
        fontSize={9} textAnchor="middle" fill="#fff"
        style={{ userSelect: 'none' }}
      >
        {display}
      </text>
    </g>
  )
}

// ─── Item de vacío crítico ──────────────────────────────────────────────────
function VacioItem({ id, titulo, estado, severidad, onVacioClick }) {
  const checklistKey  = VACIO_TO_CHECKLIST[id]
  const clickable     = Boolean(checklistKey && onVacioClick)
  const colorEstado   = estado === 'faltante' ? 'text-red-600' : 'text-yellow-600'
  const badgeStyle    = severidad === 'alta'
    ? 'bg-red-100 text-red-700'
    : 'bg-yellow-100 text-yellow-700'

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Ir al campo ${titulo} en Documentación` : undefined}
      onClick={() => clickable && onVacioClick(checklistKey)}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onVacioClick(checklistKey)
        }
      }}
      className={[
        'flex items-start justify-between gap-2 py-2 border-b border-gray-100 last:border-0',
        clickable
          ? 'cursor-pointer hover:bg-gray-50 rounded transition-colors px-1 -mx-1'
          : '',
      ].join(' ')}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-800 leading-tight">{titulo}</p>
        <p className={`text-[11px] capitalize mt-0.5 ${colorEstado}`}>{estado}</p>
      </div>
      <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badgeStyle}`}>
        {severidad === 'alta' ? 'Alta' : 'Media'}
      </span>
    </div>
  )
}

// ─── Tarjeta IPP color por categoría ───────────────────────────────────────
const IPP_COLOR = { alta: 'text-red-600', media: 'text-yellow-600', baja: 'text-green-600' }

// ─── Componente principal ───────────────────────────────────────────────────
export default function CasoCausalGraph({ data, onVacioClick }) {
  const [tooltip, setTooltip] = useState(null)   // { svgX, svgY, texto }
  const [pinned,  setPinned]  = useState(false)

  if (!data) return null

  const { nodos = {}, aristas = [], vacios_criticos = [], resumen = {} } = data
  const { recomendacion: rec, probabilidad_ipp: ipp, tutela_predictiva: tutela } = resumen

  const showTip = (svgX, svgY, texto) => {
    if (!pinned) setTooltip({ svgX, svgY, texto })
  }
  const hideTip = () => {
    if (!pinned) setTooltip(null)
  }
  const togglePin = (svgX, svgY, texto) => {
    if (pinned && tooltip?.texto === texto) {
      setPinned(false)
      setTooltip(null)
    } else {
      setPinned(true)
      setTooltip({ svgX, svgY, texto })
    }
  }

  return (
    <div className="space-y-4">
      {/* SVG del grafo */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox="0 0 600 420"
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Grafo causal del caso"
          style={{ minWidth: 320 }}
        >
          {/* Aristas (debajo de nodos) */}
          {aristas.map((a, i) => (
            <AristaSVG
              key={i}
              from={a.from} to={a.to} estado={a.estado} explicacion={a.explicacion}
              onEnter={showTip} onLeave={hideTip} onToggle={togglePin}
            />
          ))}

          {/* Nodos */}
          {Object.entries(nodos).map(([id, n]) => (
            <NodoSVG
              key={id} id={id} label={n.label} detalle={n.detalle} estado={n.estado}
              onEnter={showTip} onLeave={hideTip} onToggle={togglePin}
            />
          ))}

          {/* Tooltip en coordenadas SVG */}
          {tooltip && (
            <TooltipSVG svgX={tooltip.svgX} svgY={tooltip.svgY} texto={tooltip.texto} />
          )}

          <text x={300} y={408} fontSize={10} textAnchor="middle" fill="#9ca3af">
            Pase el cursor sobre los nodos o aristas para ver detalle causal
          </text>
        </svg>
      </div>

      {/* Leyenda de aristas */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 px-1">
        <span className="flex items-center gap-1.5">
          <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="#22c55e" strokeWidth="2" /></svg>
          Coherencia confirmada
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" /></svg>
          Vacío crítico
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="#d1d5db" strokeWidth="1" /></svg>
          Relación informativa
        </span>
        {pinned && (
          <button
            onClick={() => { setPinned(false); setTooltip(null) }}
            className="text-brand-600 underline text-[11px]"
          >
            Cerrar tooltip
          </button>
        )}
      </div>

      {/* Vacíos críticos + tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Panel vacíos críticos */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-amber-500 text-sm">⚠</span>
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Vacíos Críticos</h3>
          </div>
          {vacios_criticos.length === 0 ? (
            <p className="text-xs text-green-600 font-medium">Sin vacíos — documentación completa</p>
          ) : (
            vacios_criticos.map((v) => (
              <VacioItem
                key={v.id}
                id={v.id} titulo={v.titulo} estado={v.estado} severidad={v.severidad}
                onVacioClick={onVacioClick}
              />
            ))
          )}
          {onVacioClick && vacios_criticos.length > 0 && (
            <p className="text-[10px] text-gray-400 mt-2">
              Haz clic en un vacío para ir al checklist documental
            </p>
          )}
        </div>

        {/* Tarjetas resumen */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Recomendación</p>
            <p className="text-sm font-bold text-gray-800 leading-snug">{rec?.label || '—'}</p>
            {rec?.prioridad && (
              <span className={`mt-2 text-[10px] font-medium ${
                rec.prioridad === 'inmediata' ? 'text-red-600' :
                rec.prioridad === 'alta'      ? 'text-orange-500' :
                rec.prioridad === 'media'     ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                Prioridad {rec.prioridad}
              </span>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Probabilidad IPP</p>
            <p className={`text-3xl font-bold ${IPP_COLOR[ipp?.categoria] || 'text-gray-800'}`}>
              {ipp?.valor ?? '—'}%
            </p>
            <p className="text-[10px] text-gray-400 mt-1">Incapacidad Permanente Parcial</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Tutela Predictiva</p>
            <p className={`text-sm font-bold ${tutela?.recomendada ? 'text-amber-600' : 'text-green-600'}`}>
              {tutela?.recomendada ? 'Recomendada' : 'No requerida'}
            </p>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">{tutela?.motivo || ''}</p>
          </div>

        </div>
      </div>
    </div>
  )
}
