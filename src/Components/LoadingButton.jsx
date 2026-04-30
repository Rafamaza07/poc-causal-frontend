import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'

/**
 * Botón con estado loading + success integrado.
 * onClick debe devolver una Promise. El éxito se muestra 1.8s y vuelve a idle.
 *
 * Props:
 *   onClick    — async function que lanza la acción
 *   children   — label en estado idle
 *   loadingLabel — label mientras carga (default: "Cargando…")
 *   successLabel — label al completar (default: "Listo")
 *   className  — clases adicionales (color, padding, etc.)
 *   disabled   — desactivado externo
 */
export default function LoadingButton({
  onClick,
  children,
  loadingLabel = 'Cargando…',
  successLabel = 'Listo',
  className = '',
  disabled = false,
  iconLeft,
  ...rest
}) {
  const [state, setState] = useState('idle') // 'idle' | 'loading' | 'success'

  const handle = async () => {
    if (state !== 'idle') return
    setState('loading')
    try {
      await onClick()
      setState('success')
      setTimeout(() => setState('idle'), 1800)
    } catch (err) {
      setState('idle')
      throw err
    }
  }

  const isLoading = state === 'loading'
  const isSuccess = state === 'success'

  return (
    <button
      {...rest}
      onClick={handle}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 ${className}`}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />}
      {isSuccess && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
      {!isLoading && !isSuccess && iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
      {isLoading ? loadingLabel : isSuccess ? successLabel : children}
    </button>
  )
}
