import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Landing from './pages/Landing'
import EvaluarLote from './pages/EvaluarLote'
import Layout from "./Components/Layout"
import Dashboard from './pages/Dashboard'
import EvaluarPaciente from './pages/EvaluarPaciente'
import Historial from './pages/Historial'
import Comparar from './pages/Comparar'
import Logs from './pages/Logs'
import Configuracion from './pages/Configuracion'
import Alertas from './pages/Alertas'
import Chat from './pages/Chat'
import CasoDetalle from './pages/CasoDetalle'
import Reportes from './pages/Reportes'
import Analytics from './pages/Analytics'
import Normativa from './pages/Normativa'
import Aprobaciones from './pages/Aprobaciones'
import ModeloPerformance from './pages/ModeloPerformance'
import NotFound from './pages/NotFound'
import PoliticaTratamiento from './pages/PoliticaTratamiento'
import TraductorClinico from './pages/TraductorClinico'
import { ToastProvider } from './Components/Toast'

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

  return (
    <Layout user={user} onLogout={logout}>
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
        <Route path="/configuracion" element={user.rol === 'admin' ? <Configuracion /> : <NoPermiso />} />
        <Route path="/alertas"       element={<Alertas />} />
        <Route path="/chat"          element={<Chat />} />
        <Route path="/reportes"      element={puede('exportar') ? <Reportes /> : <NoPermiso />} />
        <Route path="/analytics"     element={<Analytics />} />
        <Route path="/normativa"          element={<Normativa />} />
        <Route path="/aprobaciones"       element={['medico','admin','superadmin'].includes(user?.rol) ? <Aprobaciones /> : <NoPermiso />} />
        <Route path="/modelo/performance" element={['admin','superadmin'].includes(user?.rol) ? <ModeloPerformance /> : <NoPermiso />} />
        <Route path="/traductor"          element={<TraductorClinico />} />
        <Route path="*"                   element={<NotFound />} />
      </Routes>
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
