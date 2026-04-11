import { useState } from 'react'
import { Activity, User, Lock, ArrowRight } from 'lucide-react'
import API from '../api/client'

const HINTS = [
  { usuario: 'dr_garcia',   password: 'medico123',  rol: 'Médico'  },
  { usuario: 'ana_lopez',   password: 'empresa123', rol: 'RR.HH.' },
  { usuario: 'carlos_ruiz', password: 'legal123',   rol: 'Legal'   },
  { usuario: 'admin',       password: 'admin123',   rol: 'Admin'   },
]

export default function Login({ onLogin }) {
  const [form, setForm]       = useState({ usuario: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { data } = await API.post('/api/login', form)
      onLogin({
        usuario: data.usuario, nombre: data.nombre,
        rol: data.rol, permisos: data.permisos,
      }, data.access_token)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-3xl" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 shadow-glow mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight">IncapacidadIA</h1>
          <p className="text-blue-300/70 mt-2 text-sm">Sistema de Evaluación de Incapacidades</p>
        </div>

        {/* Tarjeta login */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-gray-800 text-xl font-semibold mb-6">Iniciar sesión</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Usuario</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={form.usuario}
                  onChange={e => setForm({...form, usuario: e.target.value})}
                  className="input pl-10"
                  placeholder="Ingresa tu usuario" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input pl-10"
                  placeholder="Ingresa tu contraseña" required />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-sm">
              {loading ? 'Ingresando...' : (
                <>Iniciar sesión <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Credenciales demo */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Credenciales de prueba</p>
            <div className="space-y-1.5">
              {HINTS.map(h => (
                <button key={h.usuario}
                  onClick={() => setForm({ usuario: h.usuario, password: h.password })}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg bg-gray-50 hover:bg-brand-50 hover:border-brand-200 border border-transparent transition-all duration-200 group">
                  <span className="text-xs font-mono text-gray-600 group-hover:text-brand-700">{h.usuario}</span>
                  <span className="float-right text-xs text-gray-400 group-hover:text-brand-500 font-medium">{h.rol}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
