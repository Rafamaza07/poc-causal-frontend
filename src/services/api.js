import axios from 'axios'
import { handleUnauthorized } from './authRefresh'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const url    = err.config?.url || ''
    if (status === 401 && !url.includes('/api/auth/refresh')) {
      return handleUnauthorized(err.config, api)
    }
    return Promise.reject(err)
  }
)

export default api
