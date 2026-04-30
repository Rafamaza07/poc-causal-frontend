import { useNavigate } from 'react-router-dom'
import KausalIALogo from '../Components/KausalIALogo'
import {
  Brain, Shield, Scale, FileText, Bell,
  Users, CheckCircle, ArrowRight, Activity, Zap, Lock,
  Sparkles, ArrowUpRight, Star, Building2, Briefcase,
  TrendingUp, ChevronRight, Award, UserCheck,
  ClipboardList, MessageSquare, Download, Gavel,
} from 'lucide-react'
import LandingHero   from './landing/LandingHero'
import LandingProof  from './landing/LandingProof'
import LandingTour   from './landing/LandingTour'
import useScrollReveal from '../hooks/useScrollReveal'

/* ── Data ───────────────────────────────────────────────────────────────── */

const FEATURES = [
  { icon: Brain,    title: 'Motor causal IA',       desc: 'Algoritmo PC con inferencia bayesiana — no correlaciones, causalidad real.',           gradient: 'icon-gradient-blue',   iconColor: 'text-blue-600' },
  { icon: Bell,     title: 'Alertas proactivas',     desc: 'Hitos legales EPS/ARL/AFP monitoreados automáticamente (90/120/180/540 días).',          gradient: 'icon-gradient-orange', iconColor: 'text-orange-500' },
  { icon: Scale,    title: 'RAG Legal normativo',    desc: 'Ley 100, Decreto 1507, Ley 776 y más — sustento jurídico en cada evaluación.',           gradient: 'icon-gradient-purple', iconColor: 'text-purple-600' },
  { icon: Users,    title: 'Multi-tenant',           desc: 'Cada EPS o empleador tiene su espacio aislado con control de roles granular.',            gradient: 'icon-gradient-teal',   iconColor: 'text-teal-600' },
  { icon: Shield,   title: 'Trazabilidad inmutable', desc: 'Cada evaluación es un INSERT; historial completo para auditorías legales.',               gradient: 'icon-gradient-green',  iconColor: 'text-green-600' },
  { icon: FileText, title: 'Export PDF / Excel',     desc: 'Reportes individuales y portafolios consolidados con un clic.',                           gradient: 'icon-gradient-pink',   iconColor: 'text-pink-600' },
]

const PORTAL_BENEFITS = [
  { icon: ClipboardList, title: 'Estado de mi caso',             desc: 'Consulta en tiempo real el score de riesgo, la recomendación y el hito en que se encuentra tu incapacidad.', color: 'text-blue-600',   bg: 'bg-blue-50' },
  { icon: TrendingUp,    title: 'Historial completo',            desc: 'Cada evaluación queda registrada con fecha, médico y resultado. Trazabilidad total para ti como trabajador.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Bell,          title: 'Alertas personales',            desc: 'Recibe notificaciones antes de que venza un plazo crítico con tu EPS, ARL o AFP.',                           color: 'text-orange-600', bg: 'bg-orange-50' },
  { icon: Download,      title: 'Resumen descargable',           desc: 'Descarga el resumen médico-legal de tu caso en PDF para presentarlo ante cualquier entidad.',                color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Gavel,         title: 'Derechos de petición y tutelas', desc: 'Genera automáticamente documentos legales personalizados listos para radicar ante EPS, ARL o empleador.',   color: 'text-rose-600',   bg: 'bg-rose-50' },
]

const PROFILES = [
  {
    tag: 'Para empresas y profesionales', title: 'Plataforma B2B', subtitle: 'Equipos de RRHH, SST, Jurídico y Médicos Laborales',
    border: 'border-brand-200', bg: 'bg-brand-50/50', badgeBg: 'bg-brand-100 text-brand-700', icon: Building2,
    features: ['Evaluación individual y en lote (CSV)', 'Dashboard de analytics y tendencias', 'Pipeline de aprobaciones médicas', 'Alertas operativas multi-caso', 'Exportación PDF / Excel / API', 'Roles granulares por equipo'],
    cta: 'Solicitar demo B2B', ctaHref: 'mailto:rafamaza56@gmail.com?subject=Demo B2B KausalIA', ctaStyle: 'bg-gray-900 text-white hover:bg-gray-700',
  },
  {
    tag: 'Para trabajadores', title: 'Portal Cliente Final', subtitle: 'El trabajador gestiona su caso sin intermediarios',
    border: 'border-emerald-200', bg: 'bg-emerald-50/50', badgeBg: 'bg-emerald-100 text-emerald-700', icon: UserCheck,
    features: ['Consulta el estado de tu caso en tiempo real', 'Historial de evaluaciones con fechas y resultados', 'Alertas antes de que venzan tus plazos', 'Descarga tu resumen médico-legal en PDF', 'Genera derechos de petición y tutelas', 'Acceso seguro con tus credenciales'],
    cta: 'Acceder al portal', ctaHref: '/login', ctaStyle: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700', isInternal: true,
  },
]

const PLANS = [
  { name: 'Básico', price: '$990.000', period: 'mes', desc: 'Para empleadores medianos con gestión interna de incapacidades.', features: ['Hasta 100 casos/mes', '3 usuarios', 'PDF por caso', 'Alertas básicas', 'Portal cliente 50 trabajadores', 'Soporte por email'], cta: 'Solicitar demo', highlight: false },
  { name: 'Profesional', price: '$2.490.000', period: 'mes', desc: 'Para ARL y EPS con volumen alto y equipos médicos.', features: ['Hasta 500 casos/mes', '15 usuarios', 'Evaluación en lote (CSV)', 'Alertas avanzadas + RAG legal', 'Analytics completo', 'Portal cliente ilimitado', 'Soporte prioritario'], cta: 'Solicitar demo', highlight: true },
  { name: 'Enterprise', price: 'A convenir', period: '', desc: 'Para grandes aseguradoras o ministerios con integración HR.', features: ['Casos ilimitados', 'Usuarios ilimitados', 'API + webhooks salientes', 'SLA 99.9%', 'Gerente de cuenta dedicado', 'Factura electrónica DIAN'], cta: 'Hablar con ventas', highlight: false },
]

const PROBLEMS = [
  { icon: Activity, before: 'Horas revisando expedientes a mano',            after: 'Evaluación causal en menos de 2 segundos' },
  { icon: Zap,      before: 'Inconsistencias entre médicos laborales',        after: 'Criterio estandarizado con IA + reglas duras' },
  { icon: Lock,     before: 'Riesgo de sanciones SIC y litigios',             after: 'Habeas Data Ley 1581 + trazabilidad legal completa' },
]

const TARGETS = [
  { icon: Shield,    name: 'EPS',        full: 'Entidades Promotoras de Salud',            color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100',   dot: '#2563eb' },
  { icon: Activity,  name: 'ARL',        full: 'Administradoras de Riesgos Laborales',     color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', dot: '#ea580c' },
  { icon: TrendingUp,name: 'AFP',        full: 'Fondos de Pensiones y Cesantías',          color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', dot: '#9333ea' },
  { icon: Briefcase, name: 'Empleadores',full: 'Empresas y PYMES con nómina',              color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-100',   dot: '#0d9488' },
  { icon: Building2, name: 'IPS',        full: 'Instituciones Prestadoras de Salud',       color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100',dot: '#059669' },
  { icon: UserCheck, name: 'Trabajadores',full: 'Vía el Portal Cliente Final',             color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-100',   dot: '#e11d48' },
]

const HOW_IT_WORKS = [
  { n: '01', title: 'Ingresa el caso',     desc: 'Carga diagnóstico CIE-10, contingencia y datos del trabajador en un formulario guiado.', icon: FileText, accent: '#2563eb' },
  { n: '02', title: 'Análisis causal IA',  desc: 'Motor PC + Bayesiano evalúa causalidad y calcula score de riesgo en < 2 segundos.',      icon: Brain,    accent: '#9333ea' },
  { n: '03', title: 'Sustento legal RAG',  desc: 'El corpus normativo (Ley 100, Decreto 1507) respalda cada recomendación con citas exactas.', icon: Scale, accent: '#059669' },
  { n: '04', title: 'Exporta y archiva',   desc: 'Genera PDF trazable o exporta al sistema de nómina. Historial inmutable para auditorías.', icon: Award, accent: '#ea580c' },
]

const dotBg      = { backgroundColor: '#ffffff', backgroundImage: 'radial-gradient(circle, #dde3f0 1.2px, transparent 1.2px)', backgroundSize: '28px 28px' }
const dotBgLight = { backgroundColor: '#f8faff', backgroundImage: 'radial-gradient(circle, #dde3f0 1.2px, transparent 1.2px)', backgroundSize: '28px 28px' }

/* ── Component ──────────────────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate()

  const targetsRef  = useScrollReveal({ threshold: 0.1, delay: 0 })
  const howRef      = useScrollReveal({ threshold: 0.1, delay: 0 })
  const portalRef   = useScrollReveal({ threshold: 0.08, delay: 0 })
  const profilesRef = useScrollReveal({ threshold: 0.1, delay: 0 })
  const problemsRef = useScrollReveal({ threshold: 0.1, delay: 0 })
  const featuresRef = useScrollReveal({ threshold: 0.1, delay: 0 })
  const pricingRef  = useScrollReveal({ threshold: 0.08, delay: 0 })
  const ctaRef      = useScrollReveal({ threshold: 0.1, delay: 0 })

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <KausalIALogo size={28} />
          <div className="flex items-center gap-3">
            <a href="#portal" className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors hidden sm:flex items-center gap-1 font-medium">
              <UserCheck className="w-3.5 h-3.5" /> Portal clientes
            </a>
            <a href="mailto:rafamaza56@gmail.com" className="text-sm text-gray-500 hover:text-brand-600 transition-colors hidden md:block font-medium">
              Contactar
            </a>
            <button
              onClick={() => navigate('/login')}
              className="text-sm bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Iniciar sesión →
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero (2 columnas con mock animado) ──────────────────────── */}
      <LandingHero />

      {/* ── Proof (métricas + testimonios) ──────────────────────────── */}
      <LandingProof />

      {/* ── ¿Para quién? ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Diseñado para el sistema de seguridad social colombiano
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">¿Para quién es KausalIA?</h2>
          </div>
          <div ref={targetsRef} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TARGETS.map(({ icon: Icon, name, full, color, bg, border, dot }) => (
              <div key={name} className={`group flex items-start gap-4 p-5 rounded-2xl border ${border} ${bg} hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-default`}>
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-white">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-900 text-sm">{name}</span>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                  </div>
                  <p className="text-xs text-gray-500 leading-snug">{full}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ───────────────────────────────────────────── */}
      <section className="py-24 px-4 overflow-hidden" style={dotBgLight}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full mb-4">Proceso</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display mb-3">Cómo funciona</h2>
            <p className="text-gray-500 max-w-xl mx-auto">De la carga del caso al resultado legal en cuatro pasos. Sin configuración compleja.</p>
          </div>
          <div ref={howRef} className="relative">
            <div className="hidden md:block absolute top-[28px] left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-gray-200 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {HOW_IT_WORKS.map(({ n, title, desc, icon: Icon, accent }) => (
                <div key={n} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg flex-shrink-0"
                    style={{ backgroundColor: accent, boxShadow: `0 8px 24px ${accent}40` }}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">{n}</span>
                  <h3 className="font-bold text-gray-900 mb-2 text-[15px]">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Tour interactivo ─────────────────────────────────── */}
      <LandingTour />

      {/* ── Portal Cliente Final ─────────────────────────────────────── */}
      <section id="portal" className="py-24 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #f0f9ff 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div ref={portalRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full mb-6">
                <UserCheck className="w-3.5 h-3.5" /> Nuevo · Portal Cliente Final
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display mb-5 leading-tight">
                El trabajador gestiona<br />
                <span className="text-emerald-600">su caso sin intermediarios</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-[15px]">
                Cada trabajador accede a un portal personal donde puede consultar su evaluación, recibir alertas antes de que venzan sus plazos legales y generar automáticamente documentos como derechos de petición o tutelas.
              </p>
              <ul className="space-y-4">
                {PORTAL_BENEFITS.map(({ icon: Icon, title, desc, color, bg }) => (
                  <li key={title} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-9 h-9 ${bg} rounded-xl flex items-center justify-center mt-0.5`}>
                      <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-0.5">{title}</div>
                      <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/25">
                  <UserCheck className="w-4 h-4" /> Acceder al portal
                </button>
                <a href="mailto:rafamaza56@gmail.com?subject=Portal cliente KausalIA"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium px-6 py-3 rounded-xl transition-all">
                  Solicitar demo <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Portal mockup */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 z-20 bg-white rounded-2xl px-4 py-3 border border-emerald-100 hidden lg:block"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}>
                <div className="flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Derecho de petición</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Generado en 3 segundos</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-emerald-200/60"
                style={{ boxShadow: '0 24px 80px rgba(5,150,105,0.12), 0 0 0 1px rgba(5,150,105,0.06)' }}>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-gray-400 flex items-center gap-2 border border-gray-200 max-w-xs w-full justify-center">
                      <Lock className="w-3 h-3 text-emerald-500" /> portal.kausal-ia.co / mi-caso
                    </div>
                  </div>
                </div>
                <div className="bg-white" style={{ minHeight: '460px' }}>
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold text-sm">Hola, Carlos Rodríguez</div>
                        <div className="text-emerald-200 text-[11px]">Trabajador · Nueva EPS S.A.S.</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-white text-[11px] font-bold">CR</span>
                      </div>
                    </div>
                  </div>
                  <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
                    <Bell className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-amber-800">Alerta: 12 días para vencimiento</div>
                      <div className="text-[10px] text-amber-600 mt-0.5">Tu prórroga ante la EPS vence el 12 de mayo. Actúa antes.</div>
                    </div>
                  </div>
                  <div className="mx-4 mt-3 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">Mi caso activo · #2847</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">En seguimiento</span>
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
                        <div className="text-sm font-bold text-gray-900">Riesgo Moderado</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">M54.5 · 15 días incapacidad</div>
                        <div className="text-[10px] text-blue-600 mt-1.5 font-medium">Ver detalle completo →</div>
                      </div>
                    </div>
                  </div>
                  <div className="mx-4 mt-3 grid grid-cols-3 gap-2 mb-4">
                    {[
                      { icon: Download,     label: 'Descargar PDF',  color: 'text-blue-600 bg-blue-50 border-blue-100' },
                      { icon: Gavel,        label: 'Generar tutela', color: 'text-rose-600 bg-rose-50 border-rose-100' },
                      { icon: MessageSquare,label: 'Asistente IA',   color: 'text-purple-600 bg-purple-50 border-purple-100' },
                    ].map(({ icon: Icon, label, color }) => (
                      <button key={label} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center ${color} cursor-default select-none`}>
                        <Icon style={{ width: '16px', height: '16px' }} />
                        <span className="text-[10px] font-semibold leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mx-4 mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Historial reciente</div>
                    {[
                      { date: '30 abr', event: 'Evaluación IA completada',          dot: 'bg-emerald-400' },
                      { date: '18 abr', event: 'Certificado médico recibido',        dot: 'bg-blue-400' },
                      { date: '02 abr', event: 'Inicio incapacidad reportado',       dot: 'bg-gray-300' },
                    ].map(({ date, event, dot }) => (
                      <div key={date} className="flex items-center gap-2.5 py-1">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                        <span className="text-[10px] text-gray-400 w-10 flex-shrink-0">{date}</span>
                        <span className="text-[10px] text-gray-700">{event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dos perfiles, una plataforma ────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full mb-4">Perfiles</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display mb-3">Dos perfiles, una plataforma</h2>
            <p className="text-gray-500 max-w-xl mx-auto">KausalIA sirve tanto al equipo operativo de la empresa como al trabajador afectado.</p>
          </div>
          <div ref={profilesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROFILES.map(({ tag, title, subtitle, border, bg, badgeBg, icon: Icon, features, cta, ctaHref, ctaStyle, isInternal }) => (
              <div key={title} className={`relative flex flex-col rounded-2xl border ${border} ${bg} p-7 hover:shadow-elevated transition-all duration-300`}>
                <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-5 ${badgeBg}`}>{tag}</span>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-6 h-6 text-gray-700" />
                  <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
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

      {/* ── Problema / Solución ─────────────────────────────────────── */}
      <section className="py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full mb-4">El problema</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display mb-3">Del proceso manual al criterio automatizado</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Tres problemas críticos que KausalIA resuelve desde el día uno.</p>
          </div>
          <div ref={problemsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROBLEMS.map(({ icon: Icon, before, after }) => (
              <div key={before} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lifted hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-11 h-11 icon-gradient-blue rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 text-xs flex-shrink-0 font-bold">✕</span>
                    <p className="text-sm text-gray-400 line-through leading-snug">{before}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 text-xs flex-shrink-0 font-bold">✓</span>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={dotBg}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-600 bg-accent-50 px-3 py-1.5 rounded-full mb-4">Funcionalidades</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display mb-3">Todo lo que necesitas, integrado</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Desde la evaluación causal hasta la exportación DIAN, en una sola plataforma.</p>
          </div>
          <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, gradient, iconColor }, idx) => (
              <div key={title} className="group relative p-6 rounded-2xl border border-gray-100 bg-white hover:border-transparent hover:shadow-elevated transition-all duration-300 cursor-default overflow-hidden">
                <span className="absolute top-4 right-5 text-[11px] font-bold text-gray-200 tabular-nums select-none">{String(idx + 1).padStart(2, '0')}</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                  style={{ background: 'radial-gradient(ellipse at top left, rgba(59,118,246,0.04) 0%, transparent 70%)' }} />
                <div className={`relative w-11 h-11 ${gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className="relative font-bold text-gray-900 mb-2 text-[15px]">{title}</h3>
                <p className="relative text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ─────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-gray-950 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
            Construido sobre el marco normativo colombiano
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Ley 100 de 1993',  sub: 'Sistema de Seguridad Social',      icon: Shield },
              { label: 'Decreto 1507/2014',sub: 'Manual Único de Calificación',      icon: FileText },
              { label: 'Ley 776 de 2002',  sub: 'Normas prestaciones económicas',    icon: Scale },
              { label: 'Ley 1581/2012',    sub: 'Habeas Data — protección datos',    icon: Lock },
            ].map(({ label, sub, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/8">
                <Icon className="w-5 h-5 text-brand-400 mb-3" />
                <div className="text-xs font-bold text-white mb-1">{label}</div>
                <div className="text-[10px] text-gray-500 leading-snug">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planes ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #f0f4ff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full mb-4">Precios</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display mb-3">Planes y precios</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Precios en COP + IVA. Sin permanencia mínima. Portal cliente incluido en todos los planes.</p>
          </div>
          <div ref={pricingRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative flex flex-col rounded-2xl transition-all duration-300 ${
                plan.highlight ? 'card-gradient-border shadow-2xl shadow-brand-500/20 scale-105 py-8 px-7' : 'bg-white border border-gray-200 p-7 hover:shadow-lifted hover:-translate-y-1'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-brand-500 to-accent-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-brand-500/30">
                      <Star className="w-3 h-3 fill-current" /> MÁS POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-extrabold text-gray-900 tabular-nums">{plan.price}</span>
                  {plan.period && <span className="text-sm text-gray-400 mb-1">/{plan.period}</span>}
                </div>
                <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-500" /> {f}
                    </li>
                  ))}
                </ul>
                <a href="mailto:rafamaza56@gmail.com?subject=Plan KausalIA"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlight ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white hover:from-brand-700 hover:to-accent-700 shadow-lg shadow-brand-500/25 btn-glow' : 'bg-gray-900 text-white hover:bg-gray-700'
                  }`}>
                  {plan.cta} <span className="ml-1">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #1a0a3d 60%, #0a0f1e 100%)' }}>
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b76f6 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div ref={ctaRef} className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-white/8 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/15">
              <Sparkles className="w-3 h-3 text-yellow-400" /> Demo 30 minutos, sin costo
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-4 leading-tight">
            ¿Listo para automatizar tu gestión<br className="hidden sm:block" /> de incapacidades?
          </h2>
          <p className="text-white/50 mb-10 max-w-xl mx-auto">
            Agenda una demo para tu equipo o accede directamente al portal si eres trabajador.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:rafamaza56@gmail.com?subject=Demo KausalIA"
              className="btn-glow inline-flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl transition-all shadow-2xl shadow-black/40 text-base">
              Solicitar demo gratuita <ArrowUpRight className="w-5 h-5" />
            </a>
            <button onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold px-8 py-4 rounded-xl transition-all text-base">
              <UserCheck className="w-5 h-5" /> Acceder al portal cliente
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="py-8 px-5 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2.5">
            <KausalIALogo size={14} />
            <span>© {new Date().getFullYear()} KausalIA — Colombia</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/politica-tratamiento" className="hover:text-brand-600 transition-colors">Política de datos</a>
            <a href="#portal" className="hover:text-emerald-600 transition-colors">Portal clientes</a>
            <a href="mailto:rafamaza56@gmail.com" className="hover:text-brand-600 transition-colors">Contacto</a>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-brand-600 transition-colors">
              ↑ Subir
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
