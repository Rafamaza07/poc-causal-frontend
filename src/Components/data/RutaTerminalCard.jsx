/**
 * RutaTerminalCard — muestra la ruta de decisión del marco clínico-jurídico (§10-11).
 *
 * Props:
 *   resultado  — objeto resultado_final del backend (contiene ruta_terminal,
 *                justificacion_ruta, ruta_detalle)
 *   compact    — bool (opcional) — versión compacta para historial
 */

import {
  GitBranch, RefreshCw, UserCheck, FileX, FileSearch,
  HeartPulse, AlertTriangle, ShieldAlert, ChevronDown, ChevronUp,
  CheckCircle,
} from 'lucide-react'
import { useState } from 'react'

const RUTA_CONFIG = {
  RECALIFICAR: {
    label:       'Recalificar',
    description: 'Nueva valoración médico-laboral o recalificación requerida',
    color:       'amber',
    icon:        RefreshCw,
    card:        'bg-amber-50 border-amber-300',
    badge:       'bg-amber-100 text-amber-800 border border-amber-300',
    iconBg:      'bg-amber-100',
    iconColor:   'text-amber-700',
  },
  REUBICAR: {
    label:       'Reubicar',
    description: 'Reubicación laboral temporal o definitiva requerida',
    color:       'blue',
    icon:        UserCheck,
    card:        'bg-blue-50 border-blue-300',
    badge:       'bg-blue-100 text-blue-800 border border-blue-300',
    iconBg:      'bg-blue-100',
    iconColor:   'text-blue-700',
  },
  ANALIZAR_TERMINACION: {
    label:       'Analizar terminación',
    description: 'Análisis jurídico integral de terminación del vínculo',
    color:       'red',
    icon:        FileX,
    card:        'bg-red-50 border-red-300',
    badge:       'bg-red-100 text-red-800 border border-red-300',
    iconBg:      'bg-red-100',
    iconColor:   'text-red-700',
  },
  COMPLETAR_EXPEDIENTE: {
    label:       'Completar expediente',
    description: 'Documentación crítica insuficiente para decidir ruta',
    color:       'orange',
    icon:        FileSearch,
    card:        'bg-orange-50 border-orange-300',
    badge:       'bg-orange-100 text-orange-800 border border-orange-300',
    iconBg:      'bg-orange-100',
    iconColor:   'text-orange-700',
  },
  CONTINUAR_REHABILITACION: {
    label:       'Continuar rehabilitación',
    description: 'Seguimiento clínico activo — ninguna ruta terminal aplica aún',
    color:       'green',
    icon:        HeartPulse,
    card:        'bg-emerald-50 border-emerald-300',
    badge:       'bg-emerald-100 text-emerald-800 border border-emerald-300',
    iconBg:      'bg-emerald-100',
    iconColor:   'text-emerald-700',
  },
  CIERRE_POR_ALTA: {
    label:       'Cierre por alta',
    description: 'Alta médica procedente con seguimiento posterior',
    color:       'green',
    icon:        CheckCircle,
    card:        'bg-emerald-50 border-emerald-300',
    badge:       'bg-emerald-100 text-emerald-800 border border-emerald-300',
    iconBg:      'bg-emerald-100',
    iconColor:   'text-emerald-700',
  },
}

const RIESGO_BADGE = {
  bajo:  'bg-green-100 text-green-800 border-green-200',
  medio: 'bg-amber-100 text-amber-800 border-amber-200',
  alto:  'bg-red-100 text-red-800 border-red-200',
}

export default function RutaTerminalCard({ resultado, compact = false }) {
  const [open, setOpen] = useState(false)

  if (!resultado?.ruta_terminal) return null

  const ruta    = resultado.ruta_terminal
  const detalle = resultado.ruta_detalle ?? {}
  const cfg     = RUTA_CONFIG[ruta] ?? RUTA_CONFIG.CONTINUAR_REHABILITACION
  const Icon    = cfg.icon
  const estab   = detalle.estabilidad_laboral_reforzada

  return (
    <div className={`rounded-xl border-2 ${cfg.card} overflow-hidden`}>

      {/* Banner jurídico — solo si estabilidad laboral reforzada */}
      {estab && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-orange-500 text-white">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">
            Requiere revisión jurídica estricta antes de ejecutar
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
            <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-0.5">
              Ruta de decisión · Marco clínico-jurídico
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${cfg.badge}`}>
                {cfg.label}
              </span>
              {detalle.riesgo_juridico && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  RIESGO_BADGE[detalle.riesgo_juridico] ?? RIESGO_BADGE.bajo
                }`}>
                  Riesgo jurídico: {detalle.riesgo_juridico}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Justificación */}
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          {resultado.justificacion_ruta}
        </p>

        {/* Gatillos activados */}
        {detalle.gatillos_activados?.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Gatillos activados
            </p>
            <ul className="space-y-1">
              {detalle.gatillos_activados.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Acciones sugeridas — colapsable */}
        {!compact && detalle.acciones_sugeridas?.length > 0 && (
          <div>
            <button
              onClick={() => setOpen(v => !v)}
              className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700 transition-colors"
            >
              {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              Acciones sugeridas ({detalle.acciones_sugeridas.length})
            </button>
            {open && (
              <ul className="mt-2 space-y-1.5">
                {detalle.acciones_sugeridas.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="text-brand-600 font-bold flex-shrink-0">{i + 1}.</span>
                    {a}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Documentos requeridos — solo si hay */}
        {!compact && detalle.gatillos_documentales?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-current/10">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Documentos requeridos
            </p>
            <ul className="space-y-1">
              {detalle.gatillos_documentales.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <GitBranch className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
