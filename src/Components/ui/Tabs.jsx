export default function Tabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className="bg-gray-100 rounded-lg p-1 inline-flex gap-0.5">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              'px-3 py-1.5 rounded-md text-sm transition-all duration-150 whitespace-nowrap',
              isActive
                ? 'bg-white shadow-sm font-medium text-gray-900'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
