/**
 * SCRATCH — borrar después de verificar visualmente el componente.
 * Corre con: npm run dev → ir a /scratch-grafo (agrega ruta temporalmente si hace falta,
 * o importar directamente en App.jsx como ruta de prueba).
 */
import CasoCausalGraph from '../Components/charts/CasoCausalGraph'

const TODO_OK = {
  id_caso: 'C-001',
  nodos: {
    cie10:  { label: 'M54.5 Lumbalgia', estado: 'confirmado',         detalle: 'Diagnóstico codificado' },
    rmn:    { label: 'Imagen presente', estado: 'presente',           detalle: 'Imágenes cargadas' },
    origen: { label: 'Origen Laboral 82%', estado: 'calificado_laboral', detalle: 'ARL calificó' },
    puesto: { label: 'Montacargas 8h/día', estado: 'analizado',        detalle: 'Riesgo: importante' },
  },
  aristas: [
    { from: 'cie10', to: 'origen', estado: 'confirmada',  explicacion: 'M54.5 compatible con esfuerzo lumbar' },
    { from: 'cie10', to: 'rmn',    estado: 'confirmada',  explicacion: 'Imágenes disponibles' },
    { from: 'puesto',to: 'origen', estado: 'confirmada',  explicacion: 'Oficio de riesgo soporta calificación' },
    { from: 'rmn',   to: 'puesto', estado: 'informativa', explicacion: '' },
  ],
  vacios_criticos: [],
  resumen: {
    recomendacion:    { label: 'Reincorporación con Terapias', prioridad: 'media' },
    probabilidad_ipp: { valor: 70, categoria: 'alta' },
    tutela_predictiva:{ recomendada: true, motivo: 'Si ARL no responde en 15 días' },
  },
}

const TODO_FALTANTE = {
  id_caso: 'C-002',
  nodos: {
    cie10:  { label: 'Sin CIE-10',    estado: 'no_codificado', detalle: 'Diagnóstico no codificado' },
    rmn:    { label: 'RMN faltante',  estado: 'faltante',      detalle: 'Imagen no cargada' },
    origen: { label: 'Sin calificar', estado: 'sin_calificar', detalle: 'Origen no determinado' },
    puesto: { label: 'Puesto no especificado', estado: 'sin_analisis', detalle: 'Sin análisis — Riesgo: moderado' },
  },
  aristas: [
    { from: 'cie10', to: 'origen', estado: 'faltante',    explicacion: 'Falta CIE-10 o tipo de enfermedad' },
    { from: 'cie10', to: 'rmn',    estado: 'faltante',    explicacion: 'Falta imagen que sustente diagnóstico' },
    { from: 'puesto',to: 'origen', estado: 'informativa', explicacion: 'Análisis de puesto pendiente' },
    { from: 'rmn',   to: 'puesto', estado: 'informativa', explicacion: '' },
  ],
  vacios_criticos: [
    { id: 'rmn_columna_lumbar',  titulo: 'RMN / Imágenes Diagnósticas',  estado: 'faltante', severidad: 'alta' },
    { id: 'estudio_puesto',      titulo: 'Estudio del Puesto de Trabajo', estado: 'faltante', severidad: 'alta' },
    { id: 'historia_ocupacional',titulo: 'Historia Clínica / Ocupacional',estado: 'faltante', severidad: 'media' },
    { id: 'concepto_rehab',      titulo: 'Concepto de Rehabilitación',    estado: 'faltante', severidad: 'media' },
  ],
  resumen: {
    recomendacion:    { label: 'Sin evaluación', prioridad: 'media' },
    probabilidad_ipp: { valor: 15, categoria: 'baja' },
    tutela_predictiva:{ recomendada: false, motivo: 'No requerida actualmente' },
  },
}

const MIXTO = {
  id_caso: 'C-003',
  nodos: {
    cie10:  { label: 'M54.5 Lumbalgia', estado: 'confirmado',         detalle: 'Diagnóstico codificado' },
    rmn:    { label: 'RMN faltante',    estado: 'faltante',           detalle: 'Imagen no cargada' },
    origen: { label: 'Origen Laboral 82%', estado: 'calificado_laboral', detalle: 'ARL calificó' },
    puesto: { label: 'Montacargas',    estado: 'parcial',             detalle: 'Análisis incompleto' },
  },
  aristas: [
    { from: 'cie10', to: 'origen', estado: 'confirmada',  explicacion: 'M54.5 compatible con origen laboral' },
    { from: 'cie10', to: 'rmn',    estado: 'faltante',    explicacion: 'Falta imagen que sustente diagnóstico' },
    { from: 'puesto',to: 'origen', estado: 'informativa', explicacion: 'Análisis de puesto incompleto' },
    { from: 'rmn',   to: 'puesto', estado: 'informativa', explicacion: '' },
  ],
  vacios_criticos: [
    { id: 'rmn_columna_lumbar', titulo: 'RMN / Imágenes Diagnósticas', estado: 'faltante', severidad: 'alta' },
  ],
  resumen: {
    recomendacion:    { label: 'RMN + Dictamen SST', prioridad: 'inmediata' },
    probabilidad_ipp: { valor: 82, categoria: 'alta' },
    tutela_predictiva:{ recomendada: true, motivo: 'Si ARL no responde en 15 días' },
  },
}

const PARCIAL = {
  id_caso: 'C-004',
  nodos: {
    cie10:  { label: 'G56.0 Túnel Carpiano', estado: 'confirmado',   detalle: 'Diagnóstico codificado' },
    rmn:    { label: 'Imagen presente',       estado: 'presente',     detalle: 'Imágenes cargadas' },
    origen: { label: 'Sin calificar',         estado: 'sin_calificar',detalle: 'Tipo: laboral, sin dictamen' },
    puesto: { label: 'Operaria ensamble',     estado: 'parcial',      detalle: 'Análisis incompleto' },
  },
  aristas: [
    { from: 'cie10', to: 'origen', estado: 'faltante',    explicacion: 'Falta dictamen para confirmar origen' },
    { from: 'cie10', to: 'rmn',    estado: 'confirmada',  explicacion: 'Imágenes disponibles' },
    { from: 'puesto',to: 'origen', estado: 'informativa', explicacion: 'Perfil de cargo no actualizado' },
    { from: 'rmn',   to: 'puesto', estado: 'informativa', explicacion: '' },
  ],
  vacios_criticos: [
    { id: 'estudio_puesto',      titulo: 'Estudio del Puesto de Trabajo', estado: 'faltante', severidad: 'alta' },
    { id: 'historia_ocupacional',titulo: 'Historia Clínica / Ocupacional',estado: 'faltante', severidad: 'media' },
    { id: 'concepto_rehab',      titulo: 'Concepto de Rehabilitación',    estado: 'pendiente',severidad: 'media' },
  ],
  resumen: {
    recomendacion:    { label: 'Continuar Incapacidad', prioridad: 'alta' },
    probabilidad_ipp: { valor: 40, categoria: 'media' },
    tutela_predictiva:{ recomendada: false, motivo: 'No requerida actualmente' },
  },
}

const ESCENARIOS = [
  { titulo: '✅ Todo confirmado', data: TODO_OK },
  { titulo: '❌ Todo faltante',   data: TODO_FALTANTE },
  { titulo: '⚠️ Mixto (RMN faltante)', data: MIXTO },
  { titulo: '🟡 Parcial (origen sin calificar)', data: PARCIAL },
]

export default function ScratchGrafo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <h1 className="text-xl font-bold text-gray-800">
        SCRATCH — CasoCausalGraph (borrar antes de Fase 3)
      </h1>
      {ESCENARIOS.map(({ titulo, data }) => (
        <section key={data.id_caso} className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{titulo}</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <CasoCausalGraph data={data} />
          </div>
        </section>
      ))}
    </div>
  )
}
