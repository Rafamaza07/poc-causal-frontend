import { useState } from 'react'
import { Building2, Stethoscope, User, ArrowRight, CheckCircle } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { trackEvent } from '../../utils/analytics'

const SEGMENTOS = [
  {
    key: 'empresa',
    tag: 'Tier 1 · Mayor prioridad',
    tagColor: 'text-brand-600 bg-brand-50 dark:bg-brand-900/40 dark:text-brand-300',
    icon: Building2,
    iconBg: 'bg-brand-100 dark:bg-brand-900/40',
    iconColor: 'text-brand-600 dark:text-brand-400',
    title: 'Soy una empresa grande',
    desc: 'Equipos de RRHH, SST, Jurídico y Medicina Laboral que gestionan volúmenes de incapacidades y necesitan reducir pasivos y tiempos.',
    cta: 'Solicitar demo corporativa',
    border: 'border-brand-200 dark:border-brand-800',
    bg: 'bg-brand-50/40 dark:bg-brand-900/10',
    ctaStyle: 'bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
    // Futura ruta: /empresas
  },
  {
    key: 'institucion',
    tag: 'Tier 2–3',
    tagColor: 'text-violet-600 bg-violet-50 dark:bg-violet-900/40 dark:text-violet-300',
    icon: Stethoscope,
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    iconColor: 'text-violet-600 dark:text-violet-400',
    title: 'Soy una institución o profesional de salud',
    desc: 'ARL, EPS, aseguradoras, bufetes laborales, médicos y abogados que necesitan criterio técnico-legal confiable y trazabilidad de casos.',
    cta: 'Solicitar evaluación técnica',
    border: 'border-violet-200 dark:border-violet-800',
    bg: 'bg-violet-50/40 dark:bg-violet-900/10',
    ctaStyle: 'bg-violet-600 text-white hover:bg-violet-700',
    // Futura ruta: /instituciones
  },
  {
    key: 'persona',
    tag: 'Portal individual',
    tagColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 dark:text-emerald-300',
    icon: User,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    title: 'Soy una persona que necesita orientación',
    desc: 'Trabajadores, pacientes o familiares que quieren entender su caso, conocer sus derechos y actuar antes de que venzan los plazos.',
    cta: 'Orientarme sobre mi caso',
    border: 'border-emerald-200 dark:border-emerald-800',
    bg: 'bg-emerald-50/40 dark:bg-emerald-900/10',
    ctaStyle: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700',
    href: '/login?type=trabajador',
    // Futura ruta: /para-ti
  },
]

export default function LandingSegmentos() {
  const { dark } = useTheme()
  const [activeSegmento, setActiveSegmento] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', empresa: '', cargo: '', empleados: '', tipo: '' })
  const [sent, setSent] = useState(false)

  const sectionBg = dark ? '#111827' : '#ffffff'

  const openForm = (key) => {
    setActiveSegmento(key)
    setFormData(f => ({ ...f, tipo: key }))
    trackEvent('landing_segment_click', { segment: key })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    trackEvent('landing_lead_submit', { segment: formData.tipo })
    const subject = `KausalIA — Lead ${formData.tipo}: ${formData.nombre} (${formData.empresa})`
    const body = `Nombre: ${formData.nombre}\nEmpresa: ${formData.empresa}\nCargo: ${formData.cargo}\nEmpleados: ${formData.empleados}\nTipo de usuario: ${formData.tipo}`
    window.location.href = `mailto:rafamaza56@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section
      id="segmentos"
      className="py-24 px-4"
      style={{ backgroundColor: sectionBg }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            ¿Con quién hablamos?
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Agendar evaluación de flujo médico-legal
          </h2>
          <p className={`max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Selecciona tu perfil y te mostramos el flujo más relevante para tu operación.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {SEGMENTOS.map(({ key, tag, tagColor, icon: Icon, iconBg, iconColor, title, desc, cta, border, bg, ctaStyle, href }) => (
            <div
              key={key}
              className={`relative flex flex-col rounded-2xl border ${border} ${bg} p-7 transition-all duration-300 hover:-translate-y-1`}
              style={{
                boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.2)' : '0 2px 16px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = dark ? '0 12px 40px rgba(0,0,0,0.35)' : '0 12px 40px rgba(0,0,0,0.10)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = dark ? '0 2px 16px rgba(0,0,0,0.2)' : '0 2px 16px rgba(0,0,0,0.04)' }}
            >
              <span className={`self-start text-[10px] font-bold px-2.5 py-1 rounded-full mb-5 ${tagColor}`}>{tag}</span>
              <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <p className={`text-sm mb-6 flex-1 leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
              {href ? (
                <a
                  href={href}
                  onClick={() => openForm(key)}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${ctaStyle}`}
                >
                  {cta} <span className="ml-1">→</span>
                </a>
              ) : (
                <button
                  onClick={() => openForm(key)}
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${ctaStyle}`}
                >
                  {cta} <span className="ml-1">→</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Formulario de lead — aparece al seleccionar empresa o institución */}
        {activeSegmento && activeSegmento !== 'persona' && (
          <div
            className={`rounded-2xl border p-8 transition-all ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
          >
            {sent ? (
              <div className="text-center py-6">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <p className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>¡Listo! Te contactamos en menos de 24 horas.</p>
                <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Totalmente confidencial · Sin compromiso</p>
              </div>
            ) : (
              <>
                <h3 className={`text-lg font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  Cuéntanos sobre tu organización
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="hidden" name="tipo" value={formData.tipo} />
                  {[
                    { name: 'nombre', label: 'Nombre completo', placeholder: 'Tu nombre', required: true },
                    { name: 'empresa', label: 'Empresa / Organización', placeholder: 'Nombre de la empresa', required: true },
                    { name: 'cargo', label: 'Cargo', placeholder: 'Director de RRHH, Médico laboral...', required: false },
                    { name: 'empleados', label: 'N° de empleados activos', placeholder: 'Aprox. cuántos empleados', required: false },
                  ].map(({ name, label, placeholder, required }) => (
                    <div key={name}>
                      <label className={`block text-xs font-semibold mb-1.5 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</label>
                      <input
                        type="text"
                        placeholder={placeholder}
                        required={required}
                        value={formData[name]}
                        onChange={e => setFormData(f => ({ ...f, [name]: e.target.value }))}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${
                          dark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-semibold px-7 py-3 rounded-xl transition-all shadow-sm text-sm"
                    >
                      Agendar evaluación <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Sin compromiso · Respuesta en 24 horas · Totalmente confidencial
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
