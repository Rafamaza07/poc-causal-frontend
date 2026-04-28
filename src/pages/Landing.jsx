import { useNavigate } from 'react-router-dom'
import KausalIALogo from '../Components/KausalIALogo'
import {
  Brain, Shield, Scale, FileText, Bell, BarChart3,
  Users, CheckCircle, ArrowRight, Activity, Zap, Lock,
  Sparkles, ArrowUpRight, Star, Building2, Briefcase,
  TrendingUp, ChevronRight, Award,
} from 'lucide-react'

/* ── Data ───────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Brain, title: 'Motor causal IA',
    desc: 'Algoritmo PC con inferencia bayesiana — no correlaciones, causalidad real.',
    gradient: 'icon-gradient-blue', iconColor: 'text-blue-600',
  },
  {
    icon: Bell, title: 'Alertas proactivas',
    desc: 'Hitos legales EPS/ARL/AFP monitoreados automáticamente (90/120/180/540 días).',
    gradient: 'icon-gradient-orange', iconColor: 'text-orange-500',
  },
  {
    icon: Scale, title: 'RAG Legal normativo',
    desc: 'Ley 100, Decreto 1507, Ley 776 y más — sustento jurídico en cada evaluación.',
    gradient: 'icon-gradient-purple', iconColor: 'text-purple-600',
  },
  {
    icon: Users, title: 'Multi-tenant',
    desc: 'Cada EPS o empleador tiene su espacio aislado con control de roles granular.',
    gradient: 'icon-gradient-teal', iconColor: 'text-teal-600',
  },
  {
    icon: Shield, title: 'Trazabilidad inmutable',
    desc: 'Cada evaluación es un INSERT; historial completo para auditorías legales.',
    gradient: 'icon-gradient-green', iconColor: 'text-green-600',
  },
  {
    icon: FileText, title: 'Export PDF / Excel',
    desc: 'Reportes individuales y portafolios consolidados con un clic.',
    gradient: 'icon-gradient-pink', iconColor: 'text-pink-600',
  },
]

const PLANS = [
  {
    name: 'Básico',
    price: '$990.000',
    period: 'mes',
    desc: 'Para empleadores medianos con gestión interna de incapacidades.',
    features: ['Hasta 100 casos/mes', '3 usuarios', 'PDF por caso', 'Alertas básicas', 'Soporte por email'],
    cta: 'Solicitar demo',
    highlight: false,
  },
  {
    name: 'Profesional',
    price: '$2.490.000',
    period: 'mes',
    desc: 'Para ARL y EPS con volumen alto y equipos médicos.',
    features: ['Hasta 500 casos/mes', '15 usuarios', 'Evaluación en lote (CSV)', 'Alertas avanzadas + RAG legal', 'Analytics completo', 'Soporte prioritario'],
    cta: 'Solicitar demo',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'A convenir',
    period: '',
    desc: 'Para grandes aseguradoras o ministerios con integración HR.',
    features: ['Casos ilimitados', 'Usuarios ilimitados', 'API + webhooks salientes', 'SLA 99.9%', 'Gerente de cuenta dedicado', 'Factura electrónica DIAN'],
    cta: 'Hablar con ventas',
    highlight: false,
  },
]

const PROBLEMS = [
  {
    icon: Activity,
    before: 'Horas revisando expedientes a mano',
    after: 'Evaluación causal en menos de 2 segundos',
  },
  {
    icon: Zap,
    before: 'Inconsistencias entre médicos laborales',
    after: 'Criterio estandarizado con IA + reglas duras',
  },
  {
    icon: Lock,
    before: 'Riesgo de sanciones SIC y litigios',
    after: 'Habeas Data Ley 1581 + trazabilidad legal completa',
  },
]

const STATS = [
  { value: '< 2s', label: 'Tiempo por evaluación' },
  { value: '6', label: 'Módulos integrados' },
  { value: '100%', label: 'Trazabilidad legal' },
  { value: 'Ley 100', label: 'Marco normativo' },
]

const TARGETS = [
  {
    icon: Shield, name: 'EPS',
    full: 'Entidades Promotoras de Salud',
    color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100',
    dot: '#2563eb',
  },
  {
    icon: Activity, name: 'ARL',
    full: 'Administradoras de Riesgos Laborales',
    color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100',
    dot: '#ea580c',
  },
  {
    icon: TrendingUp, name: 'AFP',
    full: 'Fondos de Pensiones y Cesantías',
    color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100',
    dot: '#9333ea',
  },
  {
    icon: Briefcase, name: 'Empleadores',
    full: 'Empresas y PYMES con nómina',
    color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100',
    dot: '#0d9488',
  },
  {
    icon: Building2, name: 'IPS',
    full: 'Instituciones Prestadoras de Salud',
    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100',
    dot: '#059669',
  },
  {
    icon: Brain, name: 'Médicos laborales',
    full: 'Especialistas en salud ocupacional',
    color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100',
    dot: '#db2777',
  },
]

const HOW_IT_WORKS = [
  {
    n: '01',
    title: 'Ingresa el caso',
    desc: 'Carga diagnóstico CIE-10, contingencia y datos del trabajador en un formulario guiado.',
    icon: FileText,
    accent: '#2563eb',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
  },
  {
    n: '02',
    title: 'Análisis causal IA',
    desc: 'Motor PC + Bayesiano evalúa causalidad y calcula score de riesgo en < 2 segundos.',
    icon: Brain,
    accent: '#9333ea',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
  },
  {
    n: '03',
    title: 'Sustento legal RAG',
    desc: 'El corpus normativo (Ley 100, Decreto 1507) respalda cada recomendación con citas exactas.',
    icon: Scale,
    accent: '#059669',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  {
    n: '04',
    title: 'Exporta y archiva',
    desc: 'Genera PDF trazable o exporta al sistema de nómina. Historial inmutable para auditorías.',
    icon: Award,
    accent: '#ea580c',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-100',
  },
]

/* ── Dot pattern helper ─────────────────────────────────────────────────── */
const dotBg = {
  backgroundColor: '#ffffff',
  backgroundImage: 'radial-gradient(circle, #dde3f0 1.2px, transparent 1.2px)',
  backgroundSize: '28px 28px',
}

const dotBgLight = {
  backgroundColor: '#f8faff',
  backgroundImage: 'radial-gradient(circle, #dde3f0 1.2px, transparent 1.2px)',
  backgroundSize: '28px 28px',
}

/* ── Component ──────────────────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <KausalIALogo size={28} />
          <div className="flex items-center gap-3">
            <a
              href="mailto:rafamaza56@gmail.com"
              className="text-sm text-gray-500 hover:text-brand-600 transition-colors hidden sm:block font-medium"
            >
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

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-24 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 40%, #1a0a3d 70%, #0f172a 100%)' }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full opacity-20 animate-float-slow pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b76f6 0%, transparent 70%)' }} />
        <div className="absolute top-32 right-[8%] w-56 h-56 rounded-full opacity-15 animate-float pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div className="absolute bottom-10 left-[30%] w-96 h-40 rounded-full opacity-10 animate-float-fast pointer-events-none"
          style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 bg-white/8 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              Motor de decisión clínica con causalidad real
              <span className="ml-1 bg-brand-500/30 text-brand-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">NUEVO</span>
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
            Evalúa incapacidades<br />
            <span
              className="inline-block"
              style={{
                background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              con inteligencia causal
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            KausalIA automatiza el análisis de incapacidades para EPS, ARL y empleadores en Colombia.
            Reduce tiempos, estandariza criterios y mantiene trazabilidad legal completa.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <a
              href="mailto:rafamaza56@gmail.com?subject=Demo KausalIA"
              className="btn-glow inline-flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-50 font-semibold px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-black/20"
            >
              Solicitar demo gratuita <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 text-white border border-white/20 font-medium px-7 py-3.5 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              Ver la plataforma →
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-white/40 text-xs font-medium">
            {['Habeas Data Ley 1581/2012', 'Multi-tenant seguro', 'Deploy en Railway', 'API REST lista'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/70" /> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #ffffff08)' }} />
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────── */}
      <section className="py-10 px-4 bg-gray-950 border-b border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tabular-nums">{value}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Indicado para ───────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Diseñado para el sistema de seguridad social colombiano
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">¿Para quién es KausalIA?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TARGETS.map(({ icon: Icon, name, full, color, bg, border, dot }) => (
              <div
                key={name}
                className={`group flex items-start gap-4 p-5 rounded-2xl border ${border} ${bg} hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-default`}
              >
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full mb-4">
              Proceso
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Cómo funciona</h2>
            <p className="text-gray-500 max-w-xl mx-auto">De la carga del caso al resultado legal en cuatro pasos. Sin configuración compleja.</p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[28px] left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-gray-200 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {HOW_IT_WORKS.map(({ n, title, desc, icon: Icon, accent, bg, text, border }) => (
                <div key={n} className="flex flex-col items-center text-center md:items-center">
                  {/* Circle */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg flex-shrink-0"
                    style={{ backgroundColor: accent, boxShadow: `0 8px 24px ${accent}40` }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {/* Step number */}
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">{n}</span>
                  <h3 className="font-bold text-gray-900 mb-2 text-[15px]">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Product mockup ──────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-600 bg-accent-50 px-3 py-1.5 rounded-full mb-4">
              Plataforma
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Diseñada para trabajo real</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Interfaz clara, flujos guiados y resultados accionables desde el primer día.</p>
          </div>

          <div className="relative">
            {/* Floating metric left */}
            <div
              className="absolute -left-4 lg:-left-8 top-1/3 bg-white rounded-2xl p-4 border border-gray-100 hidden lg:flex flex-col gap-0.5 z-20"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
            >
              <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">1.4s</div>
              <div className="text-xs text-gray-400 font-medium">Por evaluación</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-500 font-semibold">En vivo</span>
              </div>
            </div>

            {/* Floating metric right */}
            <div
              className="absolute -right-4 lg:-right-8 top-1/4 bg-white rounded-2xl p-4 border border-gray-100 hidden lg:block z-20"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
            >
              <div className="flex items-center gap-1 mb-1.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
              </div>
              <div className="text-xs font-semibold text-gray-800">Trazabilidad total</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Habeas Data Ley 1581</div>
            </div>

            {/* Browser frame */}
            <div
              className="rounded-2xl overflow-hidden border border-gray-200"
              style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)' }}
            >
              {/* Chrome bar */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-gray-400 flex items-center gap-2 border border-gray-200 max-w-xs w-full justify-center">
                    <Lock className="w-3 h-3 text-green-500" />
                    app.kausal-ia.co / casos / nueva-evaluación
                  </div>
                </div>
              </div>

              {/* App shell */}
              <div className="flex" style={{ minHeight: '400px', backgroundColor: '#f8fafc' }}>
                {/* Sidebar */}
                <div className="w-48 bg-gray-900 flex-shrink-0 p-4 hidden sm:flex flex-col">
                  <div className="flex items-center gap-2 mb-7 px-1">
                    <KausalIALogo size={16} />
                  </div>
                  {[
                    { label: 'Dashboard', icon: BarChart3, active: false },
                    { label: 'Nueva evaluación', icon: FileText, active: true },
                    { label: 'Mis casos', icon: Users, active: false },
                    { label: 'Alertas', icon: Bell, active: false },
                    { label: 'Biblioteca legal', icon: Scale, active: false },
                    { label: 'Reportes', icon: TrendingUp, active: false },
                  ].map(({ label, icon: Icon, active }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 cursor-default select-none ${
                        active ? 'bg-blue-600/20 text-blue-300' : 'text-gray-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-[11px] font-medium leading-tight">{label}</span>
                    </div>
                  ))}

                  <div className="mt-auto pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 px-2">
                      <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-white">DR</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-gray-300">Dr. Rodríguez</div>
                        <div className="text-[9px] text-gray-500">Médico laboral</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-5 overflow-hidden">
                  {/* Header bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-gray-900">Nueva evaluación de incapacidad</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">IA activa</span>
                      </div>
                      <div className="text-xs text-gray-400">Caso #2847 · Empresa: TechCorp SAS</div>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <div className="text-[11px] text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">Guardar borrador</div>
                      <div className="text-[11px] text-white bg-blue-600 px-3 py-1.5 rounded-lg font-semibold">Evaluar →</div>
                    </div>
                  </div>

                  {/* Form grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Diagnóstico CIE-10', value: 'M54.5 — Lumbago no especificado', filled: true },
                      { label: 'Tipo de contingencia', value: 'Enfermedad laboral', filled: true },
                      { label: 'Días de incapacidad', value: '15 días continuos', filled: true },
                      { label: 'EPS del paciente', value: 'Nueva EPS S.A.S.', filled: true },
                    ].map(({ label, value, filled }) => (
                      <div key={label} className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                        <div className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wide">{label}</div>
                        <div className={`text-xs font-semibold ${filled ? 'text-gray-800' : 'text-gray-300'}`}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Result panel */}
                  <div className="bg-white rounded-xl border border-emerald-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border-b border-emerald-100">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Resultado del análisis causal
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">✓ Completado en 1.4s</span>
                    </div>
                    <div className="p-4 flex items-start gap-5">
                      {/* Score ring */}
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#d1fae5" strokeWidth="3.5" />
                          <circle
                            cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3.5"
                            strokeDasharray="79 100" strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-emerald-600">79</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900 mb-1">Causalidad: Confirmada · Riesgo: Moderado</div>
                        <div className="text-xs text-gray-500 mb-2">Recomendación: Iniciar proceso de calificación PCL ante la ARL.</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                            <Scale className="w-2.5 h-2.5" /> Art. 30 Decreto 1507/2014
                          </span>
                          <span className="text-[10px] text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                            <Shield className="w-2.5 h-2.5" /> Ley 776/2002
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problema / Solución ─────────────────────────────────────── */}
      <section
        className="py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full mb-4">
              El problema
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Del proceso manual al criterio automatizado</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Tres problemas críticos que KausalIA resuelve desde el día uno.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROBLEMS.map(({ icon: Icon, before, after }) => (
              <div
                key={before}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lifted hover:-translate-y-1 transition-all duration-300 group"
              >
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-600 bg-accent-50 px-3 py-1.5 rounded-full mb-4">
              Funcionalidades
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Todo lo que necesitas, integrado</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Desde la evaluación causal hasta la exportación DIAN, en una sola plataforma.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, gradient, iconColor }, idx) => (
              <div
                key={title}
                className="group relative p-6 rounded-2xl border border-gray-100 bg-white hover:border-transparent hover:shadow-elevated transition-all duration-300 cursor-default overflow-hidden"
              >
                <span className="absolute top-4 right-5 text-[11px] font-bold text-gray-200 tabular-nums select-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
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
              { label: 'Ley 100 de 1993', sub: 'Sistema de Seguridad Social', icon: Shield },
              { label: 'Decreto 1507/2014', sub: 'Manual Único de Calificación', icon: FileText },
              { label: 'Ley 776 de 2002', sub: 'Normas prestaciones económicas', icon: Scale },
              { label: 'Ley 1581/2012', sub: 'Habeas Data — protección datos', icon: Lock },
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full mb-4">
              Precios
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Planes y precios</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Precios en COP + IVA. Sin permanencia mínima.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl transition-all duration-300 ${
                  plan.highlight
                    ? 'card-gradient-border shadow-2xl shadow-brand-500/20 scale-105 py-8 px-7'
                    : 'bg-white border border-gray-200 p-7 hover:shadow-lifted hover:-translate-y-1'
                }`}
              >
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
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:rafamaza56@gmail.com?subject=Plan KausalIA"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white hover:from-brand-700 hover:to-accent-700 shadow-lg shadow-brand-500/25 btn-glow'
                      : 'bg-gray-900 text-white hover:bg-gray-700'
                  }`}
                >
                  {plan.cta} <span className="ml-1">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────────────── */}
      <section
        className="relative py-24 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #1a0a3d 60%, #0a0f1e 100%)' }}
      >
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b76f6 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-white/8 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/15">
              <Sparkles className="w-3 h-3 text-yellow-400" /> Demo 30 minutos, sin costo
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            ¿Listo para automatizar tu gestión<br className="hidden sm:block" /> de incapacidades?
          </h2>
          <p className="text-white/50 mb-10 max-w-xl mx-auto">
            Agenda una demo y te mostramos el sistema con datos reales de tu sector.
          </p>
          <a
            href="mailto:rafamaza56@gmail.com?subject=Demo KausalIA"
            className="btn-glow inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl transition-all shadow-2xl shadow-black/40 text-base"
          >
            Solicitar demo gratuita <ArrowUpRight className="w-5 h-5" />
          </a>
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
            <a href="mailto:rafamaza56@gmail.com" className="hover:text-brand-600 transition-colors">Contacto</a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-brand-600 transition-colors"
            >
              ↑ Subir
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
