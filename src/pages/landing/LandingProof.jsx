import { TrendingDown, ShieldCheck, Layers } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import useCountUp from '../../hooks/useCountUp'
import { useTheme } from '../../hooks/useTheme'

const METRICS = [
  {
    target: 2, prefix: '< ', suffix: 's',
    label: 'Por evaluación completa',
    sub: 'vs. 4-6 horas manual',
    icon: TrendingDown,
    iconBg:   { light: '#ecfdf5', dark: 'rgba(5,150,105,0.15)' },
    iconColor: 'text-emerald-600',
    border:   { light: '#d1fae5', dark: 'rgba(5,150,105,0.25)' },
    pillBg:   { light: '#d1fae5', dark: 'rgba(5,150,105,0.2)' },
    pillText: { light: '#065f46', dark: '#6ee7b7' },
    duration: 800,
  },
  {
    target: 100, prefix: '', suffix: '%',
    label: 'Trazabilidad legal',
    sub: 'Decreto 1507 · Ley 776 · Ley 100',
    icon: ShieldCheck,
    iconBg:   { light: '#eff6ff', dark: 'rgba(37,99,235,0.15)' },
    iconColor: 'text-blue-600',
    border:   { light: '#bfdbfe', dark: 'rgba(37,99,235,0.25)' },
    pillBg:   { light: '#bfdbfe', dark: 'rgba(37,99,235,0.2)' },
    pillText: { light: '#1e40af', dark: '#93c5fd' },
    duration: 1400,
  },
  {
    target: 6, prefix: '', suffix: '',
    label: 'Módulos integrados',
    sub: 'Evaluación · Alertas · Docs · Analytics · Normativa · Portal',
    icon: Layers,
    iconBg:   { light: '#faf5ff', dark: 'rgba(124,58,237,0.15)' },
    iconColor: 'text-purple-600',
    border:   { light: '#e9d5ff', dark: 'rgba(124,58,237,0.25)' },
    pillBg:   { light: '#e9d5ff', dark: 'rgba(124,58,237,0.2)' },
    pillText: { light: '#6b21a8', dark: '#c4b5fd' },
    duration: 900,
  },
]

const TESTIMONIALS = [
  {
    quote: 'Antes tardábamos 3 días en dar respuesta a un trabajador. Con KausalIA el análisis inicial sale en segundos y ya viene con el sustento legal.',
    name: 'Carlos Mendoza',
    role: 'Médico Laboral · EPS Andina S.A.',
    initials: 'CM',
    avatarBg: 'bg-blue-600',
  },
  {
    quote: 'La calidad de los derechos de petición generados automáticamente es impresionante. Nos ahorró contratar un abogado extra para el volumen que manejamos.',
    name: 'Diana Ruiz',
    role: 'Coordinadora de RRHH · Constructora Bolívar',
    initials: 'DR',
    avatarBg: 'bg-purple-600',
  },
]

function MetricCard({ target, prefix, suffix, label, sub, icon: Icon, iconBg, iconColor, border, pillBg, pillText, duration, dark }) {
  const { count, ref } = useCountUp(target, { duration })

  return (
    <div
      ref={ref}
      className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: dark ? '#1f2937' : '#ffffff',
        border: `1px solid ${dark ? border.dark : border.light}`,
        boxShadow: dark
          ? '0 4px 6px rgba(0,0,0,0.2), 0 12px 32px rgba(0,0,0,0.25), 0 32px 72px rgba(0,0,0,0.15)'
          : '0 4px 6px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.08), 0 32px 72px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = dark
          ? '0 8px 16px rgba(0,0,0,0.3), 0 20px 48px rgba(0,0,0,0.35), 0 48px 96px rgba(0,0,0,0.2)'
          : '0 8px 16px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.12), 0 48px 96px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = dark
          ? '0 4px 6px rgba(0,0,0,0.2), 0 12px 32px rgba(0,0,0,0.25), 0 32px 72px rgba(0,0,0,0.15)'
          : '0 4px 6px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.08), 0 32px 72px rgba(0,0,0,0.04)'
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: dark ? iconBg.dark : iconBg.light }}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <div
          className="text-4xl font-extrabold tabular-nums mb-1"
          style={{ color: dark ? '#f9fafb' : '#111827' }}
        >
          {prefix}{count}{suffix}
        </div>
        <div
          className="text-sm font-semibold mb-2"
          style={{ color: dark ? '#e5e7eb' : '#1f2937' }}
        >
          {label}
        </div>
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: dark ? pillBg.dark : pillBg.light,
            color: dark ? pillText.dark : pillText.light,
          }}
        >
          {sub}
        </span>
      </div>
    </div>
  )
}

export default function LandingProof() {
  const { dark } = useTheme()
  const headRef = useScrollReveal({ threshold: 0.15, delay: 0 })
  const gridRef = useScrollReveal({ threshold: 0.1,  delay: 80 })
  const testRef = useScrollReveal({ threshold: 0.1,  delay: 160 })

  return (
    /*
     * Negative margin pulls this section UP over the hero's dark bottom padding.
     * The opaque background covers the hero cleanly — no color interpolation,
     * no dirty gray. The elevated card shadows create the floating depth effect.
     */
    <section
      className="px-4"
      style={{
        position: 'relative',
        zIndex: 10,
        marginTop: '-100px',
        paddingTop: '140px',
        paddingBottom: '96px',
        background: dark ? '#111827' : '#ffffff',
      }}
    >
      <div className="max-w-5xl mx-auto">

        <div ref={headRef} className="text-center mb-14">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.12em] mb-3"
            style={{ color: dark ? '#6b7280' : '#9ca3af' }}
          >
            Resultados reales
          </p>
          <h2
            className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight mb-3"
            style={{ color: dark ? '#f9fafb' : '#111827' }}
          >
            Números que importan
          </h2>
          <p
            className="max-w-xl mx-auto text-[15px]"
            style={{ color: dark ? '#9ca3af' : '#6b7280' }}
          >
            Resultados medidos en producción con clientes reales en Colombia.
          </p>
        </div>

        {/* Metric cards — float above the dark hero via box-shadow depth */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {METRICS.map((m) => <MetricCard key={m.label} {...m} dark={dark} />)}
        </div>

        {/* Testimonials */}
        <div ref={testRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TESTIMONIALS.map(({ quote, name, role, initials, avatarBg }) => (
            <div
              key={name}
              className="rounded-2xl p-6 flex flex-col gap-4 border"
              style={{
                background: dark ? '#1f2937' : '#f9fafb',
                borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)',
              }}
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p
                className="text-[15px] leading-relaxed flex-1"
                style={{ color: dark ? '#d1d5db' : '#374151' }}
              >
                "{quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarBg}`}>
                  {initials}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: dark ? '#f3f4f6' : '#111827' }}
                  >
                    {name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: dark ? '#9ca3af' : '#9ca3af' }}
                  >
                    {role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
