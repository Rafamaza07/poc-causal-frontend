/**
 * Full KausalIA wordmark — "Kausal" + custom-i SVG + "A" with brand gradient.
 * Props:
 *   size   — font size in px (default 40)
 *   dark   — white/light gradient + white outline for dark backgrounds (default false)
 */
export default function KausalIALogo({ size = 40, dark = false }) {
  const kColor = dark ? '#ffffff' : '#2B2F36'

  const g = dark
    ? { start: '#ffffff', mid: '#bfdbfe', end: '#93c5fd' }
    : { start: '#0E1A44', mid: '#1E3A8A', end: '#3B7BD9' }

  const wrapperStyle = {
    display: 'inline-flex',
    alignItems: 'baseline',
    fontFamily: '"Inter","Helvetica Neue",Helvetica,Arial,sans-serif',
    fontWeight: 600,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: '-0.047em',
    color: kColor,
    userSelect: 'none',
    ...(dark && {
      filter:
        'drop-shadow(0 0 1px rgba(255,255,255,0.9)) ' +
        'drop-shadow(0 0 6px rgba(255,255,255,0.25))',
    }),
  }

  return (
    <span style={wrapperStyle}>
      <span>Kausal</span>
      <svg
        style={{ width: '0.34em', height: '1em', display: 'inline-block', verticalAlign: 'baseline', margin: '0 -0.02em', overflow: 'visible' }}
        viewBox="0 0 34 100"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="kia-i-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%"   stopColor={g.start}/>
            <stop offset="50%"  stopColor={g.mid}/>
            <stop offset="100%" stopColor={g.end}/>
          </linearGradient>
        </defs>
        <g fill="url(#kia-i-grad)">
          <circle cx="17" cy="20" r="7"/>
          <rect x="14" y="34" width="6" height="48" rx="1"/>
          <path d="M17 82 L9 92"  stroke="url(#kia-i-grad)" strokeWidth="4" strokeLinecap="round"/>
          <path d="M17 82 L25 92" stroke="url(#kia-i-grad)" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="17" cy="95" r="7"/>
        </g>
      </svg>
      <span style={{
        background: `linear-gradient(135deg,${g.start} 0%,${g.mid} 50%,${g.end} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>A</span>
    </span>
  )
}
