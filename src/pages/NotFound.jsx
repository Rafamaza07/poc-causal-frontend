import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4 animate-fade-in">
      <div className="text-[120px] font-black text-gray-100 leading-none select-none">404</div>
      <h1 className="text-2xl font-bold text-gray-800 -mt-4">Página no encontrada</h1>
      <p className="text-gray-500 mt-2 max-w-xs text-sm">
        La URL que buscas no existe o fue movida.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white
          font-semibold rounded-xl shadow-sm hover:bg-brand-700 active:scale-[0.97]
          transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
      >
        <Home className="w-4 h-4" />
        Volver al dashboard
      </button>
    </div>
  )
}
