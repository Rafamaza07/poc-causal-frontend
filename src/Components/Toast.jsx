import { createContext, useCallback, useContext, useState } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration)
  }, [])

  const STYLES = {
    success: 'bg-green-600',
    error:   'bg-red-600',
    info:    'bg-slate-700',
    warning: 'bg-amber-600',
  }
  const ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' }

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[100] pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white
              ${STYLES[t.type] || STYLES.info} animate-fade-in`}>
            <span className="text-base leading-none">{ICONS[t.type]}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
