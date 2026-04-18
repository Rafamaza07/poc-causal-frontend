import { useEffect, useState, useCallback } from 'react'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'

const STEPS = [
  {
    target: '[data-tour="sidebar"]',
    title: 'Navegación principal',
    body: 'Desde aquí accedes a todas las secciones: evaluar casos, historial, alertas, analytics y más.',
    position: 'right',
  },
  {
    target: '[data-tour="nav-evaluar"]',
    title: 'Evalúa un caso',
    body: 'Haz clic aquí para abrir el wizard de 3 pasos. Puedes subir un PDF o ingresar los datos manualmente.',
    position: 'right',
  },
  {
    target: '[data-tour="bell"]',
    title: 'Alertas proactivas',
    body: 'El sistema monitorea automáticamente los hitos legales EPS/ARL/AFP (90, 120, 180 y 540 días) y te avisa aquí.',
    position: 'bottom',
  },
  {
    target: '[data-tour="dashboard-stats"]',
    title: 'KPIs de tu organización',
    body: 'Total de casos, score promedio, casos críticos y días de incapacidad promedio — actualizados en tiempo real.',
    position: 'bottom',
  },
  {
    target: '[data-tour="dashboard-hero"]',
    title: '¡Ya estás listo!',
    body: 'Evalúa tu primer caso para comenzar. Si tienes dudas, usa el Chat IA o consulta la sección Normativa.',
    position: 'bottom',
  },
]

const GAP = 12  // px entre el target y el tooltip

function getTooltipStyle(rect, position, tooltipW = 320, tooltipH = 160) {
  if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }

  const vw = window.innerWidth
  const vh = window.innerHeight

  let top, left

  if (position === 'right') {
    top  = rect.top + rect.height / 2 - tooltipH / 2
    left = rect.right + GAP
    if (left + tooltipW > vw - 8) left = rect.left - tooltipW - GAP
  } else if (position === 'left') {
    top  = rect.top + rect.height / 2 - tooltipH / 2
    left = rect.left - tooltipW - GAP
    if (left < 8) left = rect.right + GAP
  } else if (position === 'bottom') {
    top  = rect.bottom + GAP
    left = rect.left + rect.width / 2 - tooltipW / 2
    if (top + tooltipH > vh - 8) top = rect.top - tooltipH - GAP
  } else {
    top  = rect.top - tooltipH - GAP
    left = rect.left + rect.width / 2 - tooltipW / 2
    if (top < 8) top = rect.bottom + GAP
  }

  // clamp dentro de la viewport
  top  = Math.max(8, Math.min(top, vh - tooltipH - 8))
  left = Math.max(8, Math.min(left, vw - tooltipW - 8))

  return { position: 'fixed', top, left, width: tooltipW, zIndex: 9999 }
}

function getHighlightStyle(rect) {
  if (!rect) return null
  const PAD = 6
  return {
    position: 'fixed',
    top:    rect.top    - PAD,
    left:   rect.left   - PAD,
    width:  rect.width  + PAD * 2,
    height: rect.height + PAD * 2,
    borderRadius: 10,
    boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
    zIndex: 9998,
    pointerEvents: 'none',
    transition: 'all 0.25s ease',
  }
}

export default function OnboardingTour({ onDone }) {
  const [step, setStep]     = useState(0)
  const [rect, setRect]     = useState(null)

  const measureTarget = useCallback((idx) => {
    const el = document.querySelector(STEPS[idx]?.target)
    if (el) {
      setRect(el.getBoundingClientRect())
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    } else {
      setRect(null)
    }
  }, [])

  useEffect(() => {
    measureTarget(step)
    const onResize = () => measureTarget(step)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [step, measureTarget])

  const finish = () => {
    localStorage.setItem('tour_done', '1')
    onDone()
  }

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else finish()
  }

  const prev = () => setStep(s => Math.max(0, s - 1))

  const current = STEPS[step]
  const tooltipStyle = getTooltipStyle(rect, current.position)
  const highlightStyle = getHighlightStyle(rect)

  return (
    <>
      {/* Overlay con recorte */}
      {highlightStyle && <div style={highlightStyle} />}

      {/* Fallback overlay si no encontró el target */}
      {!highlightStyle && (
        <div className="fixed inset-0 bg-black/55 z-[9998]" />
      )}

      {/* Tooltip */}
      <div style={tooltipStyle} className="animate-scale-in">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-3">

          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-0.5">
                Paso {step + 1} de {STEPS.length}
              </p>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug">
                {current.title}
              </h3>
            </div>
            <button onClick={finish}
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {current.body}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            {/* Dots */}
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i}
                  className={`rounded-full transition-all duration-200 ${
                    i === step
                      ? 'w-4 h-1.5 bg-brand-600'
                      : 'w-1.5 h-1.5 bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              {step > 0 && (
                <button onClick={prev}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Anterior
                </button>
              )}
              {step === 0 && (
                <button onClick={finish}
                  className="text-xs text-gray-400 hover:text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  Saltar
                </button>
              )}
              <button onClick={next}
                className="flex items-center gap-1 text-xs bg-brand-600 hover:bg-brand-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors">
                {step < STEPS.length - 1
                  ? <><span>Siguiente</span><ArrowRight className="w-3 h-3" /></>
                  : <span>¡Listo!</span>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
