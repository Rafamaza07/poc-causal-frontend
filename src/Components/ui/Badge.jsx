const VARIANTS = {
  default:  'bg-gray-100 text-gray-700',
  brand:    'bg-brand-50 text-brand-700',
  success:  'bg-emerald-50 text-emerald-700',
  warning:  'bg-amber-50 text-amber-700',
  danger:   'bg-red-50 text-red-700',
  orange:   'bg-orange-50 text-orange-700',
  info:     'bg-blue-50 text-blue-700',
}

const SIZES = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
}

export default function Badge({ variant = 'default', size = 'md', children, className = '' }) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${VARIANTS[variant]} ${SIZES[size]} ${className}`}>
      {children}
    </span>
  )
}
