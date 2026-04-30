import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard, Clock, Bell, FileText, LogOut, Menu, X, UserCheck,
} from 'lucide-react'
import KausalIALogo from './KausalIALogo'

const NAV = [
  { to: '/portal',           icon: LayoutDashboard, label: 'Mi resumen' },
  { to: '/portal/historial', icon: Clock,            label: 'Mis casos' },
  { to: '/portal/alertas',   icon: Bell,             label: 'Mis alertas' },
  { to: '/portal/documentos',icon: FileText,         label: 'Mis documentos' },
]

export default function PortalLayout({ user, onLogout, children }) {
  const [open, setOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  const handleLogout = () => { onLogout(); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top bar ────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Logo + badge */}
          <div className="flex items-center gap-2.5">
            <KausalIALogo size={22} />
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wide hidden sm:inline">
              Portal cliente
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to || (to !== '/portal' && location.pathname.startsWith(to))
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* User + logout */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">{user?.nombre || user?.usuario || 'Mi perfil'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setOpen(v => !v)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-3 pt-2 space-y-1">
            {NAV.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to || (to !== '/portal' && location.pathname.startsWith(to))
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              )
            })}
          </div>
        )}
      </header>

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="flex-1 pt-14">
        <div
          key={location.pathname}
          className="max-w-5xl mx-auto px-4 py-8 animate-page-in"
        >
          {children}
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white py-4 px-4 text-center text-xs text-gray-400">
        KausalIA · Portal Cliente Final · Datos protegidos bajo Ley 1581/2012
      </footer>
    </div>
  )
}
