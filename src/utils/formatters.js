export const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

export const formatScore = (score) => Math.round(score * 10) / 10

export const formatPercent = (value) => `${Math.round(value * 10) / 10}%`

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return 'Ahora mismo'
  if (mins < 60)  return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `Hace ${hrs} h`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Ayer'
  if (days < 7)   return `Hace ${days} días`
  const weeks = Math.floor(days / 7)
  if (weeks < 5)  return `Hace ${weeks} semanas`
  return formatDate(date)
}
