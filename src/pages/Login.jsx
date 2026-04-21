import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, Shield, Brain, Scale } from 'lucide-react'
import API from '../api/client'
import KausalIALogo from '../Components/KausalIALogo'

const FEATURES = [
  { icon: Shield, text: 'Aislamiento de datos por organización' },
  { icon: Brain,  text: 'Motor causal con IA integrada' },
  { icon: Scale,  text: 'Fundamentación legal automática' },
]

export default function Login({ onLogin }) {
  const [form, setForm]       = useState({ usuario: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [shake, setShake]     = useState(false)

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await API.post('/api/login', form)
      onLogin({
        usuario:  data.usuario,
        nombre:   data.nombre,
        rol:      data.rol,
        permisos: data.permisos,
        tenant:   data.tenant,
      }, data.access_token)
    } catch (err) {
      setError(err.response?.data?.detail || 'Credenciales inválidas')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
        .shake { animation: shake 0.5s ease-in-out; }
      `}</style>

      {/* ── Left column (desktop only) ──────────────────── */}
      <div className="hidden md:flex md:w-1/2 min-h-screen bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 flex-col items-center justify-center px-12 relative overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 max-w-sm w-full">
          {/* Logo */}
          <div className="mb-6">
            <KausalIALogo size={42} dark />
          </div>

          {/* Tagline */}
          <p className="text-white/90 text-lg font-medium leading-snug mb-10">
            Evaluación inteligente de incapacidades laborales
          </p>

          {/* Features */}
          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/70 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right column ─────────────────────────────────── */}
      <div className="flex-1 bg-white flex items-center justify-center px-8 sm:px-12 min-h-screen">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="flex md:hidden mb-8">
            <KausalIALogo size={26} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
          <p className="text-sm text-gray-500 mt-1 mb-8">Accede a tu cuenta</p>

          <form
            onSubmit={handleSubmit}
            className={shake ? 'shake' : ''}
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 animate-fade-in">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.usuario}
                    onChange={e => setForm({ ...form, usuario: e.target.value })}
                    className="input pl-10"
                    placeholder="Tu usuario"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="input pl-10 pr-10"
                    placeholder="Tu contraseña"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-12 flex items-center justify-center gap-2 text-sm mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Ingresando...
                  </>
                ) : 'Iniciar sesión'}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-400 text-center mt-12">
            Sistema exclusivo para entidades autorizadas
          </p>
          <p className="text-xs text-gray-400 text-center mt-2">
            <Link to="/politica-tratamiento" className="text-brand-600 hover:underline">
              Política de Tratamiento de Datos Personales
            </Link>
            {' '}—{' '}Ley 1581/2012
          </p>
        </div>
      </div>
    </div>
  )
}
