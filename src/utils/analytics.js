/** Wrapper mínimo de eventos de analytics — sin dependencias nuevas. */

export function trackEvent(name, props = {}) {
  try {
    if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...props })
    }
  } catch {
    // silencioso — no bloquear UX
  }
}
