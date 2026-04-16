import { NavLink } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import {
  LayoutDashboard, Stethoscope, ClipboardList, Scale,
  Search, Bell, LogOut, AlertTriangle, Activity, Clock, CheckCircle,
} from 'lucide-react'
import API from '../api/client'

const NAV_ICONS = {
  '/dashboard': LayoutDashboard,
  '/evaluar':   Stethoscope,
  '/historial': ClipboardList,
  '/comparar':  Scale,
  '/logs':      Search,
}

const SEV_STYLES = {
  URGENTE: 'bg-red-100 text-red-700 border-red-200',
  PRONTO:  'bg-amber-100 text-amber-700 border-amber-200',
  INFO:    'bg-blue-100 text-blue-700 border-blue-200',
}

export default function Layout({ user, onLogout, children }) {
  const [notifs, setNotifs]         = useState([])
  const [alertas, setAlertas]       = useState([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [tab, setTab]               = useState('alertas') // 'alertas' | 'criticos'

  const puede = (p) => user.permisos?.includes(p)

  const nav = [
    { to: '/dashboard', label: 'Dashboard',        permiso: null },
    { to: '/evaluar',   label: 'Evaluar Paciente', permiso: 'evaluar' },
    { to: '/historial', label: 'Historial',        permiso: 'ver_historial' },
    { to: '/comparar',  label: 'Comparar',         permiso: 'comparar' },
    { to: '/logs',      label: 'Auditoría',        permiso: 'ver_logs' },
  ].filter(n => !n.permiso || puede(n.permiso))

  const fetchAlertas = useCallback(() => {
    API.get('/api/alertas?solo_pendientes=true')
      .then(r => setAlertas(r.data.alertas || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    API.get('/api/notificaciones').then(r => setNotifs(r.data.notificaciones || [])).catch(() => {})
    fetchAlertas()
  }, [fetchAlertas])

  const acknowledge = async (id) => {
    try {
      await API.patch(`/api/alertas/${id}/acknowledge`)
      setAlertas(prev => prev.filter(a => a.id !== id))
    } catch {}
  }

  const totalBadge = alertas.length + notifs.length

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className="w-64 bg-gradient-to-b from-sidebar to-slate-900 flex flex-col flex-shrink-0">
        {/* Marca */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base tracking-tight">IncapacidadIA</h1>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-medium">Sistema de Evaluación</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 space-y-0.5 mt-2">
          {nav.map(n => {
            const Icon = NAV_ICONS[n.to] || LayoutDashboard
            return (
              <NavLink key={n.to} to={n.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600/90 text-white shadow-md shadow-brand-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.07]'
                  }`}>
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {n.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Usuario */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {(user.nombre||'?')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.nombre}</p>
              <p className="text-slate-400 text-xs capitalize">{user.rol}</p>
            </div>
          </div>
          <button onClick={onLogout}
            className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-sm px-2 py-1.5 rounded-lg hover:bg-white/[0.07] transition-all duration-200">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-8 py-3 flex justify-end items-center relative z-30">
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="relative flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100">
            <Bell className="w-[18px] h-[18px]" />
            <span className="hidden sm:inline">Notificaciones</span>
            {totalBadge > 0 && (
              <span className="absolute top-0.5 left-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-scale-in">
                {totalBadge}
              </span>
            )}
          </button>

          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute top-12 right-4 w-96 bg-white shadow-lifted rounded-xl border border-gray-200 z-50 animate-slide-down overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b">
                  <button
                    onClick={() => setTab('alertas')}
                    className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      tab === 'alertas' ? 'text-amber-700 border-b-2 border-amber-500 bg-amber-50/50' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    <Clock className="w-3.5 h-3.5" />
                    Hitos Legales {alertas.length > 0 && <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0 rounded-full">{alertas.length}</span>}
                  </button>
                  <button
                    onClick={() => setTab('criticos')}
                    className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      tab === 'criticos' ? 'text-red-700 border-b-2 border-red-500 bg-red-50/50' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Casos Críticos {notifs.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0 rounded-full">{notifs.length}</span>}
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {tab === 'alertas' && (
                    alertas.length === 0
                      ? <p className="p-5 text-sm text-gray-400 text-center">Sin hitos legales pendientes</p>
                      : alertas.map(a => (
                        <div key={a.id} className="p-3.5 border-b last:border-0 hover:bg-gray-50/60 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-gray-800">{a.id_caso}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${SEV_STYLES[a.severidad] || SEV_STYLES.INFO}`}>
                                  {a.severidad}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5 leading-snug">{a.milestone_tipo.replace('_', ' ')} — faltan <strong>{a.dias_restantes}</strong> días</p>
                              <p className="text-xs text-gray-400 mt-0.5">{a.dias_actuales} días actuales / hito en {a.dias_milestone}d</p>
                            </div>
                            <button
                              onClick={() => acknowledge(a.id)}
                              title="Marcar como gestionada"
                              className="flex-shrink-0 text-gray-400 hover:text-green-600 transition-colors p-1 rounded-lg hover:bg-green-50">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                  {tab === 'criticos' && (
                    notifs.length === 0
                      ? <p className="p-5 text-sm text-gray-400 text-center">No hay casos críticos</p>
                      : notifs.map(n => (
                        <div key={n.id} className="p-3.5 border-b last:border-0 hover:bg-red-50/50 transition-colors">
                          <p className="text-sm font-medium text-red-700">{n.id_caso}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.mensaje}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </>
          )}
        </header>

        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  )
}
