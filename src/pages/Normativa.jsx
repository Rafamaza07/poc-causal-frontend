import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Scale } from 'lucide-react'
import LegalSearch from '../Components/LegalSearch'

// ── Static corpus catalog (mirrors services/legal_rag.py seed data) ───────────
const CORPUS = [
  {
    source: 'Ley 100/1993',
    description: 'Sistema General de Seguridad Social Integral',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    dot: 'bg-blue-500',
    articles: [
      { article: 'Art. 38',  title: 'Estado de invalidez' },
      { article: 'Art. 39',  title: 'Requisitos para obtener la pensión de invalidez' },
      { article: 'Art. 40',  title: 'Monto de la pensión de invalidez' },
      { article: 'Art. 41',  title: 'Calificación del estado de invalidez' },
      { article: 'Art. 42',  title: 'Revisión del estado de invalidez' },
      { article: 'Art. 46',  title: 'Pensión de sobrevivientes — requisitos' },
      { article: 'Art. 67',  title: 'Incapacidad temporal' },
      { article: 'Art. 152', title: 'Licencia de maternidad y enfermedad general' },
      { article: 'Art. 204', title: 'Monto y distribución de cotizaciones al sistema de salud' },
      { article: 'Art. 206', title: 'Prestaciones económicas por incapacidad — EPS' },
      { article: 'Art. 208', title: 'Incapacidad de origen profesional' },
    ],
  },
  {
    source: 'Decreto 1333/2021',
    description: 'Prórroga de incapacidades temporales superiores a 180 días',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    dot: 'bg-purple-500',
    articles: [
      { article: 'Art. 1', title: 'Objeto — Prórroga de incapacidades temporales' },
      { article: 'Art. 2', title: 'Definición de incapacidad temporal prolongada' },
      { article: 'Art. 3', title: 'Plazo máximo de incapacidad temporal (540 días)' },
      { article: 'Art. 4', title: 'Responsabilidad económica entre EPS y AFP' },
      { article: 'Art. 5', title: 'Proceso de rehabilitación durante incapacidad prolongada' },
      { article: 'Art. 6', title: 'Proceso de calificación al término de la incapacidad' },
      { article: 'Art. 7', title: 'Reintegro laboral post-incapacidad' },
      { article: 'Art. 8', title: 'Seguimiento y control de incapacidades' },
    ],
  },
  {
    source: 'Decreto 1507/2014',
    description: 'Manual Único para la Calificación de la Pérdida de Capacidad Laboral (PCL)',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    dot: 'bg-emerald-500',
    articles: [
      { article: 'Art. 1',  title: 'Objeto — Manual Único para la Calificación de PCL' },
      { article: 'Art. 2',  title: 'Definiciones — Pérdida de Capacidad Laboral (PCL)' },
      { article: 'Art. 3',  title: 'Criterios generales de calificación PCL' },
      { article: 'Art. 5',  title: 'Componente de deficiencia en la calificación PCL' },
      { article: 'Art. 6',  title: 'Componente de discapacidad en la calificación PCL' },
      { article: 'Art. 7',  title: 'Componente de minusvalía en la calificación PCL' },
      { article: 'Art. 8',  title: 'Calificación en primera oportunidad' },
      { article: 'Art. 9',  title: 'Recursos contra la calificación — Junta Regional' },
      { article: 'Art. 10', title: 'Junta Nacional de Invalidez — segunda instancia' },
      { article: 'Art. 11', title: 'Fecha de estructuración de la invalidez' },
      { article: 'Art. 15', title: 'Calificación de enfermedades músculo-esqueléticas' },
      { article: 'Art. 20', title: 'Calificación de enfermedades mentales y del comportamiento' },
    ],
  },
  {
    source: 'Decreto 019/2012',
    description: 'Eliminación de trámites y calificación de PCL',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    dot: 'bg-orange-500',
    articles: [
      { article: 'Art. 142', title: 'Calificación de PCL y determinación de invalidez' },
      { article: 'Art. 143', title: 'Eliminación de trámites innecesarios en incapacidades' },
      { article: 'Art. 144', title: 'Continuidad en el pago de incapacidades' },
    ],
  },
  {
    source: 'Ley 776/2002',
    description: 'Sistema General de Riesgos Laborales — prestaciones',
    color: 'bg-rose-50 border-rose-200 text-rose-700',
    dot: 'bg-rose-500',
    articles: [
      { article: 'Art. 1',  title: 'Incapacidad temporal por accidente de trabajo o enfermedad laboral' },
      { article: 'Art. 2',  title: 'Prestación económica por incapacidad temporal ARL' },
      { article: 'Art. 3',  title: 'Duración máxima de la incapacidad temporal ARL' },
      { article: 'Art. 7',  title: 'Incapacidad permanente parcial' },
      { article: 'Art. 8',  title: 'Pensión de invalidez por riesgo laboral' },
      { article: 'Art. 9',  title: 'Rehabilitación profesional' },
      { article: 'Art. 10', title: 'Auxilio funerario por riesgo laboral' },
    ],
  },
  {
    source: 'Ley 361/1997',
    description: 'Protección de personas con limitación — estabilidad laboral reforzada',
    color: 'bg-teal-50 border-teal-200 text-teal-700',
    dot: 'bg-teal-500',
    articles: [
      { article: 'Art. 4',  title: 'Clasificación de la limitación — moderada, severa y profunda' },
      { article: 'Art. 24', title: 'Adaptación de puestos de trabajo' },
      { article: 'Art. 26', title: 'Estabilidad laboral reforzada de personas con discapacidad' },
    ],
  },
]

const OTHER_NORMAS = [
  { source: 'CST (Código Sustantivo del Trabajo)', count: 4 },
  { source: 'Decreto 1295/1994',                  count: 4 },
  { source: 'Ley 1562/2012',                      count: 3 },
  { source: 'Decreto 1072/2015',                  count: 2 },
  { source: 'Decreto 1477/2014',                  count: 1 },
  { source: 'Resolución 2844/2007 (GATI)',         count: 2 },
  { source: 'Resolución 2346/2007',                count: 2 },
  { source: 'Jurisprudencia Corte Constitucional', count: 3 },
  { source: 'Circular 01/2004 Supersalud',         count: 2 },
  { source: 'Decreto 1406/1999',                   count: 1 },
]

// ── Norma card ─────────────────────────────────────────────────────────────────
function NormaCard({ norma }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${norma.color}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 p-4 text-left hover:opacity-90 transition-opacity"
      >
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${norma.dot}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug">{norma.source}</p>
          <p className="text-xs opacity-75 mt-0.5 leading-snug">{norma.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-medium opacity-70">
            {norma.articles.length} artículos
          </span>
          {open
            ? <ChevronUp className="w-4 h-4 opacity-60" />
            : <ChevronDown className="w-4 h-4 opacity-60" />
          }
        </div>
      </button>

      {open && (
        <div className="border-t border-current/10 divide-y divide-current/5">
          {norma.articles.map(art => (
            <div key={art.article} className="flex items-start gap-3 px-4 py-2.5">
              <span className="text-xs font-mono font-semibold opacity-80 flex-shrink-0 mt-px">
                {art.article}
              </span>
              <span className="text-xs opacity-90 leading-snug">{art.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Normativa() {
  const [showOthers, setShowOthers] = useState(false)

  const totalArticles = CORPUS.reduce((s, n) => s + n.articles.length, 0)
    + OTHER_NORMAS.reduce((s, n) => s + n.count, 0)

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Normativa colombiana</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalArticles} artículos indexados · búsqueda semántica por keywords
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Scale className="w-3.5 h-3.5" />
          Buscar en normativa
        </p>
        <LegalSearch />
      </div>

      {/* Corpus catalog */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          Normativa disponible en el sistema
        </h2>
        <div className="space-y-2">
          {CORPUS.map(norma => (
            <NormaCard key={norma.source} norma={norma} />
          ))}

          {/* Other normas */}
          <div className="border border-gray-100 rounded-xl bg-gray-50 overflow-hidden">
            <button
              onClick={() => setShowOthers(v => !v)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-100 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">Otras normas y jurisprudencia</p>
                <p className="text-xs text-gray-500 mt-0.5">CST, decretos, circulares, sentencias CC</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-500">
                  {OTHER_NORMAS.reduce((s, n) => s + n.count, 0)} artículos
                </span>
                {showOthers ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>
            {showOthers && (
              <div className="border-t border-gray-200 divide-y divide-gray-100">
                {OTHER_NORMAS.map(n => (
                  <div key={n.source} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-xs text-gray-600">{n.source}</span>
                    <span className="text-xs text-gray-400">{n.count} art.</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
