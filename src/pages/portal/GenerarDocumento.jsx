import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import {
  ArrowLeft, AlertCircle, FileText, CheckCircle,
  Send, Shield, ChevronRight,
} from 'lucide-react'
import API from '../../api/client'
import LoadingButton from '../../Components/LoadingButton'
import { Skeleton } from '../../Components/Skeleton'

const TIPO_META = {
  derecho_peticion: {
    label:  'Derecho de Petición',
    color:  'purple',
    desc:   'Documento formal para solicitar información o acción a entidades como EPS, ARL o empleador.',
  },
  tutela: {
    label:  'Acción de Tutela',
    color:  'rose',
    desc:   'Mecanismo legal para proteger derechos fundamentales cuando han sido vulnerados.',
  },
}

export default function GenerarDocumento() {
  const { id_caso }              = useParams()
  const [searchParams]           = useSearchParams()
  const tipo                     = searchParams.get('tipo') ?? 'derecho_peticion'
  const meta                     = TIPO_META[tipo] ?? TIPO_META.derecho_peticion

  const [elegib,  setElegib]  = useState(null)
  const [doc,     setDoc]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    API.get(`/api/v1/cliente/elegibilidad/${id_caso}`)
      .then(r => setElegib(r.data))
      .catch(() => setError('No se pudo verificar la elegibilidad.'))
      .finally(() => setLoading(false))
  }, [id_caso])

  const elegible = elegib?.[tipo]?.elegible ?? false

  const generar = async () => {
    setError(null)
    try {
      const r = await API.post(`/api/v1/cliente/documentos/${id_caso}`, { tipo })
      setDoc(r.data)
    } catch (e) {
      const msg = e.response?.data?.detail
      setError(
        e.response?.status === 429
          ? 'Límite de generación alcanzado. Intenta de nuevo en una hora.'
          : (msg ?? 'Error al generar el documento. Intenta de nuevo.')
      )
      throw e // LoadingButton necesita el throw para no mostrar "Listo"
    }
  }

  const marcarEnviado = async () => {
    await API.post(`/api/v1/cliente/documentos/${doc.id}/marcar-enviado`)
    setDoc(prev => ({ ...prev, estado: 'enviado' }))
  }

  const colorMap = {
    purple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', light: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: 'text-purple-500' },
    rose:   { bg: 'bg-rose-600',   hover: 'hover:bg-rose-700',   light: 'bg-rose-50 border-rose-200',     badge: 'bg-rose-100 text-rose-700',     icon: 'text-rose-500'   },
  }
  const c = colorMap[meta.color] ?? colorMap.purple

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Back */}
      <div>
        <Link
          to={`/portal/historial/${id_caso}`}
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al caso
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">{meta.label}</h1>
        <p className="text-sm text-gray-400 mt-1">{meta.desc}</p>
      </div>

      {/* Eligibility status */}
      {!elegible && elegib && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-gray-700 mb-1">Aún no cumples los requisitos</div>
              <p className="text-sm text-gray-500">{elegib[tipo]?.mensaje}</p>
              {tipo === 'tutela' && elegib[tipo]?.dias_faltantes > 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-300 rounded-full"
                      style={{ width: `${Math.min(100, ((elegib.dias_incapacidad ?? 0) / 90) * 100)}%` }}
                    />
                  </div>
                  <span className="tabular-nums flex-shrink-0">{elegib.dias_incapacidad ?? 0}/90 días</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generate panel */}
      {elegible && !doc && (
        <div className={`rounded-2xl border p-5 ${c.light}`}>
          <div className="flex items-center gap-3 mb-4">
            <FileText className={`w-5 h-5 ${c.icon}`} />
            <span className="font-bold text-gray-900 text-sm">Generar {meta.label}</span>
          </div>
          <p className="text-sm text-gray-600 mb-5">
            El sistema redactará el documento con base en tu caso y la normativa colombiana vigente.
            Revísalo con un abogado antes de radicarlo.
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}
          <LoadingButton
            onClick={generar}
            loadingLabel="Generando…"
            successLabel="Documento listo ✓"
            iconLeft={<FileText className="w-4 h-4" />}
            className={`text-sm font-bold text-white px-5 py-2.5 rounded-xl ${c.bg} ${c.hover}`}
          >
            Generar documento
          </LoadingButton>
        </div>
      )}

      {/* Document preview — A4 tipográfico (F5-4) */}
      {doc && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Barra de estado */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Vista previa del documento</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.estado === 'enviado' ? 'bg-emerald-100 text-emerald-700' : c.badge}`}>
                {doc.estado === 'enviado' ? 'Enviado' : 'Borrador'}
              </span>
            </div>

            {/* Contenedor scroll — simula hoja A4 */}
            <div className="p-4 sm:p-6 bg-gray-100 max-h-[70vh] overflow-y-auto">
              <div
                className="bg-white mx-auto shadow-lg border border-gray-200"
                style={{ maxWidth: '210mm', minHeight: '297mm', fontFamily: 'Georgia, serif' }}
              >
                {/* Membrete */}
                <div className="border-b-2 border-gray-800 px-10 pt-8 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                        Generado por
                      </p>
                      <p className="text-base font-extrabold text-gray-900 tracking-tight">KausalIA</p>
                      <p className="text-[10px] text-gray-500">
                        Motor de inferencia médico-laboral · Colombia
                      </p>
                    </div>
                    <div className="text-right text-[10px] text-gray-500 space-y-0.5">
                      <p className="font-semibold text-gray-700">{meta.label.toUpperCase()}</p>
                      <p>Ref. caso: <span className="font-mono">{id_caso}</span></p>
                      <p>Fecha: {new Date(doc.created_at || new Date().toISOString()).toLocaleDateString('es-CO', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}</p>
                      <p>Pág. <span className="font-semibold">1</span></p>
                    </div>
                  </div>
                </div>

                {/* Cuerpo del documento */}
                <div className="px-10 py-8">
                  <pre
                    className="whitespace-pre-wrap text-[11.5px] text-gray-800 leading-relaxed"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {doc.contenido}
                  </pre>
                </div>

                {/* Bloque de firma */}
                <div className="px-10 pb-10 pt-4 border-t border-gray-200 mt-8">
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <div className="h-10 border-b border-gray-400 mb-1" />
                      <p className="text-[10px] text-gray-500">Firma del titular / representante</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Nombre:</p>
                    </div>
                    <div>
                      <div className="h-10 border-b border-gray-400 mb-1" />
                      <p className="text-[10px] text-gray-500">Firma del profesional responsable</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Nombre:</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-6 text-center leading-relaxed">
                    Documento generado automáticamente por KausalIA con base en normativa colombiana vigente
                    (Ley 100/1993, Decreto 2463/2001, Decreto 1333/2021). No sustituye asesoría jurídica.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {doc.estado !== 'enviado' && (
              <LoadingButton
                onClick={marcarEnviado}
                loadingLabel="Registrando…"
                successLabel="Enviado ✓"
                iconLeft={<Send className="w-4 h-4" />}
                className="text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl"
              >
                Marcar como enviado
              </LoadingButton>
            )}
            {doc.estado === 'enviado' && (
              <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-5 py-2.5 rounded-xl">
                <CheckCircle className="w-4 h-4" /> Marcado como enviado
              </div>
            )}
            <Link
              to={`/portal/historial/${id_caso}`}
              className="inline-flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-800 px-5 py-2.5 rounded-xl border border-gray-200 bg-white transition-colors"
            >
              Ver mi caso <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-gray-400">
            <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            Documento generado con normativa colombiana vigente. Consúltalo con un abogado antes de radicarlo.
          </div>
        </div>
      )}
    </div>
  )
}
