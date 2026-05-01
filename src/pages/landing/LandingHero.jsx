import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import KausalIALogo from '../../Components/KausalIALogo'
import { useTheme } from '../../hooks/useTheme'
import {
  Sparkles, ArrowRight, UserCheck, CheckCircle,
  FileText, Scale, Lock, Brain, BarChart3,
  Bell, TrendingUp, Users,
} from 'lucide-react'

const PHRASES = [
  'Evalúa incapacidades',
  'Reduce sanciones',
  'Sustenta con RAG legal',
  'Automatiza la gestión',
]

export default function LandingHero() {
  const navigate = useNavigate()
  const { dark } = useTheme()
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  // Hold 3s → fade out
  useEffect(() => {
    const hold = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(hold)
  }, [phraseIdx])

  // After fade out (380ms) → swap phrase → fade in
  useEffect(() => {
    if (visible) return
    const swap = setTimeout(() => {
      setPhraseIdx(i => (i + 1) % PHRASES.length)
      setVisible(true)
    }, 380)
    return () => clearTimeout(swap)
  }, [visible])

  return (
    <section
      className="relative pt-28 pb-0 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 40%, #1a0a3d 70%, #0f172a 100%)' }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.10] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient orbs */}
      <div
        className="absolute top-20 left-[5%] w-80 h-80 rounded-full opacity-[0.18] animate-float-slow pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b76f6 0%, transparent 70%)', filter: 'blur(1px)' }}
      />
      <div
        className="absolute top-36 right-[5%] w-60 h-60 rounded-full opacity-[0.14] animate-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(1px)' }}
      />
      <div
        className="absolute bottom-24 left-1/2 w-96 h-48 rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #06b6d4 0%, transparent 70%)', transform: 'translateX(-50%)' }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center pb-28 pt-4">

          {/* ── Left: copy ─────────────────────────────────────────── */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <span
                className="inline-flex items-center gap-1.5 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,118,246,0.15) 0%, rgba(139,92,246,0.12) 100%)',
                  boxShadow: '0 0 20px rgba(59,118,246,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
                Motor de decisión clínica con causalidad real
                <span className="ml-1 bg-brand-500/30 text-brand-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  NUEVO
                </span>
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.08] tracking-tight mb-5 animate-slide-up font-display"
              style={{ animationDelay: '80ms' }}
            >
              {/* Crossfade phrase — fixed height prevents layout jump */}
              <span style={{ display: 'block', height: '1.15em', position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)',
                    transition: 'opacity 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s cubic-bezier(0.4,0,0.2,1)',
                    willChange: 'opacity, transform',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {PHRASES[phraseIdx]}
                </span>
              </span>

              {/* Gradient subtitle — always visible */}
              <span
                style={{
                  background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                con inteligencia causal
              </span>
            </h1>

            <p
              className="text-base sm:text-[17px] text-white/60 mb-8 leading-relaxed animate-slide-up"
              style={{ animationDelay: '160ms' }}
            >
              KausalIA automatiza el análisis de incapacidades para EPS, ARL y empleadores
              en Colombia. Reduce tiempos, estandariza criterios y da a cada trabajador un
              portal propio para gestionar su caso.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 mb-8 animate-slide-up"
              style={{ animationDelay: '240ms' }}
            >
              <a
                href="mailto:rafamaza56@gmail.com?subject=Demo KausalIA"
                className="btn-glow inline-flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-50 font-semibold px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-black/25"
              >
                Solicitar demo B2B <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => navigate('/login?type=trabajador')}
                className="inline-flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-medium px-7 py-3.5 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <UserCheck className="w-4 h-4" /> Portal cliente →
              </button>
            </div>

            {/* Trust indicators */}
            <div
              className="flex flex-wrap gap-4 text-white/40 text-xs font-medium animate-slide-up"
              style={{ animationDelay: '320ms' }}
            >
              {['Habeas Data Ley 1581', 'Multi-tenant seguro', 'Portal trabajador incluido', 'API REST lista'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400/70" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: product mockup (lg+) ───────────────────────────── */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '200ms' }}>

            {/* Floating metric card */}
            <div
              className="absolute -top-8 -left-6 z-20 bg-white rounded-2xl px-4 py-3 border border-gray-100 animate-float-slow"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)' }}
            >
              <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">1.4s</div>
              <div className="text-xs text-gray-400 font-medium">Por evaluación</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-500 font-semibold">En vivo</span>
              </div>
            </div>

            {/* Floating legal card */}
            <div
              className="absolute -bottom-4 -right-4 z-20 bg-white rounded-2xl px-4 py-3 border border-blue-100 animate-float"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)', animationDelay: '1s' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Scale className="w-3.5 h-3.5 text-blue-600" />
                <div className="text-xs font-bold text-gray-900">RAG Legal activo</div>
              </div>
              <div className="text-[10px] text-gray-500">Decreto 1507 · Ley 776 · Ley 100</div>
            </div>

            {/* Browser frame */}
            <div
              className="rounded-2xl overflow-hidden border border-white/10"
              style={{ boxShadow: '0 32px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)' }}
            >
              {/* Chrome */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white/10 rounded-md px-3 py-1 text-[10px] text-white/50 flex items-center gap-1.5 max-w-[180px] w-full justify-center">
                    <Lock className="w-2.5 h-2.5 text-green-400/80" /> app.kausal-ia.co
                  </div>
                </div>
              </div>

              {/* App UI */}
              <div className="flex bg-gray-950" style={{ minHeight: '360px' }}>
                {/* Sidebar */}
                <div className="w-40 bg-gray-900 flex-shrink-0 p-3">
                  <div className="flex items-center gap-1.5 mb-6 px-1 pt-1">
                    <KausalIALogo size={14} />
                  </div>
                  {[
                    { label: 'Dashboard',  icon: BarChart3, active: false },
                    { label: 'Evaluar caso', icon: FileText,  active: true },
                    { label: 'Mis casos',  icon: Users,    active: false },
                    { label: 'Alertas',    icon: Bell,     active: false },
                    { label: 'Normativa',  icon: Scale,    active: false },
                    { label: 'Analytics',  icon: TrendingUp, active: false },
                  ].map(({ label, icon: Icon, active }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-0.5 cursor-default select-none ${
                        active ? 'bg-blue-600/20 text-blue-300' : 'text-gray-600'
                      }`}
                    >
                      <Icon className="w-3 h-3 flex-shrink-0" />
                      <span className="text-[10px] font-medium">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Main */}
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-white">Nueva evaluación</span>
                      <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">IA activa</span>
                    </div>
                    <div className="text-[10px] text-white bg-blue-600 px-2.5 py-1 rounded-lg font-semibold cursor-default">Evaluar →</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { label: 'CIE-10',      value: 'M54.5 — Lumbago' },
                      { label: 'Contingencia', value: 'Enfermedad laboral' },
                      { label: 'Días',         value: '15 días continuos' },
                      { label: 'EPS',          value: 'Nueva EPS S.A.S.' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <div className="text-[9px] text-gray-500 mb-0.5">{label}</div>
                        <div className="text-[10px] font-semibold text-gray-200">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Result */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-emerald-500/20">
                      <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Análisis causal completado
                      </span>
                      <span className="text-[9px] text-emerald-400 font-bold">1.4s</span>
                    </div>
                    <div className="p-3 flex items-start gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="3.5" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3.5"
                            strokeDasharray="62 100" strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-emerald-400">62</span>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-white mb-1">Riesgo Moderado</div>
                        <div className="text-[9px] text-gray-400 mb-1.5">Iniciar calificación PCL ante ARL</div>
                        <div className="flex gap-1 flex-wrap">
                          <span className="text-[9px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-full font-medium">Art. 30 D.1507</span>
                          <span className="text-[9px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded-full font-medium">Ley 776/2002</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Wave separator — blends hero into next section */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none" style={{ lineHeight: 0 }}>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: '80px' }}
        >
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z"
            fill={dark ? '#111827' : '#ffffff'}
          />
        </svg>
      </div>
    </section>
  )
}
