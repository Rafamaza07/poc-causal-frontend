/**
 * ScoreBloques — visualiza el scoring por bloques 0–5 por bloque (0–20 total).
 *
 * Props:
 *   scoring   — objeto scoring_bloques del backend
 *   compact   — bool (opcional) — solo total + badge sin barras individuales
 */

import { Stethoscope, FileCheck, Briefcase, Scale } from 'lucide-react'

const BLOQUES = [
  {
    key:   'clinico',
    label: 'Clínico',
    Icon:  Stethoscope,
  },
  {
    key:   'calificacion',
    label: 'Calificación PCL',
    Icon:  FileCheck,
  },
  {
    key:   'ocupacional',
    label: 'Ocupacional',
    Icon:  Briefcase,
  },
  {
    key:   'juridico_administrativo',
    label: 'Jurídico-admin.',
    Icon:  Scale,
  },
]

const INTERP_CONFIG = {
  listo_cierre:       { label: 'Listo para cierre',   cls: 'bg-green-100 text-green-800 border border-green-300' },
  seguimiento_activo: { label: 'Seguimiento activo',  cls: 'bg-amber-100 text-amber-800 border border-amber-300' },
  critico:            { label: 'Crítico',              cls: 'bg-red-100   text-red-800   border border-red-300'   },
}

function barColor(val) {
  if (val >= 4) return 'bg-green-500'
  if (val >= 2) return 'bg-amber-500'
  return 'bg-red-500'
}

function barTrack(val) {
  if (val >= 4) return 'bg-green-100'
  if (val >= 2) return 'bg-amber-100'
  return 'bg-red-100'
}

export default function ScoreBloques({ scoring, compact = false }) {
  if (!scoring) return null

  const interp = INTERP_CONFIG[scoring.interpretacion] ?? INTERP_CONFIG.critico

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-gray-800">
          {scoring.total ?? 0}
          <span className="text-sm font-normal text-gray-500">/20</span>
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${interp.cls}`}>
          {interp.label}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Scoring por bloques (Marco §6–§8)
      </h3>

      <div className="space-y-3 mb-5">
        {BLOQUES.map(({ key, label, Icon }) => {
          const val = scoring[key] ?? 0
          const pct = (val / 5) * 100
          return (
            <div key={key} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-36 shrink-0">
                <Icon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-600 truncate">{label}</span>
              </div>
              <div className={`flex-1 h-2.5 rounded-full ${barTrack(val)}`}>
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${barColor(val)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-8 text-right">
                {val}/5
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">{scoring.total ?? 0}</span>
          <span className="text-sm text-gray-400">/20</span>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${interp.cls}`}>
          {interp.label}
        </span>
      </div>
    </div>
  )
}
