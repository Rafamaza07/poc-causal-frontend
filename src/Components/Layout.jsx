import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import API from '../api/client'
import Header from './Header'
import Sidebar from './Sidebar'
import OnboardingTour from './OnboardingTour'
import { useTheme } from '../hooks/useTheme'
import { registerAndSubscribe } from '../utils/push'

export default function Layout({ user, onLogout, children }) {
  const [alertCount, setAlertCount] = useState(0)
  const [aprobCount, setAprobCount] = useState(0)
  const [showTour, setShowTour] = useState(false)
  const location = useLocation()
  const { dark, mode, setMode } = useTheme()
  const intervalRef = useRef(null)

  // Polling 30s + pausa cuando pestaña está en background
  useEffect(() => {
    function fetchCounts() {
      API.get('/api/v1/alerts/summary')
        .then(r => setAlertCount(r.data?.unread ?? 0))
        .catch(() => {})
      if (['medico', 'admin', 'superadmin'].includes(user?.rol)) {
        API.get('/api/v1/aprobaciones/summary')
          .then(r => setAprobCount(r.data?.pendientes ?? 0))
          .catch(() => {})
      }
    }

    function handleVisibility() {
      if (document.hidden) {
        clearInterval(intervalRef.current)
      } else {
        fetchCounts()
        intervalRef.current = setInterval(fetchCounts, 30_000)
      }
    }

    fetchCounts()
    intervalRef.current = setInterval(fetchCounts, 30_000)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(intervalRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [user?.rol])

  // Registro Web Push (one-shot por sesión)
  useEffect(() => {
    if (user?.sub_id) registerAndSubscribe()
  }, [user?.sub_id])

  // Tour de onboarding (one-shot)
  useEffect(() => {
    if (!localStorage.getItem('tour_done')) {
      const t = setTimeout(() => setShowTour(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar user={user} onLogout={onLogout} alertCount={alertCount} aprobCount={aprobCount} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header user={user} onLogout={onLogout} dark={dark} mode={mode} onSetMode={setMode} />
        <main
          key={location.pathname}
          className="flex-1 overflow-auto p-6 pb-24 md:pb-6 animate-page-in"
        >
          {children}
        </main>
      </div>
      {showTour && <OnboardingTour onDone={() => setShowTour(false)} />}
    </div>
  )
}
