import { useId, useState } from 'react'

/**
 * Tooltip accesible — soporta teclado (focus/blur) y aria-describedby (UI-7).
 * Props: content (string|node), placement (top|bottom|left|right), children.
 */
export default function Tooltip({ content, children, placement = 'top' }) {
  const [visible, setVisible] = useState(false)
  const tooltipId = useId()

  const PLACEMENT = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const show = () => setVisible(true)
  const hide = () => setVisible(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {/* Clonar el primer hijo para añadir aria-describedby sin wrapper extra */}
      <span aria-describedby={visible ? tooltipId : undefined}>
        {children}
      </span>
      {visible && content && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 pointer-events-none ${PLACEMENT[placement]}`}
        >
          <div className="px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900/95 dark:bg-gray-700 rounded-lg shadow-lg ring-1 ring-white/10 whitespace-nowrap animate-tooltip-in">
            {content}
          </div>
        </div>
      )}
    </div>
  )
}
