export default function AlertBadge({ count, className = '' }) {
  if (!count || count === 0) return null
  return (
    <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full leading-none animate-scale-in ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  )
}
