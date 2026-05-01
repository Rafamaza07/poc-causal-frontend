import { useState, useEffect, useRef } from 'react'

export default function useCountUp(target, { duration = 1400, decimals = 0 } = {}) {
  const [count, setCount] = useState(0)
  const fired = useRef(false)
  const elRef = useRef(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true
          const t0 = performance.now()
          const tick = (now) => {
            const p = Math.min((now - t0) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            const val = target * eased
            setCount(decimals > 0 ? +val.toFixed(decimals) : Math.round(val))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, decimals])

  return { count, ref: elRef }
}
