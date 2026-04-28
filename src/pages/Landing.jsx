import { useNavigate } from 'react-router-dom'
import KausalIALogo from '../Components/KausalIALogo'
import {
  Brain, Shield, Scale, FileText, Bell, BarChart3,
  Users, CheckCircle, ArrowRight, Activity, Zap, Lock,
  Sparkles, ArrowUpRight, Star,
} from 'lucide-react'

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
    beforeColor: 'text-red-500',
    afterColor: 'text-emerald-600',
  },
  {
    icon: Zap,
    before: 'Inconsistencias entre médicos laborales',
    after: 'Criterio estandarizado con IA + reglas duras',
    beforeColor: 'text-red-500',
    afterColor: 'text-emerald-600',
  },
  {
    icon: Lock,
    before: 'Riesgo de sanciones SIC y litigios',
    after: 'Habeas Data Ley 1581 + trazabilidad legal completa',
    beforeColor: 'text-red-500',
    afterColor: 'text-emerald-600',
  },
]

const STATS = [
  { value: '< 2s', label: 'Tiempo por evaluación' },
  { value: '6', label: 'Módulos integrados' },
  { value: '100%', label: 'Trazabilidad legal' },
  { value: 'Ley 100', label: 'Marco normativo' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ──────────────────────────────────────────────── */}
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

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-24 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 40%, #1a0a3d 70%, #0f172a 100%)',
        }}
      >
        {/* Mesh / grid background */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full opacity-20 animate-float-slow pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b76f6 0%, transparent 70%)' }} />
        <div className="absolute top-32 right-[8%] w-56 h-56 rounded-full opacity-15 animate-float pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div className="absolute bottom-10 left-[30%] w-96 h-40 rounded-full opacity-10 animate-float-fast pointer-events-none"
          style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 bg-white/8 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              Motor de decisión clínica con causalidad real
              <span className="ml-1 bg-brand-500/30 text-brand-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">NUEVO</span>
            </span>
          </div>

          {/* Headline */}
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

          {/* CTAs */}
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

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-5 text-white/40 text-xs font-medium">
            {['Habeas Data Ley 1581/2012', 'Multi-tenant seguro', 'Deploy en Railway', 'API REST lista'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/70" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #ffffff08)' }} />
      </section>

      {/* ── Stats strip ─────────────────────────────────────────── */}
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

      {/* ── Problema / Solución ─────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full mb-4">
              El problema
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Del proceso manual al criterio automatizado</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Tres problemas críticos que KausalIA resuelve desde el día uno.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROBLEMS.map(({ icon: Icon, before, after, beforeColor, afterColor }) => (
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

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
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
                {/* Number */}
                <span className="absolute top-4 right-5 text-[11px] font-bold text-gray-200 tabular-nums select-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {/* Hover bg glow */}
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

      {/* ── Planes ──────────────────────────────────────────────── */}
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
            {PLANS.map((plan, idx) => (
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

      {/* ── CTA Final ───────────────────────────────────────────── */}
      <section
        className="relative py-24 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #1a0a3d 60%, #0a0f1e 100%)' }}
      >
        {/* Orbs */}
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b76f6 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
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

      {/* ── Footer ──────────────────────────────────────────────── */}
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
