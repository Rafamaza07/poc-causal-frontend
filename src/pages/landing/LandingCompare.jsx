import { CheckCircle, XCircle } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useTheme } from '../../hooks/useTheme'

const ROWS = [
  { label: 'Tiempo de cierre del caso completo', manual: '6–18 meses',              kausal: 'Días a semanas' },
  { label: 'Tiempo de evaluación por caso',      manual: '3–5 días hábiles',        kausal: '< 2 segundos' },
  { label: 'Consistencia médico-legal',          manual: 'Varía por profesional',   kausal: 'Criterio IA estandarizado' },
  { label: 'Evidencia para auditoría',           manual: 'Documentos dispersos',    kausal: 'Historial inmutable por caso' },
  { label: 'Detección de vacíos documentales',   manual: 'Solo al momento de litigio', kausal: 'Alerta proactiva antes de que cueste' },
  { label: 'Seguimiento SLA / hitos legales',    manual: 'Manual o sin seguimiento', kausal: 'Alertas 90/120/180/540 días' },
  { label: 'Sustento normativo',                 manual: 'Revisión manual de normas', kausal: 'Ley 100, D.1507, Ley 776 automático' },
]

export default function LandingCompare() {
  const { dark } = useTheme()
  const ref = useScrollReveal({ threshold: 0.08, delay: 0 })

  return (
    <section
      className="py-24 px-4 border-b"
      style={{
        background: dark ? '#111827' : '#ffffff',
        borderColor: dark ? 'rgba(55,65,81,0.6)' : 'rgba(229,231,235,0.8)',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Comparativa
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Proceso manual vs. KausalIA
          </h2>
          <p className={`max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Las mismas decisiones médico-legales, con y sin automatización.
          </p>
        </div>

        <div
          ref={ref}
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)',
            boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-3 border-b"
            style={{
              background: dark ? '#1f2937' : '#f9fafb',
              borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)',
            }}
          >
            <div className="px-5 py-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Criterio
              </span>
            </div>
            <div className="px-5 py-4 border-l" style={{ borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)' }}>
              <span className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Proceso manual
              </span>
            </div>
            <div
              className="px-5 py-4 border-l"
              style={{
                borderColor: dark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)',
                background: dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.04)',
              }}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
                KausalIA
              </span>
            </div>
          </div>

          {/* Rows */}
          {ROWS.map(({ label, manual, kausal }, i) => (
            <div
              key={label}
              className="grid grid-cols-3 border-b last:border-b-0 transition-colors"
              style={{
                borderColor: dark ? 'rgba(55,65,81,0.5)' : 'rgba(243,244,246,1)',
                background: i % 2 === 0 ? 'transparent' : (dark ? 'rgba(255,255,255,0.015)' : 'rgba(248,250,255,0.5)'),
              }}
            >
              <div className="px-5 py-4 flex items-center">
                <span className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
              </div>
              <div
                className="px-5 py-4 flex items-center gap-2.5 border-l"
                style={{ borderColor: dark ? 'rgba(55,65,81,0.5)' : 'rgba(243,244,246,1)' }}
              >
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{manual}</span>
              </div>
              <div
                className="px-5 py-4 flex items-center gap-2.5 border-l"
                style={{
                  borderColor: dark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)',
                  background: dark ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.03)',
                }}
              >
                <CheckCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />
                <span className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{kausal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
