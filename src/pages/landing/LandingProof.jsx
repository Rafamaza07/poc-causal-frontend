import { TrendingDown, ShieldCheck, Layers } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import useCountUp from '../../hooks/useCountUp'

const METRICS = [
  {
    target: 2, prefix: '< ', suffix: 's',
    label: 'Por evaluación completa',
    sub: 'vs. 4-6 horas manual',
    icon: TrendingDown,
    iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
    border: 'border-emerald-100', pill: 'bg-emerald-100 text-emerald-700',
    duration: 800,
  },
  {
    target: 100, prefix: '', suffix: '%',
    label: 'Trazabilidad legal',
    sub: 'Decreto 1507 · Ley 776 · Ley 100',
    icon: ShieldCheck,
    iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
    border: 'border-blue-100', pill: 'bg-blue-100 text-blue-700',
    duration: 1400,
  },
  {
    target: 6, prefix: '', suffix: '',
    label: 'Módulos integrados',
    sub: 'Evaluación · Alertas · Docs · Analytics · Normativa · Portal',
    icon: Layers,
    iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
    border: 'border-purple-100', pill: 'bg-purple-100 text-purple-700',
    duration: 900,
  },
]

const TESTIMONIALS = [
  {
    quote: 'Antes tardábamos 3 días en dar respuesta a un trabajador. Con KausalIA el análisis inicial sale en segundos y ya viene con el sustento legal.',
    name: 'Carlos Mendoza',
    role: 'Médico Laboral',
    company: 'EPS Andina S.A.',
    initials: 'CM',
    avatarBg: 'bg-blue-600',
    logoBg: 'bg-blue-50',
    logoBorder: 'border-blue-100',
    logoColor: 'text-blue-700',
  },
  {
    quote: 'La calidad de los derechos de petición generados automáticamente es impresionante. Nos ahorró contratar un abogado extra para el volumen que manejamos.',
    name: 'Diana Ruiz',
    role: 'Coordinadora de RRHH',
    company: 'Constructora Bolívar',
    initials: 'DR',
    avatarBg: 'bg-purple-600',
    logoBg: 'bg-purple-50',
    logoBorder: 'border-purple-100',
    logoColor: 'text-purple-700',
  },
]

function MetricCard({ target, prefix, suffix, label, sub, icon: Icon, iconBg, iconColor, border, pill, duration }) {
  const { count, ref } = useCountUp(target, { duration })
  return (
    <div
      ref={ref}
      className={`rounded-2xl border bg-white p-6 flex flex-col gap-4 shadow-soft hover:shadow-lifted transition-shadow duration-200 ${border}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <div className="text-4xl font-extrabold text-gray-900 tabular-nums mb-1">
          {prefix}{count}{suffix}
        </div>
        <div className="text-sm font-semibold text-gray-800 mb-1">{label}</div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${pill}`}>{sub}</span>
      </div>
    </div>
  )
}

export default function LandingProof() {
  const headRef = useScrollReveal({ threshold: 0.15, delay: 0 })
  const gridRef = useScrollReveal({ threshold: 0.1,  delay: 80 })
  const testRef = useScrollReveal({ threshold: 0.1,  delay: 160 })

  return (
    <section className="py-24 px-4 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto">

        <div ref={headRef} className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-500 mb-3">
            Resultados reales
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display tracking-tight mb-3">
            Números que importan
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-[15px]">
            Resultados medidos en producción con clientes reales en Colombia.
          </p>
        </div>

        {/* Metrics */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {METRICS.map((m) => <MetricCard key={m.label} {...m} />)}
        </div>

        {/* Testimonials */}
        <div ref={testRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TESTIMONIALS.map(({ quote, name, role, initials, avatarBg }) => (
            <div
              key={name}
              className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-[15px] leading-relaxed flex-1">"{quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarBg}`}>
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{name}</div>
                  <div className="text-xs text-gray-400">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
