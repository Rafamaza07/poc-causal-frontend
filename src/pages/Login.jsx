import { useState } from 'react'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏥</div>
          <h1 className="text-white text-3xl font-bold">IncapacidadIA</h1>
          <p className="text-blue-200 mt-2">Sistema de Evaluación de Incapacidades</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-gray-800 text-xl font-semibold mb-6">Iniciar sesión</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input type="text" value={form.usuario}
                onChange={e => setForm({...form, usuario: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu usuario" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type="password" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors">
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-gray-500 mb-3 font-medium">Credenciales de prueba — clic para autocompletar:</p>
            <div className="space-y-2">
              {HINTS.map(h => (
                <button key={h.usuario}
                  onClick={() => setForm({ usuario: h.usuario, password: h.password })}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="text-xs font-mono text-gray-600">{h.usuario} / {h.password}</span>
                  <span className="float-right text-xs text-gray-400">{h.rol}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
