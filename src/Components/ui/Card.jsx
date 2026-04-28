const VARIANTS = {
  default:  'bg-white border border-gray-100 shadow-card dark:bg-gray-900 dark:border-gray-800',
  elevated: 'bg-white border border-gray-100 shadow-lifted dark:bg-gray-900 dark:border-gray-800',
  outlined: 'bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700',
  flat:     'bg-gray-50 dark:bg-gray-800/50',
}

const PADDING = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
}

export default function Card({
  variant = 'default',
  padding = 'md',
  onClick,
  className = '',
  children,
}) {
  const interactive = !!onClick
  return (
    <div
      onClick={onClick}
      className={[
        'rounded-xl transition-all duration-200',
        VARIANTS[variant],
        PADDING[padding],
        interactive ? 'cursor-pointer hover:shadow-elevated hover:-translate-y-0.5' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
