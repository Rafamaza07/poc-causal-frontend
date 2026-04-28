const VARIANTS = {
  default: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200/70',
  brand:   'bg-brand-50 text-brand-700 ring-1 ring-brand-200/60',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60',
  danger:  'bg-red-50 text-red-700 ring-1 ring-red-200/60',
  orange:  'bg-orange-50 text-orange-700 ring-1 ring-orange-200/60',
  info:    'bg-blue-50 text-blue-700 ring-1 ring-blue-200/60',
}

const SIZES = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
}

const DOT_SIZES = { sm: 'w-1 h-1', md: 'w-1.5 h-1.5', lg: 'w-2 h-2' }

export default function Badge({ variant = 'default', size = 'md', dot = false, children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${VARIANTS[variant]} ${SIZES[size]} ${className}`}>
      {dot && <span className={`rounded-full bg-current opacity-70 flex-shrink-0 ${DOT_SIZES[size]}`} />}
      {children}
    </span>
  )
}
