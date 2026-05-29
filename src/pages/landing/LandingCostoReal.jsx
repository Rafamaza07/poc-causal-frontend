import { useState } from 'react'
import { AlertTriangle, Clock, FileX, ArrowRight } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { trackEvent } from '../../utils/analytics'

// Valores de referencia del sector — NO son datos medidos de KausalIA
const COSTO_POR_CASO = 4500000   // COP promedio estimado
const DIAS_POR_CASO  = 45        // días promedio de gestión manual estimado
const PCT_DEMANDAS   = 38        // % estimado de casos que terminan en disputa

const TARJETAS = [
  {
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    label: 'Costo promedio por caso mal gestionado',
    value: '$4.500.000 COP',
    sub: 'Entre pasivos laborales, reprocesos y litigios*',
  },
  {
    icon: Clock,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    label: 'Tiempo perdido en gestión manual',
    value: '45 días promedio',
    sub: 'Por caso sin sistema de trazabilidad*',
  },
  {
    icon: FileX,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-900/20',
    label: 'Casos que terminan en disputa',
    value: '38% estimado',
    sub: 'Por vacíos documentales en el expediente*',
  },
]

export default function LandingCostoReal() {
  const { dark } = useTheme()
  const [empleados, setEmpleados] = useState('')
  const [resultado, setResultado] = useState(null)

  const calcular = () => {
    const n = parseInt(empleados.replace(/\D/g, ''), 10)
    if (!n || n <= 0) return
    // Estimación: ~8% de nómina tiene incapacidades prolongadas, 38% termina mal gestionada
    const casosAnuales = Math.round(n * 0.08)
    const casosMalGestionados = Math.round(casosAnuales * (PCT_DEMANDAS / 100))
    const perdidaAnual = casosMalGestionados * COSTO_POR_CASO
    setResultado({ casosAnuales, casosMalGestionados, perdidaAnual })
    trackEvent('landing_costo_calculate', { empleados: n })
  }

  const formatCOP = (n) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  return (
    <section
      id="costo-real"
      className="py-24 px-4"
      style={{
        background: dark
          ? 'linear-gradient(135deg, #0f172a 0%, #1a0614 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #fff1f2 0%, #fef2f2 50%, #fff7ed 100%)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className={`inline-block text-[11px] font-medium uppercase tracking-[0.12em] mb-4 ${dark ? 'text-red-500' : 'text-red-400'}`}>
            El costo real del problema
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>
            ¿Cuánto le está costando la gestión<br className="hidden sm:block" /> manual de incapacidades?
          </h2>
          <p className={`max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Cada mes sin trazabilidad es un mes acumulando pasivos. Estos son los números del sector.
          </p>
        </div>

        {/* Tarjetas de costo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {TARJETAS.map(({ icon: Icon, iconColor, iconBg, label, value, sub }) => (
            <div
              key={label}
              className="rounded-2xl p-6 border transition-all duration-200"
              style={{
                backgroundColor: dark ? '#1e293b' : '#ffffff',
                borderColor: dark ? 'rgba(51,65,85,0.8)' : 'rgba(254,202,202,0.8)',
                boxShadow: dark ? '0 2px 16px rgba(0,0,0,0.25)' : '0 2px 16px rgba(239,68,68,0.06)',
              }}
            >
              <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center mb-5`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <p className={`text-xs font-semibold mb-2 leading-snug ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
              <div className={`text-2xl font-extrabold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
              <p className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Calculadora */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            backgroundColor: dark ? '#1a2332' : '#ffffff',
            borderColor: dark ? 'rgba(51,65,85,0.8)' : 'rgba(229,231,235,0.8)',
            boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <h3 className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Calcula el impacto en tu empresa
          </h3>
          <p className={`text-sm mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Estimación basada en promedios del sector — los resultados reales varían según la organización.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="number"
              min="1"
              placeholder="N° de empleados activos"
              value={empleados}
              onChange={e => { setEmpleados(e.target.value); setResultado(null) }}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-colors ${
                dark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
            <button
              onClick={calcular}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-semibold px-7 py-3 rounded-xl transition-all text-sm shadow-sm"
            >
              Calcular pérdida estimada <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {resultado && (
            <div
              className={`rounded-xl p-5 border ${dark ? 'bg-red-900/10 border-red-800/40' : 'bg-red-50 border-red-100'}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className={`text-xs font-semibold mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Casos con incapacidad/año (est.)</p>
                  <p className={`text-xl font-extrabold ${dark ? 'text-white' : 'text-gray-900'}`}>{resultado.casosAnuales}</p>
                </div>
                <div>
                  <p className={`text-xs font-semibold mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Casos en riesgo de mal gestión</p>
                  <p className={`text-xl font-extrabold text-red-500`}>{resultado.casosMalGestionados}</p>
                </div>
                <div>
                  <p className={`text-xs font-semibold mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Pérdida estimada anual</p>
                  <p className={`text-xl font-extrabold text-red-500`}>{formatCOP(resultado.perdidaAnual)}</p>
                </div>
              </div>
              <p className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                * Estimaciones basadas en datos del sector SGSSS Colombia. No representan resultados garantizados.
              </p>
            </div>
          )}
        </div>

        {/* Frase de cierre */}
        <p className={`text-center mt-8 text-base font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
          Con KausalIA, ese costo se convierte en una ruta trazable y defendible en días, no en meses.
        </p>
        <p className={`text-center mt-2 text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
          * Estimaciones basadas en datos del sector SGSSS Colombia.
        </p>
      </div>
    </section>
  )
}
