import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from "./Components/Layout"
import Dashboard from './pages/Dashboard'
import EvaluarPaciente from './pages/EvaluarPaciente'
import Historial from './pages/Historial'
import Comparar from './pages/Comparar'
import Logs from './pages/Logs'
import Configuracion from './pages/Configuracion'
import { ToastProvider } from './Components/Toast'

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
    setUser(null)
  }

  if (!user) return <Login onLogin={login} />

  const puede = (permiso) => user.permisos?.includes(permiso)

  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout user={user} onLogout={logout}>
          <Routes>
            <Route path="/"          element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/evaluar"   element={puede('evaluar') ? <EvaluarPaciente /> : <NoPermiso />} />
            <Route path="/historial" element={puede('ver_historial') ? <Historial /> : <NoPermiso />} />
            <Route path="/comparar"  element={puede('comparar') ? <Comparar /> : <NoPermiso />} />
            <Route path="/logs"           element={puede('ver_logs') ? <Logs /> : <NoPermiso />} />
            <Route path="/configuracion" element={user.rol === 'admin' ? <Configuracion /> : <NoPermiso />} />
          </Routes>
        </Layout>
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
