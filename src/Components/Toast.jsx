import { createContext, useCallback, useContext, useState } from 'react'
import { Check, X, Info, AlertTriangle } from 'lucide-react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const toast = useCallback((msg, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  const STYLES = {
    success: 'bg-emerald-600',
    error:   'bg-red-600',
    info:    'bg-sidebar',
    warning: 'bg-amber-500',
  }
  const ICONS = { success: Check, error: X, info: Info, warning: AlertTriangle }

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed top-5 right-5 flex flex-col gap-2 z-[100] pointer-events-none">
        {toasts.map(t => {
          const Icon = ICONS[t.type] || ICONS.info
          return (
            <div
              key={t.id}
              className={[
                'flex items-center gap-2.5 pl-4 pr-3 py-3 rounded-xl shadow-elevated',
                'text-sm font-medium text-white min-w-[220px] max-w-sm pointer-events-auto',
                STYLES[t.type] || STYLES.info,
                'animate-slide-down',
              ].join(' ')}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{t.msg}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="w-5 h-5 flex items-center justify-center rounded opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
