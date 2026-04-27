/* Service Worker — Web Push KausalIA (T3.4) */

self.addEventListener('push', event => {
  if (!event.data) return
  let data
  try {
    data = event.data.json()
  } catch {
    data = { title: 'KausalIA', body: event.data.text() }
  }

  const options = {
    body: data.body || '',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: { alerta_id: data.alerta_id },
    requireInteraction: true,
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'KausalIA — Alerta', options)
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(list => {
        if (list.length > 0) return list[0].focus()
        return clients.openWindow('/')
      })
  )
})
