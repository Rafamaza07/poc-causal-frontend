import API from '../api/client'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

/**
 * Registra el service worker, pide permiso de notificaciones y suscribe
 * al usuario al push backend.  Degrada silenciosamente si:
 *   - El navegador no soporta SW / PushManager
 *   - El usuario deniega el permiso
 *   - VAPID no está configurado en el backend (503)
 */
export async function registerAndSubscribe() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  try {
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') return

    const reg = await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready

    const existing = await reg.pushManager.getSubscription()
    if (existing) return  // ya suscrito en este dispositivo

    const { data } = await API.get('/api/push/vapid-public-key')
    const appServerKey = urlBase64ToUint8Array(data.key)

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: appServerKey,
    })

    const json = sub.toJSON()
    await API.post('/api/push/subscribe', {
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    })
  } catch (e) {
    console.warn('[push] setup failed:', e)
  }
}
