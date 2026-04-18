import { useState, useEffect } from 'react'
import API from '../api/client'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ user, onLogout, children }) {
  const [alertCount, setAlertCount] = useState(0)

  useEffect(() => {
    API.get('/api/v1/alerts/summary')
      .then(r => setAlertCount(r.data?.unread ?? 0))
      .catch(() => {})
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} onLogout={onLogout} alertCount={alertCount} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 pb-24 md:pb-6">{children}</main>
      </div>
    </div>
  )
}
