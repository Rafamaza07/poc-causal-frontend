import { useEffect, useRef } from 'react'
import { Clock, BarChart2, ShieldOff } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useTheme } from '../../hooks/useTheme'
import { trackEvent } from '../../utils/analytics'

const KPIS = [
  {
    icon: Clock,
    before: '3–5 días',
    after: '< 2 segundos',
    label: 'Tiempo de evaluación por caso',
    detail: 'Del expediente manual al análisis causal automatizado.',
    accent: '#059669',
  },
  {
    icon: BarChart2,
    before: '~40 casos/mes',
    after: '200+ casos/mes',
    label: 'Casos cerrados por auditor',
    detail: 'Mayor capacidad operativa sin aumentar planta.',
    accent: '#2563eb',
  },
  {
    icon: ShieldOff,
    before: 'Sin trazabilidad',
    after: 'Historial inmutable',
    label: 'Riesgo de reproceso o disputa',
    detail: 'Cada decisión documentada con norma, usuario y fecha.',
    accent: '#7c3aed',
  },
]

export default function LandingROI() {
  const { dark } = useTheme()
  const ref = useScrollReveal({ threshold: 0.1, delay: 0 })
  const fired = useRef(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || fired.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        trackEvent('landing_roi_view')
        fired.current = true
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 border-b"
      style={{
        background: dark
          ? 'linear-gradient(180deg, #0f172a 0%, #111827 100%)'
          : 'linear-gradient(180deg, #f8faff 0%, #f0f4ff 100%)',
        borderColor: dark ? 'rgba(30,41,59,0.8)' : 'rgba(219,228,255,0.8)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            ROI en 6 meses
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Impacto operativo estimado
          </h2>
          <p className={`max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            El ciclo completo de un caso pasa de meses a días. Estos son los tres indicadores que los decisores de operaciones y legal revisan primero.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {KPIS.map(({ icon: Icon, before, after, label, detail, accent }) => (
            <div
              key={label}
              className="rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: dark ? '#1f2937' : '#ffffff',
                borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)',
                boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = dark ? '0 12px 36px rgba(0,0,0,0.35)' : '0 12px 36px rgba(0,0,0,0.09)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}18` }}>
                <Icon className="w-5 h-5" style={{ color: accent }} />
              </div>
              <div>
                <div className={`text-xs font-medium mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</div>
                <div className="flex items-end gap-3 mb-1">
                  <span className={`text-sm line-through ${dark ? 'text-gray-600' : 'text-gray-300'}`}>{before}</span>
                  <span className="text-2xl font-extrabold tabular-nums" style={{ color: accent }}>{after}</span>
                </div>
                <p className={`text-xs leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <p className={`text-center text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
          * Resultados estimados. Sujetos a madurez operativa y calidad de datos del cliente.
        </p>
      </div>
    </section>
  )
}
