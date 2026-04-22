/**
 * Shared JWT refresh logic for both axios instances.
 * Uses a queue to avoid parallel refresh attempts.
 */

let _isRefreshing = false
let _failedQueue  = []

function processQueue(error, token = null) {
  _failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  _failedQueue = []
}

function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

/**
 * Call from a response interceptor on 401.
 * Returns the new access_token string, or throws if refresh failed.
 */
export async function handleUnauthorized(originalRequest, axiosInstance) {
  const refreshToken = localStorage.getItem('refresh_token')

  if (!refreshToken) {
    clearSession()
    return Promise.reject(new Error('No refresh token'))
  }

  if (_isRefreshing) {
    return new Promise((resolve, reject) => {
      _failedQueue.push({ resolve, reject })
    }).then((token) => {
      originalRequest.headers.Authorization = `Bearer ${token}`
      return axiosInstance(originalRequest)
    })
  }

  _isRefreshing = true

  try {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const resp = await fetch(`${baseURL}/api/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!resp.ok) throw new Error('Refresh failed')

    const data  = await resp.json()
    const token = data.access_token
    localStorage.setItem('token', token)
    processQueue(null, token)
    originalRequest.headers.Authorization = `Bearer ${token}`
    return axiosInstance(originalRequest)
  } catch (err) {
    processQueue(err, null)
    clearSession()
    return Promise.reject(err)
  } finally {
    _isRefreshing = false
  }
}
