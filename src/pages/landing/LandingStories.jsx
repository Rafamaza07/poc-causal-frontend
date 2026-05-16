import { ArrowRight, TrendingDown, Clock, AlertTriangle } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useTheme } from '../../hooks/useTheme'
import { trackEvent } from '../../utils/analytics'

const STORIES = [
  {
    tag: 'ARL · Gestión masiva',
    problem: 'Auditores revisaban hasta 60 casos al día de forma manual, con criterios inconsistentes entre profesionales.',
    metric: '4× más casos',
    metricSub: 'procesados por auditor/mes (estimado)',
    result: 'Criterio estandarizado con IA causal + sustento normativo automático en cada evaluación.',
    icon: TrendingDown,
    accent: '#059669',
    accentBg: 'rgba(5,150,105,0.10)',
  },
  {
    tag: 'EPS · Tiempos de respuesta',
    problem: 'Trabajadores esperaban 3-5 días para recibir concepto sobre su incapacidad y saber qué acción tomar.',
    metric: '< 2 segundos',
    metricSub: 'por evaluación completa con RAG legal',
    result: 'Portal individual entregado al trabajador con score, recomendación y documentos listos para radicar.',
    icon: Clock,
    accent: '#2563eb',
    accentBg: 'rgba(37,99,235,0.10)',
  },
  {
    tag: 'Empleador · Riesgo regulatorio',
    problem: 'Múltiples sanciones SIC por manejo incorrecto de datos de salud y falta de trazabilidad de decisiones.',
    metric: '100% trazable',
    metricSub: 'cada evaluación con usuario, fecha y normativa',
    result: 'Historial inmutable por caso, consentimiento Ley 1581 gestionado y logs de auditoría disponibles.',
    icon: AlertTriangle,
    accent: '#7c3aed',
    accentBg: 'rgba(124,58,237,0.10)',
  },
]

export default function LandingStories() {
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
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Casos de uso
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Resultados en operaciones reales
          </h2>
          <p className={`max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Cómo equipos de EPS, ARL y empleadores usan KausalIA para mejorar tiempos y reducir riesgo.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STORIES.map(({ tag, problem, metric, metricSub, result, icon: Icon, accent, accentBg }) => (
            <div
              key={tag}
              className="flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-1 group"
              style={{
                background: dark ? '#1f2937' : '#ffffff',
                borderColor: dark ? 'rgba(55,65,81,0.8)' : 'rgba(229,231,235,0.8)',
                boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = dark ? '0 12px 36px rgba(0,0,0,0.35)' : '0 12px 36px rgba(0,0,0,0.09)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              {/* Accent header */}
              <div className="px-5 pt-5 pb-4" style={{ background: accentBg }}>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: accentBg, color: accent, border: `1px solid ${accent}30` }}
                  >
                    {tag}
                  </span>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${accent}20` }}>
                    <Icon className="w-4 h-4" style={{ color: accent }} />
                  </div>
                </div>
                <div className="text-2xl font-extrabold tabular-nums" style={{ color: accent }}>{metric}</div>
                <div className={`text-[11px] mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{metricSub}</div>
              </div>

              {/* Body */}
              <div className="px-5 py-4 flex-1 flex flex-col gap-3">
                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>Antes</div>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{problem}</p>
                </div>
                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${dark ? 'text-emerald-600' : 'text-emerald-600'}`}>Con KausalIA</div>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{result}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <a
                  href="mailto:rafamaza56@gmail.com?subject=Demo KausalIA"
                  onClick={() => trackEvent('landing_story_click', { story: tag })}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  Solicitar caso completo <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
