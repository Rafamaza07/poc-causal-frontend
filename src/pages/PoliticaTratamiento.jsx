import { Shield, Mail, Clock, Database, Lock, Users, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    id: 'responsable',
    icon: Users,
    title: '1. Responsable del Tratamiento',
    content: (
      <div className="space-y-2 text-sm text-gray-700">
        <p><span className="font-medium">Empresa:</span> KausalIA [razón social pendiente de completar]</p>
        <p><span className="font-medium">Correo de atención:</span>{' '}
          <a href="mailto:privacidad@kausalia.com" className="text-brand-600 underline">
            privacidad@kausalia.com
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          <strong>AVISO:</strong> Este documento es un borrador sujeto a revisión por abogado antes de su vigencia oficial.
        </p>
      </div>
    ),
  },
  {
    id: 'finalidades',
    icon: FileText,
    title: '2. Finalidades del Tratamiento',
    content: (
      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
        <li>Evaluación de incapacidades laborales mediante IA (Decreto 1507/2014)</li>
        <li>Gestión de historial médico-laboral ante EPS, ARL y AFP</li>
        <li>Cumplimiento normativo — Ley 100/1993, Decreto 1333/2021</li>
        <li>Estadísticas y mejora del servicio (solo datos anonimizados)</li>
        <li>Auditoría y trazabilidad legal en procesos de calificación PCL</li>
      </ol>
    ),
  },
  {
    id: 'datos',
    icon: Database,
    title: '3. Datos Personales Tratados',
    content: (
      <div className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 border border-gray-200 font-semibold">Categoría</th>
                <th className="text-left px-3 py-2 border border-gray-200 font-semibold">Datos específicos</th>
                <th className="text-left px-3 py-2 border border-gray-200 font-semibold">¿Sensible?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Identificación</td>
                <td className="px-3 py-2 border border-gray-200">Nombre, cédula, correo</td>
                <td className="px-3 py-2 border border-gray-200">No</td>
              </tr>
              <tr className="bg-red-50">
                <td className="px-3 py-2 border border-gray-200 font-medium text-red-700">Salud</td>
                <td className="px-3 py-2 border border-gray-200 text-red-700">
                  Diagnóstico CIE-10, días de incapacidad, PCL, pronóstico, comorbilidades, tratamiento activo
                </td>
                <td className="px-3 py-2 border border-gray-200 font-bold text-red-700">SÍ</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Laboral</td>
                <td className="px-3 py-2 border border-gray-200">Empleador, tipo de enfermedad, cargo</td>
                <td className="px-3 py-2 border border-gray-200">No</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Técnicos</td>
                <td className="px-3 py-2 border border-gray-200">IP, agente de navegador, logs de acceso</td>
                <td className="px-3 py-2 border border-gray-200">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: 'arco',
    icon: Shield,
    title: '4. Derechos del Titular (ARCO)',
    content: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>Conforme al artículo 8 de la Ley 1581/2012, usted tiene derecho a:</p>
        <ul className="space-y-1.5">
          {[
            ['Acceso', 'Conocer todos los datos que tratamos sobre usted.'],
            ['Rectificación', 'Corregir datos inexactos o incompletos.'],
            ['Cancelación', 'Solicitar la anonimización de sus datos (los registros se conservan por auditoría legal).'],
            ['Oposición', 'Oponerse a tratamientos específicos no declarados.'],
          ].map(([tipo, desc]) => (
            <li key={tipo} className="flex gap-2">
              <span className="font-semibold text-brand-700 min-w-[90px]">{tipo}:</span>
              <span>{desc}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 p-3 bg-brand-50 rounded-lg border border-brand-100">
          <p className="text-xs font-medium text-brand-800">
            Canal de atención:{' '}
            <a href="mailto:privacidad@kausalia.com" className="underline">
              privacidad@kausalia.com
            </a>
          </p>
          <p className="text-xs text-brand-700 mt-1">
            Tiempo de respuesta: <strong>10 días hábiles</strong> (Ley 1581/2012, Art. 15)
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'bases',
    icon: FileText,
    title: '5. Bases Legales',
    content: (
      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
        <li><strong>Consentimiento explícito del titular</strong> — Art. 9 Ley 1581/2012</li>
        <li><strong>Cumplimiento de obligación legal</strong> — Decreto 1333/2021, Ley 776/2002</li>
        <li><strong>Interés legítimo</strong> — mejora del servicio con datos anonimizados</li>
      </ol>
    ),
  },
  {
    id: 'conservacion',
    icon: Clock,
    title: '6. Tiempo de Conservación',
    content: (
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-3 py-2 border border-gray-200 font-semibold">Tipo de dato</th>
              <th className="text-left px-3 py-2 border border-gray-200 font-semibold">Tiempo</th>
              <th className="text-left px-3 py-2 border border-gray-200 font-semibold">Sustento</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Evaluaciones de incapacidad', '20 años', 'Decreto 1333/2021'],
              ['Logs de auditoría', '10 años', 'Código de Comercio Art. 60'],
              ['Consentimientos', 'Hasta revocación', 'Ley 1581/2012'],
              ['Chat IA', '1 año', 'Interés legítimo'],
            ].map(([tipo, tiempo, sustento]) => (
              <tr key={tipo}>
                <td className="px-3 py-2 border border-gray-200">{tipo}</td>
                <td className="px-3 py-2 border border-gray-200 font-medium">{tiempo}</td>
                <td className="px-3 py-2 border border-gray-200 text-gray-500">{sustento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: 'seguridad',
    icon: Lock,
    title: '7. Medidas de Seguridad',
    content: (
      <ul className="space-y-1.5 text-sm text-gray-700">
        {[
          'Cifrado en tránsito: HTTPS/TLS 1.3',
          'Cifrado en reposo: PostgreSQL con cifrado de volumen',
          'Multi-tenancy estricto: datos de un cliente son invisibles para otro',
          'Control de acceso por roles (médico, empresa, legal, admin)',
          'Log inmutable de todos los accesos a datos personales',
          'Rate limiting: máximo 5 intentos de login por minuto',
          'Contraseñas almacenadas con bcrypt (factor de coste 12)',
        ].map(item => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'transferencias',
    icon: Database,
    title: '8. Transferencias Internacionales',
    content: (
      <div className="space-y-2 text-sm text-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 border border-gray-200 font-semibold">Receptor</th>
                <th className="text-left px-3 py-2 border border-gray-200 font-semibold">País</th>
                <th className="text-left px-3 py-2 border border-gray-200 font-semibold">Finalidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Railway</td>
                <td className="px-3 py-2 border border-gray-200">EE. UU.</td>
                <td className="px-3 py-2 border border-gray-200">Infraestructura de almacenamiento</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Groq Inc.</td>
                <td className="px-3 py-2 border border-gray-200">EE. UU.</td>
                <td className="px-3 py-2 border border-gray-200">
                  IA — solo texto clínico <em>sin nombre ni cédula del titular</em>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: 'contacto',
    icon: Mail,
    title: '9. Contacto y Vigencia',
    content: (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          Esta política rige desde el <strong>18 de abril de 2026</strong> — Versión 1.0.
        </p>
        <p>
          Para ejercer sus derechos ARCO o resolver dudas:{' '}
          <a href="mailto:privacidad@kausalia.com" className="text-brand-600 underline">
            privacidad@kausalia.com
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <strong>Aviso legal:</strong> Este documento es un borrador. Debe ser revisado y aprobado
          por un abogado especializado en protección de datos antes de su vigencia oficial conforme
          a la Ley 1581/2012 y el Decreto 1377/2013.
        </p>
      </div>
    ),
  },
]

export default function PoliticaTratamiento() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-700 text-white">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-8 h-8 text-brand-200" />
            <div>
              <p className="text-brand-200 text-xs font-medium uppercase tracking-wide">
                KausalIA
              </p>
              <h1 className="text-2xl font-bold">Política de Tratamiento de Datos Personales</h1>
            </div>
          </div>
          <p className="text-brand-200 text-sm">
            Ley 1581/2012 · Decreto 1377/2013 · Circular SIC 002/2015 — Versión 1.0
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {SECTIONS.map(({ id, icon: Icon, title, content }) => (
          <div key={id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <Icon className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
            </div>
            <div className="px-5 py-4">
              {content}
            </div>
          </div>
        ))}

        {/* Back to login */}
        <div className="text-center py-4">
          <Link
            to="/login"
            className="text-sm text-brand-600 hover:underline"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
