import { Check } from 'lucide-react'

export default function Stepper({ steps = [], currentStep }) {
  return (
    <div className="flex items-center w-full">
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
                  isCompleted ? 'bg-brand-600 text-white' :
                  isActive    ? 'bg-brand-600 text-white ring-4 ring-brand-100' :
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
                isCompleted ? 'bg-brand-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
