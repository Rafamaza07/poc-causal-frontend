import { createContext, useContext, useState } from 'react'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  const login = (u, token) => {
    // Asegurar que refresh_token ya fue guardado por el caller (Login.jsx)
    localStorage.setItem('user', JSON.stringify(u))
    localStorage.setItem('token', token)
    setUser(u)
  }

  const esSuperadmin = () => user?.superadmin === true || user?.rol === 'superadmin'

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const puede = (permiso) => user?.permisos?.includes(permiso) ?? false

  return (
    <AuthCtx.Provider value={{ user, login, logout, puede, esSuperadmin }}>
      {children}
    </AuthCtx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx)
