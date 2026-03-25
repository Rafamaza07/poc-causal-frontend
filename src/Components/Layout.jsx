import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import API from '../api/client'

export default function Layout({ user, onLogout, children }) {
  const [notifs, setNotifs] = useState([])
  const [showNotifs, setShowNotifs] = useState(false)

  const puede = (p) => user.permisos?.includes(p)

  const nav = [
    { to: '/dashboard', label: 'Dashboard',        icon: '📊', permiso: null },
    { to: '/evaluar',   label: 'Evaluar Paciente', icon: '🩺', permiso: 'evaluar' },
    { to: '/historial', label: 'Historial',        icon: '📋', permiso: 'ver_historial' },
    { to: '/comparar',  label: 'Comparar',         icon: '⚖️', permiso: 'comparar' },
    { to: '/logs',      label: 'Auditoría',        icon: '🔍', permiso: 'ver_logs' },
  ].filter(n => !n.permiso || puede(n.permiso))

  useEffect(() => {
    API.get('/api/notificaciones').then(r => setNotifs(r.data.notificaciones || [])).catch(() => {})
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-slate-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-white font-bold text-lg">IncapacidadIA</h1>
          <p className="text-slate-400 text-xs mt-1">Sistema de Evaluación</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
              <span>{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {(user.nombre||'?')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user.nombre}</p>
              <p className="text-slate-400 text-xs capitalize">{user.rol}</p>
            </div>
          </div>
          <button onClick={onLogout}
            className="w-full text-left text-slate-400 hover:text-white text-sm px-2 py-1 rounded transition-colors">
            ← Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior con notificaciones */}
        <header className="bg-white border-b border-gray-200 px-8 py-3 flex justify-end items-center relative">
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="relative flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
            🔔 Notificaciones
            {notifs.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {notifs.length}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute top-12 right-4 w-80 bg-white shadow-xl rounded-xl border border-gray-200 z-50">
              <div className="p-3 border-b font-medium text-sm text-gray-700">
                Casos Críticos ({notifs.length})
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="p-4 text-sm text-gray-400">No hay casos críticos</p>
                ) : notifs.map(n => (
                  <div key={n.id} className="p-3 border-b last:border-0 hover:bg-red-50">
                    <p className="text-sm font-medium text-red-700">{n.id_caso}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.mensaje}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  )
}
