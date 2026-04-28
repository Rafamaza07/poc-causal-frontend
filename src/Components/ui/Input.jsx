const ICON_SIZE = 'w-4 h-4'

export default function Input({
  label,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
  ...rest
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Icon className={`${ICON_SIZE} text-gray-400`} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={[
            'w-full h-10 rounded-lg border bg-white px-3 text-sm text-gray-900',
            'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500',
            'transition-all duration-150 outline-none',
            'placeholder:text-gray-400',
            'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
            'dark:disabled:bg-gray-900 dark:disabled:text-gray-600',
            Icon ? 'pl-9' : '',
            error
              ? 'border-red-400 focus:ring-2 focus:ring-red-400/25 focus:border-red-500'
              : 'border-gray-200 focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/20',
          ].join(' ')}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
  )
}
