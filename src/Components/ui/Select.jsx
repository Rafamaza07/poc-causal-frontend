import { ChevronDown } from 'lucide-react'

export default function Select({
  label,
  error,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  disabled = false,
  className = '',
  ...rest
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={[
            'w-full h-10 rounded-lg border bg-white pl-3 pr-8 text-sm text-gray-900',
            'appearance-none transition-all duration-150 outline-none',
            'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
            error
              ? 'border-red-400 focus:ring-2 focus:ring-red-400/20 focus:border-red-500'
              : 'border-gray-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
          ].join(' ')}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
