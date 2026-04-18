import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Sin datos', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {description && (
        <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">{description}</p>
      )}
    </div>
  )
}
