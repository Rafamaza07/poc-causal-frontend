import { useState, useCallback } from 'react'
import api from '../services/api'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const request = useCallback(async (method, url, data = null, config = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api[method](url, data, config)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Error inesperado'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const get  = useCallback((url, config) => request('get', url, null, config), [request])
  const post = useCallback((url, data, config) => request('post', url, data, config), [request])
  const put  = useCallback((url, data, config) => request('put', url, data, config), [request])
  const patch = useCallback((url, data, config) => request('patch', url, data, config), [request])

  return { loading, error, get, post, put, patch }
}
