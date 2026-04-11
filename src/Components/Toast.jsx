import { createContext, useCallback, useContext, useState } from 'react'
import { Check, X, Info, AlertTriangle } from 'lucide-react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration)
  }, [])

  const STYLES = {
    success: 'bg-emerald-600',
    error:   'bg-red-600',
    info:    'bg-sidebar',
    warning: 'bg-amber-600',
  }
  const ICONS = { success: Check, error: X, info: Info, warning: AlertTriangle }

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[100] pointer-events-none">
        {toasts.map(t => {
          const Icon = ICONS[t.type] || ICONS.info
          return (
            <div key={t.id}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lifted text-sm font-medium text-white
                ${STYLES[t.type] || STYLES.info} animate-slide-up`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {t.msg}
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
