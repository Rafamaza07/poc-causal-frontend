import axios from 'axios'
import { handleUnauthorized } from '../services/authRefresh'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true, // envía y recibe cookies HttpOnly
})

API.interceptors.request.use((config) => {
  // El access_token viaja en cookie HttpOnly — no se leen desde JS.
  // Para endpoints que aún necesiten Bearer (compat. con versiones antiguas),
  // se usa el token en memoria expuesto por authRefresh si está disponible.
  const memToken = window.__kausalia_mem_token__
  if (memToken) config.headers.Authorization = `Bearer ${memToken}`
  config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const url    = err.config?.url || ''
    if (status === 401 && !url.includes('/api/auth/refresh')) {
      return handleUnauthorized(err.config, API)
    }
    return Promise.reject(err)
  }
)

export default API

export const getGrafoCausalCaso = (idCaso) =>
  API.get(`/api/casos/${idCaso}/grafo-causal`).then((r) => r.data)
