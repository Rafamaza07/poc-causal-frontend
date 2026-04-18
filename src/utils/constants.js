export const SCORE_RANGES = {
  BAJO:     { min: 0,  max: 25,  color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Bajo' },
  MODERADO: { min: 25, max: 50,  color: 'amber',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'Moderado' },
  ALTO:     { min: 50, max: 75,  color: 'orange',  bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  label: 'Alto' },
  CRITICO:  { min: 75, max: 100, color: 'red',     bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     label: 'Crítico' },
}

export const RECOMENDACIONES = {
  REINCORPORACION_INMEDIATA:    { color: 'emerald', icon: 'CheckCircle',   label: 'Reincorporación inmediata' },
  REINCORPORACION_CON_TERAPIAS: { color: 'blue',    icon: 'Activity',      label: 'Reincorporación con terapias' },
  CONTINUAR_INCAPACIDAD:        { color: 'amber',   icon: 'Clock',         label: 'Continuar incapacidad' },
  PENSION_INVALIDEZ:            { color: 'red',     icon: 'AlertTriangle', label: 'Pensión por invalidez' },
  CALIFICA_PENSION_INVALIDEZ:   { color: 'red',     icon: 'AlertTriangle', label: 'Evaluar pensión por invalidez' },
  FORZAR_CALIFICACION_PCL:      { color: 'red',     icon: 'AlertTriangle', label: 'Forzar calificación PCL' },
}

export const SEVERITY = {
  CRITICAL: { bg: 'bg-red-50',   text: 'text-red-700',   border: 'border-red-200',   icon: 'AlertTriangle' },
  WARNING:  { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'AlertCircle' },
  INFO:     { bg: 'bg-blue-50',  text: 'text-blue-700',  border: 'border-blue-200',  icon: 'Info' },
}

export const MILESTONES = [
  { days: 90,  label: 'Evaluación EPS',      decreto: 'Decreto 1333/2021' },
  { days: 120, label: 'Solicitud prórroga',   decreto: 'Decreto 1333/2021' },
  { days: 180, label: 'Referencia a pensión', decreto: 'Ley 100/1993 Art. 67' },
  { days: 540, label: 'Calificación PCL',     decreto: 'Decreto 019/2012' },
]

export const getScoreRange = (score) => {
  if (score >= 75) return SCORE_RANGES.CRITICO
  if (score >= 50) return SCORE_RANGES.ALTO
  if (score >= 25) return SCORE_RANGES.MODERADO
  return SCORE_RANGES.BAJO
}
