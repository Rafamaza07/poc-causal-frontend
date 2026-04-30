import { useState } from 'react'
import { FileText, CheckCircle, Scale, Bell, ChevronRight, AlertCircle, Clock, ArrowRight } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'

const TABS = [
  { id: 'evaluar',    label: 'Evaluar caso',  icon: FileText  },
  { id: 'resultado',  label: 'Ver resultado', icon: CheckCircle },
  { id: 'legal',      label: 'Base legal',    icon: Scale     },
  { id: 'alertas',    label: 'Alertas',       icon: Bell      },
]

/* ── Panel: Evaluar caso ────────────────────────────────────────────── */
function PanelEvaluar() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-white">Nueva evaluación</span>
        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">IA activa</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Cédula / ID', value: '1020 456 789', focus: false },
          { label: 'CIE-10', value: 'M54.5 — Lumbago', focus: true },
          { label: 'Días de incapacidad', value: '15 días continuos', focus: false },
          { label: 'Contingencia', value: 'Enfermedad laboral', focus: false },
          { label: 'EPS', value: 'Nueva EPS S.A.S.', focus: false },
          { label: 'ARL', value: 'Positiva S.A.', focus: false },
        ].map(({ label, value, focus }) => (
          <div
            key={label}
            className={`rounded-xl p-3 border transition-colors ${
              focus ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="text-[9px] text-gray-500 mb-0.5 uppercase tracking-wide">{label}</div>
            <div className={`text-[11px] font-semibold ${focus ? 'text-blue-300' : 'text-gray-200'}`}>{value}</div>
          </div>
        ))}
      </div>
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
        Evaluar con IA <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

/* ── Panel: Ver resultado ───────────────────────────────────────────── */
function PanelResultado() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-bold text-white">Análisis completado</span>
        <span className="text-[10px] text-emerald-400 font-bold ml-auto">1.4s</span>
      </div>
      {/* Risk ring */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="3.5" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3.5"
              strokeDasharray="62 100" strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-emerald-400">62</span>
        </div>
        <div>
          <div className="text-sm font-bold text-white mb-1">Riesgo Moderado</div>
          <div className="text-xs text-gray-400 mb-2">Iniciar calificación PCL ante ARL</div>
          <div className="flex gap-1 flex-wrap">
            <span className="text-[9px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-full">Art. 30 D.1507</span>
            <span className="text-[9px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded-full">Ley 776/2002</span>
          </div>
        </div>
      </div>
      {/* Recomendaciones */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Acciones recomendadas</div>
        {[
          'Solicitar concepto de rehabilitación a médico tratante',
          'Notificar a ARL dentro de los 2 días hábiles siguientes',
          'Programar seguimiento a los 30 días',
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Panel: Base legal ──────────────────────────────────────────────── */
function PanelLegal() {
  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Scale className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-bold text-white">Normativa aplicable</span>
        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold ml-auto">RAG activo</span>
      </div>
      {[
        {
          label: 'Decreto 1507/2014',
          desc: 'Manual Único para Calificación de la Pérdida de Capacidad Laboral',
          art: 'Arts. 28-35 aplicables',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
        },
        {
          label: 'Ley 776/2002',
          desc: 'Normas sobre la organización, administración y prestaciones del SGRP',
          art: 'Arts. 1-4 prestaciones económicas',
          color: 'text-purple-400',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
        },
        {
          label: 'Ley 100/1993',
          desc: 'Sistema de Seguridad Social Integral',
          art: 'Libro III — Riesgos profesionales',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
        },
        {
          label: 'Circular 021/2000 MinTrabajo',
          desc: 'Instrucciones sobre reintegro laboral',
          art: 'Obligación reintegro tras 180 días',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
        },
      ].map(({ label, desc, art, color, bg, border }) => (
        <div key={label} className={`rounded-xl p-3 border ${bg} ${border}`}>
          <div className={`text-[11px] font-bold mb-0.5 ${color}`}>{label}</div>
          <div className="text-[10px] text-gray-400 mb-1">{desc}</div>
          <div className="text-[9px] text-gray-500">{art}</div>
        </div>
      ))}
    </div>
  )
}

/* ── Panel: Alertas ─────────────────────────────────────────────────── */
function PanelAlertas() {
  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-bold text-white">Alertas del sistema</span>
        <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-bold ml-auto">2 urgentes</span>
      </div>
      {[
        {
          title: 'Hito 180 días — Reintegro',
          msg: 'La trabajadora Gómez cumple 180 días el 15/06. Debe reintegrarse o iniciar PCL.',
          sev: 'urgente',
          icon: AlertCircle,
          cls: 'bg-red-500/10 border-red-500/20',
          iconCls: 'text-red-400',
          badge: 'bg-red-500/20 text-red-300',
        },
        {
          title: 'Calificación PCL pendiente',
          msg: 'Caso #1042 lleva 90 días sin calificación de PCL ante ARL Positiva.',
          sev: 'importante',
          icon: AlertCircle,
          cls: 'bg-amber-500/10 border-amber-500/20',
          iconCls: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300',
        },
        {
          title: 'Documentación incompleta',
          msg: 'Caso #1051 no tiene historia clínica adjunta. Requerida para calificación.',
          sev: 'info',
          icon: Clock,
          cls: 'bg-blue-500/10 border-blue-500/20',
          iconCls: 'text-blue-400',
          badge: 'bg-blue-500/20 text-blue-300',
        },
      ].map(({ title, msg, sev, icon: Icon, cls, iconCls, badge }) => (
        <div key={title} className={`rounded-xl border p-3 ${cls}`}>
          <div className="flex items-start gap-2">
            <Icon className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${iconCls}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <span className="text-[11px] font-bold text-gray-200">{title}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${badge}`}>{sev}</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-snug">{msg}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const PANELS = {
  evaluar:   <PanelEvaluar />,
  resultado: <PanelResultado />,
  legal:     <PanelLegal />,
  alertas:   <PanelAlertas />,
}

export default function LandingTour() {
  const [active, setActive] = useState('evaluar')
  const headRef  = useScrollReveal({ threshold: 0.15, delay: 0 })
  const tourRef  = useScrollReveal({ threshold: 0.08, delay: 100 })

  return (
    <section className="py-24 px-4 bg-gray-950 border-t border-white/5">
      <div className="max-w-5xl mx-auto">

        <div ref={headRef} className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-400 mb-3">
            Product tour
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight mb-3">
            Así funciona KausalIA
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-[15px]">
            De la evaluación al documento legal en segundos. Sin formularios, sin ambigüedad.
          </p>
        </div>

        <div ref={tourRef} className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* Tab list */}
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TABS.map(({ id, label, icon: Icon }, idx) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-150 flex-shrink-0 lg:flex-shrink ${
                  active === id
                    ? 'bg-white text-gray-900 shadow-elevated'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  active === id ? 'bg-brand-500/15' : 'bg-white/5'
                }`}>
                  <Icon className={`w-3.5 h-3.5 ${active === id ? 'text-brand-600' : 'text-white/40'}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold whitespace-nowrap ${active === id ? 'text-gray-900' : ''}`}>
                      {label}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                      active === id ? 'bg-brand-100 text-brand-700' : 'bg-white/10 text-white/40'
                    }`}>
                      0{idx + 1}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Panel */}
          <div
            className="rounded-2xl overflow-hidden border border-white/10"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' }}
          >
            {/* Chrome bar */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-900 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[10px] text-white/30">app.kausal-ia.co</span>
              </div>
            </div>
            <div className="bg-gray-950 min-h-[340px]">
              {PANELS[active]}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
