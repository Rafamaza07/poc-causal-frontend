function Pulse({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
}

export default function LoadingSkeleton({ variant = 'text', count = 1, className = '' }) {
  if (variant === 'text') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <Pulse key={i} className="h-4 w-full" />
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <Pulse key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (variant === 'avatar') {
    return (
      <div className={`flex gap-3 items-center ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <Pulse key={i} className="w-10 h-10 rounded-full flex-shrink-0" />
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <Pulse key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return <Pulse className={className} />
}
