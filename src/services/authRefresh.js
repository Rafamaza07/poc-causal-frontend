/**
 * Shared auth refresh logic — usa cookies HttpOnly.
 * El refresh_token viaja en cookie (no accesible desde JS).
 * Usa una cola para evitar múltiples refresh paralelos.
 */

let _isRefreshing = false
let _failedQueue  = []

function processQueue(error) {
  _failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()))
  _failedQueue = []
}

function clearSession() {
  // Limpiar solo datos no sensibles de sessionStorage/memoria
  delete window.__kausalia_mem_token__
  // Redirigir al login — el backend borrará las cookies al hacer logout
  window.location.href = '/login'
}

/**
 * Llama al endpoint de refresh cookie-based.
 * El refresh_token se envía automáticamente como cookie HttpOnly.
 * El nuevo access_token queda en cookie HttpOnly (no accesible desde JS).
 */
export async function handleUnauthorized(originalRequest, axiosInstance) {
  if (_isRefreshing) {
    return new Promise((resolve, reject) => {
      _failedQueue.push({ resolve, reject })
    }).then(() => axiosInstance(originalRequest))
      .catch((err) => Promise.reject(err))
  }

  _isRefreshing = true

  try {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const resp = await fetch(`${baseURL}/api/auth/refresh-cookie`, {
      method:      'POST',
      credentials: 'include', // incluye cookies HttpOnly en el request
      headers:     { 'Content-Type': 'application/json' },
    })

    if (!resp.ok) throw new Error('Refresh failed')

    processQueue(null)
    // Reintentar la request original — el nuevo access_token está en cookie
    return axiosInstance(originalRequest)
  } catch (err) {
    processQueue(err)
    clearSession()
    return Promise.reject(err)
  } finally {
    _isRefreshing = false
  }
}
