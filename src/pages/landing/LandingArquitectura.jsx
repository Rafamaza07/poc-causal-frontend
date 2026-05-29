import { Download, ChevronDown } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { trackEvent } from '../../utils/analytics'

const DETALLES = [
  { label: 'Motor de inferencia causal', value: 'Algoritmo PC + inferencia bayesiana. Analiza causalidad real entre diagnóstico, contingencia y condición laboral — no correlaciones superficiales.' },
  { label: 'RAG Legal sobre corpus normativo', value: 'Recuperación aumentada de generación sobre Ley 100/1993, Decreto 1507/2014, Ley 776/2002, Ley 1562/2012 y circulares vigentes. Citas exactas en cada evaluación.' },
  { label: 'Arquitectura multi-tenant aislada', value: 'Cada organización tiene su propio espacio lógico en base de datos. Los datos de un cliente nunca se mezclan con los de otro. Acceso por roles granulares (médico, abogado, RRHH, admin).' },
  { label: 'Historial inmutable (INSERT-only)', value: 'Cada evaluación es un INSERT. No se pueden modificar ni eliminar registros pasados. El historial completo está disponible para auditorías legales con timestamp firmado.' },
  { label: 'Alertas por hitos normativos', value: 'Monitoreo automático de los hitos críticos: 90, 120, 180 y 540 días. Notificaciones proactivas antes del vencimiento para evitar pérdida de derechos o prolongación del caso.' },
  { label: 'Export PDF / Excel / API REST', value: 'Reportes individuales y portafolios en PDF con trazabilidad completa. Exportación masiva en Excel. API REST documentada con JWT para integración con HCE, nómina y ERP.' },
  { label: 'MUCI + CIE-10 integrado', value: 'El sistema entiende diagnósticos en código CIE-10 y los interpreta dentro del Manual Único de Calificación de Invalidez (MUCI), permitiendo análisis normativo preciso.' },
]

export default function LandingArquitectura() {
  const { dark } = useTheme()

  // PDF de ficha técnica — lo aporta Rafael en public/ficha-tecnica-kausalia.pdf
  // Cuando no exista, cambia fichaHref a: 'mailto:rafamaza56@gmail.com?subject=Ficha técnica KausalIA'
  const fichaHref = '/ficha-tecnica-kausalia.pdf'

  const handleFichaClick = () => {
    trackEvent('landing_ficha_download')
  }

  return (
    <section
      className="py-16 px-4 border-t"
      style={{
        backgroundColor: dark ? '#0f172a' : '#f8faff',
        borderColor: dark ? 'rgba(30,41,59,1)' : 'rgba(226,232,240,1)',
      }}
    >
      <div className="max-w-3xl mx-auto">
        <details className="group">
          <summary
            className={`flex items-center justify-between gap-3 cursor-pointer list-none py-4 select-none ${
              dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-sm font-semibold uppercase tracking-widest">Ver arquitectura técnica</span>
            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180 flex-shrink-0" />
          </summary>

          <div className="pt-6 pb-4 space-y-4">
            <p className={`text-sm mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Para equipos de TI, arquitectos de solución y directores de tecnología que necesitan validar la solidez técnica antes de decidir.
            </p>

            {DETALLES.map(({ label, value }) => (
              <div
                key={label}
                className={`rounded-xl p-5 border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{value}</p>
              </div>
            ))}

            <div className="pt-4">
              <a
                href={fichaHref}
                onClick={handleFichaClick}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all ${
                  dark
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Download className="w-4 h-4" /> Descargar ficha técnica (PDF)
              </a>
              <p className={`text-xs mt-2 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                Incluye módulos, normativa integrada, integraciones y preguntas de seguridad enterprise.
              </p>
            </div>
          </div>
        </details>
      </div>
    </section>
  )
}
