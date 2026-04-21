export default function BrandName({ className = '' }) {
  return (
    <span className={className}>
      Kausal<span
        style={{
          background: 'linear-gradient(135deg,#0E1A44 0%,#1E3A8A 50%,#3B7BD9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >IA</span>
    </span>
  )
}
