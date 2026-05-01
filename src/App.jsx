import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Landing from './pages/Landing'
import PoliticaTratamiento from './pages/PoliticaTratamiento'
import Layout from './Components/Layout'
import PortalLayout from './Components/PortalLayout'
import { ToastProvider } from './Components/Toast'

const EvaluarLote            = lazy(() => import('./pages/EvaluarLote'))
const Dashboard              = lazy(() => import('./pages/Dashboard'))
const EvaluarPaciente        = lazy(() => import('./pages/EvaluarPaciente'))
const Historial              = lazy(() => import('./pages/Historial'))
const Comparar               = lazy(() => import('./pages/Comparar'))
const Logs                   = lazy(() => import('./pages/Logs'))
const Configuracion          = lazy(() => import('./pages/Configuracion'))
const Alertas                = lazy(() => import('./pages/Alertas'))
const Chat                   = lazy(() => import('./pages/Chat'))
const CasoDetalle            = lazy(() => import('./pages/CasoDetalle'))
const Reportes               = lazy(() => import('./pages/Reportes'))
const Analytics              = lazy(() => import('./pages/Analytics'))
const Normativa              = lazy(() => import('./pages/Normativa'))
const Aprobaciones           = lazy(() => import('./pages/Aprobaciones'))
const ModeloPerformance      = lazy(() => import('./pages/ModeloPerformance'))
const NotFound               = lazy(() => import('./pages/NotFound'))
const TraductorClinico       = lazy(() => import('./pages/TraductorClinico'))
const ResumenCasos           = lazy(() => import('./pages/ResumenCasos'))
const AdminAlertasPendientes = lazy(() => import('./pages/admin/AdminAlertasPendientes'))
const Biblioteca             = lazy(() => import('./pages/Biblioteca'))
const BibliotecaAdmin        = lazy(() => import('./pages/admin/BibliotecaAdmin'))

const PortalDashboard  = lazy(() => import('./pages/portal/PortalDashboard'))
const MiHistorial      = lazy(() => import('./pages/portal/MiHistorial'))
const MiCasoDetalle    = lazy(() => import('./pages/portal/MiCasoDetalle'))
const MisAlertas       = lazy(() => import('./pages/portal/MisAlertas'))
const GenerarDocumento = lazy(() => import('./pages/portal/GenerarDocumento'))
const MisDocumentos    = lazy(() => import('./pages/portal/MisDocumentos'))

const TITLE_MAP = {
  '/dashboard':    'Dashboard',
  '/evaluar':      'Evaluar caso',
  '/historial':    'Historial',
  '/alertas':      'Alertas',
  '/chat':         'Chat IA',
  '/analytics':    'Analytics',
  '/reportes':     'Reportes',
  '/normativa':         'Normativa',
  '/aprobaciones':      'Aprobaciones',
  '/modelo/performance':'Modelo IA',
  '/configuracion':     'Configuración',
  '/comparar':       'Comparar',
  '/evaluar/lote':   'Evaluación en lote',
  '/logs':           'Logs',
  '/traductor':      'Traductor clínico',
  '/resumen':                   'Resumen de casos',
  '/admin/alertas-pendientes':  'Alertas pendientes',
  '/biblioteca':                'Biblioteca legal',
  '/admin/biblioteca':          'Subir documento',
}

function TitleManager() {
  const location = useLocation()
  useEffect(() => {
    const match = location.pathname.match(/^\/historial\/(.+)/)
    const label = match
      ? `Caso ${match[1]}`
      : TITLE_MAP[location.pathname] ?? null
    document.title = label ? `${label} | KausalIA` : 'KausalIA'
  }, [location.pathname])
  return null
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
    </div>
  )
}

function PortalRoutes({ user, logout }) {
  return (
    <PortalLayout user={user} onLogout={logout}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                              element={<Navigate to="/portal" />} />
          <Route path="/login"                         element={<Navigate to="/portal" />} />
          <Route path="/portal"                        element={<PortalDashboard />} />
          <Route path="/portal/historial"              element={<MiHistorial />} />
          <Route path="/portal/historial/:id_caso"     element={<MiCasoDetalle />} />
          <Route path="/portal/alertas"                element={<MisAlertas />} />
          <Route path="/portal/documentos"             element={<MisDocumentos />} />
          <Route path="/portal/documentos/:id_caso"    element={<GenerarDocumento />} />
          <Route path="/portal/evaluar"                element={<EvaluarPaciente />} />
          <Route path="*"                              element={<Navigate to="/portal" />} />
        </Routes>
      </Suspense>
    </PortalLayout>
  )
}

function AppRoutes({ user, login, logout }) {
  const puede = (permiso) => user?.permisos?.includes(permiso)

  if (!user) {
    return (
      <Routes>
        <Route path="/"                     element={<Landing />} />
        <Route path="/login"                element={<Login onLogin={login} />} />
        <Route path="/politica-tratamiento" element={<PoliticaTratamiento />} />
        <Route path="*"                     element={<Navigate to="/" />} />
      </Routes>
    )
  }

  if (user.rol === 'cliente_final') {
    return <PortalRoutes user={user} logout={logout} />
  }

  return (
    <Layout user={user} onLogout={logout}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"          element={<Navigate to="/dashboard" />} />
          <Route path="/login"     element={<Navigate to="/dashboard" />} />
          <Route path="/politica-tratamiento" element={<PoliticaTratamiento />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/evaluar"      element={puede('evaluar') ? <EvaluarPaciente /> : <NoPermiso />} />
          <Route path="/evaluar/lote" element={puede('evaluar') ? <EvaluarLote /> : <NoPermiso />} />
          <Route path="/historial" element={puede('ver_historial') ? <Historial /> : <NoPermiso />} />
          <Route path="/historial/:id" element={puede('ver_historial') ? <CasoDetalle /> : <NoPermiso />} />
          <Route path="/comparar"  element={puede('comparar') ? <Comparar /> : <NoPermiso />} />
          <Route path="/logs"           element={puede('ver_logs') ? <Logs /> : <NoPermiso />} />
          <Route path="/configuracion" element={['admin','superadmin'].includes(user.rol) ? <Configuracion /> : <NoPermiso />} />
          <Route path="/alertas"       element={<Alertas />} />
          <Route path="/chat"          element={<Chat />} />
          <Route path="/reportes"      element={puede('exportar') ? <Reportes /> : <NoPermiso />} />
          <Route path="/analytics"     element={<Analytics />} />
          <Route path="/normativa"          element={<Normativa />} />
          <Route path="/aprobaciones"       element={['medico','admin','superadmin'].includes(user?.rol) ? <Aprobaciones /> : <NoPermiso />} />
          <Route path="/modelo/performance" element={['admin','superadmin'].includes(user?.rol) ? <ModeloPerformance /> : <NoPermiso />} />
          <Route path="/traductor"          element={<TraductorClinico />} />
          <Route path="/resumen"                   element={<ResumenCasos />} />
          <Route path="/admin/alertas-pendientes" element={['admin','superadmin'].includes(user?.rol) ? <AdminAlertasPendientes /> : <NoPermiso />} />
          <Route path="/biblioteca"              element={<Biblioteca />} />
          <Route path="/admin/biblioteca"        element={['admin','superadmin'].includes(user?.rol) ? <BibliotecaAdmin /> : <NoPermiso />} />
          <Route path="*"                         element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  const login = (u, token) => {
    localStorage.setItem('user', JSON.stringify(u))
    localStorage.setItem('token', token)
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <TitleManager />
        <AppRoutes user={user} login={login} logout={logout} />
      </BrowserRouter>
    </ToastProvider>
  )
}

function NoPermiso() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-xl font-bold text-gray-700">Sin permisos</h2>
      <p className="text-gray-500 mt-2">Tu rol no tiene acceso a esta sección.</p>
    </div>
  )
}
