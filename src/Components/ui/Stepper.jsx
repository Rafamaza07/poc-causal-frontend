import { Check } from 'lucide-react'

/**
 * Stepper — indicador visual de paso actual (UI-8: barra de progreso % añadida).
 * Props: steps, currentStep.
 */
export default function Stepper({ steps = [], currentStep }) {
  const pct = steps.length > 1
    ? Math.round((currentStep / (steps.length - 1)) * 100)
    : 0

  return (
    <div className="space-y-3">
      {/* Barra de progreso global (UI-8) */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span className="font-medium">Paso {currentStep + 1} de {steps.length}</span>
        <span className="font-semibold text-violet-700">{pct}% completado</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stepper círculos */}
      <div className="flex items-center w-full pt-1">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isActive    = idx === currentStep
          const isLast      = idx === steps.length - 1

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200',
                    isCompleted ? 'bg-violet-600 text-white' :
                    isActive    ? 'bg-violet-600 text-white ring-4 ring-violet-100' :
                                  'bg-gray-200 text-gray-400',
                  ].join(' ')}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={[
                  'mt-1.5 text-xs whitespace-nowrap',
                  isActive    ? 'font-semibold text-gray-900' :
                  isCompleted ? 'text-gray-600' : 'text-gray-400',
                ].join(' ')}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors duration-200 ${
                  isCompleted ? 'bg-violet-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
