export default function BrandName({ className = '', dark = false }) {
  const g = dark
    ? 'linear-gradient(135deg,#ffffff 0%,#bfdbfe 50%,#93c5fd 100%)'
    : 'linear-gradient(135deg,#0E1A44 0%,#1E3A8A 50%,#3B7BD9 100%)'

  return (
    <span
      className={className}
      style={dark ? {
        filter:
          'drop-shadow(0 0 1px rgba(255,255,255,0.9)) ' +
          'drop-shadow(0 0 6px rgba(255,255,255,0.25))',
      } : undefined}
    >
      Kausal<span style={{
        background: g,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>IA</span>
    </span>
  )
}
