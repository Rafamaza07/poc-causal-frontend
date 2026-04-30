/**
 * Normalización de respuestas del backend.
 *
 * El backend tiene inconsistencias históricas en nombres de campos.
 * Todas las correcciones van aquí — no inline en los componentes.
 */

/** Alertas: el backend puede devolver `alerts` o `alertas`. */
export function normalizeAlerts(data) {
  return data?.alerts ?? data?.alertas ?? []
}

/** Listas de casos: el backend puede devolver `{casos:[]}` o array directo. */
export function normalizeCasos(data) {
  if (!data) return []
  return Array.isArray(data) ? data : (data.casos ?? [])
}

/** Chat: el backend puede devolver `respuesta` o `response`. */
export function normalizeChatResponse(data) {
  return {
    respuesta:  data?.respuesta ?? data?.response ?? '',
    session_id: data?.session_id ?? null,
    sources:    data?.sources ?? [],
  }
}

/** Resumen de alertas: normaliza el campo de total pendiente. */
export function normalizeAlertSummary(data) {
  return {
    total_pending: data?.total_pending ?? data?.pendientes ?? 0,
    critical:      data?.critical ?? data?.criticas ?? 0,
  }
}
