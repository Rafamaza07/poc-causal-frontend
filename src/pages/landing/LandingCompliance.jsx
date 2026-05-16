import { Shield, Eye, Lock, FileSearch, ArrowRight } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useTheme } from '../../hooks/useTheme'
import { trackEvent } from '../../utils/analytics'

const PILLARS = [
  {
    icon: Shield,
    title: 'Seguridad de datos',
    desc: 'Datos de salud almacenados con aislamiento por tenant. Sin commingling entre clientes. Acceso con JWT y roles granulares.',
    color: 'text-violet-500',
    bg: { light: 'rgba(124,58,237,0.08)', dark: 'rgba(124,58,237,0.12)' },
  },
  {
    icon: Eye,
    title: 'Cumplimiento Ley 1581',
    desc: 'Consentimiento informado por caso (Art. 9). Gestión de derechos ARCO. Responsable del tratamiento definido por tenant.',
    color: 'text-blue-500',
    bg: { light: 'rgba(37,99,235,0.08)', dark: 'rgba(37,99,235,0.12)' },
  },
  {
    icon: Lock,
    title: 'Privacidad de tratamiento',
    desc: 'Datos clínicos nunca usados para entrenar modelos externos. Política de retención configurable. Sin transferencias a terceros no autorizados.',
    color: 'text-emerald-500',
    bg: { light: 'rgba(5,150,105,0.08)', dark: 'rgba(5,150,105,0.12)' },
  },
  {
    icon: FileSearch,
    title: 'Auditabilidad completa',
    desc: 'Log inmutable de cada evaluación con usuario, timestamp, normativa aplicada y score. Exportable para auditorías externas o entes de control.',
    color: 'text-orange-500',
    bg: { light: 'rgba(234,88,12,0.08)', dark: 'rgba(234,88,12,0.12)' },
  },
]

export default function LandingCompliance() {
  const { dark } = useTheme()
  const ref = useScrollReveal({ threshold: 0.08, delay: 0 })

  return (
    <section
      className="py-24 px-4 border-b"
      style={{
        background: dark
          ? 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
        borderColor: dark ? 'rgba(30,41,59,0.8)' : 'rgba(219,228,255,0.8)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Seguridad y cumplimiento
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Construido para entornos regulados
          </h2>
          <p className={`max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            EPS, ARL y empleadores manejan datos sensibles de salud. KausalIA está diseñado para ese entorno desde el primer commit.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {PILLARS.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="flex gap-4 p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: dark ? '#1f2937' : '#ffffff',
                borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)',
                boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = dark ? '0 10px 32px rgba(0,0,0,0.3)' : '0 10px 32px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: dark ? bg.dark : bg.light }}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <h3 className={`font-semibold mb-1.5 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Due diligence CTA */}
        <div
          className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 border"
          style={{
            background: dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.04)',
            borderColor: dark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)',
          }}
        >
          <div className="flex-1">
            <h3 className={`font-bold text-lg mb-1.5 ${dark ? 'text-white' : 'text-gray-900'}`}>
              ¿Necesitas más detalles para due diligence?
            </h3>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Tenemos documentación técnica, políticas de privacidad y podemos agendar una revisión con tu equipo de TI o Legal.
            </p>
          </div>
          <a
            href="mailto:rafamaza56@gmail.com?subject=Due diligence KausalIA"
            onClick={() => trackEvent('landing_final_cta_click', { cta: 'due_diligence' })}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm whitespace-nowrap"
            style={{ boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
          >
            Hablar con ventas <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
