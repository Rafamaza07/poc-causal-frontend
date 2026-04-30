import { useState, useEffect, useCallback } from 'react'
import API from '../api/client'
import { normalizeAlerts, normalizeAlertSummary } from '../api/adapters'

export function useAlerts({ autoRefresh = false, intervalMs = 30000 } = {}) {
  const [alerts, setAlerts]   = useState([])
  const [count, setCount]     = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const [summaryRes, alertsRes] = await Promise.allSettled([
        API.get('/api/v1/alerts/summary'),
        API.get('/api/v1/alerts?limit=20&severity=CRITICAL'),
      ])
      if (summaryRes.status === 'fulfilled') {
        setCount(normalizeAlertSummary(summaryRes.value.data).total_pending)
      }
      if (alertsRes.status === 'fulfilled') {
        setAlerts(normalizeAlerts(alertsRes.value.data))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlerts()
    if (!autoRefresh) return
    const id = setInterval(fetchAlerts, intervalMs)
    return () => clearInterval(id)
  }, [fetchAlerts, autoRefresh, intervalMs])

  const acknowledge = useCallback(async (alertId) => {
    await API.post(`/api/v1/alerts/${alertId}/acknowledge`)
    setAlerts(prev => prev.filter(a => a.id !== alertId))
    setCount(prev => Math.max(0, prev - 1))
  }, [])

  return { alerts, count, loading, refresh: fetchAlerts, acknowledge }
}
