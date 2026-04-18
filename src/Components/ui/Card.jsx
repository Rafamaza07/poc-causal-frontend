const VARIANTS = {
  default:  'bg-white border border-gray-100 shadow-card',
  elevated: 'bg-white border border-gray-100 shadow-lifted',
  outlined: 'bg-white border border-gray-200',
  flat:     'bg-gray-50',
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
        interactive ? 'cursor-pointer hover:shadow-lifted' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
