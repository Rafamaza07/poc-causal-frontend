import { useEffect, useRef } from 'react'
import { Shield, Eye, Lock, Users, Scale, Database } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { trackEvent } from '../../utils/analytics'

const CHIPS = [
  { icon: Shield,   label: 'Cumplimiento Ley 1581',        sub: 'Habeas Data Colombia' },
  { icon: Database, label: 'Trazabilidad por tenant',       sub: 'Datos aislados por cliente' },
  { icon: Eye,      label: 'Historial inmutable por caso',  sub: 'Auditoría completa' },
  { icon: Users,    label: 'Control de acceso por rol',     sub: 'Médico · Legal · Admin' },
  { icon: Scale,    label: 'RAG normativo vigente',         sub: 'Ley 100 · D.1507 · Ley 776' },
  { icon: Lock,     label: 'Consentimiento Ley 1581 Art. 9', sub: 'Gestión de titulares' },
]

export default function LandingTrustBar() {
  const { dark } = useTheme()
  const ref = useRef(null)
  const fired = useRef(false)

  useEffect(() => {
    if (!ref.current || fired.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        trackEvent('landing_trust_view')
        fired.current = true
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-10 px-4 border-b"
      style={{
        background: dark ? '#0f172a' : '#f8faff',
        borderColor: dark ? 'rgba(30,41,59,1)' : 'rgba(219,228,255,0.8)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <p className={`text-center text-[10px] font-bold uppercase tracking-[0.14em] mb-6 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
          Seguridad y cumplimiento normativo
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {CHIPS.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: dark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(209,213,219,0.8)',
                boxShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)' }}
              >
                <Icon className="w-3 h-3 text-violet-500" />
              </div>
              <div>
                <span className={`text-xs font-semibold leading-none ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {label}
                </span>
                <span className={`block text-[10px] leading-tight mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
