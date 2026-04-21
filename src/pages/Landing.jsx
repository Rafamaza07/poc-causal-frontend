import { useNavigate } from 'react-router-dom'
import {
  Brain, Shield, Scale, FileText, Bell, BarChart3,
  Users, CheckCircle, ArrowRight, Activity, Zap, Lock
} from 'lucide-react'

const FEATURES = [
  { icon: Brain,     title: 'Motor causal IA',        desc: 'Algoritmo PC con inferencia bayesiana — no correlaciones, causalidad real.' },
  { icon: Bell,      title: 'Alertas proactivas',     desc: 'Hitos legales EPS/ARL/AFP monitoreados automáticamente (90/120/180/540 días).' },
  { icon: Scale,     title: 'RAG Legal normativo',    desc: 'Ley 100, Decreto 1507, Ley 776 y más — sustento jurídico en cada evaluación.' },
  { icon: Users,     title: 'Multi-tenant',           desc: 'Cada EPS o empleador tiene su espacio aislado con control de roles granular.' },
  { icon: Shield,    title: 'Trazabilidad inmutable', desc: 'Cada evaluación es un INSERT; historial completo para auditorías legales.' },
  { icon: FileText,  title: 'Export PDF / Excel',     desc: 'Reportes individuales y portafolios consolidados con un clic.' },
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
  { icon: Activity, before: 'Horas revisando expedientes a mano', after: 'Evaluación causal en menos de 2 segundos' },
  { icon: Zap,      before: 'Inconsistencias entre médicos laborales', after: 'Criterio estandarizado con IA + reglas duras' },
  { icon: Lock,     before: 'Riesgo de sanciones SIC y litigios', after: 'Habeas Data Ley 1581 + trazabilidad legal completa' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">KausalIA</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="mailto:rafamaza56@gmail.com"
               className="text-sm text-gray-600 hover:text-brand-600 transition-colors hidden sm:block">
              Contactar
            </a>
            <button
              onClick={() => navigate('/login')}
              className="text-sm bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Iniciar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-brand-800 via-brand-700 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full mb-6 border border-white/20">
            <Zap className="w-3 h-3" /> Motor de decisión clínica con causalidad real
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Evalúa incapacidades laborales<br className="hidden sm:block" />
            <span className="text-brand-200"> con inteligencia causal</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            KausalIA automatiza el análisis de incapacidades para EPS, ARL y empleadores en Colombia.
            Reduce tiempos, estandariza criterios y mantiene trazabilidad legal completa.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:rafamaza56@gmail.com?subject=Demo KausalIA"
               className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 hover:bg-brand-50 font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg">
              Solicitar demo gratuita <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-medium px-6 py-3 rounded-xl transition-colors">
              Iniciar sesión
            </button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            {['Habeas Data Ley 1581/2012', 'Multi-tenant seguro', 'Deploy en Railway', 'API REST lista'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-brand-300" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problema / Solución ─────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Del proceso manual al criterio automatizado</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Tres problemas críticos que KausalIA resuelve desde el día uno.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROBLEMS.map(({ icon: Icon, before, after }) => (
              <div key={before} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <p className="text-sm text-red-500 line-through mb-2">{before}</p>
                <p className="text-sm font-semibold text-gray-900">{after}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Todo lo que necesitas, integrado</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Desde la evaluación causal hasta la exportación DIAN, en una sola plataforma.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-lifted transition-all">
                <div className="w-10 h-10 bg-brand-50 group-hover:bg-brand-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planes ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Planes y precios</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Precios en COP + IVA. Sin permanencia mínima.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name}
                   className={`rounded-2xl p-7 border flex flex-col ${
                     plan.highlight
                       ? 'bg-brand-700 border-brand-600 text-white shadow-lifted'
                       : 'bg-white border-gray-100 shadow-card'
                   }`}>
                {plan.highlight && (
                  <span className="self-start text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full mb-4">
                    MÁS POPULAR
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className={`text-3xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                  {plan.period && <span className={`text-sm mb-1 ${plan.highlight ? 'text-white/70' : 'text-gray-400'}`}>/{plan.period}</span>}
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-white/80' : 'text-gray-500'}`}>{plan.desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? 'text-white/90' : 'text-gray-600'}`}>
                      <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-brand-300' : 'text-brand-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="mailto:rafamaza56@gmail.com?subject=Plan KausalIA"
                   className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                     plan.highlight
                       ? 'bg-white text-brand-700 hover:bg-brand-50'
                       : 'bg-brand-600 text-white hover:bg-brand-700'
                   }`}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-r from-brand-700 to-indigo-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para automatizar tu gestión de incapacidades?</h2>
          <p className="text-white/80 mb-8">Agenda una demo de 30 minutos y te mostramos el sistema con datos reales.</p>
          <a href="mailto:rafamaza56@gmail.com?subject=Demo KausalIA"
             className="inline-flex items-center gap-2 bg-white text-brand-700 hover:bg-brand-50 font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg">
            Solicitar demo gratuita <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="py-8 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
              <Brain className="w-3 h-3 text-white" />
            </div>
            <span>KausalIA © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/politica-tratamiento" className="hover:text-brand-600 transition-colors">Política de datos</a>
            <a href="mailto:rafamaza56@gmail.com" className="hover:text-brand-600 transition-colors">Contacto</a>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-brand-600 transition-colors">
              Subir ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
