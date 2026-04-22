import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Activity,
  LayoutDashboard, FileSearch, Clock, Bell,
  MessageSquare, BarChart3, FileText, Settings, BookOpen,
  LogOut, ChevronLeft, ChevronRight, Menu, X,
  ClipboardCheck, Cpu, Layers, Stethoscope,
} from 'lucide-react'
import AlertBadge from './AlertBadge'
import BrandName from './BrandName'

const _badgeCount = (badge, alertCount, aprobCount) =>
  badge === 'aprobaciones' ? aprobCount : alertCount

const ALL_NAV = [
  { to: '/dashboard', label: 'Dashboard',    icon: LayoutDashboard, permiso: null },
  { to: '/evaluar',      label: 'Evaluar caso',  icon: FileSearch, permiso: 'evaluar' },
  { to: '/evaluar/lote', label: 'Eval. en lote', icon: Layers,     permiso: 'evaluar' },
  { to: '/historial',    label: 'Historial',      icon: Clock,      permiso: 'ver_historial' },
  { to: '/alertas',   label: 'Alertas',      icon: Bell,            permiso: null, badge: true },
  { to: '/chat',      label: 'Chat IA',      icon: MessageSquare,   permiso: null },
  { to: '/normativa',  label: 'Normativa',    icon: BookOpen,     permiso: null },
  { to: '/traductor',  label: 'Ajustes razonables', icon: Stethoscope, permiso: null },
  { to: '/analytics',  label: 'Analytics',    icon: BarChart3,    permiso: null },
  { to: '/reportes',  label: 'Reportes',     icon: FileText,        permiso: null },
  { to: '/aprobaciones',       label: 'Aprobaciones', icon: ClipboardCheck, permiso: null, rolesAllowed: ['medico', 'admin', 'superadmin'], badge: 'aprobaciones' },
  { to: '/logs',               label: 'Logs',          icon: Settings,  permiso: 'ver_logs' },
  { to: '/modelo/performance', label: 'Modelo IA',     icon: Cpu,        permiso: null, adminOnly: true },
  { to: '/configuracion',      label: 'Configuración', icon: Settings,  permiso: null, adminOnly: true },
]

const MOBILE_PRIMARY = ['/dashboard', '/evaluar', '/alertas', '/chat']

export default function Sidebar({ user, onLogout, alertCount = 0, aprobCount = 0 }) {
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 1024
  )
  const [drawerOpen, setDrawerOpen] = useState(false)


  const puede = (p) => !p || user.permisos?.includes(p)

  const nav = ALL_NAV.filter(n =>
    puede(n.permiso) &&
    (!n.adminOnly || ['admin', 'superadmin'].includes(user.rol)) &&
    (!n.rolesAllowed || n.rolesAllowed.includes(user.rol))
  )

  const initials = (user.nombre || '?')[0].toUpperCase()

  return (
    <>
      {/* ── Desktop sidebar ────────────────────────────── */}
      <aside
        data-tour="sidebar"
        style={{ width: collapsed ? 64 : 240 }}
        className="hidden md:flex flex-col flex-shrink-0 bg-sidebar transition-[width] duration-200 ease-out overflow-hidden"
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-white/10 flex-shrink-0 ${collapsed ? 'p-4 justify-center' : 'p-5 gap-3'}`}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0 shadow-glow">
            <Activity className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-fade-in">
              <h1 className="leading-tight"><BrandName className="text-white font-bold text-sm tracking-tight" /></h1>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-medium truncate">
                Sistema de Evaluación
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`mx-auto mt-3 mb-1 flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200 flex-shrink-0 ${collapsed ? 'ml-auto mr-auto' : 'ml-auto mr-3'}`}
        >
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5" />
            : <ChevronLeft className="w-3.5 h-3.5" />
          }
        </button>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto space-y-0.5 ${collapsed ? 'px-2 py-1' : 'px-3 py-1'}`}>
          {nav.map(n => {
            const Icon = n.icon
            return (
              <div key={`${n.to}-${n.label}`} className="relative group/item">
                <NavLink
                  to={n.to}
                  end={n.end !== false}
                  {...(n.to === '/evaluar' ? { 'data-tour': 'nav-evaluar' } : {})}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg transition-all duration-200 ${
                      collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3.5 py-2.5'
                    } text-sm font-medium ${
                      isActive
                        ? 'bg-brand-600/90 text-white shadow-sm shadow-brand-600/25'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.07]'
                    }`
                  }
                >
                  <div className="relative flex-shrink-0">
                    <Icon className="w-[18px] h-[18px]" />
                    {n.badge && collapsed && _badgeCount(n.badge, alertCount, aprobCount) > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white font-bold flex items-center justify-center">
                        {_badgeCount(n.badge, alertCount, aprobCount) > 9 ? '9+' : _badgeCount(n.badge, alertCount, aprobCount)}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <span className="flex-1 truncate">{n.label}</span>
                  )}
                  {!collapsed && n.badge && (
                    <AlertBadge count={_badgeCount(n.badge, alertCount, aprobCount)} />
                  )}
                </NavLink>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                    <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-soft flex items-center gap-2">
                      {n.label}
                      {n.badge && _badgeCount(n.badge, alertCount, aprobCount) > 0 && (
                        <span className="bg-red-500 text-white text-[9px] px-1.5 py-0 rounded-full font-bold">
                          {_badgeCount(n.badge, alertCount, aprobCount)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* User section */}
        <div className={`border-t border-white/10 flex-shrink-0 ${collapsed ? 'p-2' : 'p-4'}`}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate leading-tight">{user.nombre}</p>
                  <p className="text-slate-400 text-xs capitalize">{user.rol}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-sm px-2.5 py-1.5 rounded-lg hover:bg-white/[0.07] transition-all duration-200"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="relative group/logout flex justify-center">
              <button
                onClick={onLogout}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all duration-200"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 group-hover/logout:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-soft">
                  Cerrar sesión
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile bottom nav ─────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-sidebar border-t border-white/10 flex z-50">
        {nav
          .filter(n => MOBILE_PRIMARY.includes(n.to))
          .slice(0, 4)
          .map(n => {
            const Icon = n.icon
            return (
              <NavLink
                key={`${n.to}-mobile`}
                to={n.to}
                end={n.end !== false}
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-medium transition-colors duration-150 ${
                    isActive ? 'text-brand-400' : 'text-slate-500 hover:text-slate-300'
                  }`
                }
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {n.badge && _badgeCount(n.badge, alertCount, aprobCount) > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </div>
                <span>{n.label}</span>
              </NavLink>
            )
          })}

        {/* Menú — opens drawer */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-medium text-slate-500 hover:text-slate-300 transition-colors duration-150"
        >
          <Menu className="w-5 h-5" />
          <span>Menú</span>
        </button>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────── */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-[60] animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Panel */}
          <div className="md:hidden fixed bottom-0 inset-x-0 bg-sidebar rounded-t-2xl z-[70] animate-slide-up pb-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <BrandName className="text-white font-semibold text-sm" />
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="grid grid-cols-2 gap-1 px-4 py-3">
              {nav.map(n => {
                const Icon = n.icon
                return (
                  <NavLink
                    key={`drawer-${n.to}`}
                    to={n.to}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-brand-600/90 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.07]'
                      }`
                    }
                  >
                    <div className="relative flex-shrink-0">
                      <Icon className="w-4 h-4" />
                      {n.badge && alertCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                      )}
                    </div>
                    <span>{n.label}</span>
                  </NavLink>
                )
              })}
            </nav>
            <div className="px-4 pb-4">
              <button
                onClick={() => { setDrawerOpen(false); onLogout() }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
