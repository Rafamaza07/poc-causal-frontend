const VARIANTS = {
  primary: [
    'bg-gradient-to-b from-brand-500 to-brand-600 text-white border-transparent',
    'hover:from-brand-400 hover:to-brand-500 active:from-brand-700 active:to-brand-600',
    'shadow-sm hover:shadow-md disabled:from-brand-300 disabled:to-brand-300',
  ].join(' '),
  secondary: [
    'bg-white text-gray-700 border border-gray-200',
    'hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100',
    'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
    'dark:hover:bg-gray-700 dark:hover:border-gray-600',
    'shadow-sm',
  ].join(' '),
  danger: [
    'bg-gradient-to-b from-red-500 to-red-600 text-white border-transparent',
    'hover:from-red-400 hover:to-red-500 active:from-red-700 active:to-red-600',
    'shadow-sm hover:shadow-md disabled:from-red-300 disabled:to-red-300',
  ].join(' '),
  ghost: [
    'bg-transparent text-gray-600 border-transparent',
    'hover:bg-gray-100 hover:text-gray-800',
    'dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200',
  ].join(' '),
}

const SIZES = {
  sm: 'h-8 text-xs px-3 gap-1.5',
  md: 'h-10 text-sm px-4 gap-2',
  lg: 'h-12 text-base px-6 gap-2.5',
}

const ICON_SIZES = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' }

function Spinner({ size }) {
  return (
    <svg className={`animate-spin ${ICON_SIZES[size]}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  children,
  type = 'button',
  className = '',
}) {
  const isDisabled = disabled || loading
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium rounded-lg border',
        'transition-all duration-150 ease-out active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1',
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {loading && <Spinner size={size} />}
      {!loading && Icon && iconPosition === 'left' && <Icon className={ICON_SIZES[size]} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className={ICON_SIZES[size]} />}
    </button>
  )
}
