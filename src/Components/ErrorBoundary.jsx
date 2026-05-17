import { Component } from 'react'
import { ShieldAlert, RefreshCw, Phone } from 'lucide-react'

/**
 * ErrorBoundary global — captura errores de render en cualquier subtree de React.
 * Muestra un fallback médico-legal profesional sin exponer internals al usuario.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorId: null }
  }

  static getDerivedStateFromError() {
    // Genera un ID de correlación para facilitar soporte técnico
    const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`
    return { hasError: true, errorId }
  }

  componentDidCatch(error, info) {
    // Log estructurado sin PII — solo tipo de error y componente afectado
    console.error('[KausalIA] Error de interfaz capturado', {
      errorId: this.state.errorId,
      name: error?.name,
      componentStack: info?.componentStack?.split('\n').slice(0, 4).join(' | '),
    })
  }

  handleReload = () => {
    this.setState({ hasError: false, errorId: null })
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-md w-full p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-violet-600" />
          </div>

          {/* Heading */}
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Error inesperado en la aplicación
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Ocurrió un problema al cargar esta sección. Su información y casos evaluados
            están protegidos — este error no afecta los datos almacenados.
          </p>

          {/* Error ID */}
          <div className="bg-gray-50 rounded-lg px-4 py-2 mb-6 inline-block">
            <span className="text-xs text-gray-400 font-mono">
              Referencia: {this.state.errorId}
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700
                text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar aplicación
            </button>
            <a
              href="mailto:soporte@kausalia.com"
              className="w-full flex items-center justify-center gap-2 border border-gray-200
                text-gray-600 hover:text-gray-800 hover:border-gray-300 font-medium
                py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              Contactar soporte técnico
            </a>
          </div>

          {/* Legal note */}
          <p className="text-xs text-gray-400 mt-6 leading-relaxed">
            Si el problema persiste, comuníquese con el administrador de su organización
            indicando la referencia del error para asistencia prioritaria.
          </p>
        </div>
      </div>
    )
  }
}
