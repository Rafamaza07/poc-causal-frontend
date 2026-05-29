import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import KausalIALogo from '../Components/KausalIALogo'
import {
  Brain, Shield, Scale, FileText, Bell,
  Users, CheckCircle, ArrowRight, Activity, Zap, Lock,
  Sparkles, ArrowUpRight, Building2, Briefcase,
  TrendingUp, ChevronRight, Award, UserCheck, ChevronDown,
  ClipboardList, MessageSquare, Download, Gavel,
  Sun, Moon,
} from 'lucide-react'
import LandingHero        from './landing/LandingHero'
import LandingTrustBar    from './landing/LandingTrustBar'
import LandingProof       from './landing/LandingProof'
import LandingStories     from './landing/LandingStories'
import LandingROI         from './landing/LandingROI'
import LandingTour        from './landing/LandingTour'
import LandingCompare     from './landing/LandingCompare'
import LandingCompliance  from './landing/LandingCompliance'
import LandingSegmentos   from './landing/LandingSegmentos'
import LandingCostoReal   from './landing/LandingCostoReal'
import LandingArquitectura from './landing/LandingArquitectura'
import useScrollReveal from '../hooks/useScrollReveal'
import { useTheme } from '../hooks/useTheme'
import { trackEvent } from '../utils/analytics'

/* ── Data ───────────────────────────────────────────────────────────────── */

const FEATURES = [
  { icon: Brain,    title: 'Aprende de cada caso',           desc: 'Mejora su criterio con el tiempo — cada evaluación alimenta el siguiente análisis.',                 iconColor: 'text-blue-600' },
  { icon: Bell,     title: 'Detecta vencimientos a tiempo',  desc: 'Te avisa antes de que venza un plazo crítico con EPS, ARL o AFP. Evita que el caso se extienda.',     iconColor: 'text-orange-500' },
  { icon: Scale,    title: 'Entiende el lenguaje legal',     desc: 'Sustenta cada decisión en la normativa colombiana vigente (Ley 100, Decreto 1507, Ley 776).',          iconColor: 'text-violet-600' },
  { icon: Users,    title: 'Tus datos no se mezclan',        desc: 'Espacio aislado por organización — privacidad garantizada con control de acceso por rol.',              iconColor: 'text-teal-600' },
  { icon: Shield,   title: 'Registro legal que no cambia',   desc: 'Historial inmutable, completo y defendible en juzgado o ante juntas de calificación.',                 iconColor: 'text-emerald-600' },
  { icon: FileText, title: 'Auditoría y ruta documental',    desc: 'Genera automáticamente la documentación y la ruta de lo que necesita cada etapa del proceso.',         iconColor: 'text-gray-500' },
]

const PORTAL_BENEFITS = [
  { icon: ClipboardList, title: 'Estado de mi caso',              desc: 'Consulta en tiempo real el score de riesgo, la recomendación y el hito en que se encuentra tu incapacidad.', color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/30' },
  { icon: TrendingUp,    title: 'Historial completo',             desc: 'Cada evaluación queda registrada con fecha, médico y resultado. Trazabilidad total de cada caso evaluado.', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  { icon: Bell,          title: 'Alertas personales',             desc: 'Recibe notificaciones antes de que venza un plazo crítico con tu EPS, ARL o AFP.',                           color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/30' },
  { icon: Download,      title: 'Resumen descargable',            desc: 'Descarga el resumen médico-legal de tu caso en PDF para presentarlo ante cualquier entidad.',                color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30' },
  { icon: Gavel,         title: 'Derechos de petición y tutelas', desc: 'Genera automáticamente documentos legales personalizados listos para radicar ante EPS, ARL o empleador.',   color: 'text-rose-600',   bg: 'bg-rose-50 dark:bg-rose-900/30' },
]

const PROFILES = [
  {
    tag: 'Para empresas y profesionales', title: 'Plataforma B2B', subtitle: 'Equipos de RRHH, SST, Jurídico y Médicos Laborales',
    border: 'border-brand-200 dark:border-brand-800', bg: 'bg-brand-50/50 dark:bg-brand-900/20', badgeBg: 'bg-brand-100 text-brand-700 dark:bg-brand-800/50 dark:text-brand-300', icon: Building2,
    features: ['Evaluación individual y en lote (CSV)', 'Dashboard de analytics y tendencias', 'Pipeline de aprobaciones médicas', 'Alertas operativas multi-caso', 'Exportación PDF / Excel / API', 'Roles granulares por equipo'],
    cta: 'Solicitar demo B2B', ctaHref: 'mailto:rafamaza56@gmail.com?subject=Demo B2B KausalIA', ctaStyle: 'bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
  },
  {
    tag: 'Para cualquier persona', title: 'Portal Individual', subtitle: 'Médico, abogado, trabajador o cualquier persona',
    border: 'border-emerald-200 dark:border-emerald-800', bg: 'bg-emerald-50/50 dark:bg-emerald-900/20', badgeBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300', icon: UserCheck,
    features: ['Consulta el estado de tu caso en tiempo real', 'Historial de evaluaciones con fechas y resultados', 'Alertas antes de que venzan tus plazos', 'Descarga tu resumen médico-legal en PDF', 'Genera derechos de petición y tutelas', 'Acceso seguro con tus credenciales'],
    cta: 'Acceder al portal', ctaHref: '/login?type=trabajador', ctaStyle: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700', isInternal: true,
  },
]


const PROBLEMS = [
  { icon: Activity, before: 'Horas revisando expedientes a mano',            after: 'Evaluación causal en menos de 2 segundos' },
  { icon: Zap,      before: 'Inconsistencias entre médicos laborales',        after: 'Criterio estandarizado con IA + reglas duras' },
  { icon: Lock,     before: 'Riesgo de sanciones SIC y litigios',             after: 'Habeas Data Ley 1581 + trazabilidad legal completa' },
]

const TARGETS = [
  { icon: Shield,    name: 'EPS',         full: 'Entidades Promotoras de Salud',        color: 'text-blue-600' },
  { icon: Activity,  name: 'ARL',         full: 'Administradoras de Riesgos Laborales', color: 'text-orange-500' },
  { icon: TrendingUp,name: 'AFP',         full: 'Fondos de Pensiones y Cesantías',      color: 'text-violet-600' },
  { icon: Briefcase, name: 'Empleadores', full: 'Empresas y PYMES con nómina',          color: 'text-teal-600' },
  { icon: Building2, name: 'IPS',         full: 'Instituciones Prestadoras de Salud',   color: 'text-emerald-600' },
  { icon: UserCheck, name: 'Individuos',   full: 'Portal individual por caso',           color: 'text-rose-600' },
]

const HOW_IT_WORKS = [
  { n: '01', title: 'Carga el caso',          desc: 'Diagnóstico, contingencia y documentos en un formulario guiado. Sin configuración compleja.', icon: FileText, accent: '#2563eb' },
  { n: '02', title: 'KausalIA analiza y detecta vacíos', desc: 'Organiza la información, identifica lo que tienes y lo que te falta antes de que te haga perder el caso.', icon: Brain, accent: '#9333ea' },
  { n: '03', title: 'Obtienes la ruta trazable', desc: 'Recomendación, sustento normativo y documento listo para radicar. Registro inmutable para auditorías.', icon: Award, accent: '#059669' },
]

const makeDotBg = (dark, base) => ({
  backgroundColor: dark ? (base === 'light' ? '#0f172a' : '#111827') : (base === 'light' ? '#f8faff' : '#ffffff'),
  backgroundImage: `radial-gradient(circle, ${dark ? '#1e293b' : '#dde3f0'} 1.2px, transparent 1.2px)`,
  backgroundSize: '28px 28px',
})

const FAQ_ITEMS = [
  {
    q: '¿Cómo se integra KausalIA con nuestros sistemas actuales (HCE, nómina, ERP)?',
    a: 'Ofrecemos API REST documentada con autenticación JWT para integrar con sistemas de historia clínica, nómina y plataformas de EPS/ARL. También soportamos carga masiva por CSV y webhooks salientes para notificar eventos (evaluación completada, alerta activada). El plan Enterprise incluye acompañamiento técnico en la integración.',
  },
  {
    q: '¿Dónde residen los datos y cómo se tratan? ¿Cumplen normativa colombiana?',
    a: 'Los datos se almacenan en servidores con aislamiento por tenant — cada cliente tiene su espacio separado. Cumplimos Ley 1581/2012 (Habeas Data): consentimiento informado por caso, gestión de derechos ARCO, y log de accesos a datos sensibles. Los datos de salud no se comparten ni usan para entrenar modelos externos.',
  },
  {
    q: '¿Cuánto tiempo toma la implementación inicial?',
    a: 'Entre 1 y 3 días hábiles para cuentas estándar: creación del tenant, carga de usuarios con roles, configuración de empresa y capacitación básica. Integraciones API con sistemas externos pueden tomar más tiempo según la complejidad. El plan Enterprise incluye gerente de cuenta para acompañar el onboarding.',
  },
  {
    q: '¿Quién es responsable de la decisión clínica? ¿La IA reemplaza al médico?',
    a: 'No. KausalIA es una herramienta de apoyo a la decisión — genera una recomendación con sustento normativo, pero el profesional de salud es quien emite el concepto final. El sistema documenta quién tomó la decisión, cuándo y con qué información, lo que refuerza la posición de la organización ante auditorías.',
  },
  {
    q: '¿Qué SLA ofrecen y cómo manejan incidentes en producción?',
    a: 'El plan Enterprise incluye SLA de 99,9% de uptime con monitoreo continuo. Para incidentes críticos, el tiempo de respuesta inicial es de 1 hora. Los planes Básico y Profesional tienen soporte por email con respuesta en 1 día hábil. Ante un incidente, la plataforma puede continuar operando en modo degradado sin pérdida de datos.',
  },
  {
    q: '¿Qué pasa si la normativa laboral colombiana cambia?',
    a: 'El corpus RAG Legal (Ley 100, Decreto 1507, Ley 776 y complementarios) se actualiza cuando el marco normativo cambia. Las evaluaciones ya emitidas quedan archivadas con la versión de normativa vigente en el momento de emitirlas — esto es crítico para auditorías posteriores.',
  },
  {
    q: '¿El portal individual tiene costo adicional para los trabajadores?',
    a: 'Cuando una empresa contrata el servicio B2B, el acceso al portal individual está incluido sin costo adicional. Quien accede directamente sin pasar por una empresa puede gestionar su caso de forma independiente; el detalle de costos se coordina en la conversación de evaluación. No hay suscripción mensual obligatoria.',
  },
  {
    q: '¿Puedo exportar los casos para auditorías externas o entes de control?',
    a: 'Sí. Cada evaluación se puede exportar en PDF con trazabilidad completa: fecha, usuario, normativa aplicada, score de riesgo y recomendación. Los planes Profesional y Enterprise permiten exportación masiva en Excel y acceso por API. El historial es inmutable — no se pueden borrar ni modificar evaluaciones pasadas.',
  },
]

/* ── Component ──────────────────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate()
  const { dark, setMode } = useTheme()
  const [showSticky, setShowSticky]   = useState(false)
  const [openFaq, setOpenFaq]         = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [loginDrop, setLoginDrop]     = useState(false)
  const loginBtnRef = useRef(null)

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      setScrollProgress(scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0)
      const nearBottom = scrollY > scrollHeight - 500
      setShowSticky(scrollY > 700 && !nearBottom)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close login dropdown on outside click
  useEffect(() => {
    if (!loginDrop) return
    const handler = (e) => {
      if (!loginBtnRef.current?.contains(e.target)) setLoginDrop(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [loginDrop])

  const dotBg      = makeDotBg(dark, 'normal')
  const dotBgLight = makeDotBg(dark, 'light')

  const targetsRef  = useScrollReveal({ threshold: 0.1, delay: 0 })
  const howRef      = useScrollReveal({ threshold: 0.1, delay: 0 })
  const portalRef   = useScrollReveal({ threshold: 0.08, delay: 0 })
  const profilesRef = useScrollReveal({ threshold: 0.1, delay: 0 })
  const problemsRef = useScrollReveal({ threshold: 0.1, delay: 0 })
  const featuresRef = useScrollReveal({ threshold: 0.1, delay: 0 })
  const ctaRef      = useScrollReveal({ threshold: 0.1, delay: 0 })

  const sectionBg = dark ? '#111827' : '#ffffff'

  return (
    <div className={`min-h-screen font-sans ${dark ? 'bg-gray-900' : 'bg-white'}`}>

      {/* ── Scroll progress bar ─────────────────────────────────────────── */}
      <div className="fixed top-0 inset-x-0 z-[60] h-[2px] pointer-events-none">
        <div
          className="h-full transition-[width] duration-75"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #3b76f6, #8b5cf6, #f472b6)',
          }}
        />
      </div>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b transition-colors duration-300"
        style={{
          background: dark
            ? 'rgba(17,24,39,0.92)'
            : 'rgba(255,255,255,0.88)',
          borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)',
          boxShadow: dark
            ? '0 1px 24px rgba(0,0,0,0.4)'
            : '0 1px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <KausalIALogo size={28} />

          <div className="flex items-center gap-3">
            <a
              href="mailto:rafamaza56@gmail.com"
              className={`text-sm font-medium transition-colors hidden md:block ${
                dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-brand-600'
              }`}
            >
              Contactar
            </a>

            {/* Dark mode toggle */}
            <button
              onClick={() => setMode(dark ? 'light' : 'dark')}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                dark
                  ? 'border-gray-600 text-gray-400 hover:text-yellow-400 hover:border-yellow-500/50 bg-gray-800/50'
                  : 'border-gray-200 text-gray-500 hover:text-brand-600 hover:border-brand-200'
              }`}
              aria-label="Cambiar tema"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Login dropdown */}
            <div ref={loginBtnRef} className="relative">
              <button
                onClick={() => setLoginDrop(v => !v)}
                className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm ${
                  dark
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-700'
                }`}
              >
                Iniciar sesión
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${loginDrop ? 'rotate-180' : ''}`}
                />
              </button>

              {loginDrop && (
                <div
                  className={`absolute right-0 top-[calc(100%+10px)] w-60 rounded-2xl border overflow-hidden z-50 ${
                    dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                  }`}
                  style={{
                    boxShadow: dark
                      ? '0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)'
                      : '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className={`px-4 py-2.5 border-b text-[10px] font-semibold uppercase tracking-widest ${
                    dark ? 'border-gray-700 text-gray-500' : 'border-gray-50 text-gray-400'
                  }`}>
                    ¿Cómo ingresas?
                  </div>
                  <button
                    onClick={() => { navigate('/login?type=empresa'); setLoginDrop(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left ${
                      dark ? 'hover:bg-gray-700/60' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Empresa / Profesional
                      </div>
                      <div className={`text-xs mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        EPS, ARL, empleador, médico
                      </div>
                    </div>
                  </button>
                  <div className={`border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`} />
                  <button
                    onClick={() => { navigate('/login?type=trabajador'); setLoginDrop(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left ${
                      dark ? 'hover:bg-gray-700/60' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Acceso personal
                      </div>
                      <div className={`text-xs mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Médico, abogado, trabajador o cualquier persona
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <LandingHero />

      {/* ── El costo real del problema ──────────────────────────────────── */}
      <LandingCostoReal />

      {/* ── Trust strip (B) ─────────────────────────────────────────────── */}
      <LandingTrustBar />

      {/* ── Proof ───────────────────────────────────────────────────────── */}
      <LandingProof />

      {/* ── Casos de uso (C) ─────────────────────────────────────────────── */}
      <LandingStories />

      {/* ── ROI 6 meses (D) ──────────────────────────────────────────────── */}
      <LandingROI />

      {/* ── ¿Para quién? ────────────────────────────────────────────────── */}
      <section
        className="py-20 px-4 border-b"
        style={{
          backgroundColor: sectionBg,
          borderColor: dark ? 'rgba(55,65,81,0.6)' : 'rgba(229,231,235,0.8)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Sistema de seguridad social colombiano
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold font-display ${dark ? 'text-white' : 'text-gray-900'}`}>
              ¿Para quién es KausalIA?
            </h2>
          </div>
          <div ref={targetsRef} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TARGETS.map(({ icon: Icon, name, full, color }) => (
              <div
                key={name}
                className="group flex items-start gap-3.5 p-5 rounded-2xl border transition-all duration-200 cursor-default"
                style={{
                  backgroundColor: dark ? '#1f2937' : '#ffffff',
                  borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)',
                  boxShadow: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = dark
                    ? '0 4px 20px rgba(0,0,0,0.3)'
                    : '0 4px 20px rgba(0,0,0,0.07)'
                  e.currentTarget.style.borderColor = dark ? 'rgba(75,85,99,1)' : 'rgba(209,213,219,1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)'
                }}
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <span className={`font-semibold text-sm leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>{name}</span>
                  <p className={`text-xs leading-snug mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>{full}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 overflow-hidden" style={dotBgLight}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Proceso
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Cómo funciona
            </h2>
            <p className={`max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Del caso a la ruta médico-legal trazable en tres pasos. Sin configuración compleja.
            </p>
          </div>
          <div ref={howRef} className="relative">
            <div className={`hidden md:block absolute top-[28px] left-[16.5%] right-[16.5%] h-px border-t-2 border-dashed z-0 ${dark ? 'border-gray-700' : 'border-gray-200'}`} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {HOW_IT_WORKS.map(({ n, title, desc, icon: Icon, accent }) => (
                <div key={n} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0"
                    style={{ backgroundColor: accent, boxShadow: `0 8px 24px ${accent}40` }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-[0.12em] mb-2 ${dark ? 'text-gray-600' : 'text-gray-300'}`}>{n}</span>
                  <h3 className={`font-bold mb-2 text-[15px] ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Tour (E) ────────────────────────────────────────────── */}
      <div id="tour-section"><LandingTour /></div>

      {/* ── Comparativa Manual vs KausalIA (F) ──────────────────────────── */}
      <LandingCompare />

      {/* ── Portal Cliente Final ─────────────────────────────────────────── */}
      <section
        id="portal"
        className="py-24 px-4 overflow-hidden"
        style={{
          background: dark
            ? 'linear-gradient(135deg, #052e16 0%, #022c22 40%, #0e1f3d 100%)'
            : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #f0f9ff 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div ref={portalRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 px-3 py-1.5 rounded-full mb-6">
                <UserCheck className="w-3.5 h-3.5" /> Nuevo · Portal Cliente Final
              </span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-5 leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                Gestiona tu caso<br />
                <span className="text-emerald-600 dark:text-emerald-400">sin intermediarios</span>
              </h2>
              <p className={`mb-8 leading-relaxed text-[15px] ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                Cualquier persona — médico, abogado, trabajador o familiar — accede a un portal individual donde consulta la evaluación, recibe alertas de plazos legales y genera documentos como derechos de petición o tutelas.
              </p>
              <ul className="space-y-4">
                {PORTAL_BENEFITS.map(({ icon: Icon, title, desc, color, bg }) => (
                  <li key={title} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-9 h-9 ${bg} rounded-xl flex items-center justify-center mt-0.5`}>
                      <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div>
                      <div className={`font-semibold text-sm mb-0.5 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</div>
                      <div className={`text-xs leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/login?type=trabajador')}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/25"
                >
                  <UserCheck className="w-4 h-4" /> Acceder al portal
                </button>
                <a
                  href="mailto:rafamaza56@gmail.com?subject=Portal cliente KausalIA"
                  className={`inline-flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-xl transition-all border ${
                    dark
                      ? 'bg-white/10 hover:bg-white/15 text-white border-white/20'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  Solicitar demo <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Portal mockup */}
            <div className="relative">
              <div
                className="absolute -top-4 -right-4 z-20 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-emerald-100 dark:border-emerald-800 hidden lg:block"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              >
                <div className="flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className={`text-xs font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Derecho de petición</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Generado en 3 segundos</div>
                  </div>
                </div>
              </div>
              <div
                className="rounded-2xl overflow-hidden border border-emerald-200/60 dark:border-emerald-800/40"
                style={{ boxShadow: '0 24px 80px rgba(5,150,105,0.12), 0 0 0 1px rgba(5,150,105,0.06)' }}
              >
                <div className={`flex items-center gap-3 px-4 py-3 border-b ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className={`rounded-lg px-4 py-1.5 text-xs flex items-center gap-2 border max-w-xs w-full justify-center ${dark ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-white border-gray-200 text-gray-400'}`}>
                      <Lock className="w-3 h-3 text-emerald-500" /> portal.kausal-ia.co / mi-caso
                    </div>
                  </div>
                </div>
                <div className={dark ? 'bg-gray-900' : 'bg-white'} style={{ minHeight: '460px' }}>
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold text-sm">Hola, Carlos Rodríguez</div>
                        <div className="text-emerald-200 text-[11px]">Portal individual · Nueva EPS S.A.S.</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-white text-[11px] font-bold">CR</span>
                      </div>
                    </div>
                  </div>
                  <div className={`mx-4 mt-4 border rounded-xl px-4 py-3 flex items-start gap-3 ${dark ? 'bg-amber-900/20 border-amber-700/50' : 'bg-amber-50 border-amber-200'}`}>
                    <Bell className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className={`text-xs font-bold ${dark ? 'text-amber-300' : 'text-amber-800'}`}>Alerta: 12 días para vencimiento</div>
                      <div className={`text-[10px] mt-0.5 ${dark ? 'text-amber-400' : 'text-amber-600'}`}>Tu prórroga ante la EPS vence el 12 de mayo. Actúa antes.</div>
                    </div>
                  </div>
                  <div className={`mx-4 mt-3 border rounded-xl overflow-hidden shadow-sm ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${dark ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-100'}`} style={{ background: dark ? '#1a2332' : '' }}>
                      <span className={`text-xs font-bold ${dark ? 'text-gray-200' : 'text-gray-700'}`}>Mi caso activo · #2847</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${dark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>En seguimiento</span>
                    </div>
                    <div className="p-4 flex items-center gap-4">
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#d1fae5" strokeWidth="3.5" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="62 100" strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-emerald-600">62</span>
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Riesgo Moderado</div>
                        <div className={`text-[11px] mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>M54.5 · 15 días incapacidad</div>
                        <div className="text-[10px] text-blue-500 mt-1.5 font-medium">Ver detalle completo →</div>
                      </div>
                    </div>
                  </div>
                  <div className="mx-4 mt-3 grid grid-cols-3 gap-2 mb-4">
                    {[
                      { icon: Download,      label: 'Descargar PDF',  light: 'text-blue-600 bg-blue-50 border-blue-100',    dark: 'text-blue-400 bg-blue-900/30 border-blue-800/50' },
                      { icon: Gavel,         label: 'Generar tutela', light: 'text-rose-600 bg-rose-50 border-rose-100',     dark: 'text-rose-400 bg-rose-900/30 border-rose-800/50' },
                      { icon: MessageSquare, label: 'Asistente IA',   light: 'text-purple-600 bg-purple-50 border-purple-100', dark: 'text-purple-400 bg-purple-900/30 border-purple-800/50' },
                    ].map(({ icon: Icon, label, light: lc, dark: dc }) => (
                      <button key={label} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center cursor-default select-none ${dark ? dc : lc}`}>
                        <Icon style={{ width: '16px', height: '16px' }} />
                        <span className="text-[10px] font-semibold leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dos perfiles ────────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ backgroundColor: sectionBg }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Perfiles
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Dos perfiles, una plataforma
            </h2>
            <p className={`max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              KausalIA sirve tanto al equipo operativo de la empresa como a cualquier persona afectada.
            </p>
          </div>
          <div ref={profilesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROFILES.map(({ tag, title, subtitle, border, bg, badgeBg, icon: Icon, features, cta, ctaHref, ctaStyle, isInternal }) => (
              <div
                key={title}
                className={`relative flex flex-col rounded-2xl border ${border} ${bg} p-7 transition-all duration-300 hover:-translate-y-1`}
                style={{
                  boxShadow: dark
                    ? '0 2px 16px rgba(0,0,0,0.2)'
                    : '0 2px 16px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = dark
                    ? '0 12px 40px rgba(0,0,0,0.35)'
                    : '0 12px 40px rgba(0,0,0,0.10)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = dark
                    ? '0 2px 16px rgba(0,0,0,0.2)'
                    : '0 2px 16px rgba(0,0,0,0.04)'
                }}
              >
                <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-5 ${badgeBg}`}>{tag}</span>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-6 h-6 ${dark ? 'text-gray-300' : 'text-gray-700'}`} />
                  <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                </div>
                <p className={`text-sm mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
                {isInternal ? (
                  <button onClick={() => navigate(ctaHref)} className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${ctaStyle}`}>
                    {cta} <span className="ml-1">→</span>
                  </button>
                ) : (
                  <a href={ctaHref} className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${ctaStyle}`}>
                    {cta} <span className="ml-1">→</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problema / Solución ─────────────────────────────────────────── */}
      <section
        className="py-24 px-4"
        style={{
          background: dark
            ? 'linear-gradient(135deg, #0f172a 0%, #1a0a3d 50%, #0f2a1a 100%)'
            : 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              El problema
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Del proceso manual al criterio automatizado
            </h2>
            <p className={`max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Tres problemas críticos que KausalIA resuelve desde el día uno.
            </p>
          </div>
          <div ref={problemsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROBLEMS.map(({ icon: Icon, before, after }) => (
              <div
                key={before}
                className="rounded-2xl p-6 border transition-all duration-200 group hover:-translate-y-0.5"
                style={{
                  backgroundColor: dark ? '#1e293b' : '#ffffff',
                  borderColor: dark ? 'rgba(51,65,85,0.8)' : 'rgba(229,231,235,0.8)',
                  boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = dark
                    ? '0 12px 36px rgba(0,0,0,0.35)'
                    : '0 12px 36px rgba(0,0,0,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = dark
                    ? '0 2px 12px rgba(0,0,0,0.2)'
                    : '0 2px 12px rgba(0,0,0,0.04)'
                }}
              >
                <div className="w-11 h-11 icon-gradient-blue rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 text-xs flex-shrink-0 font-bold">✕</span>
                    <p className={`text-sm line-through leading-snug ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{before}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 text-xs flex-shrink-0 font-bold">✓</span>
                    <p className={`text-sm font-semibold leading-snug ${dark ? 'text-white' : 'text-gray-900'}`}>{after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={dotBg}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Funcionalidades
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Todo lo que necesitas, integrado
            </h2>
            <p className={`max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              De la gestión documental al cierre del caso, sin sistemas dispersos ni información perdida.
            </p>
          </div>
          <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, iconColor }, idx) => (
              <div
                key={title}
                className="group relative p-6 rounded-2xl border transition-all duration-200 cursor-default hover:-translate-y-0.5"
                style={{
                  backgroundColor: dark ? '#1f2937' : '#ffffff',
                  borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)',
                  boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = dark
                    ? '0 10px 32px rgba(0,0,0,0.3)'
                    : '0 10px 32px rgba(0,0,0,0.08)'
                  e.currentTarget.style.borderColor = dark ? 'rgba(75,85,99,1)' : 'rgba(209,213,219,1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = dark
                    ? '0 2px 12px rgba(0,0,0,0.15)'
                    : '0 2px 12px rgba(0,0,0,0.04)'
                  e.currentTarget.style.borderColor = dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)'
                }}
              >
                <span className={`absolute top-4 right-5 text-[11px] font-medium tabular-nums select-none ${dark ? 'text-gray-700' : 'text-gray-200'}`}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-colors duration-200 ${dark ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                  <Icon className={`w-4.5 h-4.5 ${iconColor}`} style={{ width: '18px', height: '18px' }} />
                </div>
                <h3 className={`font-semibold mb-2 text-[15px] ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ─────────────────────────────────────────────────── */}
      <section className="relative py-16 px-4 overflow-hidden" style={{ background: dark ? '#030712' : '#0f172a' }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,118,246,0.07) 0%, transparent 70%)' }} />
        <div className="relative max-w-4xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
            Construido sobre el marco normativo colombiano
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Ley 100 de 1993',   sub: 'Sistema de Seguridad Social',   icon: Shield },
              { label: 'Decreto 1507/2014', sub: 'Manual Único de Calificación',   icon: FileText },
              { label: 'Ley 776 de 2002',   sub: 'Normas prestaciones económicas', icon: Scale },
              { label: 'Ley 1581/2012',     sub: 'Habeas Data — protección datos', icon: Lock },
            ].map(({ label, sub, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center p-5 rounded-2xl border border-white/8 transition-all duration-200 hover:border-white/15 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <div className="text-xs font-bold text-white mb-1">{label}</div>
                <div className="text-[10px] text-gray-500 leading-snug">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Segmentos + lead form (reemplaza pricing) ───────────────────── */}
      <LandingSegmentos />

      {/* ── Seguridad y cumplimiento (G) ────────────────────────────────── */}
      <LandingCompliance />

      {/* ── FAQ enterprise (H) ──────────────────────────────────────────── */}
      <section
        className="py-24 px-4 border-b"
        style={{
          backgroundColor: sectionBg,
          borderColor: dark ? 'rgba(55,65,81,0.6)' : 'rgba(229,231,235,0.8)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Preguntas frecuentes
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Preguntas de compradores enterprise
            </h2>
            <p className={`max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Las objeciones más comunes de equipos de TI, Legal y Operaciones. Si necesitas más detalle, escríbenos.
            </p>
          </div>
          <div
            className="divide-y rounded-2xl overflow-hidden border"
            style={{
              borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)',
              divideColor: dark ? 'rgba(55,65,81,0.8)' : undefined,
            }}
          >
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <div
                key={i}
                style={{ borderColor: dark ? 'rgba(55,65,81,0.6)' : 'rgba(243,244,246,1)' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-150 group ${
                    dark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`font-semibold text-[15px] leading-snug ${dark ? 'text-white' : 'text-gray-900'}`}>{q}</span>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-transform duration-200 ${
                    openFaq === i
                      ? `rotate-45 ${dark ? 'bg-brand-900/50 border-brand-700' : 'bg-brand-50 border-brand-200'}`
                      : `${dark ? 'border-gray-600 group-hover:border-gray-500' : 'border-gray-200 group-hover:border-brand-300'}`
                  }`}>
                    <svg className={`w-3 h-3 ${openFaq === i ? 'text-brand-400' : dark ? 'text-gray-500' : 'text-gray-400'}`} viewBox="0 0 12 12" fill="none">
                      <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────────────────── */}
      <section
        className="relative py-28 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #1a0a3d 60%, #0a0f1e 100%)' }}
      >
        {/* Layered ambient lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b76f6 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', transform: 'translate(-50%, -50%)', filter: 'blur(40px)' }} />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

        <div ref={ctaRef} className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-white/8 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/15">
              <Sparkles className="w-3 h-3 text-yellow-400" /> Demo guiada 30 min · Caso real de tu industria
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-4 leading-tight">
            Agenda una demo de 30 minutos<br className="hidden sm:block" /> con un caso tipo de tu operación.
          </h2>
          <p className="text-white/50 mb-10 max-w-xl mx-auto">
            Te mostramos un flujo completo — desde la evaluación causal hasta el documento listo para radicar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <a
              href="mailto:rafamaza56@gmail.com?subject=Demo B2B KausalIA"
              onClick={() => trackEvent('landing_final_cta_click', { cta: 'demo_b2b' })}
              className="btn-glow inline-flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl transition-all shadow-2xl shadow-black/40 text-base"
            >
              Solicitar demo B2B <ArrowUpRight className="w-5 h-5" />
            </a>
            <button
              onClick={() => { trackEvent('landing_final_cta_click', { cta: 'portal_individual' }); navigate('/login?type=trabajador') }}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold px-8 py-4 rounded-xl transition-all text-base"
            >
              <UserCheck className="w-5 h-5" /> Orientarme sobre mi caso
            </button>
          </div>
          <p className="text-white/30 text-xs">
            Sin compromiso · Respuesta en 24 horas · Totalmente confidencial
          </p>
        </div>
      </section>

      {/* ── Sticky CTA bar ──────────────────────────────────────────────── */}
      <div className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}>
        <div
          className="backdrop-blur-md border-t py-3 px-5"
          style={{
            background: 'rgba(3,7,18,0.97)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <p className="text-white/80 text-sm font-medium hidden sm:block">
              Elimina pérdidas económicas gestionando eficientemente las incapacidades de tus empleados.
            </p>
            <div className="flex items-center gap-3 mx-auto sm:mx-0">
              <a
                href="mailto:rafamaza56@gmail.com?subject=Demo KausalIA"
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg"
              >
                Agenda una demo (30 min) <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => navigate('/login?type=trabajador')}
                className="inline-flex items-center gap-2 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/15 font-medium px-5 py-2.5 rounded-xl text-sm transition-all"
              >
                <UserCheck className="w-4 h-4" /> Portal individual
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Arquitectura técnica (colapsable, al fondo) ─────────────────── */}
      <LandingArquitectura />

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-5 border-t"
        style={{
          backgroundColor: sectionBg,
          borderColor: dark ? 'rgba(55,65,81,0.6)' : 'rgba(229,231,235,0.8)',
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <KausalIALogo size={14} />
              <span className={dark ? 'text-gray-500' : 'text-gray-400'}>
                © {new Date().getFullYear()} KausalIA — Colombia
              </span>
            </div>
            <span className={`text-[10px] font-medium ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              Cumple Ley 1581 · Alineado con Decreto 1507/2014 · MUCI + CIE-10 integrado
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/politica-tratamiento" className={`transition-colors ${dark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-brand-600'}`}>
              Política de datos
            </a>
            <a href="#portal" className={`transition-colors ${dark ? 'text-gray-500 hover:text-emerald-400' : 'text-gray-400 hover:text-emerald-600'}`}>
              Portal clientes
            </a>
            <a href="mailto:rafamaza56@gmail.com" className={`transition-colors ${dark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-brand-600'}`}>
              Contacto
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`transition-colors ${dark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-brand-600'}`}
            >
              ↑ Subir
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
