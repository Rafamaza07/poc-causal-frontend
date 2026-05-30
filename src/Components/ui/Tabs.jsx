/**
 * Tabs — underline style con contador opcional por tab (UI-7).
 * Props:
 *   tabs: Array<{ id, label, count? }>
 *   activeTab: string
 *   onChange: (id) => void
 *   variant: 'underline' | 'pill'  (default: 'underline')
 */
export default function Tabs({ tabs = [], activeTab, onChange, variant = 'underline' }) {
  if (variant === 'pill') {
    return (
      <div className="bg-gray-100 rounded-lg p-1 inline-flex gap-0.5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={[
                'px-3 py-1.5 rounded-md text-sm transition-all duration-150 whitespace-nowrap flex items-center gap-1.5',
                isActive
                  ? 'bg-white shadow-sm font-medium text-gray-900'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {tab.label}
              {tab.count != null && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                  isActive ? 'bg-violet-100 text-violet-700' : 'bg-gray-200 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // underline (default)
  return (
    <div className="border-b border-gray-200 flex gap-0">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors duration-150',
              'border-b-2 -mb-px',
              isActive
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ].join(' ')}
          >
            {tab.label}
            {tab.count != null && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                isActive ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
