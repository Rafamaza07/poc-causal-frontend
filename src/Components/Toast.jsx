import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const ToastCtx = createContext(null)

const BORDER = {
  success: '#22c55e',
  error:   '#ef4444',
  warning: '#f59e0b',
  info:    '#3b82f6',
}

const ICON_COLOR = {
  success: 'text-emerald-400',
  error:   'text-red-400',
  warning: 'text-amber-400',
  info:    'text-blue-400',
}

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    // Mark as leaving first (triggers CSS exit)
    setToasts(t => t.map(x => x.id === id ? { ...x, leaving: true } : x))
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 320)
  }, [])

  const toast = useCallback((msg, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, msg, type, leaving: false }])
    setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 flex flex-col-reverse gap-2.5 z-[200] pointer-events-none">
        {toasts.map(t => {
          const Icon = ICONS[t.type] ?? ICONS.info
          return (
            <div
              key={t.id}
              style={{
                borderLeftColor: BORDER[t.type] ?? BORDER.info,
                opacity:    t.leaving ? 0 : 1,
                transform:  t.leaving ? 'translateY(8px)' : 'translateY(0)',
              }}
              className={[
                'flex items-start gap-3 w-[360px] max-w-[calc(100vw-2.5rem)]',
                'bg-gray-900/95 backdrop-blur-sm border border-white/10 border-l-[3px]',
                'rounded-xl px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)]',
                'pointer-events-auto',
                'transition-all duration-300 ease-out',
                !t.leaving && 'animate-slide-up',
              ].filter(Boolean).join(' ')}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 mt-0.5 ${ICON_COLOR[t.type] ?? ICON_COLOR.info}`} />
              <span className="flex-1 text-sm font-medium text-gray-100 leading-snug">{t.msg}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/10 transition-colors flex-shrink-0 -mr-1 -mt-0.5"
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

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastCtx)
