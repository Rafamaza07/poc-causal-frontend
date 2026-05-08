import { useState, useEffect } from 'react'

const systemIsDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches

export function useTheme() {
  const [mode, setModeState] = useState(
    () => localStorage.getItem('theme') ?? 'dark'
  )

  useEffect(() => {
    const apply = (isDark) => document.documentElement.classList.toggle('dark', isDark)

    if (mode === 'dark')  { apply(true);  localStorage.setItem('theme', mode); return }
    if (mode === 'light') { apply(false); localStorage.setItem('theme', mode); return }

    // system — follow OS preference + watch changes
    apply(systemIsDark())
    localStorage.setItem('theme', mode)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => apply(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  const setMode = (m) => setModeState(m)
  const dark = mode === 'dark' || (mode === 'system' && systemIsDark())

  return { dark, mode, setMode }
}
