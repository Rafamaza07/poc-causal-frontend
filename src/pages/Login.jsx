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
      if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token)
      onLogin({
        usuario:    data.usuario,
        nombre:     data.nombre,
        rol:        data.rol,
        permisos:   data.permisos,
        tenant:     data.tenant,
        superadmin: data.superadmin ?? false,
        sub_id:     data.sub_id ?? null,
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
      <div
        className="hidden md:flex md:w-1/2 min-h-screen flex-col items-center justify-center px-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 40%, #1a0a3d 70%, #0f172a 100%)' }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        {/* Orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-20 animate-float-slow pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b76f6 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-15 animate-float pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-sm w-full">
          <div className="mb-8">
            <KausalIALogo size={42} dark />
          </div>

          <h2
            className="text-3xl font-extrabold mb-3 leading-tight"
            style={{
              background: 'linear-gradient(90deg, #ffffff, #a5b4fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Decisiones clínicas con causalidad real
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10">
            Evaluación inteligente de incapacidades laborales para EPS, ARL y empleadores en Colombia.
          </p>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-300" />
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
                className="w-full h-12 flex items-center justify-center gap-2 text-sm mt-2 rounded-xl text-white font-bold transition-all duration-200 btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #3b76f6, #6d28d9)' }}
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
