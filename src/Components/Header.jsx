import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, Search, ChevronRight, LogOut, Settings,
  AlertTriangle, AlertCircle, Info, Sun, Moon,
} from 'lucide-react'
import API from '../api/client'
import { useDebounce } from '../hooks/useDebounce'
import { getScoreRange } from '../utils/constants'
import { formatDate, timeAgo } from '../utils/formatters'

const ROUTE_LABELS = {
  '/dashboard':    'Dashboard',
  '/evaluar':      'Evaluar Paciente',
  '/historial':    'Historial',
  '/comparar':     'Comparar',
  '/logs':         'Logs',
  '/configuracion':'Configuración',
  '/alertas':      'Alertas',
  '/chat':         'Chat IA',
  '/reportes':     'Reportes',
  '/analytics':    'Analytics',
  '/normativa':            'Normativa',
  '/aprobaciones':         'Aprobaciones',
  '/modelo/performance':   'Modelo IA',
  '/politica-tratamiento': 'Política de Privacidad',
}

const SEV_META = {
  CRITICAL: { Icon: AlertTriangle, color: 'text-red-500' },
  CRITICO:  { Icon: AlertTriangle, color: 'text-red-500' },
  WARNING:  { Icon: AlertCircle,   color: 'text-amber-500' },
  INFO:     { Icon: Info,          color: 'text-blue-500' },
}

function initials(nombre) {
  if (!nombre) return '??'
  const parts = nombre.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Header({ user, onLogout, dark = false, onToggleDark }) {
  const location = useLocation()
  const navigate = useNavigate()

  // ── Search ──────────────────────────────────────────────
  const [query, setQuery]               = useState('')
  const [results, setResults]           = useState([])
  const [searchBusy, setSearchBusy]     = useState(false)
  const [showSearch, setShowSearch]     = useState(false)
  const debouncedQuery                  = useDebounce(query, 400)
  const searchRef                       = useRef(null)

  // ── Bell ────────────────────────────────────────────────
  const [unread, setUnread]             = useState(0)
  const [recentAlerts, setRecentAlerts] = useState([])
  const [showBell, setShowBell]         = useState(false)
  const bellRef                         = useRef(null)

  // ── User menu ───────────────────────────────────────────
  const [showUser, setShowUser]         = useState(false)
  const userRef                         = useRef(null)

  const pageLabel = ROUTE_LABELS[location.pathname]
    ?? ROUTE_LABELS[Object.keys(ROUTE_LABELS).find(k => location.pathname.startsWith(k + '/'))]
    ?? 'Inicio'
  const avatarInitials = initials(user?.nombre)

  // Fetch alerts summary once on mount
  const fetchSummary = useCallback(async () => {
    try {
      const [sumRes, listRes] = await Promise.allSettled([
        API.get('/api/v1/alerts/summary'),
        API.get('/api/v1/alerts?limit=5'),
      ])
      if (sumRes.status === 'fulfilled')
        setUnread(sumRes.value.data?.unread ?? 0)
      if (listRes.status === 'fulfilled')
        setRecentAlerts(listRes.value.data?.alerts ?? listRes.value.data?.alertas ?? [])
    } catch {}
  }, [])

  useEffect(() => { fetchSummary() }, [fetchSummary])

  // Debounced search
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setResults([]); return }
    setSearchBusy(true)
    API.get(`/api/historial?busqueda=${encodeURIComponent(debouncedQuery)}&limite=5`)
      .then(r => setResults(r.data.casos?.slice(0, 5) ?? []))
      .catch(() => setResults([]))
      .finally(() => setSearchBusy(false))
  }, [debouncedQuery])

  // Close dropdowns on outside click
  useEffect(() => {
    const h = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false)
      if (bellRef.current   && !bellRef.current.contains(e.target))   setShowBell(false)
      if (userRef.current   && !userRef.current.contains(e.target))   setShowUser(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // ESC closes all
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') { setShowSearch(false); setShowBell(false); setShowUser(false) }
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [])

  const handleSelect = (caso) => {
    setShowSearch(false); setQuery(''); setResults([])
    navigate('/historial', { state: { selectedCase: caso.id_caso } })
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    onLogout()
  }

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center gap-3 sm:gap-4 flex-shrink-0">

      {/* ── Breadcrumb ── */}
      <nav className="hidden sm:flex items-center gap-1.5 text-sm flex-shrink-0">
        <span className="text-gray-400">Inicio</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
        <span className="font-medium text-gray-800">{pageLabel}</span>
      </nav>

      {/* ── Search ── */}
      <div ref={searchRef} className="flex-1 min-w-0 max-w-md mx-auto relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSearch(true) }}
            onFocus={() => setShowSearch(true)}
            placeholder="Buscar caso por ID..."
            className="w-full h-9 pl-9 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400
              transition-all placeholder:text-gray-400"
          />
        </div>

        {showSearch && query.length >= 2 && (
          <div className="absolute top-10 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lifted z-50 animate-slide-down overflow-hidden">
            {searchBusy && (
              <div className="p-3 space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />)}
              </div>
            )}
            {!searchBusy && results.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-400 text-center">Sin resultados</p>
            )}
            {!searchBusy && results.map(caso => {
              const range = getScoreRange(caso.score_causal ?? 0)
              return (
                <button
                  key={caso.id_caso}
                  onClick={() => handleSelect(caso)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors
                    text-left border-b last:border-0 border-gray-50"
                >
                  <span className="text-sm font-medium text-gray-800 flex-1 truncate">{caso.id_caso}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${range.bg} ${range.text}`}>
                    {Math.round(caso.score_causal ?? 0)}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {caso.fecha ? formatDate(caso.fecha) : '—'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Right side ── */}
      <div className="flex items-center gap-1 ml-auto flex-shrink-0">

        {/* Dark mode toggle */}
        {onToggleDark && (
          <button
            onClick={onToggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500
              hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title={dark ? 'Modo claro' : 'Modo oscuro'}
          >
            {dark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>
        )}

        {/* Bell */}
        <div ref={bellRef} className="relative" data-tour="bell">
          <button
            onClick={() => { setShowBell(!showBell); setShowUser(false) }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500
              hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px]
                min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center font-bold animate-scale-in">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>

          {showBell && (
            <div className="absolute top-11 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lifted z-50 animate-slide-down overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Alertas</span>
                {unread > 0 && (
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    {unread} sin leer
                  </span>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {recentAlerts.length === 0
                  ? <p className="px-4 py-5 text-sm text-gray-400 text-center">Sin alertas recientes</p>
                  : recentAlerts.map(a => {
                      const sev = (a.severity || a.nivel_alerta || 'INFO').toUpperCase()
                      const { Icon, color } = SEV_META[sev] ?? SEV_META.INFO
                      return (
                        <div key={a.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                          <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {a.title || a.mensaje || a.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {timeAgo(a.created_at || a.timestamp)}
                            </p>
                          </div>
                          {!a.is_read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      )
                    })
                }
              </div>

              <button
                onClick={() => { navigate('/alertas'); setShowBell(false) }}
                className="w-full px-4 py-2.5 text-sm font-medium text-brand-600 hover:bg-brand-50
                  transition-colors border-t border-gray-100"
              >
                Ver todas →
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-3" />

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => { setShowUser(!showUser); setShowBell(false) }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {avatarInitials}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[120px] truncate">
              {user?.nombre || user?.usuario}
            </span>
          </button>

          {showUser && (
            <div className="absolute top-11 right-0 w-52 bg-white border border-gray-200 rounded-xl shadow-lifted z-50 animate-slide-down overflow-hidden">
              <div className="px-3 py-2.5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-800 truncate">{user?.nombre}</p>
                <p className="text-[11px] text-gray-400 capitalize mt-0.5">{user?.rol}</p>
              </div>
              <div className="py-1">
                {user?.rol === 'admin' && (
                  <button
                    onClick={() => { navigate('/configuracion'); setShowUser(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-gray-400" />
                    Configuración
                  </button>
                )}
                <div className="h-px bg-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
